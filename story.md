# Speaker script

Aligned with **`presentation-outline.md`**. Section headings match slide titles. Adjust pace for roughly thirty-five minutes of speaking; reserve the remainder for discussion.

---

## Opening

Good [morning / afternoon / evening]. I want to talk about an experiment we are running at the boundary of **virtual reality**, **urban heritage**, and **language technology**.

The setting is **Utrecht City Hall** — the Stadhuis and related spaces — but not frozen in a single photograph. We are building **navigable panoramic experiences** so a visitor can move between **locations** and **historical moments**, look around in three hundred and sixty degrees, and **talk** to the system while they stand in that place.

In the next forty minutes — including time for your questions — I will unpack **what** we are building, **how** we represent the user’s **state** in that world, and **how** we ground answers in **knowledge** drawn from serious, digitized sources. I will also be honest about what we are **not** trying to solve in the first version, especially full **dialogue** and **prompting** polish, and where that fits on the roadmap.

---

## Why these three strands?

We have found it useful to separate three problems, even though they interact.

**State** answers: who is this person **in the experience**, and **where** — physically in the panorama and **when** in history — is their attention? Without a disciplined notion of state, every question floats in a void.

**Knowledge** answers: what **reliable**, citable information can we surface from **digitized** research reports, books, and heritage documentation? We are not aiming for a generic chatbot trained on the open web; we want answers that a curator or historian would recognize as accountable to sources.

**Prompting** — in the broad sense of how the app **converses** — is the third strand: system instructions, tone, clarification, multi-turn flow. It matters enormously, but it sits **on top of** state and retrieval. If state is wrong or the corpus is thin, prettier prompting only hides the problem for a moment.

Our **first implementation** therefore **prioritizes state and knowledge**. Prompting gets enough structure to work safely and clearly, but the deep, adaptive dialogue layer comes **after** the foundation is solid.

---

## The experience we are building

Concretely, imagine putting on a headset — or using a comparable immersive view — and standing inside a **reconstruction or panorama** of a space you might know from today’s city, but seen **through another century**.

You can **switch** between **preset viewpoints** and **time slices** — for example moving from one hall to another, or from one phase of the building’s life to another — without leaving the overall experience. You explore by **looking**; the panorama responds to your head movement like any good VR scene.

We use **speech-to-text** so you can **ask questions** in natural language, and **text-to-speech** — or an equivalent voice output — so answers come back **spoken**, not only as text on a wall. The point is **embodiment**: understanding is tied to **being somewhere**, not only to typing keywords into a search box.

---

## Navigation & presence

Not everything should be inferred. We give users **explicit controls** — for example **buttons** or clear UI — to set the **active year** or **period** and the **current location** when those need to be unambiguous. That “declared” state is the backbone: the system always knows which slice of history we intend to be in.

On top of that, **free look** means the user’s **head orientation** drives what they see. That is standard VR, but for us it is also **signal**: what fills their field of view is often what their question is **about**.

Where speech is ambiguous — “what happened **there**?” — we are exploring an **optional pointer or ray** in the scene so the user can **indicate** a feature: a doorway, a corner, a piece of furniture. The design principle is to **combine** explicit declarations with **sensed** attention so queries stay **grounded** in the world we have modeled.

---

## What we mean by “state”

When we say **state**, we mean a bundle of things the runtime can read.

**Spatial** state is where the user is **virtually standing** and **looking** — camera pose, dominant viewing direction, and possibly a aimed ray.

**Temporal** state is **which historical slice** is active: a year, a phase, or a labeled period aligned with our content.

**Dialogue** state starts with **what they just said**, transcribed through STT; later it can include **where we are in a conversation**, but version one keeps that relatively shallow.

Crucially, state is the **bridge** between **the visual scene** and **retrieval**. It tells the backend which passages might be **relevant** and which interpretations of a vague phrase are **plausible**.

---

## Capturing state from the headset

Technically, we lean on **head orientation** as the main signal for “what you are looking at” in the panorama. Where the pipeline can support it, **gaze or focus** estimates might **weight** candidates or **hint** disambiguation, but we do not need perfect eye tracking to get value from head pose.

For **reference resolution** — “that arch,” “this room” — a **controller or hand ray** can name a target more precisely than speech alone, especially in a busy scene.

All of this deserves a **privacy** note: we treat these signals as **instrumentation for the experience** in a **research or demonstration** context, **purpose-limited**, and not as open-ended surveillance. What we log for **evaluation** should be **bounded** and **explained** to participants.

---

## Knowledge sources

The knowledge side is intentionally **narrow and deep** relative to the web.

We ingest **digitized** **research reports**, **monographs**, and **heritage** documentation that bear on the building, the city, and the periods we portray. The material is **curated** and **citeable** — suitable for experts to **check** answers against.

Ingestion means **text extraction**, **chunking** into retrievable units, and **metadata**: **time**, **place**, **topic**, and whatever **spatial** or architectural tags we can attach reliably. The quality of that metadata is almost as important as the quality of the text; it is how we connect **where you stand in VR** to **what the library knows**.

---

## From documents to answers — RAG

We use a **retrieval-augmented** pattern: **retrieve** first, **generate** or **compose** second. The model sees **actual passages** from the corpus rather than relying on parametric memory for facts.

Retrieval is **filtered** using state: **period**, **location**, and **tags** that match the user’s declared or inferred context. That reduces the temptation to answer from a paragraph about the wrong century.

We may add **agent-style** steps — query reformulation, multi-hop lookup, checking multiple indexes — where they **improve precision**, but the architectural center of gravity remains **grounded chunks** and **transparent** sourcing, not autonomous improvisation on thin air.

---

## When the user asks a question

End to end, a question flows like this.

The runtime **reads** the current **location**, **period**, and any **pointer** or **ray hit** context. It sends the **utterance** and that state bundle to the language and retrieval stack.

The stack **retrieves** relevant chunks, **composes** an answer **conditioned** on those passages, and returns text. The client **speaks** that text with TTS.

For **experts** and for **evaluation**, we keep **traceability**: which passages supported the answer, so a historian can disagree with the **wording** without wondering where it came from — and so we can **debug** failures.

---

## Quality & evaluation

We are building a **fixed test set** of questions: varied **locations**, **periods**, and **difficulty**, including some that require **combining** context from the scene with facts in the text.

A **knowledgeable human** — ideally someone with heritage or architectural history expertise — scores responses for **factual adequacy**, **tone**, and **fit** with institutional standards. That is slower than automatic metrics, but for this domain it is the **reference** we care about.

When the system fails, we feed that back into **chunk boundaries**, **metadata**, **retrieval settings**, and **prompt** templates — not only into model choice — because most failures here are **grounding** failures, not cleverness failures.

---

## Prompting — scope in v1

Even in version one we need **baseline** prompting: a clear **system** instruction, **few-shot** shapes where they help, **refusal** behavior when sources are insufficient, and language that is appropriate for **public heritage** contexts.

What we defer to later stages is **rich adaptation**: shifting style by audience, **clarification** strategies over many turns, **proactive** suggestions, and long **dialogue arcs**. Those features assume that **state** is trustworthy and **retrieval** is reliable; otherwise the conversation drifts.

So tonight’s emphasis is deliberate: **good answers start with good state and a good corpus**; prompting scales once that loop is tight.

---

## Challenges (honest list)

A few risks deserve names.

**Alignment** between **VR state** and **catalog metadata** is hard. Historical periods are **fuzzy**; GIS for long-gone fabric is **incomplete**. We will sometimes retrieve the wrong passage for the **right** question.

**Latency** stacks up: rendering, speech recognition, retrieval, generation, speech synthesis. Immersion breaks if the user waits too long; we may need **caching**, **shorter** answers first, or **streaming** audio.

When **sources disagree**, we must decide how the app **signals** uncertainty — without sounding evasive every time. That is both a **UX** and an **ethics** question.

**Accessibility** matters: not everyone wants or can use **voice-only** flows; **subtitles**, **visual** transcripts, and **non-voice** input paths should ride alongside the spoken ideal.

---

## Roadmap snapshot

Near term, we **harden** the **state** pipeline and the **UX** for place, time, and pointer disambiguation.

In parallel we **grow** the **corpus** and the **eval** set, and we watch for **regression** when we change models or chunking — experts stay in the loop.

After that foundation is stable, we invest in **richer prompting** and **dialogue policy**: clarification, pacing, and multi-turn experiences that feel worth the headset.

---

## Closing

To close: we are using **VR** not as spectacle alone but as a **frame** for **urban heritage** — a way to tie **knowledge** to **place** and **time** so visitors **feel** the weight of history where it happened.

Thank you for your attention. I would be glad to take **questions**.
