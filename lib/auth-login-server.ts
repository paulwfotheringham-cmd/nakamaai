import { NAKAMA_LOGIN_EMAIL } from "@/lib/auth-login";

function demoUsername(): string {
  return (process.env.NAKAMA_DEMO_USER || "nakama").trim().toLowerCase();
}

function demoPassword(): string {
  return process.env.NAKAMA_DEMO_PASSWORD || "Supercamp3000";
}

export function verifyDemoLogin(identifier: string, password: string): boolean {
  const id = identifier.trim().toLowerCase();
  const userOk =
    id === demoUsername() ||
    id === NAKAMA_LOGIN_EMAIL.toLowerCase() ||
    id === `${demoUsername()}@nakamanights.com`;
  return userOk && password === demoPassword();
}
