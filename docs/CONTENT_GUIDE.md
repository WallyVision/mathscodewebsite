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
