# Calendar Quote Memo

日々のメモと偉人の名言を管理するWebアプリケーションです。

## 機能

- **カレンダーメモ**: 月ごとのカレンダー表示。日付ごとのメモ作成・編集・削除。
- **今日の名言**: 毎日ランダムな名言を表示（日替わり固定）。
- **コメント機能**: 名言に対する感想や学びをコメントとして投稿・閲覧可能。
- **リッチなデザイン**: モダンなUI/UX、ダークモード対応、グラスモーフィズムデザイン。

## 技術スタック

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, Framer Motion
- **Database**: SQLite (via Prisma)
- **Icons**: Lucide React

## セットアップ

1. **依存関係のインストール**
   ```bash
   npm install
   ```

2. **データベースのセットアップ**
   ```bash
   # マイグレーションの適用
   npx prisma migrate dev --name init
   
   # シードデータの投入（名言データの登録）
   # 注意: tsxが必要な場合があります
   npx tsx prisma/seed.ts
   # または JS版があれば
   # node prisma/seed.js
   ```

3. **開発サーバーの起動**
   ```bash
   npm run dev
   ```
   http://localhost:3000 にアクセスしてください。

## ディレクトリ構成

- `src/app`: Next.js App Router (Pages & API)
- `src/components`: UIコンポーネント (CalendarView, QuoteCard, etc.)
- `src/lib`: ユーティリティ (Prisma Client)
- `prisma`: データベーススキーマとシード

## 注意事項

- 初回起動時は名言データが空の場合があります。シードスクリプトを実行するか、API経由でデータを追加してください。
- 開発環境（Windows）でのTailwind v4ビルドエラーが発生する場合、`globals.css` の `@theme` 設定を確認するか、Tailwind v3へのダウングレードを検討してください。

