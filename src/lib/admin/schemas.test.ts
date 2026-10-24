import { describe, expect, it } from "vitest";
import { noteSchema, postSchema, questionSchema, slugify, testSchema } from "./schemas";

const question = {
  subjectId: "s1",
  topicId: "",
  pastPaperId: "",
  number: "",
  stem: "What is $2 + 2$?",
  optionA: "3",
  optionB: "4",
  optionC: "5",
  optionD: "22",
  correct: "B",
  solution: "",
  difficulty: "1",
  status: "DRAFT",
};

describe("questionSchema", () => {
  it("normalises blanks and builds the options", () => {
    const q = questionSchema.parse(question);
    expect(q).toMatchObject({ topicId: null, pastPaperId: null, number: null, solution: null });
    expect(q.options).toEqual([
      { label: "A", text: "3" },
      { label: "B", text: "4" },
      { label: "C", text: "5" },
      { label: "D", text: "22" },
    ]);
    expect(q.correct).toBe("B");
  });

  it("requires every option and a correct answer", () => {
    const r = questionSchema.safeParse({ ...question, optionC: " ", correct: "" });
    expect(r.success).toBe(false);
    expect(r.error?.issues.map((i) => i.path[0])).toEqual(
      expect.arrayContaining(["optionC", "correct"]),
    );
  });

  it("requires a question number for past paper questions", () => {
    const r = questionSchema.safeParse({ ...question, pastPaperId: "p1" });
    expect(r.error?.issues[0]?.path).toEqual(["number"]);
    expect(questionSchema.safeParse({ ...question, pastPaperId: "p1", number: "12" }).success).toBe(
      true,
    );
  });
});

describe("noteSchema", () => {
  it("rejects badly formed URL names", () => {
    const base = { topicId: "t", title: "Title", body: "x", status: "DRAFT" };
    expect(noteSchema.safeParse({ ...base, slug: "ok-slug-2" }).success).toBe(true);
    expect(noteSchema.safeParse({ ...base, slug: "Bad Slug" }).success).toBe(false);
    expect(noteSchema.safeParse({ ...base, slug: "double--hyphen" }).success).toBe(false);
  });
});

describe("slugify", () => {
  it("makes URL names from titles", () => {
    expect(slugify("Équations du 2nd degré!")).toBe("equations-du-2nd-degre");
    expect(slugify("  Solving   Linear Equations ")).toBe("solving-linear-equations");
  });
});

describe("testSchema", () => {
  const test = {
    subjectId: "s1",
    title: "Weekly Test 3",
    kind: "WEEKLY",
    status: "SCHEDULED",
    opensAt: "2026-11-07T08:00",
    closesAt: "2026-11-08T20:00",
    durationMinutes: "45",
    questionIds: ["q1", "q2"],
  };

  it("parses Cameroon times", () => {
    const t = testSchema.parse(test);
    expect(t.opensAt).toEqual(new Date("2026-11-07T07:00:00Z"));
    expect(t.durationMinutes).toBe(45);
  });

  it("rejects a window that closes before it opens", () => {
    const r = testSchema.safeParse({ ...test, closesAt: "2026-11-06T08:00" });
    expect(r.error?.issues[0]?.path).toEqual(["closesAt"]);
  });

  it("allows an empty draft but not an empty scheduled test", () => {
    expect(testSchema.safeParse({ ...test, status: "DRAFT", questionIds: [] }).success).toBe(true);
    expect(testSchema.safeParse({ ...test, questionIds: [] }).success).toBe(false);
  });

  it("rejects duplicate questions", () => {
    expect(testSchema.safeParse({ ...test, questionIds: ["q1", "q1"] }).success).toBe(false);
  });
});

describe("postSchema", () => {
  const post = {
    category: "SCHOLARSHIP",
    title: "Example Scholarship 2027",
    slug: "example-scholarship-2027",
    summary: "Full tuition for first-year engineering students.",
    body: "## Who can apply\n\nA Level holders.",
    externalUrl: "https://example.org/apply",
    organisation: "Example Foundation",
    location: "",
    deadline: "2027-03-31T23:59",
    status: "PUBLISHED",
  };

  it("parses a post, with Cameroon-time deadline and blank fields as null", () => {
    const p = postSchema.parse(post);
    expect(p.deadline).toEqual(new Date("2027-03-31T22:59:00Z"));
    expect(p.location).toBeNull();
    expect(p.externalUrl).toBe("https://example.org/apply");
  });

  it("allows no link and no deadline", () => {
    const p = postSchema.parse({ ...post, externalUrl: "", deadline: "" });
    expect(p).toMatchObject({ externalUrl: null, deadline: null });
  });

  it("rejects links that are not web addresses", () => {
    for (const externalUrl of ["javascript:alert(1)", "example.org", "ftp://example.org"]) {
      expect(postSchema.safeParse({ ...post, externalUrl }).success).toBe(false);
    }
  });
});
