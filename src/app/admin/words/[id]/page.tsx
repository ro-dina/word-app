"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const EditWordPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();

  const [wordData, setWordData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        <p>画像URL: {wordData.coverImageUrl}</p>
        <p>
          画像サイズ: {wordData.coverImageWidth} x {wordData.coverImageHeight}
        </p>

        <h3 className="mt-4 font-bold">📜 単語リスト</h3>
        <ul>
          {wordData.words.map((w: any) => (
            <li key={w.id}>
              {w.lang.toUpperCase()}: {w.wordText}
            </li>
          ))}
        </ul>

        <h3 className="mt-4 font-bold">📜 発音</h3>
        <ul>
          {wordData.pronunciations.map((p: any) => (
            <li key={p.id}>
              {p.lang.toUpperCase()}: {p.text}
            </li>
          ))}
        </ul>

        <h3 className="mt-4 font-bold">📜 意味</h3>
        <ul>
          {wordData.meanings.map((m: any) => (
            <li key={m.id}>
              {m.lang.toUpperCase()}: {m.meaning}
            </li>
          ))}
        </ul>

        <h3 className="mt-4 font-bold">📜 使用頻度</h3>
        <ul>
          {wordData.frequencies.map((f: any) => (
            <li key={f.id}>
              {f.lang.toUpperCase()}: {f.frequency}
            </li>
          ))}
        </ul>

        <h3 className="mt-4 font-bold">📜 活用形</h3>
        <ul>
          {wordData.inflections.map((inf: any) => (
            <li key={inf.id}>
              {inf.lang.toUpperCase()}: {inf.form}
            </li>
          ))}
        </ul>

        <button
          className="mt-4 rounded bg-red-500 px-4 py-2 text-white"
          onClick={handleDelete}
        >
          削除
        </button>
      </div>
    </main>
  );
};

export default EditWordPage;
