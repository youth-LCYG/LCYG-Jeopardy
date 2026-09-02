import { TriviaApp } from "@/components/TriviaApp";

export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #FFFBF2 0%, #FFF1F4 100%)",
      }}
    >
      <TriviaApp />
    </div>
  );
}
