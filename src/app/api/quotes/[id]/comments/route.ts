import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const quoteId = params.id;
    const session = await auth();
    const userId = session?.user?.id;

    try {
        const comments = await prisma.quoteComment.findMany({
            where: {
                quoteId,
                deletedAt: null,
                OR: [
                    { isPublic: true },
                    { userId: userId || 'NO_USER_MATCH' } // 自分の投稿
                ]
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(comments);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const quoteId = params.id;

    try {
        const body = await request.json();
        const { content, isPublic } = body;

        if (!content || typeof content !== 'string' || content.trim().length === 0) {
            return NextResponse.json({ error: 'Content required' }, { status: 400 });
        }

        const comment = await prisma.quoteComment.create({
            data: {
                quoteId,
                content,
                isPublic: !!isPublic, // Boolean変換
            }
        });

        return NextResponse.json(comment);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
