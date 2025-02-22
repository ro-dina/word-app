"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const availableLanguages = ["en", "ja", "de", "ru"];

const WordDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [word, setWord] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["en"]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          throw new Error("ID が指定されていません");
        }

        console.log(`Fetching data for ID: ${id}`);

        const response = await fetch(`/api/admin/words/${id}`);
        if (!response.ok) {
          throw new Error(`データの取得に失敗しました (${response.status})`);
        }

        const data = await response.json();
        console.log("Fetched Data:", data);

        setWord(data);
      } catch (error) {
        setFetchError(
          error instanceof Error ? error.message : "不明なエラーが発生しました"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center text-gray-500">
        <FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin" />
        Loading...
      </div>
    );
  }

  if (fetchError) {
    return <div className="text-red-500">エラー: {fetchError}</div>;
  }

  if (!word) {
    return <div className="text-red-500">単語データが見つかりません</div>;
  }

  const toggleLanguage = (language: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(language)
        ? prev.filter((l) => l !== language)
        : [...prev, language]
    );
  };

  return (
    <main className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Word Details</h1>

      <div className="mb-4 flex flex-wrap gap-3">
        {availableLanguages.map((lang) => (
          <label key={lang} className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={selectedLanguages.includes(lang)}
              onChange={() => toggleLanguage(lang)}
            />
            {lang.toUpperCase()}
          </label>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {selectedLanguages.map((lang) => (
          <div key={lang} className="rounded-lg border p-4 shadow-md">
            <h2 className="text-xl font-semibold">
              {word.words.find((w: any) => w.lang === lang)?.wordText ||
                "No Data"}
            </h2>
            <p className="text-gray-700">
              発音:{" "}
              {word.pronunciations.find((p: any) => p.lang === lang)?.text ||
                "No Data"}
            </p>
            <p className="text-gray-700">
              使用頻度:{" "}
              {word.frequencies.find((f: any) => f.lang === lang)?.frequency ||
                "No Data"}
            </p>
            <p className="text-gray-700">
              意味:{" "}
              {word.meanings.find((m: any) => m.lang === lang)?.meaning ||
                "No Data"}
            </p>
            <p className="text-gray-700">
              例文:{" "}
              {word.examples.find((e: any) => e.lang === lang)?.sentence ||
                "No Data"}
            </p>
            <p className="text-gray-700">
              活用形:{" "}
              {word.inflections.find((i: any) => i.lang === lang)?.form ||
                "No Data"}
            </p>
            <p className="mt-2">
              <span className="font-bold">Categories:</span>{" "}
              {word.categories.length > 0
                ? word.categories.map((c: any) => c.category.name).join(", ")
                : "No Categories"}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={() => router.push("/")}
        className="mt-5 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Back
      </button>
    </main>
  );
};

export default WordDetailPage;
