"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-browser";

export default function ConvertEbookPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadedPath, setUploadedPath] = useState("");

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

      if (userError) {
        throw userError;
      }

      if (!user) {
        throw new Error("You must be logged in to upload a file.");
      }

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

      if (error) {
        throw error;
      }

      setUploadedPath(path);
      setMessage("Upload successful.");
    } catch (error) {
      const text =
        error instanceof Error ? error.message : "Upload failed.";
      setMessage(text);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#07040d] text-white">
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="text-4xl font-semibold">
          Convert ebook to fantasy audio
        </h1>

        <p className="mt-4 text-zinc-300">
          Upload your ebook and transform it into an immersive fantasy audio
          experience.
        </p>

        <div className="mt-10">
          <label className="inline-block cursor-pointer rounded-xl border border-white/20 bg-white/5 px-6 py-4 transition hover:bg-white/10">
            <span className="block text-lg font-medium">
              Upload your ebook
            </span>
            <span className="mt-1 block text-sm text-zinc-400">
              EPUB or PDF
            </span>

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
            <p className="mt-4 text-sm text-zinc-300">
              Selected: {file.name}
            </p>
          )}

          <button
            type="button"
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="mt-6 rounded-xl bg-white px-5 py-3 font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUploading ? "Uploading..." : "Start upload"}
          </button>

          {message && (
            <p className="mt-4 text-sm text-zinc-300">{message}</p>
          )}

          {uploadedPath && (
            <p className="mt-2 break-all text-xs text-zinc-500">
              Saved to: ebooks/{uploadedPath}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
