"use client";

import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { PALETTE, INK } from "@/lib/constants";

export function colorForTone(tone: string) {
  if (tone === "ink") return { name: "ink", bg: INK, deep: "#221E33", soft: "#E5E1F0" };
  return PALETTE.find((p) => p.name === tone) ?? PALETTE[0];
}

export function BigButton({
  onClick,
  children,
  tone = "coral",
  icon: Icon,
  disabled,
  size = "lg",
}: {
  onClick?: () => void;
  children: ReactNode;
  tone?: string;
  icon?: LucideIcon;
  disabled?: boolean;
  size?: "lg" | "md";
}) {
  const c = colorForTone(tone);
  const pad = size === "lg" ? "px-8 py-5 text-xl" : "px-5 py-3 text-base";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl font-bold text-white transition-transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-md ${pad}`}
      style={{ backgroundColor: c.bg, fontFamily: "var(--font-fredoka)" }}
    >
      {Icon && <Icon size={size === "lg" ? 22 : 18} />}
      {children}
    </button>
  );
}

export function GhostButton({
  onClick,
  children,
  icon: Icon,
}: {
  onClick?: () => void;
  children: ReactNode;
  icon?: LucideIcon;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors active:scale-95"
      style={{ color: INK, backgroundColor: "rgba(51,45,75,0.06)" }}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="text-sm font-semibold mb-2 tracking-wide" style={{ color: "#8A81A6" }}>
      {children}
    </div>
  );
}
