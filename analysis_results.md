# 🔍 Analisis Mendalam Frontend — Pelayanan Digital Desa Narmada

> Analisis menyeluruh terhadap arsitektur, keamanan, kualitas kode, dan performa frontend Vercel + GAS.

---

## 📊 Ringkasan Temuan

| Kategori | Status | Prioritas |
|---|---|---|
| 🔴 Keamanan (API Key & XSS) | **KRITIS** | Harus diperbaiki segera |
| 🔴 Arsitektur File | **BURUK** | Refactor dianjurkan |
| 🟡 Service Worker | **PERLU PERBAIKAN** | Bug potensial caching |
| 🟡 PWA Manifest | **KURANG** | Ikon dan konfigurasi |
| 🟡 Kode Duplikat | **BANYAK** | Refactor bertahap |
| 🟢 UI/UX & Styling | **BAIK** | Minor polish saja |
| 🟢 Logika Bisnis | **CUKUP BAIK** | Beberapa edge case |

---

## 🔴 1. KEAMANAN — Masalah KRITIS

### 1.1 API Key GAS Terekspos di Frontend (SANGAT KRITIS)

Di [index.html](file:///d:/PelayananDigitalDesa/vercel-frontend/index.html#L39), URL deployment Google Apps Script kamu **hard-coded langsung di HTML**:

```javascript
// file: index.html, line 39
const GAS_API_URL = "https://script.google.com/macros/s/AKfycby.../exec";
```

Dan juga duplikat di [script_utils.js](file:///d:/PelayananDigitalDesa/vercel-frontend/script_utils.js#L2):

```javascript
// file: script_utils.js, line 2
var GAS_API_URL = "https://script.google.com/macros/s/GANTI_DENGAN_URL_WEB_APP_ANDA/exec";
```

> [!CAUTION]
> **Masalah:**
> 1. URL GAS di `index.html` bisa dilihat siapa saja lewat "View Source", memungkinkan serangan langsung ke backend.
> 2. Ada **DUPLIKASI** deklarasi `GAS_API_URL` di dua tempat — yang di `script_utils.js` bahkan masih placeholder! Yang dipakai polyfill di `index.html` langsung, sementara `callGASApi()` di `script_utils.js` pakai variabel yang berbeda.
> 3. `.env.local` berisi **Vercel OIDC token** lengkap — meskipun sudah di-gitignore, ini tetap risiko jika di-copy sembarangan.

**Rekomendasi:**
- Buat **Vercel Serverless Function** sebagai proxy. GAS URL hanya disimpan di environment variable server-side.
- Hapus `GAS_API_URL` dari semua file frontend.
- Atau minimal, pindahkan ke environment variable Vercel dan akses via `/api/proxy` endpoint.

---

### 1.2 XSS (Cross-Site Scripting) — Rentan di Banyak Tempat

Kamu menggunakan `innerHTML` secara masif dengan data yang **bisa datang dari user** tanpa sanitasi:

```javascript
// script_warga.js, contoh di line 123
'<p class="...">' + row.nama + '</p>'
```

```javascript
// script_admin.js, contoh di line 288
'<td class="py-3 px-4 font-bold text-slate-800">' + (u.nama || '-') + '</td>'
```

> [!WARNING]
> Jika seseorang memasukkan nama seperti `<img src=x onerror="alert('hacked')">` di formulir, kode ini akan **mengeksekusi script berbahaya** di browser admin. Ini bisa mencuri token login admin dari `localStorage`.

**Rekomendasi:**
Buat fungsi `escapeHtml()` dan gunakan di SEMUA tempat yang menampilkan data user:

```javascript
function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}
```

---

### 1.3 Autentikasi Token di localStorage (Risiko Tinggi)

```javascript
// script_admin.js, line 15
localStorage.setItem('adminToken_Narmada', res.token);
```

> [!WARNING]
> `localStorage` **tidak memiliki proteksi XSS** sama sekali. Jika ada satu celah XSS (lihat poin 1.2), attacker bisa mencuri token admin dengan satu baris: `localStorage.getItem('adminToken_Narmada')`.

**Rekomendasi:**
- Idealnya gunakan `httpOnly cookie` via serverless function.
- Minimal, tambahkan token expiration check di client.
- Tambahkan Content Security Policy (CSP) header di `vercel.json`.

---

### 1.4 Dummy Password Hard-Coded

Di [script_core.js](file:///d:/PelayananDigitalDesa/vercel-frontend/script_core.js#L72-L74):

```javascript
var dummySetelan = {
    username: "admin_narmada",
    password: "Narmada2026",
    ...
};
```

> [!CAUTION]
> Username dan password admin **terlihat oleh semua orang** yang membuka website dan melihat source code. Meskipun ini data dummy, user mungkin menganggapnya real dan mencoba kredensial ini.

**Rekomendasi:** Hapus semua kredensial dari frontend code. Data dummy seharusnya tidak mengandung password yang terlihat realistis.

---

## 🔴 2. ARSITEKTUR FILE — Perlu Refactor Besar

### 2.1 index.html = 226KB, 2522 Baris (MONOLITH)

File [index.html](file:///d:/PelayananDigitalDesa/vercel-frontend/index.html) berisi **2.522 baris** HTML monolitik. Ini sangat sulit untuk:
- Debug saat ada error
- Berkolaborasi (merge conflict sangat sering)
- Dipahami developer baru

### 2.2 script_admin.js = 178KB, 3485 Baris (MONOLITH)

[script_admin.js](file:///d:/PelayananDigitalDesa/vercel-frontend/script_admin.js) adalah file JavaScript terbesar — **3.485 baris** dalam satu file, mencakup:
- Login/Logout
- RBAC
- Dashboard stats
- Tabel pengajuan
- Verifikasi berkas
- Layanan builder
- Manajemen pengguna
- Laporan
- Pengaturan

### 2.3 File Sampah di Root Folder

Folder [vercel-frontend](file:///d:/PelayananDigitalDesa/vercel-frontend) berisi banyak file yang **seharusnya tidak ada di production**:

| File | Ukuran | Masalah |
|---|---|---|
| `deleted_admin.txt` | 125KB | File backup/log lama |
| `diff.txt` | 100KB | File diff debug |
| `old_admin_ui_diff.txt` | 87KB | File diff lama |
| `log_admin.txt` | 891KB | Log debug BESAR |
| `extracted_subviews.html` | 38KB | File sementara |
| `fix.js`, `fix_all_subviews.js`, `fix_keys.js` | ~2KB | Script perbaikan temporer |
| `insert_info_akun.js` | 3.9KB | Script insert sementara |
| `list_subviews.js` | 274B | Script utilitas sementara |
| `push.bat` | 281B | Batch script |
| `favicon.png` | **5MB** | TERLALU BESAR untuk favicon! |

> [!IMPORTANT]
> `favicon.png` berukuran **5MB** — ini seharusnya di-resize ke maksimal 32x32px (< 10KB) untuk favicon dan 512x512px (< 100KB) untuk PWA icon. File ini memperlambat loading page secara signifikan.

**Rekomendasi:**
- Buat `.gitignore` yang lebih ketat
- Hapus semua file temporer (`*.txt`, `fix*.js`, `*.bat`)
- Resize `favicon.png` menjadi beberapa ukuran: `favicon-32.png`, `icon-192.png`, `icon-512.png`
- Struktur folder yang lebih baik:
  ```
  vercel-frontend/
  ├── assets/
  │   ├── icons/
  │   └── images/
  ├── css/
  │   └── style.css
  ├── js/
  │   ├── core.js
  │   ├── utils.js
  │   ├── warga.js
  │   └── admin/
  │       ├── auth.js
  │       ├── dashboard.js
  │       ├── layanan-builder.js
  │       ├── verifikasi.js
  │       └── settings.js
  ├── index.html
  ├── manifest.json
  ├── sw.js
  └── vercel.json
  ```

---

## 🟡 3. SERVICE WORKER — Bug dan Perbaikan

### 3.1 Caching CDN yang Bermasalah

Di [sw.js](file:///d:/PelayananDigitalDesa/vercel-frontend/sw.js#L9-L11):

```javascript
const urlsToCache = [
    // ...
    'https://cdn.tailwindcss.com',         // CDN TailwindCSS
    'https://fonts.googleapis.com/...',     // Google Fonts
    'https://cdnjs.cloudflare.com/...'     // Font Awesome
];
```

> [!WARNING]
> **Masalah:**
> 1. `https://cdn.tailwindcss.com` hanya CDN utama, Tailwind memuat banyak sub-resource yang TIDAK ter-cache.
> 2. Jika salah satu URL CDN gagal saat install, **seluruh cache install akan GAGAL** (`cache.addAll` bersifat atomic).
> 3. Filter `response.type !== 'basic'` di line 43 akan **menolak caching CORS response** (semua CDN di atas!) — artinya asset CDN **tidak pernah ter-cache ulang** setelah pre-cache pertama.

**Rekomendasi:**
```javascript
// Pisahkan cache essential vs optional
const CACHE_ESSENTIAL = ['/', '/index.html', '/style.css', '/script_warga.js', '/script_admin.js'];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(CACHE_ESSENTIAL))
    );
});

// Untuk CDN, gunakan strategi stale-while-revalidate
self.addEventListener('fetch', event => {
    if (event.request.url.includes('cdn') || event.request.url.includes('fonts')) {
        // Stale-while-revalidate untuk CDN
        event.respondWith(
            caches.match(event.request).then(cached => {
                const fetched = fetch(event.request).then(response => {
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone()));
                    return response;
                });
                return cached || fetched;
            })
        );
        return;
    }
    // ... strategi cache-first untuk asset lokal
});
```

### 3.2 Cache API Request

Di [sw.js](file:///d:/PelayananDigitalDesa/vercel-frontend/sw.js#L52-L55):

```javascript
// Don't cache API requests or non-http/https
if (event.request.url.startsWith('http')) {
    cache.put(event.request, responseToCache);
}
```

> [!WARNING]
> **Komentar bilang "Don't cache API requests"** tapi kode malah caching **SEMUA request HTTP** termasuk API call ke GAS! Ini bisa menyebabkan user melihat data lama (stale data).

**Fix:** Tambahkan exclude untuk URL API:

```javascript
if (event.request.url.startsWith('http') && 
    !event.request.url.includes('script.google.com') &&
    !event.request.url.includes('/api/')) {
    cache.put(event.request, responseToCache);
}
```

### 3.3 Tidak Ada Cache Versioning di Script Load

Di [index.html](file:///d:/PelayananDigitalDesa/vercel-frontend/index.html#L2500-L2503):

```html
<script src="script_utils.js?v=2.1"></script>
<script src="script_core.js?v=2.1"></script>
<script src="script_warga.js?v=2.1"></script>
<script src="script_admin.js?v=2.1"></script>
```

Manual versioning `?v=2.1` rentan lupa diupdate. SW cache version adalah `v11` sementara script version `2.1` — tidak sinkron.

---

## 🟡 4. PWA MANIFEST — Perlu Diperbaiki

Di [manifest.json](file:///d:/PelayananDigitalDesa/vercel-frontend/manifest.json):

```json
{
    "icons": [{
        "src": "favicon.png",
        "sizes": "192x192 512x512",  // ← SALAH format
        "type": "image/png",
        "purpose": "any maskable"     // ← Harus dipisah
    }]
}
```

> [!IMPORTANT]
> **Masalah:**
> 1. `"sizes": "192x192 512x512"` — Satu file tidak bisa sekaligus 192px dan 512px. Harus **2 entry terpisah** dengan file yang di-resize.
> 2. `"purpose": "any maskable"` — Menurut best practice terbaru, sebaiknya **dipisah jadi dua icon entry** karena maskable icon harus punya safe area padding.
> 3. File asli 5MB — ini SANGAT lambat untuk install PWA.

**Fix:**
```json
{
    "icons": [
        {
            "src": "icons/icon-192.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "any"
        },
        {
            "src": "icons/icon-512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "any"
        },
        {
            "src": "icons/icon-maskable-512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "maskable"
        }
    ]
}
```

---

## 🟡 5. KODE DUPLIKAT & INKONSISTENSI

### 5.1 Polyfill `google.script.run` vs `callGASApi()`

Ada **DUA sistem** untuk memanggil GAS API:

1. **Polyfill di index.html** (line 38-87) — membuat `window.google.script.run` palsu yang mengirim fetch ke GAS_API_URL.
2. **`callGASApi()` di script_utils.js** (line 5-31) — fungsi wrapper async terpisah.

```javascript
// Di index.html - Polyfill approach
google.script.run
    .withSuccessHandler(cb)
    .getAdminSetelan();

// Di script_utils.js - Wrapper approach (TIDAK DIPAKAI!)
async function callGASApi(action, params = null) { ... }
```

> [!IMPORTANT]
> `callGASApi()` **TIDAK PERNAH DIPANGGIL** di manapun di codebase! Ini dead code. Seluruh kode menggunakan polyfill `google.script.run` yang dibuat di `index.html`.

### 5.2 Variabel Campuran `var`, `let`, `const`

Kode mencampur tiga style deklarasi variabel secara tidak konsisten:

```javascript
// script_core.js - menggunakan var
var activeView = 'beranda';

// script_admin.js - menggunakan const
const SIDEBAR_ITEMS = [...];

// script_warga.js - menggunakan let di satu tempat
let hasTambahan = Object.keys(groupedReqs).some(k => k !== "Wajib"); // line 184
```

**Rekomendasi:** Pilih satu standard — gunakan `const` untuk konstanta dan `let` untuk variabel yang berubah. Hindari `var` sepenuhnya.

### 5.3 Global Variables Berserakan

Di [script_core.js](file:///d:/PelayananDigitalDesa/vercel-frontend/script_core.js#L87-L104), ada **17+ variabel global** tanpa namespace:

```javascript
var activeView = 'beranda';
var activeAdminTab = 'dashboard';
var currentAdminPage = 1;
var adminKeyword = '';
var activeStatusFilter = '';
var selectedLayananGlobal = null;
var uploadDataStore = {};
var currentWizardStep = 1;
var globalSettings = Object.assign({}, dummySetelan);
var isGoogleEnv = typeof google !== 'undefined'...;
window.isServiceOpen = false;
window.editingQuestionIndex = -1;
var builderActiveStep = 1;
var builderQuestions = [];
var builderReqMap = {};
```

**Rekomendasi:** Kelompokkan ke dalam namespace object:

```javascript
const AppState = {
    activeView: 'beranda',
    activeAdminTab: 'dashboard',
    currentAdminPage: 1,
    adminKeyword: '',
    // ...dst
};
```

### 5.4 Parsing `linkDokumen` Diduplikasi 3 Kali

Logika parsing `linkDokumen.split(",").map(...)` muncul di:
1. [script_warga.js line 1018](file:///d:/PelayananDigitalDesa/vercel-frontend/script_warga.js#L1018)
2. [script_admin.js line 644](file:///d:/PelayananDigitalDesa/vercel-frontend/script_admin.js#L644)
3. [script_admin.js line 962](file:///d:/PelayananDigitalDesa/vercel-frontend/script_admin.js#L962)

Seharusnya diextract menjadi satu fungsi utilitas.

### 5.5 Regex Parsing `[Keperluan] Nama` Diduplikasi 7+ Kali

Pattern ini muncul berulang-ulang:
```javascript
var match = cleanName.match(/^\[(.*?)\]\s*(.*)$/);
if (match) { keperluan = match[1]; cleanName = match[2]; }
```

**Rekomendasi:** Buat `parseRequirementLabel(name)` di `script_utils.js`.

---

## 🟡 6. PERFORMA

### 6.1 Tailwind CDN di Production (BURUK)

```html
<script src="https://cdn.tailwindcss.com"></script>
```

> [!WARNING]
> **Tailwind CDN** hanya untuk **development**! Di production:
> - Mengunduh ~300KB+ library JavaScript
> - Me-generate CSS di browser (blocking render)
> - Tidak ada tree-shaking (semua utility class dimuat)
>
> **Halaman website kamu akan LAMBAT** terutama di perangkat warga yang mungkin menggunakan HP low-end.

**Rekomendasi:** 
- Gunakan Tailwind CLI untuk build CSS final
- Atau gunakan tool seperti `@tailwindcss/standalone` untuk generate CSS saat build
- Atau minimal pindah ke CDN Tailwind versi CSS (`https://cdn.jsdelivr.net/npm/tailwindcss@latest/dist/tailwind.min.css`)

### 6.2 Chart.js Dimuat Global

```html
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```

Chart.js (~60KB gzipped) dimuat untuk **semua halaman** meskipun hanya dipakai di admin dashboard/laporan.

**Rekomendasi:** Lazy load hanya saat tab dashboard/laporan dibuka:
```javascript
function loadChartJs(callback) {
    if (window.Chart) return callback();
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    s.onload = callback;
    document.head.appendChild(s);
}
```

### 6.3 Base64 Image Upload (Membengkakkan Payload)

Di [script_warga.js](file:///d:/PelayananDigitalDesa/vercel-frontend/script_warga.js#L753):

```javascript
var compressedBase64 = canvas.toDataURL("image/jpeg", 0.70);
```

Base64 encoding menambah **~33% ukuran** dibanding binary. Jika warga mengirim 3 foto masing-masing 500KB, payload jadi ~2MB base64 string yang dikirim ke GAS.

---

## 🟡 7. VERCEL.JSON — Routing Kurang Lengkap

Di [vercel.json](file:///d:/PelayananDigitalDesa/vercel-frontend/vercel.json):

```json
{
    "rewrites": [
        { "source": "/admin", "destination": "/index.html" },
        { "source": "/admin/(.*)", "destination": "/index.html" }
    ]
}
```

**Yang perlu ditambahkan:**
```json
{
    "rewrites": [
        { "source": "/admin", "destination": "/index.html" },
        { "source": "/admin/(.*)", "destination": "/index.html" }
    ],
    "headers": [
        {
            "source": "/(.*)",
            "headers": [
                { "key": "X-Content-Type-Options", "value": "nosniff" },
                { "key": "X-Frame-Options", "value": "DENY" },
                { "key": "X-XSS-Protection", "value": "1; mode=block" },
                { "key": "Content-Security-Policy", "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data: https: blob:; connect-src 'self' https://script.google.com" }
            ]
        }
    ]
}
```

---

## 🟢 8. HAL YANG SUDAH BAIK ✅

### 8.1 UI/UX Design
- Glassmorphism yang konsisten dan menarik
- Tailwind color palette terstruktur (narmadaGreen, narmadaBlue)
- Responsive design dengan breakpoint mobile yang tepat
- Micro-animations (mesh gradient, accordion, slide transitions)
- Toast notification system yang elegan

### 8.2 Logika Bisnis
- Wizard multi-step yang well-structured (5 langkah)
- Conditional logic untuk field berdasarkan keperluan surat
- Image compression & sharpness detection sebelum upload
- Anti-spam cooldown 15 menit antar pengajuan
- Draft auto-save ke localStorage
- RBAC (Role-Based Access Control) dengan 5 peran

### 8.3 UX Patterns
- Skeleton loading states saat menunggu data
- Offline detection (`navigator.onLine`)
- Confirmation dialogs sebelum aksi destruktif
- Clipboard copy dengan fallback
- WhatsApp integration untuk notifikasi

---

## 📋 Prioritas Perbaikan (Roadmap)

### Phase 1 — Security Fix (SEGERA, 1-2 hari)
- [ ] Hapus GAS URL dari frontend, buat Vercel serverless proxy
- [ ] Implementasi `escapeHtml()` di semua `innerHTML`
- [ ] Hapus dummy credentials dari source code
- [ ] Tambah security headers di `vercel.json`

### Phase 2 — Performance (1 minggu)
- [ ] Ganti Tailwind CDN → build static CSS
- [ ] Resize favicon.png → multi-size icons
- [ ] Lazy load Chart.js
- [ ] Fix service worker caching strategy

### Phase 3 — Code Quality (2 minggu)
- [ ] Hapus semua file sampah (txt, fix*.js, bat)
- [ ] Refactor `script_admin.js` → modul terpisah
- [ ] Buat fungsi utilitas (parseRequirementLabel, parseLinkDokumen)
- [ ] Standardisasi `const`/`let` (hapus `var`)
- [ ] Hapus dead code (`callGASApi`, duplikat `GAS_API_URL`)
- [ ] Extract namespace untuk global state

### Phase 4 — Architecture (Opsional, 1 bulan)
- [ ] Migrasi ke framework (Vite + vanilla JS modules)
- [ ] Component-based HTML (template literals atau web components)
- [ ] Proper build pipeline dengan asset hashing

---

> [!TIP]
> **Untuk konteks vibe coding:** Kode ini sudah cukup fungsional dan UI-nya bagus untuk sebuah aplikasi desa. Namun masalah keamanan di Phase 1 **HARUS** diperbaiki sebelum production deployment karena ini menyangkut data pribadi warga (NIK, nama, foto dokumen).
