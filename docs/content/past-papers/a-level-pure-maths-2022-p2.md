# A Level Pure Mathematics · June 2022 · Paper 2

Subject: **A Level Pure Mathematics with Mechanics** (this pure paper is shared with Pure Mathematics
with Statistics). Past paper: **2022, Paper 2** (GCE Board). Structured questions.
Questions are copied as set (unreadable details restored and noted). Worked solutions are our own.

To add it: create the **2022 Paper 2** past paper for the subject, open it in **Admin → Past
papers**, press **Import many** under **Written questions**, choose this file and press **Check**,
then **Import questions**. Labels the paper already has are skipped, so importing twice is safe.

**Not included:** Q6(i) (4 marks). The pair of simultaneous equations in $z$ and $w$ is missing
from the Word file. Add it from the printed paper with its own label, such as **6a**.

---

## 1 · 12 marks

**Question**

(i) Given that the roots of the equation $3x^2 - 4x + 2 = 0$ are $\alpha$ and $\beta$,

(a) show that $\left(\alpha + \dfrac{\alpha}{\beta}\right)\left(\beta + \dfrac{\beta}{\alpha}\right) = 3$; **(3 marks)**

(b) find an equation with integral coefficients whose roots are $\dfrac{1}{\alpha}$ and $\dfrac{1}{\beta}$. **(3 marks)**

(ii) The polynomial $P(x)$ is such that $P(x) = ax^3 + bx^2 - 2x - 6$. Given that $P(x)$ leaves a remainder 10 when divided by $x - 2$ and that $2x - 3$ is a factor of $P(x)$, find the values of the constants $a$ and $b$. **(4, 2 marks)**

**Solution**

**(i)** $\alpha + \beta = \frac{4}{3}$ and $\alpha\beta = \frac{2}{3}$.

**(a)** Expand the brackets:

$$
\left(\alpha + \frac{\alpha}{\beta}\right)\left(\beta + \frac{\beta}{\alpha}\right) = \alpha\beta + \alpha \cdot \frac{\beta}{\alpha} + \frac{\alpha}{\beta} \cdot \beta + \frac{\alpha}{\beta} \cdot \frac{\beta}{\alpha} = \alpha\beta + \beta + \alpha + 1
$$

$$
= \frac{2}{3} + \frac{4}{3} + 1 = 3 \ ✓
$$

**(b)**

$$
\frac{1}{\alpha} + \frac{1}{\beta} = \frac{\alpha + \beta}{\alpha\beta} = \frac{4/3}{2/3} = 2, \qquad \frac{1}{\alpha\beta} = \frac{3}{2}
$$

So $x^2 - 2x + \frac{3}{2} = 0$, that is

$$
2x^2 - 4x + 3 = 0
$$

**(ii)** Remainder theorem, $P(2) = 10$:

$$
8a + 4b - 4 - 6 = 10 \quad\Rightarrow\quad 2a + b = 5
$$

Factor theorem, $P\left(\frac{3}{2}\right) = 0$:

$$
\frac{27}{8}a + \frac{9}{4}b - 3 - 6 = 0 \quad\Rightarrow\quad 27a + 18b = 72 \quad\Rightarrow\quad 3a + 2b = 8
$$

From the first, $b = 5 - 2a$. Then $3a + 10 - 4a = 8$, so $a = 2$ and $b = 1$.

---

## 2 · 12 marks

**Question**

(i) A function $f : \mathbb{R} - \{-1\} \to \mathbb{R} - \{1\}$ is defined by $f(x) = \dfrac{x - 1}{x + 1}$.

(a) Show that $f$ is surjective. **(3 marks)**

(b) Find the composite function $(f \circ f)(x)$, stating its domain. **(3 marks)**

(c) Determine whether $f \circ f(x)$ is an even or an odd function. **(2 marks)**

(ii) Expand $\dfrac{1 - x}{(1 + 2x)^{\frac{1}{3}}}$ as a series in ascending powers of $x$ as far as the term in $x^2$. **(4 marks)**

**Solution**

**(i)(a)** Take any $y$ in the codomain, $y \ne 1$, and solve $f(x) = y$:

$$
\frac{x - 1}{x + 1} = y \quad\Rightarrow\quad x - 1 = xy + y \quad\Rightarrow\quad x(1 - y) = 1 + y \quad\Rightarrow\quad x = \frac{1 + y}{1 - y}
$$

This $x$ exists because $y \ne 1$, and $x \ne -1$ (otherwise $1 + y = y - 1$, which is impossible). So every $y$ in $\mathbb{R} - \{1\}$ has a pre-image, and $f$ is surjective.

**(i)(b)**

$$
f(f(x)) = \frac{\frac{x - 1}{x + 1} - 1}{\frac{x - 1}{x + 1} + 1} = \frac{(x - 1) - (x + 1)}{(x - 1) + (x + 1)} = \frac{-2}{2x} = -\frac{1}{x}
$$

For $f(f(x))$ we need $x \ne -1$, and $f(x) \ne -1$, which means $x \ne 0$ (since $f(0) = -1$). The domain is $\mathbb{R} - \{-1, 0\}$.

**(i)(c)** Let $g(x) = -\frac{1}{x}$. Then $g(-x) = \frac{1}{x} = -g(x)$, so the rule is **odd**.

(Strictly, the domain $\mathbb{R} - \{-1, 0\}$ contains $1$ but not $-1$, so it is not symmetric. The expected answer is "odd", from the rule $-\frac{1}{x}$.)

**(ii)** First expand $(1 + 2x)^{-1/3}$:

$$
(1 + 2x)^{-\frac{1}{3}} = 1 + \left(-\tfrac{1}{3}\right)(2x) + \frac{\left(-\frac{1}{3}\right)\left(-\frac{4}{3}\right)}{2!}(2x)^2 + \ldots = 1 - \frac{2}{3}x + \frac{8}{9}x^2 + \ldots
$$

Multiply by $(1 - x)$ and keep terms up to $x^2$:

$$
(1 - x)\left(1 - \frac{2}{3}x + \frac{8}{9}x^2\right) = 1 - \frac{2}{3}x - x + \frac{8}{9}x^2 + \frac{2}{3}x^2 = 1 - \frac{5}{3}x + \frac{14}{9}x^2 + \ldots
$$

valid for $|x| < \frac{1}{2}$.

---

## 3 · 14 marks

**Question**

The position vectors of the points $A$, $B$ and $C$ are $\mathbf{a}$, $\mathbf{b}$ and $\mathbf{c}$ respectively, where

$$
\mathbf{a} = \mathbf{i} + 5\mathbf{j} - 3\mathbf{k}, \qquad \mathbf{b} = -3\mathbf{i} - \mathbf{j} + 7\mathbf{k}, \qquad \mathbf{c} = \mathbf{i} + \mathbf{j}
$$

Given that $M$ is the midpoint of $AB$, find

(a) an equation of the line $AB$ in the form $\mathbf{r} = \mathbf{a} + t\mathbf{d}$, **(2 marks)**

(b) the position vector of $M$, **(2 marks)**

(c) the Cartesian equation of the plane $ABC$, **(5 marks)**

(d) the value of the constant $a$ for which the line $\mathbf{r} = \mathbf{j} + 2\mathbf{k} + \lambda(2\mathbf{i} + a\mathbf{j} + \mathbf{k})$ is parallel to the plane $ABC$. **(5 marks)**

**Solution**

**(a)** $\overrightarrow{AB} = \mathbf{b} - \mathbf{a} = -4\mathbf{i} - 6\mathbf{j} + 10\mathbf{k}$:

$$
\mathbf{r} = \mathbf{i} + 5\mathbf{j} - 3\mathbf{k} + t(-4\mathbf{i} - 6\mathbf{j} + 10\mathbf{k})
$$

**(b)** $\overrightarrow{OM} = \frac{1}{2}(\mathbf{a} + \mathbf{b}) = -\mathbf{i} + 2\mathbf{j} + 2\mathbf{k}$.

**(c)** $\overrightarrow{AC} = \mathbf{c} - \mathbf{a} = -4\mathbf{j} + 3\mathbf{k}$. A normal to the plane is

$$
\overrightarrow{AB} \times \overrightarrow{AC} = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ -4 & -6 & 10 \\ 0 & -4 & 3 \end{vmatrix} = (-18 + 40)\mathbf{i} - (-12 - 0)\mathbf{j} + (16 - 0)\mathbf{k} = 22\mathbf{i} + 12\mathbf{j} + 16\mathbf{k}
$$

Use $\mathbf{n} = 11\mathbf{i} + 6\mathbf{j} + 8\mathbf{k}$. Through $C(1, 1, 0)$: $11 + 6 + 0 = 17$, so

$$
11x + 6y + 8z = 17
$$

Check: $A$ gives $11 + 30 - 24 = 17$ ✓ and $B$ gives $-33 - 6 + 56 = 17$ ✓.

**(d)** The line is parallel to the plane when its direction is perpendicular to the normal:

$$
(2\mathbf{i} + a\mathbf{j} + \mathbf{k}) \cdot (11\mathbf{i} + 6\mathbf{j} + 8\mathbf{k}) = 22 + 6a + 8 = 0 \quad\Rightarrow\quad a = -5
$$

(The point $(0, 1, 2)$ on the line gives $6 + 16 = 22 \ne 17$, so the line is parallel to the plane and not in it.)

---

## 4 · 9 marks

**Question**

Given that $f(\theta) = \dfrac{\cos\theta}{1 - \tan\theta} + \dfrac{\sin\theta}{1 - \cot\theta}$,

(a) prove that $f(\theta) \equiv \cos\theta + \sin\theta$; **(3 marks)**

(b) express $f(\theta)$ in the form $R\sin(\theta + \lambda)$, where $R > 0$ and $\lambda$ is an acute angle; **(3 marks)**

(c) find the general solution of the equation $f(\theta) = 1$. **(3 marks)**

**Solution**

**(a)** Write $\tan\theta = \frac{s}{c}$ and $\cot\theta = \frac{c}{s}$, with $s = \sin\theta$ and $c = \cos\theta$:

$$
\frac{c}{1 - \frac{s}{c}} + \frac{s}{1 - \frac{c}{s}} = \frac{c^2}{c - s} + \frac{s^2}{s - c} = \frac{c^2 - s^2}{c - s} = \frac{(c - s)(c + s)}{c - s} = c + s \ ✓
$$

**(b)** $R\sin(\theta + \lambda) = R\sin\theta\cos\lambda + R\cos\theta\sin\lambda$, so $R\cos\lambda = 1$ and $R\sin\lambda = 1$:

$$
R = \sqrt{2}, \quad \lambda = 45^\circ \quad\Rightarrow\quad f(\theta) = \sqrt{2}\sin(\theta + 45^\circ)
$$

**(c)** $\sin(\theta + 45^\circ) = \frac{1}{\sqrt{2}}$, so $\theta + 45^\circ = 45^\circ + 360^\circ n$ or $135^\circ + 360^\circ n$:

$$
\theta = 360^\circ n \quad\text{or}\quad \theta = 90^\circ + 360^\circ n, \qquad n \in \mathbb{Z}
$$

(In radians, $\theta = 2n\pi$ or $\frac{\pi}{2} + 2n\pi$.)

Strictly, at these angles $\cot\theta$ or $\tan\theta$ is undefined, so the original form of $f$ is not defined there. The expected answer solves $\cos\theta + \sin\theta = 1$ as above.

---

## 5 · 10 marks

**Question**

(i) The sum of the sixth and eighth terms of an arithmetic progression is 40. The seventh term is 4 times the second term. Find

(a) the first term and the common difference, **(3 marks)**

(b) the least number of terms required for the sum of the progression to exceed 1000. **(3 marks)**

(ii) (a) If $y = (\sin x)(\ln x)$, find $\dfrac{dy}{dx}$. **(2 marks)**

(b) If $x = 1 + t^3$ and $y = t + t^4$, find $\dfrac{dy}{dx}$ in terms of $t$. **(2 marks)**

**Solution**

**(i)(a)**

$$
T_6 + T_8 = 2a + 12d = 40 \quad\Rightarrow\quad a + 6d = 20
$$

$$
T_7 = 4T_2 \quad\Rightarrow\quad a + 6d = 4a + 4d \quad\Rightarrow\quad 20 = 4(a + d) \quad\Rightarrow\quad a + d = 5
$$

Subtract: $5d = 15$, so $d = 3$ and $a = 2$.

**(i)(b)**

$$
S_n = \frac{n}{2}\big[4 + 3(n - 1)\big] = \frac{n(3n + 1)}{2} > 1000 \quad\Rightarrow\quad 3n^2 + n - 2000 > 0
$$

The positive root of $3n^2 + n - 2000 = 0$ is $n = \frac{-1 + \sqrt{24\,001}}{6} \approx 25.6$. Check: $S_{25} = \frac{25 \times 76}{2} = 950$ and $S_{26} = \frac{26 \times 79}{2} = 1027$.

The least number of terms is **26**.

**(ii)(a)** Product rule:

$$
\frac{dy}{dx} = \cos x\ln x + \frac{\sin x}{x}
$$

**(ii)(b)**

$$
\frac{dy}{dx} = \frac{dy/dt}{dx/dt} = \frac{1 + 4t^3}{3t^2}
$$

---

## 6 · 7 marks

**Question**

Let $\mathbb{N}$ be the set of natural numbers. A relation $R$ is defined on $\mathbb{N} \times \mathbb{N}$ by

$$
(a, b)\,R\,(c, d) \iff \frac{d}{b} = \frac{c}{a}
$$

Show that $R$ is an equivalence relation. **(7 marks)**

**Solution**

Take $\mathbb{N} = \{1, 2, 3, \ldots\}$, so no denominator is zero. Then

$$
(a, b)\,R\,(c, d) \iff ad = bc
$$

**Reflexive:** $(a, b)\,R\,(a, b)$ because $ab = ba$.

**Symmetric:** if $(a, b)\,R\,(c, d)$ then $ad = bc$, so $cb = da$, which says $(c, d)\,R\,(a, b)$.

**Transitive:** suppose $(a, b)\,R\,(c, d)$ and $(c, d)\,R\,(e, f)$, so $ad = bc$ and $cf = de$. Multiply these:

$$
ad \cdot cf = bc \cdot de \quad\Rightarrow\quad (af)(cd) = (be)(cd)
$$

Since $cd \ne 0$, $af = be$, that is $(a, b)\,R\,(e, f)$.

$R$ is reflexive, symmetric and transitive, so it is an equivalence relation.

**Note:** this is part (ii) of question 6. Part (i), 4 marks, is missing from the source (see the top of the file).

---

## 7 · 7 marks

**Question**

Given that $f(x) = \dfrac{x^2 + 18}{x(x^2 + 9)}$,

express $f(x)$ in partial fractions. **(3 marks)**

Hence show that $\displaystyle\int_2^4 f(x)\,dx = \ln\left(\frac{4\sqrt{13}}{5}\right)$. **(4 marks)**

**Solution**

Write

$$
\frac{x^2 + 18}{x(x^2 + 9)} = \frac{A}{x} + \frac{Bx + C}{x^2 + 9} \quad\Rightarrow\quad x^2 + 18 = A(x^2 + 9) + (Bx + C)x
$$

$x = 0$ gives $18 = 9A$, so $A = 2$. Comparing $x^2$ terms, $1 = A + B$, so $B = -1$. Comparing $x$ terms, $C = 0$.

$$
f(x) = \frac{2}{x} - \frac{x}{x^2 + 9}
$$

Integrate:

$$
\int_2^4 f(x)\,dx = \left[2\ln x - \frac{1}{2}\ln(x^2 + 9)\right]_2^4 = \left[\ln\frac{x^2}{\sqrt{x^2 + 9}}\right]_2^4 = \ln\frac{16}{5} - \ln\frac{4}{\sqrt{13}}
$$

$$
= \ln\left(\frac{16}{5} \times \frac{\sqrt{13}}{4}\right) = \ln\left(\frac{4\sqrt{13}}{5}\right) \ ✓
$$

**Note:** the limits are unreadable in the source; 2 and 4 are the limits that give the stated answer.

---

## 8 · 11 marks

**Question**

(i) Find the value of $x$ for which $4^x + 4(2^x) = 12$. **(3 marks)**

(ii) The determinant of the matrix $\mathbf{M}$ is 45, where

$$
\mathbf{M} = \begin{pmatrix} \alpha & 3 & 5 \\ 4 & \alpha - 1 & 6 \\ 1 & 4 & 0 \end{pmatrix}
$$

(a) Show that $\alpha = 2$. **(2 marks)**

(b) Find $\mathbf{M}^{-1}$, the inverse of the matrix $\mathbf{M}$. Hence solve the system of equations

$$
2x + 3y + 5z = 30, \qquad 4x + y + 6z = 27, \qquad x + 4y = 27 \quad \textbf{(6 marks)}
$$

**Solution**

**(i)** Let $u = 2^x$, so $4^x = u^2$:

$$
u^2 + 4u - 12 = 0 \quad\Rightarrow\quad (u + 6)(u - 2) = 0
$$

$u = 2^x > 0$, so $u = 2$ and $x = 1$.

**(ii)(a)** Expand along the first row:

$$
\det\mathbf{M} = \alpha\big[(\alpha - 1)(0) - 24\big] - 3\big[0 - 6\big] + 5\big[16 - (\alpha - 1)\big] = -24\alpha + 18 + 85 - 5\alpha = 103 - 29\alpha
$$

$103 - 29\alpha = 45$ gives $\alpha = 2$. ✓

**(ii)(b)** With $\alpha = 2$, $\mathbf{M} = \begin{pmatrix} 2 & 3 & 5 \\ 4 & 1 & 6 \\ 1 & 4 & 0 \end{pmatrix}$. The matrix of cofactors is

$$
\begin{pmatrix} -24 & 6 & 15 \\ 20 & -5 & -5 \\ 13 & 8 & -10 \end{pmatrix}
$$

Transpose it and divide by the determinant:

$$
\mathbf{M}^{-1} = \frac{1}{45}\begin{pmatrix} -24 & 20 & 13 \\ 6 & -5 & 8 \\ 15 & -5 & -10 \end{pmatrix}
$$

The system is $\mathbf{M}\begin{pmatrix} x \\ y \\ z \end{pmatrix} = \begin{pmatrix} 30 \\ 27 \\ 27 \end{pmatrix}$, so

$$
\begin{pmatrix} x \\ y \\ z \end{pmatrix} = \frac{1}{45}\begin{pmatrix} -720 + 540 + 351 \\ 180 - 135 + 216 \\ 450 - 135 - 270 \end{pmatrix} = \frac{1}{45}\begin{pmatrix} 171 \\ 261 \\ 45 \end{pmatrix} = \begin{pmatrix} 3.8 \\ 5.8 \\ 1 \end{pmatrix}
$$

Check: $x + 4y = 3.8 + 23.2 = 27$ ✓ and $2x + 3y + 5z = 7.6 + 17.4 + 5 = 30$ ✓.

---

## 9 · 10 marks

**Question**

(a) Solve the differential equation

$$
(x + 2)^2\frac{dy}{dx} + 3y^2 = 0,
$$

given that $y = -2$ when $x = 0$. **(5 marks)**

(b) Sketch the curve $y = \dfrac{x + 2}{x - 1}$, showing clearly the points where the curve crosses the coordinate axes and the behaviour of the curve as it approaches its asymptotes. **(5 marks)**

**Solution**

**(a)** Separate the variables:

$$
\int\frac{dy}{y^2} = -3\int\frac{dx}{(x + 2)^2} \quad\Rightarrow\quad -\frac{1}{y} = \frac{3}{x + 2} + c
$$

At $x = 0$, $y = -2$: $\frac{1}{2} = \frac{3}{2} + c$, so $c = -1$.

$$
-\frac{1}{y} = \frac{3}{x + 2} - 1 = \frac{1 - x}{x + 2} \quad\Rightarrow\quad y = \frac{x + 2}{x - 1}
$$

(This is the curve sketched in part (b).)

**(b)** Write $y = \dfrac{x + 2}{x - 1} = 1 + \dfrac{3}{x - 1}$.

- **Axes:** $y = 0$ when $x = -2$, giving $(-2, 0)$; $x = 0$ gives $(0, -2)$.
- **Vertical asymptote $x = 1$:** as $x \to 1^+$, $y \to +\infty$; as $x \to 1^-$, $y \to -\infty$.
- **Horizontal asymptote $y = 1$:** as $x \to +\infty$, $y \to 1$ from above; as $x \to -\infty$, $y \to 1$ from below.

The curve is a rectangular hyperbola in two branches. The right-hand branch is above $y = 1$, falling from $+\infty$ near $x = 1$ towards $y = 1$. The left-hand branch is below $y = 1$: it rises towards $y = 1$ as $x \to -\infty$ and drops to $-\infty$ near $x = 1$, passing through $(-2, 0)$ and $(0, -2)$.

---

## 10 · 10 marks

**Question**

(i) Given that $p$ and $q$ are two statements, show that $p \Rightarrow q$ is equivalent to $\sim(p \wedge \sim q)$. **(3 marks)**

(ii) The function $f : \mathbb{R} \to \mathbb{R}$ is given by $f(x) = 2x^3 + 3x - 2$.

(a) Show that $f$ is monotonic increasing. **(2 marks)**

(b) Deduce that the equation $f(x) = 0$ has a root within the interval $0 < x < 1$.

Taking $x = 0.5$ as a first approximation to the root of the equation $f(x) = 0$, use the Newton–Raphson method once to obtain, to 2 decimal places, a second approximation to the root of this equation. **(5 marks)**

**Solution**

**(i)** Truth table:

| $p$ | $q$ | $\sim q$ | $p \wedge \sim q$ | $\sim(p \wedge \sim q)$ | $p \Rightarrow q$ |
| --- | --- | -------- | ----------------- | ----------------------- | ----------------- |
| T   | T   | F        | F                 | T                       | T                 |
| T   | F   | T        | T                 | F                       | F                 |
| F   | T   | F        | F                 | T                       | T                 |
| F   | F   | T        | F                 | T                       | T                 |

The last two columns are identical, so the statements are equivalent.

**(ii)(a)** $f'(x) = 6x^2 + 3 \ge 3 > 0$ for all $x$, so $f$ is (strictly) increasing.

**(ii)(b)** $f(0) = -2 < 0$ and $f(1) = 3 > 0$. $f$ is continuous and changes sign, so there is a root in $0 < x < 1$, and it is the only root because $f$ is increasing.

Newton–Raphson from $x_1 = 0.5$: $f(0.5) = 0.25 + 1.5 - 2 = -0.25$ and $f'(0.5) = 1.5 + 3 = 4.5$, so

$$
x_2 = 0.5 - \frac{-0.25}{4.5} = 0.5 + 0.0556 \approx 0.56
$$
