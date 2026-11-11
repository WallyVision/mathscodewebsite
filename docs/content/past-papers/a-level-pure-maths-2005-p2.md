# A Level Pure Mathematics · June 2005 · Paper 2

Subject: **A Level Pure Mathematics with Mechanics** (this pure paper is shared with Pure Mathematics
with Statistics). Past paper: **2005, Paper 2** (GCE Board). Structured questions.
Questions are copied as set (one misprint corrected and noted). Worked solutions are our own.

To add it: create the **2005 Paper 2** past paper for the subject, open it in **Admin → Past
papers**, press **Import many** under **Written questions**, choose this file and press **Check**,
then **Import questions**. Labels the paper already has are skipped, so importing twice is safe.

---

## 1 · 10 marks

**Question**

A function $f : \mathbb{R} - \{-3\} \to \mathbb{R} - \{1\}$ is defined by $f(x) = \dfrac{x}{x + 3}$.

(a) Show that $f$ is bijective.

(b) Obtain the composite function $ff$ and find its inverse.

**Solution**

**(a)** **Injective:** if $f(a) = f(b)$, then $a(b + 3) = b(a + 3)$, so $3a = 3b$ and $a = b$.

**Surjective:** take any $y \ne 1$ and solve $\frac{x}{x + 3} = y$:

$$
x = xy + 3y \quad\Rightarrow\quad x = \frac{3y}{1 - y}
$$

This exists because $y \ne 1$, and $x \ne -3$ (otherwise $3y = -3 + 3y$, which is impossible). So every $y$ in the codomain is reached.

$f$ is injective and surjective, so it is bijective, with $f^{-1}(x) = \dfrac{3x}{1 - x}$.

**(b)**

$$
ff(x) = \frac{\frac{x}{x + 3}}{\frac{x}{x + 3} + 3} = \frac{x}{x + 3(x + 3)} = \frac{x}{4x + 9}, \qquad x \ne -3,\ x \ne -\frac{9}{4}
$$

Inverse: let $y = \frac{x}{4x + 9}$. Then $4xy + 9y = x$, so $x(1 - 4y) = 9y$:

$$
(ff)^{-1}(x) = \frac{9x}{1 - 4x}, \qquad x \ne \frac{1}{4}
$$

**Note:** the source prints the function as $f : \mathbb{R}^+ \to \mathbb{R}^+ - \{1\}$ with $x \ne -3$. On $\mathbb{R}^+$ the values of $f$ only fill $]0, 1[$, so $f$ could not be onto $\mathbb{R}^+ - \{1\}$. The domain and codomain $\mathbb{R} - \{-3\}$ and $\mathbb{R} - \{1\}$ match the condition $x \ne -3$ and make the question work.

---

## 2 · 11 marks

**Question**

(i) The line $y = x$ is a tangent to the circle $S$ at the point $(4, 4)$ on $S$. The line $y = 3x$ passes through the centre of the circle. Find an equation of the circle $S$.

(ii) Sketch the curve $y = \dfrac{1}{(x + 1)(x - 3)}$, showing clearly the turning point(s) and the behaviour of the curve near its asymptotes.

**Solution**

**(i)** The radius to $(4, 4)$ is perpendicular to the tangent $y = x$, so the centre lies on the line through $(4, 4)$ with gradient $-1$: $y = 8 - x$. It also lies on $y = 3x$, so $3x = 8 - x$, giving $x = 2$ and centre $(2, 6)$.

$$
r^2 = (4 - 2)^2 + (4 - 6)^2 = 8
$$

$$
(x - 2)^2 + (y - 6)^2 = 8 \quad\Leftrightarrow\quad x^2 + y^2 - 4x - 12y + 32 = 0
$$

**(ii)**

- **Asymptotes:** $x = -1$, $x = 3$ and $y = 0$.
- **Axes:** $(0, -\frac{1}{3})$; the curve never meets the $x$-axis.
- **Turning point:** $(x + 1)(x - 3) = (x - 1)^2 - 4$ has its minimum $-4$ at $x = 1$, so $y$ has a local **maximum** $-\frac{1}{4}$ at $(1, -\frac{1}{4})$.

Behaviour:

- $x < -1$: $y > 0$, rising from $0^+$ (as $x \to -\infty$) to $+\infty$ as $x \to -1^-$.
- $-1 < x < 3$: $y < 0$, coming up from $-\infty$ near $x = -1$ to the maximum $\left(1, -\frac{1}{4}\right)$, then down to $-\infty$ near $x = 3$.
- $x > 3$: $y > 0$, falling from $+\infty$ near $x = 3$ towards $0^+$.

---

## 3 · 10 marks

**Question**

Show that the lines $l_1$ and $l_2$ with equations

$$
l_1 : \frac{x - 2}{-3} = \frac{y - 1}{3} = \frac{z - 3}{2}, \qquad l_2 : \frac{x + 1}{-4} = \frac{y - 4}{2} = \frac{z - 5}{7}
$$

intersect, giving the coordinates of the point of intersection. Find

(a) the cosine of the angle between $l_1$ and $l_2$, leaving your answer in surd form,

(b) the equation of the plane containing $l_1$ and $l_2$, in the form $\mathbf{r} = \mathbf{a} + t\mathbf{b} + s\mathbf{c}$.

**Solution**

Write $l_1 : (2 - 3s,\ 1 + 3s,\ 3 + 2s)$ and $l_2 : (-1 - 4t,\ 4 + 2t,\ 5 + 7t)$. Equate the $x$ and $y$ coordinates:

$$
2 - 3s = -1 - 4t, \qquad 1 + 3s = 4 + 2t
$$

These give $3s - 4t = 3$ and $3s - 2t = 3$, so $t = 0$ and $s = 1$. The $z$ coordinates agree: $3 + 2 = 5 = 5 + 0$ ✓. The lines meet at $(-1, 4, 5)$.

**(a)**

$$
\cos\theta = \frac{(-3)(-4) + (3)(2) + (2)(7)}{\sqrt{22}\sqrt{69}} = \frac{32}{\sqrt{1518}} \approx 0.821
$$

**(b)**

$$
\mathbf{r} = -\mathbf{i} + 4\mathbf{j} + 5\mathbf{k} + t(-3\mathbf{i} + 3\mathbf{j} + 2\mathbf{k}) + s(-4\mathbf{i} + 2\mathbf{j} + 7\mathbf{k})
$$

---

## 4 · 10 marks

**Question**

Show that $\cos 3\theta \equiv 4\cos^3\theta - 3\cos\theta$. Hence, or otherwise,

(a) find all solutions of the equation $\cos 3\theta = \frac{1}{2}$ in the interval $0 \le \theta \le \pi$;

(b) solve the equation $4x^3 - 3x = \frac{1}{2}$, giving your answers correct to 4 decimal places.

**Solution**

Write $c = \cos\theta$ and $s = \sin\theta$:

$$
\cos 3\theta = \cos 2\theta\cos\theta - \sin 2\theta\sin\theta = (2c^2 - 1)c - 2s^2c = 2c^3 - c - 2(1 - c^2)c = 4c^3 - 3c \ ✓
$$

**(a)** $0 \le 3\theta \le 3\pi$, and $\cos 3\theta = \frac{1}{2}$ gives $3\theta = \frac{\pi}{3}, \frac{5\pi}{3}, \frac{7\pi}{3}$:

$$
\theta = \frac{\pi}{9},\ \frac{5\pi}{9},\ \frac{7\pi}{9}
$$

**(b)** Put $x = \cos\theta$. The equation becomes $\cos 3\theta = \frac{1}{2}$, so the three roots of the cubic are

$$
x = \cos\frac{\pi}{9} \approx 0.9397, \qquad x = \cos\frac{5\pi}{9} \approx -0.1736, \qquad x = \cos\frac{7\pi}{9} \approx -0.7660
$$

---

## 5 · 12 marks

**Question**

Evaluate

(a) $\displaystyle\int_0^1 \frac{x}{(x + 2)(x + 3)}\,dx$, leaving your answer in terms of natural logarithms,

(b) $\displaystyle\int_0^1 xe^{x + 2}\,dx$, leaving your answer in terms of $e$,

(c) $\displaystyle\int_0^{\pi/3} \sin^3 x\,dx$.

**Solution**

**(a)** $\dfrac{x}{(x + 2)(x + 3)} = \dfrac{-2}{x + 2} + \dfrac{3}{x + 3}$ (put $x = -2$: $-2 = A$; $x = -3$: $-3 = -B$).

$$
\int_0^1 = \Big[-2\ln(x + 2) + 3\ln(x + 3)\Big]_0^1 = (-2\ln 3 + 3\ln 4) - (-2\ln 2 + 3\ln 3) = 8\ln 2 - 5\ln 3 = \ln\frac{256}{243}
$$

**(b)** $xe^{x + 2} = e^2 \cdot xe^x$, and by parts $\int xe^x\,dx = (x - 1)e^x$:

$$
\int_0^1 xe^{x + 2}\,dx = e^2\Big[(x - 1)e^x\Big]_0^1 = e^2\big(0 - (-1)\big) = e^2
$$

**(c)** $\sin^3 x = (1 - \cos^2 x)\sin x$:

$$
\int_0^{\pi/3} \sin^3 x\,dx = \left[-\cos x + \frac{\cos^3 x}{3}\right]_0^{\pi/3} = \left(-\frac{1}{2} + \frac{1}{24}\right) - \left(-1 + \frac{1}{3}\right) = \frac{5}{24}
$$

---

## 6 · 11 marks

**Question**

Find $\dfrac{dy}{dx}$, given that

(a) $y = \arctan\left(\dfrac{1 - x}{1 + x}\right)$, simplifying your answer as much as possible,

(b) $y = \ln(x^3 - 3x^2 + 6)^2$,

(c) $x = \dfrac{2t}{1 + t}$, $y = 3t^2 + 1$, leaving your answer in terms of the parameter $t$.

**Solution**

**(a)** Let $u = \frac{1 - x}{1 + x}$. Then $\frac{du}{dx} = \frac{-(1 + x) - (1 - x)}{(1 + x)^2} = \frac{-2}{(1 + x)^2}$ and $1 + u^2 = \frac{2(1 + x^2)}{(1 + x)^2}$:

$$
\frac{dy}{dx} = \frac{1}{1 + u^2}\frac{du}{dx} = \frac{(1 + x)^2}{2(1 + x^2)} \cdot \frac{-2}{(1 + x)^2} = -\frac{1}{1 + x^2}
$$

**(b)** $y = 2\ln(x^3 - 3x^2 + 6)$, so

$$
\frac{dy}{dx} = \frac{2(3x^2 - 6x)}{x^3 - 3x^2 + 6} = \frac{6x(x - 2)}{x^3 - 3x^2 + 6}
$$

**(c)** $\frac{dx}{dt} = \frac{2(1 + t) - 2t}{(1 + t)^2} = \frac{2}{(1 + t)^2}$ and $\frac{dy}{dt} = 6t$:

$$
\frac{dy}{dx} = 6t \cdot \frac{(1 + t)^2}{2} = 3t(1 + t)^2
$$

---

## 7

**Question**

Express the complex number $z = \dfrac{-5 + 10i}{1 + 2i}$ in the form $a + ib$, where $a, b \in \mathbb{R}$. Hence or otherwise find

(a) the modulus and argument of $z$,

(b) the square roots of $z$.

**Solution**

$$
z = \frac{(-5 + 10i)(1 - 2i)}{(1 + 2i)(1 - 2i)} = \frac{-5 + 10i + 10i + 20}{5} = \frac{15 + 20i}{5} = 3 + 4i
$$

**(a)** $|z| = \sqrt{9 + 16} = 5$ and $\arg z = \tan^{-1}\frac{4}{3} \approx 0.927$ rad $\approx 53.13^\circ$.

**(b)** Let $(a + ib)^2 = 3 + 4i$. Then $a^2 - b^2 = 3$ and $2ab = 4$. With $b = \frac{2}{a}$: $a^4 - 3a^2 - 4 = 0$, so $a^2 = 4$ and $a = \pm 2$, $b = \pm 1$.

The square roots are $2 + i$ and $-2 - i$. (Check: $(2 + i)^2 = 4 + 4i - 1 = 3 + 4i$ ✓.)

**Note:** the source does not give the marks for this question.

---

## 8 · 8 marks

**Question**

(i) Solve the differential equation $y(1 + x^2)\dfrac{dy}{dx} - 2(1 + y^2) = 0$, given that $y = 0$ when $x = 0$.

(ii) Find the range of values of $x$ for which $(x - 3)(x + 4)(x + 6) \le 0$.

**Solution**

**(i)** Separate the variables:

$$
\int\frac{y}{1 + y^2}\,dy = \int\frac{2}{1 + x^2}\,dx \quad\Rightarrow\quad \frac{1}{2}\ln(1 + y^2) = 2\tan^{-1}x + c
$$

At $x = 0$, $y = 0$: $c = 0$. So

$$
\ln(1 + y^2) = 4\tan^{-1}x \quad\Rightarrow\quad y^2 = e^{4\tan^{-1}x} - 1
$$

**(ii)** The critical values are $-6$, $-4$ and $3$.

| Interval | $x < -6$ | $-6 < x < -4$ | $-4 < x < 3$ | $x > 3$ |
| -------- | -------- | ------------- | ------------ | ------- |
| Sign     | $-$      | $+$           | $-$          | $+$     |

$$
x \le -6 \quad\text{or}\quad -4 \le x \le 3
$$

---

## 9

**Question**

(a) Prove, by mathematical induction, that $\displaystyle\sum_{r=1}^{n}(4r + 3) = 2n^2 + 5n$.

(b) Prove by contradiction that $\sqrt{2}$ is not a rational number. (You may assume that the square of an odd integer is always odd.)

**Solution**

**(a)** **Base case**, $n = 1$: the left side is $7$ and the right side is $2 + 5 = 7$. ✓

**Inductive step:** assume $\sum_{r=1}^{k}(4r + 3) = 2k^2 + 5k$. Then

$$
\sum_{r=1}^{k + 1}(4r + 3) = 2k^2 + 5k + 4(k + 1) + 3 = 2k^2 + 9k + 7 = 2(k + 1)^2 + 5(k + 1)
$$

since $2(k + 1)^2 + 5(k + 1) = 2k^2 + 4k + 2 + 5k + 5$. ✓ By induction the formula holds for all positive integers $n$.

**(b)** Suppose, for contradiction, that $\sqrt{2} = \frac{p}{q}$, where $p$ and $q$ are integers with no common factor.

Then $p^2 = 2q^2$, so $p^2$ is even. Since the square of an odd number is odd, $p$ must be even: $p = 2m$.

Then $4m^2 = 2q^2$, so $q^2 = 2m^2$ is even, and likewise $q$ is even.

So $p$ and $q$ are both even, which contradicts their having no common factor. Hence $\sqrt{2}$ is irrational.

**Note:** the source does not give the marks for this question.

---

## 10 · 9 marks

**Question**

Show that $x = -1$ is a root of the equation $f(x) = 0$, where $f(x) \equiv x^4 + x^3 + 3x^2 - 9x - 12$.

Show also that another root of this equation lies in the interval $1 < x < 2$.

Starting with 1.5 as a first approximation, use the Newton–Raphson procedure twice to find another approximation to this root, giving your answer correct to three decimal places.

**Solution**

$f(-1) = 1 - 1 + 3 + 9 - 12 = 0$, so $x = -1$ is a root.

$f(1) = 1 + 1 + 3 - 9 - 12 = -16 < 0$ and $f(2) = 16 + 8 + 12 - 18 - 12 = 6 > 0$. $f$ is continuous and changes sign, so there is a root in $1 < x < 2$.

Newton–Raphson, with $f'(x) = 4x^3 + 3x^2 + 6x - 9$:

$$
x_1 = 1.5 - \frac{f(1.5)}{f'(1.5)} = 1.5 - \frac{-10.3125}{20.25} \approx 2.009259
$$

$$
x_2 = 2.009259 - \frac{f(2.009259)}{f'(2.009259)} \approx 2.009259 - \frac{6.4380}{47.6134} \approx 1.874
$$

**Answer:** $x \approx 1.874$ after two iterations. (Further iterations converge to the root $x \approx 1.859$.)
