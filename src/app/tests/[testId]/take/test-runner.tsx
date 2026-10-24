"use client";

import { useCallback, useEffect, useRef, useState, useTransition, type ReactNode } from "react";
import { reportFocusLoss, saveAnswerAction, submitTest } from "@/app/tests/actions";
import { formatSeconds } from "@/lib/format";

interface RunnerQuestion {
  id: string;
  stem: ReactNode;
  options: { id: string; label: string; text: ReactNode }[];
}

interface Props {
  testId: string;
  title: string;
  questions: RunnerQuestion[];
  initialAnswers: Record<string, string | null>;
  deadlineAt: number;
  serverNow: number;
}

type SaveState = "saving" | "saved" | "error";

const RETRY_MS = 5000;

function storageKey(testId: string) {
  return `studentlife237:test:${testId}:answers`;
}

// Local backup of answers, so a reload on a bad connection loses nothing.
function readBackup(testId: string): Record<string, string | null> {
  try {
    return JSON.parse(localStorage.getItem(storageKey(testId)) ?? "{}");
  } catch {
    return {};
  }
}

function writeBackup(testId: string, answers: Record<string, string | null>) {
  try {
    localStorage.setItem(storageKey(testId), JSON.stringify(answers));
  } catch {
    // Storage unavailable (private mode); the server copy still applies.
  }
}

function clearBackup(testId: string) {
  try {
    localStorage.removeItem(storageKey(testId));
  } catch {
    // Nothing to clear.
  }
}

export function TestRunner({
  testId,
  title,
  questions,
  initialAnswers,
  deadlineAt,
  serverNow,
}: Props) {
  const [answers, setAnswers] = useState(initialAnswers);
  const [saveState, setSaveState] = useState<Record<string, SaveState>>({});
  const [current, setCurrent] = useState(0);
  const [confirming, setConfirming] = useState(false);
  const [submitting, startSubmit] = useTransition();
  const [remaining, setRemaining] = useState(() => Math.ceil((deadlineAt - serverNow) / 1000));
  const submitted = useRef(false);
  const answersRef = useRef(answers);
  answersRef.current = answers;

  // Server time minus browser time, so a wrong phone clock does not change the timer.
  const clockOffset = useRef(serverNow - Date.now());

  const submit = useCallback(() => {
    if (submitted.current) return;
    submitted.current = true;
    startSubmit(async () => {
      try {
        // Answers travel with the submission, so the local backup is no longer needed.
        clearBackup(testId);
        await submitTest(testId, answersRef.current);
      } catch (err) {
        // A redirect is how a successful submission finishes; let it through.
        if (err && typeof err === "object" && "digest" in err) throw err;
        submitted.current = false;
        alert("Could not submit. Check your connection and try again.");
      }
    });
  }, [testId]);

  const save = useCallback(
    async (questionId: string, optionId: string | null) => {
      setSaveState((s) => ({ ...s, [questionId]: "saving" }));
      try {
        const result = await saveAnswerAction(testId, questionId, optionId);
        if (result.ok) {
          setSaveState((s) => ({ ...s, [questionId]: "saved" }));
        } else if (result.reason === "CLOSED") {
          submit();
        } else {
          setSaveState((s) => ({ ...s, [questionId]: "error" }));
        }
      } catch {
        setSaveState((s) => ({ ...s, [questionId]: "error" }));
      }
    },
    [testId, submit],
  );

  // Restore answers saved on this phone but possibly not on the server.
  useEffect(() => {
    const backup = readBackup(testId);
    const missing = Object.entries(backup).filter(([q, o]) => initialAnswers[q] !== o);
    if (missing.length === 0) return;
    setAnswers((a) => ({ ...a, ...Object.fromEntries(missing) }));
    for (const [q, o] of missing) void save(q, o);
  }, [testId, initialAnswers, save]);

  // Countdown, then automatic submission.
  useEffect(() => {
    const tick = () => {
      const left = Math.ceil((deadlineAt - (Date.now() + clockOffset.current)) / 1000);
      setRemaining(left);
      if (left <= 0) submit();
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [deadlineAt, submit]);

  // Retry answers that failed to save.
  useEffect(() => {
    const failed = Object.entries(saveState).filter(([, s]) => s === "error");
    if (failed.length === 0) return;
    const retry = setTimeout(() => {
      for (const [q] of failed) void save(q, answersRef.current[q] ?? null);
    }, RETRY_MS);
    return () => clearTimeout(retry);
  }, [saveState, save]);

  // Switching to another app or tab during a test is recorded for prize
  // verification. Reloading or closing the page also hides it, but is not
  // counted: students reload when their connection drops.
  useEffect(() => {
    let unloading = false;
    const onPageHide = () => {
      unloading = true;
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden" && !unloading && !submitted.current) {
        reportFocusLoss(testId).catch(() => {});
      }
    };
    window.addEventListener("pagehide", onPageHide);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pagehide", onPageHide);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [testId]);

  function choose(questionId: string, optionId: string) {
    const next = { ...answers, [questionId]: optionId };
    setAnswers(next);
    writeBackup(testId, next);
    void save(questionId, optionId);
  }

  const question = questions[current];
  const answeredCount = questions.filter((q) => answers[q.id]).length;
  const unsaved = Object.values(saveState).some((s) => s !== "saved");
  const lowTime = remaining <= 60;

  if (!question) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16">
      <div className="sticky top-0 z-10 -mx-4 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-sm font-medium">{title}</p>
          <p
            role="timer"
            aria-live="off"
            className={`shrink-0 rounded-md px-2 py-1 font-mono text-lg font-semibold tabular-nums ${lowTime ? "bg-red-100 text-red-700" : "bg-slate-100"}`}
          >
            {formatSeconds(remaining)}
          </p>
        </div>
        <p className="mt-1 text-xs text-slate-500" aria-live="polite">
          {answeredCount} of {questions.length} answered ·{" "}
          {unsaved ? "Saving…" : "All answers saved"}
        </p>
      </div>

      <section className="mt-6" aria-labelledby="question-heading">
        <h1 id="question-heading" className="text-sm font-semibold text-brand-700">
          Question {current + 1} of {questions.length}
        </h1>
        <div className="mt-2">{question.stem}</div>

        <fieldset className="mt-5 space-y-2">
          <legend className="sr-only">Choose one answer</legend>
          {question.options.map((option) => {
            const selected = answers[question.id] === option.id;
            return (
              <label
                key={option.id}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 px-4 py-3 transition ${selected ? "border-brand-600 bg-brand-50" : "border-slate-200 bg-white hover:border-slate-300"}`}
              >
                <input
                  type="radio"
                  name={`q-${question.id}`}
                  value={option.id}
                  checked={selected}
                  onChange={() => choose(question.id, option.id)}
                  className="sr-only"
                />
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${selected ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600"}`}
                >
                  {option.label}
                </span>
                <span className="min-w-0 flex-1">{option.text}</span>
              </label>
            );
          })}
        </fieldset>

        {saveState[question.id] === "error" && (
          <p className="mt-2 text-sm text-red-600">Not saved yet. Retrying…</p>
        )}

        <div className="mt-6 flex justify-between gap-3">
          <button
            type="button"
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
            className="rounded-md border border-slate-300 bg-white px-4 py-2 font-medium disabled:opacity-40"
          >
            ← Previous
          </button>
          {current < questions.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}
              className="rounded-md bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-700"
            >
              Next →
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="rounded-md bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700"
            >
              Finish
            </button>
          )}
        </div>
      </section>

      <nav aria-label="Questions" className="mt-8">
        <ol className="grid grid-cols-8 gap-2 sm:grid-cols-10">
          {questions.map((q, i) => (
            <li key={q.id}>
              <button
                type="button"
                onClick={() => setCurrent(i)}
                aria-current={i === current ? "step" : undefined}
                aria-label={`Question ${i + 1}${answers[q.id] ? ", answered" : ""}`}
                className={`h-9 w-full rounded-md text-sm font-medium ${i === current ? "ring-2 ring-brand-600 ring-offset-1" : ""} ${answers[q.id] ? "bg-brand-600 text-white" : "border border-slate-300 bg-white"}`}
              >
                {i + 1}
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-8 border-t border-slate-200 pt-6">
        {confirming ? (
          <div className="rounded-lg border border-slate-300 bg-white p-5">
            <p className="font-semibold">Submit your answers?</p>
            <p className="mt-1 text-sm text-slate-600">
              {answeredCount === questions.length
                ? "You have answered every question."
                : `You have ${questions.length - answeredCount} unanswered ${questions.length - answeredCount === 1 ? "question" : "questions"}.`}{" "}
              You cannot change your answers after submitting.
            </p>
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={submit}
                disabled={submitting}
                className="rounded-md bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                {submitting ? "Submitting…" : "Yes, submit"}
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                disabled={submitting}
                className="rounded-md border border-slate-300 bg-white px-4 py-2 font-medium"
              >
                Keep working
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="w-full rounded-md border-2 border-emerald-600 px-4 py-2.5 font-semibold text-emerald-700 hover:bg-emerald-50"
          >
            Submit test
          </button>
        )}
      </div>

      {submitting && (
        <div
          className="fixed inset-0 z-20 flex items-center justify-center bg-white/80"
          role="status"
        >
          <p className="text-lg font-semibold">Submitting your test…</p>
        </div>
      )}
    </div>
  );
}
