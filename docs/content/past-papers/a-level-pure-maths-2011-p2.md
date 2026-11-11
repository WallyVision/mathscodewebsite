# A Level Pure Mathematics · June 2011 · Paper 2

Subject: **A Level Pure Mathematics with Mechanics** (this pure paper is shared with Pure Mathematics
with Statistics). Past paper: **2011, Paper 2** (GCE Board). Structured questions.
Questions are copied as set. Worked solutions are our own.

To add it: create the **2011 Paper 2** past paper for the subject, open it in **Admin → Past
papers**, press **Import many** under **Written questions**, choose this file and press **Check**,
then **Import questions**. Labels the paper already has are skipped, so importing twice is safe.

---

## 1 · 10 marks

**Question**

A real-valued function $f$ is defined by $f : x \mapsto \dfrac{2x - 3}{x + 1}$, $x \in \mathbb{R}$, $x \ne -1$.

(a) Obtain the composite function $ff$ and state its domain.

(b) Show that $f$ is injective.

(c) Find the range of $f$ and deduce that $f$ is not surjective.

**Solution**

**(a)**

$$
ff(x) = \frac{2 \cdot \frac{2x - 3}{x + 1} - 3}{\frac{2x - 3}{x + 1} + 1} = \frac{2(2x - 3) - 3(x + 1)}{(2x - 3) + (x + 1)} = \frac{x - 9}{3x - 2}
$$

We need $x \ne -1$ and $f(x) \ne -1$. $f(x) = -1$ when $2x - 3 = -x - 1$, that is $x = \frac{2}{3}$. The domain is $\mathbb{R} - \left\{-1, \frac{2}{3}\right\}$.

**(b)** If $f(a) = f(b)$, then $(2a - 3)(b + 1) = (2b - 3)(a + 1)$:

$$
2ab + 2a - 3b - 3 = 2ab + 2b - 3a - 3 \quad\Rightarrow\quad 5a = 5b \quad\Rightarrow\quad a = b
$$

So $f$ is injective.

**(c)** Write $f(x) = \dfrac{2(x + 1) - 5}{x + 1} = 2 - \dfrac{5}{x + 1}$. Since $\frac{5}{x + 1}$ takes every real value except 0, $f(x)$ takes every real value except 2. The range is $\mathbb{R} - \{2\}$.

The codomain is $\mathbb{R}$, and $2$ is never reached, so $f$ is not surjective.

---

## 2 · 10 marks

**Question**

(i) Find $\dfrac{dy}{dx}$ where

(a) $y = \ln\left(\dfrac{x^2 - 2}{x^2 + 3}\right)$,

(b) $x + y + \cos xy = 0$.

(ii) Given that $x = e^t\cos t$ and $y = e^t\sin t$, find $\dfrac{dy}{dx}$ when $t = \pi$.

**Solution**

**(i)(a)** $y = \ln(x^2 - 2) - \ln(x^2 + 3)$, so

$$
\frac{dy}{dx} = \frac{2x}{x^2 - 2} - \frac{2x}{x^2 + 3} = \frac{2x\big[(x^2 + 3) - (x^2 - 2)\big]}{(x^2 - 2)(x^2 + 3)} = \frac{10x}{(x^2 - 2)(x^2 + 3)}
$$

**(i)(b)** Differentiate implicitly:

$$
1 + \frac{dy}{dx} - \sin(xy)\left(y + x\frac{dy}{dx}\right) = 0 \quad\Rightarrow\quad \frac{dy}{dx}\big(1 - x\sin xy\big) = y\sin xy - 1
$$

$$
\frac{dy}{dx} = \frac{y\sin xy - 1}{1 - x\sin xy}
$$

**(ii)**

$$
\frac{dx}{dt} = e^t(\cos t - \sin t), \qquad \frac{dy}{dt} = e^t(\sin t + \cos t), \qquad \frac{dy}{dx} = \frac{\sin t + \cos t}{\cos t - \sin t}
$$

At $t = \pi$: $\dfrac{dy}{dx} = \dfrac{0 - 1}{-1 - 0} = 1$.

---

## 3 · 8 marks

**Question**

(i) Show that $\cos 2A = \dfrac{1 - \tan^2 A}{1 + \tan^2 A}$.

(ii) Find, in radians, the general solution of the equation $\cos 2x + 1 = \sin 2x$.

**Solution**

**(i)** Multiply top and bottom of the right-hand side by $\cos^2 A$:

$$
\frac{1 - \tan^2 A}{1 + \tan^2 A} = \frac{\cos^2 A - \sin^2 A}{\cos^2 A + \sin^2 A} = \frac{\cos 2A}{1} = \cos 2A \ ✓
$$

**(ii)** $\cos 2x + 1 = 2\cos^2 x$ and $\sin 2x = 2\sin x\cos x$:

$$
2\cos^2 x - 2\sin x\cos x = 0 \quad\Rightarrow\quad 2\cos x(\cos x - \sin x) = 0
$$

- $\cos x = 0$: $x = \frac{\pi}{2} + n\pi$;
- $\tan x = 1$: $x = \frac{\pi}{4} + n\pi$, with $n \in \mathbb{Z}$.

---

## 4 · 12 marks

**Question**

Vector parametric equations of the lines $L_1$ and $L_2$ are given by

$$
L_1 : \mathbf{r}_1 = 2\mathbf{i} + \mathbf{j} + \lambda(\mathbf{i} + \mathbf{j} + 2\mathbf{k}), \qquad L_2 : \mathbf{r}_2 = 2\mathbf{i} + 2\mathbf{j} + t\mathbf{k} + \mu(\mathbf{i} + 2\mathbf{j} + \mathbf{k}),
$$

where $t$ is a constant. Find

(a) the value of $t$ for which $L_1$ and $L_2$ intersect,

(b) the position vector of the point of intersection of $L_1$ and $L_2$,

(c) the cosine of the acute angle between $L_1$ and $L_2$,

(d) a vector parametric equation of the plane containing $L_1$ and $L_2$.

**Solution**

**(a)** Equate components:

$$
2 + \lambda = 2 + \mu, \qquad 1 + \lambda = 2 + 2\mu, \qquad 2\lambda = t + \mu
$$

The first gives $\lambda = \mu$; the second then gives $\lambda = -1 = \mu$; the third gives $-2 = t - 1$, so $t = -1$.

**(b)** With $\lambda = -1$: $\mathbf{r} = 2\mathbf{i} + \mathbf{j} - (\mathbf{i} + \mathbf{j} + 2\mathbf{k}) = \mathbf{i} - 2\mathbf{k}$.

**(c)**

$$
\cos\theta = \frac{(1, 1, 2) \cdot (1, 2, 1)}{\sqrt{6}\sqrt{6}} = \frac{1 + 2 + 2}{6} = \frac{5}{6}
$$

**(d)**

$$
\mathbf{r} = \mathbf{i} - 2\mathbf{k} + s(\mathbf{i} + \mathbf{j} + 2\mathbf{k}) + u(\mathbf{i} + 2\mathbf{j} + \mathbf{k}), \qquad s, u \in \mathbb{R}
$$

---

## 5 · 12 marks

**Question**

(i) Find the set of real values of $x$ for which the geometric series $\displaystyle\sum_{r=0}^{\infty}\left(\frac{x - 1}{x + 2}\right)^r$, $x \ne -2$, is convergent.

(ii) A woman has 10 close friends. Find the number of ways in which she can invite 4 of them to dinner if

(a) there are no restrictions,

(b) two of the friends are married and will not attend separately,

(c) two of them are not on speaking terms and will not attend together.

**Solution**

**(i)** A geometric series converges when the common ratio has modulus less than 1:

$$
\left|\frac{x - 1}{x + 2}\right| < 1 \quad\Rightarrow\quad (x - 1)^2 < (x + 2)^2 \quad\Rightarrow\quad -2x + 1 < 4x + 4 \quad\Rightarrow\quad x > -\frac{1}{2}
$$

The set is $\left\{x : x > -\frac{1}{2}\right\}$.

**(ii)(a)** $\binom{10}{4} = 210$.

**(ii)(b)** Either both of the married couple come (choose 2 more from the other 8) or neither comes (choose 4 from 8):

$$
\binom{8}{2} + \binom{8}{4} = 28 + 70 = 98
$$

**(ii)(c)** Subtract the invitations that include both of them:

$$
210 - \binom{8}{2} = 210 - 28 = 182
$$

**Note:** the source words (a) as "each of them is equally likely to attend", which we read as "no restrictions".

---

## 6 · 9 marks

**Question**

(i) Find the real values of $x$ for which $3^{2x + 1} - 12(3^x) + 9 = 0$.

(ii) Given that $p$ and $q$ are the roots of the equation $9x^2 - 4ax = -(1 + 6x)$, where $a$ is a real constant, show that an equation whose roots are $\frac{1}{p}$ and $\frac{1}{q}$ is $x^2 + (6 - 4a)x + 9 = 0$.

**Solution**

**(i)** Let $u = 3^x$, so $3^{2x + 1} = 3u^2$:

$$
3u^2 - 12u + 9 = 0 \quad\Rightarrow\quad u^2 - 4u + 3 = 0 \quad\Rightarrow\quad (u - 1)(u - 3) = 0
$$

$3^x = 1$ gives $x = 0$; $3^x = 3$ gives $x = 1$.

**(ii)** Rearranged, the equation is $9x^2 + (6 - 4a)x + 1 = 0$, so

$$
p + q = \frac{4a - 6}{9}, \qquad pq = \frac{1}{9}
$$

For the new roots:

$$
\frac{1}{p} + \frac{1}{q} = \frac{p + q}{pq} = 4a - 6, \qquad \frac{1}{pq} = 9
$$

The equation is $x^2 - (4a - 6)x + 9 = 0$, that is $x^2 + (6 - 4a)x + 9 = 0$. ✓

---

## 7

**Question**

(i) Given the complex numbers $z_1 = 10 + 5i$ and $z_2 = \dfrac{2(1 + i)}{3 - i}$, express $z_2$ and $z_1z_2^_$ in the form $a + bi$, where $a, b \in \mathbb{R}$ and $z_2^_$ is the complex conjugate of $z_2$.

(ii) Find the locus of points represented by complex numbers $z$ such that $2|z - 3| = |z - 6i|$.

**Solution**

**(i)**

$$
z_2 = \frac{2(1 + i)(3 + i)}{(3 - i)(3 + i)} = \frac{2(3 + 4i - 1)}{10} = \frac{2 + 4i}{5} = 0.4 + 0.8i
$$

$$
z_1z_2^* = (10 + 5i)(0.4 - 0.8i) = 4 - 8i + 2i + 4 = 8 - 6i
$$

**(ii)** Let $z = x + iy$:

$$
4\big[(x - 3)^2 + y^2\big] = x^2 + (y - 6)^2 \quad\Rightarrow\quad 3x^2 + 3y^2 - 24x + 12y = 0 \quad\Rightarrow\quad x^2 + y^2 - 8x + 4y = 0
$$

$$
(x - 4)^2 + (y + 2)^2 = 20
$$

The locus is the circle with centre $(4, -2)$, that is $4 - 2i$, and radius $2\sqrt{5}$.

**Note:** the source does not give the marks for this question.

---

## 8 · 9 marks

**Question**

(i) The table below shows values of a continuous variable $y$ corresponding to given values of $x$.

| $x$ | 2    | 3    | 4    | 5     | 6     |
| --- | ---- | ---- | ---- | ----- | ----- |
| $y$ | 13.6 | 27.2 | 54.4 | 108.8 | 217.6 |

Use the trapezium rule to find an estimate for $\displaystyle\int_2^6 y\,dx$.

(ii) Show that the equation $x^3 + x - 6 = 0$ has a root between 1 and 2.

Using the Newton–Raphson method and taking 1.6 as the first approximation, determine by means of two iterations two further approximations for the root, giving your answers correct to 3 decimal places.

**Solution**

**(i)** With strip width $h = 1$:

$$
\int_2^6 y\,dx \approx \frac{h}{2}\big[y_0 + y_4 + 2(y_1 + y_2 + y_3)\big] = \frac{1}{2}\big[13.6 + 217.6 + 2(27.2 + 54.4 + 108.8)\big] = \frac{1}{2}(231.2 + 380.8) = 306
$$

**(ii)** Let $f(x) = x^3 + x - 6$. Then $f(1) = -4 < 0$ and $f(2) = 4 > 0$. $f$ is continuous and changes sign, so there is a root between 1 and 2.

Newton–Raphson, with $f'(x) = 3x^2 + 1$:

$$
x_1 = 1.6 - \frac{f(1.6)}{f'(1.6)} = 1.6 - \frac{-0.304}{8.68} \approx 1.635
$$

$$
x_2 = 1.635023 - \frac{f(1.635023)}{f'(1.635023)} \approx 1.635023 - \frac{0.00593}{9.020} \approx 1.634
$$

---

## 9 · 10 marks

**Question**

Define the concept of an equivalence relation.

A relation $R$ is defined on the set $\mathbb{Z}$ of integers by $aRb \iff a^2 - a = b^2 - b$.

Show that $R$ is an equivalence relation. Write down 3 elements of the relation $R$ where $aRb$ but $a \ne b$.

**Solution**

A relation $R$ on a set is an **equivalence relation** if it is

- **reflexive:** $aRa$ for every $a$;
- **symmetric:** $aRb \Rightarrow bRa$;
- **transitive:** $aRb$ and $bRc \Rightarrow aRc$.

Let $g(n) = n^2 - n$, so $aRb \iff g(a) = g(b)$.

- Reflexive: $g(a) = g(a)$.
- Symmetric: $g(a) = g(b) \Rightarrow g(b) = g(a)$.
- Transitive: $g(a) = g(b)$ and $g(b) = g(c) \Rightarrow g(a) = g(c)$.

So $R$ is an equivalence relation.

**Pairs with $a \ne b$:** $a^2 - a = b^2 - b$ gives $(a - b)(a + b - 1) = 0$, so for $a \ne b$ we need $a + b = 1$. For example

$$
(0, 1),\quad (2, -1),\quad (3, -2)
$$

(Check: $2^2 - 2 = 2$ and $(-1)^2 - (-1) = 2$. ✓)

---

## 10 · 13 marks

**Question**

(i) Evaluate $\displaystyle\int_0^{\pi/4} x\cos x\,dx$.

(ii) Express $\dfrac{2}{(1 + x)(1 + 3x)}$ in partial fractions.

Hence, or otherwise, solve the differential equation

$$
\frac{dy}{dx} = \frac{2(y + 2)}{(1 + x)(1 + 3x)},
$$

given that $y = -1$ when $x = 0$.

**Solution**

**(i)** Integrate by parts ($u = x$, $dv = \cos x\,dx$):

$$
\int_0^{\pi/4} x\cos x\,dx = \Big[x\sin x + \cos x\Big]_0^{\pi/4} = \frac{\pi}{4} \cdot \frac{\sqrt{2}}{2} + \frac{\sqrt{2}}{2} - 1 = \frac{\sqrt{2}\pi}{8} + \frac{\sqrt{2}}{2} - 1 \approx 0.262
$$

**(ii)**

$$
\frac{2}{(1 + x)(1 + 3x)} = \frac{A}{1 + x} + \frac{B}{1 + 3x} \quad\Rightarrow\quad 2 = A(1 + 3x) + B(1 + x)
$$

$x = -1$: $2 = -2A$, so $A = -1$. $x = -\frac{1}{3}$: $2 = \frac{2}{3}B$, so $B = 3$.

$$
\frac{2}{(1 + x)(1 + 3x)} = \frac{3}{1 + 3x} - \frac{1}{1 + x}
$$

Separate the variables:

$$
\int\frac{dy}{y + 2} = \int\left(\frac{3}{1 + 3x} - \frac{1}{1 + x}\right)dx \quad\Rightarrow\quad \ln|y + 2| = \ln|1 + 3x| - \ln|1 + x| + c
$$

$$
y + 2 = A\,\frac{1 + 3x}{1 + x}
$$

At $x = 0$, $y = -1$: $1 = A$. So

$$
y = \frac{1 + 3x}{1 + x} - 2 = \frac{x - 1}{x + 1}
$$
