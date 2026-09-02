"use client";

import { useState } from "react";
import { Plus, X, Pencil } from "lucide-react";
import { colorFor, INK } from "@/lib/constants";
import type { Team } from "@/lib/types";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function TeamCard({
  team,
  index,
  onRename,
  onScoreChange,
  onRemove,
  removable,
}: {
  team: Team;
  index: number;
  onRename: (id: string, name: string) => void;
  onScoreChange: (id: string, score: number) => void;
  onRemove: (id: string) => void;
  removable: boolean;
}) {
  const [editingName, setEditingName] = useState(false);
  const [editingScore, setEditingScore] = useState(false);
  const [draftName, setDraftName] = useState(team.name);
  const [draftScore, setDraftScore] = useState(String(team.score));
  const c = colorFor(index);

  const startEditingName = () => {
    setDraftName(team.name);
    setEditingName(true);
  };
  const startEditingScore = () => {
    setDraftScore(String(team.score));
    setEditingScore(true);
  };

  return (
    <div
      className="relative rounded-2xl p-4 flex flex-col items-center gap-1 shadow-sm"
      style={{ backgroundColor: c.soft, border: `2px solid ${c.bg}` }}
    >
      {removable && (
        <button
          onClick={() => onRemove(team.id)}
          className="absolute -top-2 -right-2 rounded-full p-1 shadow"
          style={{ backgroundColor: INK }}
          aria-label={`Remove ${team.name}`}
        >
          <X size={13} color="white" />
        </button>
      )}

      {editingName ? (
        <input
          autoFocus
          value={draftName}
          onChange={(e) => setDraftName(e.target.value)}
          onBlur={() => {
            setEditingName(false);
            onRename(team.id, draftName.trim() || team.name);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
          }}
          className="w-full text-center font-bold text-base rounded-lg px-2 py-1 outline-none"
          style={{ color: INK, border: `1px solid ${c.deep}` }}
        />
      ) : (
        <button
          onClick={startEditingName}
          className="font-bold text-base flex items-center gap-1 max-w-full"
          style={{ color: INK }}
          title="Tap to rename"
        >
          <span className="truncate">{team.name}</span>
          <Pencil size={12} style={{ opacity: 0.5, flexShrink: 0 }} />
        </button>
      )}

      {editingScore ? (
        <input
          autoFocus
          type="number"
          value={draftScore}
          onChange={(e) => setDraftScore(e.target.value)}
          onBlur={() => {
            setEditingScore(false);
            const n = parseInt(draftScore, 10);
            onScoreChange(team.id, isNaN(n) ? team.score : n);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
          }}
          className="w-24 text-center text-3xl font-bold rounded-lg outline-none"
          style={{ fontFamily: "var(--font-fredoka)", color: c.deep, border: `1px solid ${c.deep}` }}
        />
      ) : (
        <button
          onClick={startEditingScore}
          className="text-3xl font-bold tabular-nums"
          style={{ fontFamily: "var(--font-fredoka)", color: c.deep }}
          title="Tap to edit score"
        >
          {team.score}
        </button>
      )}
    </div>
  );
}

export function TeamManager({ teams, onChange }: { teams: Team[]; onChange: (teams: Team[]) => void }) {
  const addTeam = () => {
    if (teams.length >= 24) return;
    onChange([...teams, { id: uid(), name: `Team ${teams.length + 1}`, score: 0 }]);
  };
  const removeTeam = (id: string) => onChange(teams.filter((t) => t.id !== id));
  const renameTeam = (id: string, name: string) => onChange(teams.map((t) => (t.id === id ? { ...t, name } : t)));
  const scoreTeam = (id: string, score: number) => onChange(teams.map((t) => (t.id === id ? { ...t, score } : t)));

  return (
    <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(128px, 1fr))" }}>
      {teams.map((t, i) => (
        <TeamCard
          key={t.id}
          team={t}
          index={i}
          onRename={renameTeam}
          onScoreChange={scoreTeam}
          onRemove={removeTeam}
          removable={teams.length > 1}
        />
      ))}
      <button
        onClick={addTeam}
        className="rounded-2xl flex flex-col items-center justify-center gap-1 py-4 border-2 border-dashed transition-colors hover:bg-white/60"
        style={{ borderColor: "#D8D2EA", color: "#8A81A6", minHeight: "84px" }}
      >
        <Plus size={20} />
        <span className="text-xs font-semibold">Add team</span>
      </button>
    </div>
  );
}
