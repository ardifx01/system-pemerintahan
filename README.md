# Website Pemerintahan

Sistem informasi pemerintahan modern berbasis web yang dikembangkan menggunakan Laravel (backend) dan React + TypeScript (frontend). Platform ini menyediakan layanan administrasi publik dan pengelolaan dokumen kependudukan secara online dengan antarmuka profesional, responsif, dan mudah digunakan.

---

## Fitur Utama

- **Autentikasi Aman:**
    - Registrasi dan login untuk penduduk
    - Login khusus untuk admin
- **Penduduk:**
    - Dashboard pribadi dengan statistik
    - Pengajuan & pelacakan dokumen (KTP, KK, Akta Kelahiran, Akta Kematian)
    - Unduh & cetak dokumen PDF resmi
    - Baca berita pemerintahan terbaru
- **Admin:**
    - Dashboard statistik kependudukan
    - Manajemen data penduduk
    - Proses pengajuan dokumen (approve/tolak dengan catatan)
    - CRUD berita pemerintahan
    - Log aktivitas sistem

---

## Teknologi

- **Backend:** Laravel 12+
- **Frontend:** React + TypeScript
- **Database:** MySQL
- **Styling:** TailwindCSS
- **Authentication:** Laravel Sanctum
- **PDF Generation:** DomPDF

---

## Persyaratan Sistem

- PHP 8.1+
- Node.js 18+
- Composer
- MySQL 8.0+
- XAMPP/Laravel Sail/Docker (opsional)

---

## Quick Start (Instalasi Cepat)

1. **Clone repositori:**
    ```bash
    git clone https://github.com/ardifx01/system-pemerintahan.git
    cd Website-Government-Laravel-Typescript
    ```
2. **Instal dependensi backend (Laravel):**
    ```bash
    composer install
    ```
3. **Instal dependensi frontend (React):**
    ```bash
    npm install
    ```
4. **Salin & konfigurasi environment:**
    ```bash
    cp .env.example .env
    ```
5. **Generate key aplikasi Laravel:**
    ```bash
    php artisan key:generate
    ```
6. **Migrasi & seed database:**
    ```bash
    php artisan migrate --seed
    ```
7. **Buat symlink storage:**

    ```bash
    php artisan storage:link
    ```
8. **Install DOMPdf**
   
   ```bash
   composer require barryvdh/laravel-dompdf
   ```
9. **Jalankan aset frontend & server:**

    ```bash
    composer run dev
    ```

10. Akses aplikasi di http://localhost:8000

## Tutorial Lengkap Instalasi & Penggunaan

### 1. Konfigurasi .env

- Pastikan variabel berikut sudah benar:
    - `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` (untuk MySQL)
    - `APP_URL` (http://localhost:8000)
    - `FRONTEND_URL` (http://localhost:5173 jika frontend dipisah)
    - Konfigurasi mail untuk fitur reset password

### 2. Jalankan Migrasi & Seeder

- Seeder akan membuat akun admin default:
    - **Email:** admin@gmail.com
    - **Password:** admin
- Ubah password admin setelah login pertama demi keamanan!

### 3. Install DOMPdf
- composer require barryvdh/laravel-dompdf

### 4. Jalankan Frontend & Backend

- Jalankan kedua server:
    - composer run dev
- Jika menggunakan XAMPP, pastikan MySQL & Apache running.

### 5. Storage & Permissions

- Jika terjadi error pada upload/download file:
    - Pastikan folder `storage` dan `bootstrap/cache` dapat ditulis (writeable)
    - Jalankan: `php artisan storage:link` setelah deploy/move project

### 6. Penggunaan Sistem

#### **Sebagai Penduduk:**

1. Daftar akun baru
2. Login
3. Akses dashboard, ajukan dokumen sesuai kebutuhan
4. Pantau status pengajuan (Diproses, Disetujui, Ditolak)
5. Unduh/cetak dokumen PDF jika sudah disetujui
6. Baca berita pemerintahan

#### **Sebagai Admin:**

1. Login dengan akun admin
2. Kelola data penduduk (tambah/edit/hapus/cari)
3. Proses pengajuan dokumen (approve/tolak dengan catatan)
4. Upload, edit, atau hapus berita
5. Pantau log aktivitas sistem

### 6. Reset Password

- Gunakan fitur "Lupa Password" di halaman login (pastikan konfigurasi mail sudah benar)

---

## Troubleshooting

- **Error database:** Pastikan MySQL berjalan & konfigurasi .env benar
- **Error storage:** Jalankan `php artisan storage:link` dan cek permission folder
- **Frontend tidak tampil:** Pastikan `npm run dev` sukses tanpa error
- **Cek log error:**
    - Backend: `storage/logs/laravel.log`
    - Frontend: console browser / terminal

---

## Struktur Direktori Penting

- `/app`, `/routes`, `/database` (Laravel backend)
- `/src` (React frontend)
- `/public` (assets publik & entrypoint)

---

## Catatan Keamanan

- Segera ganti password admin default setelah instalasi
- Jangan expose .env ke publik
- Gunakan HTTPS di production

---

@2025 vickymosasan
