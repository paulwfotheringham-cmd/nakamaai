export default function ConvertEbookPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
            Convert ebook to fantasy audio
          </h1>
          <p className="mt-3 text-zinc-600">
            Upload your ebook and transform it into an immersive fantasy audio experience.
          </p>
        </div>

        <div className="rounded-3xl border border-zinc-200 p-8 shadow-sm">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-4 text-5xl">📖</div>

            <h2 className="text-lg font-medium text-zinc-900">
              Upload your ebook
            </h2>

            <p className="mt-2 text-sm text-zinc-600">
              Supported formats: PDF, EPUB (more coming soon)
            </p>

            <input
              type="file"
              accept=".pdf,.epub"
              className="mt-6 block w-full max-w-sm cursor-pointer rounded-lg border border-zinc-300 p-2 text-sm"
            />

            <button
              className="mt-6 rounded-xl bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              Convert to fantasy audio
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
