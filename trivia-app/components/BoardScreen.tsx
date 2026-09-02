"use client";

import { useMemo, useState } from "react";
import { Home as HomeIcon, Settings } from "lucide-react";
import { GhostButton } from "./ui";
import { TeamManager } from "./TeamManager";
import { BoardGrid } from "./BoardGrid";
import { QuestionModal } from "./QuestionModal";
import type { BoardCell, Session } from "@/lib/types";

export function BoardScreen({
  session,
  setSession,
  onHome,
  onManage,
}: {
  session: Session;
  setSession: (updater: Session | ((prev: Session) => Session)) => void;
  onHome: () => void;
  onManage: () => void;
}) {
  const [activeCellKey, setActiveCellKey] = useState<string | null>(null);

  const categories = useMemo(() => {
    const seen: string[] = [];
    session.board.forEach((c) => {
      if (!seen.includes(c.category)) seen.push(c.category);
    });
    return seen;
  }, [session.board]);

  const activeCell: BoardCell | undefined = activeCellKey
    ? session.board.find((c) => `${c.category}-${c.points}` === activeCellKey)
    : undefined;

  const openCell = (cell: BoardCell) => setActiveCellKey(`${cell.category}-${cell.points}`);

  const closeCell = (markUsed: boolean, teamId: string | null) => {
    setSession((prev) => {
      let teams = prev.teams;
      if (teamId) {
        const cell = prev.board.find((c) => `${c.category}-${c.points}` === activeCellKey);
        teams = prev.teams.map((t) => (t.id === teamId ? { ...t, score: t.score + (cell ? cell.points : 0) } : t));
      }
      const board = prev.board.map((c) =>
        `${c.category}-${c.points}` === activeCellKey ? { ...c, used: markUsed } : c
      );
      return { ...prev, teams, board };
    });
    setActiveCellKey(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-fredoka)", color: "#332D4B" }}>
          {session.gameTitle}
        </h2>
        <div className="flex flex-wrap gap-2">
          <GhostButton onClick={onHome} icon={HomeIcon}>Home</GhostButton>
          <GhostButton onClick={onManage} icon={Settings}>Questions</GhostButton>
        </div>
      </div>

      <TeamManager teams={session.teams} onChange={(teams) => setSession((prev) => ({ ...prev, teams }))} />

      <div className="mt-6">
        <BoardGrid board={session.board} categories={categories} onOpenCell={openCell} />
      </div>

      {activeCell && activeCell.question && (
        <QuestionModal
          cell={activeCell}
          categoryIndex={categories.indexOf(activeCell.category)}
          teams={session.teams}
          onClose={() => closeCell(false, null)}
          onResolve={(teamId) => closeCell(true, teamId)}
        />
      )}
    </div>
  );
}
