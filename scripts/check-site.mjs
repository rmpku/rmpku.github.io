import { access, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const required = [
  "index.html",
  "styles.css",
  "script.js",
  "favicon.svg",
  ".nojekyll",
  "assets/scholar-citations.png",
  "assets/profile.png",
  "assets/logos/pku.png",
  "assets/logos/nxu.png",
  "assets/logos/ncepu.png",
  "assets/logos/ucas.svg",
  "assets/logos/ikingtec.svg",
  "scripts/update-scholar-snapshot.mjs",
  ".github/workflows/update-scholar-snapshot.yml",
];

await Promise.all(required.map((path) => access(join(root, path))));

const [html, css] = await Promise.all([
  readFile(join(root, "index.html"), "utf8"),
  readFile(join(root, "styles.css"), "utf8"),
]);
const publicationCount = (html.match(/<article class="publication reveal"/g) || []).length;
if (publicationCount !== 13) {
  throw new Error(`Expected 13 publications, found ${publicationCount}`);
}

const journalCount = (html.match(/data-type="journal"/g) || []).length;
const conferenceCount = (html.match(/data-type="conference"/g) || []).length;
if (journalCount !== 9 || conferenceCount !== 4) {
  throw new Error(`Expected 9 journals and 4 conferences, found ${journalCount} and ${conferenceCount}`);
}

const publicationBlock = html.match(
  /<div class="publication-list"[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/,
)?.[0];
if (!publicationBlock) throw new Error("Publication list was not found");
if (/\b(under review|submitted|审稿中|投稿中)\b/i.test(publicationBlock)) {
  throw new Error("Publication list includes a submitted or under-review entry");
}

for (const id of ["about", "research", "publications", "experience", "honors", "service"]) {
  if (!html.includes(`id="${id}"`)) throw new Error(`Missing section #${id}`);
}

for (const href of [
  "assets/scholar-citations.png",
  "assets/profile.png",
  "styles.css",
  "script.js",
]) {
  if (!html.includes(`href="${href}"`) && !html.includes(`src="${href}"`)) {
    throw new Error(`Missing reference to ${href}`);
  }
}

if (/\.(pdf|docx)\b|assets\/cv-/i.test(html)) {
  throw new Error("The page still exposes a CV or document attachment");
}

for (const url of [
  "https://www.ai.pku.edu.cn/info/1139/2918.htm",
  "https://liuziwei7.github.io/",
]) {
  if (!html.includes(url)) throw new Error(`Missing advisor homepage: ${url}`);
}

if (html.includes("张尚航") || !html.includes("仉尚航")) {
  throw new Error("The Chinese spelling of 仉尚航 is missing or incorrect");
}

if (html.includes("assets/terminal-garden.svg")) {
  throw new Error("The removed flower artwork is still referenced");
}

if ((html.match(/class="timeline chronological-timeline"/g) || []).length !== 1) {
  throw new Error("Experience and education must use one chronological timeline");
}

if ((html.match(/class="[^"]*external-link[^"]*"/g) || []).length < 6) {
  throw new Error("Advisor links must use icon-only external-link styling");
}

if (!html.includes('class="email-link"') || !css.includes("text-transform: none")) {
  throw new Error("Lowercase email rendering is not protected");
}

if (!css.includes("white-space: nowrap")) {
  throw new Error("Long English section headings are not protected from wrapping");
}

console.log("PASS: content, portrait, timeline, advisor links, email, and publications validated");
