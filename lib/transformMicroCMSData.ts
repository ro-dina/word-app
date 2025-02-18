import { WordData, LanguageCode } from "@/app/_types/Words"; // ✅ 型を統一

export const transformMicroCMSData = (apiResponse: any): WordData[] => {
  if (!apiResponse.contents || apiResponse.contents.length === 0) {
    console.warn("transformMicroCMSData: contents is empty");
    return [];
  }

  return apiResponse.contents.map((item: any) => ({
    id: item.id,
    coverImage: {
      url: item.coverImage?.url || "",
      width: item.coverImage?.width || 0,
      height: item.coverImage?.height || 0,
    },
    words: Object.fromEntries(
      (item.words?.[0]?.word || []).map((w: any) => [
        w.test_lang?.[0] || "unknown",
        w.test_word?.[0]?.words || "",
      ])
    ) as Record<LanguageCode, string>,
    pronunciation: Object.fromEntries(
      (item.pronunciations?.[0]?.pronunciations || []).map((p: any) => [
        p.test_lang?.[0] || "unknown",
        p.test_word?.[0]?.words || "",
      ])
    ) as Record<LanguageCode, string>,
    frequency: Object.fromEntries(
      (item.frequencies?.[0]?.frequencies || []).map((f: any) => [
        f.language?.[0] || "unknown",
        f.num?.[0]?.list_num || 0,
      ])
    ) as Record<LanguageCode, number>,
    meanings: Object.fromEntries(
      (item.meanings?.[0]?.definitions || []).map((m: any) => [
        m.test_lang?.[0] || "unknown",
        (m.test_word || []).map((def: any) => def.words || ""),
      ])
    ) as Record<LanguageCode, string[]>,
    inflections: Object.fromEntries(
      ["en", "ja", "de", "ru"].map((lang) => {
        const inflectionData = item.inflections?.[0]?.inflections?.find(
          (inf: any) => inf.test_lang?.[0] === lang
        );
        return [
          lang,
          inflectionData
            ? (inflectionData.test_word || []).map((v: any) => v.words || "")
            : [],
        ];
      })
    ) as Record<LanguageCode, string[]>, // ✅ `base` を削除し、変化形のみ配列として保持
    examples: Object.fromEntries(
      ["en", "ja", "de", "ru"].map((lang) => {
        const exampleData = item.example?.[0]?.example?.find(
          (ex: any) => ex.language?.[0] === lang
        );
        return [
          lang,
          exampleData
            ? (exampleData.example || []).map((e: any) => e.text || "")
            : [],
        ];
      })
    ) as Record<LanguageCode, string[]>,
    categories: item.categories?.map((cat: any) => cat.name) || [],
  }));
};
