import { LanguageCode } from "./Words";

export type Category = {
  id: string;
  name: Record<LanguageCode, string>; // 各言語でのカテゴリ名
};
