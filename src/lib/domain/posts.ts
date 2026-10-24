import type { PostCategory } from "@prisma/client";

export interface CategoryInfo {
  category: PostCategory;
  slug: string;
  label: string;
  icon: string;
  description: string;
  /** Posts have application deadlines (scholarships, jobs). */
  hasDeadlines: boolean;
}

export const CATEGORIES: readonly CategoryInfo[] = [
  {
    category: "SCHOLARSHIP",
    slug: "scholarships",
    label: "Scholarships",
    icon: "🎓",
    description: "Funding for university in Cameroon and abroad, with deadlines and how to apply.",
    hasDeadlines: true,
  },
  {
    category: "JOB",
    slug: "jobs",
    label: "Jobs",
    icon: "💼",
    description: "Holiday jobs, internships and first jobs for students and school leavers.",
    hasDeadlines: true,
  },
  {
    category: "TRAVEL",
    slug: "travel",
    label: "Travel",
    icon: "✈️",
    description: "Studying abroad: admissions, visas, costs and avoiding travel scams.",
    hasDeadlines: false,
  },
  {
    category: "FINANCE",
    slug: "finance",
    label: "Finance management",
    icon: "💰",
    description: "Budgeting, saving and using Mobile Money wisely as a student.",
    hasDeadlines: false,
  },
  {
    category: "CAREER",
    slug: "careers",
    label: "Career orientation",
    icon: "🧭",
    description: "Choosing subjects, university courses and careers that fit you.",
    hasDeadlines: false,
  },
];

export function categoryBySlug(slug: string): CategoryInfo | null {
  return CATEGORIES.find((c) => c.slug === slug) ?? null;
}

export function categoryInfo(category: PostCategory): CategoryInfo {
  return CATEGORIES.find((c) => c.category === category)!;
}

export type DeadlineState = "none" | "open" | "closing-soon" | "closed";

const CLOSING_SOON_DAYS = 7;

/** Whether applications are still open. A deadline counts until the end of that moment. */
export function deadlineState(deadline: Date | null, now: Date): DeadlineState {
  if (!deadline) return "none";
  const left = deadline.getTime() - now.getTime();
  if (left < 0) return "closed";
  return left <= CLOSING_SOON_DAYS * 24 * 60 * 60 * 1000 ? "closing-soon" : "open";
}

/** Whole days left before a deadline, rounded up (0 once it has passed). */
export function daysLeft(deadline: Date, now: Date): number {
  return Math.max(0, Math.ceil((deadline.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)));
}

/** WhatsApp share link for a post. */
export function whatsappShareUrl(title: string, url: string): string {
  return `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`;
}
