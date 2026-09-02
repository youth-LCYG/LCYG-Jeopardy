"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Shuffle, RotateCcw } from "lucide-react";
import { BANK_KEY, DEFAULT_SESSION, POINT_TIERS, SAMPLE_QUESTIONS, SESSION_KEY } from "@/lib/constants";
import { loadJSON, saveJSON } from "@/lib/storage";
import { GhostButton } from "./ui";
import { HomeScreen } from "./HomeScreen";
import { SetupScreen } from "./SetupScreen";
import { BoardScreen } from "./BoardScreen";
import { ManageQuestions } from "./ManageQuestions";
import type { BoardCell, Question, Screen, Session, Team } from "@/lib/types";

export function TriviaApp() {
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState<Screen>("home");
  const [bank, setBank] = useState<Question[]>([]);
  const [session, setSession] = useState<Session>(DEFAULT_SESSION);

  // Initial load — runs once, client-side only, after mount. This reads
  // from localStorage (an external store) to hydrate state that must start
  // identical on server and client, so a one-time post-mount effect is the
  // correct tool here rather than computing it during render.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const loadedBank = loadJSON<Question[] | null>(BANK_KEY, null);
    const loadedSession = loadJSON<Session | null>(SESSION_KEY, null);

    const resolvedBank = loadedBank && loadedBank.length > 0 ? loadedBank : SAMPLE_QUESTIONS;
    if (!(loadedBank && loadedBank.length > 0)) {
      saveJSON(BANK_KEY, SAMPLE_QUESTIONS);
    }
    setBank(resolvedBank);

    const bankCategories: string[] = [];
    resolvedBank.forEach((q) => {
      if (!bankCategories.includes(q.category)) bankCategories.push(q.category);
    });

    if (loadedSession) {
      const needsDefaultCategories = !loadedSession.selectedCategories || loadedSession.selectedCategories.length === 0;
      setSession(needsDefaultCategories ? { ...loadedSession, selectedCategories: bankCategories } : loadedSession);
      if (loadedSession.board && loadedSession.board.length > 0) {
        setScreen("board");
      }
    } else {
      setSession({ ...DEFAULT_SESSION, selectedCategories: bankCategories });
    }
    setLoading(false);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Debounced session persistence.
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (loading) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveJSON(SESSION_KEY, session), 400);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [session, loading]);

  const categories = useMemo(() => {
    const seen: string[] = [];
    bank.forEach((q) => {
      if (!seen.includes(q.category)) seen.push(q.category);
    });
    return seen;
  }, [bank]);

  const buildBoard = useCallback((cats: string[], currentBank: Question[]): BoardCell[] => {
    const board: BoardCell[] = [];
    cats.forEach((cat) => {
      POINT_TIERS.forEach((pts) => {
        const candidates = currentBank.filter((q) => q.category === cat && q.points === pts);
        const question = candidates.length > 0 ? candidates[Math.floor(Math.random() * candidates.length)] : null;
        board.push({ category: cat, points: pts, question, used: false });
      });
    });
    return board;
  }, []);

  const startGame = () => {
    setSession((prev) => ({ ...prev, board: buildBoard(prev.selectedCategories, bank) }));
    setScreen("board");
  };

  const reshuffleBoard = () => {
    setSession((prev) => ({
      ...prev,
      board: buildBoard(prev.selectedCategories.length ? prev.selectedCategories : categories, bank),
    }));
  };

  const newGame = () => {
    setSession((prev) => ({
      ...prev,
      teams: prev.teams.map((t) => ({ ...t, score: 0 })),
      board: buildBoard(prev.selectedCategories.length ? prev.selectedCategories : categories, bank),
    }));
  };

  const setSelectedCategories = (updater: string[] | ((prev: string[]) => string[])) => {
    setSession((prev) => ({
      ...prev,
      selectedCategories: typeof updater === "function" ? updater(prev.selectedCategories) : updater,
    }));
  };
  const setTeams = (teams: Team[]) => setSession((prev) => ({ ...prev, teams }));

  const addQuestion = (q: Question) => {
    const updated = [...bank, q];
    setBank(updated);
    saveJSON(BANK_KEY, updated);
  };
  const updateQuestion = (q: Question) => {
    const updated = bank.map((b) => (b.id === q.id ? q : b));
    setBank(updated);
    saveJSON(BANK_KEY, updated);
  };
  const deleteQuestion = (id: string) => {
    const updated = bank.filter((b) => b.id !== id);
    setBank(updated);
    saveJSON(BANK_KEY, updated);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-sm font-semibold" style={{ color: "#8A81A6" }}>Loading…</div>
      </div>
    );
  }

  if (screen === "home") {
    return (
      <HomeScreen
        gameTitle={session.gameTitle}
        bankSize={bank.length}
        onPlay={() => setScreen("setup")}
        onManage={() => setScreen("manage")}
      />
    );
  }

  if (screen === "setup") {
    return (
      <SetupScreen
        teams={session.teams}
        setTeams={setTeams}
        categories={categories}
        selectedCategories={session.selectedCategories}
        setSelectedCategories={setSelectedCategories}
        bank={bank}
        onBack={() => setScreen("home")}
        onStart={startGame}
      />
    );
  }

  if (screen === "board") {
    return (
      <>
        <BoardScreen session={session} setSession={setSession} onHome={() => setScreen("home")} onManage={() => setScreen("manage")} />
        <div className="flex justify-center gap-2 pb-8">
          <GhostButton onClick={reshuffleBoard} icon={Shuffle}>New board</GhostButton>
          <GhostButton onClick={newGame} icon={RotateCcw}>New game (reset scores)</GhostButton>
        </div>
      </>
    );
  }

  // screen === "manage"
  return (
    <div className="max-w-3xl mx-auto px-5 py-8">
      <GhostButton onClick={() => setScreen(session.board.length ? "board" : "home")} icon={ArrowLeft}>Back</GhostButton>
      <h2 className="text-3xl font-bold mt-5 mb-6" style={{ fontFamily: "var(--font-fredoka)", color: "#332D4B" }}>
        Manage questions
      </h2>
      <ManageQuestions bank={bank} categories={categories} onAdd={addQuestion} onUpdate={updateQuestion} onDelete={deleteQuestion} />
    </div>
  );
}
