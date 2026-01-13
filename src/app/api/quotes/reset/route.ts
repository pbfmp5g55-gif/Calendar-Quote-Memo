import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST() {
    try {
        await prisma.dailyQuote.deleteMany();
        await prisma.quoteComment.deleteMany();
        await prisma.quote.deleteMany();
        return NextResponse.json({ message: 'Reset successful' });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Reset failed' }, { status: 500 });
    }
}
