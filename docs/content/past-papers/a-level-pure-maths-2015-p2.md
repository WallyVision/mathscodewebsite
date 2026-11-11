# A Level Pure Mathematics · June 2015 · Paper 2

Subject: **A Level Pure Mathematics with Mechanics**. Past paper: **2015, Paper 2** (GCE Board).
Structured questions. Questions are copied as set (two misprints corrected and noted). Worked
solutions are our own.

To add it: create the **2015 Paper 2** past paper for the subject, open it in **Admin → Past
papers**, press **Import many** under **Written questions**, choose this file and press **Check**,
then **Import questions**. Labels the paper already has are skipped, so importing twice is safe.

---

## 1 · 9 marks

**Question**

(i) Given that $(x - 1)$ is a factor of the polynomial $f(x)$, where $f(x) = ax^4 + x^3 - 12x^2 - x + 2$, find the value of the constant $a$ and verify that $f(-1) = 0$.

(ii) Find the values of the constant $k$ for which the equation $x^2 + (k + 1)x + k = 0$ has one root double the other.

**Solution**

**(i)** By the factor theorem, $f(1) = 0$:

$$
a + 1 - 12 - 1 + 2 = 0 \quad\Rightarrow\quad a = 10
$$

Then $f(-1) = 10 - 1 - 12 + 1 + 2 = 0$. ✓

**(ii)** The equation factorises: $x^2 + (k + 1)x + k = (x + 1)(x + k)$, so the roots are $-1$ and $-k$.

- $-k = 2(-1)$ gives $k = 2$;
- $-1 = 2(-k)$ gives $k = \frac{1}{2}$.

$$
k = 2 \quad\text{or}\quad k = \frac{1}{2}
$$

(Without factorising: let the roots be $\beta$ and $2\beta$. Then $3\beta = -(k + 1)$ and $2\beta^2 = k$, which give $2k^2 - 5k + 2 = 0$, the same answers.)

**Note:** the source prints $f(x) = ax^3 + x^3 - \ldots$. Only $ax^4$ makes $f(-1) = 0$ true, as the question requires.

---

## 2 · 10 marks

**Question**

(i) Show that $\dfrac{\sin\theta + \sin 2\theta}{1 + \cos\theta + \cos 2\theta} = \tan\theta$.

(ii) Find the general solution of the equation $\sin 4x + \cos 2x = 0$.

(iii) Solve for $x$, where $0^\circ \le x \le 180^\circ$, the equation $\sin 3x + \cos x = 0$.

**Solution**

**(i)** Use $\sin 2\theta = 2\sin\theta\cos\theta$ and $\cos 2\theta = 2\cos^2\theta - 1$:

$$
\frac{\sin\theta + 2\sin\theta\cos\theta}{\cos\theta + 2\cos^2\theta} = \frac{\sin\theta(1 + 2\cos\theta)}{\cos\theta(1 + 2\cos\theta)} = \tan\theta \ ✓
$$

**(ii)** $\sin 4x = 2\sin 2x\cos 2x$, so

$$
\cos 2x(2\sin 2x + 1) = 0
$$

- $\cos 2x = 0$: $2x = 90^\circ + 180^\circ n$, so $x = 45^\circ + 90^\circ n$;
- $\sin 2x = -\frac{1}{2}$: $2x = -30^\circ + 360^\circ n$ or $210^\circ + 360^\circ n$, so $x = -15^\circ + 180^\circ n$ or $x = 105^\circ + 180^\circ n$.

(In radians: $x = \frac{\pi}{4} + \frac{n\pi}{2}$, $x = -\frac{\pi}{12} + n\pi$, $x = \frac{7\pi}{12} + n\pi$, with $n \in \mathbb{Z}$.)

**(iii)** $\cos x = \sin(90^\circ - x)$, so $-\cos x = \sin(x - 90^\circ)$ and the equation is $\sin 3x = \sin(x - 90^\circ)$:

- $3x = x - 90^\circ + 360^\circ n$: $x = -45^\circ + 180^\circ n$, giving $x = 135^\circ$;
- $3x = 180^\circ - (x - 90^\circ) + 360^\circ n$: $x = 67.5^\circ + 90^\circ n$, giving $x = 67.5^\circ$ and $157.5^\circ$.

$$
x = 67.5^\circ,\ 135^\circ,\ 157.5^\circ
$$

Check $x = 135^\circ$: $\sin 405^\circ = \frac{\sqrt{2}}{2}$ and $\cos 135^\circ = -\frac{\sqrt{2}}{2}$. ✓

---

## 3 · 12 marks

**Question**

(i) The function $f : \mathbb{R} \to \mathbb{R}$ is defined by $f(x) = x - \dfrac{x^3}{3}$. Find the monotony of $f$, showing clearly its variation table.

(ii) Solve the differential equation $x\dfrac{dy}{dx} = y(2x^2 + 1)$.

**Solution**

**(i)** $f'(x) = 1 - x^2 = (1 - x)(1 + x)$, which is zero at $x = \pm 1$.

| $x$     | $-\infty$ |     | $-1$           |     | $1$           |     | $+\infty$ |
| ------- | --------- | --- | -------------- | --- | ------------- | --- | --------- |
| $f'(x)$ |           | $-$ | 0              | $+$ | 0             | $-$ |           |
| $f(x)$  | $+\infty$ | ↘   | $-\frac{2}{3}$ | ↗   | $\frac{2}{3}$ | ↘   | $-\infty$ |

So $f$ is decreasing on $]-\infty, -1]$, increasing on $[-1, 1]$ and decreasing on $[1, +\infty[$. It has a minimum $-\frac{2}{3}$ at $x = -1$ and a maximum $\frac{2}{3}$ at $x = 1$.

**(ii)** Separate the variables:

$$
\int\frac{dy}{y} = \int\left(2x + \frac{1}{x}\right)dx \quad\Rightarrow\quad \ln|y| = x^2 + \ln|x| + c
$$

$$
y = Axe^{x^2}, \quad\text{where } A \text{ is a constant}
$$

---

## 4 · 11 marks

**Question**

(i) Given that $z = e^{i\theta}$, show that $z^n + z^{-n} = 2\cos n\theta$. Use this result to express $\cos^5\theta$ in terms of cosines of multiples of $\theta$.

(ii) Given that $z_1 = 1 + i\sqrt{3}$ and $z_2 = -1 + i$, evaluate (a) $|z_1z_2|^2$, (b) $\arg(z_1^4)$.

**Solution**

**(i)** $z^n + z^{-n} = e^{in\theta} + e^{-in\theta} = (\cos n\theta + i\sin n\theta) + (\cos n\theta - i\sin n\theta) = 2\cos n\theta$.

With $n = 1$, $z + z^{-1} = 2\cos\theta$, so

$$
(2\cos\theta)^5 = (z + z^{-1})^5 = z^5 + 5z^3 + 10z + 10z^{-1} + 5z^{-3} + z^{-5}
$$

$$
32\cos^5\theta = (z^5 + z^{-5}) + 5(z^3 + z^{-3}) + 10(z + z^{-1}) = 2\cos 5\theta + 10\cos 3\theta + 20\cos\theta
$$

$$
\cos^5\theta = \frac{1}{16}\left(\cos 5\theta + 5\cos 3\theta + 10\cos\theta\right)
$$

**(ii)(a)** $|z_1| = 2$ and $|z_2| = \sqrt{2}$, so $|z_1z_2|^2 = |z_1|^2|z_2|^2 = 4 \times 2 = 8$.

**(ii)(b)** $\arg z_1 = \frac{\pi}{3}$, so $\arg(z_1^4) = \frac{4\pi}{3}$, which as a principal argument is $-\frac{2\pi}{3}$.

(Check: $z_1^4 = 16e^{4i\pi/3} = -8 - 8\sqrt{3}\,i$, in the third quadrant.)

---

## 5 · 10 marks

**Question**

The coordinates of the points $A$, $B$ and $C$ are $(0, 1, 3)$, $(-1, 0, 1)$ and $(1, -1, 2)$ respectively. Find

(a) $\overrightarrow{AB} \times \overrightarrow{BC}$,

(b) the sine of the angle between $\overrightarrow{AB}$ and $\overrightarrow{BC}$,

(c) the value of the constant $\mu$ for which the line $\mathbf{r} = \mathbf{i} + 2\mathbf{j} - \mathbf{k} + \lambda(3\mu\mathbf{i} - \mathbf{j} + 5\mathbf{k})$ is parallel to the plane containing $A$, $B$ and $C$.

**Solution**

**(a)** $\overrightarrow{AB} = (-1, -1, -2)$ and $\overrightarrow{BC} = (2, -1, 1)$:

$$
\overrightarrow{AB} \times \overrightarrow{BC} = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ -1 & -1 & -2 \\ 2 & -1 & 1 \end{vmatrix} = (-1 - 2)\mathbf{i} - (-1 + 4)\mathbf{j} + (1 + 2)\mathbf{k} = -3\mathbf{i} - 3\mathbf{j} + 3\mathbf{k}
$$

**(b)** $|\overrightarrow{AB} \times \overrightarrow{BC}| = 3\sqrt{3}$, and $|\overrightarrow{AB}| = |\overrightarrow{BC}| = \sqrt{6}$:

$$
\sin\theta = \frac{|\overrightarrow{AB} \times \overrightarrow{BC}|}{|\overrightarrow{AB}||\overrightarrow{BC}|} = \frac{3\sqrt{3}}{6} = \frac{\sqrt{3}}{2}
$$

**(c)** The cross product is normal to the plane $ABC$. The line is parallel to the plane when its direction is perpendicular to the normal:

$$
(3\mu, -1, 5) \cdot (-3, -3, 3) = -9\mu + 3 + 15 = 0 \quad\Rightarrow\quad \mu = 2
$$

---

## 6 · 8 marks

**Question**

Given the matrix $A = \begin{pmatrix} 2 & 1 & 2 \\ 3 & 1 & 2 \\ 2 & 2 & 1 \end{pmatrix}$, find

(a) $\det(A)$, the determinant of $A$,

(b) $A^{-1}$, the inverse of $A$.

Hence or otherwise, solve the system of equations

$$
2x + y + 2z = 3, \qquad 3x + y + 2z = 3, \qquad 2x + 2y + z = 2.
$$

**Solution**

**(a)**

$$
\det A = 2(1 - 4) - 1(3 - 4) + 2(6 - 2) = -6 + 1 + 8 = 3
$$

**(b)** The matrix of cofactors is $\begin{pmatrix} -3 & 1 & 4 \\ 3 & -2 & -2 \\ 0 & 2 & -1 \end{pmatrix}$. Transpose and divide by 3:

$$
A^{-1} = \frac{1}{3}\begin{pmatrix} -3 & 3 & 0 \\ 1 & -2 & 2 \\ 4 & -2 & -1 \end{pmatrix}
$$

Then

$$
\begin{pmatrix} x \\ y \\ z \end{pmatrix} = A^{-1}\begin{pmatrix} 3 \\ 3 \\ 2 \end{pmatrix} = \frac{1}{3}\begin{pmatrix} -9 + 9 + 0 \\ 3 - 6 + 4 \\ 12 - 6 - 2 \end{pmatrix} = \begin{pmatrix} 0 \\ \frac{1}{3} \\ \frac{4}{3} \end{pmatrix}
$$

Check: $0 + \frac{1}{3} + \frac{8}{3} = 3$ ✓, $0 + \frac{2}{3} + \frac{4}{3} = 2$ ✓.

---

## 7 · 9 marks

**Question**

Express $\dfrac{1}{(3t + 1)(t + 3)}$ in partial fractions.

By using the substitution $t = \tan x$, or otherwise, show that

$$
\int_0^{\pi/4} \frac{dx}{3 + 5\sin 2x} = \frac{1}{8}\ln 3.
$$

**Solution**

**Partial fractions:**

$$
\frac{1}{(3t + 1)(t + 3)} = \frac{A}{3t + 1} + \frac{B}{t + 3} \quad\Rightarrow\quad 1 = A(t + 3) + B(3t + 1)
$$

$t = -3$: $1 = -8B$, so $B = -\frac{1}{8}$. $t = -\frac{1}{3}$: $1 = \frac{8}{3}A$, so $A = \frac{3}{8}$.

$$
\frac{1}{(3t + 1)(t + 3)} = \frac{3}{8(3t + 1)} - \frac{1}{8(t + 3)}
$$

**Substitution:** with $t = \tan x$, $dx = \frac{dt}{1 + t^2}$ and $\sin 2x = \frac{2t}{1 + t^2}$. The limits $x = 0, \frac{\pi}{4}$ become $t = 0, 1$.

$$
3 + 5\sin 2x = \frac{3(1 + t^2) + 10t}{1 + t^2} = \frac{3t^2 + 10t + 3}{1 + t^2} = \frac{(3t + 1)(t + 3)}{1 + t^2}
$$

So

$$
\int_0^{\pi/4} \frac{dx}{3 + 5\sin 2x} = \int_0^1 \frac{dt}{(3t + 1)(t + 3)} = \left[\frac{1}{8}\ln(3t + 1) - \frac{1}{8}\ln(t + 3)\right]_0^1
$$

$$
= \frac{1}{8}\big[(\ln 4 - \ln 4) - (\ln 1 - \ln 3)\big] = \frac{1}{8}\ln 3 \ ✓
$$

**Note:** the source prints the fraction as $\frac{1}{(3t + 1)(t + 1)}$ and the answer as $\frac{1}{8}\ln 2$. The substitution gives $(3t + 1)(t + 3)$, and the integral is $\frac{1}{8}\ln 3 \approx 0.137$ (checked numerically), so both have been corrected.

---

## 8 · 11 marks

**Question**

(i) Find the set of real values of $x$ for which $\left|\dfrac{3x + 4}{2x - 3}\right| < 1$.

(ii) Sketch the curve $y = \dfrac{x + 2}{x + 1}$, $x \in \mathbb{R}$, $x \ne -1$, showing clearly the intercepts with the coordinate axes and the behaviour of the curve as it approaches its asymptotes.

**Solution**

**(i)** For $x \ne \frac{3}{2}$, the inequality is $|3x + 4| < |2x - 3|$. Both sides are non-negative, so square:

$$
9x^2 + 24x + 16 < 4x^2 - 12x + 9 \quad\Rightarrow\quad 5x^2 + 36x + 7 < 0 \quad\Rightarrow\quad (5x + 1)(x + 7) < 0
$$

$$
\left\{x : -7 < x < -\frac{1}{5}\right\}
$$

**(ii)** Write $y = 1 + \dfrac{1}{x + 1}$.

- **Intercepts:** $y = 0$ at $x = -2$, giving $(-2, 0)$; $x = 0$ gives $(0, 2)$.
- **Vertical asymptote $x = -1$:** $y \to +\infty$ as $x \to -1^+$ and $y \to -\infty$ as $x \to -1^-$.
- **Horizontal asymptote $y = 1$:** $y \to 1$ from above as $x \to +\infty$, and from below as $x \to -\infty$.

The curve is a rectangular hyperbola. The right branch passes through $(0, 2)$ and falls towards $y = 1$. The left branch passes through $(-2, 0)$, rising towards $y = 1$ as $x \to -\infty$ and dropping to $-\infty$ near $x = -1$.

---

## 9 · 11 marks

**Question**

(i) The functions $g$ and $g \circ f$ are defined by

$$
g : x \mapsto x + 5,\ x \in \mathbb{R}, \qquad g \circ f : x \mapsto \frac{6(x - 3)}{x - 4},\ x \in \mathbb{R},\ x \ne 4.
$$

Find $f$ and show that $f$ is injective.

(ii) If $p$ is the statement "Eric plays golf" and $q$ is the statement "Oscar plays tennis", write down the statement represented by each of the following: (a) $p \Rightarrow q$, (b) $\sim q \Rightarrow p$, (c) $\sim(p \vee q)$.

**Solution**

**(i)** $g(f(x)) = f(x) + 5$, so

$$
f(x) = \frac{6(x - 3)}{x - 4} - 5 = \frac{6x - 18 - 5x + 20}{x - 4} = \frac{x + 2}{x - 4}, \quad x \ne 4
$$

**Injective:** if $f(a) = f(b)$, then $(a + 2)(b - 4) = (b + 2)(a - 4)$:

$$
ab - 4a + 2b - 8 = ab - 4b + 2a - 8 \quad\Rightarrow\quad 6b = 6a \quad\Rightarrow\quad a = b
$$

**(ii)**

(a) If Eric plays golf, then Oscar plays tennis.

(b) If Oscar does not play tennis, then Eric plays golf.

(c) It is not true that Eric plays golf or Oscar plays tennis; that is, neither Eric plays golf nor Oscar plays tennis.

---

## 10

**Question**

(i) The first three terms in the series expansion of $\sqrt{\dfrac{1 - x}{1 + kx}}$ are $1$, $-2x$ and $4x^2$ respectively. Determine the value of $k$ and state the range of values of $x$ for which the expansion is valid.

(ii) Five cards are to be dealt to a player from a standard pack of 52 playing cards. How many different possibilities are there if (a) there is no ace, (b) there are at least two aces?

**Solution**

**(i)** Expand each factor:

$$
(1 - x)^{1/2} = 1 - \frac{1}{2}x - \frac{1}{8}x^2 + \ldots, \qquad (1 + kx)^{-1/2} = 1 - \frac{k}{2}x + \frac{3k^2}{8}x^2 + \ldots
$$

Multiply:

$$
1 - \frac{1 + k}{2}x + \left(-\frac{1}{8} + \frac{k}{4} + \frac{3k^2}{8}\right)x^2 + \ldots
$$

The $x$ coefficient is $-2$: $\frac{1 + k}{2} = 2$, so $k = 3$.

Check the $x^2$ coefficient: $-\frac{1}{8} + \frac{3}{4} + \frac{27}{8} = \frac{-1 + 6 + 27}{8} = 4$. ✓

Valid when $|x| < 1$ and $|3x| < 1$, that is $-\frac{1}{3} < x < \frac{1}{3}$.

**(ii)(a)** Choose all 5 cards from the 48 non-aces:

$$
\binom{48}{5} = 1\,712\,304
$$

**(ii)(b)**

| Aces | Ways                                                      |
| ---- | --------------------------------------------------------- |
| 2    | $\binom{4}{2}\binom{48}{3} = 6 \times 17\,296 = 103\,776$ |
| 3    | $\binom{4}{3}\binom{48}{2} = 4 \times 1128 = 4512$        |
| 4    | $\binom{4}{4}\binom{48}{1} = 48$                          |

Total: $108\,336$.

(Or: $\binom{52}{5} - \binom{48}{5} - 4\binom{48}{4} = 2\,598\,960 - 1\,712\,304 - 778\,320 = 108\,336$.)

**Note:** the source does not give the marks for this question.
