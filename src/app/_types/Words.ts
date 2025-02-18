import { Category } from "./Category";
import { CoverImage } from "./CoverImage";
import { Example } from "./Example";

export type LanguageCode = "en" | "ja" | "de" | "ru";

export type Inflection = {
  base: string;
  variations: string[];
};

export type Meaning = {
  baseWord: string;
  translations: Record<LanguageCode, string[]>;
};

export type WordData = {
  id: string;
  words: Record<LanguageCode, string[]>; // 各言語ごとの単語
  pronunciation: Record<LanguageCode, string>; // 発音
  frequency: Record<LanguageCode, number>; // 言語ごとに頻度を管理
  inflections: Record<LanguageCode, Inflection[]>;
  meanings?: Meaning[];
  categories: Category[];
  example: Example[];
  coverImage: CoverImage;
};

export type Dictionary = WordData[];
