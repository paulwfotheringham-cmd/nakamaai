"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase-browser";

type UploadedFile = {
  name: string;
  path: string;
  created_at?: string;
};

export default function ConvertEbookPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingFiles, setIsLoadingFiles] = useState(true);
  const [message, setMessage] = useState("");
  const [uploadedPath, setUploadedPath] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

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

      const files =
        data?.map((item) => ({
          name: item.name,
          path: `${user.id}/${item.name}`,
          created_at: item.created_at,
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

  return (
    <main className="min-h-screen bg-[#07040d] text-white">
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
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <p className="break-all text-sm text-white">
                    {uploadedFile.name}
                  </p>
                  <p className="mt-1 break-all text-xs text-zinc-500">
                    {uploadedFile.path}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
