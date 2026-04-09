<!-- Generated for Slides.com (Reveal.js markdown). Source: presentation-outline.md — run: npm run present:slides-com -->

# State, knowledge & interaction in a VR heritage experience

## Immersive Utrecht City Hall — explorations and first implementation

---

## Opening

- **Navigable VR** panoramas of Utrecht **City Hall** across **time**
- Users **move** between **places** and **eras**, look around, and **converse** with the system
- This talk: what we are building, how we treat **state** and **knowledge** in v1 — and what comes next for **prompting**

---

## Why these three strands?

- **State** — *Who* is the user in the experience, and *where* (spatially and historically) is their attention?
- **Knowledge** — *What* scientifically grounded information can we deliver from **digitized** research and books?
- **Prompting** — *How* we shape **dialogue** between app and user — **fuller** treatment **after** state + knowledge are solid
- **First version** — prioritize **state** and **knowledge**; keep prompting **in scope** but lighter

---

## The experience we are building

- **360° / VR** views of the **Stadhuis** and related spaces **through the ages**
- **Switch** between **preset locations** and **time periods** — instant context change
- **Speech**: **STT** to capture questions; **TTS** (or equivalent) to deliver answers
- Goal: **embodied** visits — understanding tied to *being somewhere*, not only text search

---

## Navigation & presence

- **Explicit controls** — e.g. **buttons** or UI for **current year** and **location**
- **Free look** — head orientation; user explores the panorama naturally
- **Optional refinement** — **pointer or ray** in VR to indicate *what* the question refers to in the scene
- Design choice: **combine** explicit state with **sensed** attention so queries stay **grounded**

---

## What we mean by “state”

- **Spatial** — where the user is *looking* and *standing* (virtual place + camera pose)
- **Temporal** — which **historical slice** is active (year / period)
- **Dialogue** — **utterances** (and eventually **dialogue phase**) from STT
- State is the **bridge** between **the scene** and **what to retrieve** from knowledge bases

---

## Capturing state from the headset

- **Head orientation** — dominant viewing direction for the panorama
- **Gaze / focus** — can drive **defaults** or **hints** for retrieval (where relevant)
- **Controller or pointer** — disambiguate (“that **corner**, that **door**”) when speech alone is vague
- All of this must stay **privacy-aware** and **purpose-limited** — research / demo context

---

## Knowledge sources

- **Digitized** **research reports**, **monographs**, and **heritage** documentation
- Curated, **citeable** material — not a generic web crawl for facts
- Ingestion: text extraction, chunking, metadata (**time**, **place**, **topic**)

---

## From documents to answers — RAG

- **Retrieval-augmented** generation (or similar): **retrieve** grounded passages, **then** respond
- **Filters** aligned with **state** — time, place, and possibly **spatial** tags where we have them
- **Optional agent** layers — planning retrieval, reformulating queries, multi-step lookup

---

## When the user asks a question

- **Read** current **location**, **period**, and **pointer** context (if any)
- **Retrieve** relevant chunks; **compose** an **answer** grounded in sources
- **Speak** the answer; keep **traceability** to sources for experts and evaluation

---

## Quality & evaluation

- **Predefined test set** of questions — coverage across **locations**, **periods**, **difficulty**
- **Human expert** review — factual adequacy, tone, and fit with **heritage** standards
- Iteration: failures feed **chunking**, **metadata**, and **prompt / retrieval** tweaks

---

## Prompting — scope in v1

- We still need **baseline** templates: system instructions, **few-shot** shapes, **safe** refusals
- **Deeper** work — adaptive style, clarification strategies, long **multi-turn** arcs — **stages** after stable state + RAG
- Today: **acknowledge** the dependency — good answers need **good** **state** and **good** **corpus** first

---

## Challenges (honest list)

- **Alignment** — VR state vs **catalog** metadata (incomplete historical GIS, fuzzy periods)
- **Latency** — VR + speech + retrieval must feel **responsive**
- **Authority** — when sources **disagree**; how the app **signals** uncertainty
- **Accessibility** — subtitles, alternatives to **voice-only** flows

---

## Roadmap snapshot

- Harden **state** pipeline and **UX** for place / time / pointer
- Expand **corpus** and **eval** set; measure **regression** on expert review
- Then: richer **prompting** and **dialogue** policy

---

## Closing

- **VR** as a **frame** for **urban heritage** — state and knowledge locked to **place and time**
- **Thank you** — **questions**
