/**
 * Reads many MCQs pasted as one Markdown document (the format in
 * docs/content/*.md and docs/CONTENT_GUIDE.md) so authors can add a whole set
 * at once. Pure: no database access.
 *
 *   ## Q1 · difficulty 1        ← starts a question; "difficulty N" is optional
 *   **Stem**
 *   Solve $3x - 7 = 11$.
 *   **Options**
 *   - A. $x = 4$
 *   - B. $x = 6$
 *   - C. $x = 7$
 *   - D. $x = 18$
 *   **Correct:** B
 *   **Solution**
 *   Add 7 to both sides ...
 */

const LABELS = ["A", "B", "C", "D"] as const;
type Label = (typeof LABELS)[number];

export const MAX_IMPORT_QUESTIONS = 200;
const MAX_STEM = 20_000;
const MAX_OPTION = 2000;
const MAX_SOLUTION = 20_000;

export interface ImportedQuestion {
  /** The heading, e.g. "Q1 · difficulty 1", used in messages. */
  title: string;
  /** The first number in the heading ("Q12" → 12): the question number in a past paper. */
  number: number | null;
  stem: string;
  options: { label: Label; text: string }[];
  correct: Label;
  solution: string | null;
  difficulty: number;
}

export interface ImportResult {
  questions: ImportedQuestion[];
  errors: string[];
}

const HEADING = /^##\s+(.+?)\s*$/;
const STEM = /^\*\*Stem\*\*:?\s*$/i;
const OPTIONS = /^\*\*Options\*\*:?\s*$/i;
const SOLUTION = /^\*\*Solution\*\*:?\s*$/i;
const CORRECT = /^\*\*Correct:?\*\*:?\s*(.*?)\s*$/i;
const DIFFICULTY_LINE = /^\*\*Difficulty:?\*\*:?\s*(.*?)\s*$/i;
const DIFFICULTY_IN_HEADING = /difficulty\s*([1-3])\b/i;
const OPTION = /^[-*]\s*([A-Da-d])[.)]\s+(.+?)\s*$/;
const RULE = /^-{3,}\s*$/;

type Section = "none" | "stem" | "options" | "solution";

function parseBlock(title: string, lines: string[]): ImportedQuestion | string[] {
  const errors: string[] = [];
  const stem: string[] = [];
  const solution: string[] = [];
  const options = new Map<Label, string>();
  let correct: Label | null = null;
  let difficulty = Number(DIFFICULTY_IN_HEADING.exec(title)?.[1] ?? 2);
  let section: Section = "none";

  for (const line of lines) {
    if (STEM.test(line)) section = "stem";
    else if (OPTIONS.test(line)) section = "options";
    else if (SOLUTION.test(line)) section = "solution";
    else if (CORRECT.test(line)) {
      const value = CORRECT.exec(line)![1]!.toUpperCase();
      if ((LABELS as readonly string[]).includes(value)) correct = value as Label;
      else errors.push(`"**Correct:**" must be A, B, C or D, not "${value}".`);
      section = "none";
    } else if (DIFFICULTY_LINE.test(line)) {
      const value = Number(DIFFICULTY_LINE.exec(line)![1]);
      if ([1, 2, 3].includes(value)) difficulty = value;
      else errors.push("Difficulty must be 1, 2 or 3.");
      section = "none";
    } else if (section === "stem") stem.push(line);
    else if (section === "solution") solution.push(line);
    else if (section === "options") {
      if (line.trim() === "" || RULE.test(line)) continue;
      const match = OPTION.exec(line);
      if (!match) {
        errors.push(`Option line not understood: "${line.trim()}". Write it as "- A. text".`);
        continue;
      }
      const label = match[1]!.toUpperCase() as Label;
      if (options.has(label)) errors.push(`Option ${label} appears twice.`);
      options.set(label, match[2]!);
    } else if (line.trim() !== "" && !RULE.test(line)) {
      errors.push(`Text outside a section: "${line.trim().slice(0, 60)}". Put it under **Stem**.`);
    }
  }

  // The "---" between questions belongs to no question.
  while (solution.length > 0 && (RULE.test(solution.at(-1)!) || solution.at(-1)!.trim() === "")) {
    solution.pop();
  }
  const stemText = stem.join("\n").trim();
  const solutionText = solution.join("\n").trim();

  if (!stemText) errors.push("Missing the question text under **Stem**.");
  if (stemText.length > MAX_STEM) errors.push("The question text is too long.");
  const missing = LABELS.filter((l) => !options.has(l));
  if (missing.length > 0) errors.push(`Missing option ${missing.join(", ")}.`);
  for (const [label, text] of options) {
    if (text.length > MAX_OPTION) errors.push(`Option ${label} is too long.`);
  }
  if (!correct) errors.push('Missing "**Correct:** A" (or B, C, D).');
  if (solutionText.length > MAX_SOLUTION) errors.push("The solution is too long.");

  if (errors.length > 0) return errors;
  const numberMatch = /\d+/.exec(title);
  return {
    title,
    number: numberMatch ? Number(numberMatch[0]) : null,
    stem: stemText,
    options: LABELS.map((label) => ({ label, text: options.get(label)! })),
    correct: correct!,
    solution: solutionText || null,
    difficulty,
  };
}

export function parseQuestionImport(text: string): ImportResult {
  const lines = text.replace(/\r\n?/g, "\n").split("\n");
  const blocks: { title: string; lines: string[] }[] = [];
  for (const line of lines) {
    const heading = HEADING.exec(line);
    if (heading) blocks.push({ title: heading[1]!, lines: [] });
    else blocks.at(-1)?.lines.push(line);
  }

  if (blocks.length === 0) {
    return {
      questions: [],
      errors: ['No questions found. Start each question with a heading line such as "## Q1".'],
    };
  }
  if (blocks.length > MAX_IMPORT_QUESTIONS) {
    return {
      questions: [],
      errors: [`At most ${MAX_IMPORT_QUESTIONS} questions per import; this has ${blocks.length}.`],
    };
  }

  const questions: ImportedQuestion[] = [];
  const errors: string[] = [];
  for (const block of blocks) {
    const parsed = parseBlock(block.title, block.lines);
    if (Array.isArray(parsed)) errors.push(...parsed.map((e) => `${block.title}: ${e}`));
    else questions.push(parsed);
  }
  return { questions, errors };
}
