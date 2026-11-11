# O Level Additional Mathematics · June 2019 · Paper 2

Subject: **O Level Additional Mathematics**. Past paper: **2019, Paper 2** (GCE Board). Structured questions.
Questions are copied as set. Worked solutions are our own.

To add it: create the **2019 Paper 2** past paper for O Level Additional Mathematics, open it in
**Admin → Past papers**, press **Import many** under **Written questions**, choose this file and
press **Check**, then **Import questions**. Labels the paper already has are skipped, so importing
twice is safe.

**Not complete:** the Word file stops after part (i) of question 4. Questions 1–3 and Q4(i) are
here; add the rest later from the printed paper (re-importing skips what is already there, so give
the rest of question 4 a new label such as **4b**).

---

# Section A

## 1 · 8 marks

**Question**

(i) Given that $(x - 3)$ is a factor of $f(x)$, where $f(x) = x^3 - 6x^2 + kx - 6$,

(a) find the value of $k$; **(2 marks)**

(b) with this value of $k$, factorise $f(x)$ completely. **(2 marks)**

(ii) Given that the roots of the equation $x^2 - 3x - 5 = 0$ are $\alpha$ and $\beta$,

(a) find the values of $\alpha + \beta$ and $\alpha\beta$; **(1 mark)**

(b) evaluate $\frac{1}{\alpha^2} + \frac{1}{\beta^2}$. **(3 marks)**

**Solution**

**(i)(a)** By the factor theorem, $f(3) = 0$:

$$
27 - 54 + 3k - 6 = 0 \quad\Rightarrow\quad 3k = 33 \quad\Rightarrow\quad k = 11
$$

**(i)(b)** Divide $x^3 - 6x^2 + 11x - 6$ by $(x - 3)$ (or compare coefficients) to get $x^2 - 3x + 2 = (x - 1)(x - 2)$:

$$
f(x) = (x - 1)(x - 2)(x - 3)
$$

**(ii)(a)** $\alpha + \beta = 3$ and $\alpha\beta = -5$.

**(ii)(b)** Write the sum over a common denominator and use $\alpha^2 + \beta^2 = (\alpha + \beta)^2 - 2\alpha\beta$:

$$
\frac{1}{\alpha^2} + \frac{1}{\beta^2} = \frac{\alpha^2 + \beta^2}{(\alpha\beta)^2} = \frac{3^2 - 2(-5)}{(-5)^2} = \frac{9 + 10}{25} = \frac{19}{25}
$$

---

## 2 · 7 marks

**Question**

(i) Find the number of permutations of the letters of the word "LEVELS". **(3 marks)**

(ii) Write down the first three terms of the binomial expansion of $(1 - 3x)^6$ in ascending powers of $x$, simplifying your answer as far as possible. **(4 marks)**

**Solution**

**(i)** LEVELS has 6 letters, with L twice and E twice:

$$
\frac{6!}{2!\,2!} = \frac{720}{4} = 180
$$

**(ii)**

$$
(1 - 3x)^6 = 1 + \binom{6}{1}(-3x) + \binom{6}{2}(-3x)^2 + \ldots = 1 - 18x + 15(9x^2) + \ldots = 1 - 18x + 135x^2 + \ldots
$$

---

## 3 · 9 marks

**Question**

(i) A cement dealer piles bags of cement so that the first layer from the bottom has 19 bags, the second layer has 17 bags and the third layer has 15 bags. Given that he keeps piling the cement in the same pattern, find

(a) the number of bags of cement in the tenth layer, **(2 marks)**

(b) the total number of bags of cement in the ten layers. **(3 marks)**

(ii) The sum to infinity of a geometric progression is 6 and the first term is 3. Find

(a) the common ratio, **(2 marks)**

(b) the fifth term of the progression. **(2 marks)**

**Solution**

**(i)** The layers form an arithmetic progression with $a = 19$ and $d = -2$.

**(a)** $T_{10} = a + 9d = 19 - 18 = 1$ bag.

**(b)** $S_{10} = \frac{10}{2}(T_1 + T_{10}) = 5(19 + 1) = 100$ bags.

**(ii)(a)**

$$
\frac{a}{1 - r} = 6 \quad\Rightarrow\quad \frac{3}{1 - r} = 6 \quad\Rightarrow\quad 1 - r = \frac{1}{2} \quad\Rightarrow\quad r = \frac{1}{2}
$$

**(ii)(b)** $T_5 = ar^4 = 3 \times \left(\frac{1}{2}\right)^4 = \frac{3}{16}$.

---

## 4 · 5 marks

**Question**

The set $S = \{a, b, c, d\}$ and the operation $*$ form a group.

(a) Copy and complete the operation table: **(2 marks)**

| $*$   | a   | b   | c   | d   |
| ----- | --- | --- | --- | --- |
| **a** | b   |     | a   | c   |
| **b** | d   | c   |     | a   |
| **c** | a   |     | c   |     |
| **d** | c   | a   |     |     |

From the table,

(b) state the identity element, **(1 mark)**

(c) state the inverse of each element. **(2 marks)**

**Solution**

**(a)** Since $a * c = a$ and $c * c = c$, the element $c$ is the identity, so row $c$ and column $c$ copy the headings. In a group each row and each column contains every element exactly once, which fills the remaining gaps:

| $*$   | a   | b     | c     | d     |
| ----- | --- | ----- | ----- | ----- |
| **a** | b   | **d** | a     | c     |
| **b** | d   | c     | **b** | a     |
| **c** | a   | **b** | c     | **d** |
| **d** | c   | a     | **d** | **b** |

**(b)** The identity element is $c$.

**(c)** Find $c$ in each row: $a * d = c$, $b * b = c$, $c * c = c$ and $d * a = c$. So

$$
a^{-1} = d, \quad b^{-1} = b, \quad c^{-1} = c, \quad d^{-1} = a
$$
