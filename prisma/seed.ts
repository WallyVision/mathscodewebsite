/**
 * Seeds the launch curriculum (Mathematics and Physics at O and A Level),
 * a sample note, a few sample MCQs and one open weekly test.
 * Safe to re-run: existing subjects and topics are kept, samples are added once.
 */
import { PrismaClient, type Level } from "@prisma/client";

const db = new PrismaClient();

/**
 * Sample questions, notes, a specimen paper and a demo test are for development.
 * On the live site run with SEED_SAMPLE_CONTENT=false to create only subjects and topics.
 */
const SAMPLE_CONTENT = process.env.SEED_SAMPLE_CONTENT !== "false";

interface SampleQuestion {
  topic: string;
  stem: string;
  options: [string, string, string, string];
  correct: "A" | "B" | "C" | "D";
  solution: string;
}

interface SubjectSeed {
  level: Level;
  slug: string;
  name: string;
  topics: string[];
  questions: SampleQuestion[];
}

const curriculum: SubjectSeed[] = [
  {
    level: "O_LEVEL",
    slug: "mathematics",
    name: "Mathematics",
    topics: [
      "Number and Arithmetic",
      "Sets",
      "Algebra",
      "Geometry and Mensuration",
      "Trigonometry",
      "Coordinate Geometry",
      "Vectors and Matrices",
      "Statistics and Probability",
    ],
    questions: [
      {
        topic: "Algebra",
        stem: "Solve the equation $3x - 7 = 11$.",
        options: ["$x = 4$", "$x = 6$", "$x = 7$", "$x = 18$"],
        correct: "B",
        solution: "Add 7 to both sides: $3x = 18$. Divide by 3: $x = 6$.",
      },
      {
        topic: "Number and Arithmetic",
        stem: "Simplify $2^3 \\times 2^4$.",
        options: ["$2^1$", "$2^7$", "$2^{12}$", "$4^7$"],
        correct: "B",
        solution: "When multiplying powers of the same base, add the indices: $2^{3+4} = 2^7$.",
      },
      {
        topic: "Statistics and Probability",
        stem: "A fair six-sided die is thrown once. What is the probability of getting a prime number?",
        options: ["$\\frac{1}{6}$", "$\\frac{1}{3}$", "$\\frac{1}{2}$", "$\\frac{2}{3}$"],
        correct: "C",
        solution:
          "The primes on a die are 2, 3 and 5, so 3 of the 6 equally likely outcomes: $\\frac{3}{6} = \\frac{1}{2}$.",
      },
      {
        topic: "Coordinate Geometry",
        stem: "Find the gradient of the line through the points $(1, 2)$ and $(3, 8)$.",
        options: ["$\\frac{1}{3}$", "$2$", "$3$", "$6$"],
        correct: "C",
        solution:
          "Gradient $= \\dfrac{y_2 - y_1}{x_2 - x_1} = \\dfrac{8 - 2}{3 - 1} = \\dfrac{6}{2} = 3$.",
      },
    ],
  },
  {
    level: "O_LEVEL",
    slug: "physics",
    name: "Physics",
    topics: [
      "Measurement and Units",
      "Mechanics",
      "Thermal Physics",
      "Waves and Optics",
      "Electricity",
      "Magnetism and Electromagnetism",
      "Atomic and Nuclear Physics",
    ],
    questions: [
      {
        topic: "Mechanics",
        stem: "A car accelerates uniformly from rest to $20\\,\\text{m s}^{-1}$ in $5\\,\\text{s}$. What is its acceleration?",
        options: [
          "$0.25\\,\\text{m s}^{-2}$",
          "$4\\,\\text{m s}^{-2}$",
          "$25\\,\\text{m s}^{-2}$",
          "$100\\,\\text{m s}^{-2}$",
        ],
        correct: "B",
        solution: "$a = \\dfrac{v - u}{t} = \\dfrac{20 - 0}{5} = 4\\,\\text{m s}^{-2}$.",
      },
      {
        topic: "Electricity",
        stem: "Resistors of $4\\,\\Omega$ and $6\\,\\Omega$ are connected in series. What is the total resistance?",
        options: ["$2.4\\,\\Omega$", "$5\\,\\Omega$", "$10\\,\\Omega$", "$24\\,\\Omega$"],
        correct: "C",
        solution: "In series, resistances add: $R = 4 + 6 = 10\\,\\Omega$.",
      },
      {
        topic: "Measurement and Units",
        stem: "What is the SI unit of power?",
        options: ["Joule", "Newton", "Pascal", "Watt"],
        correct: "D",
        solution:
          "Power is the rate of doing work, $P = \\dfrac{W}{t}$, measured in joules per second, i.e. watts (W).",
      },
    ],
  },
  {
    level: "A_LEVEL",
    slug: "mathematics",
    name: "Pure Mathematics with Mechanics",
    topics: [
      "Algebra and Functions",
      "Sequences and Series",
      "Trigonometry",
      "Differentiation",
      "Integration",
      "Vectors",
      "Complex Numbers",
      "Mechanics",
    ],
    questions: [
      {
        topic: "Integration",
        stem: "Evaluate $\\displaystyle\\int_0^1 2x\\,dx$.",
        options: ["$0$", "$\\frac{1}{2}$", "$1$", "$2$"],
        correct: "C",
        solution: "$\\displaystyle\\int_0^1 2x\\,dx = \\big[x^2\\big]_0^1 = 1 - 0 = 1$.",
      },
    ],
  },
  {
    level: "A_LEVEL",
    slug: "physics",
    name: "Physics",
    topics: [
      "Mechanics",
      "Fields",
      "Oscillations and Waves",
      "Electricity and Circuits",
      "Thermal Physics",
      "Quantum and Nuclear Physics",
    ],
    questions: [
      {
        topic: "Mechanics",
        stem: "What is the kinetic energy of a $2\\,\\text{kg}$ mass moving at $3\\,\\text{m s}^{-1}$?",
        options: ["$3\\,\\text{J}$", "$6\\,\\text{J}$", "$9\\,\\text{J}$", "$18\\,\\text{J}$"],
        correct: "C",
        solution:
          "$E_k = \\tfrac{1}{2}mv^2 = \\tfrac{1}{2} \\times 2 \\times 3^2 = 9\\,\\text{J}$.",
      },
    ],
  },
];

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function seedSubject(seed: SubjectSeed) {
  const subject = await db.subject.upsert({
    where: { level_slug: { level: seed.level, slug: seed.slug } },
    update: { name: seed.name },
    create: { level: seed.level, slug: seed.slug, name: seed.name },
  });

  const topicIds = new Map<string, string>();
  for (const [position, name] of seed.topics.entries()) {
    const topic = await db.topic.upsert({
      where: { subjectId_slug: { subjectId: subject.id, slug: slugify(name) } },
      update: { name, position },
      create: { subjectId: subject.id, slug: slugify(name), name, position },
    });
    topicIds.set(name, topic.id);
  }

  if (!SAMPLE_CONTENT) return subject;
  if ((await db.question.count({ where: { subjectId: subject.id } })) > 0) return subject;

  for (const q of seed.questions) {
    await db.question.create({
      data: {
        subjectId: subject.id,
        topicId: topicIds.get(q.topic),
        stem: q.stem,
        solution: q.solution,
        status: "PUBLISHED",
        options: {
          create: q.options.map((text, i) => {
            const label = "ABCD"[i] as string;
            return { label, text, isCorrect: label === q.correct };
          }),
        },
      },
    });
  }
  return subject;
}

async function main() {
  for (const seed of curriculum) {
    const subject = await seedSubject(seed);
    console.log(`Seeded ${seed.level} ${subject.name}`);
  }

  if (!SAMPLE_CONTENT) {
    console.log("Skipped sample content (SEED_SAMPLE_CONTENT=false)");
    return;
  }

  const oMaths = await db.subject.findUniqueOrThrow({
    where: { level_slug: { level: "O_LEVEL", slug: "mathematics" } },
    include: { topics: { where: { slug: "algebra" } } },
  });

  const algebra = oMaths.topics[0];
  if (algebra) {
    await db.note.upsert({
      where: { topicId_slug: { topicId: algebra.id, slug: "solving-linear-equations" } },
      update: {},
      create: {
        topicId: algebra.id,
        slug: "solving-linear-equations",
        title: "Solving linear equations",
        status: "PUBLISHED",
        body: [
          "A linear equation has the unknown to the power 1, e.g. $3x - 7 = 11$.",
          "",
          "**Method:** do the same operation to both sides until $x$ is alone.",
          "",
          "1. Collect the $x$ terms on one side and numbers on the other.",
          "2. Divide by the coefficient of $x$.",
          "",
          "**Example.** $5x + 3 = 2x + 15 \\Rightarrow 3x = 12 \\Rightarrow x = 4$.",
        ].join("\n"),
      },
    });
  }

  await seedNotes();
  await seedPosts();
  await seedSpecimenPaper(oMaths.id);

  if ((await db.test.count()) === 0) {
    const questions = await db.question.findMany({
      where: { subjectId: oMaths.id, status: "PUBLISHED" },
      select: { id: true },
    });
    const opensAt = new Date();
    const closesAt = new Date(opensAt.getTime() + 7 * 24 * 60 * 60 * 1000);
    await db.test.create({
      data: {
        subjectId: oMaths.id,
        title: "O Level Mathematics: Weekly Test 1",
        kind: "WEEKLY",
        status: "SCHEDULED",
        opensAt,
        closesAt,
        durationMinutes: 10,
        questions: {
          create: questions.map((q, position) => ({ questionId: q.id, position })),
        },
      },
    });
    console.log("Seeded sample weekly test");
  }
}

const extraNotes: {
  level: Level;
  subject: string;
  topic: string;
  slug: string;
  title: string;
  body: string[];
}[] = [
  {
    level: "O_LEVEL",
    subject: "mathematics",
    topic: "coordinate-geometry",
    slug: "gradient-of-a-straight-line",
    title: "Gradient of a straight line",
    body: [
      "The **gradient** $m$ measures how steep a line is: the change in $y$ for each unit change in $x$.",
      "",
      "$$",
      "m = \\frac{y_2 - y_1}{x_2 - x_1}",
      "$$",
      "",
      "| Line                  | Gradient     |",
      "| --------------------- | ------------ |",
      "| Rises left to right   | positive     |",
      "| Falls left to right   | negative     |",
      "| Horizontal            | $0$          |",
      "| Vertical              | undefined    |",
      "",
      "**Example.** Through $(2, 1)$ and $(5, 10)$: $m = \\dfrac{10 - 1}{5 - 2} = 3$.",
      "",
      "The equation of a line with gradient $m$ and $y$-intercept $c$ is $y = mx + c$.",
    ],
  },
  {
    level: "O_LEVEL",
    subject: "physics",
    topic: "mechanics",
    slug: "equations-of-motion",
    title: "Equations of uniformly accelerated motion",
    body: [
      "For motion in a straight line with constant acceleration $a$, starting velocity $u$,",
      "final velocity $v$, time $t$ and displacement $s$:",
      "",
      "$$",
      "\\begin{aligned} v &= u + at \\\\ s &= ut + \\tfrac{1}{2}at^2 \\\\ v^2 &= u^2 + 2as \\end{aligned}",
      "$$",
      "",
      "**Tips**",
      "",
      "- Write down the three quantities you know and the one you need, then pick the equation that links them.",
      '- "From rest" means $u = 0$. "Comes to rest" means $v = 0$.',
      "- Deceleration is a negative acceleration.",
      "",
      "**Example.** A ball is dropped from rest and falls for $3\\,\\text{s}$ ($g = 10\\,\\text{m s}^{-2}$).",
      "Its speed is $v = 0 + 10 \\times 3 = 30\\,\\text{m s}^{-1}$.",
    ],
  },
];

async function seedNotes() {
  for (const n of extraNotes) {
    const topic = await db.topic.findFirst({
      where: { slug: n.topic, subject: { level: n.level, slug: n.subject } },
      select: { id: true },
    });
    if (!topic) continue;
    await db.note.upsert({
      where: { topicId_slug: { topicId: topic.id, slug: n.slug } },
      update: { title: n.title, body: n.body.join("\n") },
      create: {
        topicId: topic.id,
        slug: n.slug,
        title: n.title,
        status: "PUBLISHED",
        body: n.body.join("\n"),
      },
    });
  }
}

/** Original questions in GCE Paper 1 style, so the past-paper pages have something to show. */
const specimenQuestions: SampleQuestion[] = [
  {
    topic: "Number and Arithmetic",
    stem: "Express $0.000345$ in standard form.",
    options: [
      "$3.45 \\times 10^{-3}$",
      "$3.45 \\times 10^{-4}$",
      "$34.5 \\times 10^{-5}$",
      "$3.45 \\times 10^{4}$",
    ],
    correct: "B",
    solution:
      "Move the decimal point 4 places to the right to get a number between 1 and 10: $3.45$. Moving right means a negative power, so $0.000345 = 3.45 \\times 10^{-4}$.\n\nOption C has the right value but $34.5$ is not between 1 and 10, so it is not standard form.",
  },
  {
    topic: "Algebra",
    stem: "Factorise $x^2 - 5x + 6$.",
    options: ["$(x + 2)(x + 3)$", "$(x - 2)(x - 3)$", "$(x - 1)(x - 6)$", "$(x + 1)(x - 6)$"],
    correct: "B",
    solution:
      "Find two numbers that multiply to $+6$ and add to $-5$: they are $-2$ and $-3$.\n\nSo $x^2 - 5x + 6 = (x - 2)(x - 3)$. Check: $(x-2)(x-3) = x^2 - 3x - 2x + 6 = x^2 - 5x + 6$. ✓",
  },
  {
    topic: "Sets",
    stem: "Given $n(A) = 12$, $n(B) = 9$ and $n(A \\cap B) = 4$, find $n(A \\cup B)$.",
    options: ["$13$", "$21$", "$17$", "$25$"],
    correct: "C",
    solution:
      "$n(A \\cup B) = n(A) + n(B) - n(A \\cap B) = 12 + 9 - 4 = 17$.\n\nThe intersection is subtracted once because it was counted in both $A$ and $B$.",
  },
  {
    topic: "Trigonometry",
    stem: "In a right-angled triangle, the side opposite angle $\\theta$ is $3\\,\\text{cm}$ and the hypotenuse is $5\\,\\text{cm}$. Find $\\cos\\theta$.",
    options: ["$\\frac{3}{5}$", "$\\frac{3}{4}$", "$\\frac{5}{4}$", "$\\frac{4}{5}$"],
    correct: "D",
    solution:
      "By Pythagoras, the adjacent side is $\\sqrt{5^2 - 3^2} = \\sqrt{16} = 4\\,\\text{cm}$.\n\n$\\cos\\theta = \\dfrac{\\text{adjacent}}{\\text{hypotenuse}} = \\dfrac{4}{5}$.",
  },
  {
    topic: "Geometry and Mensuration",
    stem: "Find the area of a circle of radius $7\\,\\text{cm}$. Take $\\pi = \\frac{22}{7}$.",
    options: [
      "$154\\,\\text{cm}^2$",
      "$44\\,\\text{cm}^2$",
      "$308\\,\\text{cm}^2$",
      "$616\\,\\text{cm}^2$",
    ],
    correct: "A",
    solution:
      "$A = \\pi r^2 = \\dfrac{22}{7} \\times 7 \\times 7 = 22 \\times 7 = 154\\,\\text{cm}^2$.\n\n$44\\,\\text{cm}$ is the circumference ($2\\pi r$), a common mix-up.",
  },
  {
    topic: "Statistics and Probability",
    stem: "Find the mean of $2, 4, 6, 8, 10$.",
    options: ["$5$", "$6$", "$7$", "$30$"],
    correct: "B",
    solution: "Mean $= \\dfrac{2 + 4 + 6 + 8 + 10}{5} = \\dfrac{30}{5} = 6$.",
  },
];

async function seedSpecimenPaper(subjectId: string) {
  const ref = { subjectId, year: 2025, paperNumber: 1 };
  const existing = await db.pastPaper.findUnique({ where: { subjectId_year_paperNumber: ref } });
  if (existing) return;

  const paper = await db.pastPaper.create({
    data: { ...ref, title: "Specimen Paper 1 (sample questions)", status: "PUBLISHED" },
  });
  const topics = await db.topic.findMany({
    where: { subjectId },
    select: { id: true, name: true },
  });
  const topicIds = new Map(topics.map((t) => [t.name, t.id]));

  for (const [i, q] of specimenQuestions.entries()) {
    await db.question.create({
      data: {
        subjectId,
        topicId: topicIds.get(q.topic),
        pastPaperId: paper.id,
        number: i + 1,
        stem: q.stem,
        solution: q.solution,
        status: "PUBLISHED",
        options: {
          create: q.options.map((text, j) => {
            const label = "ABCD"[j] as string;
            return { label, text, isCorrect: label === q.correct };
          }),
        },
      },
    });
  }
  console.log("Seeded specimen paper");
}

const samplePosts: {
  category: "SCHOLARSHIP" | "JOB" | "TRAVEL" | "FINANCE" | "CAREER";
  slug: string;
  title: string;
  summary: string;
  body: string[];
  organisation?: string;
  location?: string;
  externalUrl?: string;
  deadlineInDays?: number;
}[] = [
  {
    category: "FINANCE",
    slug: "student-budget-with-mobile-money",
    title: "Make a simple monthly budget with Mobile Money",
    summary:
      "Know where your money goes, save a little every month and avoid running out before month end.",
    body: [
      "## 1. Write down what comes in",
      "Pocket money, holiday job pay, gifts. Use the **real** amount, not what you hope for.",
      "",
      "## 2. List what must be paid first",
      "- Transport to school",
      "- Food and data bundles",
      "- School needs: books, photocopies, exam fees",
      "",
      "## 3. Save before you spend",
      "Move **10%** into savings the day money arrives. With MTN MoMo or Orange Money you can keep it in a separate wallet or savings feature so it is not mixed with spending money.",
      "",
      "## 4. Check every Sunday",
      "Look at your Mobile Money history. If one thing takes too much, plan to reduce it next week.",
      "",
      "**Tip:** never share your PIN or the code in an SMS, even with someone who says they are from MTN or Orange.",
    ],
  },
  {
    category: "CAREER",
    slug: "choosing-a-level-subjects-for-your-career",
    title: "Choosing A Level subjects for the career you want",
    summary:
      "Your A Level combination decides which university courses you can apply for. Choose with the end in mind.",
    body: [
      "## Start from the course, not the subject",
      "Look up the entry requirements of two or three university courses you like, then pick the subjects they ask for.",
      "",
      "| If you are aiming for | Subjects usually asked for |",
      "| --- | --- |",
      "| Medicine, pharmacy | Biology, Chemistry, plus Physics or Maths |",
      "| Engineering | Mathematics, Physics, often Chemistry |",
      "| Computer science | Mathematics, plus Physics or Further Maths |",
      "| Economics, accounting | Mathematics, Economics |",
      "",
      "Requirements differ between universities, so always check the official admission notice.",
      "",
      "## Be honest about your strengths",
      "Your O Level results in a subject are a good guide to how you will cope with it at A Level.",
      "",
      "## Talk to people already doing the job",
      "Ask what they studied and what they would do differently.",
    ],
  },
  {
    category: "TRAVEL",
    slug: "avoid-study-abroad-scams",
    title: "Studying abroad: how to avoid scams",
    summary:
      "Fake admission letters and visa agents cost families a lot of money. Five checks before you pay anyone.",
    body: [
      "1. **Apply directly** on the university's official website. Admission is usually free or has a small, published application fee.",
      "2. **Check the website address** carefully. Scam sites copy real names with small changes.",
      "3. **No one can guarantee a visa.** Only the embassy decides.",
      "4. **Pay fees only to the university's official bank account**, never to a personal account or agent's Mobile Money number.",
      "5. **Ask the embassy** in Yaoundé for the official visa checklist and fees.",
      "",
      "If an offer sounds too good to be true, it probably is.",
    ],
  },
  {
    category: "SCHOLARSHIP",
    slug: "sample-engineering-scholarship",
    title: "Sample: Engineering scholarship for A Level students",
    summary:
      "Sample post to show how scholarships appear. Replace it with real opportunities before launch.",
    organisation: "Sample Foundation",
    location: "Cameroon",
    externalUrl: "https://example.org/scholarship",
    deadlineInDays: 45,
    body: [
      "## Who can apply",
      "- A Level holders with Mathematics and Physics",
      "",
      "## What it covers",
      "- Tuition for the first year",
    ],
  },
  {
    category: "JOB",
    slug: "sample-holiday-tutoring-job",
    title: "Sample: Holiday tutoring job for O Level maths",
    summary:
      "Sample post to show how jobs appear. Replace it with real opportunities before launch.",
    organisation: "Sample Tutoring Centre",
    location: "Buea",
    externalUrl: "https://example.org/jobs",
    deadlineInDays: 5,
    body: [
      "## The role",
      "Help Form 4 students revise algebra during the holidays.",
      "",
      "## You need",
      "- A good O Level grade in Mathematics",
    ],
  },
];

async function seedPosts() {
  const now = Date.now();
  for (const p of samplePosts) {
    const { body, deadlineInDays, ...data } = p;
    await db.post.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...data,
        body: body.join("\n"),
        status: "PUBLISHED",
        publishedAt: new Date(now),
        deadline: deadlineInDays ? new Date(now + deadlineInDays * 24 * 60 * 60 * 1000) : null,
      },
    });
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
