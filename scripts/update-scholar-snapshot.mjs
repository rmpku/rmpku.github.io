import { access, mkdir, rename, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const output = join(root, "assets", "scholar-citations.png");
const statsOutput = join(root, "assets", "scholar-stats.json");
const temporaryOutput = join(dirname(output), ".scholar-citations.tmp.png");
const temporaryStatsOutput = `${statsOutput}.tmp`;
const scholarId = "IJTYZlUAAAAJ";
const defaultProfiles = [
  `https://scholar.google.com/citations?user=${scholarId}&hl=en`,
  `https://scholar.google.com.hk/citations?user=${scholarId}&hl=en`,
];
const profiles = process.env.SCHOLAR_PROFILE_URL
  ? [process.env.SCHOLAR_PROFILE_URL]
  : defaultProfiles;
const attemptsPerProfile = 2;

await mkdir(dirname(output), { recursive: true });
const browser = await chromium.launch({ headless: true });

try {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 2,
    locale: "en-US",
    userAgent:
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  });
  let updated = false;
  let lastError = new Error("No Google Scholar profile URL was attempted");

  for (const profile of profiles) {
    for (let attempt = 1; attempt <= attemptsPerProfile; attempt += 1) {
      const page = await context.newPage();

      try {
        await page.goto(profile, { waitUntil: "domcontentloaded", timeout: 60_000 });

        const title = (await page.title()).toLowerCase();
        if (title.includes("sorry") || page.url().includes("/sorry/")) {
          throw new Error("Google Scholar returned an automated-traffic challenge");
        }

        const panel = page.locator("#gsc_rsb_cit");
        await panel.waitFor({ state: "visible", timeout: 30_000 });
        const citationsText = await panel.locator(".gsc_rsb_std").first().innerText();
        const citations = Number.parseInt(citationsText.replaceAll(",", ""), 10);
        if (!Number.isInteger(citations) || citations < 0) {
          throw new Error(
            `Could not parse the Google Scholar citation count: ${citationsText}`,
          );
        }

        await panel.screenshot({ path: temporaryOutput });
        await writeFile(
          temporaryStatsOutput,
          `${JSON.stringify(
            {
              citations,
              updatedAt: new Date().toISOString().slice(0, 10),
            },
            null,
            2,
          )}\n`,
        );
        await rename(temporaryOutput, output);
        await rename(temporaryStatsOutput, statsOutput);
        console.log(`Updated ${output} and ${statsOutput} from ${profile}`);
        updated = true;
        break;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.warn(
          `Scholar attempt ${attempt}/${attemptsPerProfile} failed for ${profile}: ` +
            lastError.message,
        );
      } finally {
        await page.close();
      }
    }

    if (updated) {
      break;
    }
  }

  if (!updated) {
    await rm(temporaryOutput, { force: true });
    await rm(temporaryStatsOutput, { force: true });

    try {
      await Promise.all([access(output), access(statsOutput)]);
    } catch {
      throw new Error(
        `Scholar refresh failed and no previous snapshot is available: ${lastError.message}`,
      );
    }

    console.warn(
      "::warning title=Google Scholar refresh skipped::" +
        `${lastError.message}. The existing citation snapshot and count were preserved.`,
    );
    console.log("Scholar refresh skipped; keeping the last successful snapshot.");
  }
} finally {
  await browser.close();
}
