# A Level Pure Mathematics · June 2024 · Paper 2

Subject: **A Level Pure Mathematics with Mechanics** (this pure paper is shared with Pure Mathematics
with Statistics). Past paper: **2024, Paper 2** (GCE Board). Structured questions.
Questions are copied as set (missing letters restored and noted). Worked solutions are our own.

To add it: create the **2024 Paper 2** past paper for the subject, open it in **Admin → Past
papers**, press **Import many** under **Written questions**, choose this file and press **Check**,
then **Import questions**. Labels the paper already has are skipped, so importing twice is safe.
If you also run Pure Mathematics with Statistics, import the same file into its 2024 Paper 2 too.

---

## 1 · 8 marks

**Question**

(i) Express $\dfrac{4x + 3}{(2x - 1)(3x + 1)}$, $x \in \mathbb{R}$, $x \ne -\frac{1}{3}, \frac{1}{2}$, in partial fractions. **(3 marks)**

(ii) If the roots of the quadratic equation $x^2 + (k + 1)x + k = 0$ are $\alpha$ and $\beta$, find the values of the constant $k$ for which $\alpha = 2\beta$. **(5 marks)**

**Solution**

**(i)** Write

$$
\frac{4x + 3}{(2x - 1)(3x + 1)} = \frac{A}{2x - 1} + \frac{B}{3x + 1} \quad\Rightarrow\quad 4x + 3 = A(3x + 1) + B(2x - 1)
$$

Put $x = \frac{1}{2}$: $5 = \frac{5}{2}A$, so $A = 2$. Put $x = -\frac{1}{3}$: $\frac{5}{3} = -\frac{5}{3}B$, so $B = -1$.

$$
\frac{4x + 3}{(2x - 1)(3x + 1)} = \frac{2}{2x - 1} - \frac{1}{3x + 1}
$$

**(ii)** Using $\alpha = 2\beta$:

$$
\alpha + \beta = 3\beta = -(k + 1), \qquad \alpha\beta = 2\beta^2 = k
$$

So $\beta = -\frac{k + 1}{3}$ and

$$
2 \cdot \frac{(k + 1)^2}{9} = k \quad\Rightarrow\quad 2k^2 + 4k + 2 = 9k \quad\Rightarrow\quad 2k^2 - 5k + 2 = 0 \quad\Rightarrow\quad (2k - 1)(k - 2) = 0
$$

$$
k = \frac{1}{2} \quad\text{or}\quad k = 2
$$

Check: the equation factorises as $(x + 1)(x + k) = 0$, with roots $-1$ and $-k$. For $k = 2$ the roots are $-2$ and $-1$ ($-2 = 2 \times -1$ ✓); for $k = \frac{1}{2}$ they are $-1$ and $-\frac{1}{2}$ ✓.

---

## 2 · 8 marks

**Question**

The polynomial $f(x)$, where $f(x) = ax^3 - x^2 + bx + 6$, has a factor $(x + 2)$. $f(x)$ leaves a remainder 10 when divided by $(x + 1)$. Find

(a) the values of the constants $a$ and $b$,

(b) the values of $x$ for which $f(x) = 0$. **(8 marks)**

**Solution**

**(a)** Factor theorem, $f(-2) = 0$:

$$
-8a - 4 - 2b + 6 = 0 \quad\Rightarrow\quad 4a + b = 1
$$

Remainder theorem, $f(-1) = 10$:

$$
-a - 1 - b + 6 = 10 \quad\Rightarrow\quad a + b = -5
$$

Subtract: $3a = 6$, so $a = 2$ and $b = -7$.

**(b)** $f(x) = 2x^3 - x^2 - 7x + 6$. Divide by $(x + 2)$:

$$
f(x) = (x + 2)(2x^2 - 5x + 3) = (x + 2)(2x - 3)(x - 1)
$$

$$
f(x) = 0 \quad\Leftrightarrow\quad x = -2,\ 1 \text{ or } \frac{3}{2}
$$

---

## 3 · 10 marks

**Question**

The table below shows approximate values of a variable $y$ corresponding to certain values of another variable $x$.

| $x$ | 10   | 20   | 35    | 50    | 60    | 80    |
| --- | ---- | ---- | ----- | ----- | ----- | ----- |
| $y$ | 3.47 | 5.50 | 10.47 | 20.89 | 33.11 | 79.43 |

By drawing a suitable linear graph, verify that these values of $x$ and $y$ satisfy approximately a relationship of the form $y = ab^x$.

Using your graph, find approximate values of the constants $a$ and $b$, giving the answers correct to 2 decimal places. **(10 marks)**

**Solution**

Take logarithms (base 10) of $y = ab^x$:

$$
\log y = \log a + x\log b
$$

This has the form $Y = c + mX$ with $Y = \log y$ and $X = x$. So plot $\log y$ against $x$: if the points lie close to a straight line, the relationship holds.

| $x$      | 10   | 20   | 35   | 50   | 60   | 80   |
| -------- | ---- | ---- | ---- | ---- | ---- | ---- |
| $\log y$ | 0.54 | 0.74 | 1.02 | 1.32 | 1.52 | 1.90 |

The points lie close to a straight line, which verifies the relationship.

From the line of best fit (for example through $(10, 0.54)$ and $(60, 1.52)$):

$$
\text{gradient} = \log b \approx \frac{1.52 - 0.54}{60 - 10} \approx 0.020 \quad\Rightarrow\quad b \approx 10^{0.020} \approx 1.05
$$

$$
\text{intercept} = \log a \approx 0.54 - 10(0.020) = 0.34 \quad\Rightarrow\quad a \approx 10^{0.34} \approx 2.19
$$

**Answer:** $a \approx 2.19$, $b \approx 1.05$ (answers read from a graph may differ slightly; a least-squares line gives $a \approx 2.22$, $b \approx 1.05$).

---

## 4 · 10 marks

**Question**

(i) The first and last terms of an arithmetic progression are 7 and 43 respectively. The sum of the terms of the progression is 250. Find the number of terms and the common difference of the progression. **(3 marks)**

(ii) Obtain the first four terms of the binomial expansion of $\left(1 - \frac{3}{2}x\right)^{-2}$ and find the set of values of $x$ for which the expansion is valid.

Hence deduce the first four terms of the binomial expansion of $(2 - 3x)^{-2}$. **(7 marks)**

**Solution**

**(i)**

$$
S_n = \frac{n}{2}(\text{first} + \text{last}) \quad\Rightarrow\quad 250 = \frac{n}{2}(7 + 43) = 25n \quad\Rightarrow\quad n = 10
$$

Then $43 = 7 + 9d$, so $d = 4$.

**(ii)** With $y = \frac{3}{2}x$, $(1 - y)^{-2} = 1 + 2y + 3y^2 + 4y^3 + \ldots$:

$$
\left(1 - \tfrac{3}{2}x\right)^{-2} = 1 + 3x + \frac{27}{4}x^2 + \frac{27}{2}x^3 + \ldots
$$

(For example, the $x^2$ term is $3\left(\frac{3}{2}x\right)^2 = \frac{27}{4}x^2$.)

The expansion is valid when $\left|\frac{3}{2}x\right| < 1$, that is $\left\{x : -\frac{2}{3} < x < \frac{2}{3}\right\}$.

Since $(2 - 3x)^{-2} = \left[2\left(1 - \tfrac{3}{2}x\right)\right]^{-2} = \frac{1}{4}\left(1 - \tfrac{3}{2}x\right)^{-2}$:

$$
(2 - 3x)^{-2} = \frac{1}{4} + \frac{3}{4}x + \frac{27}{16}x^2 + \frac{27}{8}x^3 + \ldots
$$

---

## 5 · 13 marks

**Question**

(i) The parametric equations of a curve are given by $x = 1 + t$, $y = 2 + \frac{1}{t}$, $t \ne 0$, where $t$ is a parameter.

Show that an equation of the normal to the curve at the point where $t = 2$ is $8x - 2y - 19 = 0$.

Find the value of $t$ at the point where this normal meets the curve again. **(6 marks)**

(ii) A new primary school intends to recruit a head teacher and 7 other teachers. There are 3 male and 2 female applicants for the position of head teacher, and 4 male and 6 female applicants for the other teaching positions.

Find the number of different ways of selecting the staff of 8 if gender is not taken into account. **(7 marks)**

**Solution**

**(i)** $\frac{dx}{dt} = 1$ and $\frac{dy}{dt} = -\frac{1}{t^2}$, so $\frac{dy}{dx} = -\frac{1}{t^2}$.

At $t = 2$: the point is $\left(3, \frac{5}{2}\right)$ and the tangent gradient is $-\frac{1}{4}$, so the normal gradient is $4$:

$$
y - \tfrac{5}{2} = 4(x - 3) \quad\Rightarrow\quad 2y - 5 = 8x - 24 \quad\Rightarrow\quad 8x - 2y - 19 = 0 \ ✓
$$

Substitute the parametric point into the normal:

$$
8(1 + t) - 2\left(2 + \tfrac{1}{t}\right) - 19 = 0 \quad\Rightarrow\quad 8t - 15 - \frac{2}{t} = 0 \quad\Rightarrow\quad 8t^2 - 15t - 2 = 0
$$

$$
(8t + 1)(t - 2) = 0
$$

$t = 2$ is the original point, so the normal meets the curve again where $t = -\frac{1}{8}$.

**(ii)** Choose the head teacher from the 5 applicants, and the other 7 teachers from the 10 applicants:

$$
\binom{5}{1} \times \binom{10}{7} = 5 \times 120 = 600 \text{ ways}
$$

**Note:** the source says "if gender equity must be neglected", which we read as "gender is not taken into account".

---

## 6 · 13 marks

**Question**

The curve with equation $y = 2x(3 - x)$ crosses the $x$-axis at $O$ and $B$.

(a) State the coordinates of the point $B$. **(1 mark)**

A straight line, which crosses the $y$-axis at the point $E$ with coordinates $(0, 5)$, meets the curve at the points $C$ and $D$. The coordinates of the point $D$ are $(k, k)$, with $k > 0$.

(b) Show that the value of $k$ is $\frac{5}{2}$. **(2 marks)**

(c) Find an equation of the straight line passing through $D$ and $E$. **(3 marks)**

(d) Show that the $x$-coordinate of the point $C$ is 1. **(3 marks)**

(e) Calculate the area of the region $R$ bounded by the curve $y = 2x(3 - x)$ and the line $DE$. **(4 marks)**

**Solution**

**(a)** $2x(3 - x) = 0$ gives $x = 0$ or $x = 3$, so $B = (3, 0)$.

**(b)** $D(k, k)$ lies on the curve:

$$
k = 2k(3 - k) \quad\Rightarrow\quad 1 = 6 - 2k \ (k \ne 0) \quad\Rightarrow\quad k = \frac{5}{2}
$$

**(c)** The gradient of $DE$ is $\dfrac{\frac{5}{2} - 5}{\frac{5}{2} - 0} = -1$, and the intercept is 5:

$$
y = 5 - x \quad(\text{or } x + y = 5)
$$

**(d)** Where the line meets the curve:

$$
2x(3 - x) = 5 - x \quad\Rightarrow\quad 2x^2 - 7x + 5 = 0 \quad\Rightarrow\quad (2x - 5)(x - 1) = 0
$$

$x = \frac{5}{2}$ is $D$, so $C$ has $x = 1$ (and $C = (1, 4)$).

**(e)** Between $x = 1$ and $x = \frac{5}{2}$ the curve is above the line:

$$
\text{Area} = \int_1^{5/2} \big[(6x - 2x^2) - (5 - x)\big]\,dx = \int_1^{5/2} (-2x^2 + 7x - 5)\,dx = \left[-\frac{2x^3}{3} + \frac{7x^2}{2} - 5x\right]_1^{5/2}
$$

$$
= \left(-\frac{125}{12} + \frac{175}{8} - \frac{25}{2}\right) - \left(-\frac{2}{3} + \frac{7}{2} - 5\right) = -\frac{25}{24} + \frac{13}{6} = \frac{9}{8}
$$

The area of $R$ is $\frac{9}{8}$ square units.

**Note:** the source refers to a diagram; everything needed is in the text above.

---

## 7 · 10 marks

**Question**

(i) A complex number $z$ satisfies the equation $\dfrac{z}{z + 2} = 2 - i$.

Express $z$ in the form $a + bi$, where $a$ and $b$ are real constants. **(4 marks)**

(ii) The vector equations of two lines are given by

$$
\mathbf{r} = 3\mathbf{i} + 6\mathbf{j} + \mathbf{k} + \lambda(2\mathbf{i} + 3\mathbf{j} - \mathbf{k}) \quad\text{and}\quad \mathbf{r} = 3\mathbf{i} - \mathbf{j} + 4\mathbf{k} + \mu(\mathbf{i} - 2\mathbf{j} + \mathbf{k})
$$

(a) Find a vector normal to the plane containing both lines. **(3 marks)**

(b) Obtain the Cartesian equation of the plane containing both lines. **(3 marks)**

**Solution**

**(i)** Multiply up and collect the $z$ terms:

$$
z = (2 - i)(z + 2) = (2 - i)z + 4 - 2i \quad\Rightarrow\quad z(1 - 2 + i) = 4 - 2i \quad\Rightarrow\quad z = \frac{4 - 2i}{-1 + i}
$$

Multiply top and bottom by $-1 - i$:

$$
z = \frac{(4 - 2i)(-1 - i)}{(-1)^2 + 1^2} = \frac{-4 - 4i + 2i + 2i^2}{2} = \frac{-6 - 2i}{2} = -3 - i
$$

Check: $\dfrac{-3 - i}{-1 - i} = \dfrac{3 + i}{1 + i} = \dfrac{(3 + i)(1 - i)}{2} = \dfrac{4 - 2i}{2} = 2 - i$. ✓

**(ii)(a)** A normal is perpendicular to both directions, so take their cross product:

$$
\begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ 2 & 3 & -1 \\ 1 & -2 & 1 \end{vmatrix} = (3 - 2)\mathbf{i} - (2 + 1)\mathbf{j} + (-4 - 3)\mathbf{k} = \mathbf{i} - 3\mathbf{j} - 7\mathbf{k}
$$

**(ii)(b)** The plane is $x - 3y - 7z = d$. It contains the point $(3, 6, 1)$:

$$
d = 3 - 18 - 7 = -22 \quad\Rightarrow\quad x - 3y - 7z + 22 = 0
$$

Check with the second line's point $(3, -1, 4)$: $3 + 3 - 28 + 22 = 0$. ✓

---

## 8 · 10 marks

**Question**

(i) The equation of a line is $3y = x + 5$ and the equation of a circle is $x^2 + y^2 - 6x - 2y - 15 = 0$. Show that the line is a chord of the circle. **(5 marks)**

(ii) Show that the equation $x^2 - 3x + 1 = 0$ has a root between $x = 2$ and $x = 3$.

Taking $x = 3$ as a first approximation to this root, use the Newton–Raphson method to obtain a second approximation to the root. **(5 marks)**

**Solution**

**(i)** Substitute $x = 3y - 5$ into the circle:

$$
(3y - 5)^2 + y^2 - 6(3y - 5) - 2y - 15 = 0 \quad\Rightarrow\quad 10y^2 - 50y + 40 = 0 \quad\Rightarrow\quad y^2 - 5y + 4 = 0
$$

$(y - 1)(y - 4) = 0$, so the line meets the circle at two distinct points, $(-2, 1)$ and $(7, 4)$. A line meeting a circle in two points is a chord.

**(ii)** Let $f(x) = x^2 - 3x + 1$. Then $f(2) = -1 < 0$ and $f(3) = 1 > 0$. $f$ is continuous and changes sign, so there is a root between 2 and 3.

Newton–Raphson, with $f'(x) = 2x - 3$:

$$
x_2 = x_1 - \frac{f(x_1)}{f'(x_1)} = 3 - \frac{1}{3} = \frac{8}{3} \approx 2.67
$$

(The exact root is $\frac{3 + \sqrt{5}}{2} \approx 2.618$.)

---

## 9 · 12 marks

**Question**

(i) Solve the differential equation $x\dfrac{dy}{dx} = y(y + 1)$, given that $y = 4$ when $x = 2$, and express the solution in the form $y = f(x)$. **(7 marks)**

(ii) Using a suitable substitution, show that

$$
\int_0^2 x\sqrt{1 + x^2}\,dx = \frac{1}{3}\left(5\sqrt{5} - 1\right). \quad \textbf{(5 marks)}
$$

**Solution**

**(i)** Separate the variables and use partial fractions, $\frac{1}{y(y + 1)} = \frac{1}{y} - \frac{1}{y + 1}$:

$$
\int\left(\frac{1}{y} - \frac{1}{y + 1}\right)dy = \int\frac{dx}{x} \quad\Rightarrow\quad \ln\frac{y}{y + 1} = \ln x + c \quad\Rightarrow\quad \frac{y}{y + 1} = Ax
$$

At $x = 2$, $y = 4$: $\frac{4}{5} = 2A$, so $A = \frac{2}{5}$.

$$
\frac{y}{y + 1} = \frac{2x}{5} \quad\Rightarrow\quad 5y = 2xy + 2x \quad\Rightarrow\quad y = \frac{2x}{5 - 2x}
$$

**(ii)** Let $u = 1 + x^2$, so $du = 2x\,dx$. When $x = 0$, $u = 1$; when $x = 2$, $u = 5$:

$$
\int_0^2 x\sqrt{1 + x^2}\,dx = \frac{1}{2}\int_1^5 u^{1/2}\,du = \frac{1}{2} \cdot \frac{2}{3}\Big[u^{3/2}\Big]_1^5 = \frac{1}{3}\left(5\sqrt{5} - 1\right) \ ✓
$$

---

## 10 · 12 marks

**Question**

(i) Find the values of $R$ and $\alpha$, $R > 0$ and $0^\circ < \alpha < 90^\circ$, for which $4\cos\theta + 3\sin\theta \equiv R\cos(\theta - \alpha)$.

Hence obtain the greatest value of the expression $\dfrac{1}{4\cos\theta + 3\sin\theta + 6}$ and give the corresponding value of $\theta$ between $0^\circ$ and $360^\circ$. **(6 marks)**

(ii) Using De Moivre's theorem, write down an equivalent form of $\cos 3\theta + i\sin 3\theta$. Hence show that $\sin 3\theta \equiv 3\sin\theta - 4\sin^3\theta$. **(6 marks)**

**Solution**

**(i)** $R\cos(\theta - \alpha) = R\cos\theta\cos\alpha + R\sin\theta\sin\alpha$, so $R\cos\alpha = 4$ and $R\sin\alpha = 3$:

$$
R = \sqrt{4^2 + 3^2} = 5, \qquad \tan\alpha = \frac{3}{4} \quad\Rightarrow\quad \alpha \approx 36.87^\circ
$$

The expression is $\dfrac{1}{5\cos(\theta - 36.87^\circ) + 6}$. It is greatest when the denominator is smallest, that is when $\cos(\theta - 36.87^\circ) = -1$:

$$
\text{greatest value} = \frac{1}{-5 + 6} = 1, \quad\text{when } \theta - 36.87^\circ = 180^\circ,\ \theta \approx 216.87^\circ
$$

**(ii)** By De Moivre's theorem, $\cos 3\theta + i\sin 3\theta = (\cos\theta + i\sin\theta)^3$. Write $c = \cos\theta$, $s = \sin\theta$ and expand:

$$
(c + is)^3 = c^3 + 3c^2(is) + 3c(is)^2 + (is)^3 = (c^3 - 3cs^2) + i(3c^2s - s^3)
$$

Equate imaginary parts and use $c^2 = 1 - s^2$:

$$
\sin 3\theta = 3c^2s - s^3 = 3(1 - s^2)s - s^3 = 3\sin\theta - 4\sin^3\theta \ ✓
$$
