# A Level Pure Mathematics · June 2003 · Paper 2

Subject: **A Level Pure Mathematics with Mechanics** (this pure paper is shared with Pure Mathematics
with Statistics). Past paper: **2003, Paper 2** (GCE Board). Structured questions.
Questions are copied as set (misprints corrected and noted). Worked solutions are our own.

To add it: create the **2003 Paper 2** past paper for the subject, open it in **Admin → Past
papers**, press **Import many** under **Written questions**, choose this file and press **Check**,
then **Import questions**. Labels the paper already has are skipped, so importing twice is safe.

---

## 1 · 10 marks

**Question**

Express $4\sin x - 3\cos x$ in the form $R\sin(x - \alpha)$, where $\alpha$ is an acute angle and $R$ is a positive real number. Find

(a) all solutions of the equation $4\sin x - 3\cos x = 3$ in the interval $0^\circ \le x \le 360^\circ$, giving your answers to the nearest degree,

(b) the greatest and least values of $\dfrac{1}{4\sin x - 3\cos x + 6}$.

**Solution**

$R\cos\alpha = 4$ and $R\sin\alpha = 3$, so $R = 5$ and $\alpha = \tan^{-1}\frac{3}{4} \approx 36.87^\circ$:

$$
4\sin x - 3\cos x = 5\sin(x - 36.87^\circ)
$$

**(a)** $\sin(x - 36.87^\circ) = \frac{3}{5}$, and $\sin^{-1}\frac{3}{5} = 36.87^\circ$:

$$
x - 36.87^\circ = 36.87^\circ \quad\text{or}\quad 180^\circ - 36.87^\circ \quad\Rightarrow\quad x \approx 74^\circ \quad\text{or}\quad x = 180^\circ
$$

(Check $x = 180^\circ$: $0 - 3(-1) = 3$ ✓.)

**(b)** The denominator is $5\sin(x - 36.87^\circ) + 6$, which ranges from $1$ to $11$. So

$$
\text{greatest value} = \frac{1}{1} = 1, \qquad \text{least value} = \frac{1}{11}
$$

---

## 2 · 9 marks

**Question**

(i) Differentiate $\sin x$ with respect to $x$ from first principles.

(ii) Find $\dfrac{dy}{dx}$ if (a) $y = (x\sin x)^2$, (b) $y = \ln\left(\dfrac{1 + 3x^2}{1 - \tan x}\right)$.

**Solution**

**(i)**

$$
\frac{d}{dx}\sin x = \lim_{h \to 0}\frac{\sin(x + h) - \sin x}{h} = \lim_{h \to 0}\frac{2\cos\left(x + \frac{h}{2}\right)\sin\frac{h}{2}}{h} = \lim_{h \to 0}\cos\left(x + \frac{h}{2}\right) \cdot \frac{\sin\frac{h}{2}}{\frac{h}{2}} = \cos x
$$

using $\frac{\sin\theta}{\theta} \to 1$ as $\theta \to 0$.

**(ii)(a)** $y = x^2\sin^2 x$, so

$$
\frac{dy}{dx} = 2x\sin^2 x + 2x^2\sin x\cos x = 2x\sin x(\sin x + x\cos x)
$$

**(ii)(b)** $y = \ln(1 + 3x^2) - \ln(1 - \tan x)$, so

$$
\frac{dy}{dx} = \frac{6x}{1 + 3x^2} + \frac{\sec^2 x}{1 - \tan x}
$$

---

## 3 · 12 marks

**Question**

With respect to the origin $O$, the points $A$, $B$, $C$ and $D$ have position vectors $(2\mathbf{i} - \mathbf{j} + \mathbf{k})$ m, $(3\mathbf{i} + \mathbf{j} + \mathbf{k})$ m, $(2\mathbf{j} - \mathbf{k})$ m and $(\mathbf{i} - 2\mathbf{j} - \mathbf{k})$ m respectively. Find

(a) a vector equation of the line $AB$,

(b) an equation of the plane $BCD$ in the form $\mathbf{r} = \mathbf{a} + s\mathbf{b} + t\mathbf{c}$, where $s$ and $t$ are parameters.

Show that the point $A$ does not lie on the plane $BCD$.

**Solution**

**(a)** $\overrightarrow{AB} = (1, 2, 0)$:

$$
\mathbf{r} = 2\mathbf{i} - \mathbf{j} + \mathbf{k} + \lambda(\mathbf{i} + 2\mathbf{j})
$$

**(b)** $\overrightarrow{BC} = (-3, 1, -2)$ and $\overrightarrow{BD} = (-2, -3, -2)$:

$$
\mathbf{r} = 3\mathbf{i} + \mathbf{j} + \mathbf{k} + s(-3\mathbf{i} + \mathbf{j} - 2\mathbf{k}) + t(-2\mathbf{i} - 3\mathbf{j} - 2\mathbf{k})
$$

A normal is $\overrightarrow{BC} \times \overrightarrow{BD} = (-2 - 6,\ 4 - 6,\ 9 + 2) = (-8, -2, 11)$, so the plane is $8x + 2y - 11z = 15$. (Check: $C$ gives $0 + 4 + 11 = 15$ ✓ and $D$ gives $8 - 4 + 11 = 15$ ✓.)

**$A$ is not on the plane:** $8(2) + 2(-1) - 11(1) = 3 \ne 15$.

---

## 4 · 10 marks

**Question**

| $x$ | 0.50 | 0.25 | 0.17 | 0.13 | 0.10 | 0.083 | 0.07 |
| --- | ---- | ---- | ---- | ---- | ---- | ----- | ---- |
| $y$ | 0.38 | 0.25 | 0.19 | 0.15 | 0.13 | 0.11  | 0.09 |

The table above shows corresponding values of $x$ and $y$ obtained experimentally. It is given that $x$ and $y$ are related by an equation of the form $\dfrac{1}{y} = \dfrac{1}{a} - \dfrac{b}{x}$, where $a$ and $b$ are constants.

By drawing a suitable linear graph relating $\frac{1}{y}$ and $\frac{1}{x}$, estimate the values of $a$ and $b$ correct to two decimal places.

**Solution**

Plot $Y = \frac{1}{y}$ against $X = \frac{1}{x}$. The relation $Y = \frac{1}{a} - bX$ is a straight line with gradient $-b$ and intercept $\frac{1}{a}$.

| $X = \frac{1}{x}$ | 2    | 4    | 6    | 8    | 10   | 12   | 14    |
| ----------------- | ---- | ---- | ---- | ---- | ---- | ---- | ----- |
| $Y = \frac{1}{y}$ | 2.63 | 4.00 | 5.26 | 6.67 | 7.69 | 9.09 | 11.11 |

The line of best fit has gradient about $0.68$ and intercept about $1.20$:

$$
-b \approx 0.68 \Rightarrow b \approx -0.68, \qquad \frac{1}{a} \approx 1.20 \Rightarrow a \approx 0.83
$$

**Answer:** $a \approx 0.83$, $b \approx -0.68$ (values read from a graph may differ slightly).

**Note:** the source prints the sixth value of $x$ as 0.83. The pattern $\frac{1}{2}, \frac{1}{4}, \frac{1}{6}, \ldots$ shows it is $0.083 = \frac{1}{12}$.

---

## 5 · 12 marks

**Question**

(i) Show that the equation $x^5 - x^3 - 1 = 0$ has a root in the interval $1 \le x \le 2$. Taking $x = 1.5$ as a first approximation, use two iterations of the Newton–Raphson method to find an approximation to this root, correct to 2 decimal places.

(ii) Car numbers in the ten provinces of Cameroon are in the form AD 1323 H. The two letters at the beginning show the province in which the car is registered; the 4 digits that follow are taken from the digits 0 to 9 inclusive; and the letter at the end is one of the 26 letters of the alphabet. Given that the 4 digits must not all be zero, find the maximum number of cars which can be registered in Cameroon using this system.

**Solution**

**(i)** Let $f(x) = x^5 - x^3 - 1$. Then $f(1) = -1 < 0$ and $f(2) = 32 - 8 - 1 = 23 > 0$. $f$ is continuous and changes sign, so there is a root in $[1, 2]$.

Newton–Raphson, with $f'(x) = 5x^4 - 3x^2$:

$$
x_1 = 1.5 - \frac{f(1.5)}{f'(1.5)} = 1.5 - \frac{3.21875}{18.5625} \approx 1.3266
$$

$$
x_2 = 1.3266 - \frac{f(1.3266)}{f'(1.3266)} \approx 1.2508
$$

So the root is approximately $1.25$. (More iterations give $1.2365$.)

**(ii)** There are 10 province codes, $10^4 - 1 = 9999$ allowed digit groups (all except 0000), and 26 final letters:

$$
10 \times 9999 \times 26 = 2\,599\,740 \text{ cars}
$$

**Note:** the source does not state the starting value for Newton–Raphson; 1.5, the middle of the interval, is used here.

---

## 6 · 10 marks

**Question**

(a) Prove by mathematical induction that, for all positive integers $n$, $\displaystyle\sum_{r=1}^{n} 2r(r + 1) = \frac{2}{3}n(n + 1)(n + 2)$.

(b) Given that $x - 3$, $2x + 1$ and $7x - 2$ are the first three consecutive terms of an arithmetic progression, find the value of $x$ and hence obtain the sum of the first ten terms of the progression.

**Solution**

**(a)** **Base case**, $n = 1$: the left side is $2(1)(2) = 4$ and the right side is $\frac{2}{3}(1)(2)(3) = 4$. ✓

**Inductive step:** assume the formula holds for $n = k$. Then

$$
\sum_{r=1}^{k + 1} 2r(r + 1) = \frac{2}{3}k(k + 1)(k + 2) + 2(k + 1)(k + 2) = \frac{2}{3}(k + 1)(k + 2)(k + 3)
$$

which is the formula for $n = k + 1$. By induction it holds for all positive integers $n$.

**(b)** For an A.P., $2(\text{middle}) = \text{first} + \text{third}$:

$$
2(2x + 1) = (x - 3) + (7x - 2) \quad\Rightarrow\quad 4x + 2 = 8x - 5 \quad\Rightarrow\quad x = \frac{7}{4}
$$

The terms are $-\frac{5}{4}, \frac{9}{2}, \frac{41}{4}$, so $a = -\frac{5}{4}$ and $d = \frac{23}{4}$:

$$
S_{10} = \frac{10}{2}\left(2a + 9d\right) = 5\left(-\frac{5}{2} + \frac{207}{4}\right) = 5 \times \frac{197}{4} = \frac{985}{4} = 246.25
$$

---

## 7 · 12 marks

**Question**

The graph of $y = \dfrac{a + bx}{(x - 1)(x - 4)}$ has a turning point at $P(2, -1)$. Find the values of $a$ and $b$ and hence sketch the curve $y = f(x)$, showing clearly the turning points, asymptotes and intercept(s) with the axes.

**Solution**

$P$ is on the curve: $\frac{a + 2b}{(1)(-2)} = -1$, so $a + 2b = 2$.

By the quotient rule, the gradient is zero when the numerator of $y'$ is zero:

$$
b(x - 1)(x - 4) - (a + bx)(2x - 5) = 0 \quad\text{at } x = 2: \quad -2b + (a + 2b) = 0 \quad\Rightarrow\quad a = 0
$$

So $b = 1$, and $y = \dfrac{x}{(x - 1)(x - 4)}$.

**Turning points:** the numerator of $y'$ is $(x - 1)(x - 4) - x(2x - 5) = 4 - x^2$, which is zero at $x = \pm 2$.

- $x = 2$: $y = -1$; $y'$ changes from $+$ to $-$, so this is a **maximum** at $(2, -1)$.
- $x = -2$: $y = \frac{-2}{(-3)(-6)} = -\frac{1}{9}$; $y'$ changes from $-$ to $+$, so this is a **minimum** at $\left(-2, -\frac{1}{9}\right)$.

**Asymptotes:** $x = 1$, $x = 4$ and $y = 0$. **Intercept:** $(0, 0)$ only.

**Sketch:**

- $x < 1$: from $y \to 0^-$ (as $x \to -\infty$) down to the minimum $\left(-2, -\frac{1}{9}\right)$, up through $(0, 0)$, to $+\infty$ as $x \to 1^-$.
- $1 < x < 4$: from $-\infty$ near $x = 1$ up to the maximum $(2, -1)$, then down to $-\infty$ near $x = 4$.
- $x > 4$: from $+\infty$ near $x = 4$ down towards $y = 0^+$.

---

## 8 · 10 marks

**Question**

(i) Given that $z_1 = \sqrt{3} + i$ and $z_2 = 1 - 3i$, find

(a) $\dfrac{z_1}{z_2}$ in the form $p + iq$, where $p$ and $q$ are real,

(b) $\arg z_1^5$ and $|z_2|^6$.

(ii) Show that the roots of the equation $z^3 - 1 = 0$ lie at the vertices of an equilateral triangle.

**Solution**

**(i)(a)**

$$
\frac{z_1}{z_2} = \frac{(\sqrt{3} + i)(1 + 3i)}{1 + 9} = \frac{\sqrt{3} + 3\sqrt{3}\,i + i - 3}{10} = \frac{\sqrt{3} - 3}{10} + \frac{3\sqrt{3} + 1}{10}i
$$

$p \approx -0.127$ and $q \approx 0.620$.

**(i)(b)** $\arg z_1 = \frac{\pi}{6}$, so $\arg z_1^5 = \frac{5\pi}{6}$. $|z_2| = \sqrt{10}$, so $|z_2|^6 = 10^3 = 1000$.

**(ii)** $z^3 - 1 = (z - 1)(z^2 + z + 1) = 0$, so the roots are

$$
z = 1, \qquad z = -\frac{1}{2} \pm \frac{\sqrt{3}}{2}i
$$

All three have modulus 1, and their arguments are $0$, $\frac{2\pi}{3}$ and $-\frac{2\pi}{3}$. They are equally spaced ($120^\circ$ apart) on the unit circle, so they form an equilateral triangle. (Each side has length $\sqrt{3}$; for example $\left|1 - \left(-\frac{1}{2} + \frac{\sqrt{3}}{2}i\right)\right| = \sqrt{\frac{9}{4} + \frac{3}{4}} = \sqrt{3}$.)

---

## 9 · 9 marks

**Question**

(a) Find $\displaystyle\int\frac{x + 2}{(x + 1)(x^2 + 1)}\,dx$.

(b) Evaluate $\displaystyle\int_0^4 |x - 2|\,dx$.

**Solution**

**(a)**

$$
\frac{x + 2}{(x + 1)(x^2 + 1)} = \frac{A}{x + 1} + \frac{Bx + C}{x^2 + 1} \quad\Rightarrow\quad x + 2 = A(x^2 + 1) + (Bx + C)(x + 1)
$$

$x = -1$: $1 = 2A$, so $A = \frac{1}{2}$. Comparing $x^2$ terms: $0 = A + B$, so $B = -\frac{1}{2}$. Comparing constants: $2 = A + C$, so $C = \frac{3}{2}$.

$$
\int\left(\frac{1/2}{x + 1} + \frac{-\frac{1}{2}x + \frac{3}{2}}{x^2 + 1}\right)dx = \frac{1}{2}\ln|x + 1| - \frac{1}{4}\ln(x^2 + 1) + \frac{3}{2}\tan^{-1}x + c
$$

**(b)** The graph of $|x - 2|$ on $[0, 4]$ is two triangles, each with base 2 and height 2:

$$
\int_0^4 |x - 2|\,dx = \int_0^2 (2 - x)\,dx + \int_2^4 (x - 2)\,dx = 2 + 2 = 4
$$

---

## 10 · 9 marks

**Question**

(i) Solve the inequality $(x - 3)(x + 2)(x + 4) > 0$.

(ii) (a) Find the range of values of $x$ for which the series $\displaystyle\sum_{r=1}^{\infty}\left(\frac{x - 3}{x - 1}\right)^r$ converges.

(b) Find the value of $x$ for which $\displaystyle\sum_{r=1}^{\infty}\left(\frac{x - 3}{x - 1}\right)^r = \frac{1}{2}$.

**Solution**

**(i)** The critical values are $-4$, $-2$ and $3$.

| Interval | $x < -4$ | $-4 < x < -2$ | $-2 < x < 3$ | $x > 3$ |
| -------- | -------- | ------------- | ------------ | ------- |
| Sign     | $-$      | $+$           | $-$          | $+$     |

$$
-4 < x < -2 \quad\text{or}\quad x > 3
$$

**(ii)(a)** The geometric series converges when $|q| < 1$, with $q = \frac{x - 3}{x - 1}$:

$$
(x - 3)^2 < (x - 1)^2 \quad\Rightarrow\quad -6x + 9 < -2x + 1 \quad\Rightarrow\quad x > 2
$$

**(ii)(b)** The sum from $r = 1$ is $\dfrac{q}{1 - q}$:

$$
\frac{q}{1 - q} = \frac{1}{2} \quad\Rightarrow\quad q = \frac{1}{3} \quad\Rightarrow\quad 3(x - 3) = x - 1 \quad\Rightarrow\quad x = 4
$$

This is in the range $x > 2$ ✓.

**Note:** in the source, part (ii) runs the two requests together ("find the range of values of $x$ for which the series $\ldots = \frac{1}{2}$"); they have been separated.
