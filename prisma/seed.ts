/**
 * Seeds the launch curriculum (Mathematics and Physics at O and A Level),
 * a sample note, a few sample MCQs and one open weekly test.
 * Safe to re-run: existing subjects and topics are kept, samples are added once.
 */
import { PrismaClient, type Level } from "@prisma/client";

const db = new PrismaClient();

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

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
