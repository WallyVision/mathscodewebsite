import { z } from "zod";
import { fromDoualaInput } from "@/lib/format";

export { slugify } from "@/lib/slug";

const LABELS = ["A", "B", "C", "D"] as const;

const id = z.string().trim().min(1);
const optionalId = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : v));
const status = z.enum(["DRAFT", "PUBLISHED"]);
const markdown = (label: string, max = 20_000) =>
  z.string().trim().min(1, `Enter the ${label}`).max(max, `The ${label} is too long`);
const optionalInt = (min: number, max: number) =>
  z
    .string()
    .trim()
    .transform((v, ctx) => {
      if (v === "") return null;
      const n = Number(v);
      if (!Number.isInteger(n) || n < min || n > max) {
        ctx.addIssue({ code: "custom", message: `Enter a whole number from ${min} to ${max}` });
        return z.NEVER;
      }
      return n;
    });
const int = (min: number, max: number) =>
  z.coerce
    .number({ error: "Enter a number" })
    .int("Enter a whole number")
    .min(min, `Must be at least ${min}`)
    .max(max, `Must be at most ${max}`);

export const slugSchema = z
  .string()
  .trim()
  .min(1, "Enter a URL name")
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and single hyphens");

export const questionSchema = z
  .object({
    subjectId: id,
    topicId: optionalId,
    pastPaperId: optionalId,
    number: optionalInt(1, 200),
    stem: markdown("question"),
    optionA: markdown("option A", 2000),
    optionB: markdown("option B", 2000),
    optionC: markdown("option C", 2000),
    optionD: markdown("option D", 2000),
    correct: z.enum(LABELS, { error: "Choose the correct option" }),
    solution: z
      .string()
      .trim()
      .max(20_000)
      .transform((v) => (v === "" ? null : v)),
    difficulty: int(1, 3),
    status,
    forTests: z
      .string()
      .optional()
      .transform((v) => v === "on"),
  })
  .refine((q) => q.pastPaperId === null || q.number !== null, {
    message: "Give the question number within the past paper",
    path: ["number"],
  })
  .transform(({ optionA, optionB, optionC, optionD, ...rest }) => ({
    ...rest,
    options: [optionA, optionB, optionC, optionD].map((text, i) => ({
      label: LABELS[i]!,
      text,
    })),
  }));

export const noteSchema = z.object({
  topicId: id,
  title: z.string().trim().min(2, "Enter a title").max(120),
  slug: slugSchema,
  body: markdown("note", 50_000),
  status,
});

export const paperSchema = z.object({
  subjectId: id,
  year: int(1990, 2100),
  paperNumber: int(1, 9),
  title: z.string().trim().min(2, "Enter a title").max(120),
  status,
});

const doualaDate = (label: string) =>
  z.string().transform((v, ctx) => {
    const date = fromDoualaInput(v);
    if (!date) {
      ctx.addIssue({ code: "custom", message: `Enter the ${label}` });
      return z.NEVER;
    }
    return date;
  });

export const testSchema = z
  .object({
    subjectId: id,
    title: z.string().trim().min(2, "Enter a title").max(120),
    kind: z.enum(["WEEKLY", "MONTHLY"]),
    status: z.enum(["DRAFT", "SCHEDULED"]),
    opensAt: doualaDate("opening time"),
    closesAt: doualaDate("closing time"),
    durationMinutes: int(1, 300),
    questionMode: z.enum(["PICK", "DRAW"]).default("PICK"),
    drawCount: z
      .string()
      .optional()
      .transform((v, ctx) => {
        if (!v) return null;
        const n = Number(v);
        if (!Number.isInteger(n) || n < 1 || n > 200) {
          ctx.addIssue({ code: "custom", message: "Enter a number of questions from 1 to 200" });
          return z.NEVER;
        }
        return n;
      }),
    questionIds: z.array(id).max(200, "A test can have at most 200 questions"),
  })
  .refine((t) => t.closesAt > t.opensAt, {
    message: "Closing time must be after opening time",
    path: ["closesAt"],
  })
  .refine((t) => new Set(t.questionIds).size === t.questionIds.length, {
    message: "A question was added twice",
    path: ["questionIds"],
  })
  .refine((t) => t.questionMode === "DRAW" || t.status === "DRAFT" || t.questionIds.length > 0, {
    message: "Add at least one question before scheduling",
    path: ["questionIds"],
  })
  .refine((t) => t.questionMode === "PICK" || t.drawCount !== null, {
    message: "Enter how many questions to draw",
    path: ["drawCount"],
  });

export const grantSchema = z.object({
  userId: id,
  // A membership including this subject, or this subject added to a membership
  product: z.enum(["MEMBERSHIP", "EXTRA"]),
  subjectId: z.string().trim().min(1, "Choose the competition subject"),
  amount: int(0, 1_000_000),
  reference: z.string().trim().min(2, "Enter how it was paid, e.g. MoMo ref or 'cash'").max(120),
});

export const roleSchema = z.object({
  userId: id,
  role: z.enum(["STUDENT", "AUTHOR", "ADMIN"]),
});

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => (v === "" ? null : v));

export const postSchema = z.object({
  category: z.enum(["SCHOLARSHIP", "JOB", "TRAVEL", "FINANCE", "CAREER"], {
    error: "Choose a section",
  }),
  title: z.string().trim().min(2, "Enter a title").max(140),
  slug: slugSchema,
  summary: z
    .string()
    .trim()
    .min(10, "Write a one or two sentence summary")
    .max(300, "Keep the summary under 300 characters"),
  body: markdown("article", 50_000),
  externalUrl: z
    .string()
    .trim()
    .transform((v, ctx) => {
      if (v === "") return null;
      try {
        const url = new URL(v);
        if (url.protocol === "https:" || url.protocol === "http:") return url.toString();
      } catch {}
      ctx.addIssue({ code: "custom", message: "Enter a full web address starting with https://" });
      return z.NEVER;
    }),
  organisation: optionalText(120),
  location: optionalText(120),
  deadline: z.string().transform((v, ctx) => {
    if (v === "") return null;
    const date = fromDoualaInput(v);
    if (!date) {
      ctx.addIssue({ code: "custom", message: "Enter a valid date and time" });
      return z.NEVER;
    }
    return date;
  }),
  status,
});

export const subjectSchema = z.object({
  level: z.enum(["O_LEVEL", "A_LEVEL"]),
  name: z.string().trim().min(2, "Enter the subject name").max(80),
  code: z
    .string()
    .trim()
    .max(20)
    .transform((v) => (v === "" ? null : v)),
  competitionOpen: z
    .string()
    .optional()
    .transform((v) => v === "on"),
});

export const subjectUpdateSchema = subjectSchema.omit({ level: true }).extend({ id });

export const topicSchema = z.object({
  subjectId: id,
  name: z.string().trim().min(2, "Enter the topic name").max(80),
});

export const topicUpdateSchema = z.object({
  id,
  name: z.string().trim().min(2, "Enter the topic name").max(80),
  position: int(0, 999),
});

export const teamMemberSchema = z.object({
  subjectId: id,
  identifier: z.string().trim().min(3, "Enter the author's phone number or email").max(120),
  weight: int(1, 10),
});

export const teamWeightSchema = z.object({ id, weight: int(1, 10) });

export const payoutPaidSchema = z.object({
  id,
  reference: z.string().trim().min(2, "Enter the Mobile Money transaction ID or 'cash'").max(120),
});

export const replySchema = z.object({
  questionId: id,
  body: z.string().trim().min(2, "Write a reply").max(20_000, "The reply is too long"),
});

export const toolSchema = z.object({
  title: z.string().trim().min(2, "Enter a name").max(80),
  description: z.string().trim().min(2, "Say what the tool does").max(300),
  url: z
    .string()
    .trim()
    .max(500)
    .refine((v) => {
      try {
        return new URL(v).protocol === "https:";
      } catch {
        return false;
      }
    }, "Enter the full web address, starting with https://"),
  subjectId: z
    .string()
    .trim()
    .transform((v) => (v === "" ? null : v)),
  position: int(0, 999),
  published: z
    .string()
    .optional()
    .transform((v) => v === "on"),
});
