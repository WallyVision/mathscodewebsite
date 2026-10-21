import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Markdown } from "@/components/markdown";
import { requireUser } from "@/lib/auth/session";
import { getAttemptPaper, getTestForUser } from "@/lib/tests";
import { TestRunner } from "./test-runner";

export const metadata: Metadata = { title: "Test in progress" };

interface Props {
  params: Promise<{ testId: string }>;
}

export default async function TakeTestPage({ params }: Props) {
  const user = await requireUser();
  const { testId } = await params;
  const test = await getTestForUser(testId, user);
  if (!test) notFound();

  const paper = await getAttemptPaper(test.id, user.id);
  if (!paper) redirect(`/tests/${test.id}`);

  // Maths is rendered on the server so the browser does not download KaTeX.
  const questions = paper.questions.map((q) => ({
    id: q.id,
    stem: <Markdown>{q.stem}</Markdown>,
    options: q.options.map((o) => ({
      id: o.id,
      label: o.label,
      text: <Markdown>{o.text}</Markdown>,
    })),
  }));

  return (
    <TestRunner
      testId={test.id}
      title={test.title}
      questions={questions}
      initialAnswers={paper.answers}
      deadlineAt={paper.attempt.deadlineAt.getTime()}
      serverNow={Date.now()}
    />
  );
}
