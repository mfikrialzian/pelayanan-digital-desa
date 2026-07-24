/**
 * Sanitizer - Proteksi dari Potensi Injeksi Skrip XSS
 */
var Sanitizer = {
  clean: function(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/<\/?[^>]+(>|$)/g, "").trim();
  },
  escapeHtml: function(text) {
    if (typeof text !== 'string') return text;
    var map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
  }
};

/**
 * IDGenerator - Pembuat Nomor Registrasi Urut Secara Kronologis
 */
var IDGenerator = {
  serial: function() {
    var sheet = BaseRepository.getSheet(ZettConstants.SHEET_PENGAJUAN);
    var today = new Date();
    var dateStr = Utilities.formatDate(today, ZettConfig.TIMEZONE, "yyyyMMdd");
    var prefix = "REQ-" + dateStr + "-";
    
    var lastRow = sheet.getLastRow();
    if (lastRow < 2) return prefix + "0001";
    
    var idValues = sheet.getRange(2, 1, lastRow - 1, 1).getDisplayValues();
    var maxSeq = 0;
    
    for (var i = 0; i < idValues.length; i++) {
      var currentId = idValues[i][0];
      if (currentId && currentId.indexOf(prefix) === 0) {
        var seqPart = currentId.substring(prefix.length);
        var seqNum = parseInt(seqPart, 10);
        if (!isNaN(seqNum) && seqNum > maxSeq) {
          maxSeq = seqNum;
        }
      }
    }
    
    var nextSeq = maxSeq + 1;
    var seqFormatted = String(nextSeq);
    while (seqFormatted.length < 4) {
      seqFormatted = "0" + seqFormatted;
    }
    return prefix + seqFormatted;
  }
};

/**
 * DriveHelper - Integrasi Berkas & Upload Dokumen ke Google Drive
 */
var DriveHelper = {
  getOrCreateTargetFolder: function(newId, name) {
    var mainFolder;
    var folders = DriveApp.getFoldersByName(ZettConfig.DRIVE_ROOT_FOLDER);
    if (folders.hasNext()) {
      mainFolder = folders.next();
    } else {
      mainFolder = DriveApp.createFolder(ZettConfig.DRIVE_ROOT_FOLDER);
    }
    
    var folderName = newId + " - " + name;
    var subFolders = mainFolder.getFoldersByName(folderName);
    if (subFolders.hasNext()) {
      return subFolders.next();
    } else {
      return mainFolder.createFolder(folderName);
    }
  }
};

/**
 * WhatsAppHelper - Integrasi Fonnte API untuk Notifikasi Otomatis
 * ⚠️ Simpan Token API Fonnte di Script Properties dengan kunci: FONNTE_TOKEN
 * Cara: Extensions > Apps Script > Project Settings > Script Properties > Add Property
 */
var WhatsAppHelper = {
  _getToken: function() {
    return PropertiesService.getScriptProperties().getProperty('FONNTE_TOKEN') || '';
  },
  
  sendMessage: function(targetNumber, messageText) {
    var token = this._getToken();
    if (!token || token.trim() === "") {
      Logger.log("Fonnte Token belum diatur. Set kunci 'FONNTE_TOKEN' di Script Properties.");
      return false;
    }
    
    // Pastikan nomor bersih dari simbol (+, -, spasi)
    var cleanNumber = String(targetNumber).replace(/\D/g, '');
    // Jika berawalan 62, ubah jadi 0 agar lebih stabil di Fonnte
    if (cleanNumber.startsWith('62')) {
       cleanNumber = '0' + cleanNumber.substring(2);
    }
    
    var url = "https://api.fonnte.com/send";
    var payload = {
      "target": cleanNumber,
      "message": messageText
    };
    
    var options = {
      "method": "post",
      "headers": {
        "Authorization": token
      },
      "payload": payload,
      "muteHttpExceptions": true
    };
    
    try {
      var response = UrlFetchApp.fetch(url, options);
      Logger.log("Fonnte Response: " + response.getContentText());
      return true;
    } catch (e) {
      Logger.log("Fonnte Error: " + e.toString());
      return false;
    }
  }
};

/**
 * JALANKAN FUNGSI INI DARI EDITOR APPS SCRIPT UNTUK MEMBERIKAN IZIN (AUTHORIZATION)
 * DAN MENGETES APAKAH TOKEN SUDAH BENAR.
 */
function testKoneksiFonnte() {
  // Ganti dengan nomormu sendiri untuk testing
  var nomorTes = PropertiesService.getScriptProperties().getProperty('ADMIN_PHONE') || "081234567890"; // Ganti via Script Properties
  var sukses = WhatsAppHelper.sendMessage(nomorTes, "Halo! Ini adalah pesan uji coba dari sistem Pelayanan Digital Desa.");
  if (sukses) {
    Logger.log("Berhasil memanggil fungsi Fonnte. Cek WA kamu!");
  } else {
    Logger.log("Gagal. Pastikan Token benar dan perangkat sudah terkoneksi di Fonnte.");
  }
}

/**
 * FUNGSI PANCINGAN
 * Jalankan ini untuk memancing pop-up izin keluar secara paksa
 */
function paksaIzin() {
  UrlFetchApp.fetch("https://google.com");
}