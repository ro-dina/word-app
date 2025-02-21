import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

// 🔹 単語の詳細を取得
export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const word = await prisma.word.findUnique({
      where: { id: params.id },
      include: {
        words: true,
        pronunciations: true,
        frequencies: true,
        meanings: true,
        examples: true,
        inflections: true,
        categories: { include: { category: true } },
      },
    });

    if (!word) {
      return NextResponse.json(
        { error: "単語が見つかりません" },
        { status: 404 }
      );
    }

    return NextResponse.json(word);
  } catch (error) {
    console.error("🚨 単語の取得エラー:", error);
    return NextResponse.json(
      { error: "単語の取得に失敗しました" },
      { status: 500 }
    );
  }
};

// 🔹 単語を更新
export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    console.log("🔹 PUTリクエスト開始");
    console.log("🔹 params.id:", params.id);

    const body = await req.json();
    console.log("🔹 受け取ったデータ:", body);

    if (!body) {
      return NextResponse.json(
        { error: "リクエストボディが空です" },
        { status: 400 }
      );
    }

    const updatedWord = await prisma.word.update({
      where: { id: params.id },
      data: {
        coverImageUrl: body.coverImageUrl,
        coverImageWidth: body.coverImageWidth,
        coverImageHeight: body.coverImageHeight,

        words: {
          deleteMany: { id: { notIn: body.words.map((w: any) => w.id) } },
          upsert: body.words.map((w: any) => ({
            where: { id: w.id || "" },
            update: { wordText: w.wordText, lang: w.lang },
            create: { wordText: w.wordText, lang: w.lang },
          })),
        },

        pronunciations: {
          deleteMany: {
            id: { notIn: body.pronunciations.map((p: any) => p.id) },
          },
          upsert: body.pronunciations.map((p: any) => ({
            where: { id: p.id || "" },
            update: { text: p.text, lang: p.lang },
            create: { text: p.text, lang: p.lang },
          })),
        },

        frequencies: {
          deleteMany: { id: { notIn: body.frequencies.map((f: any) => f.id) } },
          upsert: body.frequencies.map((f: any) => ({
            where: { id: f.id || "" },
            update: { frequency: f.frequency, lang: f.lang },
            create: { frequency: f.frequency, lang: f.lang },
          })),
        },

        meanings: {
          deleteMany: { id: { notIn: body.meanings.map((m: any) => m.id) } },
          upsert: body.meanings.map((m: any) => ({
            where: { id: m.id || "" },
            update: { meaning: m.meaning, lang: m.lang },
            create: { meaning: m.meaning, lang: m.lang },
          })),
        },

        inflections: {
          deleteMany: { id: { notIn: body.inflections.map((i: any) => i.id) } },
          upsert: body.inflections.map((i: any) => ({
            where: { id: i.id || "" },
            update: { form: i.form, lang: i.lang },
            create: { form: i.form, lang: i.lang },
          })),
        },

        categories: {
          deleteMany: {},
          connect: (body.categoryIds ?? []).map((categoryId: string) => ({
            id: categoryId,
          })),
        },
      },
      include: {
        words: true,
        pronunciations: true,
        frequencies: true,
        meanings: true,
        examples: true,
        inflections: true,
        categories: { include: { category: true } },
      },
    });

    console.log("✅ 更新成功:", updatedWord);
    return NextResponse.json(updatedWord);
  } catch (error) {
    console.error("🚨 単語の更新エラー:", error);
    return NextResponse.json(
      { error: "単語の更新に失敗しました", details: String(error) },
      { status: 500 }
    );
  }
};

// 🔹 単語を削除
export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await prisma.word.delete({ where: { id: params.id } });

    return NextResponse.json({ message: "単語を削除しました" });
  } catch (error) {
    console.error("🚨 単語の削除エラー:", error);
    return NextResponse.json(
      { error: "単語の削除に失敗しました" },
      { status: 500 }
    );
  }
};
