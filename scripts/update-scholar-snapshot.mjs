import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const output = join(root, "assets", "scholar-citations.png");
const profile =
  "https://scholar.google.com.hk/citations?user=IJTYZlUAAAAJ&hl=en";

await mkdir(dirname(output), { recursive: true });
const browser = await chromium.launch({ headless: true });

try {
  const page = await browser.newPage({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 1,
  });
  await page.goto(profile, { waitUntil: "domcontentloaded", timeout: 60_000 });

  if ((await page.title()).toLowerCase().includes("sorry")) {
    throw new Error("Google Scholar returned an automated-traffic challenge");
  }

  const panel = page.locator("#gsc_rsb_cit");
  await panel.waitFor({ state: "visible", timeout: 30_000 });
  await panel.screenshot({ path: output });
  console.log(`Updated ${output}`);
} finally {
  await browser.close();
}
