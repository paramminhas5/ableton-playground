import { useState } from "react";
import type { QuizQ } from "@/content/types";

export function Quiz({ qs, onComplete }: { qs: QuizQ[]; onComplete: (score: number) => void }) {
  const [answers, setAnswers] = useState<(number | null)[]>(qs.map(() => null));
  const [submitted, setSubmitted] = useState(false);
  const score = answers.reduce<number>((s, a, i) => s + (a === qs[i].answer ? 1 : 0), 0);
  return (
    <div className="space-y-4">
      {qs.map((q, i) => (
        <div key={i} className="brutal-border bg-card p-4 brutal-shadow-sm">
          <div className="font-display text-lg mb-2">Q{i + 1}. {q.q}</div>
          <div className="grid sm:grid-cols-2 gap-2">
            {q.options.map((opt, oi) => {
              const picked = answers[i] === oi;
              const right = submitted && oi === q.answer;
              const wrong = submitted && picked && oi !== q.answer;
              return (
                <button key={oi} disabled={submitted}
                  onClick={() => setAnswers((a) => a.map((v, idx) => idx === i ? oi : v))}
                  className={`brutal-border px-3 py-2 text-left font-mono text-sm ${right ? "bg-acid" : wrong ? "bg-hot text-bone" : picked ? "bg-sun" : "bg-bone"}`}>
                  {String.fromCharCode(65 + oi)}. {opt}
                </button>
              );
            })}
          </div>
          {submitted && q.explain && (
            <div className="brutal-border bg-volt text-bone p-2 mt-2 font-mono text-xs">▸ {q.explain}</div>
          )}
        </div>
      ))}
      {!submitted ? (
        <button onClick={() => { setSubmitted(true); onComplete(score / qs.length); }}
          disabled={answers.some((a) => a == null)}
          className="brutal-border bg-acid px-5 py-3 font-display text-xl brutal-press disabled:opacity-50">
          SUBMIT QUIZ
        </button>
      ) : (
        <div className="brutal-border bg-ink text-bone p-4 font-mono uppercase">Score: {score} / {qs.length}</div>
      )}
    </div>
  );
}
