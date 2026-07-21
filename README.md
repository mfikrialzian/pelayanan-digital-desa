# 🏛️ Pelayanan Digital Desa Narmada

[![Live Website](https://img.shields.io/badge/Live-Website-success?style=for-the-badge&logo=vercel)](https://pelayanan-desa-narmada.vercel.app/)

Sistem pelayanan administrasi desa berbasis **Google Apps Script** yang memungkinkan warga mengajukan surat dan dokumen secara digital.

## ✨ Fitur Utama

- **Portal Warga** — Pengajuan surat online dengan 5-step wizard
- **Dashboard Admin** — Manajemen verifikasi berkas & status pengajuan  
- **CMS Dinamis** — Kustomisasi layanan, persyaratan, dan tampilan beranda
- **Notifikasi WhatsApp** — Integrasi Fonnte API untuk notifikasi otomatis
- **Upload & Kompresi** — Unggah foto dokumen dengan analisis ketajaman gambar
- **Anti-Spam** — Cooldown 15 menit antar pengajuan

## 🏗️ Arsitektur

```
code.gs        → Controller & API Gateway (Routing)
service.gs     → Business Logic Layer
repository.gs  → Data Access Layer (Google Sheets)
setup.gs       → Configuration & Database Schema
utils.gs       → Utilities (Sanitizer, ID Generator, Drive, WhatsApp)
index.html     → Main HTML Template
script.html    → Frontend JavaScript Logic
style.html     → Custom CSS Styles
```

## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Backend | Google Apps Script (V8 Runtime) |
| Database | Google Sheets (Relational Schema) |
| Frontend | HTML + Tailwind CSS + Vanilla JS |
| Storage | Google Drive |
| Notification | Fonnte WhatsApp API |

## 📦 Setup

1. Buka [Google Apps Script](https://script.google.com)
2. Buat project baru terhubung ke Google Sheets
3. Salin semua file `.gs` dan `.html` ke editor Apps Script
4. Jalankan fungsi `setupDatabase()` untuk inisialisasi schema
5. Deploy sebagai Web App

## 📄 Lisensi

MIT License — Bebas digunakan dan dimodifikasi.
