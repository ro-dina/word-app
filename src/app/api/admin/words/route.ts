import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/utils/supabase";

type RequestBody = {
  coverImageUrl: string;
  coverImageWidth: number;
  coverImageHeight: number;
  words: { text: string; lang: string }[];
  pronunciations: { text: string; lang: string }[];
  frequencies: { frequency: number; lang: string }[];
  categoryIds: string[];
  examples: { sentence: string; lang: string }[];
  meanings: { meaning: string; lang: string }[];
  inflections: { form: string; lang: string }[];
};

// 単語一覧取得 API
export const GET = async () => {
  try {
    const words = await prisma.word.findMany({
      include: {
        words: true, // 各言語の単語情報
      },
    });

    return NextResponse.json(words);
  } catch (error) {
    console.error("🚨 単語一覧の取得に失敗:", error);
    return NextResponse.json(
      { error: "単語一覧の取得に失敗しました" },
      { status: 500 }
    );
  }
};

export const POST = async (req: NextRequest) => {
  // JWTトークンの検証・認証 (失敗したら 401 Unauthorized を返す)
  const token = req.headers.get("Authorization") ?? "";
  const { data, error } = await supabase.auth.getUser(token);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 401 });

  try {
    const body: RequestBody = await req.json();

    const {
      coverImageUrl,
      coverImageWidth,
      coverImageHeight,
      words,
      pronunciations,
      frequencies,
      categoryIds = [],
      examples,
      meanings,
      inflections,
    } = body;

    console.log("📩 受け取ったデータ:", JSON.stringify(body, null, 2));

    // カテゴリの存在チェック
    if (!Array.isArray(categoryIds)) {
      return NextResponse.json(
        { error: "カテゴリIDが不正です" },
        { status: 400 }
      );
    }

    const categories = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
    });

    if (categories.length !== categoryIds.length) {
      return NextResponse.json(
        { error: "指定されたカテゴリのいくつかが存在しません" },
        { status: 400 } // 400: Bad Request
      );
    }

    // Word を作成
    const word = await prisma.word.create({
      data: {
        coverImageUrl,
        coverImageWidth,
        coverImageHeight,
        words: {
          create: words.map((word) => ({
            wordText: word.text, // 🔽 `text` を `wordText` に変換
            lang: word.lang,
          })),
        },
        pronunciations: {
          create: pronunciations.map((pron) => ({
            text: pron.text,
            lang: pron.lang,
          })),
        },
        frequencies: {
          create: frequencies.map((freq) => ({
            frequency: freq.frequency,
            lang: freq.lang,
          })),
        },
        examples: {
          create: examples.map((example) => ({
            sentence: example.sentence,
            lang: example.lang,
          })),
        },
        meanings: {
          create: meanings.map((meaning) => ({
            meaning: meaning.meaning,
            lang: meaning.lang,
          })),
        },
        inflections: {
          create: inflections.map((inflection) => ({
            form: inflection.form,
            lang: inflection.lang,
          })),
        },
        categories: {
          create: categoryIds.map((categoryId) => ({
            category: { connect: { id: categoryId } }, // 🔽 カテゴリを適切に関連付ける
          })),
        },
      },
      include: {
        words: true,
        pronunciations: true,
        frequencies: true,
        examples: true,
        meanings: true,
        inflections: true,
        categories: { include: { category: true } },
      },
    });

    return NextResponse.json(word);
  } catch (error) {
    console.error("🚨 エラー詳細:", error);
    return NextResponse.json(
      { error: "単語の作成に失敗しました", details: String(error) },
      { status: 500 }
    );
  }
};
