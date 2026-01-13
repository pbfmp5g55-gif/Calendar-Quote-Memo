
'use client';

import { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { registerWithCredentials, loginWithCredentials } from '@/lib/actions';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
    const [mode, setMode] = useState<'login' | 'register'>(initialMode);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [pending, setPending] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (formData: FormData) => {
        setError(null);
        setSuccess(null);
        setPending(true);

        try {
            if (mode === 'register') {
                const res = await registerWithCredentials(formData);
                if (res.error) {
                    setError(res.error);
                } else if (res.success) {
                    setSuccess("登録が完了しました！ログインしてください。");
                    setMode('login');
                }
            } else {
                const res = await loginWithCredentials(formData);
                if (res?.error) {
                    setError(res.error);
                } else {
                    // ログイン成功
                    window.location.reload();
                }
            }
        } catch (e) {
            setError("予期せぬエラーが発生しました");
        } finally {
            setPending(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="w-full max-w-md bg-card text-card-foreground rounded-2xl shadow-xl border border-white/10 overflow-hidden"
                >
                    <div className="p-6 relative">
                        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-muted/50 rounded-full transition-colors">
                            <X className="w-5 h-5 text-muted-foreground" />
                        </button>

                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold font-serif mb-2">
                                {mode === 'login' ? 'おかえりなさい' : 'アカウント作成'}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {mode === 'login'
                                    ? '日々の名言とメモにアクセスしましょう'
                                    : 'あなただけのカレンダーを作りましょう'}
                            </p>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-lg text-center">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 text-green-500 text-sm rounded-lg text-center">
                                {success}
                            </div>
                        )}

                        <form action={handleSubmit} className="space-y-4">
                            {mode === 'register' && (
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground ml-1">お名前</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                        <input
                                            name="name"
                                            type="text"
                                            placeholder="Taro Yamada"
                                            required
                                            className="w-full bg-muted/30 border border-input rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground ml-1">メールアドレス</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="hello@example.com"
                                        required
                                        className="w-full bg-muted/30 border border-input rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground ml-1">パスワード</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                    <input
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                        className="w-full bg-muted/30 border border-input rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={pending}
                                className="w-full mt-6 bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-primary/20"
                            >
                                {pending ? '処理中...' : (mode === 'login' ? 'ログイン' : 'アカウント登録')}
                                {!pending && <ArrowRight className="w-4 h-4" />}
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm">
                            <span className="text-muted-foreground">
                                {mode === 'login' ? 'アカウントをお持ちでないですか？' : 'すでにアカウントをお持ちですか？'}
                            </span>
                            <button
                                onClick={() => {
                                    setMode(mode === 'login' ? 'register' : 'login');
                                    setError(null);
                                    setSuccess(null);
                                }}
                                className="ml-2 font-bold text-primary hover:underline"
                            >
                                {mode === 'login' ? '新規登録' : 'ログイン'}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
