"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const EditWordPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();

  const [wordData, setWordData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchWord = async () => {
      try {
        const res = await fetch(`/api/admin/words/${id}`);
        if (!res.ok) throw new Error("単語の取得に失敗しました");
        const data = await res.json();
        setWordData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWord();
  }, [id]);

  // 単純なフィールドの変更
  const handleChange = (field: string, value: string) => {
    setWordData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 配列データの更新（単語）
  const handleWordChange = (index: number, value: string) => {
    setWordData((prev: any) => {
      const updatedWords = [...prev.words];
      updatedWords[index].wordText = value;
      return { ...prev, words: updatedWords };
    });
  };

  const handlePronunciationChange = (index: number, value: string) => {
    setWordData((prev: any) => {
      const updatedPronunciations = [...prev.pronunciations];
      updatedPronunciations[index].text = value;
      return { ...prev, pronunciations: updatedPronunciations };
    });
  };

  const handleInflectionChange = (index: number, value: string) => {
    setWordData((prev: any) => {
      const updatedInflections = [...prev.inflections];
      updatedInflections[index].form = value;
      return { ...prev, inflections: updatedInflections };
    });
  };

  // 配列データの更新（意味）
  const handleMeaningChange = (index: number, value: string) => {
    setWordData((prev: any) => {
      const updatedMeanings = [...prev.meanings];
      updatedMeanings[index].meaning = value;
      return { ...prev, meanings: updatedMeanings };
    });
  };

  // 配列データの更新（使用頻度）
  const handleFrequencyChange = (index: number, value: number) => {
    setWordData((prev: any) => {
      const updatedFrequencies = [...prev.frequencies];
      updatedFrequencies[index].frequency = value;
      return { ...prev, frequencies: updatedFrequencies };
    });
  };

  // 更新処理
  const handleUpdate = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/words/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(wordData),
      });

      if (!res.ok) throw new Error("更新に失敗しました");

      alert("単語を更新しました");
      router.push("/admin/words");
    } catch (err: any) {
      alert("更新エラー: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("本当に削除しますか？")) return;

    try {
      const res = await fetch(`/api/admin/words/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("削除に失敗しました");

      alert("単語を削除しました");
      router.push("/admin/words/new");
    } catch (err: any) {
      alert("削除エラー: " + err.message);
    }
  };

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <main className="p-4">
      <h1 className="mb-4 text-2xl font-bold">単語の編集</h1>

      <div>
        <h2 className="text-xl font-bold">単語情報</h2>
        <label className="block">
          画像URL:
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={wordData.coverImageUrl}
            onChange={(e) => handleChange("coverImageUrl", e.target.value)}
          />
        </label>

        {/* 単語リスト */}
        <h3 className="mt-4 font-bold">📜 単語リスト</h3>
        <ul>
          {wordData.words.map((w: any, index: number) => (
            <li key={w.id}>
              {w.lang.toUpperCase()}:
              <input
                type="text"
                className="ml-2 p-1 border rounded"
                value={w.wordText}
                onChange={(e) => handleWordChange(index, e.target.value)}
              />
            </li>
          ))}
        </ul>

        {/* 発音 */}
        <h3 className="mt-4 font-bold">📜 発音</h3>
        <ul>
          {wordData.pronunciations.map((p: any, index: number) => (
            <li key={p.id}>
              {p.lang.toUpperCase()}:
              <input
                type="text"
                className="ml-2 p-1 border rounded"
                value={p.text}
                onChange={(e) =>
                  handlePronunciationChange(index, e.target.value)
                }
              />
            </li>
          ))}
        </ul>

        {/* 意味リスト */}
        <h3 className="mt-4 font-bold">📜 意味</h3>
        <ul>
          {wordData.meanings.map((m: any, index: number) => (
            <li key={m.id}>
              {m.lang.toUpperCase()}:
              <input
                type="text"
                className="ml-2 p-1 border rounded"
                value={m.meaning}
                onChange={(e) => handleMeaningChange(index, e.target.value)}
              />
            </li>
          ))}
        </ul>

        {/* 使用頻度 */}
        <h3 className="mt-4 font-bold">📜 使用頻度</h3>
        <ul>
          {wordData.frequencies.map((f: any, index: number) => (
            <li key={f.id}>
              {f.lang.toUpperCase()}:
              <input
                type="number"
                className="ml-2 p-1 border rounded"
                value={f.frequency}
                onChange={(e) =>
                  handleFrequencyChange(index, Number(e.target.value))
                }
              />
            </li>
          ))}
        </ul>

        {/* 活用形 */}
        <h3 className="mt-4 font-bold">📜 活用形</h3>
        <ul>
          {wordData.inflections.map((i: any, index: number) => (
            <li key={i.id}>
              {i.lang.toUpperCase()}:
              <input
                type="text"
                className="ml-2 p-1 border rounded"
                value={i.form}
                onChange={(e) => handleInflectionChange(index, e.target.value)}
              />
            </li>
          ))}
        </ul>

        <button
          className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
          onClick={handleUpdate}
          disabled={saving}
        >
          {saving ? "保存中..." : "保存"}
        </button>

        <button
          className="mt-4 ml-2 rounded bg-red-500 px-4 py-2 text-white"
          onClick={handleDelete}
        >
          削除
        </button>
      </div>
    </main>
  );
};

export default EditWordPage;
