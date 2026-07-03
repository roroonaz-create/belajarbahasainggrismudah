-- Database Schema for Belajar Bahasa Inggris

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    level VARCHAR(10) DEFAULT 'A1' CHECK (level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
    avatar_url VARCHAR(500),
    total_xp INTEGER DEFAULT 0,
    daily_streak INTEGER DEFAULT 0,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Levels table (CEFR levels)
CREATE TABLE IF NOT EXISTS levels (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Categories table (Grammar, Vocabulary, Listening, Speaking, etc.)
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    level_code VARCHAR(10) NOT NULL REFERENCES levels(code),
    category_id INTEGER NOT NULL REFERENCES categories(id),
    order_index INTEGER NOT NULL,
    estimated_time_minutes INTEGER DEFAULT 15,
    xp_reward INTEGER DEFAULT 10,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Lesson examples
CREATE TABLE IF NOT EXISTS lesson_examples (
    id SERIAL PRIMARY KEY,
    lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    example_type VARCHAR(20) NOT NULL CHECK (example_type IN ('sentence', 'dialogue', 'audio')),
    content TEXT NOT NULL,
    translation TEXT,
    audio_url VARCHAR(500),
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    level_code VARCHAR(10) NOT NULL REFERENCES levels(code),
    category_id INTEGER NOT NULL REFERENCES categories(id),
    total_questions INTEGER DEFAULT 0,
    passing_score INTEGER DEFAULT 70,
    xp_reward INTEGER DEFAULT 20,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    quiz_id INTEGER NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(20) NOT NULL CHECK (question_type IN ('multiple_choice', 'true_false', 'fill_blank', 'matching')),
    difficulty VARCHAR(10) DEFAULT 'easy' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    points INTEGER DEFAULT 1,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Answers table
CREATE TABLE IF NOT EXISTS answers (
    id SERIAL PRIMARY KEY,
    question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    answer_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT false,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- User progress table
CREATE TABLE IF NOT EXISTS user_progress (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT false,
    progress_percentage INTEGER DEFAULT 0,
    xp_earned INTEGER DEFAULT 0,
    last_accessed TIMESTAMP,
    completed_at TIMESTAMP,
    UNIQUE(user_id, lesson_id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- User quiz attempts
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quiz_id INTEGER NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    time_spent_seconds INTEGER DEFAULT 0,
    xp_earned INTEGER DEFAULT 0,
    is_passed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- User quiz answers
CREATE TABLE IF NOT EXISTS quiz_answers (
    id SERIAL PRIMARY KEY,
    attempt_id INTEGER NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    question_id INTEGER NOT NULL REFERENCES questions(id),
    answer_id INTEGER REFERENCES answers(id),
    user_answer TEXT,
    is_correct BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Dictionary/Words table
CREATE TABLE IF NOT EXISTS words (
    id SERIAL PRIMARY KEY,
    word VARCHAR(100) NOT NULL,
    pronunciation VARCHAR(100),
    audio_url VARCHAR(500),
    part_of_speech VARCHAR(20) CHECK (part_of_speech IN ('noun', 'verb', 'adjective', 'adverb', 'preposition', 'conjunction', 'interjection', 'pronoun', 'determiner')),
    definition TEXT NOT NULL,
    example TEXT,
    example_translation TEXT,
    level_code VARCHAR(10) NOT NULL REFERENCES levels(code),
    category_id INTEGER REFERENCES categories(id),
    synonyms TEXT[],
    antonyms TEXT[],
    is_common BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- User favorites (for words and lessons)
CREATE TABLE IF NOT EXISTS user_favorites (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content_type VARCHAR(20) NOT NULL CHECK (content_type IN ('word', 'lesson', 'quiz')),
    content_id INTEGER NOT NULL,
    UNIQUE(user_id, content_type, content_id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- User notes
CREATE TABLE IF NOT EXISTS user_notes (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content_type VARCHAR(20) NOT NULL CHECK (content_type IN ('word', 'lesson', 'quiz')),
    content_id INTEGER NOT NULL,
    note TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Daily challenges
CREATE TABLE IF NOT EXISTS daily_challenges (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    challenge_type VARCHAR(20) NOT NULL CHECK (challenge_type IN ('quiz', 'lesson', 'word')),
    content_id INTEGER,
    xp_reward INTEGER DEFAULT 15,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- User daily challenge completions
CREATE TABLE IF NOT EXISTS user_challenge_completions (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    challenge_id INTEGER NOT NULL REFERENCES daily_challenges(id),
    is_completed BOOLEAN DEFAULT false,
    xp_earned INTEGER DEFAULT 0,
    completed_at TIMESTAMP,
    UNIQUE(user_id, challenge_id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lessons_level ON lessons(level_code);
CREATE INDEX IF NOT EXISTS idx_lessons_category ON lessons(category_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_level ON quizzes(level_code);
CREATE INDEX IF NOT EXISTS idx_quizzes_category ON quizzes(category_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_lesson ON user_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz ON quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_words_level ON words(level_code);
CREATE INDEX IF NOT EXISTS idx_words_part_of_speech ON words(part_of_speech);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quizzes_updated_at BEFORE UPDATE ON quizzes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_words_updated_at BEFORE UPDATE ON words
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_notes_updated_at BEFORE UPDATE ON user_notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
