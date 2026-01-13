
-- Insert initial quotes into the Quote table
INSERT INTO "Quote" (id, author, text, episode, episode_short, tags, createdAt)
VALUES 
('1', 'Steve Jobs', 'Stay hungry, stay foolish.', 'スティーブ・ジョブズがスタンフォード大学の卒業式で行ったスピーチの締めくくりの言葉。', 'スタンフォード大スピーチ', 'inspiration,life', datetime('now')),
('2', 'Steve Jobs', 'The only way to do great work is to love what you do.', '仕事への情熱の重要性を説いた言葉。', '仕事について', 'work,passion', datetime('now')),
('3', 'Albert Einstein', 'Life is like riding a bicycle. To keep your balance, you must keep moving.', '人生における前進し続けることの重要性を説いたアインシュタインの言葉。', '人生のバランス', 'life,balance', datetime('now')),
('4', 'Nelson Mandela', 'It always seems impossible until it''s done.', '困難な状況でも諦めずに挑戦し続けることの大切さを伝えています。', '不可能なこと', 'motivation,perseverance', datetime('now')),
('5', 'Theodore Roosevelt', 'Believe you can and you''re halfway there.', '自信を持つことが成功への第一歩であるという教え。', '自信について', 'confidence,success', datetime('now'));
