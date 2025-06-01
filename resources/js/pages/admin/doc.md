1. admin dashboard 
	(Statistik dashboard <total, pending, total, log activity>)
	(Log Aktivitas)
2. manajemen penduduk
	(Statistik penduduk <total penduduk, data terdaftar, registrasi baru>)
	(Manajemen data penduduk - edit)
	(Manajemen data penduduk - tambah penduduk)
	(Filter penduduk berdasarkan email atau nama)
3. manajemen dokumen
	(Statistik dokumen <total, menunggu, disetujui, ditolak>)
	(Menyetujui permohonan dokumen)
	(Menolak permohonan dokumen dengan catatan alasan)
	(Mengunduh dokumen yang telah disetujui)

## Dokumentasi Sistem Pemerintahan

### 1. Admin Dashboard
#### Statistik Dashboard
- **Alur Kerja:**
  1. Admin login ke sistem
  2. Sistem menampilkan panel statistik pada halaman utama
  3. Panel menunjukkan data total pengguna, dokumen pending, total dokumen, dan ringkasan aktivitas terbaru
  4. Admin dapat melihat tren dengan grafik interaktif
  5. Data diperbarui secara real-time

#### Log Aktivitas
- **Alur Kerja:**
  1. Admin mengakses bagian Log Aktivitas di dashboard
  2. Sistem menampilkan daftar aktivitas terbaru dalam format tabel
  3. Admin dapat menggunakan filter untuk mencari aktivitas berdasarkan tanggal, pengguna, atau jenis aktivitas
  4. Aktivitas mencakup login/logout, pembuatan/perubahan data, dan persetujuan dokumen

### 2. Manajemen Penduduk
#### Manajemen Data Penduduk - Tambah Penduduk
- **Alur Kerja:**
  1. Admin mengklik tombol "Tambah Penduduk"
  2. Sistem menampilkan modal dengan form entry data
  3. Admin mengisi data penduduk (nama, alamat, email, dll)
  4. Sistem melakukan validasi data secara real-time
  5. Admin mengklik tombol "Simpan"
  6. Sistem menyimpan data dan menampilkan notifikasi sukses
  7. Data baru muncul dalam daftar penduduk

#### Manajemen Data Penduduk - Edit
- **Alur Kerja:**
  1. Admin mengklik ikon edit pada baris data penduduk
  2. Sistem menampilkan modal dengan form berisi data yang sudah ada
  3. Admin melakukan perubahan data
  4. Sistem melakukan validasi perubahan
  5. Admin mengklik tombol "Update"
  6. Sistem menyimpan perubahan dan menampilkan notifikasi sukses
  7. Data yang diperbarui ditampilkan dalam daftar

### 3. Manajemen Dokumen
#### Statistik Dokumen
- **Alur Kerja:**
  1. Admin mengakses menu Manajemen Dokumen
  2. Sistem menampilkan panel statistik dokumen
  3. Panel menunjukkan total dokumen, status menunggu, disetujui, dan ditolak
  4. Data ditampilkan dalam bentuk angka

#### Menyetujui Permohonan Dokumen
- **Alur Kerja:**
  1. Admin membuka daftar dokumen dengan status "Menunggu"
  2. Admin mengklik dokumen untuk melihat detail
  3. Sistem menampilkan informasi lengkap dokumen dan data pemohon
  4. Admin memeriksa kelengkapan dan keaslian dokumen
  5. Admin mengklik tombol "Setujui"
  6. Sistem mengubah status dokumen menjadi "Disetujui"
  7. Sistem mengirim notifikasi ke pemohon

#### Menolak Permohonan Dokumen
- **Alur Kerja:**
  1. Admin membuka daftar dokumen dengan status "Menunggu"
  2. Admin mengklik dokumen untuk melihat detail
  3. Admin menemukan ketidaksesuaian atau kekurangan
  4. Admin mengklik tombol "Tolak"
  5. Sistem menampilkan modal untuk input alasan penolakan
  6. Admin menulis alasan penolakan
  7. Admin mengklik tombol "Konfirmasi"
  8. Sistem mengubah status dokumen menjadi "Ditolak"
  9. Sistem mengirim notifikasi ke pemohon beserta alasan penolakan

#### Mengunduh Dokumen yang Disetujui
- **Alur Kerja:**
  1. Admin membuka daftar dokumen dengan status "Disetujui"
  2. Admin mencari dokumen yang ingin diunduh
  3. Admin mengklik ikon unduh pada baris dokumen
  4. Sistem memproses permintaan unduhan
  5. Browser menampilkan dialog unduhan
  6. Admin memilih lokasi penyimpanan
  7. Dokumen tersimpan dalam format PDF dengan watermark resmi

### 4. Manajemen Berita/Pengumuman
#### Membuat Berita atau Pengumuman Baru
- **Alur Kerja:**
  1. Admin mengakses menu Manajemen Berita/Pengumuman
  2. Admin mengklik tombol "Tambah Berita Baru"
  3. Sistem menampilkan form pembuatan berita dengan field:
     - Judul berita/pengumuman
     - Kategori (berita atau pengumuman)
     - Gambar ilustrasi (opsional)
     - Konten berita dengan rich text editor
     - Tanggal publikasi
     - Status (draft, publish, jadwalkan)
  4. Admin mengisi semua field yang diperlukan
  5. Admin mengklik tombol "Simpan" atau "Publikasikan"
  6. Sistem menyimpan berita dan menampilkan notifikasi sukses
  7. Jika status "publish", berita langsung tampil di halaman publik
  8. Jika status "draft", berita akan disimpan sebagai draft

#### Mengedit Berita yang Sudah Ada
- **Alur Kerja:**
  1. Admin mengakses menu Manajemen Berita/Pengumuman
  2. Sistem menampilkan daftar berita/pengumuman yang ada dalam format tabel
  3. Admin dapat menggunakan filter untuk mencari berita berdasarkan judul, kategori, atau status
  4. Admin mengklik ikon edit pada baris berita yang ingin diubah
  5. Sistem menampilkan form edit dengan data berita yang sudah ada
  6. Admin melakukan perubahan pada konten atau metadata berita
  7. Admin mengklik tombol "Update"
  8. Sistem menyimpan perubahan dan menampilkan notifikasi sukses
  9. Perubahan langsung tercermin di halaman publik (jika status publish)