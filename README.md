# Website Pemerintahan

Aplikasi website resmi pemerintahan menggunakan Laravel dan TypeScript untuk menyediakan layanan informasi publik dan administrasi pemerintahan secara online.

## Teknologi

- Backend: Laravel 12+
- Frontend: TypeScript & React
- Database: MySQL
- Environment: XAMPP

## Fitur

- Dashboard administrasi
- Portal informasi publik
- Pengelolaan dokumen
- Berita dan pengumuman
- Layanan online
- Profil pemerintahan
- Galeri dan media

## Instalasi

### Prasyarat

- PHP >= 8.1
- Composer
- Node.js >= 14.x
- MySQL
- XAMPP

### Langkah Instalasi

1. Clone repositori

```bash
git clone [https://github.com/vickyymosafan/Website-Government-Laravel-Typescript.git](https://github.com/vickyymosafan/Website-Government-Laravel-Typescript.git)
cd pemerintahan
```

2. Instal dependensi PHP

```bash
composer install
```

3. Salin file konfigurasi

```bash
cp .env.example .env
```

4. Konfigurasi database di file .env
5. Generate application key

```bash
php artisan key:generate
```

6. Migrasi database

```bash
php artisan migrate --seed
```

7. Instal dependensi frontend

```bash
npm install
```

8. Kompilasi aset

```bash
npm run dev
```

9. Jalankan server

```bash
php artisan serve
```

## Struktur Proyek

```
pemerintahan/
├── app/ # Logika aplikasi Laravel
├── config/ # Konfigurasi aplikasi
├── database/ # Migrasi dan seeders
├── public/ # Aset publik
├── resources/
│ ├── js/ # Kode TypeScript
│ └── views/ # Template blade
├── routes/ # Definisi route
└── tests/ # Unit & feature tests
```

## Kontribusi

Fork repositori
Buat branch fitur (git checkout -b feature/fitur-baru)
Commit perubahan (git commit -m 'Menambahkan fitur baru')
Push ke branch (git push origin feature/fitur-baru)
Buat Pull Request

## Lisensi

MIT License
