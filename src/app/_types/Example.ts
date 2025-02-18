import { LanguageCode } from "./Words";

export type Example = {
  id: string;
  sentence: Record<LanguageCode, string>;
};
