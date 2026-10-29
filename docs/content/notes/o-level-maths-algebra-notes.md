# O Level Mathematics · Algebra · Revision notes

Five notes for the topic **Algebra** (O Level Mathematics), one idea per note, matching the
20-question Algebra set.

To add all five: **Admin → Notes → Import many at once**, choose O Level Mathematics → Algebra,
choose this file (or paste it) and press **Check**, then **Import notes**. Importing twice is safe:
notes the topic already has are skipped.

---

# Note 1

**Title:** Simplifying and expanding expressions

**URL name:** simplifying-and-expanding

**Body**

## Like terms

Terms are **like terms** when they have exactly the same letters raised to the same powers.
Only like terms can be added or subtracted.

| Like terms        | Not like terms  |
| ----------------- | --------------- |
| $3a$ and $-a$     | $3a$ and $3b$   |
| $5x^2$ and $2x^2$ | $5x^2$ and $5x$ |
| $4ab$ and $ba$    | $4ab$ and $4a$  |

**Example.** Simplify $3a + 5b - a + 2b$.

Group the like terms, keeping each sign with the term after it:

$$
3a - a + 5b + 2b = 2a + 7b
$$

$2a + 7b$ cannot be simplified further: $a$ and $b$ are unlike terms.

## Expanding one bracket

Multiply **every** term inside the bracket by the term outside.

$$
-2(3x - 4) = -6x + 8
$$

A negative number outside changes the sign of every term inside.

## Expanding two brackets

Multiply each term in the first bracket by each term in the second. Then collect like terms.

$$
(x + 3)(x - 5) = x^2 - 5x + 3x - 15 = x^2 - 2x - 15
$$

Two results are worth learning by heart:

$$
\begin{aligned}
(a + b)^2 &= a^2 + 2ab + b^2 \\
(a - b)(a + b) &= a^2 - b^2
\end{aligned}
$$

## Substitution

Replace each letter by its value **in brackets**, then follow the order of operations
(brackets, powers, then multiplication and division, then addition and subtraction).

**Example.** Find $2x^2 - 3y$ when $x = -3$ and $y = 4$.

$$
2(-3)^2 - 3(4) = 2(9) - 12 = 6
$$

## Common mistakes

- Writing $(x + 3)^2 = x^2 + 9$. The middle term is missing: it is $x^2 + 6x + 9$.
- Multiplying only the first term: $3(2x - 5) \ne 6x - 5$.
- Squaring before the sign: $(-3)^2 = +9$, but $-3^2 = -9$.
- Adding unlike terms: $2a + 7b \ne 9ab$.

---

# Note 2

**Title:** Factorising

**URL name:** factorising

**Body**

Factorising is the reverse of expanding: it writes an expression as a product of brackets.
Always check your answer by expanding it again.

## 1. Common factor

Take out the **highest common factor** of all the terms.

$$
6x^2 - 9x = 3x(2x - 3)
$$

Factorise **completely**: $x(6x - 9)$ is not finished, because $3$ is still a common factor
inside the bracket.

## 2. Difference of two squares

$$
a^2 - b^2 = (a - b)(a + b)
$$

$$
4x^2 - 25 = (2x)^2 - 5^2 = (2x - 5)(2x + 5)
$$

There is no such rule for a **sum** of two squares: $x^2 + 25$ does not factorise.

## 3. Quadratics $x^2 + bx + c$

Find two numbers that **multiply to $c$** and **add to $b$**.

**Example.** $x^2 - 7x + 12$: the numbers are $-3$ and $-4$ (product $12$, sum $-7$).

$$
x^2 - 7x + 12 = (x - 3)(x - 4)
$$

| Signs in the quadratic | Signs of the two numbers   |
| ---------------------- | -------------------------- |
| $+b$, $+c$             | both positive              |
| $-b$, $+c$             | both negative              |
| $c$ negative           | one positive, one negative |

## 4. Quadratics $ax^2 + bx + c$ with $a \ne 1$

Multiply $a \times c$, find two numbers that multiply to $ac$ and add to $b$, split the middle
term, then factorise in pairs.

**Example.** $2x^2 + 3x - 2$. Here $ac = -4$; the numbers are $4$ and $-1$.

$$
\begin{aligned}
2x^2 + 4x - x - 2 &= 2x(x + 2) - 1(x + 2) \\
&= (2x - 1)(x + 2)
\end{aligned}
$$

## Tips

- Always look for a common factor first: $2x^2 - 18 = 2(x^2 - 9) = 2(x - 3)(x + 3)$.
- Check by expanding: the middle term is where most mistakes hide.

---

# Note 3

**Title:** Linear and simultaneous equations

**URL name:** linear-and-simultaneous-equations

**Body**

## Linear equations

Whatever you do to one side, do to the other. Aim to get the letter alone.

**Example.** Solve $5x + 3 = 2x - 9$.

$$
\begin{aligned}
5x - 2x &= -9 - 3 \\
3x &= -12 \\
x &= -4
\end{aligned}
$$

**Check** by substituting: $5(-4) + 3 = -17$ and $2(-4) - 9 = -17$. ✓

**Equations with fractions.** Multiply every term by the lowest common denominator first.

$$
\frac{x}{3} + 2 = 5 \quad\Rightarrow\quad x + 6 = 15 \quad\Rightarrow\quad x = 9
$$

## Forming equations from words

Choose a letter for the unknown, write the equation, solve it, then answer the question
that was asked.

**Example.** Three consecutive whole numbers add up to 72. Find the smallest.

Let the numbers be $n$, $n + 1$, $n + 2$. Then $3n + 3 = 72$, so $n = 23$. The smallest is 23.

## Simultaneous equations

Two equations, two unknowns. Find values that satisfy **both**.

**Elimination.** Make the coefficients of one letter equal, then add or subtract.

$$
\begin{aligned}
x + y &= 7 \\
x - y &= 3
\end{aligned}
$$

Add the equations: $2x = 10$, so $x = 5$. Then $y = 7 - 5 = 2$.

**Substitution.** Rearrange one equation for one letter and substitute into the other.

$$
2x + 3y = 12, \qquad x - y = 1
$$

From the second, $x = y + 1$. Then $2(y + 1) + 3y = 12$, so $5y = 10$, $y = 2$ and $x = 3$.

## Common mistakes

- Changing a sign wrongly when moving a term across: $5x + 3 = 2x - 9$ gives $3x = -12$, not $-6$.
- Expanding $2(y + 1)$ as $2y + 1$.
- Finding $x$ and forgetting to find $y$.
- Not checking the answer in **both** equations.

---

# Note 4

**Title:** Quadratic equations

**URL name:** quadratic-equations

**Body**

A quadratic equation can be written as $ax^2 + bx + c = 0$ with $a \ne 0$. It usually has
**two** solutions (roots).

## Method 1: factorising

1. Make one side zero.
2. Factorise.
3. Set each bracket equal to zero.

**Example.** $x^2 - 5x + 6 = 0$

$$
(x - 2)(x - 3) = 0 \quad\Rightarrow\quad x = 2 \ \text{or}\ x = 3
$$

This works because if two numbers multiply to give zero, one of them must be zero.

**Example.** $2x^2 + 3x - 2 = 0$

$$
(2x - 1)(x + 2) = 0 \quad\Rightarrow\quad x = \tfrac{1}{2} \ \text{or}\ x = -2
$$

## Method 2: the quadratic formula

When the quadratic does not factorise easily:

$$
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$

**Example.** $x^2 + 4x - 1 = 0$, with $a = 1$, $b = 4$, $c = -1$.

$$
x = \frac{-4 \pm \sqrt{16 + 4}}{2} = \frac{-4 \pm \sqrt{20}}{2}
$$

So $x \approx 0.236$ or $x \approx -4.236$.

## Common mistakes

- Not making one side zero first: $x^2 = 5x$ must become $x^2 - 5x = 0$, so $x(x - 5) = 0$.
  Dividing both sides by $x$ loses the solution $x = 0$.
- Sign errors: $(x - 2) = 0$ gives $x = +2$.
- Forgetting to divide: $2x - 1 = 0$ gives $x = \tfrac{1}{2}$, not $x = 1$.
- In the formula, $-b$ with $b = -5$ is $+5$, and $b^2$ is always positive.

---

# Note 5

**Title:** Changing the subject, inequalities and variation

**URL name:** subject-inequalities-variation

**Body**

## Changing the subject of a formula

Undo the operations in **reverse order**, doing the same to both sides.

**Example.** Make $x$ the subject of $y = \dfrac{3x - 2}{5}$.

$$
\begin{aligned}
5y &= 3x - 2 &&\text{(multiply by 5)} \\
5y + 2 &= 3x &&\text{(add 2)} \\
x &= \frac{5y + 2}{3} &&\text{(divide by 3)}
\end{aligned}
$$

**With a square.** $A = \pi r^2$ gives $r^2 = \dfrac{A}{\pi}$, so $r = \sqrt{\dfrac{A}{\pi}}$.

## Inequalities

Solve them like equations, with **one extra rule**:

> When you multiply or divide both sides by a **negative** number, reverse the inequality sign.

$$
-2x + 5 \le 13 \quad\Rightarrow\quad -2x \le 8 \quad\Rightarrow\quad x \ge -4
$$

On a number line, use a closed dot for $\le$ or $\ge$ (the number is included) and an open dot
for $<$ or $>$ (not included).

## Variation

| Statement                       | Formula            | As $x$ increases, $y$ |
| ------------------------------- | ------------------ | --------------------- |
| $y$ varies directly as $x$      | $y = kx$           | increases             |
| $y$ varies inversely as $x$     | $y = \dfrac{k}{x}$ | decreases             |
| $y$ varies as the square of $x$ | $y = kx^2$         | increases faster      |

**Method:** write the formula with $k$, use the given values to find $k$, then answer.

**Example.** $y$ varies inversely as $x$, and $y = 6$ when $x = 4$. Then $k = 6 \times 4 = 24$,
so when $x = 3$, $y = \dfrac{24}{3} = 8$.

## Common mistakes

- Undoing operations in the wrong order when changing the subject.
- Forgetting to reverse the sign when dividing by a negative number.
- Using direct variation when the question says "inversely".
