"use client";
import { useEffect, useMemo, useRef, useState } from "react";

type BrowserVoice = SpeechSynthesisVoice;

export default function Home() {

const [setting,setSetting]=useState("office")
const [mood,setMood]=useState("romantic")
const [buildUp,setBuildUp]=useState("slow burn")
const [maleRole,setMaleRole]=useState("boss")
const [femaleRole,setFemaleRole]=useState("assistant")
const [storyType,setStoryType]=useState("romantic encounter")
const [extraDetail,setExtraDetail]=useState("")
const [story,setStory]=useState("")

const [voices,setVoices]=useState<BrowserVoice[]>([])
const [narratorVoice,setNarratorVoice]=useState("")
const [maleVoice,setMaleVoice]=useState("")
const [femaleVoice,setFemaleVoice]=useState("")

const speechTimeouts=useRef<number[]>([])

async function generateStory(){

const response=await fetch("/api/story",{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({
setting,
mood,
buildUp,
maleRole,
femaleRole,
storyType,
extraDetail
})
})

const data=await response.json()
setStory(data.story)

}

function cleanVoiceName(name:string){
return name.replace("Microsoft ","").replace("Google ","").split(" - ")[0].trim()
}

const englishVoices=useMemo(()=>{
return voices.filter(v=>v.lang.toLowerCase().startsWith("en"))
},[voices])

useEffect(()=>{

function loadVoices(){

const all=window.speechSynthesis.getVoices()
setVoices(all)

const english=all.filter(v=>v.lang.toLowerCase().startsWith("en"))
if(english.length===0)return

setNarratorVoice(english[0].name)
setMaleVoice(english[1]?.name||english[0].name)
setFemaleVoice(english[2]?.name||english[0].name)

}

loadVoices()
window.speechSynthesis.onvoiceschanged=loadVoices

return()=>{
window.speechSynthesis.onvoiceschanged=null
}

},[])

function speakStory(){

window.speechSynthesis.cancel()

speechTimeouts.current.forEach(id=>clearTimeout(id))
speechTimeouts.current=[]

const lines=story.split("\n").map(l=>l.trim()).filter(Boolean)

let delay=0

lines.forEach(line=>{

let text=line
let voiceName=narratorVoice

if(line.startsWith("MALE:")){
text=line.replace("MALE:","").trim()
voiceName=maleVoice
}

if(line.startsWith("FEMALE:")){
text=line.replace("FEMALE:","").trim()
voiceName=femaleVoice
}

if(line.startsWith("NARRATOR:")){
text=line.replace("NARRATOR:","").trim()
voiceName=narratorVoice
}

const utterance=new SpeechSynthesisUtterance(text)

const matched=englishVoices.find(v=>v.name===voiceName)

if(matched){
utterance.voice=matched
utterance.lang=matched.lang
}else{
utterance.lang="en-US"
}

utterance.rate=0.95

const timeoutId=window.setTimeout(()=>{
window.speechSynthesis.speak(utterance)
},delay)

speechTimeouts.current.push(timeoutId)

delay+=text.length*60+1200

})

}

function stopStory(){
window.speechSynthesis.cancel()
speechTimeouts.current.forEach(id=>clearTimeout(id))
speechTimeouts.current=[]
}

return(

<div className="min-h-screen bg-gradient-to-b from-[#120b12] via-[#1b1119] to-black text-white flex items-center justify-center">

<div className="max-w-4xl w-full p-8">

<h1 className="text-4xl font-semibold mb-2 text-center">
Nakama AI
</h1>

<p className="text-center text-white/60 mb-8">
Create personalized romantic audio stories
</p>

<div className="grid gap-4 bg-white/5 border border-white/10 p-6 rounded-2xl">

<label>Setting</label>
<select className="nakama-input" value={setting} onChange={e=>setSetting(e.target.value)}>
<option>office</option>
<option>café</option>
<option>beach</option>
<option>hotel</option>
<option>city penthouse</option>
</select>

<label>Mood</label>
<select className="nakama-input" value={mood} onChange={e=>setMood(e.target.value)}>
<option>romantic</option>
<option>playful</option>
<option>intense</option>
<option>dramatic</option>
<option>tender</option>
</select>

<label>Build Up</label>
<select className="nakama-input" value={buildUp} onChange={e=>setBuildUp(e.target.value)}>
<option>slow burn</option>
<option>medium pace</option>
<option>instant spark</option>
</select>

<label>Male Character</label>
<select className="nakama-input" value={maleRole} onChange={e=>setMaleRole(e.target.value)}>
<option>boss</option>
<option>stranger</option>
<option>chef</option>
<option>artist</option>
<option>billionaire</option>
</select>

<label>Female Character</label>
<select className="nakama-input" value={femaleRole} onChange={e=>setFemaleRole(e.target.value)}>
<option>assistant</option>
<option>traveler</option>
<option>writer</option>
<option>singer</option>
<option>entrepreneur</option>
</select>

<label>Story Type</label>
<select className="nakama-input" value={storyType} onChange={e=>setStoryType(e.target.value)}>
<option>romantic encounter</option>
<option>forbidden romance</option>
<option>reunion</option>
<option>enemies to lovers</option>
<option>late night confession</option>
</select>

<label>Extra Detail</label>
<input
className="nakama-input"
placeholder="Optional custom detail"
value={extraDetail}
onChange={e=>setExtraDetail(e.target.value)}
/>

<button
className="bg-[#d6b06b] text-black p-3 rounded-xl font-medium mt-2"
onClick={generateStory}
>
Generate Story
</button>

{story &&(

<div className="mt-6">

<h2 className="text-xl font-semibold mb-3">Your Story</h2>

<p className="whitespace-pre-line text-white/80 leading-7">
{story}
</p>

<div className="flex gap-3 mt-4">

<button
className="bg-[#d6b06b] text-black px-4 py-2 rounded-lg"
onClick={speakStory}
>
🔊 Listen
</button>

<button
className="border border-white/20 px-4 py-2 rounded-lg"
onClick={stopStory}
>
Stop
</button>

</div>

</div>

)}

</div>

</div>

<style jsx global>{`

.nakama-input{
width:100%;
padding:12px;
border-radius:12px;
background:rgba(255,255,255,0.06);
border:1px solid rgba(255,255,255,0.1);
color:white;
}

.nakama-input option{
color:black;
}

`}</style>

</div>

)

}
