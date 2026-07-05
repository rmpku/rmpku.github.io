import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const output = join(root, "assets", "scholar-citations.png");
const statsOutput = join(root, "assets", "scholar-stats.json");
const profile =
  "https://scholar.google.com.hk/citations?user=IJTYZlUAAAAJ&hl=en";

await mkdir(dirname(output), { recursive: true });
const browser = await chromium.launch({ headless: true });

try {
  const page = await browser.newPage({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 2,
  });
  await page.goto(profile, { waitUntil: "domcontentloaded", timeout: 60_000 });

  if ((await page.title()).toLowerCase().includes("sorry")) {
    throw new Error("Google Scholar returned an automated-traffic challenge");
  }

  const panel = page.locator("#gsc_rsb_cit");
  await panel.waitFor({ state: "visible", timeout: 30_000 });
  const citationsText = await panel.locator(".gsc_rsb_std").first().innerText();
  const citations = Number.parseInt(citationsText.replaceAll(",", ""), 10);
  if (!Number.isInteger(citations) || citations < 0) {
    throw new Error(`Could not parse the Google Scholar citation count: ${citationsText}`);
  }

  await panel.screenshot({ path: output });
  await writeFile(
    statsOutput,
    `${JSON.stringify(
      {
        citations,
        updatedAt: new Date().toISOString().slice(0, 10),
      },
      null,
      2,
    )}\n`,
  );
  console.log(`Updated ${output} and ${statsOutput}`);
} finally {
  await browser.close();
}
