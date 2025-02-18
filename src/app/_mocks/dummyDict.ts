import { WordData } from "@/app/_types/Words";

export const mockData: WordData[] = [
  // 🍎 Apple (名詞)
  {
    id: "1",
    words: {
      en: ["apple"],
      ja: ["りんご"],
      de: ["Apfel"],
      ru: ["яблоко"],
    },
    pronunciation: {
      en: "ˈæp.l̩",
      ja: "りんご",
      de: "ˈapfəl",
      ru: "ˈjab.ləkə",
    },
    frequency: {
      en: 85,
      ja: 90,
      de: 80,
      ru: 60,
    },
    inflections: {
      en: [{ base: "apple", variations: ["apples"] }],
      ja: [],
      de: [],
      ru: [{ base: "яблоко", variations: ["яблоки", "яблоком", "яблоках"] }],
    },
    meanings: [
      {
        baseWord: "apple",
        translations: {
          en: ["A fruit that is often red or green", "An edible fruit"],
          ja: ["リンゴ"],
          de: ["Apfel"],
          ru: ["яблоко"],
        },
      },
    ],
    categories: [
      {
        id: "1",
        name: {
          en: "Noun",
          ja: "名詞",
          de: "Substantiv",
          ru: "Существительное",
        },
      },
    ],
    example: [
      {
        id: "1",
        sentence: {
          en: "I eat an apple.",
          ja: "私はりんごを食べます。",
          de: "Ich esse einen Apfel.",
          ru: "Я ем яблоко.",
        },
      },
    ],
    coverImage: { url: "/apple.jpg", width: 200, height: 200 },
  },

  // 🐶 Dog (名詞)
  {
    id: "2",
    words: {
      en: ["dog"],
      ja: ["犬"],
      de: ["Hund"],
      ru: ["собака"],
    },
    pronunciation: {
      en: "dɔɡ",
      ja: "いぬ",
      de: "hʊnt",
      ru: "sɐˈbakə",
    },
    frequency: {
      en: 95,
      ja: 88,
      de: 85,
      ru: 75,
    },
    inflections: {
      en: [{ base: "dog", variations: ["dogs"] }],
      ja: [],
      de: [],
      ru: [{ base: "собака", variations: ["собаки", "собаке", "собаку"] }],
    },
    meanings: [
      {
        baseWord: "dog",
        translations: {
          en: ["A domesticated animal", "A four-legged pet"],
          ja: ["飼いならされた動物", "四本足のペット"],
          de: ["Ein domestiziertes Tier", "Ein vierbeiniges Haustier"],
          ru: ["Домашнее животное", "Четырехногий питомец"],
        },
      },
    ],
    categories: [
      {
        id: "2",
        name: {
          en: "Noun",
          ja: "名詞",
          de: "Substantiv",
          ru: "Существительное",
        },
      },
    ],
    example: [
      {
        id: "1",
        sentence: {
          en: "The dog is barking.",
          ja: "犬が吠えている。",
          de: "Der Hund bellt.",
          ru: "Собака лает.",
        },
      },
    ],
    coverImage: { url: "/dog.jpg", width: 200, height: 200 },
  },

  // 🏃 Run (動詞)
  {
    id: "3",
    words: {
      en: ["run"],
      ja: ["走る", "経営する"],
      de: ["rennen", "laufen"],
      ru: ["бегать", "бежать"],
    },
    pronunciation: {
      en: "rʌn",
      ja: "はしる",
      de: "ˈʁɛnən",
      ru: "ˈbʲeɡətʲ",
    },
    frequency: {
      en: 90,
      ja: 85,
      de: 75,
      ru: 70,
    },
    inflections: {
      en: [{ base: "run", variations: ["running", "ran"] }],
      ja: [],
      de: [],
      ru: [{ base: "бегать", variations: ["бегаю", "бегаешь", "бегает"] }],
    },
    meanings: [
      {
        baseWord: "run",
        translations: {
          en: ["To move quickly", "To manage a company"],
          ja: ["速く移動する", "会社を経営する"],
          de: ["schnell bewegen", "ein Unternehmen führen"],
          ru: ["бегать", "управлять компанией"],
        },
      },
      {
        baseWord: "rennen",
        translations: {
          en: ["To run fast"],
          ja: ["速く走る"],
          de: ["rennen"],
          ru: ["бежать"],
        },
      },
    ],
    categories: [
      { id: "3", name: { en: "Verb", ja: "動詞", de: "Verb", ru: "Глагол" } },
    ],
    example: [
      {
        id: "1",
        sentence: {
          en: "I run every morning.",
          ja: "私は毎朝走る。",
          de: "Ich renne jeden Morgen.",
          ru: "Я бегаю каждое утро.",
        },
      },
    ],
    coverImage: { url: "/run.jpg", width: 200, height: 200 },
  },
];
