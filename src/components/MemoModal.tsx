'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { X, Trash2, Save, Loader2, Quote as QuoteIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MemoModalProps {
    isOpen: boolean;
    onClose: () => void;
    date: Date | null;
    onSave: () => void;
}

export default function MemoModal({ isOpen, onClose, date, onSave }: MemoModalProps) {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [quote, setQuote] = useState<any | null>(null);
    const [quoteLoading, setQuoteLoading] = useState(false);

    useEffect(() => {
        if (isOpen && date) {
            const d = format(date, 'yyyy-MM-dd');
            setLoading(true);
            setQuoteLoading(true);
            setContent('');

            // Fetch memo
            fetch(`/api/memos/${d}`)
                .then(async (res) => {
                    if (res.ok) {
                        const data = await res.json();
                        return data.content;
                    }
                    if (res.status === 404) return '';
                    throw new Error('Fetch failed');
                })
                .then((text) => setContent(text))
                .catch((e) => console.error(e))
                .finally(() => setLoading(false));

            // Fetch quote for this date
            fetch(`/api/quotes/by-date/${d}`)
                .then(res => res.json())
                .then(data => setQuote(data))
                .catch(e => console.error(e))
                .finally(() => setQuoteLoading(false));
        }
    }, [isOpen, date]);

    const handleSave = async () => {
        if (!date) return;
        setSaving(true);
        const d = format(date, 'yyyy-MM-dd');
        try {
            const res = await fetch(`/api/memos/${d}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content }),
            });
            if (!res.ok) throw new Error('Save failed');
            onSave(); // Refresh parent
            onClose();
        } catch (e) {
            alert('保存に失敗しました');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!date || !confirm('本当に削除しますか？')) return;
        setIsDeleting(true);
        const d = format(date, 'yyyy-MM-dd');
        try {
            await fetch(`/api/memos/${d}`, { method: 'DELETE' });
            onSave();
            onClose();
        } catch (e) {
            alert('削除に失敗しました');
        } finally {
            setIsDeleting(false);
        }
    };

    if (!isOpen || !date) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="w-full max-w-lg bg-card text-card-foreground rounded-2xl shadow-2xl border border-white/10 overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
                            <h3 className="text-xl font-bold font-sans">
                                {format(date, 'MM月 dd日 (eee)', { locale: ja })} のメモ
                            </h3>
                            <button onClick={onClose} className="p-2 hover:bg-muted/50 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 flex-1 flex flex-col min-h-0 gap-6">
                            {/* Quote Section */}
                            {!quoteLoading && quote && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 rounded-xl bg-primary/5 border border-primary/10 relative overflow-hidden"
                                >
                                    <QuoteIcon className="absolute -top-1 -left-1 w-8 h-8 text-primary/10 -scale-x-100" />
                                    <p className="text-sm italic text-foreground/80 font-serif leading-relaxed line-clamp-3">
                                        "{quote.text}"
                                    </p>
                                    <p className="text-xs text-primary font-semibold mt-2 text-right">
                                        — {quote.author}
                                    </p>
                                    {quote.episode_short && (
                                        <div className="mt-2 pt-2 border-t border-primary/10 text-[10px] text-muted-foreground flex items-center gap-1">
                                            <span className="opacity-70 font-bold uppercase tracking-wider">Tips:</span> {quote.episode_short}
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {loading ? (
                                <div className="flex-1 flex items-center justify-center py-20">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                </div>
                            ) : (
                                <textarea
                                    className="w-full flex-1 min-h-[250px] resize-none bg-background/50 border border-input rounded-xl p-4 focus:ring-2 focus:ring-primary focus:outline-none transition-all text-lg leading-relaxed"
                                    placeholder="今日はどんな一日でしたか？"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    maxLength={5000}
                                />
                            )}
                        </div>

                        <div className="p-4 border-t border-border bg-muted/30 flex items-center justify-between">
                            {content && (
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting || saving}
                                    className="px-4 py-2 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    削除
                                </button>
                            )}
                            <div className="flex-1" />
                            <button
                                onClick={handleSave}
                                disabled={loading || saving}
                                className="px-6 py-2 bg-primary text-white hover:bg-primary/90 rounded-lg shadow-lg shadow-primary/25 transition-all flex items-center gap-2 font-medium active:scale-95 disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                保存
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
