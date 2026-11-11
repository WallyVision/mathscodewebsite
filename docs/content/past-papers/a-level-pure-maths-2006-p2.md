# A Level Pure Mathematics · June 2006 · Paper 2

Subject: **A Level Pure Mathematics with Mechanics** (this pure paper is shared with Pure Mathematics
with Statistics). Past paper: **2006, Paper 2** (GCE Board). Structured questions.
Questions are copied as set (missing words restored and noted). Worked solutions are our own.

To add it: create the **2006 Paper 2** past paper for the subject, open it in **Admin → Past
papers**, press **Import many** under **Written questions**, choose this file and press **Check**,
then **Import questions**. Labels the paper already has are skipped, so importing twice is safe.

---

## 1 · 12 marks

**Question**

(i) Solve the equation $6(2^{2x}) + 2^x - 2 = 0$.

(ii) Expand $(2 + 3x)^{-2}$ in ascending powers of $x$ up to and including the term in $x^2$. State the range of values of $x$ for which the expansion is valid.

(iii) Given that $y = \dfrac{(x - 2)(x - 1)}{x + 2}$, $x \in \mathbb{R}$, $x \ne -2$, find the set of values of $y$ for which $x$ is real.

**Solution**

**(i)** Let $u = 2^x$:

$$
6u^2 + u - 2 = 0 \quad\Rightarrow\quad (3u + 2)(2u - 1) = 0
$$

$u = 2^x > 0$, so $u = \frac{1}{2}$ and $x = -1$.

**(ii)**

$$
(2 + 3x)^{-2} = \frac{1}{4}\left(1 + \tfrac{3}{2}x\right)^{-2} = \frac{1}{4}\left[1 - 2\left(\tfrac{3}{2}x\right) + 3\left(\tfrac{3}{2}x\right)^2 - \ldots\right] = \frac{1}{4} - \frac{3}{4}x + \frac{27}{16}x^2 - \ldots
$$

Valid when $\left|\frac{3}{2}x\right| < 1$, that is $-\frac{2}{3} < x < \frac{2}{3}$.

**(iii)** Rearrange into a quadratic in $x$:

$$
y(x + 2) = x^2 - 3x + 2 \quad\Rightarrow\quad x^2 - (3 + y)x + (2 - 2y) = 0
$$

$x$ is real when the discriminant is non-negative:

$$
(3 + y)^2 - 4(2 - 2y) \ge 0 \quad\Rightarrow\quad y^2 + 14y + 1 \ge 0
$$

The roots of $y^2 + 14y + 1 = 0$ are $y = -7 \pm 4\sqrt{3}$, so

$$
\left\{y : y \le -7 - 4\sqrt{3} \ \text{ or } \ y \ge -7 + 4\sqrt{3}\right\} \qquad (-7 - 4\sqrt{3} \approx -13.93,\ -7 + 4\sqrt{3} \approx -0.07)
$$

**Note:** the source drops the letters $x$ and $y$ in "the set of values of $y$ for which $x$ is real"; they have been restored.

---

## 2 · 8 marks

**Question**

The variables $x$ and $y$ tabulated below were obtained in an experiment and are thought to obey a law of the form $y = a(x - 1)^n$.

| $x$ | 5    | 9   | 16  | 20   | 25  |
| --- | ---- | --- | --- | ---- | --- |
| $y$ | 6.13 | 6.5 | 7.0 | 7.15 | 7.5 |

By drawing a suitable straight-line graph, determine the values of $a$ and $n$ to one decimal place.

**Solution**

Take logarithms: $\log y = \log a + n\log(x - 1)$. Plot $\log y$ against $\log(x - 1)$: the gradient is $n$ and the intercept is $\log a$.

| $\log(x - 1)$ | 0.602 | 0.903 | 1.176 | 1.279 | 1.380 |
| ------------- | ----- | ----- | ----- | ----- | ----- |
| $\log y$      | 0.787 | 0.813 | 0.845 | 0.854 | 0.875 |

A line of best fit (for example through $(0.602, 0.787)$ and $(1.380, 0.875)$) gives

$$
n = \text{gradient} \approx \frac{0.875 - 0.787}{1.380 - 0.602} \approx 0.11 \approx 0.1
$$

$$
\log a \approx 0.787 - 0.11(0.602) \approx 0.72 \quad\Rightarrow\quad a \approx 5.2
$$

**Answer:** $a \approx 5.2$, $n \approx 0.1$.

---

## 3 · 9 marks

**Question**

(i) Find the number of ways in which a committee of 4 people can be chosen from a group of 8 men and 5 women, given that it must contain at least 2 women.

(ii) Prove, by mathematical induction, that $\displaystyle\sum_{r=1}^{n}\frac{1}{r(r + 1)} = \frac{n}{n + 1}$.

**Solution**

**(i)**

| Women | Men | Ways                                            |
| ----- | --- | ----------------------------------------------- |
| 2     | 2   | $\binom{5}{2}\binom{8}{2} = 10 \times 28 = 280$ |
| 3     | 1   | $\binom{5}{3}\binom{8}{1} = 10 \times 8 = 80$   |
| 4     | 0   | $\binom{5}{4} = 5$                              |

Total: $365$ ways.

**(ii)** **Base case**, $n = 1$: the left side is $\frac{1}{1 \times 2} = \frac{1}{2}$ and the right side is $\frac{1}{2}$. ✓

**Inductive step:** assume $\sum_{r=1}^{k}\frac{1}{r(r + 1)} = \frac{k}{k + 1}$. Then

$$
\sum_{r=1}^{k + 1}\frac{1}{r(r + 1)} = \frac{k}{k + 1} + \frac{1}{(k + 1)(k + 2)} = \frac{k(k + 2) + 1}{(k + 1)(k + 2)} = \frac{(k + 1)^2}{(k + 1)(k + 2)} = \frac{k + 1}{k + 2}
$$

which is the formula for $n = k + 1$. By induction it holds for all positive integers $n$.

---

## 4 · 11 marks

**Question**

(a) Find a vector equation of the plane $\pi$ which passes through the points $A$, $B$ and $C$ with position vectors $3\mathbf{i} + \mathbf{k}$, $\mathbf{i} - 2\mathbf{j}$ and $-\mathbf{i} + 3\mathbf{j}$ respectively.

Find the sine of the angle which the plane $\pi$ makes with the line passing through the points with position vectors $2\mathbf{i} - \mathbf{j}$ and $\mathbf{i} + \mathbf{j} + \mathbf{k}$.

(b) Find the Cartesian equations of the line of intersection of the planes $P_1 : x - 2y + z = 5$ and $P_2 : x + y - 2z = 3$.

**Solution**

**(a)** $\overrightarrow{AB} = (-2, -2, -1)$ and $\overrightarrow{AC} = (-4, 3, -1)$:

$$
\mathbf{r} = 3\mathbf{i} + \mathbf{k} + \lambda(-2\mathbf{i} - 2\mathbf{j} - \mathbf{k}) + \mu(-4\mathbf{i} + 3\mathbf{j} - \mathbf{k})
$$

A normal is $\overrightarrow{AB} \times \overrightarrow{AC} = (2 + 3,\ 4 - 2,\ -6 - 8) = (5, 2, -14)$, with $|\mathbf{n}| = \sqrt{225} = 15$. (In Cartesian form the plane is $5x + 2y - 14z = 1$.)

The line has direction $\mathbf{d} = (1, 1, 1) - (2, -1, 0) = (-1, 2, 1)$, with $|\mathbf{d}| = \sqrt{6}$:

$$
\sin\theta = \frac{|\mathbf{n} \cdot \mathbf{d}|}{|\mathbf{n}||\mathbf{d}|} = \frac{|-5 + 4 - 14|}{15\sqrt{6}} = \frac{1}{\sqrt{6}} \approx 0.408
$$

**(b)** The line's direction is perpendicular to both normals:

$$
(1, -2, 1) \times (1, 1, -2) = (4 - 1,\ 1 + 2,\ 1 + 2) = (3, 3, 3) \parallel (1, 1, 1)
$$

A point on the line: put $z = 0$. Then $x - 2y = 5$ and $x + y = 3$, giving $y = -\frac{2}{3}$ and $x = \frac{11}{3}$. So

$$
x - \frac{11}{3} = y + \frac{2}{3} = z
$$

**Note:** "the Cartesian of the line" in the source is read as "the Cartesian equations of the line".

---

## 5 · 11 marks

**Question**

(i) Show that $\sin 3\theta \equiv 3\sin\theta - 4\sin^3\theta$. Hence, or otherwise, solve the equation $\sin^2\theta - \sin 3\theta = 0$, giving all the solutions in the interval $0^\circ \le \theta \le 180^\circ$.

(ii) Express $g(\theta) = 3\cos 3\theta + \sin 3\theta$ in the form $R\cos(3\theta - \lambda)$, where $R > 0$ and $\lambda$ is an acute angle. Hence find the general solution of $3\cos 3\theta + \sin 3\theta = 2$.

**Solution**

**(i)** Write $s = \sin\theta$ and $c = \cos\theta$:

$$
\sin 3\theta = \sin 2\theta\cos\theta + \cos 2\theta\sin\theta = 2sc^2 + (1 - 2s^2)s = 2s(1 - s^2) + s - 2s^3 = 3s - 4s^3 \ ✓
$$

The equation becomes

$$
s^2 - 3s + 4s^3 = 0 \quad\Rightarrow\quad s(4s^2 + s - 3) = 0 \quad\Rightarrow\quad s(4s - 3)(s + 1) = 0
$$

- $\sin\theta = 0$: $\theta = 0^\circ, 180^\circ$;
- $\sin\theta = \frac{3}{4}$: $\theta = 48.6^\circ, 131.4^\circ$;
- $\sin\theta = -1$: no solution in the interval.

$$
\theta = 0^\circ,\ 48.6^\circ,\ 131.4^\circ,\ 180^\circ
$$

**(ii)** $R\cos\lambda = 3$ and $R\sin\lambda = 1$:

$$
R = \sqrt{10}, \quad \lambda = \tan^{-1}\tfrac{1}{3} \approx 18.43^\circ
$$

Then $\cos(3\theta - 18.43^\circ) = \frac{2}{\sqrt{10}}$, and $\cos^{-1}\frac{2}{\sqrt{10}} \approx 50.77^\circ$:

$$
3\theta - 18.43^\circ = \pm 50.77^\circ + 360^\circ n
$$

$$
\theta \approx 23.07^\circ + 120^\circ n \quad\text{or}\quad \theta \approx -10.78^\circ + 120^\circ n, \qquad n \in \mathbb{Z}
$$

**Note:** the source writes the function as $g(x)$; it is a function of $\theta$.

---

## 6 · 9 marks

**Question**

Find an equation of the circle which has a segment of the line $y = x + 2$ as a diameter and passes through the points $(1, 1)$ and $(2, 3)$. Find equations of the two tangents from the origin to the circle.

**Solution**

The centre lies on the diameter, so it is $(h, h + 2)$. It is the same distance from both points:

$$
(h - 1)^2 + (h + 1)^2 = (h - 2)^2 + (h - 1)^2 \quad\Rightarrow\quad (h + 1)^2 = (h - 2)^2 \quad\Rightarrow\quad h = \frac{1}{2}
$$

The centre is $\left(\frac{1}{2}, \frac{5}{2}\right)$ and $r^2 = \left(\frac{1}{2}\right)^2 + \left(\frac{3}{2}\right)^2 = \frac{5}{2}$:

$$
\left(x - \tfrac{1}{2}\right)^2 + \left(y - \tfrac{5}{2}\right)^2 = \frac{5}{2} \quad\Leftrightarrow\quad x^2 + y^2 - x - 5y + 4 = 0
$$

Check: $(1, 1)$ gives $1 + 1 - 1 - 5 + 4 = 0$ ✓ and $(2, 3)$ gives $4 + 9 - 2 - 15 + 4 = 0$ ✓.

**Tangents from $O$:** a line $y = mx$ is a tangent when its distance from the centre equals the radius:

$$
\frac{\left|\frac{m}{2} - \frac{5}{2}\right|}{\sqrt{1 + m^2}} = \sqrt{\frac{5}{2}} \quad\Rightarrow\quad (m - 5)^2 = 10(1 + m^2) \quad\Rightarrow\quad 9m^2 + 10m - 15 = 0
$$

$$
m = \frac{-5 \pm 4\sqrt{10}}{9}
$$

The tangents are $y = \dfrac{-5 + 4\sqrt{10}}{9}x \approx 0.85x$ and $y = \dfrac{-5 - 4\sqrt{10}}{9}x \approx -1.96x$.

---

## 7 · 10 marks

**Question**

(i) Given that $z_1 = i^{-5}(5 + 4i)$, express $z_1$ in the form $a + ib$ and hence find $|z_1|$.

(ii) Find the locus of points $z$ such that $\arg(z - 2 + 3i) = \dfrac{\pi}{4}$.

(iii) Verify that $2 + 3i$ is a root of the equation $z^3 - 5z^2 + 17z - 13 = 0$. Find the other roots of this equation.

**Solution**

**(i)** $i^5 = i$, so $i^{-5} = \frac{1}{i} = -i$:

$$
z_1 = -i(5 + 4i) = -5i + 4 = 4 - 5i, \qquad |z_1| = \sqrt{16 + 25} = \sqrt{41}
$$

**(ii)** $z - 2 + 3i = z - (2 - 3i)$, so the locus is the half-line starting at the point $(2, -3)$ (not included) and making an angle $\frac{\pi}{4}$ with the positive real direction:

$$
y = x - 5, \quad x > 2
$$

**(iii)** $(2 + 3i)^2 = -5 + 12i$ and $(2 + 3i)^3 = (2 + 3i)(-5 + 12i) = -46 + 9i$:

$$
(-46 + 9i) - 5(-5 + 12i) + 17(2 + 3i) - 13 = (-46 + 25 + 34 - 13) + (9 - 60 + 51)i = 0 \ ✓
$$

The coefficients are real, so $2 - 3i$ is also a root. Together they give the factor $(z - 2)^2 + 9 = z^2 - 4z + 13$, and

$$
z^3 - 5z^2 + 17z - 13 = (z^2 - 4z + 13)(z - 1)
$$

The other roots are $2 - 3i$ and $1$.

---

## 8 · 11 marks

**Question**

(a) Evaluate $\displaystyle\int_3^4 \frac{2x + 3}{x^2 - 4}\,dx$, leaving your result in terms of natural logarithms.

(b) Find $\displaystyle\int\frac{1}{4 - 4\sin\theta}\,d\theta$.

(c) Find the $x$-coordinate of the centroid of the solid obtained by rotating the area enclosed by the curve $y = x^2 - x$ and the line $y = 0$ completely about the $x$-axis.

**Solution**

**(a)**

$$
\frac{2x + 3}{(x - 2)(x + 2)} = \frac{7/4}{x - 2} + \frac{1/4}{x + 2}
$$

(put $x = 2$: $7 = 4A$; $x = -2$: $-1 = -4B$).

$$
\int_3^4 = \left[\frac{7}{4}\ln(x - 2) + \frac{1}{4}\ln(x + 2)\right]_3^4 = \frac{7}{4}\ln 2 + \frac{1}{4}\ln\frac{6}{5} = \frac{1}{4}\ln\frac{768}{5} \approx 1.259
$$

**(b)** Multiply top and bottom by $1 + \sin\theta$:

$$
\frac{1}{4}\int\frac{1 + \sin\theta}{1 - \sin^2\theta}\,d\theta = \frac{1}{4}\int\left(\sec^2\theta + \sec\theta\tan\theta\right)d\theta = \frac{1}{4}(\tan\theta + \sec\theta) + c
$$

**(c)** The curve meets $y = 0$ at $x = 0$ and $x = 1$.

$$
V = \pi\int_0^1 (x^2 - x)^2\,dx = \pi\int_0^1 (x^4 - 2x^3 + x^2)\,dx = \pi\left(\frac{1}{5} - \frac{1}{2} + \frac{1}{3}\right) = \frac{\pi}{30}
$$

$$
\pi\int_0^1 x(x^2 - x)^2\,dx = \pi\left(\frac{1}{6} - \frac{2}{5} + \frac{1}{4}\right) = \frac{\pi}{60}
$$

$$
\bar{x} = \frac{\pi/60}{\pi/30} = \frac{1}{2}
$$

(As expected: $(x^2 - x)^2$ is symmetric about $x = \frac{1}{2}$.)

**Note:** the source drops "$x$-coordinate" and the axis of rotation; they have been restored.

---

## 9 · 9 marks

**Question**

(i) Differentiate, with respect to $x$: (a) $\dfrac{\ln(3x^2)}{x^3}$, (b) $\tan\left(3x - \dfrac{\pi}{4}\right)$.

(ii) Given that $y = e^\theta + \sin\theta$ and $x = e^\theta + \cos\theta$, find $\dfrac{dy}{dx}$ when $\theta = \dfrac{\pi}{4}$.

**Solution**

**(i)(a)** Quotient rule, with $\frac{d}{dx}\ln(3x^2) = \frac{2}{x}$:

$$
\frac{\frac{2}{x} \cdot x^3 - 3x^2\ln(3x^2)}{x^6} = \frac{2 - 3\ln(3x^2)}{x^4}
$$

**(i)(b)** $3\sec^2\left(3x - \frac{\pi}{4}\right)$.

**(ii)**

$$
\frac{dy}{dx} = \frac{dy/d\theta}{dx/d\theta} = \frac{e^\theta + \cos\theta}{e^\theta - \sin\theta}
$$

At $\theta = \frac{\pi}{4}$:

$$
\frac{dy}{dx} = \frac{e^{\pi/4} + \frac{\sqrt{2}}{2}}{e^{\pi/4} - \frac{\sqrt{2}}{2}} \approx \frac{2.900}{1.486} \approx 1.95
$$

---

## 10 · 10 marks

**Question**

Solve, in the form $y = f(x)$, the differential equation $(x + 1)\dfrac{dy}{dx} = 1 - y$, given that $y = -3$ when $x = 0$.

Given also that $h(x) = \dfrac{4x + 3}{x + 2}$, find $h(f(x))$ and sketch its curve, showing clearly the points at which the curve cuts the coordinate axes and the behaviour of the curve near its asymptotes.

**Solution**

Separate the variables:

$$
\int\frac{dy}{1 - y} = \int\frac{dx}{x + 1} \quad\Rightarrow\quad -\ln|1 - y| = \ln|x + 1| + c \quad\Rightarrow\quad 1 - y = \frac{A}{x + 1}
$$

At $x = 0$, $y = -3$: $A = 4$. So

$$
f(x) = y = 1 - \frac{4}{x + 1} = \frac{x - 3}{x + 1}
$$

Then

$$
h(f(x)) = \frac{4\frac{x - 3}{x + 1} + 3}{\frac{x - 3}{x + 1} + 2} = \frac{4(x - 3) + 3(x + 1)}{(x - 3) + 2(x + 1)} = \frac{7x - 9}{3x - 1}, \quad x \ne -1,\ x \ne \tfrac{1}{3}
$$

**Sketch** of $y = \dfrac{7x - 9}{3x - 1} = \dfrac{7}{3} - \dfrac{20}{3(3x - 1)}$:

- **Axes:** $(0, 9)$ and $\left(\frac{9}{7}, 0\right)$.
- **Vertical asymptote $x = \frac{1}{3}$:** $y \to -\infty$ as $x \to \frac{1}{3}^+$, and $y \to +\infty$ as $x \to \frac{1}{3}^-$.
- **Horizontal asymptote $y = \frac{7}{3}$:** approached from below as $x \to +\infty$ and from above as $x \to -\infty$.

The left branch lies above $y = \frac{7}{3}$ and passes through $(0, 9)$. The right branch lies below $y = \frac{7}{3}$ and crosses the $x$-axis at $\frac{9}{7}$. Since $f$ is undefined at $x = -1$, the point $(-1, 4)$ is missing from the left branch (an open circle).
