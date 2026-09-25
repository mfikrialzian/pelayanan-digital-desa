# Rencana Implementasi

Halo! Berdasarkan masukan terbaru Anda, berikut adalah langkah-langkah implementasi yang akan saya kerjakan selanjutnya:

## 1. Pembaruan Judul Tabel (Statis)

Pada file `src/admin/pengajuan.js`:

- Saya akan menghapus logika Javascript yang secara otomatis merubah teks judul tabel ("Daftar Pengajuan Masuk", "Daftar Pengajuan Diperiksa", dll) ketika Tab diklik.
- Judul akan dikunci (*hardcoded*) menjadi satu teks statis, karena fungsi navigasinya sudah sepenuhnya digantikan oleh keberadaan Tab di bagian bawah judul.

## 2. Penggabungan Dropdown Bidang ke dalam Tombol Filter

Pada file `index.html` dan `src/admin/pengajuan.js`:

- Tombol "Filter" statis di ujung kanan akan saya ganti menjadi elemen `<select>` *dropdown* interaktif namun tetap menggunakan **gaya/desain visual yang persis sama** dengan tombol Filter sebelumnya (berbentuk kotak putih dengan *border* halus).
- Opsi di dalamnya akan secara dinamis diisi dengan data jenis Layanan dari backend. 
- Ini membuat UI menjadi efisien: letaknya ada di posisi "Filter" kanan, tapi langsung menampilkan pilihan Bidang tanpa memakan banyak tempat.

## 3. Penghapusan Garis Pembatas Header (UI/UX)

Pada file `index.html`:

- Saya akan menghapus *class* `border-b border-slate-100` pada kontainer yang membungkus judul tabel dan tombol waktu.
- Dengan demikian, batas visual antara baris judul dengan barisan Tab akan hilang, menjadikannya terlihat sebagai satu kesatuan komponen (Tab langsung menempel halus pada konten di atasnya).

## 4. Mempercantik Animasi Tabel

Pada file `src/admin/pengajuan.js` dan/atau `index.html`:

- Saya akan mempercantik tabel dengan menambahkan animasi mikro modern.
- Baris tabel (*table row*) akan diberikan efek transisi *fade-in* (*slide up fade*) setiap kali data dimuat, sehingga tidak terlihat kaku saat berganti halaman atau mem-filter.
- Menambahkan efek *hover* yang lebih terasa elegan (seperti *glow* tipis atau pergeseran halus pada tombol cetak/aksi).

Langkah ini akan langsung saya eksekusi!
