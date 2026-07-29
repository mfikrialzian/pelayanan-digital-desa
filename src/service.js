/**
 * AuthService - Manajemen Hak Akses Admin
 */
var AuthService = {
  login: function(username, password) {
    try {
      var user = PenggunaRepository.getByUsername(username);
      
      if (user && (user.password === Sanitizer.hashPassword(password) || user.password === password)) {
        if (user.status !== "Aktif") {
          return { success: false, message: "Akun Anda dinonaktifkan. Silakan hubungi Super Admin." };
        }
        
        var token = Utilities.getUuid() + "-" + new Date().getTime();
        var cache = CacheService.getScriptCache();
        var sessionData = JSON.stringify({ role: user.peran || "valid", username: username });
        cache.put("AUTH_" + token, sessionData, 21600); // 6 hours
        
        // Update waktu login
        var tz = ZettConfig.TIMEZONE || "Asia/Makassar";
        var now = Utilities.formatDate(new Date(), tz, "dd MMM yyyy, HH:mm");
        PenggunaRepository.update(username, { terakhirLogin: now });
        SpreadsheetApp.flush();
        
        return { 
          success: true, 
          token: token, 
          role: user.peran, 
          name: user.nama,
          email: user.email,
          wa: user.wa,
          avatar: user.avatar
        };
      }
      return { success: false, message: "Username atau password salah!" };
    } catch (e) {
      return { success: false, message: "Auth Error: " + e.toString() };
    }
  },

  verifyToken: function(token) {
    if (!token) return false;
    var cache = CacheService.getScriptCache();
    var sessionData = cache.get("AUTH_" + token);
    return sessionData != null;
  },

  getUserDataFromToken: function(token) {
    if (!token) return null;
    var cache = CacheService.getScriptCache();
    var data = cache.get("AUTH_" + token);
    try {
      return data ? JSON.parse(data) : null;
    } catch (e) {
      // Legacy support if it was just a string
      return { role: data, username: null };
    }
  },

  getRoleFromToken: function(token) {
    var data = this.getUserDataFromToken(token);
    return data ? data.role : null;
  },

  verifyPassword: function(username, password) {
    var user = PenggunaRepository.getByUsername(username);
    if (!user) return { success: false, message: "Pengguna tidak ditemukan." };
    if (user.password === Sanitizer.hashPassword(password) || user.password === password) {
      return { success: true };
    }
    return { success: false, message: "Kata sandi salah!" };
  },

  logout: function(token) {
    if (token) {
      var cache = CacheService.getScriptCache();
      cache.remove("AUTH_" + token);
    }
    return { success: true };
  }
};

/**
 * PenggunaService - Manajemen Pengguna Sistem
 */
var PenggunaService = {
  getList: function() {
    var users = PenggunaRepository.getAll();
    return users.map(function(u) {
      delete u.password;
      return u;
    });
  },
  
  crud: function(action, payload) {
    var lock = LockService.getScriptLock();
    try {
      lock.waitLock(15000);
      
      if (action === "create") {
        var existing = PenggunaRepository.getByUsername(payload.username);
        if (existing) {
          return { success: false, message: "Username sudah digunakan!" };
        }
        
        // Buat format ID Profesional (Misal: ADM-8F2A9C)
        var prefix = payload.peran === "Super Admin" ? "SADM" : "ADM";
        var rawHash = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, new Date().getTime().toString() + payload.username);
        var hex = rawHash.map(function(b) { return ('0' + (b & 0xFF).toString(16)).slice(-2); }).join('').toUpperCase().substring(0, 6);
        var newId = prefix + "-" + hex;

        PenggunaRepository.insert({
          id: newId,
          username: payload.username,
          password: Sanitizer.hashPassword(payload.password),
          nama: payload.nama,
          peran: payload.peran,
          unit: payload.unit || "Pusat",
          status: payload.status || "Aktif",
          terakhirLogin: "-"
        });
      } else if (action === "update") {
        PenggunaRepository.update(payload.username, payload.updateData);
      } else if (action === "delete") {
        PenggunaRepository.deleteByUsername(payload.username);
      } else if (action === "toggleStatus") {
        PenggunaRepository.update(payload.username, { status: payload.status });
      } else if (action === "resetPassword") {
        PenggunaRepository.update(payload.username, { password: Sanitizer.hashPassword(payload.password) });
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
 * ConfigService - Pengaturan Konfigurasi (CMS) Beranda Desa
 */
var ConfigService = {
  getSetelan: function() {
    var setelan = SetelanRepository.getAll();
    delete setelan.ADMIN_USERNAME;
    delete setelan.ADMIN_PASSWORD;
    delete setelan.FONNTE_TOKEN;
    return setelan;
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
    var cache = CacheService.getScriptCache();
    var cached = cache.get("LAYANAN_LIST_CACHE");
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {}
    }
    
    try {
      var master = LayananRepository.getAllMaster();
      var fields = LayananRepository.getAllFields();
      var reqs = LayananRepository.getAllReqs();
      
      var list = master.map(function(lay) {
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
      
      cache.put("LAYANAN_LIST_CACHE", JSON.stringify(list), 7200); // Cache 2 hours
      return list;
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
      
      var cache = CacheService.getScriptCache();
      cache.remove("LAYANAN_LIST_CACHE");
      
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
 * PengajuanService - Manajemen Pendaftaran, Pencatatan & Evaluasi Berkas Warga
 */
var PengajuanService = {
  getStats: function() {
    try {
      var rawData = PengajuanRepository.getStatsRaw();
      
      var stats = {
        total: rawData.length,
        pending: 0,
        verifikasi: 0,
        selesai: 0,
        uploadUlang: 0,
        recent: [],
        chartMingguan: [0, 0, 0, 0, 0, 0, 0],
        chartStatus: [0, 0, 0, 0],
        chartLayanan: { labels: [], data: [] }
      };

      var layananCounts = {};
      var now = new Date();
      
      rawData.forEach(function(item) {
        var stat = item.status;
        var tanggal = item.tanggal;
        var layanan = item.layanan;

        if (stat === ZettConstants.STATUS_PENDING) { stats.pending++; stats.chartStatus[2]++; }
        else if (stat === ZettConstants.STATUS_VERIFIKASI) { stats.verifikasi++; stats.chartStatus[1]++; }
        else if (stat === ZettConstants.STATUS_SELESAI || stat === "Selesai" || stat === "Pelayanan Selesai") { stats.selesai++; stats.chartStatus[0]++; }
        else if (stat === ZettConstants.STATUS_REUPLOAD || stat === ZettConstants.STATUS_DITOLAK) { stats.uploadUlang++; stats.chartStatus[3]++; }
        else { stats.chartStatus[3]++; }

        if (layanan) {
            layananCounts[layanan] = (layananCounts[layanan] || 0) + 1;
        }

        if (tanggal) {
            // Handle DD/MM/YYYY format if it's a string, or process if it's already a Date
            var tDate = typeof tanggal === 'string' && tanggal.indexOf('/') !== -1 ? 
                new Date(tanggal.split('/')[2], parseInt(tanggal.split('/')[1]) - 1, tanggal.split('/')[0]) : 
                new Date(tanggal);
            
            if (!isNaN(tDate.getTime())) {
                var diffTime = now.getTime() - tDate.getTime();
                var diffDays = diffTime / (1000 * 60 * 60 * 24); 
                if (diffDays >= 0 && diffDays <= 7) {
                    var day = tDate.getDay(); 
                    var mappedDay = day === 0 ? 6 : day - 1;
                    stats.chartMingguan[mappedDay]++;
                }
            }
        }
      });
      
      var sortableLayanan = [];
      for (var l in layananCounts) {
          sortableLayanan.push([l, layananCounts[l]]);
      }
      sortableLayanan.sort(function(a, b) { return b[1] - a[1]; });
      
      var topLayanan = sortableLayanan.slice(0, 5);
      topLayanan.forEach(function(item) {
          stats.chartLayanan.labels.push(item[0]);
          stats.chartLayanan.data.push(item[1]);
      });
      
      stats.recent = PengajuanRepository.getRecent(5);
      
      return stats;
    } catch (e) {
      return { total: 0, pending: 0, verifikasi: 0, selesai: 0, uploadUlang: 0, recent: [], error: e.toString() };
    }
  },
  
  create: function(wargaData) {
    var lock = LockService.getScriptLock();
    try {
      lock.waitLock(15000);
      
      var cache = CacheService.getScriptCache();
      var cacheKey = "RATE_LIMIT_" + (wargaData.nik || "UNKNOWN");
      var currentUsage = parseInt(cache.get(cacheKey)) || 0;
      if (currentUsage > 3) {
        throw new Error("Terlalu banyak permintaan (Rate Limit Exceeded). Silakan coba lagi nanti.");
      }
      cache.put(cacheKey, (currentUsage + 1).toString(), 300); // Batasi maks 3 pengajuan per 5 menit
      
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
      
      // --- LOG AKTIVITAS & NOTIFIKASI ---
      ActivityService.logActivity("NEW_REQUEST", "Pengajuan baru masuk dari " + wargaData.nama + " (" + newId + ")", "Warga");
      NotificationService.addNotification("NEW_REQUEST", "Pengajuan Baru Masuk", "Ada pengajuan dari " + wargaData.nama + " (" + wargaData.layanan + ").", newId);

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
  
  reupload: function(idPengajuan, namaSyarat, base64Data, nik) {
    var lock = LockService.getScriptLock();
    try {
      lock.waitLock(15000);
      
      var record = PengajuanRepository.getById(idPengajuan);
      if (!record) throw new Error("ID Registrasi pengajuan tidak ditemukan.");
      
      if (nik && record.nik !== nik) throw new Error("Akses ditolak: NIK tidak sesuai dengan data pengajuan.");
      
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
      var cache = CacheService.getScriptCache();
      var cacheKey = "RATE_LIMIT_SEARCH_" + searchKey;
      var currentUsage = parseInt(cache.get(cacheKey)) || 0;
      if (currentUsage > 15) {
        return [{ id: "-", nik: "-", nama: "RATE LIMIT EXCEEDED", layanan: "Terlalu banyak request. Tunggu 1 jam.", status: "Ditolak", catatan: "-", tanggal: "-" }];
      }
      cache.put(cacheKey, (currentUsage + 1).toString(), 3600); // 1 jam batas

      return PengajuanRepository.search(searchKey);
    } catch (e) {
      return [];
    }
  },
  
  getDashboardData: function(filterKeyword, page, statusFilter) {
    try {
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
      
      ActivityService.logActivity("UPDATE_STATUS", "Status pengajuan " + id + " diubah menjadi: " + nextStatus, "Admin");
      
      SpreadsheetApp.flush();
      return { success: true, message: "Status registrasi " + id + " sukses diperbarui!" };
    } catch (e) {
      return { success: false, message: e.toString() };
    } finally {
      lock.releaseLock();
    }
  }
};

/**
 * PDFGeneratorService - Membuat Dokumen Surat secara Dinamis
 */
var PDFGeneratorService = {
  generateSurat: function(idPengajuan) {
    var lock = LockService.getScriptLock();
    try {
      lock.waitLock(30000); 
      
      // 1. Ambil Data Pengajuan
      var allPengajuan = PengajuanRepository.search(idPengajuan);
      if (!allPengajuan || allPengajuan.length === 0) {
        return { success: false, message: "Pengajuan tidak ditemukan." };
      }
      var pengajuan = allPengajuan[0];
      
      // 2. Ambil Data Layanan
      var layanan = LayananRepository.findMasterByName(pengajuan.layanan);
      if (!layanan || !layanan.templateDocId) {
        return { success: false, message: "Layanan ini belum memiliki ID Template Google Docs." };
      }
      
      // 3. Tentukan Folder Output
      var folderName = "Surat_Cetak";
      var parentFolderIterator = DriveApp.getFoldersByName(ZettConfig.DRIVE_ROOT_FOLDER);
      var rootFolder = parentFolderIterator.hasNext() ? parentFolderIterator.next() : DriveApp.getRootFolder().createFolder(ZettConfig.DRIVE_ROOT_FOLDER);
      
      var outputFolderIterator = rootFolder.getFoldersByName(folderName);
      var outputFolder = outputFolderIterator.hasNext() ? outputFolderIterator.next() : rootFolder.createFolder(folderName);
      
      // 4. Salin Template
      var templateFile = DriveApp.getFileById(layanan.templateDocId.trim());
      var newFileName = "Surat_" + pengajuan.layanan + "_" + pengajuan.nama + "_" + pengajuan.id;
      var tempFile = templateFile.makeCopy(newFileName, outputFolder);
      
      // 5. Manipulasi Teks di Dokumen Sementara
      var tempDoc = DocumentApp.openById(tempFile.getId());
      var body = tempDoc.getBody();
      
      body.replaceText("{NAMA}", pengajuan.nama || "");
      body.replaceText("{NIK}", pengajuan.nik || "");
      body.replaceText("{LAYANAN}", pengajuan.layanan || "");
      body.replaceText("{ALAMAT}", pengajuan.alamat || "");
      body.replaceText("{TANGGAL_PENGAJUAN}", pengajuan.tanggal || "");
      body.replaceText("{NOMOR_WA}", pengajuan.wa || "");
      
      tempDoc.saveAndClose();
      
      // 6. Konversi ke PDF
      var pdfBlob = tempFile.getAs('application/pdf');
      var finalPdfFile = outputFolder.createFile(pdfBlob);
      finalPdfFile.setName(newFileName + ".pdf");
      
      // Hapus file sementara
      tempFile.setTrashed(true);
      
      // Ubah Hak Akses agar link bisa dibuka
      finalPdfFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      
      return { 
        success: true, 
        message: "Surat PDF berhasil dibuat.", 
        url: finalPdfFile.getUrl() 
      };
      
    } catch (e) {
      return { success: false, message: "Gagal membuat PDF: " + e.toString() };
    } finally {
      lock.releaseLock();
    }
  }
};

/**
 * ActivityService - Layanan pencatatan dan pengambilan aktivitas
 */
var ActivityService = {
  logActivity: function(tipe, pesan, pelaku) {
    try {
      var record = {
        id: "ACT-" + Utilities.formatDate(new Date(), ZettConfig.TIMEZONE, "yyyyMMddHHmmss") + "-" + Math.floor(Math.random() * 1000),
        waktu: Utilities.formatDate(new Date(), ZettConfig.TIMEZONE, "dd/MM/yyyy HH:mm:ss"),
        tipe: tipe || "INFO",
        pesan: pesan || "Sistem diperbarui.",
        pelaku: pelaku || "System"
      };
      ActivityRepository.insert(record);
      return { success: true };
    } catch(e) {
      Logger.log("ActivityService Error: " + e.toString());
      return { success: false, message: e.toString() };
    }
  },
  
  getRecent: function(limit) {
    try {
      return ActivityRepository.getAll(limit || 50);
    } catch(e) {
      Logger.log("ActivityService.getRecent Error: " + e.toString());
      return [];
    }
  }
};

/**
 * NotificationService - Layanan notifikasi
 */
var NotificationService = {
  addNotification: function(tipe, judul, pesan, idReferensi) {
    try {
      var record = {
        id: "NOTIF-" + Utilities.formatDate(new Date(), ZettConfig.TIMEZONE, "yyyyMMddHHmmss") + "-" + Math.floor(Math.random() * 1000),
        waktu: Utilities.formatDate(new Date(), ZettConfig.TIMEZONE, "dd/MM/yyyy HH:mm:ss"),
        tipe: tipe || "INFO",
        judul: judul || "Pemberitahuan",
        pesan: pesan || "",
        idReferensi: idReferensi || ""
      };
      NotificationRepository.insert(record);
      return { success: true };
    } catch(e) {
      Logger.log("NotificationService Error: " + e.toString());
      return { success: false, message: e.toString() };
    }
  },
  
  getRecent: function(limit) {
    try {
      return NotificationRepository.getAll(limit || 20);
    } catch(e) {
      Logger.log("NotificationService.getRecent Error: " + e.toString());
      return [];
    }
  }
};

