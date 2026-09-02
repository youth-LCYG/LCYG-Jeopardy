"use client";

import { Play, Settings, Sparkles } from "lucide-react";
import { PALETTE, INK } from "@/lib/constants";
import { BigButton } from "./ui";

export function HomeScreen({
  gameTitle,
  bankSize,
  onPlay,
  onManage,
}: {
  gameTitle: string;
  bankSize: number;
  onPlay: () => void;
  onManage: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
      <div className="mb-2" style={{ animation: "pop-in 0.5s ease-out" }}>
        <Sparkles size={36} style={{ color: PALETTE[3].bg }} />
      </div>
      <h1
        className="text-5xl sm:text-6xl font-bold mb-3"
        style={{
          fontFamily: "var(--font-fredoka)",
          color: INK,
          textShadow: `4px 4px 0 ${PALETTE[3].bg}33`,
          animation: "pop-in 0.6s ease-out",
        }}
      >
        {gameTitle}
      </h1>
      <p className="mb-10 text-base" style={{ color: "#8A81A6" }}>
        {bankSize} question{bankSize === 1 ? "" : "s"} in the bank, ready to go.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <BigButton onClick={onPlay} tone="coral" icon={Play}>Start a game</BigButton>
        <BigButton onClick={onManage} tone="ink" icon={Settings}>Manage questions</BigButton>
      </div>
    </div>
  );
}
