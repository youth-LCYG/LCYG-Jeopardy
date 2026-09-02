export type QuestionType = "text" | "letters" | "audio";

export interface Question {
  id: string;
  category: string;
  points: number;
  type: QuestionType;
  prompt: string;
  answer: string;
}

export interface Team {
  id: string;
  name: string;
  score: number;
}

export interface BoardCell {
  category: string;
  points: number;
  question: Question | null;
  used: boolean;
}

export interface Session {
  gameTitle: string;
  teams: Team[];
  selectedCategories: string[];
  board: BoardCell[];
}

export type Screen = "home" | "setup" | "board" | "manage";
