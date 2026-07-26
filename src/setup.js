/**
 * ZettBOT Architect v3.0.0 - Centralized Configurations
 * Seluruh konfigurasi aplikasi dipusatkan di sini untuk mempermudah pemeliharaan jangka panjang.
 */
var ZettConfig = {
  APP_NAME: "Pelayanan Digital Desa Narmada",
  VERSION: "3.0.0",
  TIMEZONE: "Asia/Jakarta",
  DRIVE_ROOT_FOLDER: "Pelayanan Desa Narmada",
  PAGINATION_LIMIT: 10,
  MAX_FILE_SIZE_MB: 2,
  DEVELOPER_MODE: false
};


/**
 * ZettBOT Architect v3.0.0 - Centralized Constants
 * Nilai tetap terstandarisasi untuk mencegah inkonsistensi data di database.
 */
var ZettConstants = {
  SHEET_PENGAJUAN: "Pengajuan",
  SHEET_LAYANAN: "Layanan",
  SHEET_FIELDS: "Layanan_Fields",
  SHEET_REQS: "Layanan_Requirements",
  SHEET_SETELAN: "Setelan",
  SHEET_PENGGUNA: "Pengguna",
  SHEET_AKTIVITAS: "Aktivitas",
  SHEET_NOTIFIKASI: "Notifikasi",
  
  STATUS_PENDING: "Menunggu",
  STATUS_VERIFIKASI: "Verifikasi",
  STATUS_SELESAI: "Selesai",
  STATUS_REUPLOAD: "Perbaikan",
  
  DEFAULT_WA_CONTACT: "+6281234567890",
  DEFAULT_LOGO_URL: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Coat_of_arms_of_Indonesia_Garuda_Pancasila.svg"
  // DEFAULT_ADMIN_USER & DEFAULT_ADMIN_PASS dipindah ke Script Properties (kunci: ADMIN_USERNAME, ADMIN_PASSWORD)
};


/**
 * Fungsi Setup Mandiri / Inisialisasi Skema Database Relasional Spreadsheet
 * Menggunakan konstanta terpusat untuk menjamin konsistensi skema tabel.
 */
function setupDatabase() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var lock = LockService.getScriptLock();
  
  try {
    lock.waitLock(15000);
    
    // 1. Inisialisasi Sheet Pengajuan
    var sPengajuan = ss.getSheetByName(ZettConstants.SHEET_PENGAJUAN);
    if (!sPengajuan) {
      sPengajuan = ss.insertSheet(ZettConstants.SHEET_PENGAJUAN);
      sPengajuan.appendRow([
        "ID Registrasi", "Tanggal Pengajuan", "NIK", "Nama Lengkap", 
        "Layanan", "WhatsApp", "Alamat Pemohon", "Link Dokumen", "Status", "Catatan Admin", "Isian Formulir Tambahan"
      ]);
      sPengajuan.getRange("A1:K1").setFontWeight("bold").setBackground("#059669").setFontColor("#FFFFFF");
    } else {
      var maxCols = sPengajuan.getLastColumn();
      if (maxCols === 10) {
        sPengajuan.insertColumnBefore(7);
        sPengajuan.getRange(1, 7).setValue("Alamat Pemohon");
        sPengajuan.getRange("A1:K1").setFontWeight("bold").setBackground("#059669").setFontColor("#FFFFFF");
      }
    }

    // 2. Inisialisasi Sheet Layanan Master
    var sLayanan = ss.getSheetByName(ZettConstants.SHEET_LAYANAN);
    if (!sLayanan) {
      sLayanan = ss.insertSheet(ZettConstants.SHEET_LAYANAN);
      sLayanan.appendRow(["ID Layanan", "Nama Layanan", "Deskripsi", "Judul Section Isian", "Deskripsi Section Isian", "Logika Kondisional"]);
      sLayanan.getRange("A1:F1").setFontWeight("bold").setBackground("#059669").setFontColor("#FFFFFF");
      
      // Data Awal Layanan SKU
      sLayanan.appendRow([
        "LAY-001", 
        "Surat Keterangan Usaha (SKU)", 
        "Untuk pengurusan legalitas usaha dan modal bank.", 
        "Detail Usaha & Pekerjaan", 
        "Lengkapi data operasional usaha yang sah guna pencetakan dokumen SKU Anda.",
        '[{"ifField":"Pekerjaan","ifValue":"Wirausaha","thenRequire":"Foto Lokasi Tempat Usaha"}]'
      ]);
      
      // Data Awal Layanan Domisili
      sLayanan.appendRow([
        "LAY-002", 
        "Surat Keterangan Domisili", 
        "Untuk bukti berdomisili resmi di wilayah Desa Narmada.", 
        "Detail Keperluan Domisili", 
        "Tuliskan tujuan pokok dari pengajuan surat keterangan domisili Anda.",
        "[]"
      ]);
    }

    // 3. Inisialisasi Sheet Layanan_Fields (Pertanyaan Dinamis)
    var sFields = ss.getSheetByName(ZettConstants.SHEET_FIELDS);
    if (!sFields) {
      sFields = ss.insertSheet(ZettConstants.SHEET_FIELDS);
      sFields.appendRow(["ID Field", "ID Layanan", "Nama Kolom", "Tipe", "Pilihan Dropdown", "Wajib Isi", "Label Formulir"]);
      sFields.getRange("A1:G1").setFontWeight("bold").setBackground("#059669").setFontColor("#FFFFFF");
      
      sFields.appendRow(["FLD-001", "LAY-001", "Pekerjaan", "dropdown", "Wirausaha,Karyawan Swasta,PNS,Lainnya", "ya", "Pekerjaan Pemohon"]);
      sFields.appendRow(["FLD-002", "LAY-001", "Nama Usaha", "text", "", "ya", "Nama Usaha Yang Dijalankan"]);
      sFields.appendRow(["FLD-004", "LAY-002", "Tujuan Pembuatan", "text", "", "ya", "Keperluan Pembuatan Surat"]);
    }

    // 4. Inisialisasi Sheet Layanan_Requirements (Berkas Syarat)
    var sReqs = ss.getSheetByName(ZettConstants.SHEET_REQS);
    if (!sReqs) {
      sReqs = ss.insertSheet(ZettConstants.SHEET_REQS);
      sReqs.appendRow(["ID Syarat", "ID Layanan", "Nama Syarat Berkas"]);
      sReqs.getRange("A1:C1").setFontWeight("bold").setBackground("#059669").setFontColor("#FFFFFF");
      
      sReqs.appendRow(["REQ-001", "LAY-001", "Foto KTP Asli Pemohon"]);
      sReqs.appendRow(["REQ-002", "LAY-001", "Foto Kartu Keluarga (KK)"]);
      sReqs.appendRow(["REQ-003", "LAY-001", "Foto Lokasi Tempat Usaha"]);
      sReqs.appendRow(["REQ-004", "LAY-002", "Foto KTP Asli"]);
      sReqs.appendRow(["REQ-005", "LAY-002", "Foto Surat Pengantar RT/RW"]);
    }

    // 5. Inisialisasi Sheet Setelan Terpusat
    var sSetelan = ss.getSheetByName(ZettConstants.SHEET_SETELAN);
    if (!sSetelan) {
      sSetelan = ss.insertSheet(ZettConstants.SHEET_SETELAN);
      sSetelan.appendRow(["Kunci", "Nilai"]);
      sSetelan.getRange("A1:B1").setFontWeight("bold").setBackground("#059669").setFontColor("#FFFFFF");
      
      var props = PropertiesService.getScriptProperties();
      var defaultSetelan = [
        ["username", props.getProperty('ADMIN_USERNAME') || "admin_narmada"],
        ["password", props.getProperty('ADMIN_PASSWORD') || "GANTI_PASSWORD_ANDA"],
        ["kontak_wa", ZettConstants.DEFAULT_WA_CONTACT],
        ["nama_desa", "Narmada"],
        ["logo_url_desa", ZettConstants.DEFAULT_LOGO_URL],
        ["deskripsi_banner", "Urus kebutuhan administrasi desa lebih mudah, cepat, dan transparan."],
        ["status_jam_pelayanan", "on"],
        ["deskripsi_jam_pelayanan", "Senin - Jumat 08.00 - 14.00 WITA"],
        ["status_alur", "on"],
        ["deskripsi_alur", "Ajukan Online -> Verifikasi -> Serahkan Berkas Fisik -> Ambil Surat"],
        ["status_banner_semi", "on"],
        ["deskripsi_banner_semi", "Anda dapat mengajukan permohonan secara online dari rumah. Setelah permohonan diverifikasi, silakan datang ke kantor desa untuk menyerahkan dokumen fisik sesuai dengan persyaratan."]
      ];
      sSetelan.getRange(2, 1, defaultSetelan.length, 2).setValues(defaultSetelan);
    }

    // 6. Inisialisasi Sheet Aktivitas
    var sAktivitas = ss.getSheetByName(ZettConstants.SHEET_AKTIVITAS);
    if (!sAktivitas) {
      sAktivitas = ss.insertSheet(ZettConstants.SHEET_AKTIVITAS);
      sAktivitas.appendRow(["ID", "Waktu", "Tipe", "Pesan", "Pelaku"]);
      sAktivitas.getRange("A1:E1").setFontWeight("bold").setBackground("#059669").setFontColor("#FFFFFF");
    }

    // 7. Inisialisasi Sheet Notifikasi
    var sNotifikasi = ss.getSheetByName(ZettConstants.SHEET_NOTIFIKASI);
    if (!sNotifikasi) {
      sNotifikasi = ss.insertSheet(ZettConstants.SHEET_NOTIFIKASI);
      sNotifikasi.appendRow(["ID", "Waktu", "Tipe", "Judul", "Pesan", "Dibaca", "ID Referensi"]);
      sNotifikasi.getRange("A1:G1").setFontWeight("bold").setBackground("#059669").setFontColor("#FFFFFF");
    }


    // 8. Inisialisasi Sheet Pengguna
    var sPengguna = ss.getSheetByName(ZettConstants.SHEET_PENGGUNA);
    if (!sPengguna) {
      sPengguna = ss.insertSheet(ZettConstants.SHEET_PENGGUNA);
      sPengguna.appendRow(["ID", "Username", "Password", "Nama Lengkap", "Peran", "Unit", "Status", "Terakhir Login"]);
      sPengguna.getRange("A1:H1").setFontWeight("bold").setBackground("#059669").setFontColor("#FFFFFF");
      
      var props = PropertiesService.getScriptProperties();
      var defaultUsername = props.getProperty('ADMIN_USERNAME') || "superadmin";
      var defaultPassword = props.getProperty('ADMIN_PASSWORD') || "123456"; // Default strong password or just 123
      sPengguna.appendRow([Utilities.getUuid(), defaultUsername, defaultPassword, "Administrator (System)", "Super Admin", "Pusat", "Aktif", "-"]);
    }

    SpreadsheetApp.flush();
    return "Database Narmada v3.0.0 berhasil dibangun & dimigrasikan secara mulus.";
  } catch (err) {
    Logger.log("Setup Error: " + err.toString());
    throw err;
  } finally {
    lock.releaseLock();
  }
}