import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"

export default {
    secret: "mytmmpsecretkey12345", // 環境変数が読めない場合のフォールバック
    providers: [
        // Google({
        //     clientId: process.env.GOOGLE_CLIENT_ID,
        //     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        // }),
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/memos'); // 例: メモ機能はログイン必須にするなど
            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect to login page
            }
            return true;
        },
    },
} satisfies NextAuthConfig
