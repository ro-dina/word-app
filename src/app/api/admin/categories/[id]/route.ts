import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

type RequestBody = {
  name: string;
};

// ✅ 【カテゴリを更新】PUTリクエスト
export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { name }: RequestBody = await req.json();

    const updatedCategory = await prisma.category.update({
      where: { id: params.id },
      data: { name },
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("カテゴリの更新に失敗しました:", error);
    return NextResponse.json(
      { error: "カテゴリの更新に失敗しました" },
      { status: 500 }
    );
  }
};

// ✅ 【カテゴリを削除】DELETEリクエスト
export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await prisma.category.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "カテゴリを削除しました" });
  } catch (error) {
    console.error("カテゴリの削除に失敗しました:", error);
    return NextResponse.json(
      { error: "カテゴリの削除に失敗しました" },
      { status: 500 }
    );
  }
};
