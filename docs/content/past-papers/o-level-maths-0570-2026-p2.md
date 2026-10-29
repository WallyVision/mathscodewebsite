# O Level Mathematics 0570 · June 2026 · Paper 2

Subject: **O Level Mathematics**. Past paper: **2026, Paper 2** (GCE Board, 0570). Structured questions.
Questions are copied as set. Worked solutions and the marking notes are our own.

Section A: answer all 10 questions. Section B: answer all four questions; each carries 15 marks.

---

# Section A

## A1 · 4 marks

**Question**

Evaluate $\frac{1}{2}$ of $\frac{1}{3} + \frac{1}{4}$.

**Solution**

"Of" means multiply, and in BODMAS it comes before addition, so work out $\frac{1}{2}$ of $\frac{1}{3}$ first:

$$
\frac{1}{2} \times \frac{1}{3} + \frac{1}{4} = \frac{1}{6} + \frac{1}{4}
$$

Add using the common denominator 12:

$$
\frac{1}{6} + \frac{1}{4} = \frac{2}{12} + \frac{3}{12} = \frac{5}{12}
$$

**Answer:** $\frac{5}{12}$

Note: if the question meant $\frac{1}{2}$ of $\left(\frac{1}{3} + \frac{1}{4}\right)$, the answer would be $\frac{1}{2} \times \frac{7}{12} = \frac{7}{24}$. As printed, without brackets, BODMAS gives $\frac{5}{12}$.

---

## A2 · 4 marks

**Question**

Simplify $5(k + 1) - 2k - 5$.

**Solution**

Expand the bracket, then collect like terms:

$$
5(k + 1) - 2k - 5 = 5k + 5 - 2k - 5 = 3k
$$

**Answer:** $3k$

---

## A3 · 4 marks

**Question**

Given that $a = \frac{b - c}{c}$, express $b$ in terms of $a$ and $c$.

**Solution**

Multiply both sides by $c$:

$$
ac = b - c
$$

Add $c$ to both sides:

$$
b = ac + c = c(a + 1)
$$

**Answer:** $b = ac + c$, or $b = c(a + 1)$

Check with $c = 2$, $a = 3$: $b = 2(4) = 8$, and $\frac{8 - 2}{2} = 3$. ✓

---

## A4 · 5 marks

**Question**

Given the universal set, $\xi = \{1, 2, 3, 4, 5, 6, 7, 8, 9\}$ and the sets, $A = \{2, 3, 5, 7\}$ and, $B = \{2, 4, 6, 8\}$, Find:

a) $A \cap B$.

b) $A \cup B$.

c) $n(A \cup B)$.

**Solution**

a) The intersection holds the elements in **both** sets. Only 2 is in both:

$$
A \cap B = \{2\}
$$

b) The union holds the elements in **either** set, each written once:

$$
A \cup B = \{2, 3, 4, 5, 6, 7, 8\}
$$

c) Count the elements of $A \cup B$:

$$
n(A \cup B) = 7
$$

Check: $n(A) + n(B) - n(A \cap B) = 4 + 4 - 1 = 7$. ✓

---

## A5 · 5 marks

**Question**

Given the matrices, $A = \begin{pmatrix} 2 & -4 \\ 3 & 6 \end{pmatrix}$ and $B = \begin{pmatrix} -3 & 8 \\ -6 & -11 \end{pmatrix}$.

a) Evaluate $2A + B$.

b) Write down the name of the resulting matrix $2A + B$.

**Solution**

a) Multiply every entry of $A$ by 2, then add $B$ entry by entry:

$$
2A = \begin{pmatrix} 4 & -8 \\ 6 & 12 \end{pmatrix}
$$

$$
2A + B = \begin{pmatrix} 4 + (-3) & -8 + 8 \\ 6 + (-6) & 12 + (-11) \end{pmatrix} = \begin{pmatrix} 1 & 0 \\ 0 & 1 \end{pmatrix}
$$

b) A square matrix with 1s on the leading diagonal and 0s everywhere else is the **identity matrix** (also called the unit matrix), $I$.

---

## A6 · 5 marks

**Question**

Given the network graph in figure 1.

Figure 1 is a network with six vertices: a left vertex, a right vertex, two top vertices and two bottom vertices, arranged like a hexagon. The left vertex is joined to the top-left and bottom-left vertices, and the right vertex to the top-right and bottom-right vertices. The two top vertices are joined, and so are the two bottom vertices. Inside, a line runs straight down from the top-left vertex to the bottom-left vertex, a diagonal runs from the top-left vertex to the bottom-right vertex, and a line runs straight down from the top-right vertex to the bottom-right vertex (like the letter N).

State the number of:

a) vertices (V),

b) edges (E),

c) regions (R) and

d) even vertices.

**Solution**

Name the vertices $L$ (left), $T_1$ (top left), $T_2$ (top right), $R$ (right), $B_2$ (bottom right) and $B_1$ (bottom left).

a) There are 6 vertices: $V = 6$.

b) The edges are $LT_1$, $LB_1$, $T_1T_2$, $T_2R$, $RB_2$, $B_1B_2$, $T_1B_1$, $T_1B_2$ and $T_2B_2$: $E = 9$.

c) Inside there are 4 regions (the triangles $LT_1B_1$, $T_1B_1B_2$, $T_1T_2B_2$ and $T_2RB_2$), plus the region outside the network: $R = 5$.

Check with Euler's formula, $V - E + R = 2$: $6 - 9 + 5 = 2$. ✓

d) The degree of a vertex is the number of edges meeting there:

| Vertex | $L$ | $T_1$ | $T_2$ | $R$ | $B_2$ | $B_1$ |
| ------ | --- | ----- | ----- | --- | ----- | ----- |
| Degree | 2   | 4     | 3     | 2   | 4     | 3     |

The even vertices are $L$, $T_1$, $R$ and $B_2$: there are **4 even vertices** (and 2 odd ones).

Check: the degrees add up to $18 = 2 \times 9$, twice the number of edges. ✓

---

## A7 · 4 marks

**Question**

The position vectors of the points A and B are such that $\vec{OA} = \mathbf{p}$, $\vec{OB} = \mathbf{q}$ and N is the midpoint of $AB$. Find in terms of $\mathbf{p}$ and $\mathbf{q}$ the vectors:

a) $\vec{AB}$,

b) $\vec{ON}$

**Solution**

a) Go from $A$ back to $O$, then out to $B$:

$$
\vec{AB} = \vec{AO} + \vec{OB} = -\mathbf{p} + \mathbf{q} = \mathbf{q} - \mathbf{p}
$$

b) $N$ is halfway along $AB$, so $\vec{AN} = \frac{1}{2}\vec{AB}$:

$$
\vec{ON} = \vec{OA} + \frac{1}{2}\vec{AB} = \mathbf{p} + \frac{1}{2}(\mathbf{q} - \mathbf{p}) = \frac{1}{2}(\mathbf{p} + \mathbf{q})
$$

---

## A8 · 4 marks

**Question**

Solve the pair of simultaneous equations.

$$
2m + n = 5
$$

$$
m - n = -2
$$

**Solution**

Add the two equations to eliminate $n$:

$$
3m = 3 \quad\Rightarrow\quad m = 1
$$

Substitute into $m - n = -2$: $1 - n = -2$, so $n = 3$.

**Answer:** $m = 1$, $n = 3$

Check in the first equation: $2(1) + 3 = 5$. ✓

---

## A9 · 4 marks

**Question**

Solve the inequality $2 - 3x \le 11$.

**Solution**

Subtract 2 from both sides:

$$
-3x \le 9
$$

Divide by $-3$. Dividing by a **negative** number reverses the inequality sign:

$$
x \ge -3
$$

**Answer:** $x \ge -3$

Check with $x = 0$ (which satisfies $x \ge -3$): $2 - 0 = 2 \le 11$. ✓

---

## A10 · 4 marks

**Question**

The table shows the number of pieces of paper picked by students in a dirty classroom.

| Number of pieces of paper | 0   | 1   | 2   | 3   | 4   | 5   |
| ------------------------- | --- | --- | --- | --- | --- | --- |
| Number of students        | 1   | 2   | 5   | 4   | 6   | 2   |

Find the probability that a student chosen at random picked 4 pieces of paper.

**Solution**

Total number of students: $1 + 2 + 5 + 4 + 6 + 2 = 20$.

Six of them picked 4 pieces of paper:

$$
P(4 \text{ pieces}) = \frac{6}{20} = \frac{3}{10}
$$

**Answer:** $\frac{3}{10}$ (or $0.3$)

---

# Section B

## B1 · 15 marks

**Question**

A man and his wife with two of their children went for a 5-days pleasure trip. They hired a car to use for the trip. The daily rental price for the car was 18,000FCFA. The car consumed fuel at the rate of 12,500 FCFA per day. Calculate:

a) the cost of running the car for 1 day.

b) the total cost of running the car for 5 days.

They lodged in two rooms in a hotel where each room costed 15,000 FCFA per day.

c) Calculate their total cost of lodging for the 5 days.

The daily feeding for the family was 15,000 FCFA.

Calculate:

d) the total cost of feeding for the whole family during the 5 days.

e) the total amount spent by the family for the 5 days.

The man and wife decided to pay the bills for the trip in the ratio 3:2 respectively.

f) Find the amount that the man paid.

**Solution**

a) Running the car each day costs the rental plus the fuel:

$$
18\,000 + 12\,500 = 30\,500 \text{ FCFA}
$$

b) For 5 days:

$$
5 \times 30\,500 = 152\,500 \text{ FCFA}
$$

c) Two rooms at 15 000 FCFA each, for 5 days:

$$
2 \times 15\,000 \times 5 = 150\,000 \text{ FCFA}
$$

d) Feeding at 15 000 FCFA a day for the whole family:

$$
5 \times 15\,000 = 75\,000 \text{ FCFA}
$$

e) Add the three costs:

$$
152\,500 + 150\,000 + 75\,000 = 377\,500 \text{ FCFA}
$$

f) The ratio $3 : 2$ has $3 + 2 = 5$ parts, and the man pays 3 of them:

$$
\frac{3}{5} \times 377\,500 = 226\,500 \text{ FCFA}
$$

Check: the wife pays $\frac{2}{5} \times 377\,500 = 151\,000$, and $226\,500 + 151\,000 = 377\,500$. ✓

Watch out in c): there are **two** rooms, so the daily lodging cost is 30 000 FCFA, not 15 000 FCFA. In d), the 15 000 FCFA is already for the whole family, so do not multiply by 4 people.

---

## B2 · 15 marks

**Question**

(i) The table shows the distribution of marks scored by students in a Mathematics test.

| Marks ($x$)     | 1–3 | 4–6 | 7–9 | 10–12 | 13–15 | 16–18 |
| --------------- | --- | --- | --- | ----- | ----- | ----- |
| Frequency ($f$) | 3   | 7   | 15  | 20    | 11    | 4     |

State the:

a) upper class boundary of the class 10–12.

b) modal class of the distribution.

Find the:

c) number of students who wrote the test.

d) class mark of each class.

e) mean mark of the distribution to 2 decimal places. (10 marks)

(ii) The functions $f$ and $g$ are defined on the set, $\mathbb{R}$ of real numbers by $f : x \mapsto 2x$, and $g : x \mapsto x^2$.

a) Evaluate $f(2)$.

b) Express in a similar manner, the function, $gf(x)$. (5 marks)

**Solution**

**(i)**

a) The classes have gaps of 1 between them (12 to 13), so each boundary is halfway across the gap. The upper class boundary of 10–12 is

$$
12.5
$$

b) The modal class is the class with the highest frequency: **10–12** (frequency 20).

c) Add the frequencies:

$$
\sum f = 3 + 7 + 15 + 20 + 11 + 4 = 60 \text{ students}
$$

d) The class mark is the midpoint of each class, $\frac{\text{lower limit} + \text{upper limit}}{2}$:

| Class          | 1–3 | 4–6 | 7–9 | 10–12 | 13–15 | 16–18 |
| -------------- | --- | --- | --- | ----- | ----- | ----- |
| Class mark $x$ | 2   | 5   | 8   | 11    | 14    | 17    |

e) Multiply each class mark by its frequency:

| $x$  | 2   | 5   | 8   | 11  | 14  | 17  | Total |
| ---- | --- | --- | --- | --- | --- | --- | ----- |
| $f$  | 3   | 7   | 15  | 20  | 11  | 4   | 60    |
| $fx$ | 6   | 35  | 120 | 220 | 154 | 68  | 603   |

$$
\bar{x} = \frac{\sum fx}{\sum f} = \frac{603}{60} = 10.05
$$

**Answer:** mean mark $= 10.05$

**(ii)**

a) $f(2) = 2 \times 2 = 4$

b) $gf(x)$ means "do $f$ first, then $g$":

$$
gf(x) = g\big(f(x)\big) = g(2x) = (2x)^2 = 4x^2
$$

Written in the same way as $f$ and $g$:

$$
gf : x \mapsto 4x^2
$$

Watch out: $gf$ is **not** $fg$. Doing $g$ first gives $fg(x) = 2x^2$, a different function.

---

## B3 · 15 marks

**Question**

(i) Given an acute angle $\Theta$, where $\sin \Theta = \frac{1}{2}$.

a) Find the value of $\Theta$ in degrees.

b) Evaluate $\cos \Theta$ to 2 decimal places. (4 marks)

(ii) A sequence is given as $2, 5, 8, \ldots$

Find:

a) the common difference of the sequence.

b) the $5^{\text{th}}$ term of the sequence.

c) the sum of the first 5 terms. (6 marks)

(iii) Using a pencil, a ruler and a pair of compasses only,

a) draw a circle of radius 4 cm.

b) mark a point P on the circumference and construct a chord PQ = 6 cm.

c) construct another chord QR = 6 cm.

d) join P to R. (5 marks)

**Solution**

**(i)**

a) The acute angle whose sine is $\frac{1}{2}$ is

$$
\Theta = \sin^{-1}\left(\frac{1}{2}\right) = 30^\circ
$$

b)

$$
\cos 30^\circ = \frac{\sqrt{3}}{2} = 0.8660\ldots = 0.87 \text{ (2 d.p.)}
$$

**(ii)**

a) Each term is 3 more than the one before: $5 - 2 = 3$ and $8 - 5 = 3$. The common difference is $d = 3$.

b) The first term is $a = 2$. The $n$th term of an arithmetic sequence is $a + (n - 1)d$:

$$
T_5 = 2 + (5 - 1) \times 3 = 2 + 12 = 14
$$

c) Use $S_n = \frac{n}{2}\big[2a + (n - 1)d\big]$:

$$
S_5 = \frac{5}{2}\big[2(2) + 4(3)\big] = \frac{5}{2} \times 16 = 40
$$

Check by listing the terms: $2 + 5 + 8 + 11 + 14 = 40$. ✓

**(iii)** Construction steps:

a) Open the compasses to 4 cm on the ruler. Put the point down at a centre $O$ and draw the circle.

b) Mark any point $P$ on the circle. Open the compasses to 6 cm. With the point at $P$, draw an arc cutting the circle; call the crossing point $Q$. Join $P$ to $Q$ with the ruler.

c) Keeping the compasses at 6 cm, put the point at $Q$ and draw an arc cutting the circle on the other side from $P$; call this point $R$. Join $Q$ to $R$.

d) Join $P$ to $R$ with the ruler.

Check your drawing: $PR$ should measure about $7.9$ cm. Each 6 cm chord makes an angle of about $97^\circ$ at the centre, so $PR$ is the chord for the remaining $166^\circ$ or so. Do not rub out the construction arcs: they earn marks.

---

## B4 · 15 marks

**Question**

(i) Given the function $f(x) = x^2 - 5x + 4$, $x \in \mathbb{R}$, the set of real numbers.

a) Construct a table of values of $f(x)$ for $-1 \le x \le 5$.

Taking 2 cm to represent 1 unit on the $x$-axis and 1 cm to represent 1 unit on the $y$-axis, draw the graph of $y = f(x)$ or otherwise,

b) solve the equation $f(x) = 0$.

c) Write down the equation of the line of symmetry. (9 marks)

(ii) Given that $(x - 1)$ is a factor of $f(x)$, where $f(x) = x^2 + mx - 3$

a) Find the value of $m$.

With the value of $m$,

b) Find the other factor.

c) Solve the equation $x^2 + mx - 3 = 0$. (6 marks)

**Solution**

**(i)**

a) Work out each value, for example $f(-1) = (-1)^2 - 5(-1) + 4 = 1 + 5 + 4 = 10$:

| $x$    | $-1$ | $0$ | $1$  | $2$   | $3$   | $4$   | $5$   |
| ------ | ---- | --- | ---- | ----- | ----- | ----- | ----- |
| $x^2$  | 1    | 0   | 1    | 4     | 9     | 16    | 25    |
| $-5x$  | 5    | 0   | $-5$ | $-10$ | $-15$ | $-20$ | $-25$ |
| $+4$   | 4    | 4   | 4    | 4     | 4     | 4     | 4     |
| $f(x)$ | 10   | 4   | 0    | $-2$  | $-2$  | 0     | 4     |

Plot the points with the given scales and join them with a smooth U-shaped curve (not straight lines). The lowest point is between $x = 2$ and $x = 3$, at $(2.5, -2.25)$.

b) $f(x) = 0$ where the curve crosses the $x$-axis:

$$
x = 1 \quad \text{or} \quad x = 4
$$

Otherwise, by factorising: $x^2 - 5x + 4 = (x - 1)(x - 4) = 0$, so $x = 1$ or $x = 4$.

c) The curve is symmetrical about the vertical line halfway between the roots 1 and 4:

$$
x = \frac{1 + 4}{2} = 2.5
$$

The line of symmetry is $x = 2.5$ (or $x = \frac{5}{2}$).

**(ii)**

a) If $(x - 1)$ is a factor, then $f(1) = 0$ (factor theorem):

$$
1^2 + m(1) - 3 = 0 \quad\Rightarrow\quad m - 2 = 0 \quad\Rightarrow\quad m = 2
$$

b) Now $f(x) = x^2 + 2x - 3$. Find two numbers that multiply to $-3$ and add to $2$: $3$ and $-1$.

$$
x^2 + 2x - 3 = (x - 1)(x + 3)
$$

The other factor is $(x + 3)$.

c)

$$
(x - 1)(x + 3) = 0 \quad\Rightarrow\quad x = 1 \quad \text{or} \quad x = -3
$$
