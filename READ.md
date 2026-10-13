# Asietex Company Profile

Website profil perusahaan Asietex beserta CMS internal untuk mengelola konten, produk, media, akun staf, dan pengaturan e-catalog.

## Fitur utama

- Situs publik multibahasa: Inggris (`en`), Indonesia (`id`), dan Portugis (`pt`).
- Halaman publik untuk beranda, profil perusahaan, produk, kontak marketing, karier, dan kontak.
- Sembilan halaman detail produk tekstil.
- Dashboard CMS dengan alur draf dan publikasi.
- Pengelolaan konten halaman, produk, koleksi konten, media, dan e-catalog.
- Role-based access: `STAFF` mengelola draf; `ADMIN` menerbitkan konten, menyetujui media, dan mengelola pengguna.
- Riwayat perubahan pada konten, media, pengaturan, dan pengguna.

## Teknologi

- Next.js 16 dan React 19
- TypeScript dan Tailwind CSS 4
- Prisma ORM 7 dengan PostgreSQL
- Base UI dan komponen shadcn
- MapLibre untuk peta pasar global

## Menjalankan proyek secara lokal

Pastikan PostgreSQL sudah berjalan dan Node.js beserta npm tersedia.

1. Pasang dependensi.

   ```bash
   npm install
   ```

2. Buat berkas environment dari contoh yang tersedia.

   ```bash
   Copy-Item .env.example .env
   ```

3. Isi `DATABASE_URL` dan kredensial seed pada `.env`. Password seed harus menggunakan nilai unik dengan minimal 12 karakter.

   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/asietex_compro?schema=public"
   SEED_ADMIN_EMAIL="admin@example.com"
   SEED_ADMIN_PASSWORD="gunakan-password-unik-minimal-12-karakter"
   SEED_STAFF_EMAIL="staff@example.com"
   SEED_STAFF_PASSWORD="gunakan-password-unik-minimal-12-karakter"
   ```

4. Terapkan migrasi, hasilkan Prisma Client, lalu isi data awal.

   ```bash
   npx prisma migrate dev --config ./prisma7.config.ts
   npm run prisma:generate
   npx prisma db seed --config ./prisma7.config.ts
   ```

5. Jalankan server pengembangan.

   ```bash
   npm run dev
   ```

Situs akan tersedia di `http://localhost:3000` dan akan dialihkan ke `/en`. Dashboard tersedia di `/dashboard`; masuk melalui `/login` menggunakan kredensial seed.

## Perintah yang tersedia

| Perintah                  | Kegunaan                                             |
| ------------------------- | ---------------------------------------------------- |
| `npm run dev`             | Menjalankan server pengembangan.                     |
| `npm run build`           | Menghasilkan build produksi, termasuk Prisma Client. |
| `npm run start`           | Menjalankan build produksi.                          |
| `npm run lint`            | Memeriksa aturan ESLint.                             |
| `npm run types:check`     | Memeriksa tipe TypeScript tanpa membuat output.      |
| `npm run prisma:generate` | Menghasilkan Prisma Client ke `generated/prisma`.    |
| `npm run map:prepare`     | Menyiapkan data peta dunia untuk komponen MapLibre.  |

## Struktur proyek

```text
app/            Route Next.js untuk situs publik, login, dan dashboard
backend/        Prisma client serta autentikasi dan sesi
components/     Komponen UI bersama
features/       Halaman, aksi server, dan komponen menurut domain fitur
lib/            Utilitas bersama dan konfigurasi i18n
prisma/         Schema, migrasi, seed, dan data seed
public/         Foto, logo, dan aset statis
scripts/        Skrip pendukung proyek
```

## Konten dan hak akses CMS

`STAFF` dapat menyimpan draf konten, produk, pengaturan e-catalog, koleksi konten, dan media. `ADMIN` memiliki semua kemampuan tersebut, serta dapat menerbitkan konten, menyetujui media, dan membuat, mengaktifkan/nonaktifkan, atau mengubah peran pengguna.

Konten halaman dan produk harus lengkap dalam ketiga bahasa sebelum dapat diterbitkan. Perubahan yang diterbitkan akan memvalidasi ulang halaman publik terkait.

## URL penting

| Area           | URL                      |
| -------------- | ------------------------ |
| Beranda        | `/en`, `/id`, atau `/pt` |
| Produk         | `/{locale}/products`     |
| Login CMS      | `/login`                 |
| Dashboard CMS  | `/dashboard`             |
| Peta situs     | `/sitemap.xml`           |
| Aturan crawler | `/robots.txt`            |

## Konfigurasi produksi

Atur `NEXT_PUBLIC_SITE_URL` ke URL kanonis deployment untuk menghasilkan URL yang benar pada sitemap dan `robots.txt`. Gunakan database PostgreSQL terpisah untuk produksi, jalankan migrasi yang sesuai sebelum deploy, dan simpan kredensial hanya pada secret environment deployment.

## Kualitas kode

Sebelum mengirim perubahan, jalankan:

```bash
npm run lint
npm run types:check
npm run build
```
