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
  "assets/logos/pku-seal.svg",
  "assets/logos/nxu.png",
  "assets/logos/ncepu.png",
  "assets/logos/ucas.svg",
  "assets/logos/ikingtec.svg",
  "scripts/update-scholar-snapshot.mjs",
  ".github/workflows/update-scholar-snapshot.yml",
  "assets/research/embodied-safety.png",
  "assets/research/multimodal-trust.png",
  "assets/research/copyright-authentication.png",
  "assets/research/content-traceability.png",
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

for (const id of ["about", "research", "publications", "patents", "experience", "honors", "service"]) {
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

if ((html.match(/class="research-visual"/g) || []).length !== 4) {
  throw new Error("Expected four Research Interests visuals");
}

if ((html.match(/class="publication-figure"/g) || []).length !== 13) {
  throw new Error("Expected one replaceable figure slot for every publication");
}

if ((html.match(/class="publication-title-link"/g) || []).length !== 13) {
  throw new Error("Expected one publication link for every paper");
}

if ((html.match(/class="patent-card reveal"/g) || []).length !== 7) {
  throw new Error("Expected seven authorized patent cards");
}

for (const patent of [
  "CN112132747B",
  "CN111563938B",
  "CN111526261B",
  "CN110942413B",
  "CN110728164B",
  "CN110360924B",
  "CN110308117B",
]) {
  if (!html.includes(patent)) throw new Error(`Missing authorized patent: ${patent}`);
}

if (/CN(?:112132747|111563938|111526261|110942413|110728164|110360924|110308117)A\b/.test(html)) {
  throw new Error("Authorized patents must use grant publication numbers ending in B");
}

for (const url of [
  "https://eecs.pku.edu.cn/xxkxjsxy/info/1503/6701.htm",
  "https://people.ucas.ac.cn/~sys",
]) {
  if (!html.includes(url)) throw new Error(`Missing advisor homepage: ${url}`);
}

if (!html.includes('class="hero-portrait"') || html.includes('class="about-profile"')) {
  throw new Error("The portrait must appear beside the hero name, not in About");
}

if (!/class="[^"]*integrated-profile[^"]*"/.test(html) || !html.includes('id="experience"')) {
  throw new Error("About and Experience must be integrated in one early section");
}

const logoRule = css.match(/\.timeline-logo\s*\{([\s\S]*?)\}/)?.[1] || "";
const logoImageRule = css.match(/\.timeline-logo img\s*\{([\s\S]*?)\}/)?.[1] || "";
if (/\bbackground\s*:|\bfilter\s*:/.test(logoRule + logoImageRule)) {
  throw new Error("Timeline logos must not receive a background or color filter");
}

console.log("PASS: integrated profile, visuals, links, logos, Scholar, and publications validated");
