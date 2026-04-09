---
title: "Presentation title"
subtitle: "Subtitle or one-line framing"
duration: "Adjust in frontmatter as needed"
source: "story.md"
note: "Each ## is one slide. Top-level `-` bullets are main topics; indent with two spaces + `-` for subtopics (Markdown nested list)."
---

# Suggested deck title (tooling)

**Presentation title** — *Subtitle or one-line framing*

---

## Opening

- Replace this slide with your hook and thesis
- Add bullets; use **`<!-- slide-max-level: N -->`** above `##` to cap depth in the Slides.com export (see below)

## Main section (example)

- First main point
  - Sub-point
- Second main point

## Closing

- Recap and call to action
- **Thank you** / **Questions**

---

## Optional: shorter deck

Merge or drop slides to match time; renumber in your notes only — file order defines export order.

---

## Build Slides.com export (Node)

- **`npm run present:slides-com`** → **`dist/presentation-slides-com.md`** — [Reveal.js-style](https://revealjs.com/markdown/) Markdown for [Slides.com’s Markdown → deck](https://slides.com/tools/markdown-to-presentation) importer (slides separated by `---`). **Speaker notes are omitted** in this path (Slides.com does not carry them reliably); use **`story.md`** / this outline when presenting. Source: **`scripts/export-slides-com.mjs`** + **`scripts/parse-outline.mjs`** — each **`## Title`** in file order is one slide; top-level `-` and `  -` nested lists (two spaces per level).
- Optional YAML: **`title`** / **`subtitle`** in frontmatter (or **`deckTitle`** / **`deckSubtitle`**) for the exported title slide.

### Hidden comments (Markdown viewers) + on-slide depth (Slides.com export)

- Use **HTML comments** — they are omitted in GitHub, VS Code preview, and many static generators: `<!-- your note -->`
- **Multiline** `<!--` … `-->` **blocks** (where the opening line has no `-->` yet) **exclude** everything inside — including **`##` slides** — from the Slides.com export. Use this to comment out whole slides while keeping them in the source file.
- **`<!-- slide-max-level: N -->`** (single line, opens and closes on the same line) caps how many bullet indent levels appear **in the Slides.com export** (deeper lines stay in this outline only). Legacy name **`pptx-max-level`** is still accepted by the parser.
  - On the line **above** your real `## Title` heading, add: `<!-- slide-max-level: 0 -->` (or `1`, `2`, …).
  - Do **not** put a fake `## …` slide heading inside a code sample in this file — the export script treats any matching line as a slide.
- **`slide-max-level: 0`** — only **top-level** bullets on the slide (indent level `0`).
- **`slide-max-level: 1`** — levels **0** and **1** (top + one sub-level).
- Omit the comment → **all** levels (up to the script cap) go on the slide.
- Put the comment **on the line above** `## Title`, or on its **own line** after the heading **before** the first `-` bullet.
- Any other one-line `<!-- ... -->` is ignored by the export script (safe for reminders).
