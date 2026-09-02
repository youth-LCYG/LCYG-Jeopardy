"use client";

import { useMemo, useState } from "react";
import { Plus, Pencil } from "lucide-react";
import { FileText, Puzzle, Music } from "lucide-react";
import { INK } from "@/lib/constants";
import { BigButton } from "./ui";
import { QuestionForm } from "./QuestionForm";
import { DeleteButton } from "./DeleteButton";
import type { Question, QuestionType } from "@/lib/types";

const TYPE_ICONS: Record<QuestionType, typeof FileText> = {
  text: FileText,
  letters: Puzzle,
  audio: Music,
};

export function ManageQuestions({
  bank,
  onAdd,
  onUpdate,
  onDelete,
  categories,
}: {
  bank: Question[];
  onAdd: (q: Question) => void;
  onUpdate: (q: Question) => void;
  onDelete: (id: string) => void;
  categories: string[];
}) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const g: Record<string, Question[]> = {};
    bank.forEach((q) => {
      if (!g[q.category]) g[q.category] = [];
      g[q.category].push(q);
    });
    Object.values(g).forEach((arr) => arr.sort((a, b) => a.points - b.points));
    return g;
  }, [bank]);

  return (
    <div>
      {!adding ? (
        <BigButton size="md" tone="teal" icon={Plus} onClick={() => setAdding(true)}>
          Add new question
        </BigButton>
      ) : (
        <QuestionForm
          existingCategories={categories}
          onCancel={() => setAdding(false)}
          onSave={(q) => {
            onAdd(q);
            setAdding(false);
          }}
        />
      )}

      <div className="mt-6 space-y-6">
        {Object.keys(grouped).length === 0 && (
          <p className="text-sm" style={{ color: "#8A81A6" }}>
            No questions yet — add your first one above.
          </p>
        )}
        {Object.entries(grouped).map(([cat, qs]) => (
          <div key={cat}>
            <div className="font-bold text-sm mb-2" style={{ color: INK, fontFamily: "var(--font-fredoka)" }}>
              {cat}
            </div>
            <div className="space-y-1.5">
              {qs.map((q) => {
                const Icon = TYPE_ICONS[q.type];
                return editingId === q.id ? (
                  <QuestionForm
                    key={q.id}
                    initial={q}
                    existingCategories={categories}
                    onCancel={() => setEditingId(null)}
                    onSave={(updated) => {
                      onUpdate(updated);
                      setEditingId(null);
                    }}
                  />
                ) : (
                  <div key={q.id} className="flex items-center gap-3 rounded-xl px-3 py-2.5" style={{ backgroundColor: "white", border: "1px solid #EDE9F7" }}>
                    <div className="text-xs font-bold w-10 flex-shrink-0" style={{ color: "#8A81A6" }}>{q.points}</div>
                    <Icon size={15} style={{ color: "#8A81A6", flexShrink: 0 }} />
                    <div className="text-sm truncate flex-1" style={{ color: INK }}>{q.prompt}</div>
                    <button onClick={() => setEditingId(q.id)} aria-label="Edit" style={{ color: "#8A81A6", flexShrink: 0 }}>
                      <Pencil size={15} />
                    </button>
                    <DeleteButton onConfirm={() => onDelete(q.id)} />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
