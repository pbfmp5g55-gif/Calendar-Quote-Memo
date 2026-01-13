import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ date: string }> }
) {
    const params = await props.params;
    const session = await auth();
    // GETはログインしてなくてもカレンダー上のメモ詳細を見たい？
    // いや、プライベートなメモなのでログイン必須にすべき
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dateStr = params.date;
    if (!dateStr) {
        return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    const date = new Date(dateStr);

    try {
        const memo = await prisma.memo.findFirst({
            where: {
                date: date,
                userId: session.user.id
            },
        });

        if (!memo) {
            return NextResponse.json({ error: 'Memo not found' }, { status: 404 });
        }

        return NextResponse.json(memo);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(
    request: NextRequest,
    props: { params: Promise<{ date: string }> }
) {
    const params = await props.params;
    const session = await auth();
    console.log("DEBUG: POST /api/memos session:", JSON.stringify(session, null, 2));

    if (!session?.user?.id) {
        console.log("DEBUG: Unauthorized access attempt. Session or user ID missing.");
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dateStr = params.date;
    const body = await request.json();
    const { content } = body;
    const date = new Date(dateStr);
    const userId = session.user.id;

    if (!content || content.trim() === '') {
        await prisma.memo.deleteMany({
            where: {
                date: date,
                userId: userId
            }
        });
        return NextResponse.json({ message: 'Deleted empty memo' });
    }

    try {
        const existingMemo = await prisma.memo.findFirst({
            where: { date, userId }
        });

        let memo;
        if (existingMemo) {
            memo = await prisma.memo.update({
                where: { id: existingMemo.id },
                data: { content }
            });
        } else {
            memo = await prisma.memo.create({
                data: {
                    date,
                    content,
                    userId
                }
            });
        }
        return NextResponse.json(memo);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ date: string }> }
) {
    const params = await props.params;
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dateStr = params.date;
    const date = new Date(dateStr);

    try {
        await prisma.memo.deleteMany({
            where: {
                date: date,
                userId: session.user.id
            }
        });
        return NextResponse.json({ message: 'Deleted' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
