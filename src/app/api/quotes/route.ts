import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const tag = searchParams.get('tag') || '';

    const skip = (page - 1) * limit;

    try {
        const where: any = {};

        if (search) {
            where.OR = [
                { text: { contains: search } }, // sqlite contains is case-sensitive usually? Prisma handles it?
                { author: { contains: search } },
            ];
        }

        if (tag) {
            // Filter by tag stored in comma-separated string or JSON. 
            // For MVP (string):
            where.tags = { contains: tag };
        }

        const [quotes, total] = await prisma.$transaction([
            prisma.quote.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.quote.count({ where }),
        ]);

        return NextResponse.json({
            data: quotes,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        });

    } catch (error) {
        console.error('Error fetching quotes:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    // Simple admin endpoint to add quotes via API if seed fails
    try {
        const body = await request.json();
        const quote = await prisma.quote.create({
            data: {
                text: body.text,
                text_en: body.text_en,
                author: body.author,
                episode: body.episode,
                episode_en: body.episode_en,
                episode_short: body.episode_short,
                episode_short_en: body.episode_short_en,
                source_title: body.source_title,
                source_url: body.source_url,
                tags: body.tags,
            }
        });
        return NextResponse.json(quote);
    } catch (e: any) {
        console.error('Failed to create quote:', e);
        return NextResponse.json({ error: 'Failed to create', details: e.message }, { status: 500 });
    }
}
