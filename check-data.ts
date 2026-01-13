import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const count = await prisma.quote.count()
    console.log(`Total quotes: ${count}`)
    if (count > 0) {
        const quotes = await prisma.quote.findMany({ take: 5 })
        console.log('Sample quotes:')
        console.log(JSON.stringify(quotes, null, 2))
    } else {
        console.log('No quotes found in the database.')
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
