---
title: "State, knowledge & interaction in a VR heritage experience"
subtitle: "Immersive Utrecht City Hall — explorations and first implementation"
duration: "~40 minutes (including discussion)"
source: "story.md"
note: "Each ## is one slide. Top-level `-` bullets are main topics; indent with two spaces + `-` for subtopics (Markdown nested list)."
---

# Suggested deck title (tooling)

**State, knowledge & interaction in a VR heritage experience** — *Immersive Utrecht City Hall*

---

## Opening

- **Navigable VR** panoramas of Utrecht **City Hall** across **time**
- Users **move** between **places** and **eras**, look around, and **converse** with the system
- This talk: what we are building, how we treat **state** and **knowledge** in v1 — and what comes next for **prompting**

## Why these three strands?

- **State** — *Who* is the user in the experience, and *where* (spatially and historically) is their attention?
- **Knowledge** — *What* scientifically grounded information can we deliver from **digitized** research and books?
- **Prompting** — *How* we shape **dialogue** between app and user — **fuller** treatment **after** state + knowledge are solid
- **First version** — prioritize **state** and **knowledge**; keep prompting **in scope** but lighter

## The experience we are building

- **360° / VR** views of the **Stadhuis** and related spaces **through the ages**
- **Switch** between **preset locations** and **time periods** — instant context change
- **Speech**: **STT** to capture questions; **TTS** (or equivalent) to deliver answers
- Goal: **embodied** visits — understanding tied to *being somewhere*, not only text search

## Navigation & presence

- **Explicit controls** — e.g. **buttons** or UI for **current year** and **location**
- **Free look** — head orientation; user explores the panorama naturally
- **Optional refinement** — **pointer or ray** in VR to indicate *what* the question refers to in the scene
- Design choice: **combine** explicit state with **sensed** attention so queries stay **grounded**

## What we mean by “state”

- **Spatial** — where the user is *looking* and *standing* (virtual place + camera pose)
- **Temporal** — which **historical slice** is active (year / period)
- **Dialogue** — **utterances** (and eventually **dialogue phase**) from STT
- State is the **bridge** between **the scene** and **what to retrieve** from knowledge bases

## Capturing state from the headset

- **Head orientation** — dominant viewing direction for the panorama
- **Gaze / focus** — can drive **defaults** or **hints** for retrieval (where relevant)
- **Controller or pointer** — disambiguate (“that **corner**, that **door**”) when speech alone is vague
- All of this must stay **privacy-aware** and **purpose-limited** — research / demo context

## Knowledge sources

- **Digitized** **research reports**, **monographs**, and **heritage** documentation
- Curated, **citeable** material — not a generic web crawl for facts
- Ingestion: text extraction, chunking, metadata (**time**, **place**, **topic**)

## From documents to answers — RAG

- **Retrieval-augmented** generation (or similar): **retrieve** grounded passages, **then** respond
- **Filters** aligned with **state** — time, place, and possibly **spatial** tags where we have them
- **Optional agent** layers — planning retrieval, reformulating queries, multi-step lookup

## When the user asks a question

- **Read** current **location**, **period**, and **pointer** context (if any)
- **Retrieve** relevant chunks; **compose** an **answer** grounded in sources
- **Speak** the answer; keep **traceability** to sources for experts and evaluation

## Quality & evaluation

- **Predefined test set** of questions — coverage across **locations**, **periods**, **difficulty**
- **Human expert** review — factual adequacy, tone, and fit with **heritage** standards
- Iteration: failures feed **chunking**, **metadata**, and **prompt / retrieval** tweaks

## Prompting — scope in v1

- We still need **baseline** templates: system instructions, **few-shot** shapes, **safe** refusals
- **Deeper** work — adaptive style, clarification strategies, long **multi-turn** arcs — **stages** after stable state + RAG
- Today: **acknowledge** the dependency — good answers need **good** **state** and **good** **corpus** first

## Challenges (honest list)

- **Alignment** — VR state vs **catalog** metadata (incomplete historical GIS, fuzzy periods)
- **Latency** — VR + speech + retrieval must feel **responsive**
- **Authority** — when sources **disagree**; how the app **signals** uncertainty
- **Accessibility** — subtitles, alternatives to **voice-only** flows

## Roadmap snapshot

- Harden **state** pipeline and **UX** for place / time / pointer
- Expand **corpus** and **eval** set; measure **regression** on expert review
- Then: richer **prompting** and **dialogue** policy

## Closing

- **VR** as a **frame** for **urban heritage** — state and knowledge locked to **place and time**
- **Thank you** — **questions**

---

## Optional: shorter deck

- Combine **Why these three strands?** + **The experience** into one slide
- Merge **State meaning** + **Capturing from headset** if time is tight
- Drop **Challenges** on screen; speak to it from **Closing** only

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
