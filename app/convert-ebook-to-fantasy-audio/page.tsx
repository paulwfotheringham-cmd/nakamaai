"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase-browser";

type UploadedFile = {
  name: string;
  path: string;
  created_at: string | null;
};

export default function ConvertEbookPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingFiles, setIsLoadingFiles] = useState(true);
  const [isConverting, setIsConverting] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadedPath, setUploadedPath] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedForConversion, setSelectedForConversion] = useState("");
  const [audioReady, setAudioReady] = useState("");
  const [currentAudioUrl, setCurrentAudioUrl] = useState("");
  const [currentAudioPath, setCurrentAudioPath] = useState("");

  async function loadFiles() {
    setIsLoadingFiles(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      if (!user) {
        setUploadedFiles([]);
        return;
      }

      const { data, error } = await supabase.storage
        .from("ebooks")
        .list(user.id, {
          limit: 100,
          sortBy: { column: "created_at", order: "desc" },
        });

      if (error) throw error;

      const files: UploadedFile[] =
        data?.map((item) => ({
          name: item.name,
          path: `${user.id}/${item.name}`,
          created_at: item.created_at ?? null,
        })) ?? [];

      setUploadedFiles(files);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingFiles(false);
    }
  }

  useEffect(() => {
    loadFiles();
  }, []);

  async function handleUpload() {
    if (!file) {
      setMessage("Please choose a PDF or EPUB file first.");
      return;
    }

    const fileExt = file.name.split(".").pop()?.toLowerCase();
    const allowed = ["pdf", "epub"];

    if (!fileExt || !allowed.includes(fileExt)) {
      setMessage("Only PDF and EPUB files are allowed.");
      return;
    }

    setIsUploading(true);
    setMessage("");
    setUploadedPath("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error("You must be logged in to upload a file.");

      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const path = `${user.id}/${Date.now()}-${safeName}`;

      const { error } = await supabase.storage
        .from("ebooks")
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType:
            fileExt === "pdf" ? "application/pdf" : "application/epub+zip",
        });

      if (error) throw error;

      setUploadedPath(path);
      setMessage("Upload successful.");
      setFile(null);
      await loadFiles();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleConvertClick(uploadedFile: UploadedFile) {
    setSelectedForConversion(uploadedFile.path);
    setMessage("Starting conversion...");
    setIsConverting(true);
    setAudioReady("");
    setCurrentAudioUrl("");
    setCurrentAudioPath("");

    try {
      const res = await fetch("/api/convert-ebook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ path: uploadedFile.path }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Conversion failed");
      }

      setAudioReady(data.audioPath);
      setMessage("Conversion complete 🎧");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Conversion failed.");
    } finally {
      setIsConverting(false);
    }
  }

  function getExpectedAudioPath(path: string) {
    return path.replace(".epub", ".mp3").replace(".pdf", ".mp3");
  }

  async function handlePlayAudio(uploadedFile: UploadedFile) {
    try {
      setIsLoadingAudio(true);
      setMessage("Loading audio...");

      const audioPath = getExpectedAudioPath(uploadedFile.path);

      const { data, error } = await supabase.storage
        .from("audio")
        .createSignedUrl(audioPath, 60 * 10);

      if (error || !data?.signedUrl) {
        throw new Error("Failed to load audio.");
      }

      setCurrentAudioUrl(data.signedUrl);
      setCurrentAudioPath(audioPath);
      setMessage("Audio ready ▶");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to load audio.");
    } finally {
      setIsLoadingAudio(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#07040d] text-white">
      <a href="/dashboard" className="fixed left-6 top-5 z-50 inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm font-semibold text-white/75 backdrop-blur-md">← Dashboard</a>
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-center text-4xl font-semibold">
          Convert ebook to fantasy audio
        </h1>

        <p className="mt-4 text-center text-zinc-300">
          Upload your ebook and transform it into an immersive fantasy audio
          experience.
        </p>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-8">
          <div className="flex flex-col items-center gap-4">
            <label className="cursor-pointer rounded-xl border border-white/20 bg-white/10 px-6 py-4 text-center transition hover:bg-white/15">
              <span className="block text-lg font-medium">Upload your ebook</span>
              <span className="mt-1 block text-sm text-zinc-400">EPUB or PDF</span>
              <input
                type="file"
                accept=".epub,.pdf,application/epub+zip,application/pdf"
                className="hidden"
                onChange={(e) => {
                  const selected = e.target.files?.[0] ?? null;
                  setFile(selected);
                  setMessage("");
                  setUploadedPath("");
                }}
              />
            </label>

            {file && (
              <p className="text-sm text-zinc-300">Selected: {file.name}</p>
            )}

            <button
              type="button"
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="rounded-xl bg-white px-5 py-3 font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUploading ? "Uploading..." : "Start upload"}
            </button>

            {message && <p className="text-sm text-zinc-300">{message}</p>}

            {uploadedPath && (
              <p className="break-all text-xs text-zinc-500">
                Saved to: ebooks/{uploadedPath}
              </p>
            )}
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-xl font-semibold">Your uploaded ebooks</h2>

          {isLoadingFiles ? (
            <p className="mt-4 text-sm text-zinc-400">Loading uploads...</p>
          ) : uploadedFiles.length === 0 ? (
            <p className="mt-4 text-sm text-zinc-400">
              No uploaded ebooks yet.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {uploadedFiles.map((uploadedFile) => (
                <li
                  key={uploadedFile.path}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-4"
                >
                  <p className="break-all text-sm text-white">
                    {uploadedFile.name}
                  </p>

                  <p className="mt-1 break-all text-xs text-zinc-500">
                    {uploadedFile.path}
                  </p>

                  <button
                    type="button"
                    onClick={() => handleConvertClick(uploadedFile)}
                    className="mt-3 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-500"
                  >
                    Convert ebook to audio
                  </button>

                  {selectedForConversion === uploadedFile.path && (
                    <p className="mt-3 text-xs text-purple-300">
                      Ready to convert this ebook.
                    </p>
                  )}

                  {isConverting && selectedForConversion === uploadedFile.path && (
                    <p className="mt-2 text-xs text-yellow-300">
                      Converting... please wait
                    </p>
                  )}

                  {audioReady === getExpectedAudioPath(uploadedFile.path) && (
                    <button
                      type="button"
                      onClick={() => handlePlayAudio(uploadedFile)}
                      disabled={isLoadingAudio}
                      className="mt-3 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isLoadingAudio && currentAudioPath === getExpectedAudioPath(uploadedFile.path)
                        ? "Loading audio..."
                        : "Play audio"}
                    </button>
                  )}

                  {currentAudioUrl &&
                    currentAudioPath === getExpectedAudioPath(uploadedFile.path) && (
                      <div className="mt-4">
                        <audio controls className="w-full">
                          <source src={currentAudioUrl} type="audio/mpeg" />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
