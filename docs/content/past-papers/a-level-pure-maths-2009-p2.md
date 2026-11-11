# A Level Pure Mathematics · June 2009 · Paper 2

Subject: **A Level Pure Mathematics with Mechanics** (this pure paper is shared with Pure Mathematics
with Statistics). Past paper: **2009, Paper 2** (GCE Board). Structured questions.
Questions are copied as set. Worked solutions are our own.

To add it: create the **2009 Paper 2** past paper for the subject, open it in **Admin → Past
papers**, press **Import many** under **Written questions**, choose this file and press **Check**,
then **Import questions**. Labels the paper already has are skipped, so importing twice is safe.

---

## 1 · 10 marks

**Question**

(i) When the polynomial $P(x) = x^3 + rx^2 + sx + t$ is divided by $x^2 - 4$, the remainder is $18 - x$. When it is divided by $x + 3$, the remainder is 21. Find the values of the constants $r$, $s$ and $t$. Find the remainder when $P(x)$ is divided by $x + 1$.

(ii) Find the range of values of $k$ for which the equation $kx^2 + (k - 3)x + 1 = 0$ has real distinct roots.

**Solution**

**(i)** $P(x) = (x^2 - 4)Q(x) + 18 - x$, so $P(2) = 16$ and $P(-2) = 20$. Also $P(-3) = 21$:

$$
8 + 4r + 2s + t = 16 \quad\Rightarrow\quad 4r + 2s + t = 8
$$

$$
-8 + 4r - 2s + t = 20 \quad\Rightarrow\quad 4r - 2s + t = 28
$$

$$
-27 + 9r - 3s + t = 21 \quad\Rightarrow\quad 9r - 3s + t = 48
$$

Subtracting the first two: $4s = -20$, so $s = -5$. Then $4r + t = 18$ and $9r + t = 33$, giving $r = 3$ and $t = 6$.

$P(x) = x^3 + 3x^2 - 5x + 6$, and the remainder on division by $x + 1$ is

$$
P(-1) = -1 + 3 + 5 + 6 = 13
$$

**(ii)** We need $k \ne 0$ (so that the equation is quadratic) and a positive discriminant:

$$
(k - 3)^2 - 4k > 0 \quad\Rightarrow\quad k^2 - 10k + 9 > 0 \quad\Rightarrow\quad (k - 1)(k - 9) > 0
$$

$$
k < 1 \ (k \ne 0) \quad\text{or}\quad k > 9
$$

---

## 2 · 10 marks

**Question**

(i) Differentiate with respect to $x$: (a) $\cos^2\left(2\sqrt{x}\right)$, (b) $\dfrac{\ln(2x)}{x^3}$.

(ii) Solve, in the form $y = f(x)$, the differential equation $(1 - x^2)\dfrac{dy}{dx} - 2xy = 0$, given that $y = 1$ when $x = 0$.

**Solution**

**(i)(a)** Chain rule twice, with $\frac{d}{dx}(2\sqrt{x}) = \frac{1}{\sqrt{x}}$:

$$
\frac{d}{dx}\cos^2(2\sqrt{x}) = 2\cos(2\sqrt{x}) \cdot \left(-\sin(2\sqrt{x})\right) \cdot \frac{1}{\sqrt{x}} = -\frac{\sin(4\sqrt{x})}{\sqrt{x}}
$$

**(i)(b)** Quotient rule:

$$
\frac{d}{dx}\frac{\ln 2x}{x^3} = \frac{x^3 \cdot \frac{1}{x} - 3x^2\ln 2x}{x^6} = \frac{1 - 3\ln 2x}{x^4}
$$

**(ii)** Separate the variables:

$$
\int\frac{dy}{y} = \int\frac{2x}{1 - x^2}\,dx \quad\Rightarrow\quad \ln|y| = -\ln|1 - x^2| + c \quad\Rightarrow\quad y = \frac{A}{1 - x^2}
$$

$y = 1$ when $x = 0$ gives $A = 1$, so $y = \dfrac{1}{1 - x^2}$.

---

## 3 · 8 marks

**Question**

(i) Prove that $\dfrac{\sin\alpha + \sin\beta}{\cos\alpha - \cos\beta} \equiv \cot\left(\dfrac{\beta - \alpha}{2}\right)$.

(ii) Find, in radians, the general solution of the equation $\tan 2x\tan x = -1$.

**Solution**

**(i)** Use the factor formulae:

$$
\frac{2\sin\frac{\alpha + \beta}{2}\cos\frac{\alpha - \beta}{2}}{-2\sin\frac{\alpha + \beta}{2}\sin\frac{\alpha - \beta}{2}} = -\cot\frac{\alpha - \beta}{2} = \cot\frac{\beta - \alpha}{2} \ ✓
$$

(since $\cot$ is an odd function).

**(ii)** Let $t = \tan x$. Then $\tan 2x = \frac{2t}{1 - t^2}$, so

$$
\frac{2t^2}{1 - t^2} = -1 \quad\Rightarrow\quad 2t^2 = t^2 - 1 \quad\Rightarrow\quad t^2 = -1
$$

This has no real solution, so the equation has **no real solutions**.

(Another way to see it: $\tan 2x = -\cot x = \tan\left(x + \frac{\pi}{2}\right)$ gives $x = \frac{\pi}{2} + n\pi$, but there $\tan x$ is undefined.)

**Note:** if the equation was meant to be $\tan 2x\tan x = 1$, then $3t^2 = 1$ and $x = n\pi \pm \frac{\pi}{6}$.

---

## 4 · 10 marks

**Question**

(i) Given that $r \ge 1$, $r \in \mathbb{N}$, simplify $\dfrac{(r + 1)!}{(r - 1)!}$. Hence evaluate $\displaystyle\sum_{r=1}^{40}\frac{(r + 1)!}{(r - 1)!}$.

(ii) A rural council commission of 6 members is to be selected from 10 men and 7 women. Find the number of ways in which this can be done if

(a) the commission must consist of 4 men and 2 women,

(b) the commission is to include at least 4 men and at least 1 woman.

**Solution**

**(i)** $\dfrac{(r + 1)!}{(r - 1)!} = (r + 1)r = r^2 + r$. So

$$
\sum_{r=1}^{40} r(r + 1) = \sum r^2 + \sum r = \frac{40 \cdot 41 \cdot 81}{6} + \frac{40 \cdot 41}{2} = 22\,140 + 820 = 22\,960
$$

(Or use $\sum_{r=1}^{n} r(r + 1) = \frac{1}{3}n(n + 1)(n + 2) = \frac{1}{3}(40)(41)(42) = 22\,960$.)

**(ii)(a)** $\binom{10}{4}\binom{7}{2} = 210 \times 21 = 4410$.

**(ii)(b)** At least 4 men and at least 1 woman means 4 men and 2 women, or 5 men and 1 woman:

$$
4410 + \binom{10}{5}\binom{7}{1} = 4410 + 252 \times 7 = 4410 + 1764 = 6174
$$

---

## 5 · 12 marks

**Question**

(i) Find the two complex numbers $z_1$ and $z_2$ which simultaneously satisfy the equations $z_1 + z_2 = -i$ and $z_1 - z_2 = -2 + 5i$.

(ii) Given that $\dfrac{z + 1}{z - 1} = i$, find $z$ in the form $a + ib$, where $a$ and $b$ are real.

(iii) Find the complex number $z$ such that $|z| + z = 1 + 2i$.

**Solution**

**(i)** Add the equations: $2z_1 = -2 + 4i$, so $z_1 = -1 + 2i$. Then $z_2 = -i - z_1 = 1 - 3i$.

**(ii)**

$$
z + 1 = iz - i \quad\Rightarrow\quad z(1 - i) = -(1 + i) \quad\Rightarrow\quad z = -\frac{(1 + i)^2}{(1 - i)(1 + i)} = -\frac{2i}{2} = -i
$$

So $z = 0 - i$ ($a = 0$, $b = -1$).

**(iii)** Let $z = x + iy$. The imaginary parts give $y = 2$, and the real parts give

$$
\sqrt{x^2 + 4} + x = 1 \quad\Rightarrow\quad x^2 + 4 = (1 - x)^2 = 1 - 2x + x^2 \quad\Rightarrow\quad x = -\frac{3}{2}
$$

$$
z = -\frac{3}{2} + 2i
$$

Check: $|z| = \sqrt{\frac{9}{4} + 4} = \frac{5}{2}$, and $\frac{5}{2} - \frac{3}{2} + 2i = 1 + 2i$. ✓

---

## 6 · 12 marks

**Question**

(i) Find (a) $\displaystyle\int\cos 3x\cos 5x\,dx$, (b) $\displaystyle\int x\ln 2x\,dx$.

(ii) Find the area of the finite region bounded by the curve $y = 12 + x - x^2$ and the line $y = x + 3$.

**Solution**

**(i)(a)** $\cos A\cos B = \frac{1}{2}\big[\cos(A + B) + \cos(A - B)\big]$:

$$
\int\cos 3x\cos 5x\,dx = \frac{1}{2}\int(\cos 8x + \cos 2x)\,dx = \frac{1}{16}\sin 8x + \frac{1}{4}\sin 2x + c
$$

**(i)(b)** By parts, with $u = \ln 2x$ (so $du = \frac{1}{x}dx$) and $dv = x\,dx$:

$$
\int x\ln 2x\,dx = \frac{x^2}{2}\ln 2x - \int\frac{x}{2}\,dx = \frac{x^2}{2}\ln 2x - \frac{x^2}{4} + c
$$

**(ii)** Intersections: $12 + x - x^2 = x + 3$, so $x^2 = 9$ and $x = \pm 3$. Between them the curve is above the line:

$$
\text{Area} = \int_{-3}^{3}\big[(12 + x - x^2) - (x + 3)\big]dx = \int_{-3}^{3}(9 - x^2)\,dx = \left[9x - \frac{x^3}{3}\right]_{-3}^{3} = 18 - (-18) = 36
$$

---

## 7 · 9 marks

**Question**

The values of the two variables $x$ and $y$ shown below, obtained from a particular experiment, obey a law of the form $y = \dfrac{a}{x} + b$, where $a$ and $b$ are constants.

| $x$ | 1   | 1.5 | 2   | 3   | 4   | 6   | 8   | 10   |
| --- | --- | --- | --- | --- | --- | --- | --- | ---- |
| $y$ | 6   | 5.2 | 4.8 | 4.4 | 4.2 | 4   | 3.8 | 3.84 |

By plotting a suitable straight-line graph, determine the values of $a$ and $b$, giving your answers to one decimal place.

Obtain also an estimate for the value of $x$ when $y = 4.5$.

**Solution**

$y = a \cdot \frac{1}{x} + b$ is a straight line when $y$ is plotted against $X = \frac{1}{x}$, with gradient $a$ and intercept $b$.

| $X = \frac{1}{x}$ | 1   | 0.67 | 0.5 | 0.33 | 0.25 | 0.17 | 0.125 | 0.1  |
| ----------------- | --- | ---- | --- | ---- | ---- | ---- | ----- | ---- |
| $y$               | 6   | 5.2  | 4.8 | 4.4  | 4.2  | 4    | 3.8   | 3.84 |

A line of best fit through about $(1, 6)$ and $(0.1, 3.84)$ gives

$$
a = \text{gradient} \approx \frac{6 - 3.84}{1 - 0.1} = 2.4, \qquad b = \text{intercept} \approx 6 - 2.4 = 3.6
$$

So $y \approx \frac{2.4}{x} + 3.6$. When $y = 4.5$:

$$
\frac{2.4}{x} = 0.9 \quad\Rightarrow\quad x \approx 2.7
$$

**Answer:** $a \approx 2.4$, $b \approx 3.6$, and $x \approx 2.7$ when $y = 4.5$ (graph readings may differ slightly).

---

## 8 · 7 marks

**Question**

(a) Find the set of values of $x$ for which $\dfrac{x}{x + 6} - \dfrac{2}{2 - 3x} < 0$.

(b) Show that for all real values of $x$, $|x - 2| + x > 0$.

**Solution**

**(a)** Combine the fractions:

$$
\frac{x(2 - 3x) - 2(x + 6)}{(x + 6)(2 - 3x)} = \frac{-3x^2 - 12}{(x + 6)(2 - 3x)} = \frac{-3(x^2 + 4)}{(x + 6)(2 - 3x)} < 0
$$

The numerator is always negative, so we need $(x + 6)(2 - 3x) > 0$, which holds between the roots:

$$
\left\{x : -6 < x < \frac{2}{3}\right\}
$$

**(b)**

- If $x \ge 2$: $|x - 2| + x = 2x - 2 \ge 2 > 0$.
- If $x < 2$: $|x - 2| + x = 2 - x + x = 2 > 0$.

So $|x - 2| + x > 0$ for every real $x$.

---

## 9 · 13 marks

**Question**

(i) A function $f : \mathbb{R} \to \mathbb{R}$ is defined by $f(x) = \dfrac{2x + 1}{x^2 + 2}$. Find the range of $f$ and hence show that $f$ is not surjective.

(ii) A relation $R$ is defined on the set of ordered pairs of real numbers by $(x, y)\,R\,(s, t) \iff x^2 - s^2 = y^2 - t^2$. Show that $R$ is an equivalence relation.

**Solution**

**(i)** Let $y = \frac{2x + 1}{x^2 + 2}$. Then $yx^2 - 2x + (2y - 1) = 0$. For $y \ne 0$ this quadratic in $x$ has real roots only when

$$
4 - 4y(2y - 1) \ge 0 \quad\Rightarrow\quad 2y^2 - y - 1 \le 0 \quad\Rightarrow\quad (2y + 1)(y - 1) \le 0 \quad\Rightarrow\quad -\frac{1}{2} \le y \le 1
$$

($y = 0$ is also reached, at $x = -\frac{1}{2}$.) So the range is $\left[-\frac{1}{2}, 1\right]$.

Since the range is not the whole codomain $\mathbb{R}$ (for example, 2 is never reached), $f$ is not surjective.

**(ii)** $x^2 - s^2 = y^2 - t^2 \iff x^2 - y^2 = s^2 - t^2$. Let $g(x, y) = x^2 - y^2$; then $(x, y)\,R\,(s, t) \iff g(x, y) = g(s, t)$.

- **Reflexive:** $g(x, y) = g(x, y)$.
- **Symmetric:** $g(x, y) = g(s, t) \Rightarrow g(s, t) = g(x, y)$.
- **Transitive:** $g(x, y) = g(s, t)$ and $g(s, t) = g(u, v) \Rightarrow g(x, y) = g(u, v)$.

So $R$ is an equivalence relation.

---

## 10 · 10 marks

**Question**

Find a vector equation of the plane $\Pi$ through the points $A(1, 0, 0)$, $B(2, -6, 1)$ and $C(-3, 0, 4)$.

Hence find the coordinates of the point of intersection of the plane $\Pi$ and the line $L$ with vector equation $\mathbf{r} = 2t\mathbf{i} + (1 - 5t)\mathbf{j} + (t - 2)\mathbf{k}$.

Find, also, the sine of the angle between the plane $\Pi$ and the line $L$.

**Solution**

$\overrightarrow{AB} = (1, -6, 1)$ and $\overrightarrow{AC} = (-4, 0, 4)$. A vector equation of the plane is

$$
\mathbf{r} = \mathbf{i} + \lambda(\mathbf{i} - 6\mathbf{j} + \mathbf{k}) + \mu(-4\mathbf{i} + 4\mathbf{k})
$$

A normal is $\overrightarrow{AB} \times \overrightarrow{AC} = (-24, -8, -24)$, parallel to $\mathbf{n} = (3, 1, 3)$. Through $A$: $3x + y + 3z = 3$.

Check: $B$ gives $6 - 6 + 3 = 3$ ✓ and $C$ gives $-9 + 0 + 12 = 3$ ✓.

**Intersection:** substitute the line into the plane:

$$
3(2t) + (1 - 5t) + 3(t - 2) = 3 \quad\Rightarrow\quad 4t - 5 = 3 \quad\Rightarrow\quad t = 2
$$

The point is $(4, -9, 0)$.

**Angle:** the line's direction is $\mathbf{d} = (2, -5, 1)$. The sine of the angle between a line and a plane is

$$
\sin\theta = \frac{|\mathbf{d} \cdot \mathbf{n}|}{|\mathbf{d}||\mathbf{n}|} = \frac{|6 - 5 + 3|}{\sqrt{30}\sqrt{19}} = \frac{4}{\sqrt{570}} \approx 0.168
$$
