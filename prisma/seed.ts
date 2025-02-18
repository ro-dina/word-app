import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // **カテゴリの作成**
  const noun = await prisma.category.create({ data: { name: "noun" } });
  const verb = await prisma.category.create({ data: { name: "verb" } });

  // **単語の作成**
  const run = await prisma.word.create({
    data: {
      coverImageUrl: "https://example.com/run.png",
      coverImageWidth: 400,
      coverImageHeight: 373,
      words: {
        create: [
          { wordText: "run", lang: "en" },
          { wordText: "走る", lang: "ja" },
          { wordText: "rennen", lang: "de" },
          { wordText: "бегать", lang: "ru" },
        ],
      },
      pronunciations: {
        create: [
          { text: "rʌn", lang: "en" },
          { text: "はしる", lang: "ja" },
          { text: "ʁɛnən", lang: "de" },
          { text: "ˈbʲeɡətʲ", lang: "ru" },
        ],
      },
      frequencies: {
        create: [
          { frequency: 90, lang: "en" },
          { frequency: 85, lang: "ja" },
          { frequency: 75, lang: "de" },
          { frequency: 70, lang: "ru" },
        ],
      },
      meanings: {
        create: [
          { meaning: "To move quickly", lang: "en" },
          { meaning: "To manage a company", lang: "en" },
          { meaning: "走る", lang: "ja" },
          { meaning: "経営する", lang: "ja" },
        ],
      },
      inflections: {
        create: [
          { form: "running", lang: "en" },
          { form: "ran", lang: "en" },
          { form: "бегаю", lang: "ru" },
          { form: "бегаешь", lang: "ru" },
        ],
      },
      examples: {
        create: [
          { sentence: "I run every morning.", lang: "en" },
          { sentence: "私は毎朝走る。", lang: "ja" },
          { sentence: "Ich renne jeden Morgen.", lang: "de" },
          { sentence: "Я бегаю каждое утро.", lang: "ru" },
        ],
      },
      categories: {
        create: [{ category: { connect: { id: verb.id } } }],
      },
    },
  });

  console.log("✅ Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
