"use client";

import { ArrowLeft, Play, Users } from "lucide-react";
import { colorFor } from "@/lib/constants";
import { BigButton, GhostButton, SectionLabel } from "./ui";
import { TeamManager } from "./TeamManager";
import type { Question, Team } from "@/lib/types";

export function SetupScreen({
  teams,
  setTeams,
  categories,
  selectedCategories,
  setSelectedCategories,
  bank,
  onBack,
  onStart,
}: {
  teams: Team[];
  setTeams: (teams: Team[]) => void;
  categories: string[];
  selectedCategories: string[];
  setSelectedCategories: (updater: string[] | ((prev: string[]) => string[])) => void;
  bank: Question[];
  onBack: () => void;
  onStart: () => void;
}) {
  const toggle = (cat: string) => {
    setSelectedCategories((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]));
  };
  const countFor = (cat: string) => bank.filter((q) => q.category === cat).length;
  const canStart = teams.length >= 1 && selectedCategories.length >= 1;

  return (
    <div className="max-w-3xl mx-auto px-5 py-8">
      <GhostButton onClick={onBack} icon={ArrowLeft}>Home</GhostButton>

      <h2 className="text-3xl font-bold mt-5 mb-1" style={{ fontFamily: "var(--font-fredoka)", color: "#332D4B" }}>
        Set up your game
      </h2>
      <p className="mb-6 text-sm" style={{ color: "#8A81A6" }}>Teams and categories can also be changed later, mid-game.</p>

      <div className="flex items-center gap-2 mb-3">
        <Users size={16} style={{ color: "#8A81A6" }} />
        <SectionLabel>Teams</SectionLabel>
      </div>
      <TeamManager teams={teams} onChange={setTeams} />

      <div className="mt-8 mb-3">
        <SectionLabel>Categories to play (pick at least one)</SectionLabel>
      </div>
      {categories.length === 0 ? (
        <p className="text-sm" style={{ color: "#8A81A6" }}>
          No categories yet. Add some questions first from the Manage Questions screen.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat, i) => {
            const active = selectedCategories.includes(cat);
            const c = colorFor(i);
            return (
              <button
                key={cat}
                onClick={() => toggle(cat)}
                className="rounded-xl px-4 py-2.5 font-semibold text-sm transition-colors"
                style={{ backgroundColor: active ? c.bg : "#F3F0FA", color: active ? "white" : "#332D4B" }}
              >
                {cat} <span style={{ opacity: 0.75 }}>· {countFor(cat)}</span>
              </button>
            );
          })}
        </div>
      )}

      <BigButton onClick={onStart} disabled={!canStart} tone="coral" icon={Play}>Start game</BigButton>
    </div>
  );
}
