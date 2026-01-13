
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// Manually load .env to ensure DATABASE_URL is set
try {
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf-8');
        envContent.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                let value = match[2].trim();
                if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.slice(1, -1);
                }
                process.env[key] = value;
            }
        });
    }
} catch (e) {
    console.warn('Failed to load .env manually', e);
}

// Fallback if still not set
if (!process.env.DATABASE_URL) {
    console.log('DATABASE_URL not found, using default fallback');
    process.env.DATABASE_URL = "file:./dev.db";
}

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "file:./dev.db"
        }
    }
});

const initialQuotes = [
    {
        text: "Stay hungry, stay foolish.",
        author: "Steve Jobs",
        episode: "スティーブ・ジョブズがスタンフォード大学の卒業式で行ったスピーチの締めくくりの言葉。",
        episode_short: "スタンフォード大スピーチ",
        tags: "inspiration,life",
    },
    {
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs",
        episode: "仕事への情熱の重要性を説いた言葉。",
        episode_short: "仕事について",
        tags: "work,passion",
    },
    {
        text: "Life is like riding a bicycle. To keep your balance, you must keep moving.",
        author: "Albert Einstein",
        episode: "人生における前進し続けることの重要性を説いたアインシュタインの言葉。",
        episode_short: "人生のバランス",
        tags: "life,balance",
    },
    {
        text: "It always seems impossible until it's done.",
        author: "Nelson Mandela",
        episode: "困難な状況でも諦めずに挑戦し続けることの大切さを伝えています。",
        episode_short: "不可能なこと",
        tags: "motivation,perseverance",
    },
    {
        text: "Believe you can and you're halfway there.",
        author: "Theodore Roosevelt",
        episode: "自信を持つことが成功への第一歩であるという教え。",
        episode_short: "自信について",
        tags: "confidence,success",
    }
];

async function main() {
    const count = await prisma.quote.count();
    console.log(`Current quote count: ${count}`);

    if (count === 0) {
        console.log('Seeding quotes...');
        for (const q of initialQuotes) {
            await prisma.quote.create({
                data: q
            });
        }
        console.log('Seeding completed.');
    } else {
        console.log('Quotes already exist. Skipping seed.');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
