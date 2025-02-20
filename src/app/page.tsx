"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const HomePage = () => {
  const [words, setWords] = useState<
    { id: string; wordText: string; meaning: string }[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // ✅ ローディング状態を追加

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const res = await fetch("/api/words");
        if (!res.ok) throw new Error("単語一覧の取得に失敗しました");
        const data = await res.json();

        setWords(
          data.map((word: any) => ({
            id: word.id,
            wordText:
              word.words.length > 0 ? word.words[0].wordText : "No Title",
            meaning:
              word.meanings.length > 0 ? word.meanings[0].meaning : "No Meanig",
          }))
        );
      } catch (error) {
        console.error("エラー:", error);
        setError("データの取得に失敗しました");
      } finally {
        setIsLoading(false); // ✅ データ取得完了時にローディングを解除
      }
    };

    fetchWords();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center text-gray-500">
        <FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin" />
        Loading...
      </div>
    );
  }

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <main className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Words</h1>
      <ul>
        <div className="rounded-lg border p-4 shadow-md">
          {words.map((word) => (
            <li key={word.id} className="mb-2">
              <Link
                href={`/dictionary/${word.id}`}
                className="text-blue-500 hover:underline"
              >
                {word.wordText}
              </Link>
              <p className="text-gray-700">Meaning: {word.meaning}</p>
            </li>
          ))}
        </div>
      </ul>
    </main>
  );
};

export default HomePage;
