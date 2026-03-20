export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="w-full max-w-md rounded-2xl bg-zinc-900 p-8 shadow-lg">
        <p className="text-xs tracking-widest text-yellow-500 mb-2">
          GET STARTED
        </p>

        <h1 className="text-3xl font-bold mb-4">Join Nakama</h1>

        <p className="text-zinc-400 mb-6">
          create your account and sign up for a subscription or a FREE 7 day trial
        </p>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full rounded-lg bg-zinc-800 p-3 outline-none"
          />

          <input
            type="email"
            placeholder="Email Address"
            className="w-full rounded-lg bg-zinc-800 p-3 outline-none"
          />

          <button className="w-full rounded-lg bg-yellow-400 p-3 font-semibold text-black">
            Create Account
          </button>
        </div>

        <p className="mt-4 text-sm text-zinc-500">
          Already have an account?{" "}
          <span className="text-yellow-400 cursor-pointer">Log in</span>
        </p>
      </div>
    </div>
  );
}
