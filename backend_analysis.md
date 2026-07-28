# 🔍 Analisis Mendalam Backend GAS — Pelayanan Digital Desa Narmada

> Analisis menyeluruh terhadap arsitektur, keamanan, performa, dan kualitas kode backend Google Apps Script.

---

## 📁 Struktur File Backend

```
src/
├── appsscript.json    (388B)   — Manifest GAS
├── code.js            (4.8KB)  — Controller / API Gateway  
├── setup.js           (8.5KB)  — Konfigurasi & Inisialisasi DB
├── repository.js      (13.6KB) — Data Access Layer
├── service.js         (21.7KB) — Business Logic Layer
└── utils.js           (4.5KB)  — Utilitas (Sanitizer, ID Generator, Drive, WhatsApp)
```

---

## 📊 Ringkasan Temuan

| Kategori | Status | Prioritas |
|---|---|---|
| 🔴 Keamanan (`doPost` RCE) | **SANGAT KRITIS** | Harus diperbaiki segera |
| 🔴 Password Plaintext | **KRITIS** | Harus diperbaiki segera |
| 🔴 API Publik Tanpa Auth | **KRITIS** | Harus diperbaiki segera |
| 🟡 Performa (getAll bottleneck) | **PERLU PERBAIKAN** | Saat data membesar |
| 🟡 Race Condition (ID Generator) | **PERLU PERBAIKAN** | Bisa duplikat ID |
| 🟡 Input Validation Kurang | **PERLU PERBAIKAN** | Beberapa endpoint |
| 🟢 Arsitektur Layered | **BAIK** | Terstruktur rapi |
| 🟢 Concurrency (LockService) | **BAIK** | Sudah diterapkan |
| 🟢 Error Handling | **CUKUP BAIK** | Beberapa gap |

---

## 🔴 1. KEAMANAN — Masalah SANGAT KRITIS

### 1.1 Remote Code Execution (RCE) via `doPost()` — PALING KRITIS

Di [code.js line 104-125](file:///d:/PelayananDigitalDesa/src/code.js#L104-L125):

```javascript
function doPost(e) {
  try {
    var postData = JSON.parse(e.postData.contents);
    var action = postData.action;
    var params = postData.params || [];
    
    if (action.indexOf('_') === 0 || typeof this[action] !== 'function') {
      throw new Error("Akses ditolak atau fungsi tidak ditemukan: " + action);
    }
    
    var result = this[action].apply(this, params);  // ← RCE!
    // ...
  }
}
```

> [!CAUTION]
> **Ini adalah celah keamanan TERBESAR di seluruh sistem.** `doPost()` menerima nama fungsi apa saja dari request dan langsung mengeksekusinya. 
>
> **Dampak serangan:**
> 1. Attacker bisa memanggil `setupDatabase` → menghapus/reset seluruh database
> 2. Attacker bisa memanggil `submitPengajuanDesa` tanpa batas → spam data
> 3. Attacker bisa memanggil fungsi internal GAS yang tidak seharusnya diekspos
> 4. Filter `action.indexOf('_') === 0` hanya memblokir fungsi yang dimulai underscore — hampir semua fungsi publik tetap bisa dipanggil

**Bukti eksploitasi:**

```bash
# Menghapus seluruh database
curl -X POST "https://script.google.com/macros/s/AKfycby.../exec" \
  -d '{"action":"setupDatabase","params":[]}'

# Spam pengajuan tanpa validasi
curl -X POST "https://script.google.com/macros/s/AKfycby.../exec" \
  -d '{"action":"submitPengajuanDesa","params":[{"nik":"1234567890123456","nama":"HACKER","layanan":"test","wa":"0","alamat":"x","berkasFoto":[],"detailLayanan":{}}]}'

# Mengambil data semua pengguna (termasuk password!)
curl -X POST "https://script.google.com/macros/s/AKfycby.../exec" \
  -d '{"action":"getPenggunaList","params":["fake_token"]}'
```

**Fix WAJIB — Gunakan whitelist ketat:**

```javascript
function doPost(e) {
  try {
    var postData = JSON.parse(e.postData.contents);
    var action = postData.action;
    var params = postData.params || [];
    
    // WHITELIST: Hanya fungsi ini yang boleh dipanggil dari frontend
    var ALLOWED_ACTIONS = {
      'getAdminSetelan': getAdminSetelan,
      'getLayananList': getLayananList,
      'getDashboardStats': getDashboardStats,
      'submitPengajuanDesa': submitPengajuanDesa,
      'processReuploadBerkas': processReuploadBerkas,
      'getPengajuanStatus': getPengajuanStatus,
      'checkAdminLogin': checkAdminLogin,
      'logoutAdmin': logoutAdmin,
      'getAdminDashboardData': getAdminDashboardData,
      'updatePengajuanStatus': updatePengajuanStatus,
      'crudLayanan': crudLayanan,
      'getPenggunaList': getPenggunaList,
      'crudPengguna': crudPengguna,
      'updateProfilPengguna': updateProfilPengguna,
      'updateAdminSetelan': updateAdminSetelan,
      'generateSuratPDF': generateSuratPDF,
      'getActivities': getActivities,
      'getNotifications': getNotifications
    };
    
    if (!ALLOWED_ACTIONS[action]) {
      throw new Error("Akses ditolak: fungsi '" + action + "' tidak diizinkan.");
    }
    
    var result = ALLOWED_ACTIONS[action].apply(null, params);
    return ContentService.createTextOutput(JSON.stringify({ success: true, data: result }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

---

### 1.2 Password Disimpan Plaintext (KRITIS)

Di [repository.js line 207](file:///d:/PelayananDigitalDesa/src/repository.js#L207) dan [service.js line 9](file:///d:/PelayananDigitalDesa/src/service.js#L9):

```javascript
// repository.js - Password dibaca langsung dari Spreadsheet
password: rawData[i][2],

// service.js - Login membandingkan plaintext langsung
if (user && user.password === password) {
```

> [!CAUTION]
> **Masalah:**
> 1. Password admin disimpan **plaintext** di Google Sheets — siapa saja yang punya akses Spreadsheet bisa melihat semua password
> 2. Login membandingkan password secara langsung, tanpa hashing
> 3. `getPenggunaList()` mengembalikan **seluruh data pengguna termasuk password** ke frontend!

Di [repository.js line 197-218](file:///d:/PelayananDigitalDesa/src/repository.js#L197-L218):
```javascript
getAll: function() {
    // ...
    results.push({
        // ...
        password: rawData[i][2],  // ← PASSWORD TERKIRIM KE FRONTEND!
        // ...
    });
}
```

**Fix:**

```javascript
// 1. Hash password saat create/update
var PenggunaService = {
  crud: function(action, payload) {
    if (action === "create") {
      // Hash password sebelum disimpan
      var hashedPassword = Utilities.computeDigest(
        Utilities.DigestAlgorithm.SHA_256,
        payload.password + "SALT_RAHASIA_DESA"
      ).map(function(byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
      }).join('');
      
      PenggunaRepository.insert({
        password: hashedPassword,
        // ...
      });
    }
  }
};

// 2. Jangan kirim password ke frontend
getList: function() {
  var users = PenggunaRepository.getAll();
  return users.map(function(u) {
    delete u.password;  // Hapus password sebelum dikirim
    return u;
  });
}
```

---

### 1.3 Endpoint Publik Tanpa Authentication (KRITIS)

Di [code.js](file:///d:/PelayananDigitalDesa/src/code.js#L20-L42), beberapa endpoint **tidak memerlukan token auth sama sekali**:

```javascript
// TANPA AUTH - Siapapun bisa memanggil!
function getAdminSetelan()     { return ConfigService.getSetelan(); }
function getLayananList()      { return LayananService.getList(); }
function getDashboardStats()   { return PengajuanService.getStats(); }
function getPengajuanStatus(searchKey) { return PengajuanService.getStatus(searchKey); }
function submitPengajuanDesa(wargaData) { return PengajuanService.create(wargaData); }
```

> [!WARNING]
> **Dampak:**
> 1. `getAdminSetelan()` → siapapun bisa melihat password admin (ada di sheet Setelan baris username/password)
> 2. `getDashboardStats()` → statistik internal desa terbuka untuk publik
> 3. `getPengajuanStatus()` → siapapun bisa mencari data pengajuan dengan bruteforce NIK
> 4. `submitPengajuanDesa()` → tidak ada rate limiting di backend, spam tak terbatas

**Rekomendasi:**
- `getAdminSetelan()` → filter field sensitif (jangan kirim username/password)
- `getDashboardStats()` → tambahkan auth check
- `getPengajuanStatus()` → minimal validasi format NIK/ID, rate limit
- `submitPengajuanDesa()` → tambahkan rate limiting berbasis NIK/IP

---

### 1.4 GAS Script ID Terekspos di `.clasp.json`

Di [.clasp.json](file:///d:/PelayananDigitalDesa/.clasp.json#L2):
```json
{
  "scriptId": "1V5mYX7VgUVm66l1TyKm_2Thqg0xZMYDy-oktDnHWez4U2WyXKGe64f1y"
}
```

> [!WARNING]
> File ini **tidak ada di `.gitignore`**! Jika repo ini public, Script ID terekspos. Meskipun script ID sendiri bukan kunci akses langsung, ini tetap informasi sensitif yang sebaiknya tidak publik.

**Fix:** Tambahkan `.clasp.json` ke `.gitignore`.

---

### 1.5 Test File dengan URL API Terekspos

Di [test_gas.js](file:///d:/PelayananDigitalDesa/test_gas.js#L1):
```javascript
const url = "https://script.google.com/macros/s/AKfycbyYyDijq.../exec";
// ... getPenggunaList dengan dummy_token
```

> [!WARNING]
> File test ini berisi **URL deployment GAS yang sebenarnya** dan menunjukkan cara memanggil `getPenggunaList` — blueprint lengkap untuk attacker.

---

## 🟡 2. PERFORMA — Bottleneck yang Akan Membesar

### 2.1 `getAll()` Membaca SELURUH Spreadsheet Setiap Kali

Setiap fungsi repository menggunakan `getDataRange().getDisplayValues()` yang **membaca SELURUH sheet** ke memori:

Di [repository.js line 279-300](file:///d:/PelayananDigitalDesa/src/repository.js#L279-L300):
```javascript
getAll: function() {
    var sheet = BaseRepository.getSheet(ZettConstants.SHEET_PENGAJUAN);
    var rawData = sheet.getDataRange().getDisplayValues(); // ← BACA SEMUA BARIS
    var results = [];
    for (var i = 1; i < rawData.length; i++) { /* ... */ }
    return results;
}
```

**Dampak:**
| Jumlah Pengajuan | Estimasi Load Time | Memori |
|---|---|---|
| 100 | ~1 detik | Aman |
| 1.000 | ~5-8 detik | Borderline |
| 5.000 | ~20-30 detik | GAS timeout risk (6 menit max) |
| 10.000+ | **TIMEOUT** | Crash |

### 2.2 N+1 Query Pattern di `getStats()`

Di [service.js line 274-303](file:///d:/PelayananDigitalDesa/src/service.js#L274-L303):
```javascript
getStats: function() {
    var rawData = PengajuanRepository.getAll(); // ← BACA SEMUA
    rawData.forEach(function(row) {
        // Iterasi semua row hanya untuk count
    });
}
```

**Fix:** Gunakan query langsung dari sheet tanpa loading semua data:

```javascript
getStats: function() {
    var sheet = BaseRepository.getSheet(ZettConstants.SHEET_PENGAJUAN);
    var lastRow = sheet.getLastRow();
    if (lastRow < 2) return { total: 0, pending: 0, /* ... */ };
    
    var statusCol = sheet.getRange(2, 9, lastRow - 1, 1).getValues(); // Hanya kolom Status
    var stats = { total: statusCol.length, pending: 0, verifikasi: 0, selesai: 0, uploadUlang: 0 };
    
    for (var i = 0; i < statusCol.length; i++) {
        var s = statusCol[i][0];
        if (s === "Menunggu") stats.pending++;
        else if (s === "Verifikasi") stats.verifikasi++;
        // ...
    }
    return stats;
}
```

### 2.3 `getPaginated()` Membaca Semua Lalu Memfilter

Di [repository.js line 346-387](file:///d:/PelayananDigitalDesa/src/repository.js#L346-L387):
```javascript
getPaginated: function(filterKeyword, page, statusFilter) {
    var all = this.getAll();  // ← BACA SEMUA DULU
    // ... baru filter & slice
}
```

Ini berarti setiap kali admin membuka dashboard, **SELURUH data pengajuan** dibaca ke memori lalu dipaginasi client-side.

### 2.4 `findMasterByName()` Memanggil `getAllMaster()`

Di [repository.js line 79-82](file:///d:/PelayananDigitalDesa/src/repository.js#L79-L82):
```javascript
findMasterByName: function(name) {
    var list = this.getAllMaster();  // ← Baca SEMUA lalu cari satu
    return list.find(function(item) { return item.nama === name; });
}
```

**Fix:** Implementasi pencarian langsung di sheet:
```javascript
findMasterByName: function(name) {
    var sheet = BaseRepository.getSheet(ZettConstants.SHEET_LAYANAN);
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
        if (data[i][1] === name) {
            return { id: data[i][0], nama: data[i][1], /* ... */ };
        }
    }
    return null;
}
```

### 2.5 `PenggunaRepository.update()` — Multiple API Calls per Field

Di [repository.js line 243-261](file:///d:/PelayananDigitalDesa/src/repository.js#L243-L261):
```javascript
update: function(username, record) {
    // ...
    if (record.password !== undefined) sheet.getRange(row, 3).setValue(record.password);
    if (record.nama !== undefined) sheet.getRange(row, 4).setValue(record.nama);
    if (record.peran !== undefined) sheet.getRange(row, 5).setValue(record.peran);
    // ... 9 API calls jika semua field di-update!
}
```

Setiap `getRange().setValue()` adalah satu API call ke Sheets API. Update 1 user bisa memicu **hingga 9 API calls** secara serial.

**Fix:** Batch update:
```javascript
update: function(username, record) {
    var sheet = BaseRepository.getSheet(ZettConstants.SHEET_PENGGUNA);
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
        if (String(data[i][1]) === String(username)) {
            var row = data[i];
            if (record.password !== undefined) row[2] = record.password;
            if (record.nama !== undefined) row[3] = record.nama;
            // ... semua field
            sheet.getRange(i + 1, 1, 1, row.length).setValues([row]); // SATU API call
            break;
        }
    }
}
```

---

## 🟡 3. RACE CONDITION & CONCURRENCY

### 3.1 ID Generator Tidak Thread-Safe

Di [utils.js line 26-56](file:///d:/PelayananDigitalDesa/src/utils.js#L26-L56):

```javascript
var IDGenerator = {
  serial: function() {
    var sheet = BaseRepository.getSheet(ZettConstants.SHEET_PENGAJUAN);
    // ... membaca semua ID, cari max, +1
    return prefix + seqFormatted;
  }
};
```

> [!WARNING]
> `IDGenerator.serial()` **dipanggil di dalam `PengajuanService.create()`** yang sudah punya `LockService`. Namun jika dua warga submit bersamaan dan lock belum aktif di saat yang tepat, mereka bisa mendapat **ID yang sama** karena keduanya membaca max sequence yang sama.

Meskipun sudah ada lock di `PengajuanService.create()`, ID generation seharusnya juga di-protect sendiri atau menggunakan mekanisme atomic.

### 3.2 `deleteRow()` dalam Loop — Data Corruption Risk

Di [repository.js line 154-162](file:///d:/PelayananDigitalDesa/src/repository.js#L154-L162):

```javascript
deleteFieldsByLayananId: function(idLayanan) {
    var data = sheet.getDataRange().getValues();
    for (var i = data.length - 1; i >= 1; i--) {  // ← Reverse loop, BAGUS!
        if (data[i][1] === idLayanan) {
            sheet.deleteRow(i + 1);  // ← Tapi masih bisa masalah
        }
    }
}
```

**Positif:** Loop dari bawah ke atas (reverse) mencegah index shifting. **Namun**, setiap `deleteRow()` adalah API call mahal. Jika ada 50 field, ini 50 API calls serial.

**Fix lebih baik:** Kumpulkan semua row yang perlu dihapus, lalu hapus sekaligus:
```javascript
deleteFieldsByLayananId: function(idLayanan) {
    var sheet = BaseRepository.getSheet(ZettConstants.SHEET_FIELDS);
    var data = sheet.getDataRange().getValues();
    var rowsToDelete = [];
    for (var i = data.length - 1; i >= 1; i--) {
        if (data[i][1] === idLayanan) rowsToDelete.push(i + 1);
    }
    // Hapus dari bawah ke atas untuk menghindari index shift
    rowsToDelete.forEach(function(row) { sheet.deleteRow(row); });
}
```

---

## 🟡 4. INPUT VALIDATION — Celah yang Perlu Ditutup

### 4.1 `submitPengajuanDesa()` — Validasi Minimal

Di [service.js line 306-392](file:///d:/PelayananDigitalDesa/src/service.js#L306-L392):

```javascript
create: function(wargaData) {
    // Hanya validasi NIK length
    if (String(wargaData.nik).length !== 16) {
        throw new Error("NIK wajib 16 digit!");
    }
    wargaData.nik = Sanitizer.clean(wargaData.nik);
    // ... tapi TIDAK validasi:
    // - Apakah layanan yang dimaksud ada?
    // - Apakah nama mengandung karakter valid?
    // - Apakah nomor WA format valid?
    // - Apakah base64 image benar-benar gambar?
    // - Batas ukuran total payload?
}
```

**Validasi yang harus ditambahkan:**
```javascript
// Validasi layanan exists
var layanan = LayananRepository.findMasterByName(wargaData.layanan);
if (!layanan) throw new Error("Layanan tidak valid.");

// Validasi WA format
var cleanWa = String(wargaData.wa).replace(/\D/g, '');
if (cleanWa.length < 10 || cleanWa.length > 15) throw new Error("Nomor WhatsApp tidak valid.");

// Validasi nama
if (!wargaData.nama || wargaData.nama.trim().length < 3) throw new Error("Nama terlalu pendek.");

// Validasi ukuran base64 (cegah payload bomb)
var totalSize = 0;
wargaData.berkasFoto.forEach(function(f) {
    totalSize += (f.base64 || "").length;
});
if (totalSize > 10 * 1024 * 1024) throw new Error("Total ukuran berkas terlalu besar."); // 10MB limit
```

### 4.2 `getPengajuanStatus()` — Bruteforce Tanpa Batas

Di [code.js line 40-42](file:///d:/PelayananDigitalDesa/src/code.js#L40-L42):

```javascript
function getPengajuanStatus(searchKey) {
  return PengajuanService.getStatus(searchKey);  // Tanpa auth, tanpa rate limit
}
```

Siapapun bisa bruteforce NIK warga (`3201010101010001`, `3201010101010002`, ...) dan mendapatkan nama, alamat, status pengajuan mereka.

### 4.3 `reupload()` — Tidak Validasi Kepemilikan

Di [service.js line 395-438](file:///d:/PelayananDigitalDesa/src/service.js#L395-L438):

```javascript
reupload: function(idPengajuan, namaSyarat, base64Data) {
    // Tidak ada validasi: "Apakah yang upload ini benar pemilik pengajuan?"
    var record = PengajuanRepository.getById(idPengajuan);
    // Langsung reupload...
}
```

Siapapun yang tahu ID Pengajuan bisa mengganti berkas milik orang lain.

---

## 🟡 5. KONFIGURASI & DEPLOYMENT

### 5.1 OAuth Scopes Terlalu Luas

Di [appsscript.json](file:///d:/PelayananDigitalDesa/src/appsscript.json#L9-L12):

```json
"oauthScopes": [
    "https://www.googleapis.com/auth/script.external_request",
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive"
]
```

> [!WARNING]
> `https://www.googleapis.com/auth/drive` memberikan **full akses ke SELURUH Google Drive** user yang men-deploy script. Ini berarti script bisa membaca, menghapus, atau memodifikasi file apa saja di Drive.

**Fix:** Gunakan scope yang lebih spesifik:
```json
"oauthScopes": [
    "https://www.googleapis.com/auth/script.external_request",
    "https://www.googleapis.com/auth/spreadsheets.currentonly",
    "https://www.googleapis.com/auth/drive.file"
]
```
- `spreadsheets.currentonly` → hanya spreadsheet yang terikat
- `drive.file` → hanya file yang dibuat oleh script ini

### 5.2 Web App Access = `ANYONE_ANONYMOUS`

```json
"webapp": {
    "executeAs": "USER_DEPLOYING",
    "access": "ANYONE_ANONYMOUS"
}
```

Ini memang diperlukan untuk public-facing API, tapi dikombinasikan dengan `doPost()` yang tidak aman (lihat poin 1.1), ini sangat berbahaya.

### 5.3 Timezone Inkonsisten

Di [setup.js line 8](file:///d:/PelayananDigitalDesa/src/setup.js#L8):
```javascript
TIMEZONE: "Asia/Jakarta",
```

Di [appsscript.json line 2](file:///d:/PelayananDigitalDesa/src/appsscript.json#L2):
```json
"timeZone": "Asia/Makassar",
```

> [!IMPORTANT]
> **GAS menggunakan `Asia/Makassar` (WITA)** tapi kode konfigurasi menggunakan `Asia/Jakarta` (WIB). Selisih 1 jam! Ini menyebabkan timestamp di Spreadsheet dan timestamp di kode **berbeda 1 jam**.
>
> Narmada berada di Lombok (NTB), jadi timezone yang benar adalah **`Asia/Makassar`** (WITA). Ubah `ZettConfig.TIMEZONE` ke `"Asia/Makassar"`.

### 5.4 `ActivityService` & `NotificationService` — Hardcoded Timezone

Di [service.js line 558-559](file:///d:/PelayananDigitalDesa/src/service.js#L558-L559):
```javascript
id: "ACT-" + Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyyMMddHHmmss"),
waktu: Utilities.formatDate(new Date(), "Asia/Jakarta", "dd/MM/yyyy HH:mm:ss"),
```

Timezone di-hardcode `"Asia/Jakarta"` bukannya menggunakan `ZettConfig.TIMEZONE`. Ini menyebabkan inkonsistensi jika timezone diubah di satu tempat.

---

## 🟡 6. ERROR HANDLING & LOGGING

### 6.1 Catch Block Kosong

Di beberapa tempat, error di-catch tapi tidak di-log:

```javascript
// service.js line 408-410
try {
    fileObj.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.VIEW);
} catch(e) {}  // ← Error hilang tanpa jejak

// code.js line 588
} catch (e) { }  // ← Gagal tapi tidak ada info
```

### 6.2 Error Message Terlalu Detail ke Client

```javascript
// service.js line 36
return { success: false, message: "Auth Error: " + e.toString() };
```

`e.toString()` di production bisa menampilkan internal error stack trace yang memberikan informasi sensitif ke attacker.

**Fix:**
```javascript
return { success: false, message: "Terjadi kesalahan autentikasi. Silakan coba lagi." };
Logger.log("Auth Error: " + e.toString()); // Log internal saja
```

---

## 🟡 7. KODE ORGANISASI & MAINTAINABILITY

### 7.1 `setup.js` — Default Password Lemah

Di [setup.js line 175](file:///d:/PelayananDigitalDesa/src/setup.js#L175):
```javascript
var defaultPassword = props.getProperty('ADMIN_PASSWORD') || "123456";
```

Jika admin lupa set Script Properties, password default adalah `"123456"`. Ini password yang paling umum di-crack.

### 7.2 `Sanitizer.clean()` — Tidak Cukup Aman

Di [utils.js line 5-8](file:///d:/PelayananDigitalDesa/src/utils.js#L5-L8):
```javascript
clean: function(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/<\/?[^>]+(>|$)/g, "").trim();
}
```

Regex ini hanya menghapus HTML tags, tapi **tidak menangani:**
- Event handlers tanpa tag: `javascript:alert(1)`
- HTML entities: `&lt;script&gt;`
- SQL-like injection ke Sheets formula: `=IMPORTRANGE("url", "sheet")`

> [!IMPORTANT]
> **Spreadsheet Formula Injection!** Jika user memasukkan `=IMPORTRANGE(...)` atau `=IMAGE(...)` sebagai nama, ini akan dieksekusi sebagai formula di Google Sheets!

**Fix:** Prefix nilai dengan single quote untuk mencegah formula injection (sudah dilakukan sebagian untuk NIK/WA):
```javascript
clean: function(str) {
    if (typeof str !== 'string') return str;
    str = str.replace(/<\/?[^>]+(>|$)/g, "").trim();
    // Cegah formula injection
    if (str.charAt(0) === '=' || str.charAt(0) === '+' || str.charAt(0) === '-' || str.charAt(0) === '@') {
        str = "'" + str;
    }
    return str;
}
```

### 7.3 File `tools/` dan Root — Perlu Dibersihkan

Folder `tools/` berisi **19 file** utilitas sementara yang tidak terorganisir:
- Banyak file `check*.js`, `check*.py` — duplikat
- `replace_html.js` dan `replace_html.py` — duplikat logika
- `update_auth.js` dan `update_auth.py` — duplikat
- `fix.py`, `revert_auth.py` — patch sementara

Dan di root:
- `patch_script.js` (10KB) — script patching frontend
- `test_gas.js` — berisi URL API sensitif
- `package.json` — dependencies `puppeteer`, `jsdom`, `cheerio` yang tidak relevan dengan GAS

---

## 🟢 8. HAL YANG SUDAH BAIK ✅

### 8.1 Arsitektur Layered yang Rapi
Kode backend mengikuti pola **Repository → Service → Controller** yang terstruktur:
- `code.js` = Controller/Router (thin, hanya delegasi)
- `service.js` = Business Logic (validasi, orkestrasi)
- `repository.js` = Data Access (CRUD ke Sheets)
- `setup.js` = Configuration & Schema Migration
- `utils.js` = Cross-cutting Concerns

Ini adalah arsitektur yang sangat baik untuk proyek GAS.

### 8.2 LockService untuk Operasi Write
Semua operasi write (create, update, delete) menggunakan `LockService.getScriptLock()` dengan `waitLock(15000)` dan `releaseLock()` di `finally` block — ini mencegah data corruption dari concurrent writes.

### 8.3 Token-Based Authentication
`AuthService` menggunakan `CacheService` dengan UUID token dan TTL 6 jam — pendekatan yang cukup baik untuk GAS environment.

### 8.4 Separation of Concerns
- Auth token verification di controller layer
- Business logic di service layer
- Data access di repository layer

### 8.5 `SpreadsheetApp.flush()` Setelah Batch Writes
Pemanggilan `flush()` setelah operasi write memastikan data langsung tersimpan ke Sheets tanpa delay.

### 8.6 Sistem Notifikasi & Activity Log
Pencatatan log aktivitas dan notifikasi sudah terintegrasi di flow utama (submit pengajuan, update status).

### 8.7 WhatsApp Notification via Fonnte
Integrasi WhatsApp menggunakan `PropertiesService` untuk menyimpan API token (bukan hardcode) — ini best practice yang benar.

### 8.8 Database Migration dengan `setupDatabase()`
Fungsi setup yang idempotent (bisa dijalankan berulang tanpa merusak data existing) dengan migration logic (deteksi kolom kurang, auto-add).

---

## 📋 Prioritas Perbaikan (Roadmap Backend)

### Phase 1 — Security Critical (HARI INI, 2-3 jam)
- [ ] **Fix `doPost()` dengan whitelist** — ini celah RCE aktif
- [ ] **Hapus password dari response `getPenggunaList()`**
- [ ] **Filter data sensitif di `getAdminSetelan()`** (jangan kirim username/password)
- [ ] Tambahkan `.clasp.json` ke `.gitignore`
- [ ] Hapus `test_gas.js` dari repo (berisi URL API)
- [ ] Fix default password dari `"123456"` → password random yang di-generate

### Phase 2 — Security Hardening (1 minggu)
- [ ] Implementasi password hashing (SHA-256 + salt)
- [ ] Tambah validasi ownership di `reupload()`
- [ ] Tambah rate limiting untuk `submitPengajuanDesa()` dan `getPengajuanStatus()`
- [ ] Fix formula injection di `Sanitizer.clean()`
- [ ] Kurangi OAuth scope ke `drive.file` dan `spreadsheets.currentonly`
- [ ] Fix timezone inkonsistensi → seragamkan ke `Asia/Makassar`

### Phase 3 — Performance (2 minggu)
- [ ] Optimasi `getStats()` — query hanya kolom status
- [ ] Optimasi `getPaginated()` — hindari `getAll()` 
- [ ] Batch update di `PenggunaRepository.update()` — 1 API call, bukan 9
- [ ] Batch delete di `deleteFieldsByLayananId()` dan `deleteReqsByLayananId()`
- [ ] Caching untuk `getLayananList()` (data jarang berubah)

### Phase 4 — Code Quality (Opsional, 2 minggu)
- [ ] Bersihkan folder `tools/` dan file sementara
- [ ] Hapus dependencies tidak relevan di `package.json`
- [ ] Standarisasi error response format
- [ ] Tambah logging terstruktur
- [ ] Seragamkan timezone constant usage (gunakan `ZettConfig.TIMEZONE` everywhere)

---

## 🔄 Perbandingan Frontend vs Backend

| Aspek | Frontend | Backend |
|---|---|---|
| **Keamanan Terbesar** | API URL terekspos | `doPost()` RCE |
| **Arsitektur** | Monolith 1 file HTML | ✅ Layered (bagus!) |
| **Password** | Dummy di source | Plaintext di Sheets |
| **Auth** | localStorage (rentan XSS) | CacheService (cukup baik) |
| **Performa** | Tailwind CDN | getAll() bottleneck |
| **Overall** | UI bagus, security buruk | Arsitektur bagus, security buruk |

> [!TIP]
> **Kesimpulan:** Backend kamu memiliki **arsitektur yang jauh lebih baik** dibanding frontend — layered pattern, lock service, token auth, sanitizer. Namun ada satu celah **SANGAT KRITIS** di `doPost()` yang memungkinkan eksekusi fungsi apa saja. Perbaiki ini sebelum hal lain!
