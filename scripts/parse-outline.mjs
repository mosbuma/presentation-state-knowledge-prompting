/**
 * Shared parser for presentation-outline.md-style sources:
 * YAML frontmatter, ## Title slides (order in file), two-space-indented - bullets.
 * Skips appendix headings: ## Optional:, ## Build …
 * Code fences (```) are ignored for slide detection.
 * Multiline HTML comments <!-- … --> (except single-line slide-max-level) hide ## slides from export.
 */

export function stripInlineMd(s) {
  return s
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/^[-*]\s+/, "")
    .trim();
}

export function parseFrontmatter(md) {
  const meta = {};
  if (!md.startsWith("---")) return { body: md, meta };
  const end = md.indexOf("\n---", 3);
  if (end === -1) return { body: md, meta };
  const block = md.slice(3, end);
  const body = md.slice(end + 4);
  for (const line of block.split(/\r?\n/)) {
    const m = /^([\w]+):\s*(.+)$/.exec(line.trim());
    if (!m) continue;
    let v = m[2].trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    meta[m[1]] = v;
  }
  return { body, meta };
}

/** <!-- slide-max-level: N --> (legacy: pptx-max-level) */
const SLIDE_MAX_LEVEL_RE =
  /<!--\s*(?:slide-max-level|pptx-max-level):\s*(\d+)\s*-->/i;

export function parseSlideMaxLevelFromLine(line) {
  const m = SLIDE_MAX_LEVEL_RE.exec(line.trim());
  return m != null ? parseInt(m[1], 10) : null;
}

/**
 * `<!--` on this line with no `-->` after the opener → block comment (can hide ## slides).
 * Single-line comments (incl. slide-max-level) return false.
 */
function opensMultilineHtmlComment(line) {
  const start = line.indexOf("<!--");
  if (start === -1) return false;
  const fromOpen = line.slice(start);
  if (SLIDE_MAX_LEVEL_RE.test(fromOpen) && /-->/g.test(fromOpen)) return false;
  const afterOpen = line.slice(start + 4);
  return !/-->/.test(afterOpen);
}

export function filterBulletsForSlide(bullets, maxLevel) {
  if (maxLevel === undefined || maxLevel === null || Number.isNaN(maxLevel)) {
    return bullets;
  }
  return bullets.filter((b) => b.level <= maxLevel);
}

/** Not deck slides (appendix / tooling sections after the main outline). */
const NON_SLIDE_TITLE = /^(Optional:|Build)/i;

export function parseSlides(md) {
  let { body, meta } = parseFrontmatter(md);

  const slides = [];
  const lines = body.split(/\r?\n/);
  let i = 0;
  let inFence = false;
  let inHtmlBlockComment = false;

  while (i < lines.length) {
    const line = lines[i];
    const fence = /^\s*```/.test(line);
    if (fence) {
      inFence = !inFence;
      i++;
      continue;
    }
    if (inFence) {
      i++;
      continue;
    }
    if (inHtmlBlockComment) {
      if (/-->/.test(line)) inHtmlBlockComment = false;
      i++;
      continue;
    }
    if (opensMultilineHtmlComment(line)) {
      inHtmlBlockComment = true;
      if (/-->/.test(line)) inHtmlBlockComment = false;
      i++;
      continue;
    }
    const m = /^## (.+)$/.exec(line);
    if (m) {
      const title = m[1].trim();
      if (NON_SLIDE_TITLE.test(title)) {
        i++;
        continue;
      }
      let maxLevel = null;
      if (i > 0) {
        const fromPrev = parseSlideMaxLevelFromLine(lines[i - 1]);
        if (fromPrev !== null) maxLevel = fromPrev;
      }
      const bullets = [];
      i++;
      while (i < lines.length) {
        const L = lines[i];
        if (inHtmlBlockComment) {
          if (/-->/.test(L)) inHtmlBlockComment = false;
          i++;
          continue;
        }
        if (opensMultilineHtmlComment(L)) {
          inHtmlBlockComment = true;
          if (/-->/.test(L)) inHtmlBlockComment = false;
          i++;
          continue;
        }
        if (/^## /.test(L)) break;
        if (/^---\s*$/.test(L)) break;
        if (/^\s*<!--/.test(L) && /-->\s*$/.test(L)) {
          const fromComment = parseSlideMaxLevelFromLine(L);
          if (fromComment !== null) maxLevel = fromComment;
          i++;
          continue;
        }
        const b = /^(\s*)-\s+(.+)$/.exec(L);
        if (b) {
          const ws = b[1].replace(/\t/g, "  ").length;
          const level = Math.min(8, Math.floor(ws / 2));
          const raw = b[2].trim();
          bullets.push({ text: stripInlineMd(raw), raw, level });
        }
        i++;
      }
      slides.push({
        num: String(slides.length + 1),
        title,
        bullets,
        maxLevel: maxLevel !== null ? maxLevel : undefined,
      });
      continue;
    }
    i++;
  }

  return { slides, meta };
}

export function notesFromSlide(title, bullets, header, isNl) {
  const lines = [];
  if (header) lines.push(header, "");
  lines.push(title);
  lines.push("");
  if (bullets.length) {
    for (const { text, level } of bullets) {
      const pad = "  ".repeat(level);
      lines.push(`${pad}• ${text}`);
    }
  } else {
    lines.push(
      isNl ? "(Geen punten op deze slide.)" : "(No bullets on this slide.)"
    );
  }
  return lines.join("\n");
}
