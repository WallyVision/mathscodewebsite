# A Level Pure Mathematics · June 2021 · Paper 2

Subject: **A Level Pure Mathematics with Mechanics** (this pure paper is shared with Pure Mathematics
with Statistics). Past paper: **2021, Paper 2** (GCE Board). Structured questions.
Questions are copied as set. Worked solutions are our own.

To add it: create the **2021 Paper 2** past paper for the subject, open it in **Admin → Past
papers**, press **Import many** under **Written questions**, choose this file and press **Check**,
then **Import questions**. Labels the paper already has are skipped, so importing twice is safe.

---

## 1 · 8 marks

**Question**

(i) The polynomial $f(x)$ is defined by $f(x) = 3 - ax + bx^2 - x^3$. When $f(x)$ is divided by $(x + 2)$ the remainder is 45. Given that $(3 - x)$ is a factor of $f(x)$, find the values of the real constants $a$ and $b$. **(5 marks)**

(ii) Express $\dfrac{5x}{(x + 3)(x - 2)}$ in partial fractions. **(3 marks)**

**Solution**

**(i)** Remainder theorem, $f(-2) = 45$:

$$
3 + 2a + 4b + 8 = 45 \quad\Rightarrow\quad a + 2b = 17
$$

Factor theorem, $f(3) = 0$:

$$
3 - 3a + 9b - 27 = 0 \quad\Rightarrow\quad -a + 3b = 8
$$

Add: $5b = 25$, so $b = 5$ and $a = 7$.

**(ii)**

$$
\frac{5x}{(x + 3)(x - 2)} = \frac{A}{x + 3} + \frac{B}{x - 2} \quad\Rightarrow\quad 5x = A(x - 2) + B(x + 3)
$$

$x = -3$ gives $-15 = -5A$, so $A = 3$. $x = 2$ gives $10 = 5B$, so $B = 2$.

$$
\frac{5x}{(x + 3)(x - 2)} = \frac{3}{x + 3} + \frac{2}{x - 2}
$$

---

## 2 · 11 marks

**Question**

(i) Given that the roots of the quadratic equation $x^2 + (2k + 2)x + 2k + 5 = 0$ are $\alpha$ and $\beta$,

(a) find the values of the constant $k$ for which $\alpha = \beta$; **(3 marks)**

(b) for $k > 0$, find the quadratic equation with integral coefficients whose roots are $2\alpha + \alpha\beta$ and $2\beta + \alpha\beta$. **(5 marks)**

(ii) Find the range of values of $x$ for which $\dfrac{2 - x}{x + 1} \ge 0$. **(3 marks)**

**Solution**

**(i)(a)** Equal roots need a zero discriminant:

$$
(2k + 2)^2 - 4(2k + 5) = 0 \quad\Rightarrow\quad 4k^2 + 8k + 4 - 8k - 20 = 0 \quad\Rightarrow\quad k^2 = 4 \quad\Rightarrow\quad k = \pm 2
$$

**(i)(b)** With $k = 2$ the equation is $x^2 + 6x + 9 = 0$, so $\alpha + \beta = -6$ and $\alpha\beta = 9$.

$$
\text{sum} = 2(\alpha + \beta) + 2\alpha\beta = -12 + 18 = 6
$$

$$
\text{product} = (2\alpha + \alpha\beta)(2\beta + \alpha\beta) = 4\alpha\beta + 2\alpha\beta(\alpha + \beta) + (\alpha\beta)^2 = 36 - 108 + 81 = 9
$$

The equation is $x^2 - 6x + 9 = 0$.

(Check: $\alpha = \beta = -3$, so each new root is $-6 + 9 = 3$, and $(x - 3)^2 = x^2 - 6x + 9$. ✓)

**(ii)** The critical values are $x = 2$ (numerator zero) and $x = -1$ (denominator zero, excluded).

| Interval                      | $x < -1$ | $-1 < x < 2$ | $x > 2$ |
| ----------------------------- | -------- | ------------ | ------- |
| Sign of $\frac{2 - x}{x + 1}$ | $-$      | $+$          | $-$     |

So $-1 < x \le 2$ ($x = 2$ gives 0, which is allowed; $x = -1$ is not).

---

## 3 · 10 marks

**Question**

(i) Show that $\dfrac{\sin 3A + \sin A}{\cos 3A + \cos A} = \tan 2A$. **(3 marks)**

(ii) Given that $f(\theta) = \sin\theta - \sqrt{3}\cos\theta$, express $f(\theta)$ in the form $R\sin(\theta - \lambda)$, where $R$ is a positive constant and $\lambda$ is an acute angle. Hence find the general solution of the equation $\sin\theta - \sqrt{3}\cos\theta = \sqrt{2}$. **(7 marks)**

**Solution**

**(i)** Use the factor formulae $\sin P + \sin Q = 2\sin\frac{P + Q}{2}\cos\frac{P - Q}{2}$ and $\cos P + \cos Q = 2\cos\frac{P + Q}{2}\cos\frac{P - Q}{2}$:

$$
\frac{\sin 3A + \sin A}{\cos 3A + \cos A} = \frac{2\sin 2A\cos A}{2\cos 2A\cos A} = \frac{\sin 2A}{\cos 2A} = \tan 2A \ ✓
$$

**(ii)** $R\sin(\theta - \lambda) = R\sin\theta\cos\lambda - R\cos\theta\sin\lambda$, so $R\cos\lambda = 1$ and $R\sin\lambda = \sqrt{3}$:

$$
R = \sqrt{1 + 3} = 2, \quad \tan\lambda = \sqrt{3} \Rightarrow \lambda = 60^\circ, \qquad f(\theta) = 2\sin(\theta - 60^\circ)
$$

Then

$$
2\sin(\theta - 60^\circ) = \sqrt{2} \quad\Rightarrow\quad \sin(\theta - 60^\circ) = \frac{\sqrt{2}}{2}
$$

$$
\theta - 60^\circ = 45^\circ + 360^\circ n \quad\text{or}\quad 135^\circ + 360^\circ n
$$

$$
\theta = 105^\circ + 360^\circ n \quad\text{or}\quad \theta = 195^\circ + 360^\circ n, \qquad n \in \mathbb{Z}
$$

(In radians: $\theta = \frac{7\pi}{12} + 2n\pi$ or $\frac{13\pi}{12} + 2n\pi$.)

---

## 4 · 10 marks

**Question**

(i) The real-valued function $f$ is defined as $f : x \mapsto \dfrac{4x}{x - 1}$, $x \in \mathbb{R}$, $x \ne 1$.

(a) Show that $f$ is injective. **(4 marks)**

(b) Find $(f \circ f)(x)$, stating its domain. **(3 marks)**

(ii) Two statements $p$ and $q$ are given by

$p$: The principal goes to the ministry.

$q$: The principal will meet the minister.

Write out the following propositions in ordinary English:

(a) $p \wedge q$, (b) $\sim p \vee \sim q$, (c) $\sim p \Rightarrow \sim q$. **(3 marks)**

**Solution**

**(i)(a)** Suppose $f(a) = f(b)$:

$$
\frac{4a}{a - 1} = \frac{4b}{b - 1} \quad\Rightarrow\quad 4ab - 4a = 4ab - 4b \quad\Rightarrow\quad a = b
$$

Equal outputs only come from equal inputs, so $f$ is injective.

**(i)(b)**

$$
f(f(x)) = \frac{4 \cdot \frac{4x}{x - 1}}{\frac{4x}{x - 1} - 1} = \frac{16x}{4x - (x - 1)} = \frac{16x}{3x + 1}
$$

We need $x \ne 1$ and $f(x) \ne 1$. $f(x) = 1$ when $4x = x - 1$, that is $x = -\frac{1}{3}$. The domain is $\mathbb{R} - \left\{1, -\frac{1}{3}\right\}$.

**(ii)**

(a) The principal goes to the ministry and will meet the minister.

(b) The principal does not go to the ministry or will not meet the minister.

(c) If the principal does not go to the ministry, then the principal will not meet the minister.

---

## 5 · 10 marks

**Question**

The equations of two lines are given by

$$
\mathbf{r}_1 = \mathbf{i} + a\mathbf{j} - \mathbf{k} + \lambda(\mathbf{i} + 2\mathbf{j} + 2\mathbf{k}), \qquad \mathbf{r}_2 = a\mathbf{i} + 2\mathbf{k} + \mu(-\mathbf{j} + 3\mathbf{k}),
$$

where $\lambda$ and $\mu$ are scalar parameters. Given that $\mathbf{r}_1$ and $\mathbf{r}_2$ intersect, find

(a) the value of the constant $a$, **(6 marks)**

(b) the position vector of the point of intersection, **(1 mark)**

(c) the cosine of the acute angle between $\mathbf{r}_1$ and $\mathbf{r}_2$. **(3 marks)**

**Solution**

**(a)** Equate components:

$$
\mathbf{i}:\ 1 + \lambda = a, \qquad \mathbf{j}:\ a + 2\lambda = -\mu, \qquad \mathbf{k}:\ -1 + 2\lambda = 2 + 3\mu
$$

From $\mathbf{i}$: $\lambda = a - 1$. Then $\mathbf{j}$ gives $\mu = -(3a - 2) = 2 - 3a$. Substitute into $\mathbf{k}$:

$$
-1 + 2(a - 1) = 2 + 3(2 - 3a) \quad\Rightarrow\quad 2a - 3 = 8 - 9a \quad\Rightarrow\quad a = 1
$$

**(b)** Then $\lambda = 0$ and $\mu = -1$. The point is $\mathbf{i} + \mathbf{j} - \mathbf{k}$.

Check on $\mathbf{r}_2$: $\mathbf{i} + 2\mathbf{k} - (-\mathbf{j} + 3\mathbf{k}) = \mathbf{i} + \mathbf{j} - \mathbf{k}$. ✓

**(c)** Use the directions $\mathbf{d}_1 = (1, 2, 2)$, with $|\mathbf{d}_1| = 3$, and $\mathbf{d}_2 = (0, -1, 3)$, with $|\mathbf{d}_2| = \sqrt{10}$:

$$
\cos\theta = \frac{|\mathbf{d}_1 \cdot \mathbf{d}_2|}{|\mathbf{d}_1||\mathbf{d}_2|} = \frac{|0 - 2 + 6|}{3\sqrt{10}} = \frac{4}{3\sqrt{10}} = \frac{2\sqrt{10}}{15} \approx 0.422
$$

---

## 6 · 10 marks

**Question**

(a) Evaluate $\displaystyle\int_0^{\pi/3} \cos^4 3x\sin 3x\,dx$. **(5 marks)**

(b) Find the volume of the solid generated when the curve $y = x^3$ is rotated completely about the $x$-axis between the ordinates $x = 0$ and $x = 3$. **(5 marks)**

**Solution**

**(a)** Let $u = \cos 3x$, so $du = -3\sin 3x\,dx$. When $x = 0$, $u = 1$; when $x = \frac{\pi}{3}$, $u = \cos\pi = -1$:

$$
\int_0^{\pi/3} \cos^4 3x\sin 3x\,dx = -\frac{1}{3}\int_1^{-1} u^4\,du = \frac{1}{3}\int_{-1}^{1} u^4\,du = \frac{1}{3}\left[\frac{u^5}{5}\right]_{-1}^{1} = \frac{1}{3} \cdot \frac{2}{5} = \frac{2}{15}
$$

**(b)**

$$
V = \pi\int_0^3 (x^3)^2\,dx = \pi\left[\frac{x^7}{7}\right]_0^3 = \frac{2187\pi}{7} \approx 981.5 \text{ cubic units}
$$

---

## 7

**Question**

(i) Show that the equation $f(x) = 0$, where $f(x) = 3x^3 - x^2 + 3x - 1$, has a root between 0 and 1.

(ii) Given that the parametric equations of a curve are $x = \sin 2\theta$, $y = \cos 2\theta$, find $\dfrac{d^2y}{dx^2}$ in terms of the parameter $\theta$. **(5 marks)**

(iii) Show that the function $f : \mathbb{R} \to \mathbb{R}$, where $f(x) = (2x - 5)^3 + x$, is an increasing function. **(3 marks)**

**Solution**

**(i)** $f(0) = -1 < 0$ and $f(1) = 3 - 1 + 3 - 1 = 4 > 0$. $f$ is continuous and changes sign, so there is a root between 0 and 1.

(In fact $f(x) = (3x - 1)(x^2 + 1)$, so the root is $x = \frac{1}{3}$.)

**(ii)** $\frac{dx}{d\theta} = 2\cos 2\theta$ and $\frac{dy}{d\theta} = -2\sin 2\theta$, so

$$
\frac{dy}{dx} = \frac{-2\sin 2\theta}{2\cos 2\theta} = -\tan 2\theta
$$

$$
\frac{d^2y}{dx^2} = \frac{\frac{d}{d\theta}(-\tan 2\theta)}{\frac{dx}{d\theta}} = \frac{-2\sec^2 2\theta}{2\cos 2\theta} = -\sec^3 2\theta
$$

**(iii)** $f'(x) = 3(2x - 5)^2 \times 2 + 1 = 6(2x - 5)^2 + 1 \ge 1 > 0$ for all $x$, so $f$ is increasing.

**Note:** the source does not give the marks for part (i).

---

## 8 · 10 marks

**Question**

(i) The sum of the first and second terms of a geometric progression is $-5$, while the sum of the fourth and fifth terms of the same progression is 40. Find the first term and the common ratio of the progression. **(6 marks)**

(ii) Find the term independent of $x$ in the expansion of $\left(x + \dfrac{2}{x^2}\right)^{15}$. **(4 marks)**

**Solution**

**(i)**

$$
a + ar = a(1 + r) = -5, \qquad ar^3 + ar^4 = ar^3(1 + r) = 40
$$

Divide: $r^3 = -8$, so $r = -2$. Then $a(1 - 2) = -5$, so $a = 5$.

(Check: $5 - 10 = -5$ ✓ and $-40 + 80 = 40$ ✓.)

**(ii)** The general term is

$$
\binom{15}{r}x^{15 - r}\left(\frac{2}{x^2}\right)^r = \binom{15}{r}2^r x^{15 - 3r}
$$

It is independent of $x$ when $15 - 3r = 0$, so $r = 5$:

$$
\binom{15}{5} \times 2^5 = 3003 \times 32 = 96\,096
$$

---

## 9 · 11 marks

**Question**

(i) Given the complex numbers $z_1 = 4 - 5i$ and $z_2 = p + 4i$, where $p \in \mathbb{R}$, find the value of $p$ for which $z_1\bar{z}_2$ is purely imaginary, where $\bar{z}_2$ is the complex conjugate of $z_2$.

Hence find $|z_1|$ and $\arg(z_2^2)$. **(8 marks)**

(ii) Given that $z = x + iy$, $x, y \in \mathbb{R}$, find the locus of the point $z$ such that $|z| = |z - 2 + 2i|$. **(3 marks)**

**Solution**

**(i)**

$$
z_1\bar{z}_2 = (4 - 5i)(p - 4i) = 4p - 16i - 5pi + 20i^2 = (4p - 20) - (16 + 5p)i
$$

It is purely imaginary when the real part is 0: $4p - 20 = 0$, so $p = 5$.

$$
|z_1| = \sqrt{4^2 + 5^2} = \sqrt{41} \approx 6.40
$$

$z_2 = 5 + 4i$ has $\arg z_2 = \tan^{-1}\frac{4}{5} \approx 38.66^\circ$, so

$$
\arg(z_2^2) = 2\arg z_2 \approx 77.32^\circ \ (\approx 1.35 \text{ rad})
$$

(Check: $z_2^2 = 25 + 40i - 16 = 9 + 40i$, and $\tan^{-1}\frac{40}{9} \approx 77.32^\circ$. ✓)

**(ii)** $|z - 2 + 2i| = |z - (2 - 2i)|$, so $z$ is the same distance from $0$ and from $2 - 2i$:

$$
x^2 + y^2 = (x - 2)^2 + (y + 2)^2 \quad\Rightarrow\quad 0 = -4x + 4 + 4y + 4 \quad\Rightarrow\quad y = x - 2
$$

The locus is the straight line $y = x - 2$, the perpendicular bisector of the segment from $(0, 0)$ to $(2, -2)$.

---

## 10 · 13 marks

**Question**

(a) Find the value of the constant $k$ for which the matrix $\mathbf{A}$ is singular, where

$$
\mathbf{A} = \begin{pmatrix} 2 & 3 & 4 \\ 1 & -1 & 2 \\ 5 & 0 & k \end{pmatrix}. \quad \textbf{(2 marks)}
$$

(b) Find the inverse of the matrix $\mathbf{B} = \begin{pmatrix} 2 & 3 & 4 \\ 1 & -1 & 2 \\ 5 & 0 & 2 \end{pmatrix}$.

Hence solve the system of equations

$$
2x + 3y + 4z = 1, \qquad x - y + 2z = 2, \qquad 5x + 2z = 5. \quad \textbf{(9 marks)}
$$

(c) Find the image of the point $\begin{pmatrix} -2 \\ 3 \\ 1 \end{pmatrix}$ under the transformation defined by $\mathbf{B}$. **(2 marks)**

**Solution**

**(a)** Expand along the first row:

$$
\det\mathbf{A} = 2(-k - 0) - 3(k - 10) + 4(0 + 5) = 50 - 5k
$$

$\mathbf{A}$ is singular when $\det\mathbf{A} = 0$, so $k = 10$.

**(b)** $\mathbf{B}$ is $\mathbf{A}$ with $k = 2$, so $\det\mathbf{B} = 50 - 10 = 40$. The matrix of cofactors is

$$
\begin{pmatrix} -2 & 8 & 5 \\ -6 & -16 & 15 \\ 10 & 0 & -5 \end{pmatrix}
$$

Transpose and divide by 40:

$$
\mathbf{B}^{-1} = \frac{1}{40}\begin{pmatrix} -2 & -6 & 10 \\ 8 & -16 & 0 \\ 5 & 15 & -5 \end{pmatrix}
$$

Then

$$
\begin{pmatrix} x \\ y \\ z \end{pmatrix} = \mathbf{B}^{-1}\begin{pmatrix} 1 \\ 2 \\ 5 \end{pmatrix} = \frac{1}{40}\begin{pmatrix} -2 - 12 + 50 \\ 8 - 32 + 0 \\ 5 + 30 - 25 \end{pmatrix} = \frac{1}{40}\begin{pmatrix} 36 \\ -24 \\ 10 \end{pmatrix} = \begin{pmatrix} 0.9 \\ -0.6 \\ 0.25 \end{pmatrix}
$$

Check: $2(0.9) + 3(-0.6) + 4(0.25) = 1$ ✓, $0.9 + 0.6 + 0.5 = 2$ ✓, $4.5 + 0.5 = 5$ ✓.

**(c)**

$$
\mathbf{B}\begin{pmatrix} -2 \\ 3 \\ 1 \end{pmatrix} = \begin{pmatrix} -4 + 9 + 4 \\ -2 - 3 + 2 \\ -10 + 0 + 2 \end{pmatrix} = \begin{pmatrix} 9 \\ -3 \\ -8 \end{pmatrix}
$$

The image is $(9, -3, -8)$.
