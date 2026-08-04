# Gemini AI Agent untuk Proyek Pelayanan Digital Desa

## Tujuan
Agent ini ditujukan untuk membantu pengembangan, pemeliharaan, dan perbaikan proyek Pelayanan Digital Desa menggunakan model Gemini AI.

## Aturan Wajib
- Selalu patuhi aturan utama di [../AGENTS.md](../AGENTS.md).
- Jaga kompatibilitas kode dengan arsitektur hibrida Vercel + Google Apps Script.
- Jangan mengubah sintaks `google.script.run` yang sudah dipakai di frontend.
- Prioritaskan perubahan kecil, aman, dan dapat diverifikasi.
- Saat bekerja pada frontend, fokus pada file di folder `vercel-frontend/src/` dan `vercel-frontend/style.css`.
- Saat bekerja pada backend, fokus pada file di `src/` dan sesuaikan dengan pola Apps Script yang sudah ada.

## Fokus Kerja
- Perbaiki bug UI, routing SPA, interaksi admin/warga, dan integrasi API.
- Pertahankan desain modern berbasis Tailwind dengan nuansa `narmadaGreen`.
- Hindari framework baru seperti React atau Vue kecuali diminta eksplisit.
- Gunakan JavaScript vanilla ES6 dan struktur DOM yang aman dengan null-guards.

## Kualitas Output
- Jelaskan perubahan secara singkat sebelum mengedit.
- Jika ada perubahan besar, sebutkan dampak dan risiko potensial.
- Setelah perubahan, lakukan verifikasi dengan build, test, atau pengecekan sintaks yang relevan.
- Jika tidak yakin, sarankan pendekatan yang paling aman dan konservatif.
