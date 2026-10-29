import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parseNoteImport } from "./note-import";

describe("parseNoteImport", () => {
  it("reads notes, ignores text before the first one and makes missing URL names", () => {
    const { notes, errors } = parseNoteImport(`# Algebra notes

Intro text that is ignored.

---

# Note 1

**Title:** Like terms

**URL name:** like-terms

**Body**

## Like terms

$3a$ and $-a$ are like terms.

---

# Note 2

**Title:** Expanding Brackets!

**Body**

Multiply out: $2(x + 3) = 2x + 6$.
`);
    expect(errors).toEqual([]);
    expect(notes).toEqual([
      {
        heading: "Note 1",
        title: "Like terms",
        slug: "like-terms",
        body: "## Like terms\n\n$3a$ and $-a$ are like terms.",
      },
      {
        heading: "Note 2",
        title: "Expanding Brackets!",
        slug: "expanding-brackets",
        body: "Multiply out: $2(x + 3) = 2x + 6$.",
      },
    ]);
  });

  it("reports every problem with the note it belongs to", () => {
    const { notes, errors } = parseNoteImport(`# Note 1

**Title:** A

stray line

**Body**

# Note 2

**Title:** Same

**URL name:** Bad Name

**Body**

text

# Note 3

**Title:** Twice

**URL name:** twice

**Body**

one

# Note 4

**Title:** Twice again

**URL name:** twice

**Body**

two`);
    expect(notes.map((n) => n.slug)).toEqual(["twice"]);
    expect(errors).toEqual([
      'Note 1: Text before **Body**: "stray line". Put the note under **Body**.',
      'Note 1: Missing "**Title:**".',
      "Note 1: The body is empty.",
      'Note 2: URL name "Bad Name" must use lowercase letters, numbers and single hyphens.',
      'Note 4: URL name "twice" is used by another note in this file.',
    ]);
  });

  it("explains a file with no notes", () => {
    expect(parseNoteImport("## Like terms\n\ntext").errors).toEqual([
      'No notes found. Start each note with a heading line such as "# Note 1".',
    ]);
  });

  it("reads the Algebra notes we ship", () => {
    const { notes, errors } = parseNoteImport(
      readFileSync("docs/content/notes/o-level-maths-algebra-notes.md", "utf8"),
    );
    expect(errors).toEqual([]);
    expect(notes).toHaveLength(5);
    expect(notes[0]).toMatchObject({
      title: "Simplifying and expanding expressions",
      slug: "simplifying-and-expanding",
    });
    expect(notes.every((n) => n.body.length > 200 && !n.body.endsWith("---"))).toBe(true);
  });
});
