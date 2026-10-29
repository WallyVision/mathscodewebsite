/**
 * Reads a structured past paper (Paper 2 style) pasted as one Markdown
 * document (the format in docs/content/past-papers/*-p2.md). Pure: no
 * database access. Text before the first question is ignored.
 *
 *   # Section A                     ← optional; sets the section of what follows
 *   ## A1 · 4 marks                 ← starts a question; the label is the first word
 *   **Topic:** Fractions            ← optional; a topic of the paper's subject
 *   **Question**
 *   Evaluate ...                    ← all parts (a), (b)... go here
 *   **Solution**
 *   ...
 */

export const MAX_IMPORT_WRITTEN = 60;
const MAX_TEXT = 50_000;

export interface ImportedWrittenQuestion {
  label: string;
  section: string | null;
  marks: number | null;
  /** Topic name as written in the file; matched to the subject's topics on import. */
  topic: string | null;
  body: string;
  solution: string | null;
}

export interface WrittenImportResult {
  questions: ImportedWrittenQuestion[];
  errors: string[];
}

const SECTION = /^#\s+Section\s+(\S+)\s*$/i;
const HEADING = /^##\s+(.+?)\s*$/;
const MARKS = /(\d+)\s*marks?\b/i;
const TOPIC = /^\*\*Topic:?\*\*:?\s*(.*?)\s*$/i;
const QUESTION = /^\*\*Question\*\*:?\s*$/i;
const SOLUTION = /^\*\*Solution\*\*:?\s*$/i;
const RULE = /^-{3,}\s*$/;
const LABEL = /^[A-Za-z0-9.()-]{1,12}$/;

const trimEnd = (lines: string[]) => {
  // The "---" between questions belongs to no question.
  while (lines.length > 0 && (RULE.test(lines.at(-1)!) || lines.at(-1)!.trim() === "")) lines.pop();
  return lines.join("\n").trim();
};

function parseBlock(
  heading: string,
  section: string | null,
  lines: string[],
): ImportedWrittenQuestion | string[] {
  const errors: string[] = [];
  const label = heading.split(/[\s·]+/)[0] ?? "";
  const marks = MARKS.exec(heading);
  let topic: string | null = null;
  const body: string[] = [];
  const solution: string[] = [];
  let part: "none" | "question" | "solution" = "none";

  for (const line of lines) {
    if (QUESTION.test(line)) part = "question";
    else if (SOLUTION.test(line)) part = "solution";
    else if (part === "none" && TOPIC.test(line)) topic = TOPIC.exec(line)![1]! || null;
    else if (part === "question") body.push(line);
    else if (part === "solution") solution.push(line);
    else if (line.trim() !== "" && !RULE.test(line)) {
      errors.push(`Text before **Question**: "${line.trim().slice(0, 60)}".`);
    }
  }

  const bodyText = trimEnd(body);
  const solutionText = trimEnd(solution);
  if (!LABEL.test(label))
    errors.push(`The heading should start with a label such as "A1", not "${label}".`);
  if (!bodyText) errors.push("Missing the question under **Question**.");
  if (bodyText.length > MAX_TEXT) errors.push("The question is too long.");
  if (solutionText.length > MAX_TEXT) errors.push("The solution is too long.");

  if (errors.length > 0) return errors;
  return {
    label,
    section,
    marks: marks ? Number(marks[1]) : null,
    topic,
    body: bodyText,
    solution: solutionText || null,
  };
}

export function parseWrittenImport(text: string): WrittenImportResult {
  const lines = text.replace(/\r\n?/g, "\n").split("\n");
  const blocks: { heading: string; section: string | null; lines: string[] }[] = [];
  let section: string | null = null;
  for (const line of lines) {
    const sectionMatch = SECTION.exec(line);
    const heading = HEADING.exec(line);
    if (sectionMatch) section = sectionMatch[1]!.toUpperCase();
    else if (heading) blocks.push({ heading: heading[1]!, section, lines: [] });
    else blocks.at(-1)?.lines.push(line);
  }

  if (blocks.length === 0) {
    return {
      questions: [],
      errors: [
        'No questions found. Start each question with a heading line such as "## A1 · 4 marks".',
      ],
    };
  }
  if (blocks.length > MAX_IMPORT_WRITTEN) {
    return {
      questions: [],
      errors: [`At most ${MAX_IMPORT_WRITTEN} questions per import; this has ${blocks.length}.`],
    };
  }

  const questions: ImportedWrittenQuestion[] = [];
  const errors: string[] = [];
  const labels = new Set<string>();
  for (const block of blocks) {
    const parsed = parseBlock(block.heading, block.section, block.lines);
    const name = block.heading.split(/[\s·]+/)[0] || block.heading;
    if (Array.isArray(parsed)) errors.push(...parsed.map((e) => `${name}: ${e}`));
    else if (labels.has(parsed.label.toUpperCase())) {
      errors.push(`${name}: the label "${parsed.label}" is used twice in this file.`);
    } else {
      labels.add(parsed.label.toUpperCase());
      questions.push(parsed);
    }
  }
  return { questions, errors };
}
