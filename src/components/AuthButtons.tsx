
import { loginAction, logoutAction } from "@/lib/actions"

export function SignIn() {
    return (
        <form action={loginAction}>
            <button
                type="submit"
                className="flex items-center gap-3 px-6 py-3 bg-white text-gray-800 rounded-full font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 border border-gray-100"
            >
                <img src="https://authjs.dev/img/providers/google.svg" alt="Google" className="w-5 h-5" />
                Googleアカウントでログイン
            </button>
        </form>
    )
}

export function SignOut() {
    return (
        <form action={logoutAction}>
            <button type="submit" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                ログアウト
            </button>
        </form>
    )
}
