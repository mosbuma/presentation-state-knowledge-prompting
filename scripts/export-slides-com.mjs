#!/usr/bin/env node
/**
 * presentation-outline.md → Reveal.js-style Markdown for Slides.com
 * https://slides.com/tools/markdown-to-presentation
 *
 * Slides: separated by --- on its own line. No speaker notes (Slides.com import does not support them).
 * Slide body respects <!-- slide-max-level: N --> (legacy: pptx-max-level); trimmed bullets exist only in the source outline / story.md.
 *
 * Usage:
 *   node scripts/export-slides-com.mjs
 *   node scripts/export-slides-com.mjs path/to/outline.md path/to/out.md
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseSlides, filterBulletsForSlide } from "./parse-outline.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const DEFAULT_MD = path.join(ROOT, "presentation-outline.md");
const DEFAULT_OUT = path.join(ROOT, "dist", "presentation-slides-com.md");

const MD_PATH = path.resolve(ROOT, process.argv[2] || DEFAULT_MD);
const OUT_MD = path.resolve(ROOT, process.argv[3] || DEFAULT_OUT);

function bulletsToMarkdown(bullets) {
  if (!bullets.length) return "_—_";
  return bullets.map(({ raw, level }) => `${"  ".repeat(level)}- ${raw}`).join("\n");
}

function slideBlock(headingLine, bulletsMd) {
  return [headingLine, "", bulletsMd].join("\n");
}

function build() {
  const md = fs.readFileSync(MD_PATH, "utf8");
  const { slides, meta } = parseSlides(md);

  if (!slides.length) {
    console.error("No slides found (expected ## Title slide headers).");
    process.exit(1);
  }

  const deckTitle =
    meta.deckTitle || meta.title || "Presentation title";
  const deckSubtitle =
    meta.deckSubtitle || meta.subtitle || "Subtitle";

  const headerComment = `<!-- Generated for Slides.com (Reveal.js markdown). Source: ${path.relative(ROOT, MD_PATH)} — run: npm run present:slides-com -->`;

  const titleSlide = [
    headerComment,
    "",
    `# ${deckTitle}`,
    "",
    `## ${deckSubtitle}`,
  ].join("\n");

  const contentSlides = slides.map(({ title, bullets, maxLevel }) => {
    const heading = `## ${title}`;
    const bulletsOnSlide = filterBulletsForSlide(bullets, maxLevel);
    const bulletsMd = bulletsToMarkdown(bulletsOnSlide);
    return slideBlock(heading, bulletsMd);
  });

  const out = [titleSlide, ...contentSlides].join("\n\n---\n\n") + "\n";

  const outDir = path.dirname(OUT_MD);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(OUT_MD, out, "utf8");
  console.log(
    `Wrote Slides.com markdown (${slides.length + 1} slides incl. title) → ${OUT_MD}`
  );
}

build();
