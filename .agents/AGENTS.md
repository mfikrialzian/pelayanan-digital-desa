# Pedoman Agen AI untuk Proyek Pelayanan Digital Desa

Dokumen ini adalah aturan wajib (*customization rule*) bagi setiap agen AI yang bekerja di ruang kerja (*workspace*) ini.

## 1. Identitas & Teknologi Proyek
* **Proyek:** Pelayanan Digital Desa Narmada (Warga & Admin).
* **Teknologi Utama:** Vanilla Javascript (ES6), Tailwind CSS, Vite. **Dilarang** menyarankan atau menginstal *framework* seperti React atau Vue kecuali diminta eksplisit.
* **Backend:** Google Apps Script (GAS). Kode backend dikerjakan terpisah di ekosistem Google.

## 2. Arsitektur Hibrida & Polyfill (SANGAT PENTING!)
Aplikasi ini berjalan di Vercel, tetapi dirancang seolah-olah berjalan di dalam HTMLService Google Apps Script.
* Di dalam `index.html`, terdapat *polyfill* tiruan bernama `window.google.script.run` yang berfungsi menjembatani panggilan API ke Vercel Fetch secara diam-diam.
* **ATURAN MUTLAK:** Jangan pernah mengubah sintaks pemanggilan `google.script.run` di file javascript mana pun! Sistem ini disengaja agar *source code* tetap kompatibel 100% jika sewaktu-waktu dideploy ulang secara murni ke dalam Google Apps Script native.

## 3. Gaya Penulisan & Desain
* Semua DOM manipulasi menggunakan `document.getElementById` atau `querySelector`.
* Saat memanipulasi *class*, **wajib** menggunakan *null-guards*, contoh: `if (el) el.classList.remove('hidden');`. Hal ini untuk mencegah *TypeError* yang menghentikan eksekusi skrip, mengingat file HTML sering dipangkas atau dimodifikasi.
* Tampilan Web berkonsep *Single Page Application* tanpa *reload*, perpindahan halaman dilakukan murni dengan CSS (`hidden` dan `block`).
* Desain mengutamakan estetika modern (*Glassmorphism*, transisi warna, menggunakan kelas utilitas Tailwind). Gunakan warna spesifik `narmadaGreen` (hijau emerald khas desa).

## 4. Letak File Penting
* Konfigurasi Vercel (Routing & CSP): `vercel-frontend/vercel.json`
* CSS Murni tambahan (Override/Keyframes): `vercel-frontend/style.css`
* Logika Modul Warga: `vercel-frontend/src/warga/*.js`
* Logika Modul Admin: `vercel-frontend/src/admin/*.js`
* Logika Inti & Routing: `vercel-frontend/src/core/*.js`
* Aset Publik (Gambar, PWA): `vercel-frontend/public/`
