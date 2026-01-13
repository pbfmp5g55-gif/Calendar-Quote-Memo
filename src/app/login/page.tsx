
import { SignIn } from "@/components/AuthButtons";
import { Quote as QuoteIcon } from 'lucide-react';

export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[100px] animate-pulse-slow" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[100px] animate-pulse-slow delay-1000" />
            </div>

            <div className="glass-card w-full max-w-md p-8 md:p-12 flex flex-col items-center text-center relative z-10 border-t-4 border-t-primary/50">
                <div className="mb-6 bg-primary/10 p-4 rounded-full">
                    <QuoteIcon className="w-10 h-10 text-primary" />
                </div>

                <h1 className="text-2xl md:text-3xl font-bold font-serif mb-2">Calendar Quote Memo</h1>
                <p className="text-muted-foreground mb-10">
                    日々の名言とメモを、<br />あなただけの空間に記録しましょう。
                </p>

                <SignIn />

                <p className="mt-8 text-xs text-muted-foreground opacity-60">
                    続行することで、利用規約とプライバシーポリシーに同意したものとみなされます。
                </p>
            </div>
        </div>
    );
}
