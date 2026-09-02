const CHOSEONG = [
  "ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ",
  "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ",
];

/**
 * Given an answer, produce a letter-hint puzzle.
 * Korean answers -> 초성 (initial consonants) of each syllable.
 * English/Latin answers -> first letter of each word, remaining letters blanked.
 */
export function generateLetterHint(answer: string): string {
  const hasHangul = /[\uAC00-\uD7A3]/.test(answer || "");

  if (hasHangul) {
    return (answer || "")
      .split("")
      .map((ch) => {
        const code = ch.charCodeAt(0);
        if (code >= 0xac00 && code <= 0xd7a3) {
          const choIndex = Math.floor((code - 0xac00) / (21 * 28));
          return CHOSEONG[choIndex];
        }
        return ch;
      })
      .join("");
  }

  return (answer || "")
    .split(" ")
    .map((word) => {
      if (!word) return word;
      const first = word[0];
      const rest = word.slice(1).replace(/[A-Za-z]/g, "_");
      return first + rest;
    })
    .join(" ");
}
