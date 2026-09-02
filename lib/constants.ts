import type { Question, Session } from "./types";

export const POINT_TIERS = [100, 200, 300, 400, 500] as const;

export const PALETTE = [
  { name: "coral", bg: "#FF6B7A", deep: "#E14F60", soft: "#FFE3E6" },
  { name: "teal", bg: "#33B7A6", deep: "#1F9A8B", soft: "#DEF7F3" },
  { name: "sky", bg: "#4EA8DE", deep: "#2F86BE", soft: "#E2F1FC" },
  { name: "gold", bg: "#FFB020", deep: "#E0951A", soft: "#FFF1D6" },
  { name: "violet", bg: "#9B7FD4", deep: "#7C5FB8", soft: "#EEE7FA" },
  { name: "pink", bg: "#FF7FAE", deep: "#E15C8E", soft: "#FFE6EF" },
] as const;

export const INK = "#332D4B";
export const CREAM = "#FFFBF2";

export function colorFor(index: number) {
  return PALETTE[((index % PALETTE.length) + PALETTE.length) % PALETTE.length];
}

export const TYPE_LABELS: Record<Question["type"], string> = {
  text: "Text",
  letters: "Letter Hint",
  audio: "Audio Clip",
};

export const SAMPLE_QUESTIONS: Question[] = [
  { id: "s1", category: "Bible Basics", points: 100, type: "text", prompt: "How many books are in the New Testament?", answer: "27" },
  { id: "s2", category: "Bible Basics", points: 200, type: "letters", prompt: "This judge in the book of Judges was famous for his incredible strength — and his hair.", answer: "Samson" },
  { id: "s3", category: "Bible Basics", points: 300, type: "text", prompt: "Which sea did God part so the Israelites could escape Egypt?", answer: "The Red Sea" },
  { id: "s4", category: "Guess the Verse", points: 100, type: "text", prompt: "Complete Genesis 1:1 — \"In the beginning, God created the heavens and the ___.\"", answer: "Earth" },
  { id: "s5", category: "Guess the Verse", points: 200, type: "letters", prompt: "Psalm 23 begins, \"The Lord is my ___.\"", answer: "Shepherd" },
  { id: "s6", category: "Guess the Verse", points: 400, type: "text", prompt: "Name one book of the Bible that has only a single chapter.", answer: "Obadiah, Philemon, 2 John, 3 John, or Jude" },
  { id: "s7", category: "Youth Group Life", points: 100, type: "text", prompt: "What do we usually call our weekly gathering? (Edit this to match your group!)", answer: "Youth Group" },
  { id: "s8", category: "Youth Group Life", points: 200, type: "audio", prompt: "Name that worship song! Host, tap below to play a clip.", answer: "(depends on the song you pick live)" },
  { id: "s9", category: "Random & Fun", points: 100, type: "text", prompt: "What's the tallest animal in the world?", answer: "The giraffe" },
  { id: "s10", category: "Random & Fun", points: 300, type: "letters", prompt: "This yellow fruit is a great source of potassium.", answer: "Banana" },
];

export const DEFAULT_SESSION: Session = {
  gameTitle: "Trivia Showdown",
  teams: [
    { id: "t1", name: "Team 1", score: 0 },
    { id: "t2", name: "Team 2", score: 0 },
  ],
  selectedCategories: [],
  board: [],
};

export const BANK_KEY = "trivia-bank-v1";
export const SESSION_KEY = "trivia-session-v1";
