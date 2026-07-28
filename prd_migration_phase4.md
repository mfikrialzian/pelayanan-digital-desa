# Product Requirements Document (PRD) - Migrasi Framework & Bundler Modern (Phase 4)

## Ringkasan Eksekutif
Aplikasi Pelayanan Digital Desa saat ini dibangun menggunakan Vanilla JavaScript statis dengan pendekatan *global scope* dan penyisipan DOM via `.innerHTML`. Untuk memastikan pemeliharaan (*maintainability*) dan skalabilitas aplikasi di masa mendatang (terutama saat fitur semakin kompleks), aplikasi perlu dimigrasikan ke arsitektur modular menggunakan sistem perakit (*bundler*) modern.

## Tujuan Migrasi
1. **Modularitas Kode**: Memecah berkas raksasa seperti `script_admin.js` (>3400 baris) menjadi modul-modul kecil (misal: fitur Pengajuan, Laporan, Pengaturan).
2. **Keamanan & Kestabilan Lingkungan (Scope)**: Menghindari tabrakan nama variabel antar-fungsi karena semuanya tidak lagi berjalan di jendela global (Window).
3. **Peningkatan Performa Build**: Menerapkan *asset hashing* untuk *cache busting* (memastikan pengguna tidak melihat desain lama setelah pembaruan).
4. **Developer Experience (DX)**: Mendukung penggunaan fitur *modern JavaScript* (ES6+) sepenuhnya seperti `import`/`export` dan *Hot Module Replacement (HMR)* untuk *live-reload* lokal.

## Rekomendasi Teknologi (Tech Stack)
- **Bundler**: **Vite** (Sangat ringan, cepat, dan standar industri saat ini).
- **Format Modul**: ES Modules (ESM).
- *(Opsional di Masa Depan)*: Perlahan beralih dari Vanilla JS murni ke *framework* antarmuka komponen seperti **React.js** atau **Vue.js**, mengingat saat ini UI banyak dirender secara manual dari JavaScript panjang.

## Strategi & Langkah-langkah Migrasi

Proses migrasi harus dilakukan secara hati-hati agar tidak merusak fungsionalitas yang ada. Berikut adalah tahapan yang akan dilakukan pada Phase 4:

### Langkah 1: Inisialisasi Vite & Repositori Baru
- Membuat berkas konfigurasi `package.json` dan `vite.config.js` di direktori `vercel-frontend/`.
- Memindahkan `index.html` sebagai *entry point* Vite.
- Memperbarui skrip `tailwind.config.js` agar terintegrasi langsung dengan PostCSS dari Vite.

### Langkah 2: Pemutusan Global Scope & Event Binding
Karena modul ES6 tidak mengekspos fungsinya secara global, maka:
- Mencari dan menghapus semua atribut `onclick="Fungsi()"` yang ada secara langsung (di *hardcode*) di dalam `index.html`.
- Menggantinya dengan pengikatan *event listener* secara terprogram dari dalam Javascript (`document.getElementById('btn').addEventListener('click', Fungsi)`). Ini adalah praktik terbaik di ekosistem modern.

### Langkah 3: Ekstraksi dan Pemecahan Modul
Memecah berkas `script_admin.js` dan `script_warga.js` secara agresif. Contoh untuk panel admin:
- `src/admin/auth.js` (Logika login/logout)
- `src/admin/dashboard.js` (Statistik, grafik mingguan)
- `src/admin/pengajuan.js` (Tabel, *approve/reject* laporan)
- Menggunakan `import { approvePengajuan } from './pengajuan.js'` di dalam fungsi inti.

### Langkah 4: Refactoring Sintaks (Standardisasi ES6)
- Setelah file dipecah, akan digunakan alat bantu **ESLint** untuk merapikan kode.
- Mengganti seluruh sisa fungsi `var` menjadi `let` dan `const` (Karena cakupan variabel pada *module* lebih ketat, potensi *hoisting error* bisa dideteksi oleh *linter* dan bundler sebelum di-*deploy*).

### Langkah 5: Penyesuaian Pipeline CI/CD Vercel
- Mengatur ulang konfigurasi _Build Command_ di dasbor Vercel dari yang sebelumnya kosong (karena hanya web statis) menjadi `npm run build`.
- Mengatur _Output Directory_ Vercel menjadi `dist` (karena Vite akan memproduksi *file* HTML dan JS minified ke folder `/dist/`).

## Kriteria Penerimaan (Acceptance Criteria)
- Web berhasil berjalan sempurna secara lokal menggunakan command `npm run dev`.
- Tidak ada lagi file JS atau aset gambar/font raksasa yang bocor tanpa mekanisme *hashing* otomatis dari Vite.
- Seluruh peringatan keamanan XSS atau error variabel berhasil ditangani oleh Linter.

---
*Dokumen ini akan menjadi panduan eksklusif kita setelah Phase 3 (Kode Kebersihan) sepenuhnya rampung!*
