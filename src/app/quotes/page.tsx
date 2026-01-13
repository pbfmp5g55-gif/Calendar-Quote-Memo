'use client';

import { useState, useEffect } from 'react';
import { Search, Tag, BookOpen, PenTool } from 'lucide-react';
import Link from 'next/link';

interface Quote {
    id: string;
    text: string;
    author: string;
    tags?: string | null;
}

export default function QuoteLibrary() {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    // Debounce search could be added, for now simple effect
    useEffect(() => {
        const fetchQuotes = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (search) params.set('search', search);

                const res = await fetch(`/api/quotes?${params.toString()}`);
                const data = await res.json();
                if (data.data) {
                    setQuotes(data.data);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchQuotes, 500);
        return () => clearTimeout(timer);
    }, [search]);

    return (
        <div className="min-h-screen p-6 md:p-10 max-w-5xl mx-auto">
            <header className="flex items-center justify-between mb-8">
                <div>
                    <Link href="/" className="text-sm font-bold text-primary hover:underline mb-2 block">
                        ← ホームに戻る
                    </Link>
                    <h1 className="text-3xl font-serif font-bold">名言ライブラリ</h1>
                    <p className="text-muted-foreground">過去の名言や偉人の言葉を探す</p>
                </div>
            </header>

            <div className="mb-8 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                    type="text"
                    placeholder="キーワード、偉人名で検索..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background/50 focus:ring-2 focus:ring-primary focus:outline-none transition-all shadow-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="text-center py-20 text-muted-foreground">読み込み中...</div>
            ) : quotes.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground bg-muted/30 rounded-xl border border-dashed border-border">
                    見つかりませんでした。
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {quotes.map(quote => (
                        <div key={quote.id} className="glass-card p-6 flex flex-col gap-4 hover:border-primary/30 transition-colors">
                            <p className="text-lg font-serif font-medium leading-relaxed">
                                {quote.text}
                            </p>
                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-dashed border-border/50">
                                <span className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                                    <PenTool className="w-4 h-4" />
                                    {quote.author}
                                </span>
                                {quote.tags && (
                                    <div className="flex gap-2">
                                        {quote.tags.split(',').map(t => (
                                            <span key={t} className="text-xs px-2 py-1 bg-secondary/10 text-secondary rounded-full flex items-center gap-1">
                                                <Tag className="w-3 h-3" />
                                                {t.trim()}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
