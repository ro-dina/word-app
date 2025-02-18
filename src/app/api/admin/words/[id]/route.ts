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
    const body = await req.json();

    const updatedWord = await prisma.word.update({
      where: { id: params.id },
      data: {
        coverImageUrl: body.coverImageUrl,
        coverImageWidth: body.coverImageWidth,
        coverImageHeight: body.coverImageHeight,
        words: { deleteMany: {}, create: body.words },
        pronunciations: { deleteMany: {}, create: body.pronunciations },
        frequencies: { deleteMany: {}, create: body.frequencies },
        meanings: { deleteMany: {}, create: body.meanings },
        examples: { deleteMany: {}, create: body.examples },
        inflections: { deleteMany: {}, create: body.inflections },
        categories: {
          deleteMany: {},
          create: body.categoryIds.map((categoryId: string) => ({
            category: { connect: { id: categoryId } },
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

    return NextResponse.json(updatedWord);
  } catch (error) {
    console.error("🚨 単語の更新エラー:", error);
    return NextResponse.json(
      { error: "単語の更新に失敗しました" },
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
