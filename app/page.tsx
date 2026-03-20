export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black">
      <div className="w-full max-w-md rounded-2xl bg-zinc-900 p-8 shadow-xl">
        <p className="mb-2 text-xs tracking-widest text-yellow-500">
          GET STARTED
        </p>

        <h1 className="mb-4 text-3xl font-semibold text-white">
          Join Nakama
        </h1>

        <p className="mb-6 text-sm text-zinc-400">
          Create your account and sign up for a subscription or a FREE 7 day trial.
        </p>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full rounded-lg bg-zinc-800 p-3 text-white placeholder-zinc-500 outline-none"
          />

          <input
            type="email"
            placeholder="Email Address"
            className="w-full rounded-lg bg-zinc-800 p-3 text-white placeholder-zinc-500 outline-none"
          />

          <button className="w-full rounded-lg bg-yellow-400 p-3 font-medium text-black hover:bg-yellow-300">
            Create Account
          </button>
        </div>

        <p className="mt-4 text-sm text-zinc-500">
          Already have an account?{" "}
          <span className="cursor-pointer text-yellow-400 hover:underline">
            Log in
          </span>
        </p>
      </div>
    </main>
  );
}
