# A Level Pure Mathematics with Statistics · NWR Mock 2022 · Paper 2

Subject: **A Level Pure Mathematics with Statistics** (also usable for Pure Mathematics with
Mechanics). Past paper: **2022 Mock, Paper 2** (North West Regional mock, not a GCE Board paper,
so set the source to "Mock" if you record one). Structured questions. Questions are copied as set.
Worked solutions are our own.

To add it: create a past paper for the mock (for example **2022 Paper 2 (NWR Mock)**), open it in
**Admin → Past papers**, press **Import many** under **Written questions**, choose this file and
press **Check**, then **Import questions**. Labels the paper already has are skipped, so importing
twice is safe.

---

## 1 · 11 marks

**Question**

The polynomial $p(x) = 2x^3 + px^2 - qx + 6$, where $p$ and $q$ are constants, leaves a remainder of $-4$ when divided by $(x - 1)$. Given that $(2x - 1)$ is a factor of $p(x)$,

(a) find the values of the constants $p$ and $q$, **(5 marks)**

(b) factorise $p(x)$ completely, **(3 marks)**

(c) solve the equation $p(x) = 0$. **(3 marks)**

**Solution**

**(a)** Remainder theorem:

$$
p(1) = 2 + p - q + 6 = -4 \quad\Rightarrow\quad p - q = -12
$$

Factor theorem, $p\left(\frac{1}{2}\right) = 0$:

$$
\frac{1}{4} + \frac{p}{4} - \frac{q}{2} + 6 = 0 \quad\Rightarrow\quad p - 2q = -25
$$

Subtract: $q = 13$, and then $p = 1$.

**(b)** $p(x) = 2x^3 + x^2 - 13x + 6$. Dividing by $(2x - 1)$:

$$
p(x) = (2x - 1)(x^2 + x - 6) = (2x - 1)(x + 3)(x - 2)
$$

**(c)** $x = \frac{1}{2}$, $x = -3$ or $x = 2$.

---

## 2 · 10 marks

**Question**

(i) Show that $\log_3 x = \log_{27}x^3$. **(2 marks)**

(ii) Find the real values of $x$ for which $3^x - 7 = 18\left(3^{-x}\right)$. **(4 marks)**

(iii) Determine the range of values of $x$ for which the binomial expansion of $\sqrt{\dfrac{2 - x}{1 - x}}$ in ascending powers of $x$ is valid. **(4 marks)**

**Solution**

**(i)** Change the base to 3, with $\log_3 27 = 3$:

$$
\log_{27}x^3 = \frac{\log_3 x^3}{\log_3 27} = \frac{3\log_3 x}{3} = \log_3 x \ ✓
$$

**(ii)** Multiply by $3^x$ and let $u = 3^x$:

$$
u^2 - 7u - 18 = 0 \quad\Rightarrow\quad (u - 9)(u + 2) = 0
$$

$u = 3^x > 0$, so $u = 9$ and $x = 2$.

**(iii)** Write the expression as $(2 - x)^{1/2}(1 - x)^{-1/2} = \sqrt{2}\left(1 - \frac{x}{2}\right)^{1/2}(1 - x)^{-1/2}$.

- $\left(1 - \frac{x}{2}\right)^{1/2}$ expands for $\left|\frac{x}{2}\right| < 1$, that is $|x| < 2$;
- $(1 - x)^{-1/2}$ expands for $|x| < 1$.

Both are needed, so the expansion is valid for $-1 < x < 1$.

**Note:** the source prints the denominator as $x - 1$. Then $\frac{2 - x}{x - 1}$ is negative near $x = 0$, the square root is not real there, and no real expansion in powers of $x$ exists. We use $1 - x$; the validity range $-1 < x < 1$ is the same either way, because it comes from the factor $(1 - x)$.

---

## 3 · 9 marks

**Question**

(i) Given that $y = \dfrac{5x^2 - 10x + 9}{(x - 1)^2}$, $x \ne 1$, show that $\dfrac{dy}{dx} = \dfrac{k}{(x - 1)^3}$, where $k$ is a constant. **(4 marks)**

(ii) The function $f$ is defined on the set $\mathbb{R}$ of real numbers by $f(x) = x^3 + 3x^2 + 4x - 12$.

(a) Show that $f(x) = 0$ has a root between 0 and 2.

(b) Show also that if $f(x) = 0$, then $x = \sqrt{\dfrac{4(3 - x)}{3 + x}}$, $x \ne -3$. **(5 marks)**

**Solution**

**(i)** $5x^2 - 10x + 9 = 5(x - 1)^2 + 4$, so

$$
y = 5 + \frac{4}{(x - 1)^2} = 5 + 4(x - 1)^{-2} \quad\Rightarrow\quad \frac{dy}{dx} = -8(x - 1)^{-3} = \frac{-8}{(x - 1)^3}
$$

So $k = -8$.

**(ii)(a)** $f(0) = -12 < 0$ and $f(2) = 8 + 12 + 8 - 12 = 16 > 0$. $f$ is continuous and changes sign, so there is a root between 0 and 2.

**(ii)(b)** If $f(x) = 0$:

$$
x^3 + 3x^2 = 12 - 4x \quad\Rightarrow\quad x^2(x + 3) = 4(3 - x) \quad\Rightarrow\quad x^2 = \frac{4(3 - x)}{3 + x}
$$

For the positive root (the one between 0 and 2) take the positive square root: $x = \sqrt{\dfrac{4(3 - x)}{3 + x}}$. ✓

---

## 4 · 11 marks

**Question**

(i) The functions $g$ and $h$ are defined by

$$
g : x \mapsto \frac{1}{x + 3},\ x \in \mathbb{R},\ x \ne -3, \qquad h : x \mapsto \frac{x + 1}{x - 2},\ x \in \mathbb{R},\ x \ne 2.
$$

(a) Find $g \circ h$, stating its domain.

(b) Show that $h$ is not surjective (as a function to $\mathbb{R}$). **(7 marks)**

(ii) Let $P$: John is sick, and $Q$: John will play the game. Write in ordinary English the following logical statements:

(a) $\sim P \wedge Q$, **(1 mark)**

(b) $\sim P \Rightarrow Q$. **(1 mark)**

(c) Draw a truth table for the statement $\sim P \vee \sim Q$. **(2 marks)**

**Solution**

**(i)(a)**

$$
g(h(x)) = \frac{1}{\frac{x + 1}{x - 2} + 3} = \frac{x - 2}{x + 1 + 3(x - 2)} = \frac{x - 2}{4x - 5}
$$

We need $x \ne 2$ and $h(x) \ne -3$. $h(x) = -3$ when $x + 1 = -3x + 6$, that is $x = \frac{5}{4}$. The domain is $\mathbb{R} - \left\{2, \frac{5}{4}\right\}$.

**(i)(b)** $h(x) = \dfrac{(x - 2) + 3}{x - 2} = 1 + \dfrac{3}{x - 2}$. Since $\frac{3}{x - 2} \ne 0$, $h(x)$ never equals 1. So 1 has no pre-image and $h$ is not surjective onto $\mathbb{R}$.

**(ii)(a)** John is not sick and he will play the game.

**(ii)(b)** If John is not sick, then he will play the game.

**(ii)(c)**

| $P$ | $Q$ | $\sim P$ | $\sim Q$ | $\sim P \vee \sim Q$ |
| --- | --- | -------- | -------- | -------------------- |
| T   | T   | F        | F        | F                    |
| T   | F   | F        | T        | T                    |
| F   | T   | T        | F        | T                    |
| F   | F   | T        | T        | T                    |

---

## 5 · 9 marks

**Question**

(i) Given that $f(\theta) \equiv \sqrt{3}\cos\theta - \sin\theta$,

(a) write $f(\theta)$ in the form $R\cos(\theta + \alpha)$, where $R$ is a positive real number and $\alpha$ is an acute angle;

(b) hence find the general solution of the equation $f(\theta) = \sqrt{3}$. **(6 marks)**

(ii) Given that $\tan^{-1}5 = x$ and $\tan^{-1}7 = y$, show that $y - x = \tan^{-1}\dfrac{1}{18}$. **(3 marks)**

**Solution**

**(i)(a)** $R\cos\alpha = \sqrt{3}$ and $R\sin\alpha = 1$:

$$
R = 2, \quad \alpha = 30^\circ \left(= \frac{\pi}{6}\right), \qquad f(\theta) = 2\cos(\theta + 30^\circ)
$$

**(i)(b)** $\cos(\theta + 30^\circ) = \frac{\sqrt{3}}{2}$, so $\theta + 30^\circ = 360^\circ n \pm 30^\circ$:

$$
\theta = 360^\circ n \quad\text{or}\quad \theta = 360^\circ n - 60^\circ, \qquad n \in \mathbb{Z}
$$

(In radians: $\theta = 2n\pi$ or $2n\pi - \frac{\pi}{3}$.)

**(ii)** $\tan x = 5$ and $\tan y = 7$, so

$$
\tan(y - x) = \frac{\tan y - \tan x}{1 + \tan y\tan x} = \frac{7 - 5}{1 + 35} = \frac{1}{18}
$$

Both $x$ and $y$ are acute and $y > x$, so $0 < y - x < \frac{\pi}{2}$. Hence $y - x = \tan^{-1}\frac{1}{18}$. ✓

---

## 6 · 12 marks

**Question**

(i) (a) Express $f(x) = \dfrac{2x + 1}{x^2 - 1}$ in partial fractions.

(b) Hence show that $\displaystyle\int_2^3 f(x)\,dx = \frac{1}{2}\ln\left(\frac{32}{3}\right)$. **(6 marks)**

(ii) Find the equation of a curve which passes through the point $(2, -2)$ and satisfies the differential equation $(x - 1)\dfrac{dy}{dx} = 1 - y$. Hence sketch this curve. **(6 marks)**

**Solution**

**(i)(a)**

$$
\frac{2x + 1}{(x - 1)(x + 1)} = \frac{A}{x - 1} + \frac{B}{x + 1}
$$

$x = 1$: $3 = 2A$, so $A = \frac{3}{2}$. $x = -1$: $-1 = -2B$, so $B = \frac{1}{2}$.

$$
f(x) = \frac{3}{2(x - 1)} + \frac{1}{2(x + 1)}
$$

**(i)(b)**

$$
\int_2^3 f(x)\,dx = \left[\frac{3}{2}\ln(x - 1) + \frac{1}{2}\ln(x + 1)\right]_2^3 = \frac{3}{2}\ln 2 + \frac{1}{2}(\ln 4 - \ln 3) = \frac{1}{2}\ln\left(\frac{8 \times 4}{3}\right) = \frac{1}{2}\ln\frac{32}{3} \ ✓
$$

**(ii)** Separate the variables:

$$
\int\frac{dy}{1 - y} = \int\frac{dx}{x - 1} \quad\Rightarrow\quad -\ln|1 - y| = \ln|x - 1| + c \quad\Rightarrow\quad (1 - y)(x - 1) = A
$$

At $(2, -2)$: $A = 3 \times 1 = 3$. So

$$
y = 1 - \frac{3}{x - 1} = \frac{x - 4}{x - 1}
$$

**Sketch:**

- **Intercepts:** $(4, 0)$ and $(0, 4)$.
- **Asymptotes:** $x = 1$ and $y = 1$.
- **Behaviour:** $y \to -\infty$ as $x \to 1^+$ and $y \to +\infty$ as $x \to 1^-$. $y \to 1$ from below as $x \to +\infty$, and from above as $x \to -\infty$.

The right branch rises from $-\infty$ through $(2, -2)$ and $(4, 0)$ towards $y = 1$. The left branch lies above $y = 1$: it rises from just above $y = 1$ on the far left, through $(0, 4)$, to $+\infty$ as $x \to 1^-$.

**Note:** the source writes the equation as $(-1 + x)\frac{dy}{dx} = -y + 1$, which is the same.

---

## 7 · 9 marks

**Question**

A circle has equation $x^2 + y^2 - 20x - 16y + 139 = 0$, with centre $C$ and radius $r$.

(a) Find the coordinates of $C$. **(2 marks)**

(b) Show that $r = 5$ units. **(2 marks)**

The line with equation $x = 13$ crosses the circle at two different points $P$ and $Q$, with $P$ below $Q$.

(c) Find the $y$-coordinates of $P$ and $Q$. **(2 marks)**

A tangent to the circle from the origin touches the circle at a point $X$.

(d) Find the length of $OX$, expressing your answer in surd form. **(3 marks)**

**Solution**

**(a)** Complete the squares: $(x - 10)^2 + (y - 8)^2 = 100 + 64 - 139 = 25$. So $C = (10, 8)$.

**(b)** $r = \sqrt{25} = 5$. ✓

**(c)** Put $x = 13$: $9 + (y - 8)^2 = 25$, so $y - 8 = \pm 4$. $P$ has $y = 4$ and $Q$ has $y = 12$.

**(d)** The radius $CX$ is perpendicular to the tangent $OX$, so by Pythagoras in triangle $OXC$:

$$
OX^2 = OC^2 - r^2 = (10^2 + 8^2) - 25 = 139 \quad\Rightarrow\quad OX = \sqrt{139}
$$

**Note:** the source refers to a diagram for which point is $P$; here $P$ is taken as the lower point.

---

## 8

**Question**

(i) The complex number $z$ is such that $\dfrac{3z + 1}{z - 1} = 1 - 2\sqrt{3}\,i$. Express

(a) $z$ in the form $x + iy$, where $x$ and $y$ are real numbers,

(b) $z^2$ in the form $r(\cos\theta + i\sin\theta)$.

(ii) Find the Cartesian equation of the locus represented by the equation $2|z + i| = |z - 3i|$.

**Solution**

**(i)(a)** Let $w = 1 - 2\sqrt{3}\,i$. Then $3z + 1 = wz - w$, so

$$
z = -\frac{1 + w}{3 - w} = -\frac{2 - 2\sqrt{3}\,i}{2 + 2\sqrt{3}\,i} = -\frac{(1 - \sqrt{3}\,i)^2}{(1 + \sqrt{3}\,i)(1 - \sqrt{3}\,i)} = -\frac{-2 - 2\sqrt{3}\,i}{4} = \frac{1}{2} + \frac{\sqrt{3}}{2}i
$$

**(i)(b)** $z = \cos\frac{\pi}{3} + i\sin\frac{\pi}{3}$, so by De Moivre's theorem

$$
z^2 = \cos\frac{2\pi}{3} + i\sin\frac{2\pi}{3} \qquad (r = 1)
$$

**(ii)** Let $z = x + iy$:

$$
4\big[x^2 + (y + 1)^2\big] = x^2 + (y - 3)^2 \quad\Rightarrow\quad 3x^2 + 3y^2 + 14y - 5 = 0
$$

that is $x^2 + \left(y + \frac{7}{3}\right)^2 = \frac{64}{9}$: a circle with centre $\left(0, -\frac{7}{3}\right)$ and radius $\frac{8}{3}$.

**Note:** the source does not give the marks for this question.

---

## 9 · 12 marks

**Question**

(i) Two lines $\mathbf{r}_1$ and $\mathbf{r}_2$ are given by

$$
\mathbf{r}_1 = \mathbf{i} - 2\mathbf{j} + \mathbf{k} + \mu(-\mathbf{j} + 2\mathbf{k}), \qquad \mathbf{r}_2 = -\mathbf{i} - 3\mathbf{j} - 3\mathbf{k} + \beta(\mathbf{i} + \mathbf{j} + \mathbf{k}).
$$

(a) Show that $\mathbf{r}_1$ and $\mathbf{r}_2$ intersect and find the position vector of their common point. **(5 marks)**

(b) Find the cosine of the acute angle between $\mathbf{r}_1$ and $\mathbf{r}_2$. **(2 marks)**

(ii) Prove by mathematical induction that, for any positive integer $n$, $3^{2n} - 1$ is even. **(5 marks)**

**Solution**

**(i)(a)** Equate components:

$$
\mathbf{i}:\ 1 = -1 + \beta, \qquad \mathbf{j}:\ -2 - \mu = -3 + \beta, \qquad \mathbf{k}:\ 1 + 2\mu = -3 + \beta
$$

$\beta = 2$; then $\mu = -1$. Check $\mathbf{k}$: $1 - 2 = -1 = -3 + 2$ ✓. The lines meet at $\mathbf{i} - \mathbf{j} - \mathbf{k}$.

**(i)(b)**

$$
\cos\theta = \frac{|(0, -1, 2) \cdot (1, 1, 1)|}{\sqrt{5}\sqrt{3}} = \frac{1}{\sqrt{15}} \approx 0.258
$$

**(ii)** **Base case**, $n = 1$: $3^2 - 1 = 8$, which is even. ✓

**Inductive step:** assume $3^{2k} - 1 = 2m$. Then

$$
3^{2(k + 1)} - 1 = 9 \cdot 3^{2k} - 1 = 9(3^{2k} - 1) + 8 = 18m + 8 = 2(9m + 4)
$$

which is even. By induction, $3^{2n} - 1$ is even for all positive integers $n$.

---

## 10 · 10 marks

**Question**

Let $P = \begin{pmatrix} 1 & -1 & 1 \\ 2 & -1 & -4 \\ 3 & -2 & -2 \end{pmatrix}$.

(a) Show that $P$ has an inverse. **(2 marks)**

(b) Find the inverse of $P$. **(3 marks)**

(c) Hence find the point of intersection of the planes $x - y + z = 4$, $2x - y - 4z = 3$ and $3x - 2y - 2z = 2$. **(3 marks)**

(d) Find the point whose image under the transformation represented by $P$ is $(-1, 0, 2)$. **(2 marks)**

**Solution**

**(a)** Expand along the first row:

$$
\det P = 1(2 - 8) - (-1)(-4 + 12) + 1(-4 + 3) = -6 + 8 - 1 = 1 \ne 0
$$

so $P$ is non-singular and has an inverse.

**(b)** The matrix of cofactors is $\begin{pmatrix} -6 & -8 & -1 \\ -4 & -5 & -1 \\ 5 & 6 & 1 \end{pmatrix}$. Transpose it and divide by $\det P = 1$:

$$
P^{-1} = \begin{pmatrix} -6 & -4 & 5 \\ -8 & -5 & 6 \\ -1 & -1 & 1 \end{pmatrix}
$$

**(c)** The system is $P\begin{pmatrix} x \\ y \\ z \end{pmatrix} = \begin{pmatrix} 4 \\ 3 \\ 2 \end{pmatrix}$:

$$
\begin{pmatrix} x \\ y \\ z \end{pmatrix} = P^{-1}\begin{pmatrix} 4 \\ 3 \\ 2 \end{pmatrix} = \begin{pmatrix} -24 - 12 + 10 \\ -32 - 15 + 12 \\ -4 - 3 + 2 \end{pmatrix} = \begin{pmatrix} -26 \\ -35 \\ -5 \end{pmatrix}
$$

Check: $-26 + 35 - 5 = 4$ ✓, $-52 + 35 + 20 = 3$ ✓, $-78 + 70 + 10 = 2$ ✓. The point is $(-26, -35, -5)$.

**(d)**

$$
P^{-1}\begin{pmatrix} -1 \\ 0 \\ 2 \end{pmatrix} = \begin{pmatrix} 6 + 0 + 10 \\ 8 + 0 + 12 \\ 1 + 0 + 2 \end{pmatrix} = \begin{pmatrix} 16 \\ 20 \\ 3 \end{pmatrix}
$$

The point is $(16, 20, 3)$. (Check: $P(16, 20, 3) = (16 - 20 + 3,\ 32 - 20 - 12,\ 48 - 40 - 6) = (-1, 0, 2)$ ✓.)

**Note:** the source says "the point of intersection of the lines"; three equations of this form describe planes.
