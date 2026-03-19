"use client";

import { useState } from "react";

export default function ConvertEbookPage() {
  const [file, setFile] = useState<File | null>(null);

  return (
    <main className="min-h-screen bg-[#07040d] text-white">
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="text-4xl font-semibold">
          Convert ebook to fantasy audio
        </h1>

        <p className="mt-4 text-zinc-300">
          Upload your ebook and transform it into an immersive fantasy audio experience.
        </p>

        <div className="mt-10">
          <label className="cursor-pointer rounded-xl border border-white/20 bg-white/5 px-6 py-4 hover:bg-white/10 transition">
            <span className="block text-lg font-medium">
              Upload your ebook
            </span>
            <span className="block text-sm text-zinc-400 mt-1">
              EPUB or PDF
            </span>

            <input
              type="file"
              accept=".epub,.pdf"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setFile(e.target.files[0]);
                }
              }}
            />
          </label>

          {file && (
            <p className="mt-4 text-sm text-zinc-400">
              Selected: {file.name}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
