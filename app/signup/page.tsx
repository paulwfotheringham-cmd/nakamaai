"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e:any){
    e.preventDefault()

    const { error } = await supabase.from("users").insert([
      {
        name,
        email
      }
    ])

    if(error){
      alert("Error saving user")
      return
    }

    setSubmitted(true)
  }

  return (

<div className="min-h-screen flex items-center justify-center bg-black text-white">

<div className="max-w-xl w-full p-10">

<h1 className="text-4xl font-bold mb-8">
Join Nakama
</h1>

{!submitted ? (

<form onSubmit={handleSubmit} className="space-y-4">

<input
className="w-full p-3 rounded bg-gray-900"
placeholder="Full Name"
value={name}
onChange={(e)=>setName(e.target.value)}
/>

<input
className="w-full p-3 rounded bg-gray-900"
placeholder="Email Address"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<button
className="w-full p-3 rounded bg-yellow-500 text-black font-bold"
>
Sign Up
</button>

</form>

) : (

<div className="text-green-400">
Signup saved successfully
</div>

)}

</div>

</div>

  )
}
