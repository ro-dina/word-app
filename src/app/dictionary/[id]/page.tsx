"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchMicroCMS } from "../../../../lib/fetchMicroCMS";
import { transformMicroCMSData } from "../../../../lib/transformMicroCMSData";
import { WordData, LanguageCode } from "@/app/_types/Words";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const availableLanguages: LanguageCode[] = ["en", "ja", "de", "ru"];

const WordDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [word, setWord] = useState<WordData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedLanguages, setSelectedLanguages] = useState<LanguageCode[]>([
    "en",
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          throw new Error("ID が指定されていません");
        }

        console.log(`Fetching data for ID: ${id}`);

        const response = await fetchMicroCMS(`words/${id}`);
        const transformedData = transformMicroCMSData({ contents: [response] });

        console.log("Fetched Data:", transformedData);

        if (!transformedData || transformedData.length === 0) {
          throw new Error("データが見つかりませんでした");
        }

        setWord(transformedData[0]);
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

  const toggleLanguage = (language: LanguageCode) => {
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

      <div className="mb-4 flex w-full justify-center"></div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {selectedLanguages.map((lang) => (
          <div key={lang} className="rounded-lg border p-4 shadow-md">
            <h2 className="text-xl font-semibold">
              {word.words[lang] || "No Data"}
            </h2>
            <p className="text-gray-700">
              Pronunciation: {word.pronunciation[lang] || "No Data"}
            </p>
            <p className="text-gray-700">
              Frequency:{" "}
              {word.frequency[lang] ? `${word.frequency[lang]}%` : "No Data"}
            </p>
            <p className="mt-2">
              <span className="font-bold">Categories:</span>{" "}
              {word.categories.length > 0
                ? word.categories.join(", ")
                : "No Categories"}
            </p>

            {word.inflections[lang]?.length > 0 && (
              <div>
                <h3 className="mt-2 text-base font-semibold">Inflections:</h3>
                <p>{word.inflections[lang].join(", ") || "No Variations"}</p>
              </div>
            )}
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
