# O Level Additional Mathematics · June 2021 · Paper 2

Subject: **O Level Additional Mathematics**. Past paper: **2021, Paper 2** (GCE Board). Structured questions.
Questions are copied as set (obvious slips corrected and noted). Worked solutions are our own.

To add it: create the **2021 Paper 2** past paper for O Level Additional Mathematics, open it in
**Admin → Past papers**, press **Import many** under **Written questions**, choose this file and
press **Check**, then **Import questions**. Labels the paper already has are skipped, so importing
twice is safe.

Section A (Pure Mathematics) is compulsory. Candidates then answer any two questions from **either**
Section B (Mechanics) **or** Section C (Statistics and Probability). Take $g = 9.8\text{ m s}^{-2}$.

---

# Section A

## 1 · 8 marks

**Question**

(i) Given that $(x + 2)$ is a factor of $f(x)$, where $f(x) = x^3 + 3x^2 + kx + 6$,

(a) find the value of $k$; **(2 marks)**

(b) with this value of $k$, show that $f(x) = (x + 2)(x^2 + x + 3)$. **(2 marks)**

(ii) Given that $\alpha$ and $\beta$ are the roots of the equation $2x^2 + x - 3 = 0$,

(a) find the values of $\alpha + \beta$ and $\alpha\beta$; **(2 marks)**

(b) hence write down another equation, with integral coefficients, whose roots are $\frac{1}{\alpha}$ and $\frac{1}{\beta}$. **(2 marks)**

**Solution**

**(i)(a)** By the factor theorem, $f(-2) = 0$:

$$
(-2)^3 + 3(-2)^2 + k(-2) + 6 = -8 + 12 - 2k + 6 = 10 - 2k = 0 \quad\Rightarrow\quad k = 5
$$

**(i)(b)**

$$
(x + 2)(x^2 + x + 3) = x^3 + x^2 + 3x + 2x^2 + 2x + 6 = x^3 + 3x^2 + 5x + 6 = f(x) \ ✓
$$

**(ii)(a)** $\alpha + \beta = -\frac{b}{a} = -\frac{1}{2}$ and $\alpha\beta = \frac{c}{a} = -\frac{3}{2}$.

**(ii)(b)** For the new roots:

$$
\frac{1}{\alpha} + \frac{1}{\beta} = \frac{\alpha + \beta}{\alpha\beta} = \frac{-\frac{1}{2}}{-\frac{3}{2}} = \frac{1}{3}, \qquad \frac{1}{\alpha} \cdot \frac{1}{\beta} = \frac{1}{\alpha\beta} = -\frac{2}{3}
$$

So $x^2 - \frac{1}{3}x - \frac{2}{3} = 0$. Multiply by 3 for integral coefficients:

$$
3x^2 - x - 2 = 0
$$

Check: $2x^2 + x - 3 = (2x + 3)(x - 1)$ has roots $1$ and $-\frac{3}{2}$; their reciprocals $1$ and $-\frac{2}{3}$ are the roots of $(x - 1)(3x + 2) = 3x^2 - x - 2$. ✓

---

## 2

**Question**

(i) Find the number of ways of selecting a class prefect boy and a class prefect girl from a class of 4 boys and 5 girls.

(ii) Write down the first three terms of the binomial expansion of $(1 - 2x)^{-1}$ in ascending powers of $x$, simplifying your answer as far as possible. **(4 marks)**

**Solution**

**(i)** There are 4 ways to choose the boy and, for each, 5 ways to choose the girl:

$$
4 \times 5 = 20 \text{ ways}
$$

**(ii)** Use $(1 + y)^n = 1 + ny + \frac{n(n - 1)}{2!}y^2 + \ldots$ with $n = -1$ and $y = -2x$:

$$
(1 - 2x)^{-1} = 1 + (-1)(-2x) + \frac{(-1)(-2)}{2}(-2x)^2 + \ldots = 1 + 2x + 4x^2 + \ldots
$$

(valid for $|x| < \frac{1}{2}$).

**Note:** the source does not give the marks for part (i).

---

## 3 · 8 marks

**Question**

The basic salary of a teacher in a school is 100,000 FCFA and the salary is increased monthly by 10%. The table below shows the salary for the first 3 months.

| Month | Monthly increment ($I$) | Monthly salary ($M$) |
| ----- | ----------------------- | -------------------- |
| 1     | $I_1 = 0$               | $M_1 = 100\,000$     |
| 2     | $I_2 = 10\,000$         | $M_2 = 110\,000$     |
| 3     | $I_3 = 11\,000$         | $M_3 = 121\,000$     |

(a) Show that $\frac{M_3}{M_2} = \frac{M_2}{M_1}$. **(2 marks)**

Hence or otherwise, find

(b) the salary for the sixth month, **(3 marks)**

(c) the total salary earned by the teacher within the first 6 months. **(3 marks)**

**Solution**

**(a)**

$$
\frac{M_3}{M_2} = \frac{121\,000}{110\,000} = 1.1, \qquad \frac{M_2}{M_1} = \frac{110\,000}{100\,000} = 1.1
$$

They are equal, so the salaries form a geometric progression with first term $a = 100\,000$ and common ratio $r = 1.1$.

**(b)**

$$
M_6 = ar^5 = 100\,000 \times 1.1^5 = 100\,000 \times 1.61051 = 161\,051 \text{ FCFA}
$$

**(c)**

$$
S_6 = \frac{a(r^6 - 1)}{r - 1} = \frac{100\,000(1.1^6 - 1)}{0.1} = 1\,000\,000 \times 0.771561 = 771\,561 \text{ FCFA}
$$

**Note:** the source prints the increments as 1,000 and 1,100; a 10% rise on 100,000 is 10,000, and the salaries in the table agree with that.

---

## 4 · 9 marks

**Question**

(i) The binary operation $*$ is defined over the set $S = \{1, 2, 3, 4\}$ as $x * y = x^y \pmod 5$.

(a) Copy and complete the operation table below for $(S, *)$. **(3 marks)**

| $*$   | 1   | 2   | 3   | 4   |
| ----- | --- | --- | --- | --- |
| **1** | 1   |     | 1   | 1   |
| **2** | 2   | 4   |     | 1   |
| **3** | 3   | 4   | 2   |     |
| **4** | 4   |     | 3   | 1   |

(b) Give a reason why $(S, *)$ does not form a group. [Assume associativity.] **(1 mark)**

(ii) Given the matrix $M = \begin{pmatrix} 2 & -1 \\ -1 & 2 \end{pmatrix}$,

(a) find the inverse of $M$; **(3 marks)**

(b) hence or otherwise, find the point whose image is $(5, -1)$ under the transformation represented by the matrix $M$. **(2 marks)**

**Solution**

**(i)(a)** Work out each power and take the remainder on division by 5:

| $*$   | 1   | 2     | 3     | 4     |
| ----- | --- | ----- | ----- | ----- |
| **1** | 1   | **1** | 1     | 1     |
| **2** | 2   | 4     | **3** | 1     |
| **3** | 3   | 4     | 2     | **1** |
| **4** | 4   | **1** | 4     | 1     |

For example $2^3 = 8 \equiv 3$, $3^4 = 81 \equiv 1$, $4^2 = 16 \equiv 1$ and $4^3 = 64 \equiv 4$.

**(i)(b)** There is no identity element. Column 1 copies the headings ($x * 1 = x$), but row 1 does not: $1 * 2 = 1 \ne 2$. So no element $e$ satisfies $x * e = e * x = x$ for every $x$.

(Also, rows repeat elements, for example row 1 is all 1s, so some elements have no inverse.)

**(ii)(a)** $\det M = (2)(2) - (-1)(-1) = 3$. Swap the leading diagonal and change the signs of the other entries:

$$
M^{-1} = \frac{1}{3}\begin{pmatrix} 2 & 1 \\ 1 & 2 \end{pmatrix}
$$

**(ii)(b)** The point is $M^{-1}\begin{pmatrix} 5 \\ -1 \end{pmatrix}$:

$$
\frac{1}{3}\begin{pmatrix} 2(5) + 1(-1) \\ 1(5) + 2(-1) \end{pmatrix} = \frac{1}{3}\begin{pmatrix} 9 \\ 3 \end{pmatrix} = \begin{pmatrix} 3 \\ 1 \end{pmatrix}
$$

The point is $(3, 1)$. Check: $M\begin{pmatrix} 3 \\ 1 \end{pmatrix} = \begin{pmatrix} 6 - 1 \\ -3 + 2 \end{pmatrix} = \begin{pmatrix} 5 \\ -1 \end{pmatrix}$. ✓

**Note:** the source prints the set as $\{1, 2, 3, 3\}$; the table shows it is $\{1, 2, 3, 4\}$.

---

## 5 · 8 marks

**Question**

A woman has $x$ cups of beans and $y$ cups of corn to prepare corn chaff. Given that

- she must use at least 2 cups of beans and at least 4 cups of corn,
- the quantity of corn she uses must be greater than or equal to the quantity of beans,

and that she has at most 20 cups of beans and corn in all to prepare the corn chaff,

(a) write down four inequalities in terms of $x$ and $y$ that satisfy these conditions. **(3 marks)**

On graph paper, taking 1 cm for 2 units on both axes,

(b) shade so as to leave unshaded the region represented by these inequalities. **(3 marks)**

Given that a cup of beans costs 100 francs and a cup of corn 50 francs,

(c) find the maximum expenditure that can be incurred by the woman. **(2 marks)**

**Solution**

**(a)**

$$
x \ge 2, \qquad y \ge 4, \qquad y \ge x, \qquad x + y \le 20
$$

**(b)** Draw $x = 2$, $y = 4$, $y = x$ and $x + y = 20$, and shade the unwanted side of each. The unshaded region is the quadrilateral with corners

- $(2, 4)$, where $x = 2$ meets $y = 4$;
- $(4, 4)$, where $y = 4$ meets $y = x$;
- $(10, 10)$, where $y = x$ meets $x + y = 20$;
- $(2, 18)$, where $x = 2$ meets $x + y = 20$.

**(c)** The cost is $C = 100x + 50y$. Check it at each corner:

| Corner       | $(2, 4)$ | $(4, 4)$ | $(10, 10)$ | $(2, 18)$ |
| ------------ | -------- | -------- | ---------- | --------- |
| $C$ (francs) | 400      | 600      | 1500       | 1100      |

The maximum expenditure is **1500 francs**, with 10 cups of beans and 10 cups of corn.

---

## 6 · 6 marks

**Question**

(i) Solve for $\theta$, in the range $0^\circ \le \theta \le 360^\circ$, the equation $\sin 2\theta - \cos\theta = 0$. **(3 marks)**

(ii) The function $f(x) = \sqrt{3}\sin x + \cos x$, where $0 \le x \le 2\pi$.

(a) Copy and complete the table of values of $f(x)$ (to 1 decimal place) for $x = 0, \frac{\pi}{6}, \frac{\pi}{3}, \ldots, 2\pi$.

Taking 1 cm to represent $\frac{\pi}{6}$ radians on the $x$-axis and 2 cm to represent 1 unit on the $y$-axis,

(b) draw the graph of $y = f(x)$. **(2 marks)**

From the graph or otherwise,

(c) write down the maximum value of $f(x)$. **(1 mark)**

**Solution**

**(i)** Use $\sin 2\theta = 2\sin\theta\cos\theta$ and factorise. Do not divide by $\cos\theta$, or you lose solutions:

$$
2\sin\theta\cos\theta - \cos\theta = 0 \quad\Rightarrow\quad \cos\theta(2\sin\theta - 1) = 0
$$

- $\cos\theta = 0$: $\theta = 90^\circ$ or $270^\circ$;
- $\sin\theta = \frac{1}{2}$: $\theta = 30^\circ$ or $150^\circ$.

$$
\theta = 30^\circ,\ 90^\circ,\ 150^\circ,\ 270^\circ
$$

**(ii)(a)**

| $x$    | $0$ | $\frac{\pi}{6}$ | $\frac{\pi}{3}$ | $\frac{\pi}{2}$ | $\frac{2\pi}{3}$ | $\frac{5\pi}{6}$ | $\pi$ | $\frac{7\pi}{6}$ | $\frac{4\pi}{3}$ | $\frac{3\pi}{2}$ | $\frac{5\pi}{3}$ | $\frac{11\pi}{6}$ | $2\pi$ |
| ------ | --- | --------------- | --------------- | --------------- | ---------------- | ---------------- | ----- | ---------------- | ---------------- | ---------------- | ---------------- | ----------------- | ------ |
| $f(x)$ | 1   | 1.7             | 2               | 1.7             | 1                | 0                | −1    | −1.7             | −2               | −1.7             | −1               | 0                 | 1      |

For example $f\left(\frac{\pi}{3}\right) = \sqrt{3} \times \frac{\sqrt{3}}{2} + \frac{1}{2} = 2$.

**(ii)(b)** Plot the points and join them with a smooth wave. It is a sine curve of height 2 shifted $\frac{\pi}{6}$ to the left: $f(x) = 2\sin\left(x + \frac{\pi}{6}\right)$.

**(ii)(c)** The maximum value is $2$, at $x = \frac{\pi}{3}$.

**Note:** the partly filled table in the source is misaligned, so here the whole row is to be completed.

---

## 7 · 8 marks

**Question**

The points $P$ and $Q$ have position vectors $3\mathbf{i} - 2\mathbf{j}$ and $2\mathbf{i} + 3\mathbf{j}$ respectively.

(a) Write down the vector equation of the line $l_1$ passing through $P$ and $Q$ in the form $\mathbf{r} = \mathbf{a} + t\mathbf{b}$, where $t$ is a scalar. **(2 marks)**

Another line, $l_2$, has vector equation $\mathbf{r} = 2\mathbf{i} + 3\mathbf{j} + s(5\mathbf{i} + \mathbf{j})$, where $s$ is also a scalar. Find

(b) the position vector of the point of intersection of the lines $l_1$ and $l_2$, **(4 marks)**

(c) the angle between the lines $l_1$ and $l_2$. **(2 marks)**

**Solution**

**(a)** Direction $\overrightarrow{PQ} = (2\mathbf{i} + 3\mathbf{j}) - (3\mathbf{i} - 2\mathbf{j}) = -\mathbf{i} + 5\mathbf{j}$:

$$
l_1 : \mathbf{r} = 3\mathbf{i} - 2\mathbf{j} + t(-\mathbf{i} + 5\mathbf{j})
$$

**(b)** Equate the $\mathbf{i}$ and $\mathbf{j}$ parts:

$$
3 - t = 2 + 5s, \qquad -2 + 5t = 3 + s
$$

From the first, $t = 1 - 5s$. Substitute in the second: $-2 + 5 - 25s = 3 + s$, so $s = 0$ and $t = 1$.

The point of intersection is $2\mathbf{i} + 3\mathbf{j}$ (which is $Q$).

**(c)** The direction vectors are $-\mathbf{i} + 5\mathbf{j}$ and $5\mathbf{i} + \mathbf{j}$:

$$
(-1)(5) + (5)(1) = 0
$$

The dot product is zero, so the lines are perpendicular: the angle is $90^\circ$.

---

## 8 · 8 marks

**Question**

(i) The function $f$ is defined by

$$
f(x) = \begin{cases} -x^2, & x < 0 \\ x^2, & x \ge 0 \end{cases}
$$

(a) Define, in a similar manner, the gradient function $f'(x)$. **(2 marks)**

(b) Evaluate $f'(-2)$. **(2 marks)**

(ii) Evaluate $\displaystyle\int_0^{\pi/4} (2x + \sin 2x)\,dx$. **(4 marks)**

**Solution**

**(i)(a)** Differentiate each piece:

$$
f'(x) = \begin{cases} -2x, & x < 0 \\ 2x, & x \ge 0 \end{cases}
$$

(Both pieces give gradient 0 at $x = 0$, so the curve is smooth there.)

**(i)(b)** $-2 < 0$, so use the first piece: $f'(-2) = -2(-2) = 4$.

**(ii)**

$$
\int_0^{\pi/4} (2x + \sin 2x)\,dx = \left[x^2 - \frac{1}{2}\cos 2x\right]_0^{\pi/4} = \left(\frac{\pi^2}{16} - \frac{1}{2}\cos\frac{\pi}{2}\right) - \left(0 - \frac{1}{2}\cos 0\right)
$$

$$
= \frac{\pi^2}{16} - 0 + \frac{1}{2} = \frac{\pi^2}{16} + \frac{1}{2} \approx 1.117
$$

---

# Section B

## 9 · 17 marks

**Question**

(i) A particle moves from rest in a straight line from a fixed point $O$. After $t$ seconds its displacement from $O$ is $x = (t^3 + 4t^2 + 6)$ m. Find

(a) the velocity of the particle when $t = 2$, **(3 marks)**

(b) the acceleration of the particle when $t = 2$. **(3 marks)**

(ii) A particle $P$ of mass 3 kg lies at rest on a smooth plane inclined at $30^\circ$ to the horizontal. $P$ is attached to a light inextensible string which passes over a smooth fixed pulley at the top of the plane to another particle $Q$ of mass 6 kg, hanging freely. The system is released from rest with the string taut. Find

(a) the common acceleration of the particles, **(4 marks)**

(b) the tension in the string. **(2 marks)**

(iii) Two particles $S$ and $T$ of masses 2 kg and 3 kg are moving in the same direction along a straight line with velocities $12\text{ m s}^{-1}$ and $6\text{ m s}^{-1}$ respectively. $S$ collides with $T$, and after the collision $S$ moves on with velocity $6\text{ m s}^{-1}$. Find

(a) the velocity of $T$ after the collision, **(2 marks)**

(b) the loss in kinetic energy in the collision. **(3 marks)**

**Solution**

**(i)(a)** $v = \frac{dx}{dt} = 3t^2 + 8t$. At $t = 2$: $v = 12 + 16 = 28\text{ m s}^{-1}$.

**(i)(b)** $a = \frac{dv}{dt} = 6t + 8$. At $t = 2$: $a = 20\text{ m s}^{-2}$.

**(ii)(a)** $Q$ moves down and $P$ moves up the plane. The component of $P$'s weight down the plane is $3g\sin 30^\circ = 1.5g$.

$$
Q:\ 6g - T = 6a, \qquad P:\ T - 1.5g = 3a
$$

Add: $4.5g = 9a$, so $a = \frac{g}{2} = 4.9\text{ m s}^{-2}$.

**(ii)(b)** $T = 6g - 6a = 6(9.8 - 4.9) = 29.4\text{ N}$.

**(iii)(a)** Momentum is conserved:

$$
2(12) + 3(6) = 2(6) + 3v \quad\Rightarrow\quad 42 = 12 + 3v \quad\Rightarrow\quad v = 10\text{ m s}^{-1}
$$

**(iii)(b)**

$$
\text{KE before} = \tfrac{1}{2}(2)(144) + \tfrac{1}{2}(3)(36) = 144 + 54 = 198\text{ J}
$$

$$
\text{KE after} = \tfrac{1}{2}(2)(36) + \tfrac{1}{2}(3)(100) = 36 + 150 = 186\text{ J}
$$

$$
\text{loss} = 198 - 186 = 12\text{ J}
$$

---

## 10 · 17 marks

**Question**

(i) The radius of a circle is increasing at $2\text{ cm s}^{-1}$ at the instant when the radius is 2 cm. Find

(a) the rate of change of the area of the circle, **(3 marks)**

(b) the rate of change of the circumference of the circle. **(2 marks)**

(ii) The area bounded by the curve $y^2 = x^2 + 1$, the $x$-axis and the ordinates $x = 1$ and $x = 3$ is rotated completely about the $x$-axis. Find the volume of the solid generated. **(6 marks)**

(iii) Three particles of masses 2 kg, 5 kg and 9 kg have position vectors $-2\mathbf{i} + 3\mathbf{j}$, $4\mathbf{i} - 3\mathbf{j}$ and $3\mathbf{i} + 5\mathbf{j}$ respectively. Find the position vector of the centre of gravity of these particles. **(6 marks)**

**Solution**

**(i)(a)** $A = \pi r^2$, so

$$
\frac{dA}{dt} = 2\pi r\frac{dr}{dt} = 2\pi(2)(2) = 8\pi \approx 25.1\text{ cm}^2\text{ s}^{-1}
$$

**(i)(b)** $C = 2\pi r$, so $\frac{dC}{dt} = 2\pi\frac{dr}{dt} = 4\pi \approx 12.6\text{ cm s}^{-1}$.

**(ii)**

$$
V = \pi\int_1^3 y^2\,dx = \pi\int_1^3 (x^2 + 1)\,dx = \pi\left[\frac{x^3}{3} + x\right]_1^3 = \pi\left[(9 + 3) - \left(\tfrac{1}{3} + 1\right)\right] = \frac{32\pi}{3} \approx 33.5 \text{ cubic units}
$$

**(iii)** The total mass is $2 + 5 + 9 = 16$ kg.

$$
\bar{\mathbf{r}} = \frac{2(-2\mathbf{i} + 3\mathbf{j}) + 5(4\mathbf{i} - 3\mathbf{j}) + 9(3\mathbf{i} + 5\mathbf{j})}{16} = \frac{(-4 + 20 + 27)\mathbf{i} + (6 - 15 + 45)\mathbf{j}}{16} = \frac{43\mathbf{i} + 36\mathbf{j}}{16}
$$

$$
\bar{\mathbf{r}} = \frac{43}{16}\mathbf{i} + \frac{9}{4}\mathbf{j} \approx 2.69\mathbf{i} + 2.25\mathbf{j}
$$

---

## 11 · 17 marks

**Question**

(i) The forces $\mathbf{F}_1 = (p\mathbf{i} + \mathbf{j})$ N, $\mathbf{F}_2 = (2q\mathbf{i} + 3p\mathbf{j})$ N and $\mathbf{F}_3 = (\mathbf{i} + q\mathbf{j})$ N act on a particle of mass 2 kg.

(a) Find the resultant of the three forces in terms of $p$ and $q$. **(3 marks)**

A fourth force, $\mathbf{F} = 6\mathbf{i}$ N, is added and the system is then in equilibrium.

(b) Find the values of $p$ and $q$. **(5 marks)**

(ii) A car of mass 2000 kg has a maximum speed of $10\text{ m s}^{-1}$ up a slope inclined at an angle $\theta$ to the horizontal, where $\sin\theta = 0.4$, against a constant resistance of 2000 N.

(a) Find the power generated by the engine of the car. **(4 marks)**

Given that the power generated and the resistance remain unchanged,

(b) find the acceleration of the car on a level road at the instant when its speed is $20\text{ m s}^{-1}$. **(5 marks)**

**Solution**

**(i)(a)** Add the components:

$$
\mathbf{R} = (p + 2q + 1)\mathbf{i} + (1 + 3p + q)\mathbf{j}
$$

**(i)(b)** In equilibrium $\mathbf{R} + 6\mathbf{i} = \mathbf{0}$:

$$
p + 2q + 7 = 0, \qquad 3p + q + 1 = 0
$$

From the second, $q = -1 - 3p$. Then $p + 2(-1 - 3p) + 7 = 0$, so $-5p + 5 = 0$: $p = 1$ and $q = -4$.

**(ii)(a)** At maximum speed the acceleration is zero, so the driving force balances the resistance and the weight component down the slope:

$$
F = 2000 + 2000(9.8)(0.4) = 2000 + 7840 = 9840\text{ N}
$$

$$
P = Fv = 9840 \times 10 = 98\,400\text{ W} = 98.4\text{ kW}
$$

**(ii)(b)** On the level at $20\text{ m s}^{-1}$ the driving force is $\frac{P}{v} = \frac{98\,400}{20} = 4920$ N. By Newton's second law:

$$
4920 - 2000 = 2000a \quad\Rightarrow\quad a = 1.46\text{ m s}^{-2}
$$

---

# Section C

## 12 · 17 marks

**Question**

The marks scored by 100 students in an examination are distributed as follows:

| Marks ($x$)              | 1–5 | 6–10 | 11–15 | 16–20 | 21–25 | 26–30 | 31–35 | 36–40 |
| ------------------------ | --- | ---- | ----- | ----- | ----- | ----- | ----- | ----- |
| Number of students ($f$) | 8   | 10   | 12    | 20    | 23    | 12    | 9     | 6     |

(a) Draw a cumulative frequency graph of the distribution. **(5 marks)**

From your graph, estimate

(b) the median, **(3 marks)**

(c) the semi-interquartile range. **(4 marks)**

(d) Find the mean of the distribution. **(5 marks)**

**Solution**

**(a)** Plot cumulative frequency against the **upper class boundaries**, starting from $(0.5, 0)$, and join the points with a smooth curve:

| Upper boundary       | 5.5 | 10.5 | 15.5 | 20.5 | 25.5 | 30.5 | 35.5 | 40.5 |
| -------------------- | --- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| Cumulative frequency | 8   | 18   | 30   | 50   | 73   | 85   | 94   | 100  |

**(b)** The median is the 50th value. The cumulative frequency reaches 50 exactly at the boundary 20.5, so the median $\approx 20.5$.

**(c)** By interpolation (your graph should give values close to these):

$$
Q_1\ (25\text{th}) = 10.5 + \frac{25 - 18}{12} \times 5 \approx 13.4, \qquad Q_3\ (75\text{th}) = 25.5 + \frac{75 - 73}{12} \times 5 \approx 26.3
$$

$$
\text{semi-interquartile range} = \frac{Q_3 - Q_1}{2} \approx \frac{26.3 - 13.4}{2} \approx 6.5
$$

**(d)** Use the mid-points $3, 8, 13, \ldots, 38$:

$$
\sum fx = 24 + 80 + 156 + 360 + 529 + 336 + 297 + 228 = 2010
$$

$$
\bar{x} = \frac{2010}{100} = 20.1
$$

---

## 13 · 17 marks

**Question**

(i) A discrete random variable $X$ has probability mass function $p$ defined by

$$
p(x) = \begin{cases} \dfrac{x + 1}{k}, & x = 0, 1, 2, 3, 4 \\ 0, & \text{elsewhere} \end{cases}
$$

where $k$ is a constant.

(a) Copy and complete the distribution table: **(2 marks)**

| $x$        | 0             | 1   | 2             | 3   | 4   |
| ---------- | ------------- | --- | ------------- | --- | --- |
| $P(X = x)$ | $\frac{1}{k}$ |     | $\frac{3}{k}$ |     |     |

Find

(b) the value of the constant $k$, **(2 marks)**

(c) the mean and variance of $X$. **(5 marks)**

(ii) A random variable $X$ is such that $X \sim B\left(10, \frac{1}{2}\right)$. Find

(a) the mean and the standard deviation of the distribution, **(3 marks)**

(b) $P(X < 2)$, **(3 marks)**

(c) $P(X \ge 2)$. **(2 marks)**

**Solution**

**(i)(a)**

| $x$        | 0             | 1             | 2             | 3             | 4             |
| ---------- | ------------- | ------------- | ------------- | ------------- | ------------- |
| $P(X = x)$ | $\frac{1}{k}$ | $\frac{2}{k}$ | $\frac{3}{k}$ | $\frac{4}{k}$ | $\frac{5}{k}$ |

**(i)(b)** $\frac{1 + 2 + 3 + 4 + 5}{k} = \frac{15}{k} = 1$, so $k = 15$.

**(i)(c)**

$$
E(X) = \frac{0(1) + 1(2) + 2(3) + 3(4) + 4(5)}{15} = \frac{40}{15} = \frac{8}{3}
$$

$$
E(X^2) = \frac{0 + 1(2) + 4(3) + 9(4) + 16(5)}{15} = \frac{130}{15} = \frac{26}{3}
$$

$$
\operatorname{Var}(X) = \frac{26}{3} - \left(\frac{8}{3}\right)^2 = \frac{78 - 64}{9} = \frac{14}{9}
$$

**(ii)(a)** Mean $= np = 5$; standard deviation $= \sqrt{np(1 - p)} = \sqrt{2.5} \approx 1.58$.

**(ii)(b)**

$$
P(X < 2) = P(0) + P(1) = \left(\tfrac{1}{2}\right)^{10} + 10\left(\tfrac{1}{2}\right)^{10} = \frac{11}{1024} \approx 0.0107
$$

**(ii)(c)** $P(X \ge 2) = 1 - \frac{11}{1024} = \frac{1013}{1024} \approx 0.989$.

---

## 14 · 17 marks

**Question**

(i) Two events $A$ and $B$ are independent, with $P(A) = \frac{1}{5}$ and $P(B) = \frac{3}{20}$. Find

(a) $P(A \cap B)$, **(2 marks)**

(b) $P(A \cup B)$, **(3 marks)**

(c) $P(A' \cap B)$. **(3 marks)**

(ii) In a class of 200 students, 80 are boys and 120 are girls. $\frac{3}{4}$ of the boys and $\frac{2}{5}$ of the girls offer the sciences. A student $X$ is chosen at random from the class. By drawing a tree diagram or otherwise, find the probability that

(a) $X$ offers the sciences, **(3 marks)**

(b) $X$ is a girl or offers the sciences, **(3 marks)**

(c) $X$ is a boy, given that the student offers the sciences. **(3 marks)**

**Solution**

**(i)(a)** For independent events, $P(A \cap B) = P(A)P(B) = \frac{1}{5} \times \frac{3}{20} = \frac{3}{100}$.

**(i)(b)**

$$
P(A \cup B) = \frac{20}{100} + \frac{15}{100} - \frac{3}{100} = \frac{32}{100} = \frac{8}{25}
$$

**(i)(c)** $P(A' \cap B) = P(B) - P(A \cap B) = \frac{15}{100} - \frac{3}{100} = \frac{12}{100} = \frac{3}{25}$.

**(ii)** $P(\text{boy}) = \frac{80}{200} = 0.4$ and $P(\text{girl}) = 0.6$.

**(a)** $P(S) = 0.4 \times \frac{3}{4} + 0.6 \times \frac{2}{5} = 0.3 + 0.24 = 0.54$.

(Or by counting: $60 + 48 = 108$ of the 200 students.)

**(b)** $P(G \cup S) = P(G) + P(S) - P(G \cap S) = 0.6 + 0.54 - 0.24 = 0.9$.

**(c)**

$$
P(B \mid S) = \frac{P(B \cap S)}{P(S)} = \frac{0.3}{0.54} = \frac{5}{9} \approx 0.56
$$
