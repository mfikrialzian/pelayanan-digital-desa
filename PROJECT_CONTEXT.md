# Konteks Proyek: Pelayanan Digital Desa Narmada

Dokumen ini adalah panduan wajib bagi agen AI (Artificial Intelligence) mana pun yang membantu pengembangan repositori ini. Bacalah seluruh konteks ini sebelum memberikan saran kode, melakukan *refactoring*, atau menambah fitur baru.

## 1. Identitas & Tujuan Proyek
* **Nama Proyek:** Pelayanan Digital Desa Narmada
* **Deskripsi Singkat:** Portal administrasi dan pelayanan mandiri (warga) untuk Desa Narmada. Warga dapat mengajukan layanan secara online, dan pihak desa (admin) dapat memverifikasi serta mengelola data pengajuan tersebut melalui dashboard.
* **Paradigma UI:** Single Page Application (SPA) yang dimuat sepenuhnya di sisi klien (frontend). Tab antara Warga dan Admin ditangani menggunakan CSS (menyembunyikan/menampilkan div kontainer).

## 2. Tech Stack (Teknologi Utama)
* **Frontend:** *Vanilla Javascript* murni (ES6+ Modules). **TIDAK** menggunakan *framework* seperti React, Vue, atau Angular.
* **Styling:** Tailwind CSS (via CDN/Vite) & Vanilla CSS (`style.css`).
* **Bundler & Build Tool:** Vite. Semua aset publik dan statis (seperti `sw.js`, `manifest.json`, ikon) berada di dalam folder `public/`.
* **Backend & Database:** Google Apps Script (GAS) dan Google Sheets. Backend terpisah sepenuhnya dari frontend.
* **Hosting / Deployment:** Frontend di-deploy secara otomatis ke Vercel (Edge Network). Backend dikerjakan secara langsung di Google Apps Script editor.

## 3. Arsitektur Hibrida Vercel & GAS (Krusial!)
Aplikasi ini pada awalnya dirancang khusus untuk dirender di dalam ekosistem Google Apps Script (`HtmlService`), sehingga kode-kodenya bergantung pada API bawaan Google yaitu `google.script.run`.

Karena saat ini frontend telah di-migrasi ke Vercel untuk kecepatan dan kustomisasi (*hybrid deployment*), kita menggunakan teknik **Polyfill/Mocking**. 
* Di dalam file `index.html` (bagian `<head>`), terdapat *script* khusus yang membuat variabel objek tiruan `window.google.script.run`.
* Objek tiruan ini akan mencegat (intercept) perintah seperti `google.script.run.withSuccessHandler(...).fungsiGas()` dan diam-diam merubahnya menjadi perintah `fetch()` standar yang melakukan *POST Request* ke URL Google Apps Script Web App Endpoint.
* **Aturan Utama AI:** Jangan pernah mengubah sintaks `google.script.run` di dalam *file* javascript! Sistem sudah menjembataninya secara otomatis. Biarkan pemanggilan API ditulis dengan format `google.script.run...` layaknya aplikasi GAS native.

## 4. Struktur Direktori Frontend (`vercel-frontend/`)
* `index.html`: File pusat (satu-satunya HTML). Menampung layout Warga dan Admin sekaligus.
* `style.css`: Aturan CSS murni yang bersifat spesifik (seperti overriding gaya Tailwind atau mengatur font dan scrollbar). Dimuat paling akhir agar tidak tertimpa.
* `vercel.json`: Konfigurasi server Vercel, mengatur *routing*, CORS, dan pengamanan lewat *Content Security Policy (CSP)*. Pastikan URL API pihak ke-3 didaftarkan di CSP jika ditambah.
* `public/`: Folder wajib Vite untuk menyimpan aset *Progressive Web App* (PWA) seperti `manifest.json` dan `sw.js` agar bisa diakses di root URL.
* `src/core/`: Logika sistem utama seperti perutean tab (routing Warga/Admin), validasi kredensial (admin login), manajemen tema (gelap/terang), dan utilitas (*toast notification*).
* `src/admin/`: Folder berisi modul fungsional *dashboard* Admin (mengatur pengajuan, pengguna, pengaturan web). Modul-modul dipisah per halaman (contoh: `pengajuan.js`, `layanan.js`).
* `src/warga/`: Folder berisi logika portal antar-muka untuk warga (pengajuan formulir, cek status, dll).

## 5. Manajemen State & Keamanan
* **State Management:** Tidak ada Redux atau Context API. Mengandalkan atribut DOM, ClassList Tailwind, dan Variabel Global di dalam `window` object.
* **Autentikasi (Admin):** Status *login* administrator disimpan menggunakan `localStorage` dengan *key* spesifik: `adminToken_Narmada` dan `adminRole_Narmada`.
* **Proteksi Tampilan:** Modul *sidebar* Admin tidak menggunakan React State, melainkan mengubah properti class HTML bawaan (menyematkan dan membuang class `.hidden` pada id container tertentu). Harap berhati-hati saat mengakses DOM (selalu gunakan Null-Guards `if (element) { ... }`).

## 6. Pedoman Kode / Pengembangan Lanjutan
1. **Pemisahan Logika:** Jika membangun fitur baru, buat fungsi baru di dalam file modul masing-masing (`.js`), dan import modul tersebut ke dalam `index.html` menggunakan `type="module"`.
2. **DOM Manipulation:** Biasakan untuk menyimpan dan memeriksa elemen di variabel dengan `getElementById` sebelum memanipulasi *class*-nya agar terhindar dari *TypeError* di konsol.
3. **Desain:** Proyek ini memprioritaskan estetika premium (Glassmorphism, transisi halus, warna konsisten seperti `narmadaGreen`). Gunakan class Tailwind secara maksimal, hindari CSS murni berlebih kecuali untuk animasi khusus (Keyframes) atau *overriding*.

---
*(Dokumen ini dibuat secara dinamis oleh AI Assistant - Antigravity)*
