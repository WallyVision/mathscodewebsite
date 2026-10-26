# Content writing guide

For anyone writing notes, questions or solutions for StudentLife237.

## Format

All content is **Markdown** with **LaTeX maths**.

| You want                | Write                                        |
| ----------------------- | -------------------------------------------- |
| Bold                    | `**important**`                              |
| Bullet list             | `- item` on each line                        |
| Numbered steps          | `1. step` on each line                       |
| Table                   | `\| a \| b \|` rows (see any Markdown guide) |
| Maths inside a sentence | `$x^2 + 1$`                                  |
| Maths on its own line   | `$$` on a line, the formula, `$$` on a line  |

A display formula **must** have its `$$` markers on their own lines, with a blank line
before and after the block:

```
The gradient is

$$
m = \frac{y_2 - y_1}{x_2 - x_1}
$$

where ...
```

Writing `$$m = ...$$` on one line shows the formula inside the text instead of centred.

Several equations stacked and lined up on `=`:

```
$$
\begin{aligned}
v &= u + at \\
s &= ut + \tfrac{1}{2}at^2
\end{aligned}
$$
```

### Diagrams and pictures

Open **Add a diagram or picture** on any question, note or post form (or **Admin → Images**),
upload the file and paste the line it gives, for example `![Triangle ABC](/media/abc123)`,
where the picture should appear: in the question, an option, the solution or a note. The text
in square brackets is read aloud by screen readers, so describe the picture briefly.

- PNG, JPG, WebP or SVG, up to 300 KB. SVG is best for drawings: sharp and tiny.
- Photos of hand-drawn diagrams: crop them, then save as JPG.
- Still state the key facts in words ("angle $B = 90^\circ$"), so the question works even on a
  slow connection.
- Uploading the same file twice reuses the first copy. Pasted lines also work in a set you
  import.

### Common LaTeX

| Shows as        | Write                            |
| --------------- | -------------------------------- |
| fraction        | `\frac{a}{b}` (`\dfrac` larger)  |
| square root     | `\sqrt{x}`                       |
| powers, indices | `x^{2}`, `x_{1}`                 |
| ×, ÷, ±         | `\times`, `\div`, `\pm`          |
| θ, π, Ω, μ      | `\theta`, `\pi`, `\Omega`, `\mu` |
| units           | `3\,\text{m s}^{-1}`             |
| degrees         | `30^\circ`                       |
| sets            | `A \cap B`, `A \cup B`           |

## Questions (MCQ)

- Four options, **A to D**, exactly one correct.
- Wrong options should be **real mistakes students make** (wrong sign, forgot to square,
  used circumference instead of area), not random numbers.
- Spread the correct letter evenly across A, B, C and D.
- Tag every question with its **topic** so it appears on the topic page.
- Past paper questions: set the paper and question number, and copy the wording exactly.

### Adding many questions at once

In **Admin → Questions → Import many at once**, paste a whole set written like
`docs/content/o-level-maths-algebra-01.md`:

```
## Q1 · difficulty 2

**Stem**

Solve $3x - 7 = 11$.

**Options**

- A. $x = 4$
- B. $x = 6$
- C. $x = 7$
- D. $x = 18$

**Correct:** B

**Solution**

Add 7 to both sides: $3x = 18$, so $x = 6$.
```

Every question in one import gets the subject and topic chosen on the page and is saved as a
draft. **Check** lists problems by question; nothing is saved until all questions are valid.
A question already in the subject is skipped.

### The test bank

Tick **Test bank** on a question (or **Add to the test bank** when importing) to keep it for
competitive tests. Test-bank questions are hidden from practice until they have appeared in a
test that has closed. Prize tests draw their questions at random from the bank when they open,
so keep each subject's bank at least **three times** the size of a test.

## Worked solutions

Solutions are what students pay for, so they must teach, not just state the answer.

1. Start from what the question gives.
2. Name the rule or formula being used.
3. Show every step of working.
4. End with the answer and its unit.
5. Where useful, say why the most tempting wrong option is wrong.

## Notes

- One note per idea (e.g. "Solving linear equations", not "Algebra").
- Short paragraphs, a worked example, and a "Tips" or "Common mistakes" list.
- Follow the GCE Board syllabus wording for the topic.

## Before publishing

- Check every answer twice; a wrong answer key costs trust and can decide a prize.
- Preview the page on a phone.
- Content stays **Draft** until reviewed, then set to **Published**.
- Questions planned for a test stay hidden from practice automatically until that test
  closes.
