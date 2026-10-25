import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { MAX_IMPORT_QUESTIONS, parseQuestionImport } from "./question-import";

const one = (extra = "") => `
## Q1 · difficulty 3

**Stem**

Solve $3x - 7 = 11$.

**Options**

- A. $x = 4$
- B. $x = 6$
- C. $x = 7$
- D. $x = 18$

**Correct:** B
${extra}
**Solution**

Add 7: $3x = 18$.

$$
x = 6
$$

---
`;

describe("parseQuestionImport", () => {
  it("reads a question with its options, answer, difficulty and solution", () => {
    const { questions, errors } = parseQuestionImport(one());
    expect(errors).toEqual([]);
    expect(questions).toEqual([
      {
        title: "Q1 · difficulty 3",
        stem: "Solve $3x - 7 = 11$.",
        options: [
          { label: "A", text: "$x = 4$" },
          { label: "B", text: "$x = 6$" },
          { label: "C", text: "$x = 7$" },
          { label: "D", text: "$x = 18$" },
        ],
        correct: "B",
        solution: "Add 7: $3x = 18$.\n\n$$\nx = 6\n$$",
        difficulty: 3,
      },
    ]);
  });

  it("reads the drafted O Level algebra set in full", () => {
    const text = readFileSync("docs/content/o-level-maths-algebra-01.md", "utf8");
    const { questions, errors } = parseQuestionImport(text);
    expect(errors).toEqual([]);
    expect(questions).toHaveLength(20);
    expect(questions.map((q) => q.correct).join("")).toBe("CABDACBCDDABDBCADBCA");
    expect(questions.every((q) => q.solution && q.options.every((o) => o.text))).toBe(true);
  });

  it("defaults to medium difficulty and accepts a Difficulty line and Windows line endings", () => {
    const text = one().replace("## Q1 · difficulty 3", "## Q1");
    expect(parseQuestionImport(text).questions[0]?.difficulty).toBe(2);
    const withLine = parseQuestionImport(
      text.replace("**Correct:** B", "**Correct:** B\n**Difficulty:** 1"),
    );
    expect(withLine.questions[0]?.difficulty).toBe(1);
    expect(parseQuestionImport(one().replace(/\n/g, "\r\n")).errors).toEqual([]);
  });

  it("names the question and the problem when something is missing", () => {
    const text = one().replace("- C. $x = 7$\n", "").replace("**Correct:** B", "**Correct:** E");
    const { questions, errors } = parseQuestionImport(text);
    expect(questions).toEqual([]);
    expect(errors).toEqual([
      'Q1 · difficulty 3: "**Correct:**" must be A, B, C or D, not "E".',
      "Q1 · difficulty 3: Missing option C.",
      'Q1 · difficulty 3: Missing "**Correct:** A" (or B, C, D).',
    ]);
  });

  it("keeps good questions apart from broken ones", () => {
    const broken = "## Q2\n\n**Stem**\n\nNo options here.\n";
    const { questions, errors } = parseQuestionImport(one() + broken);
    expect(questions).toHaveLength(1);
    expect(errors[0]).toMatch(/^Q2: Missing option A, B, C, D\./);
  });

  it("rejects text with no questions and very large imports", () => {
    expect(parseQuestionImport("just some text").errors[0]).toMatch(/No questions found/);
    const many = one().repeat(MAX_IMPORT_QUESTIONS + 1);
    expect(parseQuestionImport(many).errors[0]).toMatch(/At most 200/);
  });

  it("reports lines it does not understand", () => {
    const text = one().replace("- D. $x = 18$", "D) $x = 18$");
    expect(parseQuestionImport(text).errors).toContain(
      'Q1 · difficulty 3: Option line not understood: "D) $x = 18$". Write it as "- A. text".',
    );
  });
});
