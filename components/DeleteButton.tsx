"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

export function DeleteButton({ onConfirm }: { onConfirm: () => void }) {
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!confirming) return;
    const t = setTimeout(() => setConfirming(false), 2500);
    return () => clearTimeout(t);
  }, [confirming]);

  return confirming ? (
    <button
      onClick={onConfirm}
      className="text-xs font-bold px-2 py-1 rounded-lg"
      style={{ backgroundColor: "#FF6B7A", color: "white" }}
    >
      Confirm?
    </button>
  ) : (
    <button onClick={() => setConfirming(true)} aria-label="Delete" style={{ color: "#C6BFE0" }}>
      <Trash2 size={16} />
    </button>
  );
}
