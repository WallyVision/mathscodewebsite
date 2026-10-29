/**
 * Reads many revision notes pasted as one Markdown document (the format in
 * docs/content/notes/*.md) so authors can add a topic's notes at once. Pure:
 * no database access. Text before the first note is ignored.
 *
 *   # Note 1                         ← starts a note
 *   **Title:** Like terms
 *   **URL name:** like-terms         ← optional; made from the title if left out
 *   **Body**
 *   ## Like terms                    ← the note itself: Markdown and $maths$
 *   ...
 */
import { slugify } from "@/lib/slug";

export const MAX_IMPORT_NOTES = 50;
const MAX_BODY = 50_000;

export interface ImportedNote {
  /** The heading, e.g. "Note 1", used in messages. */
  heading: string;
  title: string;
  slug: string;
  body: string;
}

export interface NoteImportResult {
  notes: ImportedNote[];
  errors: string[];
}

const HEADING = /^#\s+(Note\b.*?)\s*$/i;
const TITLE = /^\*\*Title:?\*\*:?\s*(.*?)\s*$/i;
const SLUG = /^\*\*URL name:?\*\*:?\s*(.*?)\s*$/i;
const BODY = /^\*\*Body\*\*:?\s*$/i;
const RULE = /^-{3,}\s*$/;
const SLUG_FORMAT = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function parseBlock(heading: string, lines: string[]): ImportedNote | string[] {
  const errors: string[] = [];
  let title = "";
  let slug = "";
  let bodyStart = -1;

  for (const [i, line] of lines.entries()) {
    if (TITLE.test(line)) title = TITLE.exec(line)![1]!;
    else if (SLUG.test(line)) slug = SLUG.exec(line)![1]!;
    else if (BODY.test(line)) {
      bodyStart = i + 1;
      break;
    } else if (line.trim() !== "" && !RULE.test(line)) {
      errors.push(
        `Text before **Body**: "${line.trim().slice(0, 60)}". Put the note under **Body**.`,
      );
    }
  }

  const body = bodyStart < 0 ? [] : lines.slice(bodyStart);
  // The "---" between notes belongs to no note.
  while (body.length > 0 && (RULE.test(body.at(-1)!) || body.at(-1)!.trim() === "")) body.pop();
  const bodyText = body.join("\n").trim();

  if (title.length < 2) errors.push('Missing "**Title:**".');
  else if (title.length > 120) errors.push("The title is too long (120 characters at most).");
  slug = slug || slugify(title).slice(0, 80).replace(/-+$/, "");
  if (title.length >= 2 && !SLUG_FORMAT.test(slug)) {
    errors.push(`URL name "${slug}" must use lowercase letters, numbers and single hyphens.`);
  }
  if (bodyStart < 0) errors.push('Missing "**Body**" followed by the note.');
  else if (!bodyText) errors.push("The body is empty.");
  if (bodyText.length > MAX_BODY) errors.push("The body is too long.");

  return errors.length > 0 ? errors : { heading, title, slug, body: bodyText };
}

export function parseNoteImport(text: string): NoteImportResult {
  const lines = text.replace(/\r\n?/g, "\n").split("\n");
  const blocks: { heading: string; lines: string[] }[] = [];
  for (const line of lines) {
    const heading = HEADING.exec(line);
    if (heading) blocks.push({ heading: heading[1]!, lines: [] });
    else blocks.at(-1)?.lines.push(line);
  }

  if (blocks.length === 0) {
    return {
      notes: [],
      errors: ['No notes found. Start each note with a heading line such as "# Note 1".'],
    };
  }
  if (blocks.length > MAX_IMPORT_NOTES) {
    return {
      notes: [],
      errors: [`At most ${MAX_IMPORT_NOTES} notes per import; this has ${blocks.length}.`],
    };
  }

  const notes: ImportedNote[] = [];
  const errors: string[] = [];
  const slugs = new Set<string>();
  for (const block of blocks) {
    const parsed = parseBlock(block.heading, block.lines);
    if (Array.isArray(parsed)) {
      errors.push(...parsed.map((e) => `${block.heading}: ${e}`));
    } else if (slugs.has(parsed.slug)) {
      errors.push(
        `${block.heading}: URL name "${parsed.slug}" is used by another note in this file.`,
      );
    } else {
      slugs.add(parsed.slug);
      notes.push(parsed);
    }
  }
  return { notes, errors };
}
