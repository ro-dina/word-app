"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/app/_hooks/useAuth"; // ✅ useAuth をインポート

const NewWordPage: React.FC = () => {
  const { token } = useAuth(); // ✅ トークンの取得

  const [wordList, setWordList] = useState<
    { id: string; words: { wordText: string; lang: string }[] }[]
  >([]);

  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [coverImageWidth, setCoverImageWidth] = useState<number | "">("");
  const [coverImageHeight, setCoverImageHeight] = useState<number | "">("");

  const languages = ["en", "ja", "de", "ru"];

  const [words, setWords] = useState(languages.map(() => ""));
  const [pronunciations, setPronunciations] = useState(languages.map(() => ""));
  const [frequencies, setFrequencies] = useState<(string | number)[]>(
    languages.map(() => "")
  );
  const [meanings, setMeanings] = useState(languages.map(() => ""));
  const [examples, setExamples] = useState(languages.map(() => ""));
  const [inflections, setInflections] = useState(languages.map(() => ""));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token) {
      window.alert("予期せぬ動作：トークンが取得できません。");
      return;
    }

    const formData = {
      coverImageUrl,
      coverImageWidth: Number(coverImageWidth) || 0,
      coverImageHeight: Number(coverImageHeight) || 0,
      words: languages
        .map((lang, i) => ({
          text: words[i],
          lang,
        }))
        .filter((w) => w.text.trim() !== ""),
      pronunciations: languages.map((lang, i) => ({
        text: pronunciations[i],
        lang,
      })),
      frequencies: languages.map((lang, i) => ({
        frequency: Number(frequencies[i]) || 0,
        lang,
      })),
      meanings: languages.map((lang, i) => ({
        meaning: meanings[i],
        lang,
      })),
      examples: languages.map((lang, i) => ({
        sentence: examples[i],
        lang,
      })),
      inflections: languages.map((lang, i) => ({
        form: inflections[i],
        lang,
      })),
    };

    console.log("🚀 送信データ:", formData);

    try {
      const res = await fetch("/api/admin/words", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token, // ✅ トークンを追加
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("単語の作成に失敗しました");

      alert("単語が作成されました");
    } catch (error) {
      console.error("🚨 エラー:", error);
    }
  };

  // 単語一覧を取得する
  useEffect(() => {
    const fetchWords = async () => {
      try {
        const res = await fetch("/api/admin/words", { cache: "no-store" });
        if (!res.ok) throw new Error("単語一覧の取得に失敗しました");
        const data = await res.json();
        setWordList(data);
      } catch (error) {
        console.error("🚨 単語一覧の取得エラー:", error);
      }
    };

    fetchWords();
  }, []);

  useEffect(() => {
    console.log("🚀 取得したトークン:", token);
  }, [token]);

  return (
    <main className="p-4">
      <h1 className="mb-4 text-2xl font-bold">単語の追加</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          画像URL:
          <input
            type="text"
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
            className="w-full border p-2"
          />
        </label>

        <div className="flex space-x-2">
          <label>
            画像サイズ (幅):
            <input
              type="number"
              value={coverImageWidth}
              onChange={(e) =>
                setCoverImageWidth(parseInt(e.target.value, 10) || "")
              }
              className="w-full border p-2"
            />
          </label>
          <label>
            画像サイズ (高さ):
            <input
              type="number"
              value={coverImageHeight}
              onChange={(e) =>
                setCoverImageHeight(parseInt(e.target.value, 10) || "")
              }
              className="w-full border p-2"
            />
          </label>
        </div>

        <h2 className="text-xl font-bold">単語情報</h2>
        {languages.map((lang, index) => (
          <div key={lang} className="mb-4 border p-4">
            <h3 className="font-bold uppercase">{lang}</h3>

            <label className="block">
              単語:
              <input
                type="text"
                value={words[index]}
                onChange={(e) =>
                  setWords(
                    words.map((w, i) => (i === index ? e.target.value : w))
                  )
                }
                className="w-full border p-2"
              />
            </label>

            <label className="block">
              発音:
              <input
                type="text"
                value={pronunciations[index]}
                onChange={(e) =>
                  setPronunciations(
                    pronunciations.map((p, i) =>
                      i === index ? e.target.value : p
                    )
                  )
                }
                className="w-full border p-2"
              />
            </label>

            <label className="block">
              使用頻度:
              <input
                type="number"
                value={frequencies[index]}
                onChange={(e) =>
                  setFrequencies(
                    frequencies.map((f, i) =>
                      i === index ? Number(e.target.value) || 0 : f
                    )
                  )
                }
                className="w-full border p-2"
              />
            </label>

            <label className="block">
              意味:
              <input
                type="text"
                value={meanings[index]}
                onChange={(e) =>
                  setMeanings(
                    meanings.map((m, i) => (i === index ? e.target.value : m))
                  )
                }
                className="w-full border p-2"
              />
            </label>
          </div>
        ))}

        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white"
        >
          単語を追加
        </button>

        {/*単語の一覧表示 */}
        <h2 className="mt-8 text-xl font-bold">単語一覧</h2>
        {wordList.length === 0 ? (
          <p>単語がありません</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {wordList.map((word) => (
              <li key={word.id} className="rounded-md border p-2">
                <Link
                  href={`/admin/words/${word.id}`}
                  className="text-blue-500 hover:underline"
                >
                  {word.words.find((w) => w.lang === "en")?.wordText ||
                    "(名称未設定)"}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </form>
    </main>
  );
};

export default NewWordPage;
