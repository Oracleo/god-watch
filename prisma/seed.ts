import { PrismaClient } from "@prisma/client";
import { QUOTES } from "../src/lib/quotes";
import { ACHIEVEMENT_DEFINITIONS } from "../src/lib/achievements";

const prisma = new PrismaClient();

/**
 * Seed script:
 *  - Seeds inspirational quotes
 *  - Seeds achievement badge definitions
 */
async function main() {
  console.log("🌱 Seeding God Watch database...");

  // Quotes — idempotent seeding by checking count.
  const existingQuotes = await prisma.quote.count();
  if (existingQuotes === 0) {
    for (const q of QUOTES) {
      await prisma.quote.create({ data: { text: q.text, author: q.author } });
    }
    console.log(`  ✅ Seeded ${QUOTES.length} quotes`);
  } else {
    console.log(`  ⏭  Quotes already seeded (${existingQuotes})`);
  }

  // Achievements — idempotent by key.
  for (const a of ACHIEVEMENT_DEFINITIONS) {
    await prisma.achievement.upsert({
      where: { key: a.key },
      update: {
        name: a.name,
        description: a.description,
        icon: a.icon,
        criteria: a.criteria as object,
      },
      create: {
        key: a.key,
        name: a.name,
        description: a.description,
        icon: a.icon,
        criteria: a.criteria as object,
      },
    });
  }
  console.log(`  ✅ Seeded ${ACHIEVEMENT_DEFINITIONS.length} achievements`);

  console.log("🎉 Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

