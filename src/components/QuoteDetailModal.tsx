'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Send, User, MessageCircle, BookOpen, Lock, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface QuoteData {
    id: string;
    text: string;
    text_en?: string | null;
    author: string;
    episode?: string | null;
    episode_en?: string | null;
    source_title?: string | null;
    source_url?: string | null;
    [key: string]: any;
}

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    isPublic: boolean;
}

interface QuoteDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    quote: QuoteData | null;
}

export default function QuoteDetailModal({ isOpen, onClose, quote }: QuoteDetailModalProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [loadingComments, setLoadingComments] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const commentsEndRef = useRef<HTMLDivElement>(null);
    const [lang, setLang] = useState<'ja' | 'en'>('ja');

    useEffect(() => {
        if (isOpen && quote) {
            setLoadingComments(true);
            fetch(`/api/quotes/${quote.id}/comments`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) setComments(data);
                })
                .catch(console.error)
                .finally(() => setLoadingComments(false));
        }
    }, [isOpen, quote]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!quote || !newComment.trim()) return;

        setSubmitting(true);
        try {
            const res = await fetch(`/api/quotes/${quote.id}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newComment, isPublic }),
            });
            if (res.ok) {
                const comment = await res.json();
                setComments(prev => [comment, ...prev]);
                setNewComment('');
                // Reset to default private
                setIsPublic(false);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen || !quote) return null;

    const displayText = lang === 'ja' ? quote.text : (quote.text_en || quote.text);
    const displayEpisode = lang === 'ja' ? quote.episode : (quote.episode_en || quote.episode);

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    className="w-full max-w-4xl bg-card text-card-foreground rounded-2xl shadow-2xl border border-white/10 overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
                >
                    {/* Left/Top: Quote Quote Info */}
                    <div className="p-8 md:w-1/2 overflow-y-auto border-b md:border-b-0 md:border-r border-border bg-gradient-to-br from-primary/5 to-transparent relative">
                        <div className="absolute top-4 right-14 z-20">
                            <button
                                onClick={() => setLang(l => l === 'ja' ? 'en' : 'ja')}
                                className="text-xs font-medium px-2 py-1 rounded-full bg-muted/50 hover:bg-muted transition-colors border border-white/10"
                            >
                                {lang === 'ja' ? 'EN' : 'JP'}
                            </button>
                        </div>
                        <button onClick={onClose} className="md:hidden absolute top-4 right-4 p-2 bg-muted rounded-full">
                            <X className="w-5 h-5" />
                        </button>

                        <div className="mb-6">
                            <span className="text-primary text-sm font-bold tracking-widest uppercase">Quote of the Day</span>
                            <motion.h2 key={lang} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-serif font-bold mt-2 leading-tight">
                                {displayText}
                            </motion.h2>
                            <p className="mt-4 text-lg font-medium text-foreground/80">— {quote.author}</p>
                        </div>

                        {displayEpisode && (
                            <motion.div key={`ep-${lang}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="prose prose-sm dark:prose-invert text-muted-foreground bg-white/5 p-6 rounded-xl border border-white/5">
                                <h4 className="flex items-center gap-2 font-bold text-foreground mb-3">
                                    <BookOpen className="w-4 h-4 text-primary" />
                                    エピソード・豆知識
                                </h4>
                                <p className="whitespace-pre-wrap leading-relaxed">{displayEpisode}</p>

                                {(quote.source_title || quote.source_url) && (
                                    <div className="mt-4 pt-4 border-t border-white/10 text-xs">
                                        <span className="font-bold">出典: </span>
                                        {quote.source_url ? (
                                            <a href={quote.source_url} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                                                {quote.source_title || 'リンク'}
                                            </a>
                                        ) : (
                                            <span>{quote.source_title}</span>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>

                    {/* Right/Bottom: Comments */}
                    <div className="flex-1 flex flex-col bg-card/50">
                        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/20">
                            <h3 className="font-bold flex items-center gap-2">
                                <MessageCircle className="w-5 h-5 text-secondary" />
                                みんなのコメント ({comments.length})
                            </h3>
                            <button onClick={onClose} className="hidden md:block p-2 hover:bg-muted rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/5 min-h-[300px]">
                            {loadingComments ? (
                                <div className="text-center py-10 text-muted-foreground">読み込み中...</div>
                            ) : comments.length === 0 ? (
                                <div className="text-center py-10 text-muted-foreground">
                                    まだコメントはありません。<br />最初の感想を書いてみましょう。
                                </div>
                            ) : (
                                comments.map((comment) => (
                                    <div key={comment.id} className="bg-background/80 p-4 rounded-xl border border-border shadow-sm flex flex-col gap-2">
                                        <p className="text-sm leading-relaxed">{comment.content}</p>
                                        <div className="flex items-center justify-between mt-1">
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <User className="w-3 h-3" />
                                                <span>匿名ユーザー</span>
                                                <span>•</span>
                                                <span>{format(new Date(comment.createdAt), 'yyyy/MM/dd HH:mm')}</span>
                                            </div>
                                            {comment.isPublic ? (
                                                <div className="flex items-center gap-1 text-[10px] text-primary/70 bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10">
                                                    <Globe className="w-3 h-3" /> Public
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-white/5">
                                                    <Lock className="w-3 h-3" /> Private
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={commentsEndRef} />
                        </div>

                        <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-background">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-end gap-2 text-xs">
                                    <button
                                        type="button"
                                        onClick={() => setIsPublic(!isPublic)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors border ${isPublic
                                                ? 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20'
                                                : 'bg-muted text-muted-foreground border-transparent hover:bg-muted/80'
                                            }`}
                                    >
                                        {isPublic ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                                        {isPublic ? '公開' : '自分のみ'}
                                    </button>
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="感想や学びをシェア..."
                                        className="flex-1 bg-muted/50 border border-input rounded-full px-4 py-2 focus:ring-2 focus:ring-secondary focus:outline-none transition-all"
                                        maxLength={500}
                                    />
                                    <button
                                        type="submit"
                                        disabled={submitting || !newComment.trim()}
                                        className="p-3 bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/90 disabled:opacity-50 transition-all active:scale-95 shadow-lg shadow-secondary/20"
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
