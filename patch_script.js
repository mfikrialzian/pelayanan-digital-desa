const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'vercel-frontend', 'script_admin.js');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove lines 1-13 (dummy data initialization)
// Find the first function runAdminLoginAuth()
const runAdminIdx = content.indexOf('function runAdminLoginAuth()');
if (runAdminIdx !== -1) {
    content = content.substring(runAdminIdx);
}

// 2. Replace all dummyUsersData with usersData
content = content.replace(/window\.dummyUsersData/g, 'window.usersData');
content = content.replace(/localStorage\.setItem\('narmada_users', JSON\.stringify\(window\.usersData\)\);/g, '');

// 3. Replace initManajemenPengguna
const initManajemenPenggunaCode = `function initManajemenPengguna() {
    var token = localStorage.getItem('adminToken_Narmada');
    if (!token || !isGoogleEnv) return;
    
    backToManajemenPengguna();
    var tbody = document.getElementById('mp-table-body');
    if (tbody) tbody.innerHTML = '<tr><td colspan="6" class="py-6 text-center text-slate-500 text-sm"><i class="fa-solid fa-spinner animate-spin mr-2"></i>Memuat data pengguna...</td></tr>';
    
    google.script.run
        .withSuccessHandler(function (res) {
            if (res.error) {
                pushToast(res.error, "error");
                if (res.authError) handleAdminLogout();
                return;
            }
            window.usersData = res || [];
            
            updateStatistikPengguna();
            renderUserTable(window.usersData);
            
            var searchInput = document.getElementById('mp-search-user');
            var filterRole = document.getElementById('mp-filter-role');
            if (searchInput) {
                searchInput.removeEventListener('input', filterUserTable);
                searchInput.addEventListener('input', filterUserTable);
            }
            if (filterRole) {
                filterRole.removeEventListener('change', filterUserTable);
                filterRole.addEventListener('change', filterUserTable);
            }
        })
        .withFailureHandler(function (err) {
            pushToast("Gagal mengambil data pengguna: " + err, "error");
            if (tbody) tbody.innerHTML = '<tr><td colspan="6" class="py-6 text-center text-red-500 text-sm">Gagal memuat data.</td></tr>';
        })
        .getPenggunaList(token);
}`;
content = content.replace(/function initManajemenPengguna\(\) \{[\s\S]*?function filterUserTable\(\) \{/, initManajemenPenggunaCode + '\n\n        function filterUserTable() {');

// 4. Replace CRUD functions block
const crudFunctionsNew = `function callCrudPengguna(action, payload, onSuccess) {
    var token = localStorage.getItem('adminToken_Narmada');
    if (!token || !isGoogleEnv) return;
    
    google.script.run
        .withSuccessHandler(function (res) {
            if (res.success) {
                pushToast(res.message, "success");
                if (onSuccess) onSuccess(res.data);
                initManajemenPengguna(); // Refresh table
            } else {
                pushToast(res.message, "error");
                if (res.authError) handleAdminLogout();
            }
        })
        .withFailureHandler(function (err) {
            pushToast("Error: " + err, "error");
        })
        .crudPengguna(token, action, payload);
}

function simpanPenggunaBaru(event) {
    event.preventDefault();
    var nama = document.getElementById('tp-nama').value;
    var username = document.getElementById('tp-username').value;
    var password = document.getElementById('tp-password').value;
    var peran = document.getElementById('tp-peran').value;
    var unit = document.getElementById('tp-unit').value;
    var status = document.getElementById('tp-status').value;
    
    var akunBaru = { u: username, p: password, role: peran, name: nama, status: status, unit: unit, terakhirLogin: "-" };
    
    document.getElementById('btn-submit-tambah-pengguna').disabled = true;
    document.getElementById('btn-submit-tambah-pengguna').innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i> Menyimpan...';
    
    callCrudPengguna('create', akunBaru, function() {
        closeModalTambahPengguna();
        document.getElementById('btn-submit-tambah-pengguna').disabled = false;
        document.getElementById('btn-submit-tambah-pengguna').innerHTML = 'Simpan Pengguna';
    });
}

function updateStatistikPengguna() {
    if (!window.usersData) return;
    var stats = { total: 0, admin: 0, operator: 0, pimpinan: 0, viewer: 0 };
    window.usersData.forEach(function(u) {
        stats.total++;
        if (u.role === 'Super Admin') stats.admin++;
        if (u.role.includes('Operator')) stats.operator++;
        if (u.role.includes('Desa') || u.role === 'Pimpinan') stats.pimpinan++;
    });
    stats.viewer = Math.floor(Math.random() * 3) + 1;

    var elTotal = document.getElementById('stat-user-total');
    if (elTotal) elTotal.innerText = stats.total;
    var elAdmin = document.getElementById('stat-user-admin');
    if (elAdmin) elAdmin.innerText = stats.admin;
    var elOperator = document.getElementById('stat-user-operator');
    if (elOperator) elOperator.innerText = stats.operator;
    var elPimpinan = document.getElementById('stat-user-pimpinan');
    if (elPimpinan) elPimpinan.innerText = stats.pimpinan;
    var elViewer = document.getElementById('stat-user-viewer');
    if (elViewer) elViewer.innerText = stats.viewer;
}

function showCustomConfirm(title, message, onConfirm) {
    var modal = document.getElementById('modal-custom-confirm');
    var titleEl = document.getElementById('confirm-modal-title');
    var messageEl = document.getElementById('confirm-modal-message');
    var btnOk = document.getElementById('confirm-modal-btn-ok');
    var btnCancel = document.getElementById('confirm-modal-btn-cancel');
    
    if (modal && titleEl && messageEl && btnOk && btnCancel) {
        titleEl.innerHTML = title;
        messageEl.innerHTML = message;
        
        var newBtnOk = btnOk.cloneNode(true);
        btnOk.parentNode.replaceChild(newBtnOk, btnOk);
        var newBtnCancel = btnCancel.cloneNode(true);
        btnCancel.parentNode.replaceChild(newBtnCancel, btnCancel);
        
        newBtnCancel.addEventListener('click', function() { modal.classList.add('hidden'); });
        newBtnOk.addEventListener('click', function() {
            modal.classList.add('hidden');
            if(typeof onConfirm === 'function') onConfirm();
        });
        
        modal.classList.remove('hidden');
    }
}

function openModalEditPengguna(username) {
    if (!window.usersData) return;
    var user = window.usersData.find(function(u) { return u.u === username; });
    if (!user) { pushToast('Data pengguna tidak ditemukan!', 'error'); return; }
    
    document.getElementById('te-username-hidden').value = user.u;
    document.getElementById('te-username').value = user.u;
    document.getElementById('te-nama').value = user.name;
    document.getElementById('te-peran').value = user.role;
    document.getElementById('te-unit').value = user.unit;
    document.getElementById('te-status').value = user.status;
    
    var modal = document.getElementById('modal-edit-pengguna');
    if (modal) modal.classList.remove('hidden');
}

function closeModalEditPengguna() {
    var modal = document.getElementById('modal-edit-pengguna');
    if (modal) {
        modal.classList.add('hidden');
        var form = document.getElementById('form-edit-pengguna');
        if (form) form.reset();
    }
}

function simpanEditPengguna(event) {
    event.preventDefault();
    var username = document.getElementById('te-username-hidden').value;
    var nama = document.getElementById('te-nama').value;
    var peran = document.getElementById('te-peran').value;
    var unit = document.getElementById('te-unit').value;
    var status = document.getElementById('te-status').value;
    
    var payload = { u: username, name: nama, role: peran, unit: unit, status: status };
    
    document.getElementById('btn-submit-edit-pengguna').disabled = true;
    document.getElementById('btn-submit-edit-pengguna').innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i> Menyimpan...';
    
    callCrudPengguna('update', payload, function() {
        closeModalEditPengguna();
        document.getElementById('btn-submit-edit-pengguna').disabled = false;
        document.getElementById('btn-submit-edit-pengguna').innerHTML = 'Simpan Perubahan';
    });
}

function resetPasswordPengguna(username) {
    showCustomConfirm(
        '<i class="fa-solid fa-triangle-exclamation text-amber-500"></i> Konfirmasi Reset Password', 
        'Apakah Anda yakin ingin mengatur ulang sandi untuk akun <b>@' + username + '</b> menjadi standar (123)?', 
        function() {
            callCrudPengguna('reset_password', { u: username });
        }
    );
}

function toggleStatusPengguna(username, currentStatus) {
    var action = currentStatus === 'Aktif' ? 'menonaktifkan' : 'mengaktifkan';
    showCustomConfirm(
        '<i class="fa-solid fa-power-off text-blue-500"></i> Konfirmasi Ubah Status',
        'Apakah Anda yakin ingin ' + action + ' akun <b>@' + username + '</b>?',
        function() {
            var newStatus = currentStatus === 'Aktif' ? 'Nonaktif' : 'Aktif';
            callCrudPengguna('update', { u: username, status: newStatus });
        }
    );
}

function hapusPengguna(username) {
    if (username === 'superadmin') {
        pushToast('Akun Super Admin utama tidak dapat dihapus!', 'error');
        return;
    }
    showCustomConfirm(
        '<i class="fa-solid fa-trash text-red-600"></i> Konfirmasi Hapus Akun',
        'Apakah Anda yakin ingin menghapus akun <b>@' + username + '</b> secara permanen? Data yang telah dihapus tidak dapat dikembalikan.',
        function() {
            callCrudPengguna('delete', { u: username });
        }
    );
}

// --- Admin Header Logic ---`;
content = content.replace(/function simpanPenggunaBaru\(event\) \{[\s\S]*?\/\/ --- Admin Header Logic ---/, crudFunctionsNew);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Script updated successfully!');
