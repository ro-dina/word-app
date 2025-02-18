"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faTriangleExclamation,
  faTrash,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { twMerge } from "tailwind-merge";
import { Category } from "@/app/_types/Category";
import Link from "next/link";

const primaryLanguage: "en" | "ja" | "de" | "ru" = "en";

// カテゴリをフェッチしたときのレスポンスのデータ型
type CategoryApiResponse = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

const Page: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchErrorMsg, setFetchErrorMsg] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryNameError, setNewCategoryNameError] = useState("");
  const [categories, setCategories] = useState<Category[] | null>(null);

  // 編集モード用のステート
  const [isEditing, setIsEditing] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");

  // カテゴリ一覧を取得
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/categories", {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        setCategories(null);
        throw new Error(`${res.status}: ${res.statusText}`);
      }

      const apiResBody = (await res.json()) as CategoryApiResponse[];
      setCategories(
        apiResBody.map((body) => ({
          id: body.id,
          name: { en: body.name, ja: body.name, de: body.name, ru: body.name },
        }))
      );
    } catch (error) {
      console.error(error);
      setFetchErrorMsg(
        error instanceof Error ? error.message : "予期せぬエラー"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // カテゴリの新規作成
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName }),
      });

      if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);

      setNewCategoryName("");
      fetchCategories();
    } catch (error) {
      console.error(error);
      window.alert("カテゴリの作成に失敗しました。");
    } finally {
      setIsSubmitting(false);
    }
  };

  // カテゴリの削除
  const handleDelete = async (categoryId: string) => {
    if (!window.confirm("本当に削除しますか？")) return;
    try {
      const res = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);

      fetchCategories();
    } catch (error) {
      console.error(error);
      window.alert("カテゴリの削除に失敗しました。");
    }
  };

  // 編集モードを開始
  const startEditing = (categoryId: string, categoryName: string) => {
    setIsEditing(true);
    setEditCategoryId(categoryId);
    setEditCategoryName(categoryName);
  };

  // 編集の確定
  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editCategoryId) return;
    try {
      const res = await fetch(`/api/admin/categories/${editCategoryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editCategoryName }),
      });

      if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);

      setIsEditing(false);
      setEditCategoryId(null);
      setEditCategoryName("");
      fetchCategories();
    } catch (error) {
      console.error(error);
      window.alert("カテゴリの編集に失敗しました。");
    }
  };

  if (isLoading) {
    return (
      <div className="text-gray-500">
        <FontAwesomeIcon icon={faSpinner} className="mr-1 animate-spin" />
        Loading...
      </div>
    );
  }

  if (!categories) {
    return <div className="text-red-500">{fetchErrorMsg}</div>;
  }

  return (
    <main>
      <div className="mb-4 text-2xl font-bold">カテゴリの管理</div>

      {/* カテゴリの新規作成 */}
      <form
        onSubmit={handleSubmit}
        className={twMerge("mb-4 space-y-4", isSubmitting && "opacity-50")}
      >
        <div className="space-y-1">
          <label htmlFor="name" className="block font-bold">
            新しいカテゴリの名前
          </label>
          <input
            type="text"
            id="name"
            className="w-full rounded-md border-2 px-2 py-1"
            placeholder="カテゴリ名を入力"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-md bg-indigo-500 px-5 py-1 font-bold text-white hover:bg-indigo-600"
            disabled={isSubmitting}
          >
            作成
          </button>
        </div>
      </form>

      {/* カテゴリ一覧 */}
      <div className="mb-2 text-2xl font-bold">カテゴリ一覧</div>
      {categories.length === 0 ? (
        <div className="text-gray-500">（カテゴリはありません）</div>
      ) : (
        <div className="space-y-2">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between rounded-md border p-2"
            >
              <span>{category.name[primaryLanguage]}</span>
              <div className="space-x-2">
                <button
                  className="text-blue-500"
                  onClick={() =>
                    startEditing(category.id, category.name[primaryLanguage])
                  }
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  className="text-red-500"
                  onClick={() => handleDelete(category.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 編集モーダル */}
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <form
            onSubmit={handleEditSubmit}
            className="rounded-md bg-white p-6 shadow-lg"
          >
            <div className="space-y-2">
              <label className="block font-bold">カテゴリ名を編集</label>
              <input
                type="text"
                className="w-full rounded-md border-2 px-2 py-1"
                value={editCategoryName}
                onChange={(e) => setEditCategoryName(e.target.value)}
                required
              />
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                type="submit"
                className="rounded-md bg-green-500 px-4 py-1 text-white hover:bg-green-600"
              >
                保存
              </button>
              <button
                type="button"
                className="rounded-md bg-gray-400 px-4 py-1 text-white hover:bg-gray-500"
                onClick={() => setIsEditing(false)}
              >
                キャンセル
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
};

export default Page;
