
const quotes = [
    {
        text: "ハングリーであれ。愚かであれ。",
        text_en: "Stay hungry, stay foolish.",
        author: "Steve Jobs",
        episode: "スティーブ・ジョブズがスタンフォード大学の卒業式で行ったスピーチの締めくくりの言葉。",
        episode_en: "The concluding remarks of Steve Jobs' speech at Stanford University's graduation ceremony.",
        episode_short: "スタンフォード大スピーチ",
        episode_short_en: "Stanford Commencement",
        tags: "inspiration,life",
    },
    {
        text: "すばらしい仕事をする唯一の方法は、自分のやっていることを愛することだ。",
        text_en: "The only way to do great work is to love what you do.",
        author: "Steve Jobs",
        episode: "仕事への情熱の重要性を説いた言葉。",
        episode_en: "A quote emphasizing the importance of passion for one's work.",
        episode_short: "仕事について",
        episode_short_en: "On Work",
        tags: "work,passion",
    },
    {
        text: "人生は自転車に乗るようなものだ。バランスを保つには動き続けなければならない。",
        text_en: "Life is like riding a bicycle. To keep your balance, you must keep moving.",
        author: "Albert Einstein",
        episode: "人生における前進し続けることの重要性を説いたアインシュタインの言葉。",
        episode_en: "Einstein's words on the importance of keeping moving forward in life.",
        episode_short: "人生のバランス",
        episode_short_en: "Life Balance",
        tags: "life,balance",
    },
    {
        text: "何事も成功するまでは不可能に思えるものだ。",
        text_en: "It always seems impossible until it's done.",
        author: "Nelson Mandela",
        episode: "困難な状況でも諦めずに挑戦し続けることの大切さを伝えています。",
        episode_en: "Conveys the importance of continuing to challenge without giving up even in difficult situations.",
        episode_short: "不可能なこと",
        episode_short_en: "Impossible Things",
        tags: "motivation,perseverance",
    },
    {
        text: "自分ならできると信じれば、半分は終わったようなものだ。",
        text_en: "Believe you can and you're halfway there.",
        author: "Theodore Roosevelt",
        episode: "自信を持つことが成功への第一歩であるという教え。",
        episode_en: "The teaching that having confidence is the first step to success.",
        episode_short: "自信について",
        episode_short_en: "On Confidence",
        tags: "confidence,success",
    },
    {
        text: "最大の名誉は決して倒れないことではない。倒れるたびに起き上がることである。",
        text_en: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
        author: "Nelson Mandela",
        episode: "失敗を恐れず、何度でも立ち上がる強さを持つことの重要性を説いています。",
        episode_en: "Emphasizes the importance of having the strength to stand up again and again without fearing failure.",
        episode_short: "不屈の精神",
        episode_short_en: "Resilience",
        tags: "resilience,failure",
    }
];

async function seed() {
    console.log("Starting API-based seed...");

    // First, reset database
    try {
        console.log("Resetting database...");
        await fetch('http://localhost:3000/api/quotes/reset', { method: 'POST' });
        console.log("Database reset complete.");
    } catch (e) {
        console.warn("Reset failed or API not ready:", e.message);
    }

    for (const q of quotes) {
        try {
            const res = await fetch('http://localhost:3000/api/quotes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(q)
            });
            if (res.ok) {
                console.log(`Success: Added quote by ${q.author}`);
            } else {
                console.error(`Failed to add quote by ${q.author}: ${res.statusText}`);
                const err = await res.json();
                console.error(err);
            }
        } catch (e) {
            console.error(`Error connecting to server: ${e.message}`);
            process.exit(1);
        }
    }
    console.log("Seed completed!");
}

seed();
