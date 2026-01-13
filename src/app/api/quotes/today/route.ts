import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { startOfDay } from 'date-fns';

export async function GET() {
    // Use UTC midnight or local midnight?
    // Server runs in some timezone. User is local.
    // Ideally client sends timezone or we stick to UTC.
    // "date" in DB is DateTime.
    // For simplicity MVP: Use server's start of day. 
    // Better: Client should request with timezone, but "Today's Quote" usually implies Server Time or Universal Time for consistency across users if shared.
    // Given specs: "Same quote for the day".
    // Let's use UTC midnight.

    const now = new Date();
    const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

    try {
        const daily = await prisma.dailyQuote.findUnique({
            where: { date: today },
            include: { quote: true },
        });

        if (daily) {
            return NextResponse.json(daily.quote);
        }

        // Pick random
        const count = await prisma.quote.count();

        if (count === 0) {
            return NextResponse.json({
                id: 'default',
                text: '名言がまだ登録されていません。',
                author: 'システム',
                episode: 'データベースに名言を追加してください。',
                source_title: null,
                source_url: null,
            });
        }

        const skip = Math.floor(Math.random() * count);
        const randomQuote = await prisma.quote.findFirst({
            skip: skip,
        });

        if (!randomQuote) {
            return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
        }

        // Save as daily
        await prisma.dailyQuote.create({
            data: {
                date: today,
                quoteId: randomQuote.id,
            },
        }).catch(async (e) => {
            // If race condition (already created by another request), just ignore
            // and fetch it.
        });

        return NextResponse.json(randomQuote);

    } catch (error) {
        console.error('Error getting daily quote:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
