
"use server"

import { signIn, signOut } from "@/auth"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { RegisterSchema, LoginSchema } from "./schema"
import { AuthError } from "next-auth"

export async function loginAction() {
    await signIn("google", { redirectTo: "/" })
}

export async function logoutAction() {
    await signOut({ redirectTo: "/" })
}

export async function registerWithCredentials(formData: FormData) {
    const validatedFields = RegisterSchema.safeParse(Object.fromEntries(formData));

    if (!validatedFields.success) {
        return { error: "入力内容が正しくありません" };
    }

    const { name, email, password } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return { error: "このメールアドレスは既に登録されています" };

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });
        return { success: true };
    } catch (err) {
        console.error(err);
        return { error: `登録エラー: ${err instanceof Error ? err.message : String(err)}` };
    }
}

export async function loginWithCredentials(formData: FormData) {
    const validatedFields = LoginSchema.safeParse(Object.fromEntries(formData));

    if (!validatedFields.success) {
        return { error: "入力内容が正しくありません" };
    }

    const { email, password } = validatedFields.data;

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: "/",
        });
        return { success: true };
    } catch (error) {
        // リダイレクトエラーは「成功（ページ遷移）」を意味するので、
        // エラーとせず success: true を返してクライアント側で処理させる
        if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
            return { success: true };
        }

        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "メールアドレスまたはパスワードが間違っています" };
                default:
                    return { error: "ログインに失敗しました" };
            }
        }
        // その他のエラー
        console.error(error);
        return { error: "予期せぬエラーが発生しました" };
    }
}
