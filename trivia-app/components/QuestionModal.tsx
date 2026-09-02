"use client";

import { useState } from "react";
import { X, Puzzle, Sparkles } from "lucide-react";
import { colorFor, CREAM } from "@/lib/constants";
import { generateLetterHint } from "@/lib/letterHint";
import { GhostButton, BigButton, SectionLabel } from "./ui";
import { AudioPicker } from "./AudioPicker";
import type { BoardCell, Team } from "@/lib/types";

const TONE_NAMES = ["coral", "teal", "sky", "gold", "violet", "pink"];

export function QuestionModal({
  cell,
  categoryIndex,
  teams,
  onClose,
  onResolve,
}: {
  cell: BoardCell;
  categoryIndex: number;
  teams: Team[];
  onClose: () => void;
  onResolve: (teamId: string | null) => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const [hintShown, setHintShown] = useState(false);
  const q = cell.question!;
  const c = colorFor(categoryIndex);
  const hint = q.type === "letters" ? generateLetterHint(q.answer) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(30,26,46,0.55)" }}>
      <div className="w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden" style={{ backgroundColor: CREAM }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ backgroundColor: c.bg }}>
          <div className="text-white font-bold text-lg truncate pr-2" style={{ fontFamily: "var(--font-fredoka)" }}>
            {cell.category}
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-white font-bold text-2xl" style={{ fontFamily: "var(--font-fredoka)" }}>{cell.points}</div>
            <button onClick={onClose} aria-label="Cancel">
              <X size={22} color="white" />
            </button>
          </div>
        </div>

        <div className="px-7 py-7">
          <p className="text-2xl leading-snug font-semibold mb-5" style={{ color: "#332D4B" }}>{q.prompt}</p>

          {q.type === "letters" && (
            <div className="mb-5">
              {!hintShown ? (
                <GhostButton onClick={() => setHintShown(true)} icon={Puzzle}>Show letter hint</GhostButton>
              ) : (
                <div
                  className="text-3xl font-bold tracking-widest rounded-xl px-4 py-3 inline-block"
                  style={{ fontFamily: "var(--font-fredoka)", color: c.deep, backgroundColor: c.soft }}
                >
                  {hint}
                </div>
              )}
            </div>
          )}

          {q.type === "audio" && (
            <div className="mb-5 rounded-xl p-3" style={{ backgroundColor: c.soft }}>
              <AudioPicker />
            </div>
          )}

          {!revealed ? (
            <BigButton onClick={() => setRevealed(true)} tone={TONE_NAMES[categoryIndex % 6]} icon={Sparkles} size="md">
              Reveal answer
            </BigButton>
          ) : (
            <div>
              <div className="rounded-xl px-4 py-3 mb-5" style={{ backgroundColor: "white", border: `2px solid ${c.bg}` }}>
                <div className="text-xs font-semibold mb-1" style={{ color: "#8A81A6" }}>ANSWER</div>
                <div className="text-xl font-bold" style={{ color: "#332D4B" }}>{q.answer}</div>
              </div>

              <SectionLabel>Who got it right?</SectionLabel>
              <div className="flex flex-wrap gap-2 mb-3">
                {teams.map((t, i) => (
                  <button
                    key={t.id}
                    onClick={() => onResolve(t.id)}
                    className="rounded-xl px-4 py-2.5 font-bold text-white shadow-sm transition-transform active:scale-95"
                    style={{ backgroundColor: colorFor(i).bg }}
                  >
                    {t.name} +{cell.points}
                  </button>
                ))}
              </div>
              <button onClick={() => onResolve(null)} className="text-sm font-semibold underline" style={{ color: "#8A81A6" }}>
                No one got it — skip
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
