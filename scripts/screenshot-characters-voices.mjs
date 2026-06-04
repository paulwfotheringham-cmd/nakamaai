import { chromium } from "playwright";
import { mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "screenshots");
const url =
  process.env.SCREENSHOT_URL ??
  "https://nakamanights.com/live-test?nav=character-voices";

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: "networkidle", timeout: 120000 });
await page.waitForSelector(".cv-head-title", { timeout: 60000 });
await page.waitForTimeout(1500);

await page.screenshot({
  path: path.join(outDir, "characters-voices.png"),
  fullPage: true,
});

await page.screenshot({
  path: path.join(outDir, "characters-voices-hero.png"),
  fullPage: false,
});

await browser.close();
console.log("Saved:", path.join(outDir, "characters-voices.png"));
