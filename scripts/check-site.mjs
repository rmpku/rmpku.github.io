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
  "assets/cv-en.pdf",
  "assets/cv-zh.docx",
];

await Promise.all(required.map((path) => access(join(root, path))));

const html = await readFile(join(root, "index.html"), "utf8");
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

for (const href of ["assets/cv-en.pdf", "assets/cv-zh.docx", "styles.css", "script.js"]) {
  if (!html.includes(`href="${href}"`) && !html.includes(`src="${href}"`)) {
    throw new Error(`Missing reference to ${href}`);
  }
}

console.log("PASS: 13 accepted/published papers; links and required sections validated");
