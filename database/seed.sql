-- Seed Data for Belajar Bahasa Inggris

-- Insert CEFR Levels
INSERT INTO levels (code, name, description) VALUES
('A1', 'Pemula', 'Tingkat dasar untuk pemula yang baru belajar bahasa Inggris'),
('A2', 'Dasar', 'Tingkat dasar yang sudah mengerti kalimat sederhana'),
('B1', 'Menengah', 'Tingkat menengah yang sudah bisa berkomunikasi sederhana'),
('B2', 'Menengah Atas', 'Tingkat menengah atas yang sudah lancar dalam percakapan sehari-hari'),
('C1', 'Lancar', 'Tingkat lanjut yang sudah bisa berkomunikasi dengan lancar'),
('C2', 'Mahir', 'Tingkat mahir yang hampir seperti penutur asli')
ON CONFLICT (code) DO NOTHING;

-- Insert Categories
INSERT INTO categories (name, description, icon, color) VALUES
('Grammar', 'Tata bahasa Inggris', 'grammar', 'blue'),
('Vocabulary', 'Kosa kata', 'vocabulary', 'green'),
('Listening', 'Kemampuan mendengarkan', 'listening', 'purple'),
('Speaking', 'Kemampuan berbicara', 'speaking', 'orange'),
('Reading', 'Kemampuan membaca', 'reading', 'red'),
('Writing', 'Kemampuan menulis', 'writing', 'teal'),
('Pronunciation', 'Pengucapan', 'pronunciation', 'pink')
ON CONFLICT (name) DO NOTHING;

-- Insert Sample Lessons for A1 Level
INSERT INTO lessons (title, slug, description, content, level_code, category_id, order_index, estimated_time_minutes, xp_reward) VALUES
('Pengenalan Alfabet', 'pengenalan-alfabet', 'Belajar mengenal huruf A-Z dalam bahasa Inggris', 'Alfabet bahasa Inggris terdiri dari 26 huruf: A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z.', 'A1', 2, 1, 10, 10),
('Angka 1-20', 'angka-1-20', 'Belajar angka dari 1 sampai 20', 'One (1), Two (2), Three (3), Four (4), Five (5), Six (6), Seven (7), Eight (8), Nine (9), Ten (10), Eleven (11), Twelve (12), Thirteen (13), Fourteen (14), Fifteen (15), Sixteen (16), Seventeen (17), Eighteen (18), Nineteen (19), Twenty (20).', 'A1', 2, 2, 15, 15),
('Sapaaan Dasar', 'sapaan-dasar', 'Belajar ucapan sapaan dasar', 'Hello (Halo), Hi (Hai), Good morning (Selamat pagi), Good afternoon (Selamat siang), Good evening (Selamat sore), Good night (Selamat malam), How are you? (Apa kabar?), I am fine (Saya baik-baik saja).', 'A1', 1, 3, 20, 20),
('Pronouns (Kata Ganti)', 'pronouns-kata-ganti', 'Belajar kata ganti orang', 'I (Saya), You (Kamu/Anda), He (Dia laki-laki), She (Dia perempuan), It (Dia untuk benda/hewan), We (Kami), They (Mereka). Contoh: I am a student. (Saya adalah seorang siswa.)', 'A1', 1, 4, 25, 25),
('Verb To Be (Am, Is, Are)', 'verb-to-be', 'Belajar penggunaan to be', 'I am (Saya adalah), You are (Kamu adalah), He is (Dia laki-laki adalah), She is (Dia perempuan adalah), It is (Ini adalah), We are (Kami adalah), They are (Mereka adalah). Contoh: She is a teacher. (Dia adalah seorang guru.)', 'A1', 1, 5, 30, 30)
ON CONFLICT (slug) DO NOTHING;

-- Insert Lesson Examples
INSERT INTO lesson_examples (lesson_id, example_type, content, translation, audio_url, order_index) VALUES
(1, 'sentence', 'A is for Apple', 'A untuk Apel', NULL, 1),
(1, 'sentence', 'B is for Ball', 'B untuk Bola', NULL, 2),
(2, 'sentence', 'I have one apple', 'Saya punya satu apel', NULL, 1),
(2, 'sentence', 'She has two books', 'Dia punya dua buku', NULL, 2),
(3, 'dialogue', 'A: Hello, how are you?\nB: I am fine, thank you. And you?\nA: I am good, thanks.', 'A: Halo, apa kabar?\nB: Saya baik-baik saja, terima kasih. Dan kamu?\nA: Saya baik, terima kasih.', NULL, 1),
(4, 'sentence', 'I am a student', 'Saya adalah seorang siswa', NULL, 1),
(4, 'sentence', 'He is a doctor', 'Dia adalah seorang dokter', NULL, 2),
(5, 'sentence', 'She is happy', 'Dia senang', NULL, 1),
(5, 'sentence', 'They are friends', 'Mereka adalah teman', NULL, 2)
ON CONFLICT DO NOTHING;

-- Insert Sample Words
INSERT INTO words (word, pronunciation, part_of_speech, definition, example, example_translation, level_code, category_id, is_common) VALUES
('hello', '/həˈloʊ/', 'interjection', 'Ucapan sapaan', 'Hello, how are you?', 'Halo, apa kabar?', 'A1', 2, true),
('goodbye', '/ɡʊdˈbaɪ/', 'interjection', 'Ucapan perpisahan', 'Goodbye, see you later!', 'Selamat tinggal, sampai jumpa!', 'A1', 2, true),
('thank you', '/θæŋk juː/', 'interjection', 'Ucapan terima kasih', 'Thank you for your help.', 'Terima kasih atas bantuanmu.', 'A1', 2, true),
('please', '/pliːz/', 'adverb', 'Kata untuk meminta dengan sopan', 'Please help me.', 'Tolong bantu saya.', 'A1', 2, true),
('sorry', '/ˈsɔːri/', 'interjection', 'Ucapan permintaan maaf', 'I am sorry for being late.', 'Saya minta maaf karena terlambat.', 'A1', 2, true),
('student', '/ˈstuːdnt/', 'noun', 'Siswa atau mahasiswa', 'I am a student.', 'Saya adalah seorang siswa.', 'A1', 2, true),
('teacher', '/ˈtiːtʃər/', 'noun', 'Guru', 'She is a teacher.', 'Dia adalah seorang guru.', 'A1', 2, true),
('book', '/bʊk/', 'noun', 'Buku', 'I have a book.', 'Saya punya sebuah buku.', 'A1', 2, true),
('pen', '/pɛn/', 'noun', 'Pulpen', 'This is my pen.', 'Ini pulpen saya.', 'A1', 2, true),
('apple', '/ˈæpəl/', 'noun', 'Apel', 'I eat an apple.', 'Saya makan sebuah apel.', 'A1', 2, true)
ON CONFLICT (word) DO NOTHING;

-- Insert Sample Quizzes
INSERT INTO quizzes (title, description, level_code, category_id, total_questions, passing_score, xp_reward) VALUES
('Quiz Alfabet', 'Test pengetahuan tentang alfabet Inggris', 'A1', 2, 5, 70, 20),
('Quiz Angka', 'Test pengetahuan tentang angka dalam bahasa Inggris', 'A1', 2, 5, 70, 20),
('Quiz Sapaan', 'Test pengetahuan tentang sapaan dasar', 'A1', 1, 5, 70, 25)
ON CONFLICT (title) DO NOTHING;

-- Insert Sample Questions for Quiz 1 (Alphabet)
INSERT INTO questions (quiz_id, question_text, question_type, difficulty, points, order_index) VALUES
(1, 'What is the first letter of the alphabet?', 'multiple_choice', 'easy', 1, 1),
(1, 'What is the last letter of the alphabet?', 'multiple_choice', 'easy', 1, 2),
(1, 'Which letter comes after B?', 'multiple_choice', 'easy', 1, 3)
ON CONFLICT DO NOTHING;

-- Insert Answers for Quiz 1
INSERT INTO answers (question_id, answer_text, is_correct, order_index) VALUES
(1, 'A', true, 1),
(1, 'B', false, 2),
(1, 'C', false, 3),
(1, 'D', false, 4),
(2, 'Z', true, 1),
(2, 'Y', false, 2),
(2, 'X', false, 3),
(2, 'W', false, 4),
(3, 'C', true, 1),
(3, 'A', false, 2),
(3, 'D', false, 3),
(3, 'B', false, 4)
ON CONFLICT DO NOTHING;

-- Insert Sample User (for testing)
INSERT INTO users (name, email, password, level) VALUES
('Admin User', 'admin@belajarbahasainggris.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoE5B7Lx1JQz8VK8pA8B9v0pQ1Q1Q', 'C2')
ON CONFLICT (email) DO NOTHING;
