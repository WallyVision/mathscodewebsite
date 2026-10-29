"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { formValues, invalid, type AdminFormState } from "@/lib/admin/form";
import { testSchema } from "@/lib/admin/schemas";
import { ADMIN_ONLY, requireRole } from "@/lib/auth/session";
import { db } from "@/lib/db";

export async function saveTest(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  await requireRole(ADMIN_ONLY);
  const questionIds = formData.getAll("questionIds").map(String);
  const values: Record<string, string> = {
    ...formValues(formData),
    questionIds: questionIds.join(","),
  };
  const parsed = testSchema.safeParse({ ...values, questionIds });
  if (!parsed.success) return invalid(parsed.error, values);
  const { questionIds: picked, questionMode, drawCount, ...rest } = parsed.data;
  // A drawn test gets its questions when it opens; until then it has none.
  const drawn = questionMode === "DRAW";
  const ids = drawn ? [] : picked;
  const data = { ...rest, drawCount: drawn ? drawCount : null };
  if (drawn && data.status === "SCHEDULED" && drawCount) {
    const bankSize = await db.question.count({
      where: { subjectId: data.subjectId, status: "PUBLISHED", forTests: true },
    });
    if (bankSize < drawCount) {
      return {
        fieldErrors: {
          drawCount: [
            `The subject's test bank has only ${bankSize} published questions. Add more, draw fewer, or save as a draft.`,
          ],
        },
        values,
      };
    }
  }

  const matching = await db.question.count({
    where: { id: { in: ids }, subjectId: data.subjectId },
  });
  if (matching !== ids.length) {
    return {
      fieldErrors: { questionIds: ["Every question must belong to the test's subject."] },
      values,
    };
  }

  const testId = values.id || null;
  if (testId) {
    const existing = await db.test.findUnique({
      where: { id: testId },
      select: {
        subjectId: true,
        drawCount: true,
        drawnAt: true,
        questions: { orderBy: { position: "asc" }, select: { questionId: true } },
        _count: { select: { attempts: true } },
      },
    });
    if (!existing) return { message: "This test no longer exists.", values };
    if (existing.drawnAt) {
      // Questions were drawn when it opened: only the details can change now.
      await db.test.update({
        where: { id: testId },
        data: { title: data.title, kind: data.kind, status: data.status, closesAt: data.closesAt },
      });
      redirect(`/admin/tests/${testId}?saved=1`);
    }
    const unchanged =
      existing.subjectId === data.subjectId &&
      existing.drawCount === data.drawCount &&
      existing.questions.map((q) => q.questionId).join() === ids.join();
    if (existing._count.attempts > 0 && !unchanged) {
      return {
        message:
          "Students have started this test, so its subject and questions can no longer change.",
        values,
      };
    }
    await db.$transaction([
      db.test.update({
        where: { id: testId },
        // Moved to open later: announce it again when it opens.
        data: { ...data, ...(data.opensAt > new Date() && { openNotifiedAt: null }) },
      }),
      ...(unchanged
        ? []
        : [
            db.testQuestion.deleteMany({ where: { testId } }),
            db.testQuestion.createMany({
              data: ids.map((questionId, position) => ({ testId, questionId, position })),
            }),
          ]),
    ]);
    redirect(`/admin/tests/${testId}?saved=1`);
  }

  const created = await db.test.create({
    data: {
      ...data,
      questions: { create: ids.map((questionId, position) => ({ questionId, position })) },
    },
    select: { id: true },
  });
  redirect(`/admin/tests/${created.id}?saved=1`);
}

/** Excludes an attempt from rankings and prizes, or restores it. */
export async function setAttemptDisqualified(attemptId: string, disqualified: boolean) {
  await requireRole(ADMIN_ONLY);
  const attempt = await db.testAttempt.findUnique({
    where: { id: attemptId },
    select: { testId: true, status: true, submittedAt: true, deadlineAt: true },
  });
  if (!attempt || attempt.status === "IN_PROGRESS") return;
  // Restored attempts go back to how they ended: submitted in time, or timed out.
  const ended =
    attempt.submittedAt && attempt.submittedAt <= attempt.deadlineAt ? "SUBMITTED" : "EXPIRED";
  await db.testAttempt.update({
    where: { id: attemptId },
    data: { status: disqualified ? "DISQUALIFIED" : ended },
  });
  revalidatePath(`/admin/tests/${attempt.testId}`);
}
