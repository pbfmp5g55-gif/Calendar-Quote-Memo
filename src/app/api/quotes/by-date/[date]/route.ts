import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { startOfDay } from 'date-fns';

export async function GET(
    request: Request,
    props: { params: Promise<{ date: string }> }
) {
    const params = await props.params;
    const { date } = params;

    try {
        // Parse date string (yyyy-MM-dd)
        const targetDate = new Date(date);
        if (isNaN(targetDate.getTime())) {
            return NextResponse.json({ error: 'Invalid date' }, { status: 400 });
        }

        // Use UTC midnight for consistency
        const utcDate = new Date(Date.UTC(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()));

        const daily = await prisma.dailyQuote.findUnique({
            where: { date: utcDate },
            include: { quote: true },
        });

        if (daily) {
            return NextResponse.json(daily.quote);
        }

        // If no quote assigned yet for this date, pick one randomly
        // (This ensures that even past or future dates have a quote if someone looks at them)
        const count = await prisma.quote.count();

        if (count === 0) {
            return NextResponse.json({
                id: 'default',
                text: '名言がまだ登録されていません。',
                author: 'システム',
                episode: 'データベースに名言を追加してください。',
                episode_short: '名言募集中',
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

        // Save as daily for this specific date
        try {
            await prisma.dailyQuote.create({
                data: {
                    date: utcDate,
                    quoteId: randomQuote.id,
                },
            });
        } catch (e) {
            // Race condition: someone else created it
            const existing = await prisma.dailyQuote.findUnique({
                where: { date: utcDate },
                include: { quote: true },
            });
            if (existing) return NextResponse.json(existing.quote);
        }

        return NextResponse.json(randomQuote);

    } catch (error) {
        console.error('Error getting quote by date:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
