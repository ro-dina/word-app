"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const HomePage = () => {
  const [words, setWords] = useState<{ id: string; wordText: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const res = await fetch("/api/words"); // ✅ API から単語一覧を取得
        if (!res.ok) throw new Error("単語一覧の取得に失敗しました");
        const data = await res.json();

        // ✅ 単語データを `setWords` に格納
        setWords(
          data.map((word: any) => ({
            id: word.id,
            wordText:
              word.words.length > 0 ? word.words[0].wordText : "No Title",
          }))
        );
      } catch (error) {
        console.error("エラー:", error);
        setError("データの取得に失敗しました");
      }
    };

    fetchWords();
  }, []);

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <main className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Dictionary</h1>
      <ul>
        {words.map((word) => (
          <li key={word.id} className="mb-2">
            <Link
              href={`/dictionary/${word.id}`}
              className="text-blue-500 hover:underline"
            >
              {word.wordText}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default HomePage;
