/**
 * ZettBOT Architect v3.0.0 - Controller & Routing Layer
 * Berperan sebagai Web Server dan API Gateway untuk menangani transaksi frontend-backend.
 */
function doGet(e) {
  // Hanya menampilkan pesan teks sederhana bahwa API aktif
  var response = {
    status: "active",
    message: "Backend API Pelayanan Digital Desa berjalan normal.",
    frontend: "Gunakan web Vercel untuk mengakses UI."
  };
  
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * API Gateway: Delegator aman yang melayani pemanggilan fungsi frontend (google.script.run)
 */
function getAdminSetelan() {
  return ConfigService.getSetelan();
}

function getLayananList() {
  return LayananService.getList();
}

function getDashboardStats() {
  return PengajuanService.getStats();
}

function submitPengajuanDesa(wargaData) {
  return PengajuanService.create(wargaData);
}

function processReuploadBerkas(idPengajuan, namaSyarat, base64Data, nik) {
  return PengajuanService.reupload(idPengajuan, namaSyarat, base64Data, nik);
}

function getPengajuanStatus(searchKey) {
  return PengajuanService.getStatus(searchKey);
}

function checkAdminLogin(username, password, deviceInfo) {
  return AuthService.login(username, password, deviceInfo);
}

function logoutAdmin(token) {
  return AuthService.logout(token);
}

function getActiveSessions(token) {
  return AuthService.getActiveSessions(token);
}

function revokeSession(token, sessionId) {
  return AuthService.revokeSession(token, sessionId);
}

function getLogKeamanan(token) {
  if (!AuthService.verifyToken(token)) return { success: false, message: "Sesi tidak valid.", authError: true };
  try {
    var logs = LogKeamananRepository.getAll(50); // Get latest 50 logs
    return { success: true, data: logs };
  } catch(e) {
    return { success: false, message: e.toString() };
  }
}

function getAdminDashboardData(token, filterKeyword, page, statusFilter) {
  if (!AuthService.verifyToken(token)) return { data: [], totalPages: 1, currentPage: 1, totalItems: 0, error: "Sesi tidak valid atau telah berakhir. Silakan login kembali.", authError: true };
  return PengajuanService.getDashboardData(filterKeyword, page, statusFilter);
}

function updatePengajuanStatus(token, id, nextStatus, notes) {
  if (!AuthService.verifyToken(token)) return { success: false, message: "Sesi tidak valid atau telah berakhir. Silakan login kembali.", authError: true };
  return PengajuanService.updateStatus(id, nextStatus, notes);
}

function crudLayanan(token, action, dataObj) {
  if (!AuthService.verifyToken(token)) return { success: false, message: "Sesi tidak valid atau telah berakhir. Silakan login kembali.", authError: true };
  return LayananService.crud(action, dataObj);
}

function getPenggunaList(token) {
  if (!AuthService.verifyToken(token)) return { error: "Sesi tidak valid atau telah berakhir. Silakan login kembali.", authError: true };
  return PenggunaService.getList();
}

function crudPengguna(token, action, payload) {
  if (!AuthService.verifyToken(token)) return { success: false, message: "Sesi tidak valid atau telah berakhir. Silakan login kembali.", authError: true };
  
  if (action === "create") {
    var role = AuthService.getRoleFromToken(token);
    if (role !== "Super Admin") {
      return { success: false, message: "Akses ditolak! Hanya Super Admin yang dapat menambahkan pengguna." };
    }
  }

  return PenggunaService.crud(action, payload);
}

function updateProfilPengguna(token, payload) {
  var userSession = AuthService.getUserDataFromToken(token);
  if (!userSession) return { success: false, message: "Sesi tidak valid atau telah berakhir. Silakan login kembali.", authError: true };
  
  if (userSession.role !== "Super Admin" && userSession.username !== payload.username) {
    return { success: false, message: "Akses ditolak! Anda hanya dapat mengubah profil Anda sendiri." };
  }

  return PenggunaService.crud("update", {
    username: payload.username,
    updateData: {
      nama: payload.nama,
      email: payload.email,
      wa: payload.wa,
      avatar: payload.avatar
    }
  });
}

function updatePasswordPengguna(token, payload) {
  var userSession = AuthService.getUserDataFromToken(token);
  if (!userSession) return { success: false, message: "Sesi tidak valid atau telah berakhir. Silakan login kembali.", authError: true };
  
  if (userSession.role !== "Super Admin" && userSession.username !== payload.username) {
    return { success: false, message: "Akses ditolak! Anda hanya dapat mengubah kata sandi Anda sendiri." };
  }

  return PenggunaService.crud("resetPassword", {
    username: payload.username,
    password: payload.password
  });
}

function verifyCurrentPassword(token, password) {
  var userSession = AuthService.getUserDataFromToken(token);
  if (!userSession) return { success: false, message: "Sesi tidak valid.", authError: true };
  
  return AuthService.verifyPassword(userSession.username, password);
}

function updateAdminSetelan(token, newSetelan) {
  if (!AuthService.verifyToken(token)) return { success: false, message: "Sesi tidak valid atau telah berakhir. Silakan login kembali.", authError: true };
  return ConfigService.update(newSetelan);
}


function generateSuratPDF(token, idPengajuan) {
  if (!AuthService.verifyToken(token)) return { success: false, message: "Sesi tidak valid atau telah berakhir. Silakan login kembali.", authError: true };
  return PDFGeneratorService.generateSurat(idPengajuan);
}

function requestContactOTP(token, target, type) {
  return OTPService.requestContactOTP(token, target, type);
}

function verifyContactOTP(token, target, type, otpInput) {
  return OTPService.verifyContactOTP(token, target, type, otpInput);
}

function requestResetOTP(identifier, method) {
  return OTPService.requestResetOTP(identifier, method);
}

function verifyResetOTP(identifier, otpInput) {
  return OTPService.verifyResetOTP(identifier, otpInput);
}

function resetPasswordWithOTP(identifier, newPassword) {
  return OTPService.resetPasswordWithOTP(identifier, newPassword);
}

/**
 * REST API Gateway untuk Frontend Vercel
 */
function doPost(e) {
  try {
    var postData = JSON.parse(e.postData.contents);
    var action = postData.action;
    var params = postData.params || [];
    
    // WHITELIST: Hanya fungsi ini yang boleh dipanggil dari luar (Frontend Vercel)
    var ALLOWED_ACTIONS = {
      'getAdminSetelan': getAdminSetelan,
      'getLayananList': getLayananList,
      'getDashboardStats': getDashboardStats,
      'submitPengajuanDesa': submitPengajuanDesa,
      'processReuploadBerkas': processReuploadBerkas,
      'getPengajuanStatus': getPengajuanStatus,
      'checkAdminLogin': checkAdminLogin,
      'logoutAdmin': logoutAdmin,
      'getActiveSessions': getActiveSessions,
      'revokeSession': revokeSession,
      'getLogKeamanan': getLogKeamanan,
      'getAdminDashboardData': getAdminDashboardData,
      'updatePengajuanStatus': updatePengajuanStatus,
      'crudLayanan': crudLayanan,
      'getPenggunaList': getPenggunaList,
      'crudPengguna': crudPengguna,
      'updateProfilPengguna': updateProfilPengguna,
      'updateAdminSetelan': updateAdminSetelan,
      'generateSuratPDF': generateSuratPDF,
      'getActivities': getActivities,
      'getNotifications': getNotifications,
      'verifyCurrentPassword': verifyCurrentPassword,
      'requestContactOTP': requestContactOTP,
      'verifyContactOTP': verifyContactOTP,
      'requestResetOTP': requestResetOTP,
      'verifyResetOTP': verifyResetOTP,
      'resetPasswordWithOTP': resetPasswordWithOTP
    };
    
    if (!ALLOWED_ACTIONS[action]) {
      throw new Error("Akses ditolak: fungsi '" + action + "' tidak diizinkan.");
    }
    
    var result = ALLOWED_ACTIONS[action].apply(null, params);
    
    var response = { success: true, data: result };
    return ContentService.createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    AppLogger.error("doPost", err.toString(), e.postData ? e.postData.contents : "");
    var errResponse = { 
      success: false, 
      message: "Terjadi kesalahan internal server.",
      error: err.toString(),
      code: 500
    };
    return ContentService.createTextOutput(JSON.stringify(errResponse))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getActivities(token, limit) {
  if (!AuthService.verifyToken(token)) return { success: false, message: "Sesi tidak valid.", authError: true };
  return ActivityService.getRecent(limit);
}

function getNotifications(token, limit) {
  if (!AuthService.verifyToken(token)) return { success: false, message: "Sesi tidak valid.", authError: true };
  return NotificationService.getRecent(limit);
}

