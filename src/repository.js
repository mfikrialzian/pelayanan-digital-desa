/**
 * BaseRepository - Penanganan Koneksi ke Lembar Kerja Spreadsheet
 */
var BaseRepository = {
  getSheet: function(sheetName) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) throw new Error("Tabel sheet '" + sheetName + "' tidak ditemukan.");
    return sheet;
  }
};

/**
 * SetelanRepository - Penyimpanan Pasangan Kunci & Nilai Konfigurasi (CMS)
 */
var SetelanRepository = {
  getAll: function() {
    var sheet = BaseRepository.getSheet(ZettConstants.SHEET_SETELAN);
    var data = sheet.getDataRange().getDisplayValues();
    var setelan = {};
    for (var i = 1; i < data.length; i++) {
      setelan[data[i][0]] = data[i][1];
    }
    return setelan;
  },
  saveAll: function(newSetelan) {
    var sheet = BaseRepository.getSheet(ZettConstants.SHEET_SETELAN);
    var data = sheet.getDataRange().getValues();
    var keys = Object.keys(newSetelan);
    var keysToAppend = [];
    
    // Update nilai yang sudah ada langsung di array memori (tanpa API call per baris)
    keys.forEach(function(key) {
      var found = false;
      for (var i = 1; i < data.length; i++) {
        if (data[i][0] === key) {
          data[i][1] = newSetelan[key];
          found = true;
          break;
        }
      }
      if (!found) keysToAppend.push(key);
    });
    
    // Tulis ulang semua data sekaligus dalam satu batch call
    if (data.length > 0) {
      sheet.getRange(1, 1, data.length, 2).setValues(data);
    }
    
    // Tambahkan kunci baru yang belum ada
    keysToAppend.forEach(function(key) {
      sheet.appendRow([key, newSetelan[key]]);
    });
  }
};

/**
 * LayananRepository - Manajemen Persyaratan & Pertanyaan Layanan di Database
 */
var LayananRepository = {
  getAllMaster: function() {
    var sheet = BaseRepository.getSheet(ZettConstants.SHEET_LAYANAN);
    var data = sheet.getDataRange().getDisplayValues();
    var master = [];
    for (var i = 1; i < data.length; i++) {
      master.push({
        id: data[i][0],
        nama: data[i][1],
        deskripsi: data[i][2],
        judulSectionIsian: data[i][3],
        deskripsiSectionIsian: data[i][4],
        logikaKondisional: data[i][5],
        templateDocId: data[i][6] || ""
      });
    }
    return master;
  },
  
  findMasterByName: function(name) {
    var list = this.getAllMaster();
    return list.find(function(item) { return item.nama === name; });
  },
  
  insertMaster: function(record) {
    var sheet = BaseRepository.getSheet(ZettConstants.SHEET_LAYANAN);
    sheet.appendRow([
      record.id,
      record.nama,
      record.deskripsi,
      record.judulSectionIsian,
      record.deskripsiSectionIsian,
      record.logikaKondisional,
      record.templateDocId || ""
    ]);
  },
  
  updateMaster: function(id, record) {
    var sheet = BaseRepository.getSheet(ZettConstants.SHEET_LAYANAN);
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === id) {
        sheet.getRange(i + 1, 2).setValue(record.nama);
        sheet.getRange(i + 1, 4).setValue(record.judulSectionIsian);
        sheet.getRange(i + 1, 5).setValue(record.deskripsiSectionIsian);
        sheet.getRange(i + 1, 6).setValue(record.logikaKondisional);
        sheet.getRange(i + 1, 7).setValue(record.templateDocId || "");
        break;
      }
    }
  },
  
  deleteMasterById: function(id) {
    var sheet = BaseRepository.getSheet(ZettConstants.SHEET_LAYANAN);
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === id) {
        sheet.deleteRow(i + 1);
        break;
      }
    }
  },
  
  getAllFields: function() {
    var sheet = BaseRepository.getSheet(ZettConstants.SHEET_FIELDS);
    var data = sheet.getDataRange().getDisplayValues();
    var fields = [];
    for (var i = 1; i < data.length; i++) {
      fields.push({
        id: data[i][0],
        idLayanan: data[i][1],
        name: data[i][2],
        type: data[i][3],
        options: data[i][4],
        required: data[i][5],
        label: data[i][6]
      });
    }
    return fields;
  },
  
  insertField: function(record) {
    var sheet = BaseRepository.getSheet(ZettConstants.SHEET_FIELDS);
    sheet.appendRow([
      record.id,
      record.idLayanan,
      record.name,
      record.type,
      record.options,
      record.required,
      record.label
    ]);
  },
  
  deleteFieldsByLayananId: function(idLayanan) {
    var sheet = BaseRepository.getSheet(ZettConstants.SHEET_FIELDS);
    var data = sheet.getDataRange().getValues();
    for (var i = data.length - 1; i >= 1; i--) {
      if (data[i][1] === idLayanan) {
        sheet.deleteRow(i + 1);
      }
    }
  },
  
  getAllReqs: function() {
    var sheet = BaseRepository.getSheet(ZettConstants.SHEET_REQS);
    var data = sheet.getDataRange().getDisplayValues();
    var reqs = [];
    for (var i = 1; i < data.length; i++) {
      reqs.push({
        id: data[i][0],
        idLayanan: data[i][1],
        name: data[i][2]
      });
    }
    return reqs;
  },
  
  insertRequirement: function(record) {
    var sheet = BaseRepository.getSheet(ZettConstants.SHEET_REQS);
    sheet.appendRow([record.id, record.idLayanan, record.name]);
  },
  
  deleteReqsByLayananId: function(idLayanan) {
    var sheet = BaseRepository.getSheet(ZettConstants.SHEET_REQS);
    var data = sheet.getDataRange().getValues();
    for (var i = data.length - 1; i >= 1; i--) {
      if (data[i][1] === idLayanan) {
        sheet.deleteRow(i + 1);
      }
    }
  }
};

/**
 * PengajuanRepository - Penanganan Penulisan / Pembacaan Berkas Pengajuan
 */
var PengajuanRepository = {
  getAll: function() {
    var sheet = BaseRepository.getSheet(ZettConstants.SHEET_PENGAJUAN);
    var rawData = sheet.getDataRange().getDisplayValues();
    var results = [];
    
    for (var i = 1; i < rawData.length; i++) {
      results.push({
        id: rawData[i][0],
        tanggal: rawData[i][1],
        nik: rawData[i][2],
        nama: rawData[i][3],
        layanan: rawData[i][4],
        wa: rawData[i][5],
        alamat: rawData[i][6],
        linkDokumen: rawData[i][7],
        status: rawData[i][8],
        catatan: rawData[i][9],
        detailLayanan: rawData[i][10] || "-"
      });
    }
    return results;
  },
  
  getById: function(id) {
    var list = this.getAll();
    return list.find(function(item) { return item.id === id; });
  },
  
  insert: function(record) {
    var sheet = BaseRepository.getSheet(ZettConstants.SHEET_PENGAJUAN);
    sheet.appendRow([
      record.id,
      record.tanggal,
      record.nik,
      record.nama,
      record.layanan,
      record.wa,
      record.alamat,
      record.linkDokumen,
      record.status,
      record.catatan,
      record.detailLayanan
    ]);
  },
  
  update: function(id, record) {
    var sheet = BaseRepository.getSheet(ZettConstants.SHEET_PENGAJUAN);
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(id)) {
        var row = i + 1;
        if (record.linkDokumen !== undefined) sheet.getRange(row, 8).setValue(record.linkDokumen);
        if (record.status !== undefined) sheet.getRange(row, 9).setValue(record.status);
        if (record.catatan !== undefined) sheet.getRange(row, 10).setValue(record.catatan);
        break;
      }
    }
  },
  
  search: function(key) {
    var list = this.getAll();
    var cleanKey = String(key).trim().toLowerCase();
    return list.filter(function(item) {
      return item.id.toLowerCase().indexOf(cleanKey) !== -1 || item.nik === cleanKey;
    });
  },
  
  getPaginated: function(filterKeyword, page, statusFilter) {
    var all = this.getAll();
    var filtered = [];
    var keyword = String(filterKeyword || "").toLowerCase().trim();
    var stat = String(statusFilter || "").trim();
    
    // Looping terbalik (terbaru tampil di halaman pertama)
    for (var i = all.length - 1; i >= 0; i--) {
      var item = all[i];
      var matchesK = !keyword || 
                     item.id.toLowerCase().indexOf(keyword) !== -1 || 
                     item.nik.indexOf(keyword) !== -1 || 
                     item.nama.toLowerCase().indexOf(keyword) !== -1;
                     
      var matchesS = true;
      if (stat) {
        if (stat === "Selesai") {
          matchesS = (item.status === ZettConstants.STATUS_SELESAI || item.status === "Selesai");
        } else {
          matchesS = (item.status === stat);
        }
      }
      
      if (matchesK && matchesS) {
        filtered.push(item);
      }
    }
    
    var limit = ZettConfig.PAGINATION_LIMIT;
    var totalItems = filtered.length;
    var totalPages = Math.max(1, Math.ceil(totalItems / limit));
    var currentPage = Math.max(1, Math.min(page || 1, totalPages));
    var startIndex = (currentPage - 1) * limit;
    var paginated = filtered.slice(startIndex, startIndex + limit);
    
    return {
      data: paginated,
      totalPages: totalPages,
      currentPage: currentPage,
      totalItems: totalItems
    };
  }
};

/**
 * ActivityRepository - Log aktivitas sistem
 */
var ActivityRepository = {
  getAll: function(limit) {
    var sheet = BaseRepository.getSheet(ZettConstants.SHEET_AKTIVITAS);
    var data = sheet.getDataRange().getDisplayValues();
    var list = [];
    // Baca dari bawah ke atas agar aktivitas terbaru di awal
    var max = limit ? Math.min(data.length - 1, limit) : data.length - 1;
    for (var i = data.length - 1; i > data.length - 1 - max; i--) {
      if (i === 0) break;
      list.push({
        id: data[i][0],
        waktu: data[i][1],
        tipe: data[i][2],
        pesan: data[i][3],
        pelaku: data[i][4]
      });
    }
    return list;
  },
  insert: function(record) {
    var sheet = BaseRepository.getSheet(ZettConstants.SHEET_AKTIVITAS);
    sheet.appendRow([record.id, record.waktu, record.tipe, record.pesan, record.pelaku]);
  }
};

/**
 * NotificationRepository - Notifikasi admin
 */
var NotificationRepository = {
  getAll: function(limit) {
    var sheet = BaseRepository.getSheet(ZettConstants.SHEET_NOTIFIKASI);
    var data = sheet.getDataRange().getDisplayValues();
    var list = [];
    var max = limit ? Math.min(data.length - 1, limit) : data.length - 1;
    for (var i = data.length - 1; i > data.length - 1 - max; i--) {
      if (i === 0) break;
      list.push({
        id: data[i][0],
        waktu: data[i][1],
        tipe: data[i][2],
        judul: data[i][3],
        pesan: data[i][4],
        dibaca: data[i][5] === "TRUE",
        idReferensi: data[i][6]
      });
    }
    return list;
  },
  insert: function(record) {
    var sheet = BaseRepository.getSheet(ZettConstants.SHEET_NOTIFIKASI);
    sheet.appendRow([record.id, record.waktu, record.tipe, record.judul, record.pesan, "FALSE", record.idReferensi]);
  }
};
