"use client";

import { useState } from "react";
import { FileText, Puzzle, Music } from "lucide-react";
import { INK, POINT_TIERS, TYPE_LABELS } from "@/lib/constants";
import { BigButton, GhostButton, SectionLabel } from "./ui";
import type { Question, QuestionType } from "@/lib/types";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

const TYPE_ICONS: Record<QuestionType, typeof FileText> = {
  text: FileText,
  letters: Puzzle,
  audio: Music,
};

export function QuestionForm({
  initial,
  existingCategories,
  onSave,
  onCancel,
}: {
  initial?: Question;
  existingCategories: string[];
  onSave: (q: Question) => void;
  onCancel: () => void;
}) {
  const [category, setCategory] = useState(initial?.category || "");
  const [points, setPoints] = useState<number>(initial?.points || 100);
  const [type, setType] = useState<QuestionType>(initial?.type || "text");
  const [prompt, setPrompt] = useState(initial?.prompt || "");
  const [answer, setAnswer] = useState(initial?.answer || "");

  const canSave = category.trim() && prompt.trim() && answer.trim();

  return (
    <div className="rounded-2xl p-5 mb-4" style={{ backgroundColor: "white", border: "2px solid #EDE9F7" }}>
      <div className="grid sm:grid-cols-2 gap-3 mb-3">
        <div>
          <SectionLabel>Category</SectionLabel>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            list="category-suggestions"
            placeholder="e.g. Bible Basics"
            className="w-full rounded-lg px-3 py-2 outline-none"
            style={{ border: "1px solid #D8D2EA" }}
          />
          <datalist id="category-suggestions">
            {existingCategories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
        <div>
          <SectionLabel>Points</SectionLabel>
          <div className="flex gap-1.5 flex-wrap">
            {POINT_TIERS.map((p) => (
              <button
                key={p}
                onClick={() => setPoints(p)}
                className="rounded-lg px-3 py-2 font-bold text-sm"
                style={{ backgroundColor: points === p ? INK : "#F3F0FA", color: points === p ? "white" : INK }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-3">
        <SectionLabel>Question type</SectionLabel>
        <div className="flex gap-1.5">
          {(Object.keys(TYPE_LABELS) as QuestionType[]).map((key) => {
            const Icon = TYPE_ICONS[key];
            return (
              <button
                key={key}
                onClick={() => setType(key)}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 font-semibold text-sm"
                style={{ backgroundColor: type === key ? INK : "#F3F0FA", color: type === key ? "white" : INK }}
              >
                <Icon size={15} /> {TYPE_LABELS[key]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-3">
        <SectionLabel>{type === "audio" ? "Prompt (what to say before playing the clip)" : "Question / clue"}</SectionLabel>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={2}
          className="w-full rounded-lg px-3 py-2 outline-none resize-none"
          style={{ border: "1px solid #D8D2EA" }}
        />
      </div>

      <div className="mb-4">
        <SectionLabel>
          Answer{type === "letters" ? " (the letter hint is generated from this automatically)" : ""}
        </SectionLabel>
        <input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full rounded-lg px-3 py-2 outline-none"
          style={{ border: "1px solid #D8D2EA" }}
        />
      </div>

      <div className="flex gap-2">
        <BigButton
          size="md"
          tone="teal"
          disabled={!canSave}
          onClick={() =>
            onSave({
              id: initial?.id || uid(),
              category: category.trim(),
              points,
              type,
              prompt: prompt.trim(),
              answer: answer.trim(),
            })
          }
        >
          Save question
        </BigButton>
        <GhostButton onClick={onCancel}>Cancel</GhostButton>
      </div>
    </div>
  );
}
