# 📖 MANUAL BOOK - SISTEM PEMERINTAHAN DIGITAL

**Sistem Informasi Pemerintahan Modern**  
*Panduan Lengkap Penggunaan dan Administrasi*

---

## 📋 DAFTAR ISI

### 🏠 [BAGIAN I - PENGENALAN SISTEM](#bagian-i---pengenalan-sistem)
1. [Tentang Sistem](#1-tentang-sistem)
2. [Fitur Utama](#2-fitur-utama)
3. [Persyaratan Sistem](#3-persyaratan-sistem)
4. [Teknologi yang Digunakan](#4-teknologi-yang-digunakan)

### ⚙️ [BAGIAN II - INSTALASI DAN KONFIGURASI](#bagian-ii---instalasi-dan-konfigurasi)
1. [Persiapan Instalasi](#1-persiapan-instalasi)
2. [Instalasi Step-by-Step](#2-instalasi-step-by-step)
3. [Konfigurasi Database](#3-konfigurasi-database)
4. [Konfigurasi Environment](#4-konfigurasi-environment)
5. [Menjalankan Sistem](#5-menjalankan-sistem)

### 👥 [BAGIAN III - PANDUAN PENGGUNA (PENDUDUK)](#bagian-iii---panduan-pengguna-penduduk)
1. [Registrasi Akun](#1-registrasi-akun)
2. [Login ke Sistem](#2-login-ke-sistem)
3. [Dashboard Penduduk](#3-dashboard-penduduk)
4. [Pengajuan Dokumen](#4-pengajuan-dokumen)
5. [Melacak Status Dokumen](#5-melacak-status-dokumen)
6. [Download Dokumen](#6-download-dokumen)
7. [Membaca Berita](#7-membaca-berita)
8. [Pengaturan Profil](#8-pengaturan-profil)

### 🔧 [BAGIAN IV - PANDUAN ADMINISTRATOR](#bagian-iv---panduan-administrator)
1. [Login Administrator](#1-login-administrator)
2. [Dashboard Admin](#2-dashboard-admin)
3. [Manajemen Penduduk](#3-manajemen-penduduk)
4. [Proses Dokumen](#4-proses-dokumen)
5. [Manajemen Berita](#5-manajemen-berita)
6. [Log Aktivitas](#6-log-aktivitas)
7. [Pengaturan Sistem](#7-pengaturan-sistem)

### 🛠️ [BAGIAN V - TROUBLESHOOTING](#bagian-v---troubleshooting)
1. [Masalah Umum](#1-masalah-umum)
2. [Error Database](#2-error-database)
3. [Masalah Upload File](#3-masalah-upload-file)
4. [Masalah Autentikasi](#4-masalah-autentikasi)
5. [FAQ (Frequently Asked Questions)](#5-faq-frequently-asked-questions)

### 📚 [BAGIAN VI - DOKUMENTASI TEKNIS](#bagian-vi---dokumentasi-teknis)
1. [Arsitektur Sistem](#1-arsitektur-sistem)
2. [Database Schema](#2-database-schema)
3. [API Endpoints](#3-api-endpoints)
4. [Security Features](#4-security-features)
5. [Backup dan Recovery](#5-backup-dan-recovery)

---

## BAGIAN I - PENGENALAN SISTEM

### 1. Tentang Sistem

**Sistem Pemerintahan Digital** adalah platform modern berbasis web yang dikembangkan untuk memfasilitasi layanan administrasi publik dan pengelolaan dokumen kependudukan secara online. Sistem ini menggabungkan teknologi Laravel (backend) dan React dengan TypeScript (frontend) untuk memberikan pengalaman pengguna yang optimal.

#### 🎯 Tujuan Sistem:
- Digitalisasi layanan pemerintahan
- Mempermudah akses layanan publik
- Meningkatkan efisiensi administrasi
- Transparansi proses pelayanan
- Mengurangi birokrasi berbelit-belit

#### 👥 Target Pengguna:
- **Penduduk**: Warga yang membutuhkan layanan dokumen kependudukan
- **Administrator**: Petugas pemerintah yang mengelola sistem dan memproses dokumen

### 2. Fitur Utama

#### 🔐 **Sistem Autentikasi Aman**
- Registrasi dan login untuk penduduk
- Login khusus untuk administrator
- Verifikasi email
- Reset password
- Session management yang aman

#### 👤 **Fitur untuk Penduduk**
- **Dashboard Pribadi**: Statistik personal dan ringkasan aktivitas
- **Pengajuan Dokumen**: 
  - KTP (Baru, Perpanjangan, Penggantian)
  - Kartu Keluarga (KK)
  - Akta Kelahiran
  - Akta Kematian
- **Pelacakan Status**: Real-time tracking pengajuan dokumen
- **Download PDF**: Unduh dokumen resmi yang telah disetujui
- **Berita Pemerintahan**: Akses informasi terbaru dari pemerintah
- **Profil Management**: Kelola data pribadi

#### 🛡️ **Fitur untuk Administrator**
- **Dashboard Statistik**: Overview lengkap sistem dan aktivitas
- **Manajemen Penduduk**: CRUD data penduduk
- **Proses Dokumen**: Approve/reject pengajuan dengan catatan
- **Manajemen Berita**: Buat, edit, dan publikasi berita
- **Log Aktivitas**: Monitoring semua aktivitas sistem
- **Laporan**: Generate berbagai laporan statistik

### 3. Persyaratan Sistem

#### 🖥️ **Server Requirements**
- **PHP**: 8.1 atau lebih tinggi
- **Node.js**: 18.0 atau lebih tinggi
- **Database**: MySQL 8.0+ atau MariaDB 10.3+
- **Web Server**: Apache 2.4+ atau Nginx 1.18+
- **Memory**: Minimum 2GB RAM
- **Storage**: Minimum 5GB free space

#### 📦 **Software Dependencies**
- **Composer**: PHP dependency manager
- **NPM/Yarn**: Node.js package manager
- **Git**: Version control system

#### 🌐 **Browser Support**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### 4. Teknologi yang Digunakan

#### 🔧 **Backend Stack**
- **Framework**: Laravel 12+
- **Language**: PHP 8.1+
- **Database**: MySQL 8.0+
- **Authentication**: Laravel Sanctum
- **PDF Generation**: DomPDF
- **File Storage**: Laravel Storage

#### 🎨 **Frontend Stack**
- **Framework**: React 19+
- **Language**: TypeScript 5.7+
- **Build Tool**: Vite 6.0+
- **UI Framework**: Tailwind CSS 4.0+
- **Component Library**: Radix UI
- **State Management**: React Hooks
- **HTTP Client**: Axios
- **Routing**: Inertia.js

#### 🔗 **Integration**
- **Full-Stack**: Inertia.js (seamless SPA experience)
- **Real-time**: Laravel Echo (optional)
- **Email**: Laravel Mail
- **Queue**: Laravel Queue (for background jobs)

---

## BAGIAN II - INSTALASI DAN KONFIGURASI

### 1. Persiapan Instalasi

#### 📋 **Checklist Persiapan**
Sebelum memulai instalasi, pastikan Anda telah menyiapkan:

- [ ] Server dengan spesifikasi minimum yang telah disebutkan
- [ ] Akses root/administrator ke server
- [ ] Koneksi internet yang stabil
- [ ] Database MySQL yang sudah terinstall
- [ ] Domain atau subdomain (untuk production)

#### 🛠️ **Instalasi Prerequisites**

**1. Install PHP 8.1+**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install php8.1 php8.1-cli php8.1-fpm php8.1-mysql php8.1-xml php8.1-curl php8.1-zip php8.1-mbstring php8.1-gd

# CentOS/RHEL
sudo yum install php81 php81-cli php81-fpm php81-mysql php81-xml php81-curl php81-zip php81-mbstring php81-gd
```

**2. Install Composer**
```bash
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
composer --version
```

**3. Install Node.js 18+**
```bash
# Menggunakan NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verifikasi instalasi
node --version
npm --version
```

**4. Install MySQL 8.0+**
```bash
# Ubuntu/Debian
sudo apt install mysql-server mysql-client

# Start dan enable MySQL
sudo systemctl start mysql
sudo systemctl enable mysql

# Secure installation
sudo mysql_secure_installation
```

### 2. Instalasi Step-by-Step

#### 📥 **Step 1: Clone Repository**
```bash
# Clone dari repository
git clone https://github.com/vickyymosafan/Website-Government-Laravel-Typescript.git

# Masuk ke direktori project
cd Website-Government-Laravel-Typescript

# Atau jika menggunakan nama folder custom
cd system-pemerintahan
```

#### 📦 **Step 2: Install Dependencies Backend**
```bash
# Install PHP dependencies menggunakan Composer
composer install

# Jika ada error permission, jalankan:
sudo chown -R $USER:$USER .
composer install
```

#### 🎨 **Step 3: Install Dependencies Frontend**
```bash
# Install Node.js dependencies
npm install

# Atau menggunakan Yarn (jika prefer)
yarn install
```

#### ⚙️ **Step 4: Konfigurasi Environment**
```bash
# Copy file environment
cp .env.example .env

# Generate application key
php artisan key:generate
```

#### 🗄️ **Step 5: Setup Database**
```bash
# Buat database baru
mysql -u root -p
CREATE DATABASE sistem_pemerintahan;
CREATE USER 'pemerintahan_user'@'localhost' IDENTIFIED BY 'password_kuat_123';
GRANT ALL PRIVILEGES ON sistem_pemerintahan.* TO 'pemerintahan_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### 🔄 **Step 6: Migrasi dan Seeding**
```bash
# Jalankan migrasi database
php artisan migrate

# Jalankan seeder untuk data awal
php artisan db:seed

# Atau jalankan keduanya sekaligus
php artisan migrate --seed
```

#### 🔗 **Step 7: Setup Storage**
```bash
# Buat symbolic link untuk storage
php artisan storage:link

# Set permission yang benar
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

#### 📄 **Step 8: Install PDF Generator**
```bash
# Install DomPDF untuk generate PDF
composer require barryvdh/laravel-dompdf

# Publish config (optional)
php artisan vendor:publish --provider="Barryvdh\DomPDF\ServiceProvider"
```

### 3. Konfigurasi Database

#### 📝 **Edit File .env**
Buka file `.env` dan sesuaikan konfigurasi database:

```env
# Database Configuration
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sistem_pemerintahan
DB_USERNAME=pemerintahan_user
DB_PASSWORD=password_kuat_123

# Application Configuration
APP_NAME="Sistem Pemerintahan"
APP_ENV=local
APP_KEY=base64:GENERATED_KEY_HERE
APP_DEBUG=true
APP_URL=http://localhost:8000

# Frontend URL (jika dipisah)
FRONTEND_URL=http://localhost:5173

# Session Configuration
SESSION_DRIVER=file
SESSION_LIFETIME=120

# Cache Configuration
CACHE_DRIVER=file
QUEUE_CONNECTION=sync
```

#### 🔐 **Konfigurasi Keamanan**
```env
# Security Settings
BCRYPT_ROUNDS=12
SANCTUM_STATEFUL_DOMAINS=localhost:8000,127.0.0.1:8000

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:8000,http://127.0.0.1:8000
```

### 4. Konfigurasi Environment

#### 📧 **Konfigurasi Email (Optional)**
Untuk fitur reset password dan notifikasi:

```env
# Mail Configuration
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="${APP_NAME}"
```

#### 📁 **Konfigurasi File Storage**
```env
# Filesystem Configuration
FILESYSTEM_DISK=local
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false
```

#### 🔄 **Konfigurasi Queue (Optional)**
Untuk background jobs:

```env
# Queue Configuration
QUEUE_CONNECTION=database
# atau untuk Redis
QUEUE_CONNECTION=redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
```

### 5. Menjalankan Sistem

#### 🚀 **Development Mode**
```bash
# Jalankan backend dan frontend sekaligus
composer run dev

# Atau jalankan terpisah:
# Terminal 1 - Backend
php artisan serve

# Terminal 2 - Frontend
npm run dev
```

#### 🌐 **Production Mode**
```bash
# Build frontend assets
npm run build

# Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Setup web server (Apache/Nginx)
# Point document root ke /public folder
```

#### ✅ **Verifikasi Instalasi**
1. Buka browser dan akses `http://localhost:8000`
2. Pastikan halaman welcome muncul tanpa error
3. Test login dengan akun admin default:
   - **Email**: admin@gmail.com
   - **Password**: admin
4. Pastikan semua fitur berfungsi normal

#### 🔧 **Post-Installation Tasks**
```bash
# Ubah password admin default
# Login sebagai admin → Settings → Change Password

# Setup cron job untuk scheduled tasks (production)
# Tambahkan ke crontab:
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1

# Setup log rotation
sudo nano /etc/logrotate.d/laravel
```

## BAGIAN III - PANDUAN PENGGUNA (PENDUDUK)

### 1. Registrasi Akun

#### 🆕 **Membuat Akun Baru**

**Step 1: Akses Halaman Registrasi**
1. Buka browser dan kunjungi website sistem pemerintahan
2. Klik tombol **"Daftar"** atau **"Register"** di halaman utama
3. Anda akan diarahkan ke halaman registrasi

**Step 2: Mengisi Form Registrasi**
Lengkapi form registrasi dengan informasi berikut:

| Field | Keterangan | Contoh |
|-------|------------|---------|
| **Nama Lengkap** | Nama sesuai KTP | John Doe |
| **Email** | Email aktif untuk verifikasi | john.doe@email.com |
| **Password** | Min. 8 karakter, kombinasi huruf & angka | MyPass123! |
| **Konfirmasi Password** | Ulangi password yang sama | MyPass123! |
| **NIK** | Nomor Induk Kependudukan | 1234567890123456 |
| **No. Telepon** | Nomor HP aktif | 081234567890 |

**Step 3: Verifikasi Data**
- Pastikan semua data yang dimasukkan benar dan valid
- Centang kotak persetujuan syarat dan ketentuan
- Klik tombol **"Daftar"**

**Step 4: Verifikasi Email**
1. Cek email Anda (termasuk folder spam)
2. Buka email verifikasi dari sistem
3. Klik link verifikasi dalam email
4. Akun Anda akan aktif dan siap digunakan

#### ⚠️ **Tips Registrasi**
- Gunakan email yang aktif dan mudah diakses
- Password harus kuat dan mudah diingat
- NIK harus valid dan sesuai dengan dokumen resmi
- Simpan informasi login di tempat yang aman

### 2. Login ke Sistem

#### 🔐 **Cara Login**

**Step 1: Akses Halaman Login**
1. Kunjungi website sistem pemerintahan
2. Klik tombol **"Masuk"** atau **"Login"**

**Step 2: Masukkan Kredensial**
- **Email**: Masukkan email yang terdaftar
- **Password**: Masukkan password Anda
- Centang **"Ingat Saya"** jika menggunakan perangkat pribadi

**Step 3: Akses Dashboard**
- Klik tombol **"Masuk"**
- Anda akan diarahkan ke dashboard penduduk

#### 🔄 **Lupa Password**
Jika lupa password:
1. Klik **"Lupa Password?"** di halaman login
2. Masukkan email terdaftar
3. Cek email untuk link reset password
4. Ikuti instruksi untuk membuat password baru

#### 🚪 **Logout**
Untuk keluar dari sistem:
1. Klik foto profil di pojok kanan atas
2. Pilih **"Logout"** dari dropdown menu
3. Anda akan diarahkan kembali ke halaman utama

### 3. Dashboard Penduduk

#### 📊 **Overview Dashboard**
Dashboard adalah halaman utama setelah login yang menampilkan:

**Panel Statistik Personal:**
- Total dokumen yang pernah diajukan
- Dokumen yang sedang diproses
- Dokumen yang telah selesai
- Dokumen yang ditolak

**Panel Aktivitas Terbaru:**
- Riwayat pengajuan dokumen terbaru
- Update status dokumen
- Notifikasi penting

**Quick Actions:**
- Tombol cepat untuk mengajukan dokumen baru
- Akses ke berita terbaru
- Link ke pengaturan profil

#### 🎯 **Navigasi Dashboard**
**Menu Utama:**
- **Dashboard**: Halaman utama dengan statistik
- **Dokumen**: Kelola pengajuan dokumen
- **Berita**: Baca berita pemerintahan
- **Profil**: Pengaturan akun dan data pribadi

**Informasi Status:**
- 🟡 **DIPROSES**: Dokumen sedang dalam review
- 🟢 **SELESAI**: Dokumen telah disetujui dan siap diunduh
- 🔴 **DITOLAK**: Dokumen ditolak dengan catatan perbaikan

### 4. Pengajuan Dokumen

#### 📋 **Jenis Dokumen yang Tersedia**

**1. KTP (Kartu Tanda Penduduk)**
- KTP Baru
- Perpanjangan KTP
- Penggantian KTP (hilang/rusak)

**2. KK (Kartu Keluarga)**
- KK Baru
- Perubahan data KK
- Penambahan anggota keluarga

**3. Akta Kelahiran**
- Akta kelahiran baru
- Duplikat akta kelahiran

**4. Akta Kematian**
- Akta kematian baru
- Duplikat akta kematian

#### 📝 **Cara Mengajukan Dokumen**

**Step 1: Pilih Jenis Dokumen**
1. Dari dashboard, klik menu **"Dokumen"**
2. Klik tombol **"Ajukan Dokumen Baru"**
3. Pilih jenis dokumen yang diinginkan

**Step 2: Isi Form Pengajuan**
Setiap jenis dokumen memiliki form yang berbeda:

**Form KTP:**
- Data Pribadi (NIK, Nama, Alamat)
- Tempat & Tanggal Lahir
- Jenis Kelamin
- Agama
- Status Perkawinan
- Pekerjaan
- Kewarganegaraan
- Jenis Permohonan (Baru/Perpanjangan/Penggantian)
- Upload scan KTP lama (jika perpanjangan/penggantian)

**Form Kartu Keluarga:**
- Data Kepala Keluarga
- Data Anggota Keluarga
- Alamat Lengkap
- Hubungan Keluarga
- Upload dokumen pendukung

**Form Akta Kelahiran:**
- Data Bayi/Anak
- Data Orang Tua
- Tempat & Tanggal Lahir
- Upload dokumen pendukung

**Form Akta Kematian:**
- Data Almarhum
- Tanggal & Tempat Meninggal
- Penyebab Kematian
- Data Pelapor
- Upload dokumen pendukung

**Step 3: Upload Dokumen Pendukung**
- Pastikan file dalam format PDF, JPG, atau PNG
- Ukuran maksimal 2MB per file
- Scan dokumen harus jelas dan terbaca

**Step 4: Review dan Submit**
1. Periksa kembali semua data yang dimasukkan
2. Pastikan dokumen pendukung sudah diupload
3. Centang persetujuan data
4. Klik **"Ajukan Dokumen"**

#### ✅ **Setelah Pengajuan**
- Sistem akan memberikan nomor referensi pengajuan
- Status awal akan menjadi **"DIPROSES"**
- Anda akan menerima notifikasi email konfirmasi
- Dokumen akan diproses oleh admin dalam 1-3 hari kerja

### 5. Melacak Status Dokumen

#### 📍 **Cara Melihat Status Dokumen**

**Step 1: Akses Halaman Dokumen**
1. Login ke dashboard penduduk
2. Klik menu **"Dokumen"** di sidebar
3. Anda akan melihat daftar semua dokumen yang pernah diajukan

**Step 2: Memahami Status Dokumen**
| Status | Warna | Keterangan | Tindakan |
|--------|-------|------------|----------|
| **DIPROSES** | 🟡 Kuning | Dokumen sedang direview admin | Tunggu proses review |
| **SELESAI** | 🟢 Hijau | Dokumen disetujui dan siap diunduh | Download dokumen PDF |
| **DITOLAK** | 🔴 Merah | Dokumen ditolak dengan catatan | Perbaiki dan ajukan ulang |

**Step 3: Melihat Detail Dokumen**
1. Klik pada dokumen yang ingin dilihat detailnya
2. Anda akan melihat:
   - Informasi lengkap pengajuan
   - Status terkini
   - Catatan dari admin (jika ada)
   - Riwayat perubahan status
   - Tombol aksi (download/edit)

#### 🔔 **Notifikasi Status**
- Email otomatis dikirim saat status berubah
- Notifikasi in-app di dashboard
- SMS notification (jika diaktifkan)

### 6. Download Dokumen

#### 📥 **Cara Download Dokumen yang Disetujui**

**Step 1: Pastikan Status SELESAI**
- Hanya dokumen dengan status **SELESAI** yang bisa diunduh
- Dokumen yang ditolak harus diperbaiki dan diajukan ulang

**Step 2: Download PDF**
1. Buka halaman **"Dokumen"**
2. Cari dokumen dengan status **SELESAI**
3. Klik tombol **"Download PDF"**
4. File PDF akan otomatis terunduh

**Step 3: Verifikasi Dokumen**
- Periksa kelengkapan data dalam PDF
- Pastikan ada cap/tanda tangan digital
- Simpan file PDF di tempat yang aman

#### 🖨️ **Mencetak Dokumen**
1. Buka file PDF yang telah diunduh
2. Gunakan printer dengan kualitas baik
3. Cetak pada kertas A4 berkualitas
4. Pastikan hasil cetakan jelas dan tidak terpotong

#### 📱 **Tips Penyimpanan**
- Backup file PDF ke cloud storage
- Simpan juga di perangkat mobile
- Buat salinan fisik untuk arsip
- Catat nomor dokumen untuk referensi

### 7. Membaca Berita

#### 📰 **Akses Berita Pemerintahan**

**Step 1: Masuk ke Halaman Berita**
1. Dari dashboard, klik menu **"Berita"**
2. Anda akan melihat daftar berita terbaru

**Step 2: Membaca Berita**
- Berita ditampilkan dalam format card
- Klik judul berita untuk membaca selengkapnya
- Setiap berita menampilkan:
  - Judul berita
  - Tanggal publikasi
  - Penulis/sumber
  - Gambar ilustrasi
  - Konten lengkap

**Step 3: Fitur Berita**
- **Search**: Cari berita berdasarkan kata kunci
- **Filter**: Filter berdasarkan tanggal atau kategori
- **Share**: Bagikan berita ke media sosial
- **Print**: Cetak berita untuk arsip

#### 📋 **Jenis Berita**
- Pengumuman resmi pemerintah
- Perubahan kebijakan
- Jadwal pelayanan
- Event/kegiatan pemerintah
- Tips dan panduan layanan

### 8. Pengaturan Profil

#### ⚙️ **Mengelola Profil Pribadi**

**Step 1: Akses Pengaturan**
1. Klik foto profil di pojok kanan atas
2. Pilih **"Pengaturan"** atau **"Profile"**

**Step 2: Edit Informasi Pribadi**
Data yang bisa diubah:
- Nama lengkap
- Email (perlu verifikasi ulang)
- Nomor telepon
- Alamat
- Foto profil

Data yang TIDAK bisa diubah:
- NIK (Nomor Induk Kependudukan)
- Tanggal lahir

**Step 3: Ganti Password**
1. Klik tab **"Keamanan"**
2. Masukkan password lama
3. Masukkan password baru (min. 8 karakter)
4. Konfirmasi password baru
5. Klik **"Update Password"**

**Step 4: Pengaturan Notifikasi**
Atur preferensi notifikasi:
- Email notifications
- SMS notifications (jika tersedia)
- Push notifications
- Frekuensi notifikasi

#### 🔒 **Tips Keamanan Akun**
- Gunakan password yang kuat dan unik
- Aktifkan notifikasi email untuk aktivitas login
- Logout dari perangkat publik
- Update informasi kontak secara berkala
- Laporkan aktivitas mencurigakan

#### 📞 **Bantuan dan Support**
Jika mengalami kesulitan:
1. **FAQ**: Cek bagian Frequently Asked Questions
2. **Help Center**: Akses pusat bantuan online
3. **Contact Support**: Hubungi tim support via:
   - Email: support@pemerintahan.go.id
   - Telepon: (021) 1234-5678
   - WhatsApp: 0812-3456-7890
4. **Live Chat**: Chat langsung dengan operator (jam kerja)

## BAGIAN IV - PANDUAN ADMINISTRATOR

### 1. Login Administrator

#### 🔐 **Akses Admin Panel**

**Step 1: Login dengan Akun Admin**
1. Kunjungi halaman login sistem
2. Masukkan kredensial admin:
   - **Email Default**: admin@gmail.com
   - **Password Default**: admin
3. Setelah login pertama, WAJIB ganti password default

**Step 2: Verifikasi Akses Admin**
- Setelah login, Anda akan diarahkan ke dashboard admin
- Menu admin berbeda dengan menu penduduk
- Pastikan role Anda adalah "Administrator"

#### ⚠️ **Keamanan Admin**
- Segera ganti password default setelah instalasi
- Gunakan password yang sangat kuat (min. 12 karakter)
- Aktifkan two-factor authentication jika tersedia
- Jangan share kredensial admin dengan siapapun

### 2. Dashboard Admin

#### 📊 **Overview Dashboard Admin**

**Panel Statistik Utama:**
- **Total Penduduk**: Jumlah user terdaftar
- **Dokumen Pending**: Dokumen yang menunggu review
- **Total Berita**: Jumlah berita yang dipublikasi
- **Aktivitas Hari Ini**: Ringkasan aktivitas sistem

**Grafik dan Analytics:**
- Tren pengajuan dokumen per bulan
- Statistik approval rate
- Aktivitas user harian
- Distribusi jenis dokumen

**Quick Actions:**
- Proses dokumen pending
- Buat berita baru
- Lihat log aktivitas terbaru
- Kelola data penduduk

#### 🎯 **Navigasi Admin Panel**

**Menu Utama:**
- **Dashboard**: Halaman utama dengan statistik
- **Penduduk**: Manajemen data penduduk
- **Dokumen**: Review dan proses dokumen
- **Berita**: Kelola berita dan pengumuman
- **Log Aktivitas**: Monitor aktivitas sistem
- **Pengaturan**: Konfigurasi sistem

### 3. Manajemen Penduduk

#### 👥 **Kelola Data Penduduk**

**Step 1: Akses Halaman Penduduk**
1. Dari dashboard admin, klik menu **"Penduduk"**
2. Anda akan melihat daftar semua penduduk terdaftar

**Step 2: Fitur Manajemen Penduduk**

**Tabel Data Penduduk menampilkan:**
- NIK (Nomor Induk Kependudukan)
- Nama Lengkap
- Email
- No. Telepon
- Status Akun (Aktif/Nonaktif)
- Tanggal Registrasi
- Aksi (Edit/Hapus/Detail)

**Fitur Search dan Filter:**
- Cari berdasarkan nama, NIK, atau email
- Filter berdasarkan status akun
- Filter berdasarkan tanggal registrasi
- Sort berdasarkan kolom tertentu

#### ➕ **Menambah Penduduk Baru**

**Step 1: Klik Tombol "Tambah Penduduk"**

**Step 2: Isi Form Data Penduduk**
- **Data Pribadi:**
  - NIK (16 digit, unik)
  - Nama Lengkap
  - Email (unik)
  - No. Telepon
  - Alamat Lengkap

- **Data Demografis:**
  - Tempat Lahir
  - Tanggal Lahir
  - Jenis Kelamin
  - Agama
  - Status Perkawinan
  - Pekerjaan
  - Kewarganegaraan

**Step 3: Set Password Awal**
- Generate password otomatis, atau
- Set password manual
- Password akan dikirim via email

#### ✏️ **Edit Data Penduduk**

**Step 1: Klik Tombol "Edit" pada data penduduk**

**Step 2: Update Informasi**
- Semua field bisa diubah kecuali NIK
- Pastikan data sesuai dengan dokumen resmi
- Klik **"Update"** untuk menyimpan

#### 🗑️ **Hapus Data Penduduk**

**⚠️ Peringatan**: Penghapusan data bersifat permanen!

**Step 1: Klik Tombol "Hapus"**
**Step 2: Konfirmasi Penghapusan**
- Sistem akan menampilkan dialog konfirmasi
- Ketik "HAPUS" untuk konfirmasi
- Data penduduk dan semua dokumennya akan terhapus

#### 🔍 **Detail Penduduk**

**Informasi yang ditampilkan:**
- Data pribadi lengkap
- Riwayat pengajuan dokumen
- Log aktivitas user
- Status verifikasi akun

### 4. Proses Dokumen

#### 📋 **Review Pengajuan Dokumen**

**Step 1: Akses Halaman Dokumen**
1. Klik menu **"Dokumen"** di admin panel
2. Anda akan melihat daftar semua pengajuan dokumen

**Step 2: Filter Dokumen**
- **Semua Dokumen**: Tampilkan semua status
- **Pending**: Hanya dokumen yang perlu direview
- **Disetujui**: Dokumen yang sudah diproses
- **Ditolak**: Dokumen yang ditolak

**Filter Tambahan:**
- Berdasarkan jenis dokumen (KTP, KK, Akta)
- Berdasarkan tanggal pengajuan
- Berdasarkan nama pemohon

#### ✅ **Menyetujui Dokumen**

**Step 1: Klik Dokumen yang Akan Direview**
- Sistem akan menampilkan detail lengkap pengajuan
- Review semua data yang dimasukkan pemohon
- Periksa dokumen pendukung yang diupload

**Step 2: Verifikasi Data**
Pastikan data berikut benar:
- NIK valid dan sesuai format
- Nama sesuai dengan dokumen pendukung
- Alamat lengkap dan jelas
- Data demografis akurat
- Dokumen pendukung jelas dan terbaca

**Step 3: Approve Dokumen**
1. Jika semua data benar, klik **"Setujui"**
2. Tambahkan catatan approval (optional)
3. Sistem akan generate PDF dokumen resmi
4. Status berubah menjadi **"SELESAI"**
5. Pemohon akan menerima notifikasi email

#### ❌ **Menolak Dokumen**

**Step 1: Identifikasi Masalah**
Dokumen ditolak jika:
- Data tidak lengkap atau salah
- Dokumen pendukung tidak jelas
- NIK tidak valid
- Informasi tidak sesuai

**Step 2: Reject dengan Catatan**
1. Klik tombol **"Tolak"**
2. **WAJIB** berikan catatan penolakan yang jelas:
   - Jelaskan masalah yang ditemukan
   - Berikan instruksi perbaikan
   - Sebutkan dokumen yang perlu dilengkapi
3. Klik **"Tolak Dokumen"**

**Contoh Catatan Penolakan:**
```
Dokumen ditolak karena:
1. Foto KTP tidak jelas, mohon upload ulang dengan resolusi tinggi
2. Data alamat tidak lengkap, mohon cantumkan RT/RW
3. Dokumen pendukung akta kelahiran belum diupload

Silakan perbaiki dan ajukan kembali.
```

#### 📄 **Generate PDF Dokumen**

**Untuk Dokumen yang Disetujui:**
- Sistem otomatis generate PDF dengan template resmi
- PDF berisi data lengkap pemohon
- Dilengkapi dengan cap digital dan nomor dokumen
- QR code untuk verifikasi (jika diaktifkan)

### 5. Manajemen Berita

#### 📰 **Kelola Berita Pemerintahan**

**Step 1: Akses Halaman Berita Admin**
1. Klik menu **"Berita"** di admin panel
2. Anda akan melihat daftar semua berita

**Informasi yang ditampilkan:**
- Judul berita
- Status (Published/Draft)
- Penulis
- Tanggal publikasi
- Jumlah views (jika ada)
- Aksi (Edit/Hapus/View)

#### ➕ **Membuat Berita Baru**

**Step 1: Klik "Buat Berita Baru"**

**Step 2: Isi Form Berita**
- **Judul**: Judul berita yang menarik dan informatif
- **Konten**: Isi berita lengkap (support rich text editor)
- **Gambar**: Upload gambar ilustrasi (optional)
- **Penulis**: Nama penulis berita
- **Status**:
  - **Draft**: Simpan sebagai draft
  - **Published**: Publikasi langsung

**Step 3: Format Konten**
Editor berita mendukung:
- Bold, italic, underline text
- Bullet points dan numbering
- Insert links
- Insert images
- Text alignment
- Heading styles

**Step 4: Preview dan Publish**
1. Gunakan tombol **"Preview"** untuk melihat hasil
2. Jika sudah sesuai, klik **"Publikasi"**
3. Berita akan langsung tampil di halaman publik

#### ✏️ **Edit Berita Existing**

**Step 1: Klik Tombol "Edit" pada berita**

**Step 2: Update Konten**
- Semua field bisa diubah
- Perubahan akan tersimpan otomatis
- Klik **"Update"** untuk menyimpan

**Step 3: Update Gambar**
- Klik **"Ganti Gambar"** untuk upload gambar baru
- Gambar lama akan otomatis terhapus
- Format yang didukung: JPG, PNG, GIF
- Ukuran maksimal: 2MB

#### 🗑️ **Hapus Berita**

**Step 1: Klik Tombol "Hapus"**
**Step 2: Konfirmasi Penghapusan**
- Sistem akan menampilkan dialog konfirmasi
- Penghapusan bersifat permanen
- Klik **"Ya, Hapus"** untuk konfirmasi

#### 📊 **Statistik Berita**
- Total berita published
- Total views semua berita
- Berita paling populer
- Tren pembacaan per bulan

### 6. Log Aktivitas

#### 📝 **Monitor Aktivitas Sistem**

**Step 1: Akses Log Aktivitas**
1. Klik menu **"Log Aktivitas"** di admin panel
2. Anda akan melihat daftar semua aktivitas sistem

**Informasi yang dicatat:**
- **User**: Siapa yang melakukan aktivitas
- **Aktivitas**: Jenis aktivitas yang dilakukan
- **Waktu**: Timestamp aktivitas
- **IP Address**: Alamat IP user
- **Detail**: Informasi tambahan aktivitas

#### 🔍 **Jenis Aktivitas yang Dicatat**

**Aktivitas User:**
- Login/Logout
- Registrasi akun baru
- Update profil
- Pengajuan dokumen
- Download dokumen

**Aktivitas Admin:**
- Login admin
- Approve/reject dokumen
- Tambah/edit/hapus penduduk
- Buat/edit/hapus berita
- Perubahan pengaturan sistem

#### 🔎 **Filter dan Search Log**

**Filter berdasarkan:**
- Tanggal aktivitas
- Jenis aktivitas
- User tertentu
- IP address

**Search berdasarkan:**
- Nama user
- Jenis aktivitas
- Detail aktivitas

#### 📊 **Analisis Log**
- Aktivitas per hari/minggu/bulan
- User paling aktif
- Jam sibuk sistem
- Deteksi aktivitas mencurigakan

### 7. Pengaturan Sistem

#### ⚙️ **Konfigurasi Sistem**

**Step 1: Akses Pengaturan**
1. Klik menu **"Pengaturan"** di admin panel
2. Pilih kategori pengaturan yang ingin diubah

#### 🏢 **Pengaturan Umum**

**Informasi Instansi:**
- Nama instansi/pemerintahan
- Alamat lengkap
- Nomor telepon
- Email resmi
- Website resmi
- Logo instansi

**Pengaturan Aplikasi:**
- Nama aplikasi
- Deskripsi aplikasi
- Timezone
- Bahasa default
- Format tanggal
- Mata uang (jika ada)

#### 📧 **Pengaturan Email**

**SMTP Configuration:**
- SMTP Host
- SMTP Port
- Username & Password
- Encryption (TLS/SSL)
- From Address & Name

**Template Email:**
- Welcome email untuk user baru
- Notifikasi status dokumen
- Reset password email
- Newsletter template

#### 🔒 **Pengaturan Keamanan**

**Password Policy:**
- Minimum panjang password
- Kompleksitas password
- Masa berlaku password
- Riwayat password

**Session Management:**
- Session timeout
- Maximum concurrent sessions
- Remember me duration

**Security Features:**
- Enable/disable registration
- Email verification required
- Two-factor authentication
- IP whitelist untuk admin

#### 📁 **Pengaturan File**

**Upload Settings:**
- Maximum file size
- Allowed file types
- Storage location
- Compression settings

**PDF Settings:**
- PDF template untuk dokumen
- Watermark settings
- Digital signature
- QR code generation

#### 🔔 **Pengaturan Notifikasi**

**Email Notifications:**
- Notifikasi untuk admin
- Notifikasi untuk user
- Frequency settings

**System Alerts:**
- Error notifications
- Security alerts
- Maintenance notifications

#### 💾 **Backup dan Maintenance**

**Database Backup:**
- Automatic backup schedule
- Backup retention period
- Backup location
- Restore procedures

**System Maintenance:**
- Maintenance mode
- Scheduled maintenance
- System updates
- Log cleanup

#### 📊 **Laporan dan Analytics**

**Generate Laporan:**
- Laporan bulanan dokumen
- Statistik user
- Performance report
- Security audit report

**Export Options:**
- PDF format
- Excel format
- CSV format
- Print-friendly version

## BAGIAN V - TROUBLESHOOTING

### 1. Masalah Umum

#### 🚫 **Tidak Bisa Mengakses Website**

**Gejala:**
- Website tidak bisa dibuka
- Error "This site can't be reached"
- Loading terus-menerus

**Solusi:**
1. **Periksa Koneksi Internet**
   ```bash
   ping google.com
   ```

2. **Clear Browser Cache**
   - Chrome: Ctrl+Shift+Delete
   - Firefox: Ctrl+Shift+Delete
   - Safari: Cmd+Option+E

3. **Coba Browser Lain**
   - Test dengan browser berbeda
   - Disable extensions/add-ons

4. **Periksa DNS**
   ```bash
   nslookup domain-website.com
   ipconfig /flushdns  # Windows
   sudo dscacheutil -flushcache  # macOS
   ```

#### 🔄 **Website Lambat Loading**

**Penyebab Umum:**
- Server overload
- Database query lambat
- File assets terlalu besar
- Koneksi internet lambat

**Solusi:**
1. **Optimize Browser**
   - Clear cache dan cookies
   - Disable extensions yang tidak perlu
   - Update browser ke versi terbaru

2. **Periksa Network**
   - Test speed internet
   - Gunakan WiFi yang stabil
   - Hindari jam sibuk

3. **Untuk Admin (Server-side)**
   ```bash
   # Periksa resource server
   top
   df -h
   free -m

   # Optimize database
   php artisan optimize
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

#### 📱 **Masalah Responsive Design**

**Gejala:**
- Layout berantakan di mobile
- Tombol tidak bisa diklik
- Text terlalu kecil/besar

**Solusi:**
1. **Clear Mobile Browser Cache**
2. **Update Browser Mobile**
3. **Periksa Zoom Level** (set ke 100%)
4. **Rotate Device** (portrait/landscape)

### 2. Error Database

#### 🗄️ **Database Connection Error**

**Error Message:**
```
SQLSTATE[HY000] [2002] Connection refused
Database connection failed
```

**Solusi:**

1. **Periksa MySQL Service**
   ```bash
   # Linux
   sudo systemctl status mysql
   sudo systemctl start mysql

   # Windows (XAMPP)
   # Start MySQL dari XAMPP Control Panel
   ```

2. **Periksa Konfigurasi .env**
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=sistem_pemerintahan
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

3. **Test Database Connection**
   ```bash
   php artisan tinker
   DB::connection()->getPdo();
   ```

4. **Periksa User Privileges**
   ```sql
   SHOW GRANTS FOR 'username'@'localhost';
   GRANT ALL PRIVILEGES ON database_name.* TO 'username'@'localhost';
   FLUSH PRIVILEGES;
   ```

#### 📊 **Migration Error**

**Error Message:**
```
Migration table not found
SQLSTATE[42S02]: Base table or view not found
```

**Solusi:**

1. **Reset Migrations**
   ```bash
   php artisan migrate:reset
   php artisan migrate
   ```

2. **Fresh Migration**
   ```bash
   php artisan migrate:fresh --seed
   ```

3. **Manual Table Creation**
   ```sql
   CREATE TABLE migrations (
       id int unsigned NOT NULL AUTO_INCREMENT,
       migration varchar(255) NOT NULL,
       batch int NOT NULL,
       PRIMARY KEY (id)
   );
   ```

#### 🔒 **Permission Denied Error**

**Error Message:**
```
Access denied for user 'username'@'localhost'
```

**Solusi:**

1. **Reset MySQL Password**
   ```bash
   sudo mysql
   ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'new_password';
   FLUSH PRIVILEGES;
   ```

2. **Create New Database User**
   ```sql
   CREATE USER 'new_user'@'localhost' IDENTIFIED BY 'password';
   GRANT ALL PRIVILEGES ON database_name.* TO 'new_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

### 3. Masalah Upload File

#### 📁 **File Upload Gagal**

**Error Message:**
```
The file failed to upload
Maximum file size exceeded
File type not allowed
```

**Solusi:**

1. **Periksa File Size**
   - Maximum: 2MB per file
   - Compress image jika terlalu besar
   - Gunakan format yang efisien (JPG untuk foto)

2. **Periksa File Type**
   - Allowed: PDF, JPG, JPEG, PNG
   - Convert file ke format yang didukung

3. **Periksa PHP Configuration**
   ```php
   // php.ini
   upload_max_filesize = 2M
   post_max_size = 8M
   max_execution_time = 300
   memory_limit = 256M
   ```

4. **Periksa Storage Permission**
   ```bash
   sudo chown -R www-data:www-data storage/
   sudo chmod -R 775 storage/
   ```

#### 🖼️ **Image Tidak Tampil**

**Gejala:**
- Broken image icon
- Image path error
- 404 error untuk image

**Solusi:**

1. **Periksa Storage Link**
   ```bash
   php artisan storage:link
   ls -la public/storage
   ```

2. **Periksa File Path**
   - Pastikan file ada di storage/app/public/
   - Periksa nama file dan extension

3. **Periksa Permission**
   ```bash
   sudo chmod 644 storage/app/public/images/*
   ```

### 4. Masalah Autentikasi

#### 🔐 **Tidak Bisa Login**

**Gejala:**
- "Invalid credentials" error
- Login form tidak submit
- Redirect loop setelah login

**Solusi:**

1. **Reset Password**
   - Gunakan fitur "Forgot Password"
   - Periksa email (termasuk spam folder)

2. **Clear Session**
   ```bash
   php artisan session:flush
   ```

3. **Periksa User Status**
   ```sql
   SELECT * FROM users WHERE email = 'user@email.com';
   UPDATE users SET email_verified_at = NOW() WHERE email = 'user@email.com';
   ```

4. **Reset Admin Password**
   ```bash
   php artisan tinker
   $user = User::where('email', 'admin@gmail.com')->first();
   $user->password = Hash::make('new_password');
   $user->save();
   ```

#### 📧 **Email Verification Tidak Diterima**

**Solusi:**

1. **Periksa Email Configuration**
   ```env
   MAIL_MAILER=smtp
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USERNAME=your-email@gmail.com
   MAIL_PASSWORD=your-app-password
   MAIL_ENCRYPTION=tls
   ```

2. **Test Email Sending**
   ```bash
   php artisan tinker
   Mail::raw('Test email', function($msg) {
       $msg->to('test@email.com')->subject('Test');
   });
   ```

3. **Manual Verification**
   ```sql
   UPDATE users SET email_verified_at = NOW() WHERE email = 'user@email.com';
   ```

#### 🚪 **Session Expired Terus**

**Solusi:**

1. **Periksa Session Configuration**
   ```env
   SESSION_DRIVER=file
   SESSION_LIFETIME=120
   SESSION_ENCRYPT=false
   SESSION_PATH=/
   SESSION_DOMAIN=null
   ```

2. **Clear Session Files**
   ```bash
   rm -rf storage/framework/sessions/*
   ```

3. **Periksa Server Time**
   ```bash
   date
   timedatectl status
   ```

### 5. FAQ (Frequently Asked Questions)

#### 👤 **Pertanyaan Umum Pengguna**

**Q: Apakah sistem ini gratis untuk digunakan?**
A: Ya, sistem ini gratis untuk semua warga yang membutuhkan layanan dokumen kependudukan.

**Q: Berapa lama proses pengajuan dokumen?**
A: Proses review dokumen biasanya memakan waktu 1-3 hari kerja setelah pengajuan lengkap disubmit.

**Q: Apakah bisa mengajukan beberapa dokumen sekaligus?**
A: Ya, Anda bisa mengajukan beberapa jenis dokumen dalam waktu bersamaan.

**Q: Bagaimana jika data yang saya masukkan salah?**
A: Jika dokumen belum diproses, Anda bisa menghubungi admin. Jika sudah diproses, ajukan dokumen baru dengan data yang benar.

**Q: Apakah dokumen PDF yang dihasilkan sah secara hukum?**
A: Ya, dokumen PDF yang dihasilkan sistem memiliki kekuatan hukum yang sama dengan dokumen fisik.

**Q: Bisakah saya mengakses sistem dari HP?**
A: Ya, sistem ini responsive dan bisa diakses dari smartphone, tablet, atau komputer.

**Q: Bagaimana jika lupa password?**
A: Gunakan fitur "Lupa Password" di halaman login, kemudian cek email untuk link reset password.

**Q: Apakah data pribadi saya aman?**
A: Ya, sistem menggunakan enkripsi dan protokol keamanan standar untuk melindungi data pribadi.

#### 🔧 **Pertanyaan Teknis**

**Q: Browser apa yang didukung?**
A: Sistem mendukung Chrome 90+, Firefox 88+, Safari 14+, dan Edge 90+.

**Q: Kenapa website lambat loading?**
A: Bisa karena koneksi internet, server load tinggi, atau cache browser. Coba clear cache dan refresh.

**Q: Format file apa yang bisa diupload?**
A: Sistem mendukung PDF, JPG, JPEG, dan PNG dengan maksimal ukuran 2MB per file.

**Q: Apakah bisa diakses offline?**
A: Tidak, sistem membutuhkan koneksi internet untuk berfungsi.

**Q: Bagaimana cara backup data saya?**
A: Download semua dokumen PDF yang sudah disetujui dan simpan di tempat yang aman.

#### 🛡️ **Pertanyaan Keamanan**

**Q: Apakah akun saya bisa diretas?**
A: Gunakan password yang kuat dan jangan share kredensial login untuk menjaga keamanan akun.

**Q: Bagaimana jika ada aktivitas mencurigakan di akun saya?**
A: Segera ganti password dan hubungi admin melalui email support.

**Q: Apakah admin bisa melihat password saya?**
A: Tidak, password disimpan dalam bentuk terenkripsi dan tidak bisa dilihat oleh siapapun.

#### 📋 **Pertanyaan Dokumen**

**Q: Dokumen apa saja yang bisa diajukan?**
A: KTP (baru/perpanjangan/penggantian), Kartu Keluarga, Akta Kelahiran, dan Akta Kematian.

**Q: Apa yang harus dilakukan jika dokumen ditolak?**
A: Baca catatan penolakan dari admin, perbaiki sesuai instruksi, kemudian ajukan ulang.

**Q: Bisakah mengajukan dokumen untuk orang lain?**
A: Tidak, setiap orang harus mengajukan dokumen menggunakan akun pribadi masing-masing.

**Q: Bagaimana jika NIK saya sudah terdaftar?**
A: Hubungi admin untuk verifikasi. Mungkin ada duplikasi data atau akun sudah pernah dibuat.

#### 🔧 **Pertanyaan Administrator**

**Q: Bagaimana cara backup database?**
A: Gunakan command `mysqldump` atau fitur backup di admin panel.

**Q: Bisakah mengubah template PDF dokumen?**
A: Ya, template PDF bisa dimodifikasi melalui file view di folder resources/views/pdf/.

**Q: Bagaimana cara menambah jenis dokumen baru?**
A: Perlu modifikasi kode di model Document dan menambah migration untuk field baru.

**Q: Apakah bisa integrasi dengan sistem lain?**
A: Ya, sistem menyediakan API yang bisa diintegrasikan dengan sistem eksternal.

#### 📞 **Kontak Support**

Jika pertanyaan Anda tidak terjawab di FAQ ini, silakan hubungi:

**Email Support:** support@pemerintahan.go.id
**Telepon:** (021) 1234-5678
**WhatsApp:** 0812-3456-7890
**Jam Operasional:** Senin-Jumat, 08:00-17:00 WIB

**Live Chat:** Tersedia di website (jam kerja)
**Forum Komunitas:** forum.pemerintahan.go.id

---

## BAGIAN VI - DOKUMENTASI TEKNIS

### 1. Arsitektur Sistem

#### 🏗️ **Overview Arsitektur**

Sistem Pemerintahan Digital menggunakan arsitektur **Full-Stack Modern** dengan pemisahan yang jelas antara backend dan frontend:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │    Database     │
│   (React +      │◄──►│   (Laravel)     │◄──►│    (MySQL)      │
│   TypeScript)   │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
    ┌─────────┐            ┌─────────┐            ┌─────────┐
    │  Vite   │            │ Sanctum │            │ Storage │
    │ (Build) │            │ (Auth)  │            │ (Files) │
    └─────────┘            └─────────┘            └─────────┘
```

#### 🔧 **Komponen Utama**

**1. Frontend Layer (React + TypeScript)**
- **Framework**: React 19+ dengan TypeScript
- **Build Tool**: Vite 6.0 untuk development dan production build
- **UI Framework**: Tailwind CSS 4.0 untuk styling
- **Component Library**: Radix UI untuk komponen yang accessible
- **State Management**: React Hooks (useState, useEffect, useContext)
- **HTTP Client**: Axios untuk API calls
- **Routing**: Inertia.js untuk SPA experience

**2. Backend Layer (Laravel)**
- **Framework**: Laravel 12+ (PHP 8.1+)
- **Authentication**: Laravel Sanctum untuk API authentication
- **Database ORM**: Eloquent ORM
- **File Storage**: Laravel Storage dengan local/cloud support
- **PDF Generation**: DomPDF untuk generate dokumen PDF
- **Queue System**: Laravel Queue untuk background jobs
- **Caching**: Laravel Cache untuk performance optimization

**3. Database Layer (MySQL)**
- **Database**: MySQL 8.0+ atau MariaDB 10.3+
- **Migrations**: Laravel migrations untuk version control database
- **Seeders**: Database seeders untuk data awal
- **Indexing**: Proper indexing untuk performance

**4. Integration Layer (Inertia.js)**
- **Full-Stack Bridge**: Inertia.js menghubungkan Laravel dan React
- **SPA Experience**: Single Page Application tanpa API endpoints
- **Server-Side Rendering**: Optional SSR untuk SEO
- **Shared Data**: Data sharing antara server dan client

#### 🌐 **Request Flow**

```
User Request → Web Server → Laravel Router → Controller → Model → Database
     ↓                                                              ↑
Frontend ← Inertia Response ← View (React) ← Data Processing ←──────┘
```

**Detailed Flow:**
1. User melakukan action di React frontend
2. Inertia.js mengirim request ke Laravel backend
3. Laravel router mengarahkan ke controller yang sesuai
4. Controller memproses business logic dan berinteraksi dengan model
5. Model melakukan query ke database
6. Data dikembalikan ke controller
7. Controller mengirim response melalui Inertia
8. React component menerima data dan update UI

#### 🔒 **Security Architecture**

**Authentication Flow:**
```
Login Request → Laravel Sanctum → Session Creation → Token Generation
     ↓                                                        ↑
Frontend ← Authenticated State ← Middleware Check ←───────────┘
```

**Security Layers:**
1. **Input Validation**: Laravel Form Requests
2. **CSRF Protection**: Laravel CSRF tokens
3. **XSS Protection**: Automatic escaping
4. **SQL Injection**: Eloquent ORM protection
5. **Authentication**: Sanctum session-based auth
6. **Authorization**: Laravel Gates and Policies
7. **Rate Limiting**: Laravel throttling middleware

### 2. Database Schema

#### 📊 **Entity Relationship Diagram**

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    Users    │────►│  Documents  │     │   Beritas   │
│             │     │             │     │             │
│ - id        │     │ - id        │     │ - id        │
│ - name      │     │ - user_id   │     │ - judul     │
│ - email     │     │ - type      │     │ - konten    │
│ - password  │     │ - status    │     │ - penulis   │
│ - role      │     │ - nik       │     │ - status    │
│ - created_at│     │ - nama      │     │ - created_at│
└─────────────┘     │ - alamat    │     └─────────────┘
                    │ - notes     │
                    │ - file_path │
                    │ - created_at│
                    └─────────────┘
                           │
                    ┌─────────────┐
                    │ Penduduks   │
                    │             │
                    │ - id        │
                    │ - user_id   │
                    │ - nik       │
                    │ - nama      │
                    │ - alamat    │
                    │ - created_at│
                    └─────────────┘
```

#### 📋 **Tabel Database Detail**

**1. Users Table**
```sql
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'penduduk') DEFAULT 'penduduk',
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

**2. Documents Table**
```sql
CREATE TABLE documents (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    type ENUM('KTP', 'KK', 'AKTA_KELAHIRAN', 'AKTA_KEMATIAN') NOT NULL,
    status ENUM('DIPROSES', 'SELESAI', 'DITOLAK') DEFAULT 'DIPROSES',
    notes TEXT NULL,
    file_path VARCHAR(255) NULL,

    -- Common fields
    nik VARCHAR(16) NOT NULL,
    nama VARCHAR(255) NOT NULL,
    alamat TEXT NOT NULL,
    email VARCHAR(255) NULL,
    no_telp VARCHAR(15) NULL,
    persetujuan_data BOOLEAN DEFAULT FALSE,

    -- Birth/Personal info
    tempat_lahir VARCHAR(255) NULL,
    tanggal_lahir DATE NULL,
    jenis_kelamin ENUM('Laki-laki', 'Perempuan') NULL,

    -- KTP specific
    jenis_permohonan_ktp ENUM('BARU', 'PERPANJANGAN', 'PENGGANTIAN') NULL,
    agama VARCHAR(50) NULL,
    status_perkawinan VARCHAR(50) NULL,
    pekerjaan VARCHAR(100) NULL,
    kewarganegaraan VARCHAR(50) NULL,
    scan_ktp VARCHAR(255) NULL,

    -- Family info
    nama_ayah VARCHAR(255) NULL,
    nama_ibu VARCHAR(255) NULL,

    -- Death certificate
    nama_almarhum VARCHAR(255) NULL,
    tanggal_meninggal DATE NULL,

    -- Family card
    no_kk VARCHAR(16) NULL,
    hubungan_keluarga VARCHAR(50) NULL,
    pendidikan VARCHAR(100) NULL,
    golongan_darah VARCHAR(5) NULL,
    nama_kepala_keluarga VARCHAR(255) NULL,
    anggota_keluarga JSON NULL,

    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_type (type),
    INDEX idx_nik (nik)
);
```

**3. Beritas Table**
```sql
CREATE TABLE beritas (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    konten LONGTEXT NOT NULL,
    gambar VARCHAR(255) NULL,
    penulis VARCHAR(255) NOT NULL,
    status ENUM('published', 'draft') DEFAULT 'draft',
    user_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);
```

**4. Penduduks Table**
```sql
CREATE TABLE penduduks (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    nik VARCHAR(16) UNIQUE NOT NULL,
    nama VARCHAR(255) NOT NULL,
    alamat TEXT NOT NULL,
    jenis_kelamin ENUM('Laki-laki', 'Perempuan') NOT NULL,
    tempat_lahir VARCHAR(255) NOT NULL,
    tanggal_lahir DATE NOT NULL,
    agama VARCHAR(50) NOT NULL,
    status_perkawinan VARCHAR(50) NOT NULL,
    pekerjaan VARCHAR(100) NOT NULL,
    kewarganegaraan VARCHAR(50) DEFAULT 'WNI',
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_nik (nik),
    INDEX idx_user_id (user_id)
);
```

**5. Activity Logs Table**
```sql
CREATE TABLE activity_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    activity VARCHAR(255) NOT NULL,
    description TEXT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP NULL,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at),
    INDEX idx_activity (activity)
);
```

### 3. API Endpoints

#### 🌐 **Authentication Endpoints**

**POST /register**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "nik": "1234567890123456",
  "no_telp": "081234567890"
}
```

**POST /login**
```json
{
  "email": "john@example.com",
  "password": "password123",
  "remember": true
}
```

**POST /logout**
```json
{} // Empty body, requires authentication
```

**POST /forgot-password**
```json
{
  "email": "john@example.com"
}
```

#### 📋 **Document Endpoints**

**GET /penduduk/documents**
- Mendapatkan daftar dokumen user yang login
- Requires: Authentication
- Response: Array of documents

**POST /penduduk/documents**
```json
{
  "type": "KTP",
  "nik": "1234567890123456",
  "nama": "John Doe",
  "alamat": "Jl. Contoh No. 123",
  "tempat_lahir": "Jakarta",
  "tanggal_lahir": "1990-01-01",
  "jenis_kelamin": "Laki-laki",
  "agama": "Islam",
  "status_perkawinan": "Belum Kawin",
  "pekerjaan": "Karyawan Swasta",
  "kewarganegaraan": "WNI",
  "jenis_permohonan_ktp": "BARU",
  "nama_ayah": "Ayah Doe",
  "nama_ibu": "Ibu Doe",
  "email": "john@example.com",
  "no_telp": "081234567890",
  "persetujuan_data": true
}
```

**GET /document/{id}/download**
- Download dokumen PDF yang sudah disetujui
- Requires: Authentication & document ownership

#### 🛡️ **Admin Endpoints**

**GET /admin/dashboard**
- Dashboard statistics untuk admin
- Requires: Admin authentication

**GET /admin/penduduk**
- Daftar semua penduduk
- Supports: pagination, search, filter

**POST /admin/penduduk**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "nik": "1234567890123457",
  "nama": "Jane Doe",
  "alamat": "Jl. Admin No. 456",
  "jenis_kelamin": "Perempuan",
  "tempat_lahir": "Bandung",
  "tanggal_lahir": "1985-05-15",
  "agama": "Kristen",
  "status_perkawinan": "Kawin",
  "pekerjaan": "PNS",
  "kewarganegaraan": "WNI"
}
```

**GET /admin/dokumen**
- Daftar semua pengajuan dokumen
- Supports: filter by status, type, date

**POST /admin/dokumen/{id}/approve**
```json
{
  "notes": "Dokumen telah diverifikasi dan disetujui"
}
```

**POST /admin/dokumen/{id}/reject**
```json
{
  "notes": "Dokumen ditolak karena: 1. Foto tidak jelas, 2. Data alamat tidak lengkap"
}
```

#### 📰 **News Endpoints**

**GET /penduduk/berita**
- Daftar berita untuk penduduk
- Only published news

**GET /admin/berita**
- Daftar semua berita untuk admin
- All status (published, draft)

**POST /admin/berita**
```json
{
  "judul": "Pengumuman Penting",
  "konten": "<p>Isi berita lengkap...</p>",
  "penulis": "Admin Pemerintahan",
  "status": "published",
  "gambar": "base64_encoded_image_or_file_upload"
}
```

#### 🔧 **Response Format**

**Success Response:**
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    "field_name": ["Validation error message"]
  }
}
```

**Pagination Response:**
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "current_page": 1,
    "last_page": 10,
    "per_page": 15,
    "total": 150
  }
}
```

### 4. Security Features

#### 🔒 **Authentication & Authorization**

**1. Laravel Sanctum**
- Session-based authentication untuk web
- Token-based authentication untuk API
- CSRF protection untuk form submissions
- Automatic token expiration

**2. Role-Based Access Control**
```php
// Middleware untuk admin
Route::middleware(['auth', 'verified', AdminMiddleware::class])

// Middleware untuk penduduk
Route::middleware(['auth', 'verified', PendudukMiddleware::class])
```

**3. Password Security**
- Minimum 8 characters
- Bcrypt hashing dengan cost factor 12
- Password confirmation required
- Password reset via email

#### 🛡️ **Data Protection**

**1. Input Validation**
```php
// Form Request validation
public function rules()
{
    return [
        'nik' => 'required|string|size:16|unique:penduduks,nik',
        'nama' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email',
        'tanggal_lahir' => 'required|date|before:today',
    ];
}
```

**2. SQL Injection Prevention**
- Eloquent ORM dengan parameter binding
- Prepared statements untuk raw queries
- Input sanitization

**3. XSS Protection**
- Automatic HTML escaping di Blade templates
- Content Security Policy headers
- Input filtering untuk rich text content

**4. File Upload Security**
```php
// File validation
'file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:2048'

// Secure file storage
Storage::disk('local')->put('documents/', $file);
```

#### 🔐 **Session Security**

**1. Session Configuration**
```env
SESSION_DRIVER=file
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null
SESSION_SECURE_COOKIE=true
SESSION_HTTP_ONLY=true
SESSION_SAME_SITE=lax
```

**2. CSRF Protection**
- CSRF tokens untuk semua form
- Automatic token verification
- Token refresh pada setiap request

**3. Rate Limiting**
```php
// Login rate limiting
Route::middleware('throttle:5,1')->group(function () {
    Route::post('/login', [AuthController::class, 'store']);
});

// API rate limiting
Route::middleware('throttle:60,1')->group(function () {
    // API routes
});
```

#### 🚨 **Security Monitoring**

**1. Activity Logging**
- User login/logout tracking
- Document submission logging
- Admin actions logging
- Failed authentication attempts

**2. Error Handling**
- Detailed error logs untuk debugging
- Generic error messages untuk user
- Automatic error reporting

**3. Security Headers**
```php
// Security headers middleware
'X-Content-Type-Options' => 'nosniff',
'X-Frame-Options' => 'DENY',
'X-XSS-Protection' => '1; mode=block',
'Strict-Transport-Security' => 'max-age=31536000; includeSubDomains',
```

### 5. Backup dan Recovery

#### 💾 **Database Backup**

**1. Automated Backup Script**
```bash
#!/bin/bash
# backup-database.sh

DB_NAME="sistem_pemerintahan"
DB_USER="username"
DB_PASS="password"
BACKUP_DIR="/var/backups/database"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory if not exists
mkdir -p $BACKUP_DIR

# Create database backup
mysqldump -u$DB_USER -p$DB_PASS $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/backup_$DATE.sql

# Remove backups older than 30 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

echo "Database backup completed: backup_$DATE.sql.gz"
```

**2. Laravel Backup Command**
```bash
# Install Laravel backup package
composer require spatie/laravel-backup

# Create backup
php artisan backup:run

# Schedule backup (in app/Console/Kernel.php)
$schedule->command('backup:run')->daily()->at('02:00');
```

**3. Cron Job Setup**
```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /path/to/backup-database.sh

# Add Laravel scheduler
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
```

#### 🔄 **File Backup**

**1. Storage Backup**
```bash
#!/bin/bash
# backup-files.sh

SOURCE_DIR="/var/www/sistem-pemerintahan/storage"
BACKUP_DIR="/var/backups/files"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup
tar -czf $BACKUP_DIR/storage_backup_$DATE.tar.gz -C $SOURCE_DIR .

# Remove old backups
find $BACKUP_DIR -name "storage_backup_*.tar.gz" -mtime +7 -delete
```

**2. Full Application Backup**
```bash
#!/bin/bash
# full-backup.sh

APP_DIR="/var/www/sistem-pemerintahan"
BACKUP_DIR="/var/backups/full"
DATE=$(date +%Y%m%d_%H%M%S)

# Exclude unnecessary directories
tar --exclude='node_modules' \
    --exclude='vendor' \
    --exclude='storage/logs' \
    --exclude='storage/framework/cache' \
    --exclude='storage/framework/sessions' \
    --exclude='storage/framework/views' \
    -czf $BACKUP_DIR/full_backup_$DATE.tar.gz \
    -C $APP_DIR .
```

#### 🔧 **Recovery Procedures**

**1. Database Recovery**
```bash
# Restore from backup
mysql -u username -p database_name < backup_file.sql

# Or using Laravel
php artisan migrate:fresh
mysql -u username -p database_name < backup_file.sql
```

**2. File Recovery**
```bash
# Restore storage files
cd /var/www/sistem-pemerintahan
tar -xzf /var/backups/files/storage_backup_YYYYMMDD_HHMMSS.tar.gz -C storage/

# Fix permissions
sudo chown -R www-data:www-data storage/
sudo chmod -R 775 storage/
```

**3. Full System Recovery**
```bash
# Extract full backup
tar -xzf full_backup_YYYYMMDD_HHMMSS.tar.gz -C /var/www/sistem-pemerintahan/

# Install dependencies
composer install --no-dev --optimize-autoloader
npm install --production

# Set permissions
sudo chown -R www-data:www-data /var/www/sistem-pemerintahan
sudo chmod -R 755 /var/www/sistem-pemerintahan
sudo chmod -R 775 storage bootstrap/cache

# Create storage link
php artisan storage:link

# Clear caches
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

#### 📊 **Monitoring dan Maintenance**

**1. System Health Check**
```bash
#!/bin/bash
# health-check.sh

# Check disk space
df -h | grep -E "/$|/var"

# Check MySQL status
systemctl status mysql

# Check web server status
systemctl status apache2  # or nginx

# Check Laravel logs
tail -n 50 /var/www/sistem-pemerintahan/storage/logs/laravel.log

# Check backup status
ls -la /var/backups/database/ | tail -5
```

**2. Performance Monitoring**
```bash
# Monitor system resources
htop

# Monitor MySQL processes
mysqladmin -u root -p processlist

# Monitor web server logs
tail -f /var/log/apache2/access.log
tail -f /var/log/apache2/error.log
```

**3. Maintenance Tasks**
```bash
# Clear application caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Optimize application
php artisan optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Clean up logs
php artisan log:clear

# Update composer dependencies
composer update --no-dev --optimize-autoloader
```

---

## 🎯 KESIMPULAN

Manual book ini telah memberikan panduan lengkap untuk menggunakan dan mengelola **Sistem Pemerintahan Digital**. Dari instalasi hingga troubleshooting, semua aspek sistem telah dijelaskan secara detail dan user-friendly.

### 📋 **Ringkasan Fitur Utama:**
- ✅ Sistem autentikasi yang aman
- ✅ Pengajuan dokumen online (KTP, KK, Akta)
- ✅ Dashboard interaktif untuk penduduk dan admin
- ✅ Manajemen berita pemerintahan
- ✅ Generate PDF dokumen resmi
- ✅ Log aktivitas sistem
- ✅ Responsive design untuk semua perangkat

### 🚀 **Keunggulan Sistem:**
- **Modern Technology Stack**: Laravel + React + TypeScript
- **User-Friendly Interface**: Desain intuitif dan mudah digunakan
- **Secure**: Implementasi security best practices
- **Scalable**: Arsitektur yang dapat dikembangkan
- **Maintainable**: Kode yang terstruktur dan terdokumentasi

### 📞 **Support dan Bantuan:**
Jika membutuhkan bantuan lebih lanjut:
- **Email**: support@pemerintahan.go.id
- **Telepon**: (021) 1234-5678
- **WhatsApp**: 0812-3456-7890
- **Documentation**: Selalu update di repository GitHub

### 🔄 **Update Manual:**
Manual ini akan terus diperbarui seiring dengan pengembangan sistem. Pastikan selalu menggunakan versi terbaru untuk informasi yang akurat.

---

**© 2025 Sistem Pemerintahan Digital - Melayani dengan Teknologi Modern**

*"Digitalisasi Pelayanan Publik untuk Indonesia yang Lebih Maju"*
