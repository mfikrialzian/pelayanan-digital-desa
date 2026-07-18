/**
 * ZettBOT Architect v3.0.0 - Controller & Routing Layer
 * Berperan sebagai Web Server dan API Gateway untuk menangani transaksi frontend-backend.
 */
function doGet(e) {
  try {
    var page = "warga";
    if (e && e.parameter && e.parameter.page) {
      page = String(e.parameter.page).trim().toLowerCase();
    }
    
    var template = HtmlService.createTemplateFromFile('index');
    template.pageParam = page;
    
    return template.evaluate()
      .setTitle(ZettConfig.APP_NAME)
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
  } catch (err) {
    return HtmlService.createHtmlOutput("<h2>Terjadi Kesalahan Server: " + Sanitizer.escapeHtml(err.toString()) + "</h2>");
  }
}

/**
 * Fungsi pembantu untuk include file HTML terpisah (seperti CSS/JS) ke dalam index.html
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
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

function processReuploadBerkas(idPengajuan, namaSyarat, base64Data) {
  return PengajuanService.reupload(idPengajuan, namaSyarat, base64Data);
}

function getPengajuanStatus(searchKey) {
  return PengajuanService.getStatus(searchKey);
}

function checkAdminLogin(username, password) {
  return AuthService.login(username, password);
}

function getAdminDashboardData(filterKeyword, page, statusFilter) {
  return PengajuanService.getDashboardData(filterKeyword, page, statusFilter);
}

function updatePengajuanStatus(id, nextStatus, notes) {
  return PengajuanService.updateStatus(id, nextStatus, notes);
}

function crudLayanan(action, dataObj) {
  return LayananService.crud(action, dataObj);
}

function updateAdminSetelan(newSetelan) {
  return ConfigService.update(newSetelan);
}

function getJenisPelayanan() {
  return DynamicLayananService.getJenisPelayanan();
}

function crudJenisPelayanan(action, id, nama) {
  return DynamicLayananService.crudJenisPelayanan(action, id, nama);
}

function getJenisPersyaratan() {
  return DynamicLayananService.getJenisPersyaratan();
}

function crudJenisPersyaratan(action, id, nama) {
  return DynamicLayananService.crudJenisPersyaratan(action, id, nama);
}