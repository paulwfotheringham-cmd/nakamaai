import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (err) => errors.push(String(err)));
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});

await page.goto("http://localhost:3000/live-test", { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(5000);

console.log("ERRORS:", errors.length ? errors.join("\n---\n") : "(none)");
console.log("TITLE:", await page.title());
console.log("BODY SNippet:", (await page.textContent("body"))?.slice(0, 200));

await browser.close();
