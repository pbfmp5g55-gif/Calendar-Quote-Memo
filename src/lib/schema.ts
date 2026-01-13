
import { z } from 'zod';

export const RegisterSchema = z.object({
    name: z.string().min(1, '名前を入力してください'),
    email: z.string().email('正しいメールアドレスを入力してください'),
    password: z.string().min(6, 'パスワードは6文字以上で入力してください'),
});

export const LoginSchema = z.object({
    email: z.string().email('正しいメールアドレスを入力してください'),
    password: z.string().min(1, 'パスワードを入力してください'),
});
