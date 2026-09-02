"use client";

import { useRef, useState } from "react";
import { Music } from "lucide-react";
import { GhostButton } from "./ui";

export function AudioPicker() {
  const [url, setUrl] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setUrl(URL.createObjectURL(file));
      setName(file.name);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 py-2">
      <input ref={inputRef} type="file" accept="audio/*" onChange={handleChange} style={{ display: "none" }} />
      <GhostButton onClick={() => inputRef.current?.click()} icon={Music}>
        {name ? "Choose a different clip" : "Choose audio to play"}
      </GhostButton>
      {name && <div className="text-xs" style={{ color: "#8A81A6" }}>{name}</div>}
      {url && <audio controls autoPlay src={url} style={{ width: "100%", maxWidth: 360 }} />}
    </div>
  );
}
