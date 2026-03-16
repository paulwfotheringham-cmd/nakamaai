"use client";
import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {

const [name,setName]=useState("")
const [email,setEmail]=useState("")
const [submitted,setSubmitted]=useState(false)

function handleSubmit(e:React.FormEvent<HTMLFormElement>){
e.preventDefault()
setSubmitted(true)
}

return(

<div className="min-h-screen bg-[radial-gradient(circle_at_top,_#3a1d2e_0%,_#160f18_35%,_#09080b_100%)] text-white">

<div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8 md:px-10">

<header className="mb-10 flex items-center justify-between">

<div>
<div className="text-xs uppercase tracking-[0.4em] text-[#d8b26e]">
Nakama
</div>

<div className="mt-2 text-2xl font-semibold">
Nakama AI
</div>
</div>

<Link
href="/"
className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition hover:bg-white/10"
>
Back to Home
</Link>

</header>


<div className="grid flex-1 items-center gap-8 lg:grid-cols-[1fr_1fr]">

<section>

<div className="mb-4 inline-flex rounded-full border border-[#d8b26e]/30 bg-[#d8b26e]/10 px-4 py-1 text-sm text-[#f1d7a1]">
Early access
</div>

<h1 className="max-w-xl text-4xl font-semibold leading-tight md:text-6xl">
Join Nakama and create your private audio story space.
</h1>

<p className="mt-6 max-w-lg text-lg leading-8 text-white/70">
Sign up to save your story settings, build your own library, and unlock a more personal storytelling experience.
</p>

</section>


<section className="rounded-[28px] border border-white/10 bg-white/6 p-6 shadow-2xl backdrop-blur-xl">

<h2 className="text-2xl font-semibold">
Create your account
</h2>

<p className="mt-2 text-sm text-white/60">
Start with your name and email address.
</p>


{!submitted ? (

<form onSubmit={handleSubmit} className="mt-6 grid gap-4">

<label className="grid gap-2 text-left">

<span className="text-sm font-medium text-white/80">
Full Name
</span>

<input
className="nakama-input"
type="text"
placeholder="Your full name"
value={name}
onChange={(e)=>setName(e.target.value)}
required
/>

</label>


<label className="grid gap-2 text-left">

<span className="text-sm font-medium text-white/80">
Email Address
</span>

<input
className="nakama-input"
type="email"
placeholder="you@example.com"
value={email}
onChange={(e)=>setEmail(e.target.value)}
required
/>

</label>


<button
type="submit"
className="mt-2 rounded-2xl bg-[#d8b26e] px-6 py-3 font-medium text-black transition hover:bg-[#e7c98c]"
>
Sign Up
</button>

</form>

) : (

<div className="mt-6 rounded-2xl border border-[#d8b26e]/25 bg-[#d8b26e]/10 p-4">

<h3 className="text-lg font-semibold text-[#f1d7a1]">
Signup received
</h3>

<p className="mt-2 text-white/80">
Thanks, {name}. We’ll use <span className="font-medium">{email}</span> for your account setup.
</p>

</div>

)}

</section>

</div>


<style jsx global>{`

.nakama-input{
width:100%;
border-radius:1rem;
border:1px solid rgba(255,255,255,0.1);
background:rgba(255,255,255,0.06);
color:white;
padding:0.9rem 1rem;
outline:none;
}

.nakama-input::placeholder{
color:rgba(255,255,255,0.4);
}

.nakama-input:focus{
border-color:rgba(216,178,110,0.75);
box-shadow:0 0 0 3px rgba(216,178,110,0.14);
}

`}</style>

</div>

</div>

)

}
