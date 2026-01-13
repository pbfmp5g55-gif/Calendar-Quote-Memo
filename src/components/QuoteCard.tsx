'use client';

import { useState, useEffect } from 'react';
import { Loader2, BookOpen, Quote as QuoteIcon } from 'lucide-react';
import { motion } from 'framer-motion';

// Define minimal interface to avoid prisma import in client if types not shared easily
interface QuoteData {
    id: string;
    text: string;
    author: string;
    episode_short?: string | null;
    [key: string]: any;
}

interface QuoteCardProps {
    onOpenDetail: (quote: QuoteData) => void;
    refreshKey?: number;
}

export default function QuoteCard({ onOpenDetail, refreshKey }: QuoteCardProps) {
    const [quote, setQuote] = useState<QuoteData | null>(null);
    const [loading, setLoading] = useState(true);

    const [lang, setLang] = useState<'ja' | 'en'>('ja');

    useEffect(() => {
        setLoading(true);
        fetch('/api/quotes/today')
            .then((res) => {
                if (!res.ok) throw new Error("Failed");
                return res.json();
            })
            .then((data) => setQuote(data))
            .catch((e) => console.error(e))
            .finally(() => setLoading(false));
    }, [refreshKey]);

    if (loading) {
        return (
            <div className="glass-card w-full h-64 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
            </div>
        );
    }

    if (!quote) return null;

    // Helper to get text based on lang
    const displayText = lang === 'ja' ? quote.text : (quote.text_en || quote.text);
    const displayEpisodeShort = lang === 'ja' ? quote.episode_short : (quote.episode_short_en || quote.episode_short);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-5 md:p-8 flex flex-col items-center text-center relative overflow-hidden w-full max-w-4xl mx-auto border-t-4 border-t-primary/50"
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

            <div className="absolute top-4 right-4 z-20">
                <button
                    onClick={() => setLang(l => l === 'ja' ? 'en' : 'ja')}
                    className="text-xs font-medium px-2 py-1 rounded-full bg-muted/50 hover:bg-muted transition-colors border border-white/10"
                >
                    {lang === 'ja' ? 'EN' : 'JP'}
                </button>
            </div>

            <QuoteIcon className="w-12 h-12 text-primary/10 absolute top-6 left-6 -scale-x-100" />

            <motion.div
                key={lang} // Key change triggers animation
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <p className="text-base md:text-xl xl:text-2xl font-serif font-medium leading-relaxed max-w-3xl relative z-10 text-foreground/90">
                    {displayText}
                </p>
            </motion.div>

            <div className="mt-6 flex flex-col items-center gap-3">
                <span className="text-base text-primary font-semibold tracking-wide">— {quote.author}</span>

                {displayEpisodeShort && (
                    <motion.div
                        key={`ep-${lang}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-xs text-muted-foreground bg-muted/30 px-3 py-1 rounded-full border border-white/5 backdrop-blur-sm"
                    >
                        💡 {displayEpisodeShort}
                    </motion.div>
                )}
            </div>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onOpenDetail(quote)}
                className="mt-8 px-8 py-3 rounded-full bg-secondary/10 hover:bg-secondary/20 text-secondary-foreground border border-secondary/20 transition-all text-sm font-medium flex items-center gap-2 group backdrop-blur-md"
            >
                <BookOpen className="w-4 h-4 text-secondary group-hover:text-secondary-foreground transition-colors" />
                <span className="text-secondary group-hover:text-secondary-foreground">エピソード & コメント</span>
            </motion.button>
        </motion.div>
    );
}
