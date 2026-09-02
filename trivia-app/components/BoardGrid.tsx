"use client";

import { Check } from "lucide-react";
import { colorFor, POINT_TIERS } from "@/lib/constants";
import type { BoardCell } from "@/lib/types";

export function BoardGrid({
  board,
  categories,
  onOpenCell,
}: {
  board: BoardCell[];
  categories: string[];
  onOpenCell: (cell: BoardCell) => void;
}) {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="grid gap-2 min-w-max" style={{ gridTemplateColumns: `repeat(${categories.length}, minmax(150px, 1fr))` }}>
        {categories.map((cat, i) => {
          const c = colorFor(i);
          return (
            <div
              key={cat}
              className="rounded-xl px-3 py-3 text-center font-bold text-white text-sm sm:text-base"
              style={{ backgroundColor: c.bg, fontFamily: "var(--font-fredoka)" }}
            >
              {cat}
            </div>
          );
        })}

        {POINT_TIERS.map((pts) =>
          categories.map((cat, ci) => {
            const cell = board.find((b) => b.category === cat && b.points === pts);
            const c = colorFor(ci);
            const empty = !cell || !cell.question;
            const used = cell?.used;
            return (
              <button
                key={`${cat}-${pts}`}
                disabled={empty || used}
                onClick={() => cell && onOpenCell(cell)}
                className="rounded-xl py-5 flex items-center justify-center font-bold text-xl sm:text-2xl transition-transform enabled:hover:-translate-y-0.5 enabled:active:scale-95 disabled:cursor-default"
                style={{
                  backgroundColor: used ? "#EDE9F7" : "white",
                  color: used ? "#C6BFE0" : empty ? "#C6BFE0" : c.deep,
                  border: `2px solid ${used ? "#EDE9F7" : empty ? "#EDE9F7" : c.bg}`,
                  fontFamily: "var(--font-fredoka)",
                  opacity: empty && !used ? 0.55 : 1,
                }}
              >
                {used ? <Check size={22} /> : empty ? <span className="text-xs font-semibold">—</span> : pts}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
