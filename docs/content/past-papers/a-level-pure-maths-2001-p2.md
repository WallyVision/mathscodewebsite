# A Level Pure Mathematics · June 2001 · Paper 2

Subject: **A Level Pure Mathematics with Mechanics** (this pure paper is shared with Pure Mathematics
with Statistics). Past paper: **2001, Paper 2** (GCE Board). Structured questions.
Questions are copied as set (misprints corrected and noted). Worked solutions are our own.

To add it: create the **2001 Paper 2** past paper for the subject, open it in **Admin → Past
papers**, press **Import many** under **Written questions**, choose this file and press **Check**,
then **Import questions**. Labels the paper already has are skipped, so importing twice is safe.

---

## 1 · 8 marks

**Question**

Relations $R_1$ and $R_2$ are defined on the set of integers by

- $xR_1y$ if and only if $x + y$ is an even number,
- $xR_2y$ if and only if $x + y$ is an odd number.

Show that $R_1$ is an equivalence relation and that $R_2$ is not.

The relation $R_3$ is defined on the set $S = \{3, 6, 12, 24\}$ by $xR_3y$ if and only if $x$ is a proper factor of $y$. Show that $R_3$ is a strict order relation.

**Solution**

**$R_1$:**

- Reflexive: $x + x = 2x$ is even.
- Symmetric: $x + y = y + x$.
- Transitive: if $x + y$ and $y + z$ are even, then $x + z = (x + y) + (y + z) - 2y$ is even.

So $R_1$ is an equivalence relation.

**$R_2$** is not reflexive: $x + x = 2x$ is never odd. (It is not transitive either: $1R_22$ and $2R_23$, but $1 + 3$ is even.) So $R_2$ is not an equivalence relation.

**$R_3$** on $S$:

- Irreflexive: no number is a _proper_ factor of itself.
- Transitive: if $x$ is a proper factor of $y$ and $y$ is a proper factor of $z$, then $x$ is a proper factor of $z$.
- Hence also antisymmetric: $xR_3y$ and $yR_3x$ would give $xR_3x$, which is impossible.

So $R_3$ is a strict order relation. Each element divides the next ($3 \mid 6 \mid 12 \mid 24$), so in fact any two elements are comparable: it is a strict total order.

**Note:** the letters are missing from the source ("if and only if is a factor of"). We read it as "$x$ is a proper factor of $y$", because a strict order must be irreflexive. With "$x$ is a factor of $y$" (allowing $x = y$) the relation is reflexive, antisymmetric and transitive, which makes it an order relation but not a strict one.

---

## 2 · 12 marks

**Question**

| $x$ | 2    | 3     | 4      | 5      | 6      |
| --- | ---- | ----- | ------ | ------ | ------ |
| $y$ | 56.6 | 350.7 | 1280.0 | 3493.9 | 7963.3 |

The table shows corresponding values of $x$ and $y$ obtained experimentally. By drawing a suitable graph relating $\log_{10}x$ and $\log_{10}y$, show that these values support the hypothesis that $x$ and $y$ are connected by a relationship of the form $y = px^q$, where $p$ and $q$ are constants. Use your graph to estimate the values of $p$ and $q$ to one decimal place.

Hence estimate the value of $\displaystyle\int_2^6 y\,dx$. Use the trapezium rule to obtain another estimate for $\displaystyle\int_2^6 y\,dx$.

**Solution**

$\log y = \log p + q\log x$: plot $\log y$ against $\log x$.

| $\log x$ | 0.301 | 0.477 | 0.602 | 0.699 | 0.778 |
| -------- | ----- | ----- | ----- | ----- | ----- |
| $\log y$ | 1.753 | 2.545 | 3.107 | 3.543 | 3.901 |

The points lie on a straight line, which supports the hypothesis.

$$
q = \text{gradient} \approx \frac{3.901 - 1.753}{0.778 - 0.301} \approx 4.5, \qquad \log p \approx 1.753 - 4.5(0.301) \approx 0.398 \Rightarrow p \approx 2.5
$$

So $y \approx 2.5x^{4.5}$.

**Integral from the law:**

$$
\int_2^6 2.5x^{4.5}\,dx = \frac{2.5}{5.5}\Big[x^{5.5}\Big]_2^6 = \frac{5}{11}\left(6^{5.5} - 2^{5.5}\right) \approx \frac{5}{11}(19\,047 - 45.3) \approx 8640
$$

**Trapezium rule** ($h = 1$):

$$
\frac{1}{2}\big[56.6 + 7963.3 + 2(350.7 + 1280.0 + 3493.9)\big] = \frac{1}{2}(8019.9 + 10\,249.2) \approx 9135
$$

(The trapezium rule over-estimates here, because the curve bends upwards.)

---

## 3 · 11 marks

**Question**

(i) The angle between two vectors $\mathbf{a}$ and $\mathbf{b}$ is $\dfrac{\pi}{3}$. Given that $|\mathbf{a}| = 3$ and $|\mathbf{b}| = 4$, find (a) $|2\mathbf{a} + 3\mathbf{b}|$, (b) $|2\mathbf{a} - 3\mathbf{b}|$.

(ii) Show that the lines

$$
\mathbf{r} = (1 - \lambda)\mathbf{i} + 3\lambda\mathbf{j} + (2\lambda + 5)\mathbf{k}, \qquad \mathbf{r} = 2\mu\mathbf{i} + (\mu - 4)\mathbf{j} + 3\mathbf{k},
$$

where $\mu$ and $\lambda$ are parameters, intersect, giving the point of intersection. Write down a vector parametric equation of the plane which contains these lines.

**Solution**

**(i)** $\mathbf{a} \cdot \mathbf{b} = 3 \times 4 \times \cos\frac{\pi}{3} = 6$.

**(a)**

$$
|2\mathbf{a} + 3\mathbf{b}|^2 = 4|\mathbf{a}|^2 + 12\,\mathbf{a} \cdot \mathbf{b} + 9|\mathbf{b}|^2 = 36 + 72 + 144 = 252 \quad\Rightarrow\quad |2\mathbf{a} + 3\mathbf{b}| = 6\sqrt{7}
$$

**(b)**

$$
|2\mathbf{a} - 3\mathbf{b}|^2 = 36 - 72 + 144 = 108 \quad\Rightarrow\quad |2\mathbf{a} - 3\mathbf{b}| = 6\sqrt{3}
$$

**(ii)** Equate components:

$$
1 - \lambda = 2\mu, \qquad 3\lambda = \mu - 4, \qquad 2\lambda + 5 = 3
$$

The third gives $\lambda = -1$; then the first gives $\mu = 1$, and the second checks: $-3 = -3$ ✓. The point of intersection is $(2, -3, 3)$.

The direction vectors are $-\mathbf{i} + 3\mathbf{j} + 2\mathbf{k}$ and $2\mathbf{i} + \mathbf{j}$, so the plane is

$$
\mathbf{r} = 2\mathbf{i} - 3\mathbf{j} + 3\mathbf{k} + s(-\mathbf{i} + 3\mathbf{j} + 2\mathbf{k}) + t(2\mathbf{i} + \mathbf{j}), \qquad s, t \in \mathbb{R}
$$

---

## 4 · 9 marks

**Question**

(i) Show that $\dfrac{\sin\theta + \sin 2\theta}{1 + \cos\theta + \cos 2\theta} = \tan\theta$.

(ii) Find the general solution of the equation $\sin 4x - \cos 2x = 0$.

**Solution**

**(i)**

$$
\frac{\sin\theta + 2\sin\theta\cos\theta}{\cos\theta + 2\cos^2\theta} = \frac{\sin\theta(1 + 2\cos\theta)}{\cos\theta(1 + 2\cos\theta)} = \tan\theta \ ✓
$$

**(ii)** $\sin 4x = 2\sin 2x\cos 2x$, so $\cos 2x(2\sin 2x - 1) = 0$:

- $\cos 2x = 0$: $x = \frac{\pi}{4} + \frac{n\pi}{2}$;
- $\sin 2x = \frac{1}{2}$: $2x = \frac{\pi}{6} + 2n\pi$ or $\frac{5\pi}{6} + 2n\pi$, so $x = \frac{\pi}{12} + n\pi$ or $x = \frac{5\pi}{12} + n\pi$,

with $n \in \mathbb{Z}$.

**Note:** "$= \tan\theta$" is missing from part (i) in the source and has been restored.

---

## 5 · 9 marks

**Question**

(i) Differentiate $\dfrac{1}{x - 3} + 2\ln\left(\dfrac{x - 4}{x - 3}\right)$ with respect to $x$ and express your answer as a single fraction.

(ii) Solve the differential equation $xy\dfrac{dy}{dx} = 1 + y^2$, given that $y = 0$ when $x = 2$.

**Solution**

**(i)** Write $y = (x - 3)^{-1} + 2\ln(x - 4) - 2\ln(x - 3)$:

$$
\frac{dy}{dx} = -\frac{1}{(x - 3)^2} + \frac{2}{x - 4} - \frac{2}{x - 3} = \frac{-(x - 4) + 2(x - 3)^2 - 2(x - 3)(x - 4)}{(x - 3)^2(x - 4)}
$$

The numerator is $-x + 4 + 2x^2 - 12x + 18 - 2x^2 + 14x - 24 = x - 2$, so

$$
\frac{dy}{dx} = \frac{x - 2}{(x - 3)^2(x - 4)}
$$

**(ii)** Separate the variables:

$$
\int\frac{y}{1 + y^2}\,dy = \int\frac{dx}{x} \quad\Rightarrow\quad \frac{1}{2}\ln(1 + y^2) = \ln|x| + c \quad\Rightarrow\quad 1 + y^2 = Ax^2
$$

At $x = 2$, $y = 0$: $1 = 4A$, so $A = \frac{1}{4}$ and

$$
y^2 = \frac{x^2}{4} - 1
$$

---

## 6 · 9 marks

**Question**

Express $f(x)$, where $f(x) = \dfrac{x + x^2}{(x^2 + 1)(x - 2)}$, in partial fractions.

Hence show that $\displaystyle\int_0^1 f(x)\,dx = \frac{3\pi}{20} - \frac{13}{10}\ln 2$.

**Solution**

$$
\frac{x^2 + x}{(x^2 + 1)(x - 2)} = \frac{A}{x - 2} + \frac{Bx + C}{x^2 + 1} \quad\Rightarrow\quad x^2 + x = A(x^2 + 1) + (Bx + C)(x - 2)
$$

$x = 2$: $6 = 5A$, so $A = \frac{6}{5}$. Comparing $x^2$ terms: $1 = A + B$, so $B = -\frac{1}{5}$. Comparing constants: $0 = A - 2C$, so $C = \frac{3}{5}$.

$$
f(x) = \frac{6}{5(x - 2)} + \frac{-x + 3}{5(x^2 + 1)}
$$

Integrate:

$$
\int_0^1 f(x)\,dx = \left[\frac{6}{5}\ln|x - 2| - \frac{1}{10}\ln(x^2 + 1) + \frac{3}{5}\tan^{-1}x\right]_0^1
$$

$$
= \frac{6}{5}(\ln 1 - \ln 2) - \frac{1}{10}\ln 2 + \frac{3}{5} \cdot \frac{\pi}{4} = \frac{3\pi}{20} - \frac{13}{10}\ln 2 \ ✓
$$

**Note:** the source prints the denominator as $(x^2 + 1)(x - 2 - n)$ and says "partial frictions". The given answer matches $(x^2 + 1)(x - 2)$.

---

## 7 · 11 marks

**Question**

Find, in the form $x + iy$, where $x, y \in \mathbb{R}$, the square roots of $\dfrac{169}{5 - 12i}$. Find also, in degrees to one decimal place, the principal value of the argument of each of the square roots.

**Solution**

$$
\frac{169}{5 - 12i} = \frac{169(5 + 12i)}{25 + 144} = 5 + 12i
$$

Let $(a + ib)^2 = 5 + 12i$: $a^2 - b^2 = 5$ and $ab = 6$. Then $a^2 - \frac{36}{a^2} = 5$, so $a^4 - 5a^2 - 36 = 0$, giving $a^2 = 9$. Hence $a = \pm 3$ and $b = \pm 2$ (same sign, since $ab > 0$).

The square roots are $3 + 2i$ and $-3 - 2i$.

$$
\arg(3 + 2i) = \tan^{-1}\frac{2}{3} \approx 33.7^\circ, \qquad \arg(-3 - 2i) \approx 33.7^\circ - 180^\circ = -146.3^\circ
$$

---

## 8 · 9 marks

**Question**

Given that $n$ is a positive integer, prove by induction that $7^n + 5$ is divisible by 6.

Guess a common factor of $5^n + 3$ for all positive integers $n$, and prove your guess by induction.

**Solution**

**$7^n + 5$.** Base case: $7 + 5 = 12 = 6 \times 2$. ✓

Inductive step: assume $7^k + 5 = 6m$. Then

$$
7^{k + 1} + 5 = 7(7^k + 5) - 30 = 42m - 30 = 6(7m - 5)
$$

which is divisible by 6. By induction, the result holds for all $n \ge 1$.

**$5^n + 3$.** The values are $8, 28, 128, \ldots$, all divisible by 4. Guess: 4 is a common factor.

Base case: $5 + 3 = 8 = 4 \times 2$. ✓

Inductive step: assume $5^k + 3 = 4m$. Then

$$
5^{k + 1} + 3 = 5(5^k + 3) - 12 = 20m - 12 = 4(5m - 3)
$$

So 4 divides $5^n + 3$ for every positive integer $n$.

---

## 9

**Question**

Find the set of real values of $x$ for which

(a) $\left|\dfrac{3x + 4}{2x - 3}\right| < 1$,

(b) $\dfrac{3x + 4}{2x - 3} < 1$.

**Solution**

**(a)** For $x \ne \frac{3}{2}$, square both sides of $|3x + 4| < |2x - 3|$:

$$
9x^2 + 24x + 16 < 4x^2 - 12x + 9 \quad\Rightarrow\quad 5x^2 + 36x + 7 < 0 \quad\Rightarrow\quad (5x + 1)(x + 7) < 0
$$

$$
\left\{x : -7 < x < -\frac{1}{5}\right\}
$$

**(b)**

$$
\frac{3x + 4}{2x - 3} - 1 < 0 \quad\Rightarrow\quad \frac{x + 7}{2x - 3} < 0 \quad\Rightarrow\quad \left\{x : -7 < x < \frac{3}{2}\right\}
$$

**Note:** the source does not give the marks for this question.

---

## 10 · 14 marks

**Question**

The function $f$ is defined by $f(x) = \dfrac{3x - 1}{(x - 1)^2}$, $x \ne 1$.

(a) Sketch the graph of $f(x)$, showing clearly the coordinates of the turning point(s) and its behaviour as it approaches its asymptotes.

(b) Show that the area of the finite region bounded by the curve and the lines $x = 4$ and $y = 2$ is $\dfrac{5}{3} + 3\ln\dfrac{2}{3}$.

**Solution**

**(a)** Quotient rule (after cancelling one factor of $x - 1$):

$$
f'(x) = \frac{3(x - 1) - 2(3x - 1)}{(x - 1)^3} = \frac{-(3x + 1)}{(x - 1)^3}
$$

$f'(x) = 0$ at $x = -\frac{1}{3}$, where $f = \frac{-2}{16/9} = -\frac{9}{8}$. $f'$ changes from $-$ to $+$ there, so it is a **minimum** at $\left(-\frac{1}{3}, -\frac{9}{8}\right)$.

- **Intercepts:** $(0, -1)$ and $\left(\frac{1}{3}, 0\right)$.
- **Asymptotes:** $x = 1$, where $f \to +\infty$ on both sides (the numerator is near 2 and the denominator is a positive square), and $y = 0$, with $f \to 0^+$ as $x \to +\infty$ and $f \to 0^-$ as $x \to -\infty$.

So: from just below the $x$-axis on the far left, the curve falls to the minimum $\left(-\frac{1}{3}, -\frac{9}{8}\right)$, rises through $(0, -1)$ and $\left(\frac{1}{3}, 0\right)$ to $+\infty$ near $x = 1$, then comes down from $+\infty$ on the right of $x = 1$ towards the $x$-axis.

**(b)** Write $f(x) = \dfrac{3(x - 1) + 2}{(x - 1)^2} = \dfrac{3}{x - 1} + \dfrac{2}{(x - 1)^2}$.

The curve meets $y = 2$ where $3x - 1 = 2(x - 1)^2$, that is $2x^2 - 7x + 3 = 0$, so $x = \frac{1}{2}$ or $x = 3$. On the right-hand branch, the finite region lies between $x = 3$ and $x = 4$, below $y = 2$ and above the curve:

$$
\int_3^4 \big(2 - f(x)\big)\,dx = 2 - \left[3\ln(x - 1) - \frac{2}{x - 1}\right]_3^4 = 2 - \left(3\ln\frac{3}{2} + \frac{1}{3}\right)
$$

$$
= \frac{5}{3} - 3\ln\frac{3}{2} = \frac{5}{3} + 3\ln\frac{2}{3} \ ✓
$$
