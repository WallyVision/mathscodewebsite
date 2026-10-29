import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parseWrittenImport } from "./written-import";

describe("parseWrittenImport", () => {
  it("reads sections, labels, marks, topics, questions and solutions", () => {
    const { questions, errors } = parseWrittenImport(`# Paper 2

Intro, ignored.

# Section A

## A1 · 4 marks

**Topic:** Fractions

**Question**

Evaluate $\\frac{1}{2}$ of $\\frac{1}{3}$.

**Solution**

$\\frac{1}{6}$

---

# Section B

## B1 · 15 marks

**Question**

a) Part one.

b) Part two.
`);
    expect(errors).toEqual([]);
    expect(questions).toEqual([
      {
        label: "A1",
        section: "A",
        marks: 4,
        topic: "Fractions",
        body: "Evaluate $\\frac{1}{2}$ of $\\frac{1}{3}$.",
        solution: "$\\frac{1}{6}$",
      },
      {
        label: "B1",
        section: "B",
        marks: 15,
        topic: null,
        body: "a) Part one.\n\nb) Part two.",
        solution: null,
      },
    ]);
  });

  it("reports problems with the question they belong to", () => {
    const { questions, errors } = parseWrittenImport(`## 1 · 4 marks

stray

**Question**

## 2

**Question**

text

## 2 · 5 marks

**Question**

again`);
    expect(questions.map((q) => q.label)).toEqual(["2"]);
    expect(errors).toEqual([
      '1: Text before **Question**: "stray".',
      "1: Missing the question under **Question**.",
      '2: the label "2" is used twice in this file.',
    ]);
  });

  it("explains a file with no questions", () => {
    expect(parseWrittenImport("Evaluate 2 + 2.").errors).toEqual([
      'No questions found. Start each question with a heading line such as "## A1 · 4 marks".',
    ]);
  });

  it("reads the 2026 Paper 2 we ship", () => {
    const { questions, errors } = parseWrittenImport(
      readFileSync("docs/content/past-papers/o-level-maths-0570-2026-p2.md", "utf8"),
    );
    expect(errors).toEqual([]);
    expect(questions.map((q) => `${q.label}:${q.section}:${q.marks}`)).toEqual([
      "A1:A:4",
      "A2:A:4",
      "A3:A:4",
      "A4:A:5",
      "A5:A:5",
      "A6:A:5",
      "A7:A:4",
      "A8:A:4",
      "A9:A:4",
      "A10:A:4",
      "B1:B:15",
      "B2:B:15",
      "B3:B:15",
      "B4:B:15",
    ]);
    expect(questions.every((q) => q.solution && !q.solution.endsWith("---"))).toBe(true);
  });
});
