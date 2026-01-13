import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const count = await prisma.quote.count();
    if (count > 0) return; // Don't seed if data exists

    await prisma.quote.createMany({
        data: [
            {
                author: 'Albert Einstein',
                text: 'Life is like riding a bicycle. To keep your balance, you must keep moving.',
                episode: 'In a letter to his son Eduard in 1930, Einstein used this metaphor to explain how to navigate the ups and downs of life.',
                episode_short: 'A letter to his son in 1930.',
                source_title: 'Letter to Eduard Einstein',
            },
            {
                author: 'Steve Jobs',
                text: 'The only way to do great work is to love what you do. If you haven\'t found it yet, keep looking. Don\'t settle.',
                episode: 'Delivered during his 2005 Stanford Commencement Address, reflecting on his career and life philosophy.',
                episode_short: 'Stanford Commencement Address 2005',
                source_title: 'Stanford Commencement Address',
            },
            {
                author: 'Nietzsche',
                text: 'He who has a why to live can bear almost any how.',
                episode: 'From "Twilight of the Idols". It emphasizes the power of purpose in overcoming suffering.',
                episode_short: 'Twilight of the Idols',
                source_title: 'Twilight of the Idols',
            },
            {
                author: '吉田松陰',
                text: '夢なき者に理想なし、理想なき者に計画なし、計画なき者に実行なし、実行なき者に成功なし。故に、夢なき者に成功なし。',
                episode: '幕末の思想家、吉田松陰が弟子たちに説いた言葉として知られる。目標を持つことの重要性を説いている。',
                episode_short: '弟子たちへ説いた言葉',
                source_title: '伝承',
            }
        ],
    })
    console.log('Seeded quotes');
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
