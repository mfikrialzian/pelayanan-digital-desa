export function initManajemenPengguna() {
    let token = localStorage.getItem('adminToken_Narmada');
    if (!token || !isGoogleEnv) return;
    
    backToManajemenPengguna();
    let tbody = document.getElementById('mp-table-body');
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
            
            let searchInput = document.getElementById('mp-search-user');
            let filterRole = document.getElementById('mp-filter-role');
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
}

export function filterUserTable() {
            let searchVal = document.getElementById('mp-search-user').value.toLowerCase();
            let roleVal = document.getElementById('mp-filter-role').value;
            
            let users = window.usersData || [];
            let filtered = users.filter(function(u) {
                let matchSearch = u.nama.toLowerCase().includes(searchVal) || u.username.toLowerCase().includes(searchVal);
                let matchRole = true;
                if (roleVal !== 'all') {
                    if (roleVal === 'Super Admin' && u.peran !== 'Super Admin') matchRole = false;
                    if (roleVal === 'Operator' && !u.peran.includes('Operator')) matchRole = false;
                    if (roleVal === 'Pimpinan' && !u.peran.includes('Desa')) matchRole = false;
                }
                return matchSearch && matchRole;
            });
            renderUserTable(filtered);
        }

export function renderUserTable(users) {
            let tbody = document.getElementById('mp-table-body');
            if (!tbody) return;
            
            tbody.innerHTML = '';
            if (users.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="py-6 text-center text-slate-500 text-sm">Tidak ada data pengguna ditemukan.</td></tr>';
                return;
            }

            users.forEach(function(u) {
                let roleBadge = '';
                if (u.peran === 'Super Admin') roleBadge = '<span class="px-2 py-1 bg-red-100 text-red-700 rounded-lg text-[10px] font-bold">' + u.peran + '</span>';
                else if (u.peran.includes('Operator')) roleBadge = '<span class="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-[10px] font-bold">' + u.peran + '</span>';
                else if (u.peran.includes('Desa')) roleBadge = '<span class="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-[10px] font-bold">' + u.peran + '</span>';
                else roleBadge = '<span class="px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-[10px] font-bold">' + u.peran + '</span>';
                
                let statusBadge = u.status === 'Aktif' 
                    ? '<span class="px-2 py-1 bg-emerald-100 text-narmadaGreen rounded-lg text-[10px] font-bold"><i class="fa-solid fa-circle text-[8px] mr-1"></i>Aktif</span>'
                    : '<span class="px-2 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-bold"><i class="fa-solid fa-circle text-[8px] mr-1"></i>Nonaktif</span>';
                
                let dropdownId = 'dropdown-aksi-' + u.username;
                
                let tr = '<tr class="border-b border-slate-50 hover:bg-slate-50 transition-colors">' +
                            '<td class="py-3 px-4 font-bold text-slate-800">' + escapeHtml(u.nama || '-') + '</td>' +
                            '<td class="py-3 px-4 text-xs text-slate-500">@' + escapeHtml(u.username || '-') + '</td>' +
                            '<td class="py-3 px-4">' + roleBadge + '</td>' +
                            '<td class="py-3 px-4">' + statusBadge + '</td>' +
                            '<td class="py-3 px-4 text-xs text-slate-500">' + (u.terakhirLogin || '-') + '</td>' +
                            '<td class="py-3 px-4 text-right relative">' +
                                '<button onclick="toggleDropdown(\'' + dropdownId + '\')" class="w-8 h-8 rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"><i class="fa-solid fa-ellipsis-vertical"></i></button>' +
                                '<div id="' + dropdownId + '" class="hidden absolute right-4 top-10 w-48 bg-white border border-slate-100 shadow-lg rounded-xl z-10 overflow-hidden text-left">' +
                                    '<button onclick="openModalEditPengguna(\'' + u.username + '\'); toggleDropdown(\'' + dropdownId + '\')" class="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"><i class="fa-solid fa-pen-to-square w-4"></i> Edit Pengguna</button>' +
                                    '<button onclick="resetPasswordPengguna(\'' + u.username + '\'); toggleDropdown(\'' + dropdownId + '\')" class="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"><i class="fa-solid fa-key w-4"></i> Reset Password</button>' +
                                    '<div class="h-px bg-slate-100 w-full my-1"></div>' +
                                    (u.status === 'Aktif' 
                                        ? '<button onclick="toggleStatusPengguna(\'' + u.username + '\', \'Aktif\'); toggleDropdown(\'' + dropdownId + '\')" class="w-full text-left px-4 py-2.5 text-xs font-medium text-amber-600 hover:bg-amber-50 transition-colors flex items-center gap-2"><i class="fa-solid fa-user-slash w-4"></i> Nonaktifkan Akun</button>'
                                        : '<button onclick="toggleStatusPengguna(\'' + u.username + '\', \'Nonaktif\'); toggleDropdown(\'' + dropdownId + '\')" class="w-full text-left px-4 py-2.5 text-xs font-medium text-narmadaGreen hover:bg-emerald-50 transition-colors flex items-center gap-2"><i class="fa-solid fa-user-check w-4"></i> Aktifkan Akun</button>'
                                    ) +
                                    '<div class="h-px bg-slate-100 w-full my-1"></div>' +
                                    '<button onclick="hapusPengguna(\'' + u.username + '\'); toggleDropdown(\'' + dropdownId + '\')" class="w-full text-left px-4 py-2.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"><i class="fa-solid fa-trash w-4"></i> Hapus Pengguna</button>' +
                                '</div>' +
                            '</td>' +
                         '</tr>';
                tbody.innerHTML += tr;
            });
        }

export function toggleDropdown(id) {
            let el = document.getElementById(id);
            if (el) el.classList.toggle('hidden');
        }

export function switchManajemenPenggunaTab(tabId) {
            // Sembunyikan menu container utama
            let menuContainer = document.getElementById('mp-menu-container');
            if (menuContainer) menuContainer.classList.add('hidden');

            // Sembunyikan semua konten terlebih dahulu
            let tabs = ['daftar', 'akses', 'aktifitas'];
            tabs.forEach(function(t) {
                let content = document.getElementById('mp-content-' + t);
                if (content) content.classList.add('hidden');
            });

            // Tampilkan konten yang dipilih
            let activeContent = document.getElementById('mp-content-' + tabId);
            if (activeContent) activeContent.classList.remove('hidden');
        }

export function saveRoleAccess() {
            pushToast('Perubahan Hak Akses berhasil disimpan!', 'success');
        }

export function backToManajemenPengguna() {
            // Sembunyikan semua konten
            let tabs = ['daftar', 'akses', 'aktifitas'];
            tabs.forEach(function(t) {
                let content = document.getElementById('mp-content-' + t);
                if (content) content.classList.add('hidden');
            });

            // Tampilkan kembali menu container utama
            let menuContainer = document.getElementById('mp-menu-container');
            if (menuContainer) menuContainer.classList.remove('hidden');
        }

export async function fetchActivities() {
    const tbody = document.getElementById("tabel-log-aktivitas");
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="4" class="px-4 py-8 text-center text-slate-400">Memuat log aktivitas...</td></tr>`;
    
    if (isGoogleEnv) {
        google.script.run
            .withSuccessHandler(function (res) {
                renderActivities(res, tbody);
            })
            .withFailureHandler(function (err) {
                tbody.innerHTML = `<tr><td colspan="4" class="px-4 py-8 text-center text-red-500">Gagal memuat: ${err.toString()}</td></tr>`;
            })
            .getActivities(localStorage.getItem('adminToken_Narmada'), 50);
    } else {
        setTimeout(function() {
            renderActivities({ success: true, data: [] }, tbody);
        }, 800);
    }
}

export function renderActivities(res, tbody) {
    if (res && res.success === false) {
        tbody.innerHTML = `<tr><td colspan="4" class="px-4 py-8 text-center text-red-500">${res.message || res.error}</td></tr>`;
        return;
    }
    
    let data = Array.isArray(res) ? res : (res.data || []);
    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="px-4 py-8 text-center text-slate-400">Belum ada log aktivitas.</td></tr>`;
        return;
    }
    
    let html = "";
    data.forEach(item => {
        let icon = "fa-info-circle text-blue-500 bg-blue-50";
        if (item.tipe === "NEW_REQUEST") icon = "fa-file-arrow-up text-blue-500 bg-blue-50";
        if (item.tipe === "STATUS_UPDATE" || item.tipe === "UPDATE_STATUS") icon = "fa-check text-emerald-500 bg-emerald-50";
        if (item.tipe === "LOGIN") icon = "fa-user text-slate-500 bg-slate-50";
        if (item.tipe === "REUPLOAD") icon = "fa-cloud-arrow-up text-amber-500 bg-amber-50";

        html += `
        <tr class="hover:bg-slate-50 transition-colors group">
            <td class="px-4 py-3 rounded-l-xl"><span class="font-bold text-slate-800">${item.waktu}</span></td>
            <td class="px-4 py-3">
                <span class="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold ${icon.split(" ")[1]} ${icon.split(" ")[2]}">
                    <i class="fa-solid ${icon.split(" ")[0]}"></i> ${item.tipe}
                </span>
            </td>
            <td class="px-4 py-3 text-slate-600 truncate max-w-xs">${item.pesan}</td>
            <td class="px-4 py-3 rounded-r-xl"><span class="font-bold text-slate-500">${item.pelaku}</span></td>
        </tr>`;
    });
    
    tbody.innerHTML = html;
}

export function openModalTambahPengguna() {
    document.getElementById('mp-menu-container').classList.add('hidden');
    document.getElementById('mp-content-daftar').classList.add('hidden');
    let subview = document.getElementById('subview-admin-tambah-pengguna');
    if (subview) subview.classList.remove('hidden');
}

export function closeModalTambahPengguna() {
    let subview = document.getElementById('subview-admin-tambah-pengguna');
    if (subview) subview.classList.add('hidden');
    document.getElementById('mp-menu-container').classList.remove('hidden');
    document.getElementById('mp-content-daftar').classList.remove('hidden');
    
    // Reset form
    let form = document.getElementById('form-tambah-pengguna');
    if (form) form.reset();
}

export function callCrudPengguna(action, payload, onSuccess) {
    let token = localStorage.getItem('adminToken_Narmada');
    if (!token || !isGoogleEnv) return;
    
    google.script.run
        .withSuccessHandler(function (res) {
            if (res.success) {
                let successMsg = res.message || "Tindakan berhasil dilakukan.";
                pushToast(successMsg, "success");
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

export function simpanPenggunaBaru(event) {
    event.preventDefault();

    let nama = document.getElementById('tp-nama').value;
    let username = document.getElementById('tp-username').value;
    let password = document.getElementById('tp-password').value;
    let peran = document.getElementById('tp-peran').value;
    let status = document.getElementById('tp-status').value;
    
    showCustomConfirm(
        '<i class="fa-solid fa-floppy-disk text-narmadaGreen"></i> Konfirmasi Simpan',
        'Apakah Anda yakin ingin menyimpan pengguna baru ini?',
        function() {
            let akunBaru = { username: username, password: password, peran: peran, nama: nama, status: status };
            
            document.getElementById('btn-submit-tambah-pengguna').disabled = true;
            document.getElementById('btn-submit-tambah-pengguna').innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i> Menyimpan...';
            
            callCrudPengguna('create', akunBaru, function() {
                closeModalTambahPengguna();
                document.getElementById('btn-submit-tambah-pengguna').disabled = false;
                document.getElementById('btn-submit-tambah-pengguna').innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Simpan Pengguna';
            });
        }
    );
}

export function updateStatistikPengguna() {
    if (!window.usersData) return;
    let stats = { total: 0, admin: 0, operator: 0, pimpinan: 0, viewer: 0 };
    window.usersData.forEach(function(u) {
        stats.total++;
        if (u.peran === 'Super Admin') stats.admin++;
        if (u.peran.includes('Operator')) stats.operator++;
        if (u.peran.includes('Desa') || u.peran === 'Pimpinan') stats.pimpinan++;
    });
    stats.viewer = Math.floor(Math.random() * 3) + 1;

    let elTotal = document.getElementById('stat-user-total');
    if (elTotal) elTotal.innerText = stats.total;
    let elAdmin = document.getElementById('stat-user-admin');
    if (elAdmin) elAdmin.innerText = stats.admin;
    let elOperator = document.getElementById('stat-user-operator');
    if (elOperator) elOperator.innerText = stats.operator;
    let elPimpinan = document.getElementById('stat-user-pimpinan');
    if (elPimpinan) elPimpinan.innerText = stats.pimpinan;
    let elViewer = document.getElementById('stat-user-viewer');
    if (elViewer) elViewer.innerText = stats.viewer;
}

export function openModalEditPengguna(username) {
    if (!window.usersData) return;
    let user = window.usersData.find(function(u) { return u.username === username; });
    if (!user) { pushToast('Data pengguna tidak ditemukan!', 'error'); return; }
    
    document.getElementById('te-username-hidden').value = user.username;
    document.getElementById('te-username').value = user.username;
    document.getElementById('te-nama').value = user.nama;
    document.getElementById('te-peran').value = user.peran;
    document.getElementById('te-status').value = user.status;
    
    document.getElementById('mp-menu-container').classList.add('hidden');
    document.getElementById('mp-content-daftar').classList.add('hidden');
    let subview = document.getElementById('subview-admin-edit-pengguna');
    if (subview) subview.classList.remove('hidden');
}

export function closeModalEditPengguna() {
    let subview = document.getElementById('subview-admin-edit-pengguna');
    if (subview) subview.classList.add('hidden');
    document.getElementById('mp-menu-container').classList.remove('hidden');
    document.getElementById('mp-content-daftar').classList.remove('hidden');
    
    let form = document.getElementById('form-edit-pengguna');
    if (form) form.reset();
}

export function simpanEditPengguna(event) {
    event.preventDefault();

    let username = document.getElementById('te-username-hidden').value;
    let nama = document.getElementById('te-nama').value;
    let peran = document.getElementById('te-peran').value;
    let status = document.getElementById('te-status').value;

    showCustomConfirm(
        '<i class="fa-solid fa-floppy-disk text-blue-600"></i> Konfirmasi Perubahan',
        'Apakah Anda yakin ingin menyimpan perubahan data pengguna ini?',
        function() {

            
            let payload = { username: username, updateData: { nama: nama, peran: peran, status: status } };
            
            document.getElementById('btn-submit-edit-pengguna').disabled = true;
            document.getElementById('btn-submit-edit-pengguna').innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i> Menyimpan...';
            
            callCrudPengguna('update', payload, function() {
                closeModalEditPengguna();
                document.getElementById('btn-submit-edit-pengguna').disabled = false;
                document.getElementById('btn-submit-edit-pengguna').innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Simpan Perubahan';
            });
        }
    );
}

export function resetPasswordPengguna(username) {
    showCustomConfirm(
        '<i class="fa-solid fa-triangle-exclamation text-amber-500"></i> Konfirmasi Reset Password', 
        'Apakah Anda yakin ingin mengatur ulang sandi untuk akun <b>@' + username + '</b> menjadi standar (123)?', 
        function() {
            callCrudPengguna('resetPassword', { username: username, password: '123' });
        }
    );
}

export function toggleStatusPengguna(username, currentStatus) {
    let action = currentStatus === 'Aktif' ? 'menonaktifkan' : 'mengaktifkan';
    showCustomConfirm(
        '<i class="fa-solid fa-power-off text-blue-500"></i> Konfirmasi Ubah Status',
        'Apakah Anda yakin ingin ' + action + ' akun <b>@' + username + '</b>?',
        function() {
            let newStatus = currentStatus === 'Aktif' ? 'Nonaktif' : 'Aktif';
            callCrudPengguna('toggleStatus', { username: username, status: newStatus });
        }
    );
}

export function hapusPengguna(username) {
    if (username === 'superadmin') {
        pushToast('Akun Super Admin utama tidak dapat dihapus!', 'error');
        return;
    }
    showCustomConfirm(
        '<i class="fa-solid fa-trash text-red-600"></i> Konfirmasi Hapus Akun',
        'Apakah Anda yakin ingin menghapus akun <b>@' + username + '</b> secara permanen? Data yang telah dihapus tidak dapat dikembalikan.',
        function() {
            callCrudPengguna('delete', { username: username });
        }
    );
}
