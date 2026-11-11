# A Level Pure Mathematics · June 2012 · Paper 2

Subject: **A Level Pure Mathematics with Mechanics** (this pure paper is shared with Pure Mathematics
with Statistics). Past paper: **2012, Paper 2** (GCE Board). Structured questions.
Questions are copied as set (misprints corrected and noted). Worked solutions are our own.

To add it: create the **2012 Paper 2** past paper for the subject, open it in **Admin → Past
papers**, press **Import many** under **Written questions**, choose this file and press **Check**,
then **Import questions**. Labels the paper already has are skipped, so importing twice is safe.

---

## 1 · 12 marks

**Question**

(i) Given that the roots of the equation $x^2 - bx + c = 0$ are $\alpha$ and $\beta$, form the quadratic equation whose roots are $\alpha + \dfrac{1}{\beta}$ and $\beta + \dfrac{1}{\alpha}$.

(ii) Find the values of the constant $k$ for which the roots of the equation $x^2 - 2(1 + 3k)x + 7(2k + 3) = 0$ are equal.

**Solution**

**(i)** $\alpha + \beta = b$ and $\alpha\beta = c$.

$$
\text{sum} = (\alpha + \beta) + \frac{\alpha + \beta}{\alpha\beta} = b + \frac{b}{c} = \frac{b(c + 1)}{c}
$$

$$
\text{product} = \left(\alpha + \frac{1}{\beta}\right)\left(\beta + \frac{1}{\alpha}\right) = \alpha\beta + 1 + 1 + \frac{1}{\alpha\beta} = c + 2 + \frac{1}{c} = \frac{(c + 1)^2}{c}
$$

So $x^2 - \frac{b(c + 1)}{c}x + \frac{(c + 1)^2}{c} = 0$, that is

$$
cx^2 - b(c + 1)x + (c + 1)^2 = 0
$$

**(ii)** Equal roots need a zero discriminant:

$$
4(1 + 3k)^2 - 4 \cdot 7(2k + 3) = 0 \quad\Rightarrow\quad 9k^2 + 6k + 1 = 14k + 21 \quad\Rightarrow\quad 9k^2 - 8k - 20 = 0
$$

$$
(9k + 10)(k - 2) = 0 \quad\Rightarrow\quad k = 2 \quad\text{or}\quad k = -\frac{10}{9}
$$

**Note:** the source prints the second root as $\beta + \frac{1}{\beta}$; we read it as $\beta + \frac{1}{\alpha}$, to match the first.

---

## 2 · 9 marks

**Question**

The functions $f$ and $g$ are defined by

$$
f : x \mapsto \frac{x + 1}{2x + 3},\ x \in \mathbb{R},\ x \ne -\frac{3}{2}, \qquad g : x \mapsto 3x + 2,\ x \in \mathbb{R}.
$$

(a) Express, in a similar manner, the function $(gf)^{-1}$.

(b) Obtain an element in the domain of $g$ which is invariant under $g$.

**Solution**

**(a)** First find $gf$:

$$
gf(x) = 3 \cdot \frac{x + 1}{2x + 3} + 2 = \frac{3x + 3 + 4x + 6}{2x + 3} = \frac{7x + 9}{2x + 3}
$$

Let $y = \dfrac{7x + 9}{2x + 3}$ and make $x$ the subject:

$$
2xy + 3y = 7x + 9 \quad\Rightarrow\quad x(2y - 7) = 9 - 3y \quad\Rightarrow\quad x = \frac{9 - 3y}{2y - 7}
$$

$$
(gf)^{-1} : x \mapsto \frac{9 - 3x}{2x - 7},\quad x \in \mathbb{R},\ x \ne \frac{7}{2}
$$

**(b)** An invariant element satisfies $g(x) = x$: $3x + 2 = x$, so $x = -1$.

---

## 3 · 12 marks

**Question**

(i) Find the range of values of $x$ for which $\dfrac{3x - 10}{x - 4} < 2$.

(ii) Solve the differential equation $(1 + x^2)\dfrac{dy}{dx} = xy$, given that $y = 1$ when $x = 0$.

(iii) Show that if $x$ is so small that $x^3$ and higher powers can be neglected, then

$$
\left(\frac{1 + x}{1 - x}\right)^{\frac{1}{2}} = 1 + x + \frac{1}{2}x^2.
$$

**Solution**

**(i)** Do not multiply by $x - 4$, whose sign is unknown. Bring everything to one side instead:

$$
\frac{3x - 10}{x - 4} - 2 < 0 \quad\Rightarrow\quad \frac{3x - 10 - 2x + 8}{x - 4} < 0 \quad\Rightarrow\quad \frac{x - 2}{x - 4} < 0
$$

The fraction is negative between the critical values: $2 < x < 4$.

**(ii)** Separate the variables:

$$
\int\frac{dy}{y} = \int\frac{x}{1 + x^2}\,dx \quad\Rightarrow\quad \ln y = \frac{1}{2}\ln(1 + x^2) + c \quad\Rightarrow\quad y = A\sqrt{1 + x^2}
$$

$y = 1$ when $x = 0$ gives $A = 1$, so $y = \sqrt{1 + x^2}$.

**(iii)**

$$
(1 + x)^{\frac{1}{2}} = 1 + \frac{1}{2}x - \frac{1}{8}x^2 + \ldots, \qquad (1 - x)^{-\frac{1}{2}} = 1 + \frac{1}{2}x + \frac{3}{8}x^2 + \ldots
$$

Multiply and keep terms up to $x^2$:

$$
1 + \left(\frac{1}{2} + \frac{1}{2}\right)x + \left(\frac{3}{8} + \frac{1}{4} - \frac{1}{8}\right)x^2 = 1 + x + \frac{1}{2}x^2 \ ✓
$$

---

## 4 · 11 marks

**Question**

The expression $y = ax^2 + bx$ is an approximation to a relation connecting two variables $x$ and $y$, where $a$ and $b$ are constants. By using the values given in the table below, draw a suitable straight line graph and use it to estimate the values of $a$ and $b$.

| $x$ | 1   | 2   | 3   | 4   | 5   | 6   |
| --- | --- | --- | --- | --- | --- | --- |
| $y$ | 74  | 126 | 162 | 172 | 175 | 144 |

**Solution**

Divide by $x$: $\dfrac{y}{x} = ax + b$. So plot $\dfrac{y}{x}$ against $x$; this gives a straight line with gradient $a$ and intercept $b$.

| $x$           | 1   | 2   | 3   | 4   | 5   | 6   |
| ------------- | --- | --- | --- | --- | --- | --- |
| $\frac{y}{x}$ | 74  | 63  | 54  | 43  | 35  | 24  |

The points lie very close to a straight line. Through $(1, 74)$ and $(6, 24)$:

$$
a = \text{gradient} \approx \frac{24 - 74}{6 - 1} = -10, \qquad b = \text{intercept} \approx 74 + 10 = 84
$$

**Answer:** $a \approx -10$, $b \approx 84$, so $y \approx 84x - 10x^2$.

---

## 5 · 9 marks

**Question**

(i) $f(x) \equiv \dfrac{x + 1}{(x - 2)(x + 3)}$.

(a) Express $f(x)$ in partial fractions.

(b) Find $\displaystyle\int_3^5 f(x)\,dx$, leaving your answer in terms of natural logarithms.

(ii) Find $\displaystyle\int x\sin 2x\,dx$.

**Solution**

**(i)(a)**

$$
\frac{x + 1}{(x - 2)(x + 3)} = \frac{A}{x - 2} + \frac{B}{x + 3} \quad\Rightarrow\quad x + 1 = A(x + 3) + B(x - 2)
$$

$x = 2$: $3 = 5A$, so $A = \frac{3}{5}$. $x = -3$: $-2 = -5B$, so $B = \frac{2}{5}$.

$$
f(x) = \frac{3}{5(x - 2)} + \frac{2}{5(x + 3)}
$$

**(i)(b)**

$$
\int_3^5 f(x)\,dx = \left[\frac{3}{5}\ln(x - 2) + \frac{2}{5}\ln(x + 3)\right]_3^5 = \frac{3}{5}\ln 3 + \frac{2}{5}(\ln 8 - \ln 6)
$$

$$
= \frac{3}{5}\ln 3 + \frac{2}{5}\ln\frac{4}{3} = \frac{1}{5}\ln\left(27 \times \frac{16}{9}\right) = \frac{1}{5}\ln 48
$$

**(ii)** Integrate by parts with $u = x$ and $dv = \sin 2x\,dx$, so $v = -\frac{1}{2}\cos 2x$:

$$
\int x\sin 2x\,dx = -\frac{x}{2}\cos 2x + \int\frac{1}{2}\cos 2x\,dx = -\frac{x}{2}\cos 2x + \frac{1}{4}\sin 2x + c
$$

---

## 6 · 9 marks

**Question**

(i) Given that $y = \cos^{-1}\left(\dfrac{a}{b}x\right)$, show that $\dfrac{dy}{dx} = -\dfrac{a}{\sqrt{b^2 - a^2x^2}}$.

(ii) Prove that the curve $y = x^m(1 - x)^n$, where $m, n \in \mathbb{Z}^+$, has a stationary point when $x = \dfrac{m}{m + n}$.

Determine the nature of this stationary point when $m = n = 2$.

**Solution**

**(i)** $\frac{d}{dx}\cos^{-1}u = -\frac{1}{\sqrt{1 - u^2}}\frac{du}{dx}$, with $u = \frac{a}{b}x$ (taking $b > 0$):

$$
\frac{dy}{dx} = -\frac{a/b}{\sqrt{1 - \frac{a^2x^2}{b^2}}} = -\frac{a/b}{\frac{1}{b}\sqrt{b^2 - a^2x^2}} = -\frac{a}{\sqrt{b^2 - a^2x^2}} \ ✓
$$

**(ii)** Product rule:

$$
\frac{dy}{dx} = mx^{m - 1}(1 - x)^n - nx^m(1 - x)^{n - 1} = x^{m - 1}(1 - x)^{n - 1}\big[m(1 - x) - nx\big]
$$

The bracket is zero when $m - (m + n)x = 0$, that is $x = \frac{m}{m + n}$, so there is a stationary point there.

When $m = n = 2$: $y = x^2(1 - x)^2 = (x - x^2)^2$ and $x = \frac{1}{2}$.

$$
\frac{dy}{dx} = 2(x - x^2)(1 - 2x), \qquad \frac{d^2y}{dx^2} = 2(1 - 2x)^2 - 4(x - x^2)
$$

At $x = \frac{1}{2}$: $\frac{d^2y}{dx^2} = 0 - 4 \times \frac{1}{4} = -1 < 0$, so it is a **maximum** point, at $\left(\frac{1}{2}, \frac{1}{16}\right)$.

(This makes sense: $y \ge 0$ and $y = 0$ at $x = 0$ and $x = 1$, so the curve rises to a peak between them.)

**Note:** the source asks to "show that when $m = n = 2$ the stationary point is a minimum point". That is false: it is a maximum. The question here asks for its nature instead.

---

## 7 · 11 marks

**Question**

(i) Find the general solution of the equation $\sin 2\theta = \sin\theta$.

(ii) $f(x) \equiv \cos x + 2\sin x$.

(a) Express $f(x)$ in the form $r\cos(x - \alpha)$, where $r > 0$ and $0^\circ < \alpha < 90^\circ$.

(b) Find, to the nearest tenth of a degree, the values of $x$ between $0^\circ$ and $360^\circ$ which satisfy the equation $\cos x + 2\sin x = 1$.

(c) Show that $-\sqrt{5} \le \cos x + 2\sin x \le \sqrt{5}$.

**Solution**

**(i)** $2\sin\theta\cos\theta - \sin\theta = 0$, so $\sin\theta(2\cos\theta - 1) = 0$:

- $\sin\theta = 0$: $\theta = n\pi$;
- $\cos\theta = \frac{1}{2}$: $\theta = 2n\pi \pm \frac{\pi}{3}$.

(In degrees: $\theta = 180^\circ n$ or $\theta = 360^\circ n \pm 60^\circ$, $n \in \mathbb{Z}$.)

**(ii)(a)** $r\cos\alpha = 1$ and $r\sin\alpha = 2$:

$$
r = \sqrt{5}, \quad \tan\alpha = 2 \Rightarrow \alpha \approx 63.4^\circ, \qquad f(x) = \sqrt{5}\cos(x - 63.4^\circ)
$$

**(ii)(b)** $\cos(x - 63.43^\circ) = \frac{1}{\sqrt{5}}$, and $\cos^{-1}\frac{1}{\sqrt{5}} = 63.43^\circ$, so

$$
x - 63.43^\circ = \pm 63.43^\circ + 360^\circ n \quad\Rightarrow\quad x = 360^\circ n \quad\text{or}\quad x = 126.87^\circ + 360^\circ n
$$

For $0^\circ \le x \le 360^\circ$: $x = 0^\circ,\ 126.9^\circ,\ 360^\circ$.

(Check $x = 126.9^\circ$: $\cos x + 2\sin x \approx -0.6 + 1.6 = 1$. ✓)

**(ii)(c)** $-1 \le \cos(x - \alpha) \le 1$, so $-\sqrt{5} \le \sqrt{5}\cos(x - \alpha) \le \sqrt{5}$. ✓

**Note:** the source does not state the range of $x$ in (b); $0^\circ$ to $360^\circ$ is used here.

---

## 8 · 8 marks

**Question**

(i) Find, in the form $a + bi$, $a, b \in \mathbb{R}$, the complex number $z$ such that

$$
\frac{(2 - i)z}{1 + 2i} - (3 - 4i) = 0.
$$

(ii) Given that $z = x + iy$, $x, y \in \mathbb{R}$, find the locus of the points $z$ in an Argand diagram for which the imaginary part of $z + \dfrac{1}{z}$ is zero.

**Solution**

**(i)**

$$
z = \frac{(3 - 4i)(1 + 2i)}{2 - i} = \frac{3 + 6i - 4i + 8}{2 - i} = \frac{11 + 2i}{2 - i} = \frac{(11 + 2i)(2 + i)}{5} = \frac{20 + 15i}{5} = 4 + 3i
$$

**(ii)** $\frac{1}{z} = \frac{x - iy}{x^2 + y^2}$, so

$$
\operatorname{Im}\left(z + \frac{1}{z}\right) = y - \frac{y}{x^2 + y^2} = y\left(1 - \frac{1}{x^2 + y^2}\right)
$$

This is zero when $y = 0$ or $x^2 + y^2 = 1$.

The locus is the real axis (without the origin, where $\frac{1}{z}$ is undefined) together with the unit circle $|z| = 1$.

---

## 9 · 10 marks

**Question**

(i) A jury of 8 is to be chosen from 5 men and 7 women. Find

(a) the number of different ways in which the jury may be chosen,

(b) the number of juries in which women are in the majority.

(ii) Prove, by mathematical induction, that $\displaystyle\sum_{r=1}^{n} r(r + 1) = \frac{1}{3}n(n + 1)(n + 2)$ for all positive integers $n$.

**Solution**

**(i)(a)** $\binom{12}{8} = 495$.

**(i)(b)** A majority means at least 5 women:

| Women | Men | Ways                                            |
| ----- | --- | ----------------------------------------------- |
| 5     | 3   | $\binom{7}{5}\binom{5}{3} = 21 \times 10 = 210$ |
| 6     | 2   | $\binom{7}{6}\binom{5}{2} = 7 \times 10 = 70$   |
| 7     | 1   | $\binom{7}{7}\binom{5}{1} = 5$                  |

Total: $285$ juries.

**(ii)** **Base case**, $n = 1$: the left side is $1 \times 2 = 2$ and the right side is $\frac{1}{3}(1)(2)(3) = 2$. ✓

**Inductive step:** assume $\sum_{r=1}^{k} r(r + 1) = \frac{1}{3}k(k + 1)(k + 2)$. Then

$$
\sum_{r=1}^{k + 1} r(r + 1) = \frac{1}{3}k(k + 1)(k + 2) + (k + 1)(k + 2) = \frac{1}{3}(k + 1)(k + 2)(k + 3)
$$

which is the formula with $n = k + 1$. By induction it holds for all positive integers $n$.

---

## 10 · 9 marks

**Question**

Given the lines

$$
L_1 : \frac{x - 10}{3} = \frac{y - 1}{1} = \frac{z - 9}{4}, \qquad L_2 : \mathbf{r} = (-9\mathbf{j} + 13\mathbf{k}) + \mu(\mathbf{i} + 2\mathbf{j} - 3\mathbf{k}),
$$

where $\mu$ is a parameter,

(a) show that the point $P(4, -1, 1)$ is common to the lines $L_1$ and $L_2$;

(b) state the point of intersection of $L_1$ and $L_2$;

(c) find a vector parametric equation of the plane containing the lines $L_1$ and $L_2$.

**Solution**

**(a)** On $L_1$: $\frac{4 - 10}{3} = -2$, $\frac{-1 - 1}{1} = -2$ and $\frac{1 - 9}{4} = -2$. All three are equal, so $P$ is on $L_1$.

On $L_2$, take $\mu = 4$: $(4,\ -9 + 8,\ 13 - 12) = (4, -1, 1)$. So $P$ is on $L_2$.

**(b)** The directions $(3, 1, 4)$ and $(1, 2, -3)$ are not parallel, so the lines meet in exactly one point: $P(4, -1, 1)$.

**(c)** The plane contains $P$ and both directions:

$$
\mathbf{r} = 4\mathbf{i} - \mathbf{j} + \mathbf{k} + s(3\mathbf{i} + \mathbf{j} + 4\mathbf{k}) + t(\mathbf{i} + 2\mathbf{j} - 3\mathbf{k}), \qquad s, t \in \mathbb{R}
$$

(Its normal is $(3, 1, 4) \times (1, 2, -3) = (-11, 13, 5)$, giving the Cartesian form $-11x + 13y + 5z = -52$, that is $11x - 13y - 5z = 52$.)

**Note:** the source also defines a third line, $L_3 : \frac{x + 10}{4} = \frac{y + 5}{3} = \frac{z + 4}{1}$, but no part uses it, and it meets neither $L_1$ nor $L_2$, so it is left out.
