import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { Word } from "@prisma/client";

export const revalidate = 0; // ◀ サーバサイドのキャッシュを無効化する設定

export const GET = async (req: NextRequest) => {
  try {
    const words: Word[] = await prisma.word.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        words: true,
        pronunciations: true,
        frequencies: true,
        categories: true,
        examples: true,
        meanings: true,
        inflections: true,
      },
    });
    return NextResponse.json(words);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "単語の取得に失敗しました" },
      { status: 500 }
    );
  }
};
