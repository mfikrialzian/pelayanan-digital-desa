# Rencana Implementasi

Halo! Berdasarkan permintaan Anda, saya telah memeriksa struktur kode dan merencanakan langkah-langkah implementasi berikut untuk merombak UI bagian "Pengajuan" di Dashboard Admin:

## 1. Menghapus Submenu di Sidebar

Pada file `src/admin/admin_core.js`, saya akan:

- Menghapus submenu `pengajuan-proses`, `pengajuan-perbaiki`, dan `pengajuan-selesai`.
- Mengubah menu "Pengajuan" menjadi satu tombol tunggal yang akan membuka halaman `Daftar Pengajuan`.
- Memastikan navigasi ini terhubung dengan benar sehingga ketika admin mengklik "Pengajuan" di dashboard/sidebar, mereka akan diarahkan ke satu halaman terpusat.

## 2. Mengubah UI Pengajuan Menjadi Tab (index.html)

Pada file `index.html` (bagian `subview-admin-pengajuan`):

- Saya akan mengganti judul statis menjadi kelompok **Tab Navigasi**: `Semua`, `Diperiksa`, `Perbaikan`, dan `Selesai`.
- Menyesuaikan fungsi Javascript di `src/admin/pengajuan.js` agar ketika tab diklik, variabel filter status (`activeStatusFilter`) berubah dan memuat ulang tabel.

## 3. Implementasi Filter Waktu dan Jenis Bidang (Backend & Frontend)

Untuk memastikan tombol "Semua", "Hari Ini", "Minggu Ini", dan "Bulan Ini" berfungsi dengan nyata (bukan hanya UI), serta menambah dropdown "Jenis Bidang", saya akan melakukan update dari Frontend hingga ke *Google Apps Script* Backend:

- **Frontend (`pengajuan.js` & `dashboard.js`)**: Menambahkan *state* global untuk `activeTimeFilter` dan `activeBidangFilter`. Memperbarui fungsi *fetch* untuk mengirimkan kedua filter ini ke backend.
- **Backend (`code.js`, `service.js`, `repository.js`)**:
  - Mengubah fungsi `getAdminDashboardData` agar menerima dua parameter tambahan: `timeFilter` dan `bidangFilter`.
  - Di `repository.js` -> `getPaginated()`, saya akan menambahkan logika filtering tanggal (mem-parsing string `"dd/MM/yyyy"`) untuk memfilter "Hari Ini", "Minggu Ini", dan "Bulan Ini".
  - Menambahkan logika filter string pada kolom Layanan (Jenis Bidang).

## 4. Finalisasi UI Filter

Pada bagian *header* tabel pengajuan di `index.html`, akan ditambahkan:

- Deretan tombol Filter Waktu yang interaktif (berganti warna bila aktif).
- Elemen `<select>` untuk memilih Layanan/Jenis Bidang, yang opsinya akan diambil dari data layanan yang sudah ada secara dinamis.

Semua penyesuaian akan tetap mematuhi arsitektur *hybrid* yang ada (menggunakan `google.script.run`) sehingga kode tetap aman digunakan saat di-deploy langsung ke GAS di masa depan.
