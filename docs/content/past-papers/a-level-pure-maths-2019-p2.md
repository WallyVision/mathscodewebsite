# A Level Pure Mathematics · June 2019 · Paper 2

Subject: **A Level Pure Mathematics with Statistics** (the source file is the Pure Mathematics with
Statistics Paper 2; the same file can be imported into Pure Mathematics with Mechanics). Past paper:
**2019, Paper 2** (GCE Board). Structured questions. Questions are copied as set (obvious slips
corrected and noted). Worked solutions are our own.

To add it: create the **2019 Paper 2** past paper for the subject (create the subject first in
**Admin → Subjects** if needed), open it in **Admin → Past papers**, press **Import many** under
**Written questions**, choose this file and press **Check**, then **Import questions**. Labels the
paper already has are skipped, so importing twice is safe.

---

## 1 · 10 marks

**Question**

The polynomial $f(x) = 2x^3 + px^2 + qx - 30$ leaves a remainder $-28$ when divided by $(x - 1)$ and a remainder 66 when divided by $(x - 3)$.

(a) Find the values of the constants $p$ and $q$. **(5 marks)**

(b) Given that $x - 2$ is a factor of $f(x)$, factorise $f(x)$ completely. **(5 marks)**

**Solution**

**(a)** By the remainder theorem:

$$
f(1) = 2 + p + q - 30 = -28 \quad\Rightarrow\quad p + q = 0
$$

$$
f(3) = 54 + 9p + 3q - 30 = 66 \quad\Rightarrow\quad 3p + q = 14
$$

Subtract: $2p = 14$, so $p = 7$ and $q = -7$.

**(b)** $f(x) = 2x^3 + 7x^2 - 7x - 30$, and $f(2) = 16 + 28 - 14 - 30 = 0$ ✓. Divide by $(x - 2)$:

$$
f(x) = (x - 2)(2x^2 + 11x + 15) = (x - 2)(2x + 5)(x + 3)
$$

---

## 2 · 12 marks

**Question**

(i) The roots of the quadratic equation $2x^2 - x + 6 = 0$ are $\alpha$ and $\beta$. Find the quadratic equation with integral coefficients whose roots are $\alpha - 2\beta$ and $\beta - 2\alpha$. **(7 marks)**

(ii) Find the values of the constant $k$ for which the quadratic equation $x^2 + (2 - k)x + 2(2 - k) = 0$ has imaginary (non-real) roots. **(5 marks)**

**Solution**

**(i)** $\alpha + \beta = \frac{1}{2}$ and $\alpha\beta = 3$, so $\alpha^2 + \beta^2 = (\alpha + \beta)^2 - 2\alpha\beta = \frac{1}{4} - 6 = -\frac{23}{4}$.

$$
\text{sum} = (\alpha - 2\beta) + (\beta - 2\alpha) = -(\alpha + \beta) = -\frac{1}{2}
$$

$$
\text{product} = (\alpha - 2\beta)(\beta - 2\alpha) = \alpha\beta - 2\alpha^2 - 2\beta^2 + 4\alpha\beta = 5\alpha\beta - 2(\alpha^2 + \beta^2) = 15 + \frac{23}{2} = \frac{53}{2}
$$

So $x^2 + \frac{1}{2}x + \frac{53}{2} = 0$, that is

$$
2x^2 + x + 53 = 0
$$

**(ii)** Non-real roots need a negative discriminant:

$$
(2 - k)^2 - 4 \cdot 2(2 - k) < 0 \quad\Rightarrow\quad (2 - k)(2 - k - 8) < 0 \quad\Rightarrow\quad (2 - k)(-6 - k) < 0 \quad\Rightarrow\quad (k - 2)(k + 6) < 0
$$

$$
-6 < k < 2
$$

---

## 3 · 6 marks

**Question**

(i) Express $\dfrac{x - 1}{(x + 2)(x + 1)}$ in partial fractions. **(3 marks)**

(ii) Of Peter's 13 friends, 7 are older than him. In how many ways can he invite 6 friends, including at least 4 older friends? **(3 marks)**

**Solution**

**(i)**

$$
\frac{x - 1}{(x + 2)(x + 1)} = \frac{A}{x + 2} + \frac{B}{x + 1} \quad\Rightarrow\quad x - 1 = A(x + 1) + B(x + 2)
$$

$x = -2$: $-3 = -A$, so $A = 3$. $x = -1$: $-2 = B$.

$$
\frac{x - 1}{(x + 2)(x + 1)} = \frac{3}{x + 2} - \frac{2}{x + 1}
$$

**(ii)** There are 7 older and 6 younger friends. Count by the number of older friends invited:

| Older | Younger | Ways                                            |
| ----- | ------- | ----------------------------------------------- |
| 4     | 2       | $\binom{7}{4}\binom{6}{2} = 35 \times 15 = 525$ |
| 5     | 1       | $\binom{7}{5}\binom{6}{1} = 21 \times 6 = 126$  |
| 6     | 0       | $\binom{7}{6}\binom{6}{0} = 7$                  |

Total: $525 + 126 + 7 = 658$ ways.

---

## 4 · 11 marks

**Question**

Express $\cos 3\theta - \sqrt{3}\sin 3\theta$ in the form $R\cos(3\theta + \beta)$, where $R > 0$ and $\beta$ is an acute angle.

Hence, or otherwise, find the general solution of the equation $\cos 3\theta - \sqrt{3}\sin 3\theta = \sqrt{2}$.

Determine the minimum and maximum values of $\dfrac{5}{2\cos 3\theta - 2\sqrt{3}\sin 3\theta + 7}$. **(11 marks)**

**Solution**

$R\cos(3\theta + \beta) = R\cos 3\theta\cos\beta - R\sin 3\theta\sin\beta$, so $R\cos\beta = 1$ and $R\sin\beta = \sqrt{3}$:

$$
R = 2, \quad \beta = 60^\circ, \qquad \cos 3\theta - \sqrt{3}\sin 3\theta = 2\cos(3\theta + 60^\circ)
$$

**Equation:** $\cos(3\theta + 60^\circ) = \frac{\sqrt{2}}{2}$, so

$$
3\theta + 60^\circ = 360^\circ n \pm 45^\circ \quad\Rightarrow\quad \theta = 120^\circ n - 5^\circ \quad\text{or}\quad \theta = 120^\circ n - 35^\circ, \qquad n \in \mathbb{Z}
$$

**Maximum and minimum:** the denominator is $2(\cos 3\theta - \sqrt{3}\sin 3\theta) + 7 = 4\cos(3\theta + 60^\circ) + 7$, which goes from $-4 + 7 = 3$ up to $4 + 7 = 11$. So

$$
\text{maximum} = \frac{5}{3}, \qquad \text{minimum} = \frac{5}{11}
$$

---

## 5 · 11 marks

**Question**

(i) Given that $\dfrac{z + 1}{z - 1} = i$, express $z$ in the form $a + bi$, where $a$ and $b$ are real constants. Hence find $|2z|$. **(5 marks)**

(ii) The ninth term of an arithmetic progression is three times the third term. If the sum of the first four terms is 30, find the first term and the common difference of the progression. **(6 marks)**

**Solution**

**(i)**

$$
z + 1 = i(z - 1) \quad\Rightarrow\quad z - iz = -1 - i \quad\Rightarrow\quad z = \frac{-(1 + i)}{1 - i} = \frac{-(1 + i)^2}{(1 - i)(1 + i)} = \frac{-2i}{2} = -i
$$

So $z = 0 - i$, and $|2z| = |-2i| = 2$.

Check: $\frac{-i + 1}{-i - 1} = \frac{(1 - i)}{-(1 + i)} = -\frac{(1 - i)^2}{2} = -\frac{-2i}{2} = i$. ✓

**(ii)**

$$
T_9 = 3T_3 \quad\Rightarrow\quad a + 8d = 3a + 6d \quad\Rightarrow\quad d = a
$$

$$
S_4 = \frac{4}{2}(2a + 3d) = 30 \quad\Rightarrow\quad 2a + 3d = 15 \quad\Rightarrow\quad 5a = 15
$$

So $a = 3$ and $d = 3$. (The progression is $3, 6, 9, 12, \ldots$: $T_9 = 27 = 3 \times 9$ ✓.)

---

## 6 · 8 marks

**Question**

Find $\dfrac{dy}{dx}$ if

(a) $y = \dfrac{x^2 - 1}{x^2 + 1}$, **(3 marks)**

(b) $y = \cos^4 x$, **(2 marks)**

(c) $x^2 + y^2 = 16x$. **(3 marks)**

**Solution**

**(a)** Quotient rule:

$$
\frac{dy}{dx} = \frac{2x(x^2 + 1) - 2x(x^2 - 1)}{(x^2 + 1)^2} = \frac{4x}{(x^2 + 1)^2}
$$

**(b)** Chain rule: $\frac{dy}{dx} = 4\cos^3 x \cdot (-\sin x) = -4\cos^3 x\sin x$.

**(c)** Differentiate implicitly:

$$
2x + 2y\frac{dy}{dx} = 16 \quad\Rightarrow\quad \frac{dy}{dx} = \frac{8 - x}{y}
$$

---

## 7 · 9 marks

**Question**

Evaluate

(a) $\displaystyle\int_1^3 \frac{x^2}{x + 1}\,dx$, **(6 marks)**

(b) $\displaystyle\int_0^{\pi} e^{\cos x}\sin x\,dx$. **(3 marks)**

**Solution**

**(a)** Divide first: $\dfrac{x^2}{x + 1} = x - 1 + \dfrac{1}{x + 1}$.

$$
\int_1^3 \left(x - 1 + \frac{1}{x + 1}\right)dx = \left[\frac{x^2}{2} - x + \ln(x + 1)\right]_1^3 = \left(\frac{9}{2} - 3 + \ln 4\right) - \left(\frac{1}{2} - 1 + \ln 2\right)
$$

$$
= 2 + \ln 4 - \ln 2 = 2 + \ln 2 \approx 2.693
$$

**(b)** Let $u = \cos x$, $du = -\sin x\,dx$:

$$
\int_0^{\pi} e^{\cos x}\sin x\,dx = \Big[-e^{\cos x}\Big]_0^{\pi} = -e^{-1} + e^{1} = e - \frac{1}{e} \approx 2.350
$$

---

## 8 · 9 marks

**Question**

(i) Given the statements

$P$: John is sick,

$Q$: John will go to school,

translate into English the statements (a) $\sim P \wedge Q$, (b) $\sim(P \wedge \sim Q)$. **(2 marks)**

(ii) A relation $R$ is defined on the set of ordered pairs of real numbers by $(a, b)\,R\,(c, d)$ if and only if $a^2 + b^2 = c^2 + d^2$. Prove that $R$ is an equivalence relation. **(7 marks)**

**Solution**

**(i)(a)** John is not sick and he will go to school.

**(i)(b)** It is not the case that John is sick and will not go to school. (Equivalently: if John is sick, then he will still go to school.)

**(ii)** **Reflexive:** $a^2 + b^2 = a^2 + b^2$, so $(a, b)\,R\,(a, b)$.

**Symmetric:** if $a^2 + b^2 = c^2 + d^2$, then $c^2 + d^2 = a^2 + b^2$, so $(c, d)\,R\,(a, b)$.

**Transitive:** if $a^2 + b^2 = c^2 + d^2$ and $c^2 + d^2 = e^2 + f^2$, then $a^2 + b^2 = e^2 + f^2$, so $(a, b)\,R\,(e, f)$.

So $R$ is an equivalence relation. (Its classes are the circles centred at the origin: two points are related when they are the same distance from $O$.)

---

## 9 · 13 marks

**Question**

(i) The vector equations of two lines $L_1$ and $L_2$ are given by

$$
L_1 : \mathbf{r} = 2\mathbf{i} + \mathbf{j} + \lambda(\mathbf{i} + \mathbf{j} + \mathbf{k}), \qquad L_2 : \mathbf{r} = 2\mathbf{i} + 2\mathbf{j} + a\mathbf{k} + \mu(\mathbf{i} + 2\mathbf{j} + \mathbf{k}),
$$

where $a$ is a constant. Find the value of $a$ if $L_1$ and $L_2$ intersect, and the position vector of the point of intersection. **(5 marks)**

(ii) The matrices $A = \begin{pmatrix} 2 & 1 & 0 \\ 1 & 5 & 2 \\ 2 & -1 & 1 \end{pmatrix}$ and $B = \begin{pmatrix} -1 & 2 & 0 \\ 1 & 3 & 2 \\ 2 & 0 & 1 \end{pmatrix}$.

Calculate the matrix product $AB$. Hence find $B^{-1}A^{-1}$. **(8 marks)**

**Solution**

**(i)** Equate components:

$$
\mathbf{i}:\ 2 + \lambda = 2 + \mu, \qquad \mathbf{j}:\ 1 + \lambda = 2 + 2\mu, \qquad \mathbf{k}:\ \lambda = a + \mu
$$

The first gives $\lambda = \mu$; then the second gives $\lambda = -1$, so $\mu = -1$. The third gives $-1 = a - 1$, so $a = 0$.

The point of intersection is $2\mathbf{i} + \mathbf{j} - (\mathbf{i} + \mathbf{j} + \mathbf{k}) = \mathbf{i} - \mathbf{k}$.

**(ii)**

$$
AB = \begin{pmatrix} -1 & 7 & 2 \\ 8 & 17 & 12 \\ -1 & 1 & -1 \end{pmatrix}
$$

(For example, row 1 times column 1: $2(-1) + 1(1) + 0(2) = -1$.)

Since $(AB)^{-1} = B^{-1}A^{-1}$, we need the inverse of $AB$. Its determinant is

$$
\det(AB) = -1(-17 - 12) - 7(-8 + 12) + 2(8 + 17) = 29 - 28 + 50 = 51
$$

(Also $\det A \times \det B = 17 \times 3 = 51$. ✓)

The matrix of cofactors of $AB$ is $\begin{pmatrix} -29 & -4 & 25 \\ 9 & 3 & -6 \\ 50 & 28 & -73 \end{pmatrix}$, so

$$
B^{-1}A^{-1} = (AB)^{-1} = \frac{1}{51}\begin{pmatrix} -29 & 9 & 50 \\ -4 & 3 & 28 \\ 25 & -6 & -73 \end{pmatrix}
$$

Check: row 1 of $AB$ times column 1 of the adjoint gives $29 - 28 + 50 = 51$, and row 2 times column 1 gives $-232 - 68 + 300 = 0$. ✓

---

## 10 · 11 marks

**Question**

(i) A function is defined by

$$
f(x) = \begin{cases} x^2 - 3, & 0 \le x < 2 \\ 4x - 7, & 2 \le x < 4 \end{cases}
$$

and is such that $f(x) = f(x + 4)$. Find $f(27)$ and $f(-106)$. **(3 marks)**

(ii) Solve the differential equation $(x^2 - 1)\dfrac{dy}{dx} + xy = 3y$, given that $y = 1$ when $x = 0$, expressing the result in the form $y = f(x)$. **(8 marks)**

**Solution**

**(i)** $f$ is periodic with period 4, so subtract or add multiples of 4 to land in $0 \le x < 4$:

$$
f(27) = f(27 - 24) = f(3) = 4(3) - 7 = 5
$$

$$
f(-106) = f(-106 + 108) = f(2) = 4(2) - 7 = 1
$$

**(ii)** Rearrange and separate:

$$
(x^2 - 1)\frac{dy}{dx} = y(3 - x) \quad\Rightarrow\quad \int\frac{dy}{y} = \int\frac{3 - x}{(x - 1)(x + 1)}\,dx
$$

Partial fractions: $\dfrac{3 - x}{(x - 1)(x + 1)} = \dfrac{1}{x - 1} - \dfrac{2}{x + 1}$ (put $x = 1$: $2 = 2A$; $x = -1$: $4 = -2B$).

$$
\ln|y| = \ln|x - 1| - 2\ln|x + 1| + c \quad\Rightarrow\quad y = \frac{C|x - 1|}{(x + 1)^2}
$$

At $x = 0$, $y = 1$: $C = 1$. Near $x = 0$, $|x - 1| = 1 - x$, so

$$
y = \frac{1 - x}{(1 + x)^2}
$$

**Note:** the source prints "given that $y = 1$ and $x = 0$"; it means "when $x = 0$".
