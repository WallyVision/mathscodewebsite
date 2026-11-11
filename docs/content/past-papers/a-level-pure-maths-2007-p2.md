# A Level Pure Mathematics · June 2007 · Paper 2

Subject: **A Level Pure Mathematics with Mechanics** (this pure paper is shared with Pure Mathematics
with Statistics). Past paper: **2007, Paper 2** (GCE Board). Structured questions.
Questions are copied as set (missing words restored and noted). Worked solutions are our own.

To add it: create the **2007 Paper 2** past paper for the subject, open it in **Admin → Past
papers**, press **Import many** under **Written questions**, choose this file and press **Check**,
then **Import questions**. Labels the paper already has are skipped, so importing twice is safe.

---

## 1 · 12 marks

**Question**

(i) The functions $f$ and $g$ are defined by

$$
f : x \mapsto \frac{x + 2}{x - 1},\ x \in \mathbb{R},\ x \ne 1, \qquad g : x \mapsto 1 - x,\ x \in \mathbb{R}.
$$

(a) Find $fg(x)$ and $gf(x)$.

(b) Show that the equation $fg(x) - gf(x) = 0$ has no real roots.

(c) Show that $f$ is injective.

(ii) Find the coefficient of $x^5$ in the binomial expansion of $\left(\dfrac{x^2}{2} - \dfrac{3}{x^3}\right)^{10}$.

**Solution**

**(i)(a)**

$$
fg(x) = f(1 - x) = \frac{3 - x}{-x} = \frac{x - 3}{x}\ (x \ne 0), \qquad gf(x) = 1 - \frac{x + 2}{x - 1} = \frac{-3}{x - 1}\ (x \ne 1)
$$

**(i)(b)**

$$
\frac{x - 3}{x} + \frac{3}{x - 1} = 0 \quad\Rightarrow\quad (x - 3)(x - 1) + 3x = 0 \quad\Rightarrow\quad x^2 - x + 3 = 0
$$

The discriminant is $1 - 12 = -11 < 0$, so there are no real roots.

**(i)(c)** If $f(a) = f(b)$, then $(a + 2)(b - 1) = (b + 2)(a - 1)$:

$$
ab - a + 2b - 2 = ab - b + 2a - 2 \quad\Rightarrow\quad 3b = 3a \quad\Rightarrow\quad a = b
$$

So $f$ is injective.

**(ii)** The general term is

$$
\binom{10}{r}\left(\frac{x^2}{2}\right)^{10 - r}\left(-\frac{3}{x^3}\right)^r = \binom{10}{r}\left(\frac{1}{2}\right)^{10 - r}(-3)^r x^{20 - 5r}
$$

For $x^5$: $20 - 5r = 5$, so $r = 3$:

$$
\binom{10}{3}\left(\frac{1}{2}\right)^7(-3)^3 = 120 \times \frac{1}{128} \times (-27) = -\frac{405}{16} \approx -25.3
$$

---

## 2 · 11 marks

**Question**

| $x$ | 2    | 3    | 4    | 5     | 6     |
| --- | ---- | ---- | ---- | ----- | ----- |
| $y$ | 13.6 | 27.2 | 54.4 | 180.8 | 217.6 |

The table above shows corresponding values of $x$ and $y$ which approximately satisfy a relation of the form $y = ab^x$, where $a$ and $b$ are constants. One value of $y$ is incorrect. By drawing a suitable linear graph, determine the incorrect value of $y$ and estimate the values of $a$ and $b$, correct to one decimal place.

**Solution**

Take logarithms: $\log y = \log a + x\log b$. Plot $\log y$ against $x$: the points should lie on a straight line with gradient $\log b$ and intercept $\log a$.

| $x$      | 2     | 3     | 4     | 5     | 6     |
| -------- | ----- | ----- | ----- | ----- | ----- |
| $\log y$ | 1.134 | 1.435 | 1.736 | 2.257 | 2.338 |

Four of the points lie on a straight line rising by about 0.301 per unit of $x$. The point at $x = 5$ lies well above it, so **$y = 180.8$ is incorrect**. The line gives $\log y \approx 2.037$ there, so the value should be about $108.8$. (The digits have been swapped.)

From the line:

$$
\log b \approx 0.301 \Rightarrow b \approx 2.0, \qquad \log a \approx 1.134 - 2(0.301) = 0.532 \Rightarrow a \approx 3.4
$$

So $y \approx 3.4 \times 2^x$. (Check: $3.4 \times 2^2 = 13.6$. ✓)

---

## 3 · 13 marks

**Question**

Given that $(x^2 - x)\dfrac{dy}{dx} = y$, and that $y = 1$ when $x = 2$, show that $y = \dfrac{2(x - 1)}{x}$.

Sketch the curve $y = \dfrac{2(x - 1)}{x}$, showing clearly the point(s) where the curve meets the coordinate axes and the behaviour of the curve near its asymptotes.

**Solution**

Separate the variables, using $\frac{1}{x(x - 1)} = \frac{1}{x - 1} - \frac{1}{x}$:

$$
\int\frac{dy}{y} = \int\left(\frac{1}{x - 1} - \frac{1}{x}\right)dx \quad\Rightarrow\quad \ln|y| = \ln|x - 1| - \ln|x| + c \quad\Rightarrow\quad y = \frac{A(x - 1)}{x}
$$

At $x = 2$, $y = 1$: $1 = \frac{A}{2}$, so $A = 2$ and $y = \dfrac{2(x - 1)}{x}$. ✓

**Sketch.** Write $y = 2 - \dfrac{2}{x}$.

- **Axes:** $y = 0$ at $x = 1$, giving $(1, 0)$. The curve never meets the $y$-axis, because $x = 0$ is an asymptote.
- **Vertical asymptote $x = 0$:** $y \to -\infty$ as $x \to 0^+$, and $y \to +\infty$ as $x \to 0^-$.
- **Horizontal asymptote $y = 2$:** $y \to 2$ from below as $x \to +\infty$, and from above as $x \to -\infty$.

The right branch rises from $-\infty$ near the $y$-axis, through $(1, 0)$, towards $y = 2$. The left branch lies above $y = 2$, rising from $y \approx 2$ (far left) to $+\infty$ near the $y$-axis.

**Note:** the words "Sketch the curve" are missing from the source and have been restored.

---

## 4 · 10 marks

**Question**

Given the lines

$$
\mathbf{r} = (\mathbf{i} + 2\mathbf{j} + \mathbf{k}) + t(\mathbf{i} + 2\mathbf{j} + 2\mathbf{k}), \qquad \mathbf{r} = (6\mathbf{i} + 6\mathbf{j} + 6\mathbf{k}) - s(5\mathbf{i} + 4\mathbf{j} + 5\mathbf{k}),
$$

find

(a) the point of intersection of the lines,

(b) the cosine of the acute angle between the lines,

(c) a vector parametric equation of a plane containing the lines.

**Solution**

**(a)** Equate components:

$$
1 + t = 6 - 5s, \qquad 2 + 2t = 6 - 4s, \qquad 1 + 2t = 6 - 5s
$$

The first and third give $1 + t = 1 + 2t$, so $t = 0$ and then $s = 1$. The second checks: $2 = 6 - 4$ ✓. The point is $(1, 2, 1)$.

**(b)** The directions are $(1, 2, 2)$, of length 3, and $(5, 4, 5)$, of length $\sqrt{66}$:

$$
\cos\theta = \frac{5 + 8 + 10}{3\sqrt{66}} = \frac{23}{3\sqrt{66}} \approx 0.944
$$

**(c)**

$$
\mathbf{r} = \mathbf{i} + 2\mathbf{j} + \mathbf{k} + \lambda(\mathbf{i} + 2\mathbf{j} + 2\mathbf{k}) + \mu(5\mathbf{i} + 4\mathbf{j} + 5\mathbf{k}), \qquad \lambda, \mu \in \mathbb{R}
$$

---

## 5 · 10 marks

**Question**

(i) Show that $\dfrac{\cos 6A + \cos 2A}{\sin 6A + \sin 2A} \equiv \cot 4A$.

(ii) Given that $f(\theta) = 2\cos\theta + \sin\theta$, express $f(\theta)$ in the form $R\cos(\theta - \lambda)$, where $R > 0$ and $0^\circ < \lambda < 180^\circ$. Hence obtain the general solution of the equation $f(\theta) = 1$.

**Solution**

**(i)** Factor formulae:

$$
\frac{2\cos 4A\cos 2A}{2\sin 4A\cos 2A} = \frac{\cos 4A}{\sin 4A} = \cot 4A \ ✓
$$

**(ii)** $R\cos\lambda = 2$ and $R\sin\lambda = 1$:

$$
R = \sqrt{5}, \quad \tan\lambda = \frac{1}{2} \Rightarrow \lambda \approx 26.57^\circ, \qquad f(\theta) = \sqrt{5}\cos(\theta - 26.57^\circ)
$$

Then $\cos(\theta - 26.57^\circ) = \frac{1}{\sqrt{5}}$, and $\cos^{-1}\frac{1}{\sqrt{5}} \approx 63.43^\circ$:

$$
\theta - 26.57^\circ = \pm 63.43^\circ + 360^\circ n \quad\Rightarrow\quad \theta = 90^\circ + 360^\circ n \quad\text{or}\quad \theta = -36.87^\circ + 360^\circ n
$$

Check: $f(90^\circ) = 0 + 1 = 1$ ✓, and $f(-36.87^\circ) = 2(0.8) - 0.6 = 1$ ✓.

---

## 6 · 9 marks

**Question**

(i) Prove, by mathematical induction, that $5^n - 4n - 1$ is divisible by 16 for all positive integers $n$.

(ii) $A$ and $B$ are members of a group of 10 boys.

(a) Find the number of ways in which all the boys can be seated in a row if $A$ and $B$ must sit together.

(b) Find the number of ways in which a committee of $r$ boys can be selected from the group if either $A$ or $B$, but not both, must be a member of the committee.

**Solution**

**(i)** **Base case**, $n = 1$: $5 - 4 - 1 = 0 = 16 \times 0$. ✓

**Inductive step:** assume $5^k - 4k - 1 = 16m$ for some integer $m$, so $5^k = 16m + 4k + 1$. Then

$$
5^{k + 1} - 4(k + 1) - 1 = 5(16m + 4k + 1) - 4k - 5 = 80m + 16k = 16(5m + k)
$$

which is divisible by 16. By induction the result holds for all positive integers $n$.

**(ii)(a)** Glue $A$ and $B$ together as one unit: there are 9 units to arrange in $9!$ ways, and $A$ and $B$ can swap within their unit:

$$
2 \times 9! = 725\,760
$$

**(ii)(b)** Choose which of $A$ and $B$ is in (2 ways), then fill the other $r - 1$ places from the 8 remaining boys:

$$
2\binom{8}{r - 1}
$$

For example, a committee of 4 gives $2\binom{8}{3} = 112$ ways.

**Note:** the size of the committee is missing from the source, so a general answer is given.

---

## 7 · 10 marks

**Question**

(i) Factorise $f(x)$ completely, where $f(x) \equiv -3x^3 + 5x^2 + 4x - 4$.

(ii) Given that the roots of the quadratic equation $x^2 + (6 - a)x + 2a = 0$ are real and equal, find the values of the real constant $a$.

Using the smaller value of $a$, form a quadratic equation whose roots are $-\alpha + 2$ and $-\frac{1}{2}\alpha$, where $\alpha$ is the root of the equation $x^2 + (6 - a)x + 2a = 0$.

**Solution**

**(i)** $f(2) = -24 + 20 + 8 - 4 = 0$, so $(x - 2)$ is a factor:

$$
f(x) = (x - 2)(-3x^2 - x + 2) = -(x - 2)(3x^2 + x - 2) = (2 - x)(3x - 2)(x + 1)
$$

**(ii)** Equal roots need a zero discriminant:

$$
(6 - a)^2 - 8a = 0 \quad\Rightarrow\quad a^2 - 20a + 36 = 0 \quad\Rightarrow\quad (a - 2)(a - 18) = 0
$$

$a = 2$ or $a = 18$. With the smaller value, $a = 2$, the equation is $x^2 + 4x + 4 = 0$, so $\alpha = -2$.

The new roots are $-\alpha + 2 = 4$ and $-\frac{1}{2}\alpha = 1$:

$$
(x - 4)(x - 1) = 0 \quad\Rightarrow\quad x^2 - 5x + 4 = 0
$$

---

## 8 · 9 marks

**Question**

Given that $g(x) = \dfrac{2}{(1 + x)(1 + 3x^2)}$,

(a) express $g(x)$ in partial fractions;

hence

(b) evaluate $\displaystyle\int_0^1 g(x)\,dx$;

(c) expand $g(x)$ as a series in ascending powers of $x$, up to and including the term in $x^3$.

**Solution**

**(a)**

$$
\frac{2}{(1 + x)(1 + 3x^2)} = \frac{A}{1 + x} + \frac{Bx + C}{1 + 3x^2} \quad\Rightarrow\quad 2 = A(1 + 3x^2) + (Bx + C)(1 + x)
$$

$x = -1$: $2 = 4A$, so $A = \frac{1}{2}$. Comparing $x^2$ terms: $0 = 3A + B$, so $B = -\frac{3}{2}$. Comparing constants: $2 = A + C$, so $C = \frac{3}{2}$.

$$
g(x) = \frac{1}{2(1 + x)} + \frac{3(1 - x)}{2(1 + 3x^2)}
$$

**(b)** Split the second fraction:

$$
\int_0^1 g(x)\,dx = \left[\frac{1}{2}\ln(1 + x) + \frac{3}{2} \cdot \frac{1}{\sqrt{3}}\tan^{-1}(\sqrt{3}x) - \frac{3}{2} \cdot \frac{1}{6}\ln(1 + 3x^2)\right]_0^1
$$

$$
= \frac{1}{2}\ln 2 + \frac{\sqrt{3}}{2} \cdot \frac{\pi}{3} - \frac{1}{4}\ln 4 = \frac{\sqrt{3}\,\pi}{6} \approx 0.907
$$

(The logarithms cancel, because $\frac{1}{4}\ln 4 = \frac{1}{2}\ln 2$.)

**(c)**

$$
g(x) = 2(1 + x)^{-1}(1 + 3x^2)^{-1} = 2(1 - x + x^2 - x^3)(1 - 3x^2 + \ldots) = 2(1 - x - 2x^2 + 2x^3) + \ldots
$$

$$
g(x) = 2 - 2x - 4x^2 + 4x^3 + \ldots \qquad \left(|x| < \tfrac{1}{\sqrt{3}}\right)
$$

---

## 9 · 9 marks

**Question**

(i) Given that $z = 2 - 3i$, express $\dfrac{z}{z^_}$ and $z\left(\cos\dfrac{\pi}{4} - i\sin\dfrac{\pi}{4}\right)$ in the form $a + bi$, where $a$ and $b$ are real constants and $z^_$ is the complex conjugate of $z$.

(ii) Find $\dfrac{d^2y}{dx^2}$ when $t = \dfrac{\pi}{2}$, where $x = a(t + \sin t)$, $y = a(1 - \cos t)$ and $a$ is a constant.

**Solution**

**(i)**

$$
\frac{z}{z^*} = \frac{2 - 3i}{2 + 3i} = \frac{(2 - 3i)^2}{13} = \frac{4 - 12i - 9}{13} = -\frac{5}{13} - \frac{12}{13}i
$$

$$
z\left(\cos\frac{\pi}{4} - i\sin\frac{\pi}{4}\right) = \frac{\sqrt{2}}{2}(2 - 3i)(1 - i) = \frac{\sqrt{2}}{2}(2 - 2i - 3i - 3) = -\frac{\sqrt{2}}{2} - \frac{5\sqrt{2}}{2}i
$$

**(ii)** $\frac{dx}{dt} = a(1 + \cos t)$ and $\frac{dy}{dt} = a\sin t$, so

$$
\frac{dy}{dx} = \frac{\sin t}{1 + \cos t} = \frac{2\sin\frac{t}{2}\cos\frac{t}{2}}{2\cos^2\frac{t}{2}} = \tan\frac{t}{2}
$$

$$
\frac{d^2y}{dx^2} = \frac{\frac{d}{dt}\tan\frac{t}{2}}{\frac{dx}{dt}} = \frac{\frac{1}{2}\sec^2\frac{t}{2}}{2a\cos^2\frac{t}{2}} = \frac{1}{4a\cos^4\frac{t}{2}}
$$

At $t = \frac{\pi}{2}$: $\cos^4\frac{\pi}{4} = \frac{1}{4}$, so $\dfrac{d^2y}{dx^2} = \dfrac{1}{a}$.

---

## 10 · 9 marks

**Question**

(i) Given that the line $x + 3y = 5$ is normal to the curve $y = x^2 + 5x + 6$ at the point $C$, find

(a) the coordinates of the point $C$,

(b) the equation of the tangent to the curve at the point $C$.

(ii) Find the set of real values of $x$ for which $|3 - 2x| \le |x + 4|$.

**Solution**

**(i)(a)** The normal has gradient $-\frac{1}{3}$, so the tangent at $C$ has gradient $3$:

$$
\frac{dy}{dx} = 2x + 5 = 3 \quad\Rightarrow\quad x = -1, \quad y = 1 - 5 + 6 = 2
$$

$C = (-1, 2)$. (It lies on the line: $-1 + 6 = 5$ ✓.)

**(i)(b)** $y - 2 = 3(x + 1)$, that is $y = 3x + 5$.

**(ii)** Both sides are non-negative, so square:

$$
9 - 12x + 4x^2 \le x^2 + 8x + 16 \quad\Rightarrow\quad 3x^2 - 20x - 7 \le 0 \quad\Rightarrow\quad (3x + 1)(x - 7) \le 0
$$

$$
\left\{x : -\frac{1}{3} \le x \le 7\right\}
$$
