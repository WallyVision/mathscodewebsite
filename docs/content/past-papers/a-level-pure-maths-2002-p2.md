# A Level Pure Mathematics · June 2002 · Paper 2

Subject: **A Level Pure Mathematics with Mechanics** (this pure paper is shared with Pure Mathematics
with Statistics). Past paper: **2002, Paper 2** (GCE Board). Structured questions.
Questions are copied as set. Worked solutions are our own.

To add it: create the **2002 Paper 2** past paper for the subject, open it in **Admin → Past
papers**, press **Import many** under **Written questions**, choose this file and press **Check**,
then **Import questions**. Labels the paper already has are skipped, so importing twice is safe.

---

## 1 · 12 marks

**Question**

(i) If the roots of the quadratic equation $x^2 + bx + c = 0$ are $\alpha$ and $\beta$, find a quadratic equation whose roots are $\alpha + \dfrac{1}{\beta}$ and $\beta + \dfrac{1}{\alpha}$.

(ii) Given that $f(x) \equiv px^2 - 2x + 3p + 2$, find the two values of $p$ for which the equation $f(x) = 0$ has equal roots.

(iii) Show that, for real values of $x \ne 3$, $\dfrac{x^2 + 2x - 11}{x - 3}$ cannot take any value between 4 and 12.

**Solution**

**(i)** $\alpha + \beta = -b$ and $\alpha\beta = c$.

$$
\text{sum} = (\alpha + \beta) + \frac{\alpha + \beta}{\alpha\beta} = -b - \frac{b}{c} = -\frac{b(c + 1)}{c}, \qquad \text{product} = \alpha\beta + 2 + \frac{1}{\alpha\beta} = \frac{(c + 1)^2}{c}
$$

$$
cx^2 + b(c + 1)x + (c + 1)^2 = 0
$$

**(ii)** Equal roots: $(-2)^2 - 4p(3p + 2) = 0$, so

$$
3p^2 + 2p - 1 = 0 \quad\Rightarrow\quad (3p - 1)(p + 1) = 0 \quad\Rightarrow\quad p = \frac{1}{3} \text{ or } p = -1
$$

**(iii)** Let $y = \frac{x^2 + 2x - 11}{x - 3}$. Then $x^2 + (2 - y)x + (3y - 11) = 0$. For real $x$ the discriminant must be non-negative:

$$
(2 - y)^2 - 4(3y - 11) \ge 0 \quad\Rightarrow\quad y^2 - 16y + 48 \ge 0 \quad\Rightarrow\quad (y - 4)(y - 12) \ge 0
$$

So $y \le 4$ or $y \ge 12$: the expression cannot take any value strictly between 4 and 12.

---

## 2 · 10 marks

**Question**

(i) Find the maximum value of the function $f$ defined by $f(x) = \dfrac{x}{1 + x^2}$, $x \in \mathbb{R}$.

(ii) Given that $y = e^{-x}\sin bx$, where $b$ is a constant, show that $\dfrac{d^2y}{dx^2} + 2\dfrac{dy}{dx} + (1 + b^2)y = 0$.

**Solution**

**(i)**

$$
f'(x) = \frac{(1 + x^2) - 2x^2}{(1 + x^2)^2} = \frac{1 - x^2}{(1 + x^2)^2} = 0 \quad\Rightarrow\quad x = \pm 1
$$

$f'$ changes from $+$ to $-$ at $x = 1$, so the maximum value is $f(1) = \frac{1}{2}$.

**(ii)**

$$
\frac{dy}{dx} = -e^{-x}\sin bx + be^{-x}\cos bx = -y + be^{-x}\cos bx
$$

$$
\frac{d^2y}{dx^2} = -\frac{dy}{dx} - be^{-x}\cos bx - b^2e^{-x}\sin bx
$$

From the first line, $be^{-x}\cos bx = \frac{dy}{dx} + y$, so

$$
\frac{d^2y}{dx^2} = -\frac{dy}{dx} - \left(\frac{dy}{dx} + y\right) - b^2y \quad\Rightarrow\quad \frac{d^2y}{dx^2} + 2\frac{dy}{dx} + (1 + b^2)y = 0 \ ✓
$$

---

## 3 · 8 marks

**Question**

The function $f$ is defined by $f : x \mapsto \dfrac{2x + 1}{x - 1}$, $x \in \mathbb{R}$, $x \ne 1$. Find the function $ff$, stating its domain.

Another function $g$ is defined by

$$
g(x) = x + 2 \ \ (0 \le x < 2), \qquad g(x) = x^2 \ \ (2 \le x < 4),
$$

and $g$ is periodic with period 4. Sketch the graph of $g$ for $0 \le x \le 8$, and find $g(-6)$.

**Solution**

$$
ff(x) = \frac{2 \cdot \frac{2x + 1}{x - 1} + 1}{\frac{2x + 1}{x - 1} - 1} = \frac{2(2x + 1) + (x - 1)}{(2x + 1) - (x - 1)} = \frac{5x + 1}{x + 2}
$$

We need $x \ne 1$ and $f(x) \ne 1$. $f(x) = 1$ when $2x + 1 = x - 1$, that is $x = -2$. The domain is $\mathbb{R} - \{1, -2\}$.

**Sketch of $g$ on $0 \le x \le 8$:**

- $0 \le x < 2$: a straight line from $(0, 2)$ up to $(2, 4)$ (open circle at $x = 2$);
- $2 \le x < 4$: the parabola $y = x^2$ from $(2, 4)$ up to $(4, 16)$ (open circle at $x = 4$);
- $4 \le x < 8$: the same shape again, shifted 4 units right: a line from $(4, 2)$ to $(6, 4)$, then $y = (x - 4)^2$ from $(6, 4)$ to $(8, 16)$.

The graph jumps down from 16 to 2 at $x = 4$ (and again at $x = 8$).

$$
g(-6) = g(-6 + 8) = g(2) = 2^2 = 4
$$

---

## 4 · 8 marks

**Question**

(i) At a party, 11 boys and 5 girls are to form 8 dancing pairs in such a way that each girl is paired with a boy. Find the number of ways in which the dancing pairs can be formed.

(ii) Find the set of real values of $x$ for which $\dfrac{x}{x - 2} > \dfrac{1}{x + 1}$.

**Solution**

**(i)** The 5 girls each need a different boy: $11 \times 10 \times 9 \times 8 \times 7 = 55\,440$ ways. The 6 boys left over form 3 boy–boy pairs in $\frac{6!}{2^3 \times 3!} = 15$ ways.

$$
55\,440 \times 15 = 831\,600 \text{ ways}
$$

(If only the 5 boy–girl pairs are counted, the answer is $55\,440$.)

**(ii)** Bring everything to one side:

$$
\frac{x(x + 1) - (x - 2)}{(x - 2)(x + 1)} > 0 \quad\Rightarrow\quad \frac{x^2 + 2}{(x - 2)(x + 1)} > 0
$$

The numerator is always positive, so we need $(x - 2)(x + 1) > 0$:

$$
\{x : x < -1\} \cup \{x : x > 2\}
$$

---

## 5 · 12 marks

**Question**

(i) Given that $z = \dfrac{5}{2 - i} - (3 + 2i)$, express $z$ in the form $x + iy$, where $x$ and $y$ are real numbers, and find the values of $|z^2|$ and $\arg(z^2)$.

(ii) Given that $\dfrac{z}{1 + 2i} + \dfrac{z - 1}{5} = \dfrac{1}{1 - 2i}$, find real numbers $p$ and $q$ such that $(p + iq)z = 3 + 4i$.

**Solution**

**(i)**

$$
z = \frac{5(2 + i)}{5} - 3 - 2i = 2 + i - 3 - 2i = -1 - i
$$

$z^2 = (-1 - i)^2 = 1 + 2i - 1 = 2i$, so $|z^2| = 2$ and $\arg(z^2) = \frac{\pi}{2}$.

**(ii)** Use $\frac{1}{1 + 2i} = \frac{1 - 2i}{5}$ and $\frac{1}{1 - 2i} = \frac{1 + 2i}{5}$, and multiply through by 5:

$$
z(1 - 2i) + z - 1 = 1 + 2i \quad\Rightarrow\quad z(2 - 2i) = 2 + 2i \quad\Rightarrow\quad z = \frac{1 + i}{1 - i} = \frac{(1 + i)^2}{2} = i
$$

Then

$$
p + iq = \frac{3 + 4i}{i} = (3 + 4i)(-i) = 4 - 3i
$$

So $p = 4$ and $q = -3$.

---

## 6 · 10 marks

**Question**

(i) Find the general solution of the equation $\cos 2x + 1 = \sin 2x$.

(ii) Given that $f(\theta) \equiv \cos\theta - \sqrt{3}\sin\theta$, express $f(\theta)$ in the form $R\cos(\theta + \alpha)$, where $R > 0$ and $0 < \alpha < \frac{\pi}{2}$. Hence find the minimum value of $\dfrac{1}{1 + |f(\theta)|}$.

**Solution**

**(i)** $\cos 2x + 1 = 2\cos^2 x$ and $\sin 2x = 2\sin x\cos x$:

$$
2\cos x(\cos x - \sin x) = 0
$$

- $\cos x = 0$: $x = \frac{\pi}{2} + n\pi$;
- $\tan x = 1$: $x = \frac{\pi}{4} + n\pi$, with $n \in \mathbb{Z}$.

**(ii)** $R\cos\alpha = 1$ and $R\sin\alpha = \sqrt{3}$:

$$
R = 2, \quad \alpha = \frac{\pi}{3}, \qquad f(\theta) = 2\cos\left(\theta + \frac{\pi}{3}\right)
$$

$|f(\theta)|$ is at most 2, so $\frac{1}{1 + |f(\theta)|}$ is smallest when $|f(\theta)| = 2$:

$$
\text{minimum value} = \frac{1}{1 + 2} = \frac{1}{3}
$$

---

## 7 · 10 marks

**Question**

Show that the tangent at the point $P$, with parameter $t$, on the curve whose parametric equations are $x = ct$, $y = \dfrac{c}{t}$, where $c$ is a constant, has equation $x + t^2y = 2ct$.

This tangent meets the $x$-axis at a point $Q$, and the line through $P$ parallel to the $x$-axis cuts the $y$-axis at a point $R$. Show that the area of the triangle $QOR$, where $O$ is the origin, is a constant.

**Solution**

$\frac{dx}{dt} = c$ and $\frac{dy}{dt} = -\frac{c}{t^2}$, so the gradient is $-\frac{1}{t^2}$. The tangent at $P\left(ct, \frac{c}{t}\right)$ is

$$
y - \frac{c}{t} = -\frac{1}{t^2}(x - ct) \quad\Rightarrow\quad t^2y - ct = -x + ct \quad\Rightarrow\quad x + t^2y = 2ct \ ✓
$$

$Q$: put $y = 0$, giving $Q(2ct, 0)$. $R$: the line $y = \frac{c}{t}$ meets the $y$-axis at $R\left(0, \frac{c}{t}\right)$.

Triangle $QOR$ has a right angle at $O$:

$$
\text{Area} = \frac{1}{2} \times |2ct| \times \left|\frac{c}{t}\right| = c^2
$$

which does not depend on $t$, so it is constant.

---

## 8 · 9 marks

**Question**

Express $\dfrac{2}{(1 + x)(1 + 3x)}$ in partial fractions. Hence solve the differential equation $\dfrac{dy}{dx} = \dfrac{2(y + 2)}{(1 + x)(1 + 3x)}$, given that $y = -1$ when $x = 0$.

**Solution**

$$
\frac{2}{(1 + x)(1 + 3x)} = \frac{3}{1 + 3x} - \frac{1}{1 + x}
$$

(put $x = -1$: $2 = -2A$, so $A = -1$; put $x = -\frac{1}{3}$: $2 = \frac{2}{3}B$, so $B = 3$).

Separate the variables:

$$
\int\frac{dy}{y + 2} = \int\left(\frac{3}{1 + 3x} - \frac{1}{1 + x}\right)dx \quad\Rightarrow\quad \ln|y + 2| = \ln|1 + 3x| - \ln|1 + x| + c
$$

$$
y + 2 = A\frac{1 + 3x}{1 + x}
$$

At $x = 0$, $y = -1$: $A = 1$. So

$$
y = \frac{1 + 3x}{1 + x} - 2 = \frac{x - 1}{x + 1}
$$

---

## 9

**Question**

Two lines are given by the equations

$$
\mathbf{r} = 17\mathbf{i} - 9\mathbf{j} + 9\mathbf{k} + \lambda(3\mathbf{i} + \mathbf{j} + 5\mathbf{k}), \qquad \mathbf{r} = 15\mathbf{i} - 8\mathbf{j} - \mathbf{k} + \mu(4\mathbf{i} + 3\mathbf{j}),
$$

where $\lambda$ and $\mu$ are scalar parameters. Find

(a) the position vector of their point of intersection,

(b) the cosine of the acute angle between the lines,

(c) a vector parametric equation of the plane containing the lines.

**Solution**

**(a)** Equate components:

$$
17 + 3\lambda = 15 + 4\mu, \qquad -9 + \lambda = -8 + 3\mu, \qquad 9 + 5\lambda = -1
$$

The third gives $\lambda = -2$; the second then gives $\mu = -1$; the first checks: $11 = 11$ ✓. The point is $11\mathbf{i} - 11\mathbf{j} - \mathbf{k}$.

**(b)**

$$
\cos\theta = \frac{(3, 1, 5) \cdot (4, 3, 0)}{\sqrt{35} \times 5} = \frac{15}{5\sqrt{35}} = \frac{3}{\sqrt{35}} \approx 0.507
$$

**(c)**

$$
\mathbf{r} = 11\mathbf{i} - 11\mathbf{j} - \mathbf{k} + s(3\mathbf{i} + \mathbf{j} + 5\mathbf{k}) + t(4\mathbf{i} + 3\mathbf{j}), \qquad s, t \in \mathbb{R}
$$

**Note:** the source does not give the marks for this question.

---

## 10 · 11 marks

**Question**

(i) Using the substitution $t^2 = x^2 + 3$, evaluate $\displaystyle\int_0^1 \frac{x\,dx}{\sqrt{x^2 + 3}}$.

(ii) Evaluate $\displaystyle\int_0^{\pi/2} \sin^2 x\cos^3 x\,dx$.

**Solution**

**(i)** $2t\,dt = 2x\,dx$, so $x\,dx = t\,dt$ and $\sqrt{x^2 + 3} = t$. The limits $x = 0, 1$ become $t = \sqrt{3}, 2$:

$$
\int_{\sqrt{3}}^{2} \frac{t\,dt}{t} = \Big[t\Big]_{\sqrt{3}}^{2} = 2 - \sqrt{3}
$$

**(ii)** Write $\cos^3 x = (1 - \sin^2 x)\cos x$ and let $s = \sin x$:

$$
\int_0^{\pi/2} \sin^2 x(1 - \sin^2 x)\cos x\,dx = \int_0^1 (s^2 - s^4)\,ds = \frac{1}{3} - \frac{1}{5} = \frac{2}{15}
$$
