# Panduan Desain Pelayanan Digital Desa Narmada (DESIGN.md)

Dokumen ini berisi panduan gaya antarmuka (UI/UX) yang digunakan pada proyek Web Pelayanan Digital Desa Narmada. Panduan ini **wajib** digunakan sebagai acuan oleh pengembang maupun Agen AI saat menambahkan fitur, halaman, atau komponen baru agar konsistensi desain tetap terjaga.

## 1. Konsep Utama

- **Estetika:** Modern, *Clean*, dan Premium (menggunakan kelas utilitas Tailwind CSS).
- **Tema:** Mengutamakan ruang putih (*whitespace*), *Glassmorphism* (pada elemen tertentu seperti *modal* atau *overlay*), dan sudut membulat (*rounded corners*).
- **Interaksi:** Menerapkan *micro-animations* pada interaksi (hover efek, transisi halus) untuk memberikan kesan dinamis dan hidup.
- **Arsitektur:** Aplikasi web berkonsep *Single Page Application* (SPA) hibrida. Perpindahan *subview* atau tab dilakukan murni menggunakan CSS (`hidden` dan penghapusan `hidden`) tanpa memuat ulang halaman (*reload*).

## 2. Palet Warna (Color Palette)

- **Warna Utama (Primary):** `bg-narmadaGreen`, `text-narmadaGreen`, `border-narmadaGreen`. Warna ini adalah warna hijau emerald khas Desa Narmada.
- **Warna Aksen Hover Utama:** `hover:bg-emerald-600` atau `hover:bg-emerald-700`.
- **Latar Belakang Dasar (Background):** `bg-slate-50` (untuk halaman/kanvas utama) dan `bg-white` (untuk kartu/elemen spesifik).
- **Warna Teks & Garis (Grayscale):**
  - Judul/Teks Utama: `text-slate-800` atau `text-slate-900`.
  - Sub-judul/Deskripsi/Label: `text-slate-500` atau `text-slate-400`.
  - Garis Batas (Border): `border-slate-100` atau `border-slate-200`.

## 3. Tipografi & Ikonografi

- **Sistem Font:** Menggunakan font Sans-serif modern bawaan Tailwind.
- **Ukuran Teks:**
  - `text-[10px]` atau `text-xs` untuk label kecil, *badge*, atau informasi sekunder.
  - `text-sm` untuk teks paragraf atau isian *input*.
  - `text-lg` atau `text-xl` untuk judul utama halaman atau kartu.
- **Ketebalan Teks (Font Weight):**
  - `font-bold` atau `font-semibold` untuk judul dan elemen interaktif (tombol).
  - `font-normal` (default) untuk teks panjang/deskripsi.
- **Ikon:** Menggunakan pustaka **FontAwesome 6** (`fa-solid`, `fa-regular`). Ikon sering disandingkan dengan margin atau *gap* (`gap-2`, `mr-1.5`, dll).

## 4. Komponen UI Standar

### A. Kartu Konten (*Content Cards*)

Wadah utama untuk setiap konten atau blok informasi selalu menggunakan gaya berikut:

```html
<div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 (atau p-6)">
   <!-- Konten -->
</div>
```

### B. Tombol (*Buttons*)

- **Tombol Utama (Primary):**

  ```html
  <button class="px-5 py-2.5 text-xs font-bold text-white bg-narmadaGreen hover:bg-emerald-700 shadow-sm rounded-xl transition-all">
    <i class="fa-solid fa-save mr-1.5"></i> Simpan
  </button>
  ```

- **Tombol Sekunder (Secondary/Outline):**

  ```html
  <button class="px-5 py-2.5 text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all">
    <i class="fa-solid fa-arrow-left mr-1.5"></i> Kembali
  </button>
  ```

- **Tombol Aksi Kecil (Icon Button):**

  ```html
  <button class="text-xs font-bold text-narmadaGreen hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors">
    <i class="fa-solid fa-rotate-right mr-1"></i> Segarkan
  </button>
  ```

- **Tombol Bahaya (Danger):** `bg-red-600 hover:bg-red-700 text-white`.

### C. Input & Form (*Form Controls*)

- **Field Input Standar:**

  ```html
  <input type="text" class="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-1 focus:ring-narmadaGreen focus:border-narmadaGreen block px-4 py-2.5 outline-none transition-all placeholder-slate-400">
  ```

- **Field Non-aktif (Disabled/Read-only):** Tambahkan warna `bg-slate-100 text-slate-500 cursor-not-allowed`.
- **Gaya Label:**

  ```html
  <label class="block text-[10px] font-bold text-slate-600 mb-1 uppercase tracking-wider">Judul Input</label>
  ```

### D. Label & Lencana (*Badges/Tags*)

Digunakan untuk status atau peran pengguna (misal: "Super Admin", "Aktif").

```html
<span class="bg-emerald-50 text-narmadaGreen border border-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-md inline-block">
  Status
</span>
```

- *Warna alternatif:* `bg-blue-50 text-blue-600`, `bg-red-50 text-red-600`, `bg-amber-50 text-amber-600`.

### E. Tabel Data

Gaya tabel untuk daftar log, pengguna, atau pengajuan:

- **Wadah Tabel:** `<div class="overflow-x-auto rounded-xl border border-slate-100">`
- **Header (`thead`):** `bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider border-b border-slate-100` dengan `font-bold` di setiap `<th>`.
- **Baris Data (`tr`):** `hover:bg-slate-50 transition-colors border-b border-slate-50 text-xs text-slate-600`.

### F. Modal & *Popup*

- Menggunakan pendekatan *fixed overlay* dengan *backdrop-blur* atau latar belakang semi-transparan.
- **Overlay:** `fixed inset-0 bg-slate-900/50 z-[100] flex items-center justify-center`
- **Konten Modal:** `bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-sm p-6`

### G. Transisi & Animasi (*Micro-Animations*)

- Seluruh elemen yang bisa berinteraksi wajib diberikan kelas `transition-all` atau `transition-colors`.
- Untuk menyorot elemen saat *hover*, gunakan interaksi `group` dan `group-hover`. Contoh pada menu sidebar: ikon membesar (`group-hover:scale-110`) dan berubah warna ke `narmadaGreen` saat elemen induknya di-*hover*.

### H. Formulir Panel & Layout Bersih (*Seamless Form Panels*)

- **Kanvas Menyatu (*Seamless Background*):** Bagian utama form (baik *wizard* maupun *form* tunggal) tidak boleh menggunakan warna latar belakang yang kontras (seperti `bg-slate-50`) jika berada di bawah *header* berwarna putih. Gunakan warna putih murni (`bg-white`) secara menyeluruh untuk bodi panel agar terkesan rata (*flat* dan *clean*).
- **Tanpa Bingkai Bertumpuk (*No Nested Cards*):** Dilarang membungkus input *form* ke dalam kartu tambahan (`bg-white p-6 border...`) jika *form* tersebut sudah berada di dalam panel modal atau kontainer utama.
- **Minimalis & Fungsional:** Hindari teks deskripsi panjang yang tidak perlu di setiap tahapan (*step*). *Progress bar* atau indikator langkah (*stepper*) harus ringkas dan tidak memakan ruang berlebih.

## 5. Panduan DOM & Manipulasi CSS Javascript

Saat membuat skrip Javascript yang berhubungan dengan tampilan:

1. **Selalu** gunakan *null-check/guard* sebelum memanipulasi DOM. Contoh: `const el = document.getElementById('id'); if (el) el.classList.remove('hidden');`
2. **Perpindahan Halaman:** Terapkan teknik penyembunyian menggunakan kelas utilitas `hidden` (misal, hapus `hidden` pada komponen yang akan ditampilkan, dan tambahkan `hidden` pada elemen lain).
3. Jangan pernah melakukan `innerHTML` tanpa pertimbangan XSS yang ketat, prioritaskan mengubah `textContent` atau manipulasi *class*.

> **PENTING UNTUK AGEN AI:** Pastikan semua fitur dan desain baru yang diajukan selalu merujuk pada standar-standar di atas agar pengguna mendapatkan pengalaman premium dan UI web tetap elegan serta tidak melenceng dari konsep asli.
