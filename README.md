# Belajar Bahasa Inggris Mudah

Website belajar bahasa Inggris online untuk pemula hingga mahir dengan modul terstruktur, quiz interaktif, dan kamus lengkap.

## Fitur Utama

- **Modul Pembelajaran Terstruktur**: Pelajaran dari Level A1 (Pemula) hingga C2 (Mahir)
- **Sistem Autentikasi**: Register, Login, dan manajemen profil user
- **Quiz Interaktif**: Latihan soal dengan penilaian otomatis
- **Kamus Lengkap**: Pencarian kata dengan pengucapan, definisi, dan contoh
- **Progress Tracking**: Pantau perkembangan belajar Anda
- **Responsive Design**: Bisa diakses di desktop dan mobile

## Teknologi yang Digunakan

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL
- **Autentikasi**: JWT (JSON Web Token)

## Struktur Proyek

```
belajarbahasainggrismudah/
├── app/
│   ├── api/                  # API Routes
│   │   └── auth/            # Autentikasi
│   ├── (auth)/              # Halaman autentikasi
│   ├── learn/               # Modul pembelajaran
│   ├── quiz/                # Quiz
│   ├── dictionary/          # Kamus
│   ├── profile/             # Profil user
│   ├── login/               # Halaman login
│   ├── register/            # Halaman register
│   ├── layout.tsx           # Layout utama
│   └── page.tsx            # Halaman utama
├── components/              # Komponen React
├── lib/                     # Utility functions & DB
├── database/                # Database schema & seed
├── public/                  # Static files
└── styles/                  # CSS
```

## Setup & Instalasi

### Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm / yarn

### Langkah-langkah

1. **Clone repository**
```bash
git clone https://github.com/roroonaz-create/belajarbahasainggrismudah.git
cd belajarbahasainggrismudah
```

2. **Install dependencies**
```bash
npm install
# atau
yarn install
```

3. **Setup database**
- Buat database PostgreSQL
- Copy `.env.example` ke `.env` dan sesuaikan konfigurasi
- Jalankan setup database:
```bash
psql -U postgres -f database/setup.sql
psql -U postgres -f database/seed.sql
```

4. **Jalankan aplikasi**
```bash
npm run dev
# atau
yarn dev
```

5. **Buka di browser**
```
http://localhost:3000
```

## Konfigurasi Environment

Copy `.env.example` ke `.env` dan sesuaikan:

```env
# Database Configuration
DB_USER=postgres
DB_HOST=localhost
DB_NAME=belajar_bahasa_inggris
DB_PASSWORD=postgres
DB_PORT=5432
DB_SSL=false

# JWT Secret Key
JWT_SECRET=your-super-secret-jwt-key-change-this

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Script yang Tersedia

- `npm run dev` - Jalankan aplikasi di mode development
- `npm run build` - Build aplikasi untuk production
- `npm run start` - Jalankan aplikasi di mode production
- `npm run lint` - Jalankan linting
- `npm run db:setup` - Setup database schema
- `npm run db:seed` - Seed database dengan data awal

## Kontribusi

Kontribusi sangat welcome! Silakan buka Pull Request untuk:
- Menambahkan fitur baru
- Memperbaiki bug
- Meningkatkan dokumentasi

## Lisensi

MIT License

## Kontak

- Email: info@belajarbahasainggrismudah.com
- Website: https://belajarbahasainggrismudah.com
