// Simple localStorage-backed persistence.
// Safe to call during SSR (Next.js renders on the server first) — always
// guarded with a `typeof window` check, and callers should only read from
// this inside a useEffect (i.e. after the component has mounted on the
// client) to avoid a server/client hydration mismatch.

export function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveJSON<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can fail (private browsing, quota). Failing silently just
    // means the change won't survive a refresh — not worth interrupting
    // the host mid-game over.
  }
}
