const Database = require('better-sqlite3')
const path = require('path')

const dbPath = path.join(__dirname, '..', 'dev.db')
const db = new Database(dbPath)

async function main() {
    // Check if quotes already exist
    const count = db.prepare('SELECT COUNT(*) as count FROM Quote').get()

    if (count.count > 0) {
        console.log(`Database already has ${count.count} quotes. Skipping seed.`)
        return
    }

    const insert = db.prepare(`
        INSERT INTO Quote (id, author, text, episode, episode_short, source_title, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `)

    const quotes = [
        {
            id: crypto.randomUUID(),
            author: 'Albert Einstein',
            text: 'Life is like riding a bicycle. To keep your balance, you must keep moving.',
            episode: 'In a letter to his son Eduard in 1930, Einstein used this metaphor to explain how to navigate the ups and downs of life.',
            episode_short: 'A letter to his son in 1930.',
            source_title: 'Letter to Eduard Einstein',
        },
        {
            id: crypto.randomUUID(),
            author: 'Steve Jobs',
            text: 'The only way to do great work is to love what you do. If you haven\'t found it yet, keep looking. Don\'t settle.',
            episode: 'Delivered during his 2005 Stanford Commencement Address, reflecting on his career and life philosophy.',
            episode_short: 'Stanford Commencement Address 2005',
            source_title: 'Stanford Commencement Address',
        },
        {
            id: crypto.randomUUID(),
            author: 'Nietzsche',
            text: 'He who has a why to live can bear almost any how.',
            episode: 'From "Twilight of the Idols". It emphasizes the power of purpose in overcoming suffering.',
            episode_short: 'Twilight of the Idols',
            source_title: 'Twilight of the Idols',
        },
        {
            id: crypto.randomUUID(),
            author: '吉田松陰',
            text: '夢なき者に理想なし、理想なき者に計画なし、計画なき者に実行なし、実行なき者に成功なし。故に、夢なき者に成功なし。',
            episode: '幕末の思想家、吉田松陰が弟子たちに説いた言葉として知られる。目標を持つことの重要性を説いている。',
            episode_short: '弟子たちへ説いた言葉',
            source_title: '伝承',
        }
    ]

    const insertMany = db.transaction((quotes) => {
        for (const quote of quotes) {
            insert.run(
                quote.id,
                quote.author,
                quote.text,
                quote.episode,
                quote.episode_short,
                quote.source_title,
                new Date().toISOString()
            )
        }
    })

    insertMany(quotes)
    console.log('Seeded quotes successfully!')
    db.close()
}

main()
    .then(() => {
        console.log('Seed completed')
        process.exit(0)
    })
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
