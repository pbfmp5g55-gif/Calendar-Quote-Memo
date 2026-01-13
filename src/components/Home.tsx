'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CalendarView from './CalendarView';
import MemoModal from './MemoModal';
import QuoteCard from './QuoteCard';
import QuoteDetailModal from './QuoteDetailModal';
import AuthModal from './AuthModal';
import { Quote as QuoteIcon, LogIn, User as UserIcon } from 'lucide-react';
import { SignOut } from './AuthButtons';

interface HomeProps {
    user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    } | null;
}

export default function Home({ user }: HomeProps) {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isMemoOpen, setIsMemoOpen] = useState(false);
    const [selectedQuote, setSelectedQuote] = useState<any | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const handleDateSelect = (date: Date) => {
        if (!user) {
            setIsAuthModalOpen(true);
            return;
        }
        setSelectedDate(date);
        setIsMemoOpen(true);
    };

    const handleMemoSave = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <main className="min-h-screen p-4 md:p-10 max-w-7xl mx-auto flex flex-col gap-6 md:gap-10">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between py-2 gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-accent drop-shadow-sm font-serif">
                        Calendar Quote Memo
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        日々の記録と、偉人たちの言葉。
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-4 bg-muted/30 p-2 pl-4 rounded-full border border-white/10">
                            <div className="flex items-center gap-2">
                                {user.image ? (
                                    <img src={user.image} alt={user.name || "User"} className="w-8 h-8 rounded-full" />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                        <UserIcon className="w-4 h-4 text-primary" />
                                    </div>
                                )}
                                <span className="text-sm font-medium hidden sm:inline">{user.name}</span>
                            </div>
                            <SignOut />
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsAuthModalOpen(true)}
                            className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
                        >
                            <LogIn className="w-4 h-4" />
                            ログイン / 登録
                        </button>
                    )}
                </div>
            </header>

            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: Quote (4 cols) */}
                <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6 lg:sticky lg:top-8">
                    <div className="flex items-center gap-2 px-2">
                        <QuoteIcon className="w-5 h-5 text-primary" />
                        <h2 className="text-xl font-bold font-serif italic text-foreground/80">Today&apos;s Quote</h2>
                    </div>

                    <QuoteCard
                        onOpenDetail={setSelectedQuote}
                        refreshKey={refreshKey}
                    />

                    <div className="p-6 rounded-2xl border border-dashed border-border text-center text-muted-foreground text-sm">
                        <p>日付をクリックしてメモを追加できます。</p>
                        <p className="mt-2 text-xs opacity-70">1日1つのメモを記録しよう。</p>
                    </div>

                    <div className="text-center">
                        <Link href="/quotes" className="text-sm text-primary hover:underline font-medium">
                            名言ライブラリを見る →
                        </Link>
                    </div>
                </div>

                {/* Right: Calendar (8 cols) */}
                <div className="lg:col-span-7 xl:col-span-8 space-y-8">
                    <CalendarView
                        onSelectDate={handleDateSelect}
                        selectedDate={selectedDate}
                        refreshKey={refreshKey}
                        className="min-h-[500px]"
                    />
                </div>
            </div>

            <MemoModal
                isOpen={isMemoOpen}
                onClose={() => setIsMemoOpen(false)}
                date={selectedDate}
                onSave={handleMemoSave}
            />

            <QuoteDetailModal
                isOpen={!!selectedQuote}
                onClose={() => setSelectedQuote(null)}
                quote={selectedQuote}
            />
        </main>
    );
}
