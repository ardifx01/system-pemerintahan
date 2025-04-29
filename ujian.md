# Panduan Ujian Live Coding Website Pemerintahan

Berikut adalah panduan untuk menghadapi ujian live coding dimana satu baris kode dihapus dari fitur tertentu, dan tugas Anda adalah mengidentifikasi file yang bermasalah, menemukan baris yang hilang, dan mengembalikan kode tersebut melalui live coding.

## Contoh Skenario Per Fitur

### 1. Fitur Autentikasi dan Profil

#### 1.1 Login

**File yang bermasalah:**
`c:\xampp\htdocs\pemerintahan\app\Http\Controllers\Auth\AuthenticatedSessionController.php`

**Baris yang dihapus (di method store):**

```php
Auth::login($user, $request->boolean('remember'));
```

**Efek dari baris yang dihapus:**
User tidak dapat login meskipun kredensial benar. Form login akan diproses tapi tidak ada sesi login yang dibuat.

**Solusi live coding:**
Tambahkan kembali baris `Auth::login($user, $request->boolean('remember'));` setelah validasi user dan sebelum redirect.

#### 1.2 Reset Password

**File yang bermasalah:**
`c:\xampp\htdocs\pemerintahan\app\Http\Controllers\Auth\NewPasswordController.php`

**Baris yang dihapus:**

```php
$user->save();
```

**Efek dari baris yang dihapus:**
Password baru diinput tapi tidak tersimpan ke database, sehingga user tetap tidak bisa login dengan password baru.

**Solusi live coding:**
Tambahkan kembali baris `$user->save();` setelah mengatur password baru dan sebelum menghapus token.

### 2. Fitur Pengajuan Dokumen

#### 2.1 Pengajuan Dokumen Baru

**File yang bermasalah:**
`c:\xampp\htdocs\pemerintahan\app\Http\Controllers\DocumentController.php`

**Baris yang dihapus (di method store):**

```php
'user_id' => Auth::id(),
```

**Efek dari baris yang dihapus:**
Dokumen berhasil diajukan tetapi tidak terkait dengan user manapun (user_id = null), sehingga tidak muncul di daftar dokumen user.

**Solusi live coding:**
Tambahkan kembali baris `'user_id' => Auth::id(),` di dalam array pembuatan Document.

#### 2.2 Preview Dokumen

**File yang bermasalah:**
`c:\xampp\htdocs\pemerintahan\app\Http\Controllers\DocumentController.php`

**Baris yang dihapus (di method show):**

```php
'filePath' => $document->file_path ? asset($document->file_path) : null,
```

**Efek dari baris yang dihapus:**
Tombol preview dokumen tidak aktif meskipun dokumen sudah disetujui karena path file tidak dikirim ke frontend.

**Solusi live coding:**
Tambahkan kembali baris `'filePath' => $document->file_path ? asset($document->file_path) : null,` dalam array data dokumen.

### 3. Fitur Download Dokumen

**File yang bermasalah:**
`c:\xampp\htdocs\pemerintahan\app\Http\Controllers\DocumentController.php`

**Baris yang dihapus (di method download):**

```php
return Response::download($fullPath, $filename);
```

**Efek dari baris yang dihapus:**
Halaman download muncul kosong, file tidak terunduh.

**Solusi live coding:**
Tambahkan kembali baris `return Response::download($fullPath, $filename);` di akhir method download.

### 4. Fitur Berita dan Informasi

#### 4.1 Filter Berita untuk Publik

**File yang bermasalah:**
`c:\xampp\htdocs\pemerintahan\app\Http\Controllers\BeritaController.php`

**Baris yang dihapus (di method pendudukIndex):**

```php
->where('status', 'Dipublikasi')
```

**Efek dari baris yang dihapus:**
Semua berita muncul di halaman publik, termasuk yang masih berstatus draft.

**Solusi live coding:**
Tambahkan kembali filter `->where('status', 'Dipublikasi')` setelah Model Berita dan sebelum orderBy.

#### 4.2 Detail Berita

**File yang bermasalah:**
`c:\xampp\htdocs\pemerintahan\app\Http\Controllers\BeritaController.php`

**Baris yang dihapus (di method pendudukShow):**

```php
if ($berita->status !== 'Dipublikasi') {
    abort(404);
}
```

**Efek dari baris yang dihapus:**
User dapat mengakses berita yang belum dipublikasi jika mengetahui ID berita.

**Solusi live coding:**
Tambahkan kembali validasi `if ($berita->status !== 'Dipublikasi') { abort(404); }` di awal method.

### 5. Fitur Dashboard User

**File yang bermasalah:**
`c:\xampp\htdocs\pemerintahan\resources\js\pages\penduduk\dashboard.tsx`

**Baris yang dihapus:**

```tsx
{
    status === 'SELESAI' && (
        <Button variant="primary" size="sm" onClick={() => handleDownload(document.id)}>
            Unduh
        </Button>
    );
}
```

**Efek dari baris yang dihapus:**
Tombol unduh tidak muncul pada dokumen yang telah disetujui di dashboard user.

**Solusi live coding:**
Tambahkan kembali conditional rendering untuk tombol download: `{status === 'SELESAI' && <Button variant="primary" size="sm" onClick={() => handleDownload(document.id)}>Unduh</Button>}`

### 6. Fitur Admin Dashboard

**File yang bermasalah:**
`c:\xampp\htdocs\pemerintahan\app\Http\Controllers\Admin\DashboardController.php`

**Baris yang dihapus:**

```php
$recentDocuments = Document::with('user')
    ->orderBy('submitted_at', 'desc')
    ->limit(5)
    ->get();
```

**Efek dari baris yang dihapus:**
Dashboard admin tidak menampilkan dokumen terbaru, section menjadi kosong.

**Solusi live coding:**
Tambahkan kembali query `$recentDocuments = Document::with('user')->orderBy('submitted_at', 'desc')->limit(5)->get();`

### 7. Fitur Manajemen Dokumen Admin

**File yang bermasalah:**
`c:\xampp\htdocs\pemerintahan\app\Http\Controllers\DocumentController.php`

**Baris yang dihapus (di method approve):**

```php
$document->status = Document::STATUS_SELESAI;
```

**Efek dari baris yang dihapus:**
Admin mengklik tombol setujui, tetapi status dokumen tidak berubah.

**Solusi live coding:**
Tambahkan kembali baris `$document->status = Document::STATUS_SELESAI;` sebelum mengatur notes.

### 8. Fitur Penolakan Dokumen

**File yang bermasalah:**
`c:\xampp\htdocs\pemerintahan\app\Http\Controllers\DocumentController.php`

**Baris yang dihapus (di method reject):**

```php
$document->notes = $validated['notes'];
```

**Efek dari baris yang dihapus:**
Dokumen ditolak tetapi alasan penolakan tidak tersimpan, user tidak bisa melihat alasan penolakan.

**Solusi live coding:**
Tambahkan kembali baris `$document->notes = $validated['notes'];` setelah mengubah status dan sebelum save.

### 9. Fitur Manajemen Berita

**File yang bermasalah:**
`c:\xampp\htdocs\pemerintahan\app\Http\Controllers\BeritaController.php`

**Baris yang dihapus (di method store):**

```php
$gambarPath = $request->file('gambar')->store('berita', 'public');
```

**Efek dari baris yang dihapus:**
Gambar tidak tersimpan dan berita tidak memiliki gambar meskipun file gambar dipilih.

**Solusi live coding:**
Tambahkan kembali baris `$gambarPath = $request->file('gambar')->store('berita', 'public');` di dalam blok if untuk upload gambar.

### 10. Fitur Log Aktivitas

**File yang bermasalah:**
`c:\xampp\htdocs\pemerintahan\app\Services\ActivityLogService.php`

**Baris yang dihapus:**

```php
'user_id' => auth()->id(),
```

**Efek dari baris yang dihapus:**
Aktivitas tercatat tetapi tidak terhubung ke user yang melakukan, log menjadi kurang informatif.

**Solusi live coding:**
Tambahkan kembali baris `'user_id' => auth()->id(),` dalam array data log.
