# O Level Additional Mathematics · June 2020 · Paper 2

Subject: **O Level Additional Mathematics**. Past paper: **2020, Paper 2** (GCE Board). Structured questions.
Questions are copied as set (obvious slips corrected and noted). Worked solutions are our own.

To add it: create the **2020 Paper 2** past paper for O Level Additional Mathematics, open it in
**Admin → Past papers**, press **Import many** under **Written questions**, choose this file and
press **Check**, then **Import questions**. Labels the paper already has are skipped, so importing
twice is safe.

Section A (Pure Mathematics) is compulsory. Candidates then answer any two questions from **either**
Section B (Mechanics) **or** Section C (Statistics and Probability). Take $g = 9.8\text{ m s}^{-2}$.

---

# Section A

## 1 · 8 marks

**Question**

(i) Given that $(x + 1)$ is a factor of $f(x)$, where $f(x) = 2x^3 + 3x^2 + kx + 6$,

(a) find the value of $k$; **(2 marks)**

(b) with this value of $k$, show that $f(x) = (x + 1)(2x^2 + x + 6)$. **(2 marks)**

(ii) Given that $\alpha$ and $\beta$ are the roots of the equation $x^2 + x + 2 = 0$,

(a) find the values of $\alpha + \beta$ and $\alpha\beta$; **(1 mark)**

(b) hence write down another equation, with integral coefficients, whose roots are $-\alpha$ and $-\beta$. **(3 marks)**

**Solution**

**(i)(a)** By the factor theorem, $f(-1) = 0$:

$$
2(-1)^3 + 3(-1)^2 + k(-1) + 6 = -2 + 3 - k + 6 = 7 - k = 0 \quad\Rightarrow\quad k = 7
$$

**(i)(b)** Expand the right-hand side:

$$
(x + 1)(2x^2 + x + 6) = 2x^3 + x^2 + 6x + 2x^2 + x + 6 = 2x^3 + 3x^2 + 7x + 6 = f(x) \ ✓
$$

**(ii)(a)** For $ax^2 + bx + c = 0$: $\alpha + \beta = -\frac{b}{a} = -1$ and $\alpha\beta = \frac{c}{a} = 2$.

**(ii)(b)** For the new roots:

$$
(-\alpha) + (-\beta) = -(\alpha + \beta) = 1, \qquad (-\alpha)(-\beta) = \alpha\beta = 2
$$

An equation is $x^2 - (\text{sum})x + (\text{product}) = 0$:

$$
x^2 - x + 2 = 0
$$

**Note:** the source prints the factorisation as $(x + 1)(2x^2 + x + 2)$, which expands to $2x^3 + 3x^2 + 3x + 2$ and does not match $k = 7$. With $k = 7$ the quadratic factor is $2x^2 + x + 6$, as used above.

---

## 2 · 8 marks

**Question**

(i) Find the number of permutations of the letters of the word "INVOLVING". **(3 marks)**

(ii) Find the numerical value of the term independent of $x$ in the binomial expansion of $\left(x - \frac{1}{2x}\right)^{10}$. **(5 marks)**

**Solution**

**(i)** INVOLVING has 9 letters, with I, N and V each appearing twice:

$$
\frac{9!}{2!\,2!\,2!} = \frac{362\,880}{8} = 45\,360
$$

**(ii)** The general term is

$$
T_{r+1} = \binom{10}{r}x^{10 - r}\left(-\frac{1}{2x}\right)^r = \binom{10}{r}\left(-\frac{1}{2}\right)^r x^{10 - 2r}
$$

It is independent of $x$ when $10 - 2r = 0$, so $r = 5$:

$$
T_6 = \binom{10}{5}\left(-\frac{1}{2}\right)^5 = 252 \times \left(-\frac{1}{32}\right) = -\frac{63}{8}
$$

**Answer:** (i) $45\,360$; (ii) $-\frac{63}{8}$

---

## 3 · 8 marks

**Question**

Yang takes a loan of 1,000,000 FCFA from a credit union. The loan is to be paid in ten months in equal instalments, with an interest rate of 1.5% of what he owes for that month.

The table below shows how the repayment of the loan is scheduled for the first 3 months.

| Month | Capital   | Repayment | Interest | Total amount paid back |
| ----- | --------- | --------- | -------- | ---------------------- |
| 1     | 1,000,000 | 100,000   | 15,000   | 115,000                |
| 2     | 900,000   | 100,000   | 13,500   | 113,500                |
| 3     | 800,000   | 100,000   | 12,000   | 112,000                |

Find

(a) the interest paid in the 10th month, **(3 marks)**

(b) the total interest paid for the 10 months, **(3 marks)**

(c) the total amount of money paid back to the credit union. **(2 marks)**

**Solution**

**(a)** The capital owed falls by 100,000 each month, so in month $n$ it is $1\,000\,000 - 100\,000(n - 1)$. In the 10th month he owes $100\,000$ FCFA:

$$
\text{interest} = 1.5\% \times 100\,000 = 1500 \text{ FCFA}
$$

**(b)** The interests $15\,000, 13\,500, 12\,000, \ldots, 1500$ form an arithmetic progression with $a = 15\,000$, $d = -1500$ and 10 terms:

$$
S_{10} = \frac{10}{2}(15\,000 + 1500) = 5 \times 16\,500 = 82\,500 \text{ FCFA}
$$

**(c)** Total paid back = capital + interest:

$$
1\,000\,000 + 82\,500 = 1\,082\,500 \text{ FCFA}
$$

---

## 4 · 9 marks

**Question**

(i) The set $S = \{a, b, c, d\}$ and the operation $*$ form a group.

(a) Copy and complete the operation table: **(3 marks)**

| $*$   | a   | b   | c   | d   |
| ----- | --- | --- | --- | --- |
| **a** | d   |     | a   | b   |
| **b** | c   | d   |     | a   |
| **c** | a   |     | c   |     |
| **d** | b   | a   |     |     |

From the table,

(b) state the identity element, **(1 mark)**

(c) state the inverse of each element. **(1 mark)**

(ii) The linear transformation $T$ is defined as $T : (x, y) \to (2x - y,\ -x + 2y)$. Find

(a) the image of the point $(5, -1)$ under the transformation $T$, **(2 marks)**

(b) the invariant lines under the transformation $T$. **(2 marks)**

**Solution**

**(i)(a)** Since $a * c = a$ and $c * c = c$, the element $c$ behaves as the identity, so row $c$ and column $c$ copy the headings. In a group every row and every column contains each element exactly once, which fills the remaining gaps:

| $*$   | a   | b     | c     | d     |
| ----- | --- | ----- | ----- | ----- |
| **a** | d   | **c** | a     | b     |
| **b** | c   | d     | **b** | a     |
| **c** | a   | **b** | c     | **d** |
| **d** | b   | a     | **d** | **c** |

**(i)(b)** The identity element is $c$.

**(i)(c)** Look for $c$ (the identity) in each row: $a * b = c$ and $d * d = c$. So

$$
a^{-1} = b, \quad b^{-1} = a, \quad c^{-1} = c, \quad d^{-1} = d
$$

**(ii)(a)**

$$
T(5, -1) = (2(5) - (-1),\ -5 + 2(-1)) = (11,\ -7)
$$

**(ii)(b)** Try lines through the origin, $y = mx$. The point $(x, mx)$ maps to $\big((2 - m)x,\ (-1 + 2m)x\big)$. It stays on the line when

$$
-1 + 2m = m(2 - m) \quad\Rightarrow\quad -1 + 2m = 2m - m^2 \quad\Rightarrow\quad m^2 = 1 \quad\Rightarrow\quad m = \pm 1
$$

The invariant lines are $y = x$ and $y = -x$.

Check: $(1, 1) \to (1, 1)$, so every point of $y = x$ is fixed. $(1, -1) \to (3, -3)$, still on $y = -x$. ✓

---

## 5 · 8 marks

**Question**

A woman has 1,500 FCFA only to buy $x$ cups of beans and $y$ cups of rice to prepare food for her household.

(a) Given that a cup of beans costs 100 FCFA and a cup of rice costs 50 FCFA, show that $2x + y \le 30$. **(2 marks)**

(b) Given that

- the quantity of beans is at least half the quantity of rice,
- the quantity of beans is at most twice the quantity of rice,

write down two inequalities in terms of $x$ and $y$ that satisfy these conditions. **(2 marks)**

(c) On graph paper, taking 2 cm to represent 5 units on both axes, show, by leaving unshaded, the region represented by these 3 inequalities. **(2 marks)**

(d) Given also that every member of the household has to consume $\frac{2}{3}$ of a cup of beans and a cup of rice, find the maximum number of people this woman can feed. **(2 marks)**

**Solution**

**(a)** The cost of $x$ cups of beans and $y$ cups of rice is at most 1500 FCFA:

$$
100x + 50y \le 1500 \quad\Rightarrow\quad 2x + y \le 30 \quad(\div 50)
$$

**(b)** "At least half the rice": $x \ge \frac{1}{2}y$, that is $2x \ge y$.

"At most twice the rice": $x \le 2y$.

**(c)** Draw the three boundary lines:

- $2x + y = 30$, through $(15, 0)$ and $(0, 30)$;
- $y = 2x$, through $(0, 0)$ and $(10, 20)$;
- $x = 2y$, through $(0, 0)$ and $(20, 10)$.

Shade the side of each line that is **not** wanted. The unshaded region is the triangle with corners $(0, 0)$, $(7.5, 15)$ and $(12, 6)$:

- $y = 2x$ meets $2x + y = 30$ where $4x = 30$: $(7.5, 15)$;
- $x = 2y$ meets $2x + y = 30$ where $5y = 30$: $(12, 6)$.

**(d)** For $p$ people she needs $x = \frac{2}{3}p$ cups of beans and $y = p$ cups of rice. Then

$$
2x + y = \frac{4p}{3} + p = \frac{7p}{3} \le 30 \quad\Rightarrow\quad p \le \frac{90}{7} \approx 12.9
$$

The other two conditions hold for every $p$: $2x = \frac{4p}{3} \ge p = y$, and $x = \frac{2p}{3} \le 2p$.

So she can feed at most **12 people** (8 cups of beans and 12 cups of rice, costing 1400 FCFA).

---

## 6 · 6 marks

**Question**

(i) Solve for $\theta$, in the range $0^\circ \le \theta \le 360^\circ$, the equation $1 - 2\sin^2\theta = \cos\theta$. **(3 marks)**

(ii) The function $f(x) = \sqrt{3}\sin x + \cos x$, where $0 \le x \le 2\pi$.

(a) Copy and complete the table of values of $f(x)$ (to 1 decimal place) for $x = 0, \frac{\pi}{6}, \frac{\pi}{3}, \ldots, 2\pi$.

Taking 1 cm to represent $\frac{\pi}{6}$ radians on the $x$-axis and 2 cm to represent 1 unit on the $y$-axis,

(b) draw the graph of $y = f(x)$. **(2 marks)**

From the graph or otherwise,

(c) write down the maximum value of $f(x)$. **(1 mark)**

**Solution**

**(i)** Replace $\sin^2\theta$ by $1 - \cos^2\theta$:

$$
1 - 2(1 - \cos^2\theta) = \cos\theta \quad\Rightarrow\quad 2\cos^2\theta - \cos\theta - 1 = 0 \quad\Rightarrow\quad (2\cos\theta + 1)(\cos\theta - 1) = 0
$$

- $\cos\theta = 1$: $\theta = 0^\circ$ or $360^\circ$;
- $\cos\theta = -\frac{1}{2}$: $\theta = 120^\circ$ or $240^\circ$.

$$
\theta = 0^\circ,\ 120^\circ,\ 240^\circ,\ 360^\circ
$$

**(ii)(a)**

| $x$    | $0$ | $\frac{\pi}{6}$ | $\frac{\pi}{3}$ | $\frac{\pi}{2}$ | $\frac{2\pi}{3}$ | $\frac{5\pi}{6}$ | $\pi$ | $\frac{7\pi}{6}$ | $\frac{4\pi}{3}$ | $\frac{3\pi}{2}$ | $\frac{5\pi}{3}$ | $\frac{11\pi}{6}$ | $2\pi$ |
| ------ | --- | --------------- | --------------- | --------------- | ---------------- | ---------------- | ----- | ---------------- | ---------------- | ---------------- | ---------------- | ----------------- | ------ |
| $f(x)$ | 1   | 1.7             | 2               | 1.7             | 1                | 0                | −1    | −1.7             | −2               | −1.7             | −1               | 0                 | 1      |

For example $f\left(\frac{\pi}{3}\right) = \sqrt{3} \times \frac{\sqrt{3}}{2} + \frac{1}{2} = \frac{3}{2} + \frac{1}{2} = 2$.

**(ii)(b)** Plot the points and join them with a smooth wave. It looks like a sine curve shifted $\frac{\pi}{6}$ to the left, with height 2: in fact $f(x) = 2\sin\left(x + \frac{\pi}{6}\right)$.

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

**(c)** Use the direction vectors $\mathbf{b}_1 = -\mathbf{i} + 5\mathbf{j}$ and $\mathbf{b}_2 = 5\mathbf{i} + \mathbf{j}$:

$$
\mathbf{b}_1 \cdot \mathbf{b}_2 = (-1)(5) + (5)(1) = 0
$$

The dot product is zero, so the lines are perpendicular: the angle is $90^\circ$.

---

## 8 · 8 marks

**Question**

(i) Find the equation of the tangent to the curve $y = 3x^2 - x^3$ at the point $(1, 2)$. **(4 marks)**

(ii) Evaluate $\displaystyle\int_0^{\pi/4} (2x + \cos 2x)\,dx$. **(4 marks)**

**Solution**

**(i)** $\frac{dy}{dx} = 6x - 3x^2$. At $x = 1$ the gradient is $6 - 3 = 3$.

$$
y - 2 = 3(x - 1) \quad\Rightarrow\quad y = 3x - 1
$$

**(ii)**

$$
\int_0^{\pi/4} (2x + \cos 2x)\,dx = \left[x^2 + \frac{1}{2}\sin 2x\right]_0^{\pi/4} = \frac{\pi^2}{16} + \frac{1}{2}\sin\frac{\pi}{2} - 0 = \frac{\pi^2}{16} + \frac{1}{2} \approx 1.117
$$

**Note:** the upper limit is hard to read in the source; $\frac{\pi}{4}$ is used here, as in the 2021 paper. With an upper limit of $\frac{\pi}{2}$ the answer would be $\frac{\pi^2}{4}$.

---

# Section B

## 9 · 17 marks

**Question**

(i) A car accelerates uniformly from rest at $2\text{ m s}^{-2}$ for 3 seconds.

(a) Find the speed of the car at this instant. **(2 marks)**

It maintains this speed for the next 5 seconds and then decelerates uniformly to rest in the next 3 seconds.

(b) Draw a velocity–time graph to illustrate the motion of the car. **(2 marks)**

(c) From the graph or otherwise, find the total distance travelled by the car. **(2 marks)**

(ii) A particle $P$ of mass 3 kg is connected by a light inextensible string, which passes over a smooth fixed pulley, to a particle $Q$ of mass 4 kg. Both particles hang freely. The string is held taut and the particles are released from rest. Find

(a) the common acceleration of the particles, **(3 marks)**

(b) the tension in the string, **(2 marks)**

(c) the force exerted on the pulley. **(1 mark)**

(iii) A particle $P$ of mass 3 kg moves in a straight line with speed $4\text{ m s}^{-1}$ and collides with a stationary particle $Q$ of mass 2 kg. After the collision $P$ moves on in the same direction with speed $2\text{ m s}^{-1}$. Find

(a) the speed of $Q$ after the collision, **(2 marks)**

(b) the loss in kinetic energy. **(3 marks)**

**Solution**

**(i)(a)** $v = u + at = 0 + 2 \times 3 = 6\text{ m s}^{-1}$.

**(i)(b)** The graph is a trapezium: a straight line from $(0, 0)$ up to $(3, 6)$, horizontal to $(8, 6)$, then a straight line down to $(11, 0)$. Time in seconds on the horizontal axis, velocity in $\text{m s}^{-1}$ on the vertical axis.

**(i)(c)** Distance = area under the graph:

$$
\frac{1}{2}(11 + 5) \times 6 = 48\text{ m}
$$

**(ii)(a)** $Q$ is heavier, so it moves down. For each particle (taking the direction of motion as positive):

$$
Q:\ 4g - T = 4a, \qquad P:\ T - 3g = 3a
$$

Add them: $g = 7a$, so $a = \frac{g}{7} = 1.4\text{ m s}^{-2}$.

**(ii)(b)** $T = 3g + 3a = 3(9.8) + 3(1.4) = 33.6\text{ N}$.

**(ii)(c)** Both parts of the string pull vertically down on the pulley: $2T = 67.2\text{ N}$.

**(iii)(a)** Momentum is conserved:

$$
3(4) + 2(0) = 3(2) + 2v \quad\Rightarrow\quad 12 = 6 + 2v \quad\Rightarrow\quad v = 3\text{ m s}^{-1}
$$

**(iii)(b)**

$$
\text{KE before} = \tfrac{1}{2}(3)(4^2) = 24\text{ J}, \qquad \text{KE after} = \tfrac{1}{2}(3)(2^2) + \tfrac{1}{2}(2)(3^2) = 6 + 9 = 15\text{ J}
$$

$$
\text{loss} = 24 - 15 = 9\text{ J}
$$

**Note:** the source says only that $Q$ hangs freely; we take both particles hanging, which suits the 1-mark part (c).

---

## 10 · 17 marks

**Question**

(i) The volume of a sphere is increasing at $48\text{ cm}^3\text{ s}^{-1}$ at the instant when the radius is 6 cm. Find

(a) the rate of change of the radius of the sphere, **(3 marks)**

(b) the rate of change of the surface area of the sphere. **(2 marks)**

[The volume of a sphere is $V = \frac{4}{3}\pi r^3$ and its surface area is $A = 4\pi r^2$.]

(ii) The area bounded by the curve $y^2 = x^2$, the $x$-axis and the ordinates $x = 0$ and $x = 2$ is rotated completely about the $x$-axis. Find the volume of the solid generated. **(6 marks)**

(iii) The centre of gravity of three particles of masses $m$ kg, $n$ kg and 7 kg, at the points with position vectors $\mathbf{i} - 2\mathbf{j}$, $\mathbf{i} + 5\mathbf{j}$ and $2\mathbf{i} - 3\mathbf{j}$ respectively, has position vector $\frac{3}{2}\mathbf{i}$. Find the values of the constants $m$ and $n$. **(6 marks)**

**Solution**

**(i)(a)** $\frac{dV}{dr} = 4\pi r^2$, so $\frac{dV}{dt} = 4\pi r^2 \frac{dr}{dt}$:

$$
48 = 4\pi(36)\frac{dr}{dt} \quad\Rightarrow\quad \frac{dr}{dt} = \frac{48}{144\pi} = \frac{1}{3\pi} \approx 0.106\text{ cm s}^{-1}
$$

**(i)(b)** $\frac{dA}{dt} = 8\pi r\frac{dr}{dt} = 8\pi(6) \times \frac{1}{3\pi} = 16\text{ cm}^2\text{ s}^{-1}$.

**(ii)** $V = \pi\int y^2\,dx$, and $y^2 = x^2$:

$$
V = \pi\int_0^2 x^2\,dx = \pi\left[\frac{x^3}{3}\right]_0^2 = \frac{8\pi}{3} \approx 8.38\text{ cubic units}
$$

(This solid is a cone of radius 2 and height 2: $\frac{1}{3}\pi(2^2)(2) = \frac{8\pi}{3}$. ✓)

**(iii)** The centre of gravity is $\dfrac{\sum m_i\mathbf{r}_i}{\sum m_i}$. Its $\mathbf{j}$ part is 0 and its $\mathbf{i}$ part is $\frac{3}{2}$:

$$
\mathbf{i}:\ \frac{m + n + 14}{m + n + 7} = \frac{3}{2} \quad\Rightarrow\quad 2m + 2n + 28 = 3m + 3n + 21 \quad\Rightarrow\quad m + n = 7
$$

$$
\mathbf{j}:\ -2m + 5n - 21 = 0 \quad\Rightarrow\quad -2m + 5n = 21
$$

Substitute $m = 7 - n$: $-14 + 2n + 5n = 21$, so $n = 5$ and $m = 2$.

---

## 11 · 17 marks

**Question**

(i) A uniform rod $AD$ of length 4 m is suspended horizontally by two vertical strings attached at $A$ and $D$, the ends of the rod. The rod weighs 100 N and a weight of 100 N is also attached to the rod 1 m from $A$. Given that the system is in equilibrium,

(a) draw a diagram showing all the forces acting on the rod, **(3 marks)**

(b) hence or otherwise find the tensions in the strings. **(6 marks)**

(ii) A crane lifts a block of mass 10 kg, which is at rest on horizontal ground, vertically upwards to a height of 20 m. Find

(a) the time taken to lift the block, **(3 marks)**

(b) the work done against gravity by the crane, **(3 marks)**

(c) the power generated by the crane. **(2 marks)**

**Solution**

**(i)(a)** The forces on the rod: tension $T_A$ upwards at $A$; tension $T_D$ upwards at $D$; the 100 N load downwards 1 m from $A$; the rod's weight 100 N downwards at its midpoint, 2 m from $A$.

**(i)(b)** Take moments about $A$:

$$
T_D \times 4 = 100 \times 1 + 100 \times 2 = 300 \quad\Rightarrow\quad T_D = 75\text{ N}
$$

Resolve vertically: $T_A + T_D = 200$, so $T_A = 125\text{ N}$.

**(ii)(b)** Work done against gravity $= mgh = 10 \times 9.8 \times 20 = 1960\text{ J}$.

**(ii)(a) and (c)** cannot be answered as printed: the source gives no speed, acceleration, time or power for the crane. If, for example, the block were lifted in 10 s, the power would be $\frac{1960}{10} = 196\text{ W}$.

**Note:** part (ii) is missing some data in the source.

---

# Section C

## 12 · 17 marks

**Question**

The marks scored by 60 students in an examination are distributed as follows:

| Marks ($x$)              | 1–5 | 6–10 | 11–15 | 16–20 | 21–25 | 26–30 | 31–35 | 36–40 |
| ------------------------ | --- | ---- | ----- | ----- | ----- | ----- | ----- | ----- |
| Number of students ($f$) | 3   | 5    | 8     | 14    | 12    | 9     | 5     | 4     |

(i)(a) Draw a histogram of this distribution. **(5 marks)**

(b) From the histogram or otherwise, find the mode of the distribution. **(3 marks)**

(ii) Find the mean and the standard deviation of the distribution. **(9 marks)**

**Solution**

**(i)(a)** The class boundaries are $0.5, 5.5, 10.5, \ldots, 40.5$. All classes have width 5, so the bar heights can simply be the frequencies $3, 5, 8, 14, 12, 9, 5, 4$, drawn as touching bars.

**(i)(b)** The modal class is 16–20 (boundaries 15.5–20.5). With $d_1 = 14 - 8 = 6$ and $d_2 = 14 - 12 = 2$:

$$
\text{mode} = 15.5 + \frac{d_1}{d_1 + d_2} \times 5 = 15.5 + \frac{6}{8} \times 5 = 19.25
$$

(On the histogram: join the top corners of the tallest bar to the adjacent corners of the neighbouring bars; the crossing point is above $x \approx 19.3$.)

**(ii)** Use the mid-points $x$:

| Class     | $x$ | $f$    | $fx$     | $fx^2$     |
| --------- | --- | ------ | -------- | ---------- |
| 1–5       | 3   | 3      | 9        | 27         |
| 6–10      | 8   | 5      | 40       | 320        |
| 11–15     | 13  | 8      | 104      | 1352       |
| 16–20     | 18  | 14     | 252      | 4536       |
| 21–25     | 23  | 12     | 276      | 6348       |
| 26–30     | 28  | 9      | 252      | 7056       |
| 31–35     | 33  | 5      | 165      | 5445       |
| 36–40     | 38  | 4      | 152      | 5776       |
| **Total** |     | **60** | **1250** | **30 860** |

$$
\bar{x} = \frac{1250}{60} \approx 20.83
$$

$$
\sigma^2 = \frac{30\,860}{60} - \left(\frac{1250}{60}\right)^2 = 514.33 - 434.03 = 80.31, \qquad \sigma \approx 8.96
$$

**Answer:** mode $\approx 19.25$, mean $\approx 20.83$, standard deviation $\approx 8.96$.

---

## 13 · 17 marks

**Question**

(i) A discrete random variable $X$ has probability mass function $p$ defined by

$$
p(x) = \begin{cases} k(x - 1), & x = 1, 2, 3, 4 \\ 0, & \text{elsewhere} \end{cases}
$$

where $k$ is a constant.

(a) Copy and complete the distribution table: **(2 marks)**

| $x$        | 1   | 2   | 3    | 4   |
| ---------- | --- | --- | ---- | --- |
| $P(X = x)$ | 0   |     | $2k$ |     |

Find

(b) the value of the constant $k$, **(2 marks)**

(c) the mean and variance of $X$. **(5 marks)**

(ii) In a basket of mangoes, one out of every two mangoes is rotten. Five mangoes are drawn at random from the basket one after the other. Using the binomial distribution or otherwise, find the probability that

(a) all the mangoes chosen are rotten, **(3 marks)**

(b) fewer than two mangoes are rotten. **(2 marks)**

(c) Find the mean and variance of the distribution. **(3 marks)**

**Solution**

**(i)(a)**

| $x$        | 1   | 2   | 3    | 4    |
| ---------- | --- | --- | ---- | ---- |
| $P(X = x)$ | 0   | $k$ | $2k$ | $3k$ |

**(i)(b)** The probabilities add up to 1: $6k = 1$, so $k = \frac{1}{6}$.

**(i)(c)**

$$
E(X) = 2 \cdot \tfrac{1}{6} + 3 \cdot \tfrac{2}{6} + 4 \cdot \tfrac{3}{6} = \frac{2 + 6 + 12}{6} = \frac{10}{3}
$$

$$
E(X^2) = 4 \cdot \tfrac{1}{6} + 9 \cdot \tfrac{2}{6} + 16 \cdot \tfrac{3}{6} = \frac{4 + 18 + 48}{6} = \frac{35}{3}
$$

$$
\operatorname{Var}(X) = \frac{35}{3} - \left(\frac{10}{3}\right)^2 = \frac{105 - 100}{9} = \frac{5}{9}
$$

**(ii)** The number of rotten mangoes is $X \sim B\left(5, \frac{1}{2}\right)$.

**(a)** $P(X = 5) = \left(\frac{1}{2}\right)^5 = \frac{1}{32}$.

**(b)** $P(X < 2) = P(0) + P(1) = \frac{1}{32} + 5 \times \frac{1}{32} = \frac{6}{32} = \frac{3}{16}$.

**(c)** Mean $= np = 2.5$; variance $= np(1 - p) = 5 \times \frac{1}{2} \times \frac{1}{2} = 1.25$.

---

## 14 · 17 marks

**Question**

(i) Two events $A$ and $B$ are such that $P(A) = \frac{8}{15}$, $P(B) = \frac{2}{3}$ and $P(A \cap B) = \frac{1}{5}$. Find

(a) $P(A \cup B)$, **(3 marks)**

(b) $P(A' \cap B)$, **(2 marks)**

(c) $P(A' \mid B)$. **(3 marks)**

(ii) In a given class, 40% of the students are boys and 60% are girls. 20% of the boys and 30% of the girls are short-sighted. A student $X$ is chosen at random from the class. By drawing a tree diagram or otherwise, find the probability that

(a) $X$ is short-sighted, **(3 marks)**

(b) $X$ is a girl or short-sighted, **(3 marks)**

(c) $X$ is a boy, given that the student is short-sighted. **(3 marks)**

**Solution**

**(i)(a)**

$$
P(A \cup B) = P(A) + P(B) - P(A \cap B) = \frac{8}{15} + \frac{10}{15} - \frac{3}{15} = 1
$$

**(i)(b)** $P(A' \cap B) = P(B) - P(A \cap B) = \frac{2}{3} - \frac{1}{5} = \frac{7}{15}$.

**(i)(c)**

$$
P(A' \mid B) = \frac{P(A' \cap B)}{P(B)} = \frac{7/15}{2/3} = \frac{7}{10}
$$

**(ii)** Tree: Boy (0.4) → short-sighted 0.2; Girl (0.6) → short-sighted 0.3.

**(a)** $P(S) = 0.4 \times 0.2 + 0.6 \times 0.3 = 0.08 + 0.18 = 0.26$.

**(b)** $P(G \cup S) = P(G) + P(S) - P(G \cap S) = 0.6 + 0.26 - 0.18 = 0.68$.

**(c)**

$$
P(B \mid S) = \frac{P(B \cap S)}{P(S)} = \frac{0.08}{0.26} = \frac{4}{13} \approx 0.31
$$

**Note:** the source also calls $A$ and $B$ independent, but with these values $P(A)P(B) = \frac{16}{45} \ne \frac{1}{5}$, so they are not. The answers above use only the given probabilities.
