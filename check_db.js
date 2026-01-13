const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('データベースに接続確認中...');
        const count = await prisma.quote.count();
        console.log(`✅ 成功: 現在、データベースには ${count} 件の名言が保存されています。`);

        if (count > 0) {
            const first = await prisma.quote.findFirst();
            console.log('------------------------------------------------');
            console.log('▼ 最初のデータ例:');
            console.log(`Author: ${first.author}`);
            console.log(`Text (JP): ${first.text}`);
            console.log(`Text (EN): ${first.text_en || '(なし)'}`);
            console.log('------------------------------------------------');
            console.log('ブラウザで http://localhost:3000 にアクセスして画面を確認してください。');
        } else {
            console.log('⚠ データが0件です。もう一度 node seed-via-api.js を実行してください。');
        }
    } catch (error) {
        console.error('❌ エラー: データベースに接続できませんでした。');
        console.error(error);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
