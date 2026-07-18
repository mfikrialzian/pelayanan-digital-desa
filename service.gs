/**
 * AuthService - Manajemen Hak Akses Admin
 */
var AuthService = {
  login: function(username, password) {
    try {
      var setelan = SetelanRepository.getAll();
      var props = PropertiesService.getScriptProperties();
      var storedUser = setelan.username || props.getProperty('ADMIN_USERNAME') || "admin_narmada";
      var storedPass = setelan.password || props.getProperty('ADMIN_PASSWORD') || "";
      
      if (username === storedUser && password === storedPass) {
        return { success: true };
      }
      return { success: false, message: "Kredensial otorisasi administratif salah!" };
    } catch (e) {
      return { success: false, message: "Auth Error: " + e.toString() };
    }
  }
};

/**
 * ConfigService - Pengaturan Konfigurasi (CMS) Beranda Desa
 */
var ConfigService = {
  getSetelan: function() {
    return SetelanRepository.getAll();
  },
  update: function(newSetelan) {
    try {
      SetelanRepository.saveAll(newSetelan);
      return { success: true, message: "Konfigurasi kustomisasi beranda sukses disimpan!" };
    } catch (e) {
      return { success: false, message: "Config Error: " + e.toString() };
    }
  }
};

/**
 * LayananService - Orkestrasi Template Formulir & Persyaratan Kondisional
 */
var LayananService = {
  getList: function() {
    try {
      var master = LayananRepository.getAllMaster();
      var fields = LayananRepository.getAllFields();
      var reqs = LayananRepository.getAllReqs();
      
      return master.map(function(lay) {
        var idLay = lay.id;
        return {
          id: idLay,
          nama: lay.nama,
          deskripsi: lay.deskripsi,
          judulSectionIsian: lay.judulSectionIsian || "Formulir Isian Tambahan",
          deskripsiSectionIsian: lay.deskripsiSectionIsian || "Mohon lengkapi rincian formulir berikut.",
          logikaKondisional: lay.logikaKondisional || "[]",
          fields: fields.filter(function(f) { return f.idLayanan === idLay; }),
          requirements: reqs.filter(function(r) { return r.idLayanan === idLay; })
        };
      });
    } catch (e) {
      Logger.log("LayananService.getList Error: " + e.toString());
      return [];
    }
  },
  
  crud: function(action, dataObj) {
    var lock = LockService.getScriptLock();
    try {
      lock.waitLock(15000);
      dataObj.nama = Sanitizer.clean(dataObj.nama);
      
      if (action === "create" || action === "update") {
        var targetId = dataObj.id;
        
        if (action === "create") {
          targetId = "LAY-" + Utilities.formatDate(new Date(), ZettConfig.TIMEZONE, "yyyyMMddHHmmss") + Math.floor(Math.random() * 1000);
          LayananRepository.insertMaster({
            id: targetId,
            nama: dataObj.nama,
            deskripsi: dataObj.nama + " - Pelayanan administrasi online.",
            judulSectionIsian: dataObj.judulSectionIsian,
            deskripsiSectionIsian: dataObj.deskripsiSectionIsian,
            logikaKondisional: dataObj.logikaKondisional
          });
        } else {
          if (!targetId) {
            var oldLay = LayananRepository.findMasterByName(dataObj.namaOld);
            if (!oldLay) throw new Error("Master layanan lama tidak ditemukan.");
            targetId = oldLay.id;
          }
          
          LayananRepository.updateMaster(targetId, {
            nama: dataObj.nama,
            judulSectionIsian: dataObj.judulSectionIsian,
            deskripsiSectionIsian: dataObj.deskripsiSectionIsian,
            logikaKondisional: dataObj.logikaKondisional
          });
          
          LayananRepository.deleteFieldsByLayananId(targetId);
          LayananRepository.deleteReqsByLayananId(targetId);
        }
        
        // Memasukkan dokumen berkas yang dipilih/wajib dilampirkan
        if (dataObj.syarat) {
          var reqsList = dataObj.syarat.split(";;;");
          reqsList.forEach(function(reqName, i) {
            if (reqName.trim() !== "") {
              LayananRepository.insertRequirement({
                id: "REQ-" + Utilities.formatDate(new Date(), ZettConfig.TIMEZONE, "yyyyMMddHHmmss") + i,
                idLayanan: targetId,
                name: reqName.trim()
              });
            }
          });
        }
        
        // Memasukkan pertanyaan form dinamis
        if (dataObj.pertanyaan) {
          var fieldsList = dataObj.pertanyaan.split(";;;");
          fieldsList.forEach(function(rawField, j) {
            var cleanField = rawField.trim();
            if (cleanField !== "") {
              try {
                // Format Baru v4.8.3 (JSON Parsing untuk mendukung Repeater, Limit & Opsional)
                var qObj = JSON.parse(cleanField);
                LayananRepository.insertField({
                  id: "FLD-" + targetId + j,
                  idLayanan: targetId,
                  name: qObj.name,
                  type: qObj.type,
                  options: qObj.options || "",
                  required: qObj.required || "ya",
                  label: qObj.label || qObj.name
                });
              } catch (e) {
                // Fallback Format Lama
                var isDropdown = cleanField.indexOf('[') !== -1 && cleanField.indexOf(']') !== -1;
                if (isDropdown) {
                  var fName = cleanField.substring(0, cleanField.indexOf('[')).trim();
                  var fOpts = cleanField.substring(cleanField.indexOf('[') + 1, cleanField.indexOf(']')).trim();
                  LayananRepository.insertField({
                    id: "FLD-" + targetId + j,
                    idLayanan: targetId,
                    name: fName,
                    type: "dropdown",
                    options: fOpts,
                    required: "ya",
                    label: fName
                  });
                } else {
                  LayananRepository.insertField({
                    id: "FLD-" + targetId + j,
                    idLayanan: targetId,
                    name: cleanField,
                    type: "text",
                    options: "",
                    required: "ya",
                    label: cleanField
                  });
                }
              }
            }
          });
        }
        
      } else if (action === "delete") {
        var master = LayananRepository.findMasterByName(dataObj.nama);
        if (master) {
          LayananRepository.deleteMasterById(master.id);
          LayananRepository.deleteFieldsByLayananId(master.id);
          LayananRepository.deleteReqsByLayananId(master.id);
        }
      }
      
      SpreadsheetApp.flush();
      return { success: true };
    } catch (e) {
      return { success: false, message: e.toString() };
    } finally {
      lock.releaseLock();
    }
  }
};


/**
 * DynamicLayananService - Pengelolaan Jenis Pelayanan & Jenis Persyaratan
 */
var DynamicLayananService = {
  getJenisPelayanan: function() {
    try {
      var sheet = BaseRepository.getSheet(ZettConstants.SHEET_JENIS_PELAYANAN);
      var data = sheet.getDataRange().getDisplayValues();
      var list = [];
      for (var i = 1; i < data.length; i++) {
        list.push({ id: data[i][0], nama: data[i][1] });
      }
      return list;
    } catch(e) {
      Logger.log("getJenisPelayanan Error: " + e.toString());
      return [];
    }
  },
  
  crudJenisPelayanan: function(action, id, nama) {
    var lock = LockService.getScriptLock();
    try {
      lock.waitLock(15000);
      var sheet = BaseRepository.getSheet("Jenis_Pelayanan");
      var data = sheet.getDataRange().getValues();
      nama = Sanitizer.clean(nama);
      
      if (action === "create") {
        var newId = "JP-" + Utilities.formatDate(new Date(), ZettConfig.TIMEZONE, "yyyyMMddHHmmss") + Math.floor(Math.random() * 1000);
        sheet.appendRow([newId, nama]);
      } else if (action === "update") {
        for (var i = 1; i < data.length; i++) {
          if (String(data[i][0]) === String(id)) {
            sheet.getRange(i + 1, 2).setValue(nama);
            break;
          }
        }
      } else if (action === "delete") {
        for (var i = 1; i < data.length; i++) {
          if (String(data[i][0]) === String(id)) {
            sheet.deleteRow(i + 1);
            break;
          }
        }
      }
      SpreadsheetApp.flush();
      return { success: true };
    } catch(e) {
      return { success: false, message: e.toString() };
    } finally {
      lock.releaseLock();
    }
  },

  getJenisPersyaratan: function() {
    try {
      var sheet = BaseRepository.getSheet(ZettConstants.SHEET_JENIS_PERSYARATAN);
      var data = sheet.getDataRange().getDisplayValues();
      var list = [];
      for (var i = 1; i < data.length; i++) {
        list.push({ id: data[i][0], nama: data[i][1] });
      }
      return list;
    } catch(e) {
      Logger.log("getJenisPersyaratan Error: " + e.toString());
      return [];
    }
  },
  
  crudJenisPersyaratan: function(action, id, nama) {
    var lock = LockService.getScriptLock();
    try {
      lock.waitLock(15000);
      var sheet = BaseRepository.getSheet(ZettConstants.SHEET_JENIS_PERSYARATAN);
      var data = sheet.getDataRange().getValues();
      nama = Sanitizer.clean(nama);
      
      if (action === "create") {
        var newId = "JR-" + Utilities.formatDate(new Date(), ZettConfig.TIMEZONE, "yyyyMMddHHmmss") + Math.floor(Math.random() * 1000);
        sheet.appendRow([newId, nama]);
      } else if (action === "update") {
        for (var i = 1; i < data.length; i++) {
          if (String(data[i][0]) === String(id)) {
            sheet.getRange(i + 1, 2).setValue(nama);
            break;
          }
        }
      } else if (action === "delete") {
        for (var i = 1; i < data.length; i++) {
          if (String(data[i][0]) === String(id)) {
            sheet.deleteRow(i + 1);
            break;
          }
        }
      }
      SpreadsheetApp.flush();
      return { success: true };
    } catch(e) {
      return { success: false, message: e.toString() };
    } finally {
      lock.releaseLock();
    }
  }
};


/**
 * PengajuanService - Manajemen Pendaftaran, Pencatatan & Evaluasi Berkas Warga
 */
var PengajuanService = {
  getStats: function() {
    try {
      this.autoTransitionPending();
      var rawData = PengajuanRepository.getAll();
      
      var stats = {
        total: rawData.length,
        pending: 0,
        verifikasi: 0,
        selesai: 0,
        uploadUlang: 0,
        recent: []
      };
      
      rawData.forEach(function(row) {
        var stat = row.status;
        if (stat === ZettConstants.STATUS_PENDING) stats.pending++;
        else if (stat === ZettConstants.STATUS_VERIFIKASI) stats.verifikasi++;
        else if (stat === ZettConstants.STATUS_SELESAI || stat === "Selesai") stats.selesai++;
        else if (stat === ZettConstants.STATUS_REUPLOAD) stats.uploadUlang++;
      });
      
      var limit = Math.min(5, rawData.length);
      for (var i = 0; i < limit; i++) {
        stats.recent.push(rawData[rawData.length - 1 - i]);
      }
      
      return stats;
    } catch (e) {
      return { total: 0, pending: 0, verifikasi: 0, selesai: 0, uploadUlang: 0, recent: [], error: e.toString() };
    }
  },
  
  autoTransitionPending: function() {
    try {
      var sheet = BaseRepository.getSheet(ZettConstants.SHEET_PENGAJUAN);
      var lastRow = sheet.getLastRow();
      if (lastRow < 2) return false;
      
      var range = sheet.getRange(2, 9, lastRow - 1, 1);
      var values = range.getValues();
      var updated = false;
      
      for (var i = 0; i < values.length; i++) {
        if (values[i][0] === ZettConstants.STATUS_PENDING) {
          values[i][0] = ZettConstants.STATUS_VERIFIKASI;
          updated = true;
        }
      }
      
      if (updated) {
        range.setValues(values);
        SpreadsheetApp.flush();
      }
      return updated;
    } catch (e) {
      Logger.log("AutoTransition Error: " + e.toString());
      return false;
    }
  },
  
  create: function(wargaData) {
    var lock = LockService.getScriptLock();
    try {
      lock.waitLock(15000);
      
      if (String(wargaData.nik).length !== 16) {
        throw new Error("Peringatan Keamanan: NIK wajib berukuran tepat 16 digit!");
      }
      
      wargaData.nik = Sanitizer.clean(wargaData.nik);
      wargaData.nama = Sanitizer.clean(wargaData.nama);
      wargaData.alamat = Sanitizer.clean(wargaData.alamat);
      wargaData.wa = Sanitizer.clean(wargaData.wa);
      
      var newId = IDGenerator.serial();
      var timestamp = Utilities.formatDate(new Date(), ZettConfig.TIMEZONE, "dd/MM/yyyy HH:mm:ss");
      
      var folderWarga = DriveHelper.getOrCreateTargetFolder(newId, wargaData.nama);
      var linksList = [];
      
      wargaData.berkasFoto.forEach(function(itemFile) {
        if (itemFile.base64 && itemFile.base64 !== "") {
          var cleanBase = itemFile.base64.split(",")[1];
          var blob = Utilities.newBlob(Utilities.base64Decode(cleanBase), "image/jpeg", itemFile.namaSyarat + ".jpg");
          var fileObj = folderWarga.createFile(blob);
          try {
            fileObj.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.VIEW);
          } catch(e) {
            // Ignore if Workspace policy prevents public sharing
          }
          linksList.push(itemFile.namaSyarat + ": " + fileObj.getUrl());
        }
      });
      
      var listDetail = [];
      if (wargaData.detailLayanan && typeof wargaData.detailLayanan === 'object') {
        Object.keys(wargaData.detailLayanan).forEach(function(key) {
          listDetail.push(key + ": " + Sanitizer.clean(wargaData.detailLayanan[key]));
        });
      }
      
      var pengajuanRecord = {
        id: newId,
        tanggal: timestamp,
        nik: "'" + wargaData.nik,
        nama: wargaData.nama,
        layanan: wargaData.layanan,
        wa: "'" + wargaData.wa,
        alamat: wargaData.alamat,
        linkDokumen: linksList.join(", \n"),
        status: ZettConstants.STATUS_PENDING,
        catatan: "Menunggu verifikasi berkas digital oleh admin.",
        detailLayanan: listDetail.join(" | ")
      };
      
      PengajuanRepository.insert(pengajuanRecord);
      SpreadsheetApp.flush();
      
      // --- NOTIFIKASI OTOMATIS VIA WA (FONNTE) ---
      try {
        var setelan = ConfigService.getSetelan();
        var adminWa = setelan.kontak_wa || "08123456789";
        var namaDesa = setelan.nama_desa || "Narmada";
        
        var pesanWarga = "Halo *" + wargaData.nama + "*,\n\nPengajuan *" + wargaData.layanan + "* Anda telah berhasil kami terima dengan Nomor Registrasi: *" + newId + "*.\n\nMohon tunggu informasi selanjutnya dari Admin Desa " + namaDesa + ".\nTerima kasih.";
        var pesanAdmin = "🔔 *ADA PENGAJUAN BARU MASUK!*\n\nNama: *" + wargaData.nama + "*\nLayanan: *" + wargaData.layanan + "*\nNo Registrasi: *" + newId + "*\n\nSegera cek Dashboard Admin untuk memverifikasi berkas.";
        
        // Kirim ke Warga (Background)
        WhatsAppHelper.sendMessage(wargaData.wa, pesanWarga);
        // Kirim ke Admin (Background)
        WhatsAppHelper.sendMessage(adminWa, pesanAdmin);
      } catch (waError) {
        Logger.log("WA Auto-Send Error: " + waError.toString());
      }
      // ------------------------------------------
      
      return { success: true, id: newId, message: "Pengajuan berhasil dikirim dengan ID Registrasi: " + newId };
    } catch (e) {
      return { success: false, message: e.toString() };
    } finally {
      lock.releaseLock();
    }
  },
  
  reupload: function(idPengajuan, namaSyarat, base64Data) {
    var lock = LockService.getScriptLock();
    try {
      lock.waitLock(15000);
      
      var record = PengajuanRepository.getById(idPengajuan);
      if (!record) throw new Error("ID Registrasi pengajuan tidak ditemukan.");
      
      var folderWarga = DriveHelper.getOrCreateTargetFolder(idPengajuan, record.nama);
      
      var cleanBase = base64Data.split(",")[1];
      var blob = Utilities.newBlob(Utilities.base64Decode(cleanBase), "image/jpeg", namaSyarat + "_Reupload.jpg");
      var fileObj = folderWarga.createFile(blob);
      try {
        fileObj.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.VIEW);
      } catch(e) {}
      var newUrl = fileObj.getUrl();
      
      var links = record.linkDokumen.split(", \n");
      var isUpdated = false;
      for (var i = 0; i < links.length; i++) {
        if (links[i].indexOf(namaSyarat + ":") === 0) {
          links[i] = namaSyarat + ": " + newUrl;
          isUpdated = true;
          break;
        }
      }
      if (!isUpdated) {
        links.push(namaSyarat + ": " + newUrl);
      }
      
      PengajuanRepository.update(idPengajuan, {
        linkDokumen: links.join(", \n"),
        status: ZettConstants.STATUS_PENDING,
        catatan: "Berkas '" + namaSyarat + "' telah diunggah ulang. Silakan periksa kembali."
      });
      
      SpreadsheetApp.flush();
      return { success: true, message: "Berkas '" + namaSyarat + "' berhasil diunggah ulang." };
    } catch (e) {
      return { success: false, message: e.toString() };
    } finally {
      lock.releaseLock();
    }
  },
  
  getStatus: function(searchKey) {
    try {
      return PengajuanRepository.search(searchKey);
    } catch (e) {
      return [];
    }
  },
  
  getDashboardData: function(filterKeyword, page, statusFilter) {
    try {
      this.autoTransitionPending();
      return PengajuanRepository.getPaginated(filterKeyword, page, statusFilter);
    } catch (e) {
      return { data: [], totalPages: 1, currentPage: 1, totalItems: 0, error: e.toString() };
    }
  },
  
  updateStatus: function(id, nextStatus, notes) {
    var lock = LockService.getScriptLock();
    try {
      lock.waitLock(15000);
      PengajuanRepository.update(id, {
        status: nextStatus,
        catatan: Sanitizer.clean(notes)
      });
      SpreadsheetApp.flush();
      return { success: true, message: "Status registrasi " + id + " sukses diperbarui!" };
    } catch (e) {
      return { success: false, message: e.toString() };
    } finally {
      lock.releaseLock();
    }
  }
};