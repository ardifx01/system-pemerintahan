# Website Pemerintahan

Aplikasi website resmi pemerintahan menggunakan Laravel dan TypeScript untuk menyediakan layanan informasi publik dan administrasi pemerintahan secara online.

# Website Pemerintahan

Sistem informasi pemerintahan berbasis web yang dikembangkan menggunakan Laravel dan TypeScript. Platform ini menyediakan layanan administrasi publik dan pengelolaan dokumen kependudukan secara online dengan antarmuka yang modern dan responsif.

## Deskripsi

Sistem ini mengharuskan setiap pengguna untuk registrasi dan login terlebih dahulu sebelum mengakses fitur apapun. Terdapat dua jenis pengguna: Admin dan Penduduk.

- **Penduduk** dapat mendaftar, mengajukan dan mencetak KTP, KK, Akta Kelahiran, dan Akta Kematian, serta membaca berita pemerintahan.
- **Admin** memiliki akses penuh untuk mengelola penduduk, dokumen, berita, dan log aktivitas pengguna.

## Teknologi

- **Backend**: Laravel 12+
- **Frontend**: React dengan TypeScript
- **Database**: MySQL
- **Styling**: TailwindCSS
- **Authentication**: Laravel Sanctum
- **PDF Generation**: DomPDF

## Fitur Utama

### Sistem Autentikasi

- Login dan registrasi penduduk
- Login khusus admin
- Verifikasi akun penduduk oleh admin

### Fitur Penduduk

- Dashboard penduduk dengan statistik dokumen
- Pengajuan dokumen (KTP, KK, Akta Kelahiran, Akta Kematian)
- Pelacakan status dokumen (Diproses, Selesai, Ditolak)
- Unduh dokumen dalam format PDF
- Akses ke berita pemerintahan terbaru

### Fitur Admin

- Dashboard admin dengan statistik kependudukan
- Verifikasi akun penduduk baru
- Manajemen data penduduk
- Pemrosesan pengajuan dokumen
- Manajemen berita pemerintahan
- Log aktivitas sistem

## Instalasi

### Persyaratan Sistem

- PHP 8.1+
- Node.js 18+
- Composer
- MySQL 8.0+
- XAMPP/Laravel Sail/Docker (opsional)

### Langkah Instalasi

1. Clone repositori

    ```
    git clone https://github.com/yourusername/website-pemerintahan.git
    cd website-pemerintahan
    ```

2. Instal dependensi PHP

    ```
    composer install
    ```

3. Instal dependensi JavaScript

    ```
    npm install
    ```

4. Salin file .env.example menjadi .env

    ```
    cp .env.example .env
    ```

5. Konfigurasi database dan kredensial lainnya di file .env

6. Generate key aplikasi

    ```
    php artisan key:generate
    ```

7. Migrasi database

    ```
    php artisan migrate --seed
    ```

8. Kompilasi aset frontend

    ```
    npm run dev
    ```

9. Jalankan server

    ```
    php artisan serve
    ```

10. Akses aplikasi di http://localhost:8000

## Penggunaan

### Akun Default

- **Admin**: admin@example.com / password: admin123
- **Penduduk**: penduduk@example.com / password: penduduk123

### Alur Penggunaan Untuk Penduduk

1. Daftar akun baru atau login dengan akun yang sudah ada
2. Tunggu verifikasi akun oleh admin
3. Akses dashboard untuk mengajukan dokumen
4. Isi formulir pengajuan dokumen
5. Pantau status pengajuan
6. Unduh dokumen yang telah disetujui

### Alur Penggunaan Untuk Admin

1. Login dengan kredensial admin
2. Verifikasi akun penduduk baru
3. Kelola data penduduk
4. Proses pengajuan dokumen
5. Kelola berita pemerintahan
6. Pantau log aktivitas sistem

## Lisensi

Project ini dilisensikan di bawah [MIT License](LICENSE).
