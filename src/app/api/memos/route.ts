import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    if (!from || !to) {
        return NextResponse.json({ error: 'Missing from/to parameters' }, { status: 400 });
    }

    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json([]); // ログインしていなければメモは表示しない
    }

    try {
        const memos = await prisma.memo.findMany({
            where: {
                userId: session.user.id,
                date: {
                    gte: new Date(from),
                    lte: new Date(to),
                },
            },
            select: {
                date: true,
                // we can select id to mark "has memo"
                id: true,
            }
        });

        // Return list of dates that have memos, or full objects if needed.
        // UI just needs "dot" or similar, but maybe content for tooltip.
        // Let's return minimal data + content for preview.
        return NextResponse.json(memos);
    } catch (error) {
        console.error('Error fetching memos:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
