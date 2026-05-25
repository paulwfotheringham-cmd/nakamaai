import OpenAI from "openai";
import { getOpenAIApiKey } from "@/lib/openai/config";

export const LIVE_TEST_SYSTEM_PROMPT =
  "You are a helpful male AI concierge for Nakama Nights. Be warm, concise, and natural. Keep replies to 1-3 short sentences suitable for spoken delivery. No markdown.";

function unquoteEnv(value: string | undefined): string | null {
  if (!value?.trim()) return null;
  const v = value.trim().replace(/^["']|["']$/g, "").trim();
  return v || null;
}

export function getGroqApiKey(): string | null {
  return unquoteEnv(process.env.GROQ_API_KEY);
}

function getCartesiaApiKey(): string | null {
  return unquoteEnv(process.env.CARTESIA_API_KEY);
}

function getCartesiaDonnyVoiceId(): string {
  return (
    unquoteEnv(process.env.CARTESIA_PREVIEW_DONNY_ID) ||
    unquoteEnv(process.env.CARTESIA_VOICE_DONNY) ||
    "d46abd1d-9f16-4e59-b5e1-8d4c4d2c8f6c"
  );
}

export function hasLiveTestLlm(): boolean {
  return Boolean(getOpenAIApiKey() || getGroqApiKey());
}

export function hasLiveTestTts(): boolean {
  return Boolean(getOpenAIApiKey() || getCartesiaApiKey());
}

/** Downsample mono PCM16 24kHz → 16kHz (Simli expects 16kHz PCM16). */
export function downsamplePcm24kTo16k(pcm24: Buffer): Buffer {
  const samples24 = new Int16Array(
    pcm24.buffer,
    pcm24.byteOffset,
    pcm24.byteLength / 2,
  );
  const ratio = 24000 / 16000;
  const outLen = Math.floor(samples24.length / ratio);
  const out = new Int16Array(outLen);
  for (let i = 0; i < outLen; i++) {
    out[i] = samples24[Math.floor(i * ratio)] ?? 0;
  }
  return Buffer.from(out.buffer, out.byteOffset, out.byteLength);
}

export async function streamLiveTestChat(message: string): Promise<ReadableStream<Uint8Array>> {
  const openaiKey = getOpenAIApiKey();
  const groqKey = getGroqApiKey();

  if (!openaiKey && !groqKey) {
    throw new Error("NO_LLM_CONFIGURED");
  }

  const client = openaiKey
    ? new OpenAI({ apiKey: openaiKey })
    : new OpenAI({ apiKey: groqKey!, baseURL: "https://api.groq.com/openai/v1" });

  const model = openaiKey ? "gpt-4o-mini" : "llama-3.3-70b-versatile";

  const completion = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: LIVE_TEST_SYSTEM_PROMPT },
      { role: "user", content: message },
    ],
    temperature: 0.7,
    max_tokens: 200,
    stream: true,
  });

  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      try {
        let full = "";
        for await (const chunk of completion) {
          const delta = chunk.choices[0]?.delta?.content ?? "";
          if (delta) {
            full += delta;
            controller.enqueue(encoder.encode(delta));
          }
        }
        if (!full.trim()) {
          controller.enqueue(
            encoder.encode("I'm here to help. What would you like to know?"),
          );
        }
        controller.close();
      } catch (e) {
        controller.error(e);
      }
    },
  });
}

export async function synthesizeLiveTestPcm16(text: string): Promise<Uint8Array> {
  const openaiKey = getOpenAIApiKey();
  if (openaiKey) {
    const openai = new OpenAI({ apiKey: openaiKey });
    const speech = await openai.audio.speech.create({
      model: "tts-1",
      voice: "onyx",
      input: text.slice(0, 4096),
      response_format: "pcm",
    });
    const pcm24 = Buffer.from(await speech.arrayBuffer());
    const pcm16 = downsamplePcm24kTo16k(pcm24);
    return new Uint8Array(pcm16);
  }

  const cartesiaKey = getCartesiaApiKey();
  if (!cartesiaKey) {
    throw new Error("NO_TTS_CONFIGURED");
  }

  const res = await fetch("https://api.cartesia.ai/tts/bytes", {
    method: "POST",
    headers: {
      "X-API-Key": cartesiaKey,
      "Cartesia-Version": "2025-04-16",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model_id: "sonic-3",
      transcript: text.slice(0, 4096),
      language: "en",
      voice: { mode: "id", id: getCartesiaDonnyVoiceId() },
      output_format: {
        container: "raw",
        encoding: "pcm_s16le",
        sample_rate: 16000,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    throw new Error(err || `Cartesia TTS failed (${res.status})`);
  }

  return new Uint8Array(await res.arrayBuffer());
}
