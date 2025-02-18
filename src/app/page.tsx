"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

// ✅ Supabase クライアントの作成
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type WordData = {
  id: string;
  words: { wordText: string; lang: string }[];
  coverImageUrl: string | null;
};

const DictionaryPage = () => {
  const [data, setData] = useState<WordData[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ Supabase から `words` テーブルのデータを取得
        const { data, error } = await supabase.from("words").select(`
            id,
            coverImageUrl,
            WordTranslation (wordText, lang)
          `);

        if (error) {
          throw new Error(`データの取得に失敗しました: ${error.message}`);
        }

        if (!data || data.length === 0) {
          throw new Error("取得したデータが空です");
        }

        // ✅ データを整形（word_translations を words に変換）
        const transformedData = data.map((word) => ({
          id: word.id,
          coverImageUrl: word.coverImageUrl,
          words: word.WordTranslation || [],
        }));

        setData(transformedData);
      } catch (e) {
        setFetchError(
          e instanceof Error ? e.message : "予期せぬエラーが発生しました"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (fetchError) {
    return <div className="text-red-500">{fetchError}</div>;
  }

  if (isLoading) {
    return (
      <div className="text-gray-500">
        <FontAwesomeIcon icon={faSpinner} className="mr-1 animate-spin" />
        Loading...
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <div className="text-red-500">データが取得できませんでした。</div>;
  }

  return (
    <main className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Dictionary</h1>

      {/* 単語一覧の表示 */}
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((word) => (
          <li key={word.id} className="rounded-lg border p-4 shadow-md">
            <h2 className="text-lg font-semibold">
              {word.words.find((w) => w.lang === "en")?.wordText || "No Data"}
            </h2>
            {word.coverImageUrl && (
              <img
                src={word.coverImageUrl}
                alt="Word Cover"
                className="mt-2 w-full rounded-md"
              />
            )}
            <Link
              href={`/dictionary/${word.id}`}
              className="mt-3 inline-block rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              View Details
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default DictionaryPage;
