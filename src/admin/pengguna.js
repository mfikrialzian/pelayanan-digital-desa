import { ROLE_MAPPINGS, SIDEBAR_ITEMS } from './admin_core.js';

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
                if (roleVal !== 'all' && u.peran !== roleVal) {
                    matchRole = false;
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

            if (tabId === 'akses') {
                renderHakAksesTable();
            }
        }

export function renderHakAksesTable() {
            let tbody = document.getElementById('hak-akses-tbody');
            if (!tbody) return;
            
            let html = '';
            
            SIDEBAR_ITEMS.forEach(function(item) {
                let opAccess = ROLE_MAPPINGS['Operator Pelayanan'] && ROLE_MAPPINGS['Operator Pelayanan'].sidebar && ROLE_MAPPINGS['Operator Pelayanan'].sidebar.includes(item.id);
                let secAccess = ROLE_MAPPINGS['Sekretaris Desa'] && ROLE_MAPPINGS['Sekretaris Desa'].sidebar && ROLE_MAPPINGS['Sekretaris Desa'].sidebar.includes(item.id);
                let kadesAccess = ROLE_MAPPINGS['Kepala Desa'] && ROLE_MAPPINGS['Kepala Desa'].sidebar && ROLE_MAPPINGS['Kepala Desa'].sidebar.includes(item.id);
                
                let opCheckId = 'ha-op-' + item.id;
                let secCheckId = 'ha-sec-' + item.id;
                let kadesCheckId = 'ha-kades-' + item.id;

                let opCheck = opAccess ? 'checked' : '';
                let secCheck = secAccess ? 'checked' : '';
                let kadesCheck = kadesAccess ? 'checked' : '';
                
                // Dashboard is disabled for edit because it's a base right
                let opDisabled = item.id === 'dashboard' ? 'disabled' : '';
                let secDisabled = item.id === 'dashboard' ? 'disabled' : '';
                let kadesDisabled = item.id === 'dashboard' ? 'disabled' : '';

                let opCursor = opDisabled ? 'cursor-not-allowed' : 'cursor-pointer';
                let secCursor = secDisabled ? 'cursor-not-allowed' : 'cursor-pointer';
                let kadesCursor = kadesDisabled ? 'cursor-not-allowed' : 'cursor-pointer';
                
                let opOpacity = opDisabled ? 'opacity-60' : '';
                let secOpacity = secDisabled ? 'opacity-60' : '';
                let kadesOpacity = kadesDisabled ? 'opacity-60' : '';

                html += '<tr class="hover:bg-slate-50 transition-colors">' +
                    '<td class="py-3 px-5 font-semibold text-slate-700"><i class="fa-solid ' + item.icon + ' w-6 text-slate-400"></i> ' + escapeHtml(item.label) + '</td>' +
                    '<td class="py-3 px-2 text-center">' +
                        '<label class="relative inline-flex items-center ' + opCursor + '">' +
                            '<input type="checkbox" id="' + opCheckId + '" class="sr-only peer" ' + opCheck + ' ' + opDisabled + '>' +
                            '<div class="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[\'\'] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-narmadaGreen ' + opOpacity + '"></div>' +
                        '</label>' +
                    '</td>' +
                    '<td class="py-3 px-2 text-center">' +
                        '<label class="relative inline-flex items-center ' + secCursor + '">' +
                            '<input type="checkbox" id="' + secCheckId + '" class="sr-only peer" ' + secCheck + ' ' + secDisabled + '>' +
                            '<div class="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[\'\'] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-narmadaGreen ' + secOpacity + '"></div>' +
                        '</label>' +
                    '</td>' +
                    '<td class="py-3 px-2 text-center">' +
                        '<label class="relative inline-flex items-center ' + kadesCursor + '">' +
                            '<input type="checkbox" id="' + kadesCheckId + '" class="sr-only peer" ' + kadesCheck + ' ' + kadesDisabled + '>' +
                            '<div class="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[\'\'] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-narmadaGreen ' + kadesOpacity + '"></div>' +
                        '</label>' +
                    '</td>' +
                '</tr>';
            });
            
            tbody.innerHTML = html;
        }

export function saveRoleAccess() {
            let newOpSidebar = [];
            let newSecSidebar = [];
            let newKadesSidebar = [];
            
            SIDEBAR_ITEMS.forEach(function(item) {
                let opCheck = document.getElementById('ha-op-' + item.id);
                if (opCheck && opCheck.checked) newOpSidebar.push(item.id);
                
                let secCheck = document.getElementById('ha-sec-' + item.id);
                if (secCheck && secCheck.checked) newSecSidebar.push(item.id);
                
                let kadesCheck = document.getElementById('ha-kades-' + item.id);
                if (kadesCheck && kadesCheck.checked) newKadesSidebar.push(item.id);
            });
            
            if (ROLE_MAPPINGS['Operator Pelayanan']) ROLE_MAPPINGS['Operator Pelayanan'].sidebar = newOpSidebar;
            if (ROLE_MAPPINGS['Sekretaris Desa']) ROLE_MAPPINGS['Sekretaris Desa'].sidebar = newSecSidebar;
            if (ROLE_MAPPINGS['Kepala Desa']) ROLE_MAPPINGS['Kepala Desa'].sidebar = newKadesSidebar;
            
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

// --- STATE VARIABLES ---
let tpCurrentStep = 1;
let tpSelectedJabatan = [];
let teSelectedJabatan = [];
let isPenggunaUIInitialized = false;

export function initPenggunaUI() {
    if (isPenggunaUIInitialized) return;
    setupStepEvents();
    setupJabatanEvents();
    setupUsernameSuggestions();
    isPenggunaUIInitialized = true;
}

export function openModalTambahPengguna() {
    initPenggunaUI();
    document.getElementById('mp-menu-container').classList.add('hidden');
    document.getElementById('mp-content-daftar').classList.add('hidden');
    let subview = document.getElementById('subview-admin-tambah-pengguna');
    if (subview) subview.classList.remove('hidden');
    
    // Reset Step Builder
    tpCurrentStep = 1;
    tpSelectedJabatan = [];
    document.getElementById('form-tambah-pengguna').reset();
    document.getElementById('tp-username-suggestions-container').classList.add('hidden');
    document.getElementById('tp-jabatan-dropdown').classList.remove('hidden');
    document.getElementById('tp-jabatan-locked').classList.add('hidden');
    updateStepUI();
    renderJabatanTags('tp-jabatan-selected-tags', tpSelectedJabatan, 'removeTpJabatan');
}

export function closeModalTambahPengguna(skipConfirm = false) {
    if (skipConfirm) {
        let subview = document.getElementById('subview-admin-tambah-pengguna');
        if (subview) subview.classList.add('hidden');
        document.getElementById('mp-content-daftar').classList.remove('hidden');
        return;
    }
    showCustomConfirm(
        '<i class="fa-solid fa-triangle-exclamation text-amber-500"></i> Batalkan Pembuatan',
        'Apakah Anda yakin ingin membatalkan? Data yang telah diisi akan hilang.',
        function() {
            let subview = document.getElementById('subview-admin-tambah-pengguna');
            if (subview) subview.classList.add('hidden');
            document.getElementById('mp-content-daftar').classList.remove('hidden');
        }
    );
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
    if (event) event.preventDefault();

    if (!validateStep(3)) return; // Double check

    let nama = document.getElementById('tp-nama').value;
    let username = document.getElementById('tp-username').value;
    let password = document.getElementById('tp-password').value;
    let peran = document.getElementById('tp-peran').value;
    let email = document.getElementById('tp-email').value;
    let wa = document.getElementById('tp-wa').value;
    let jabatan = tpSelectedJabatan.join(', ');
    
    showCustomConfirm(
        '<i class="fa-solid fa-floppy-disk text-narmadaGreen"></i> Konfirmasi Simpan',
        'Apakah Anda yakin ingin menyimpan pengguna baru ini?',
        function() {
            let akunBaru = { username: username, password: password, peran: peran, nama: nama, status: 'Aktif', jabatan: jabatan, email: email, wa: wa };
            
            document.getElementById('btn-submit-tambah-pengguna').disabled = true;
            document.getElementById('btn-submit-tambah-pengguna').innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i> Menyimpan...';
            
            callCrudPengguna('create', akunBaru, function() {
                closeModalTambahPengguna(true);
                document.getElementById('btn-submit-tambah-pengguna').disabled = false;
                document.getElementById('btn-submit-tambah-pengguna').innerHTML = '<i class="fa-solid fa-save mr-1.5"></i> Simpan Pengguna';
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
        if (u.peran === 'Operator Pelayanan') stats.operator++;
        if (u.peran === 'Sekretaris Desa' || u.peran === 'Kepala Desa') stats.pimpinan++;
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

// --- STEP BUILDER LOGIC ---
function updateStepUI() {
    [1, 2, 3, 4].forEach(s => {
        const stepDiv = document.getElementById('tp-step-' + s);
        if (stepDiv) {
            if (s === tpCurrentStep) stepDiv.classList.remove('hidden');
            else stepDiv.classList.add('hidden');
        }
    });

    const btnPrev = document.getElementById('tp-btn-prev');
    const btnNext = document.getElementById('tp-btn-next');
    const btnSubmit = document.getElementById('btn-submit-tambah-pengguna');
    
    if (tpCurrentStep === 1) {
        btnPrev.classList.add('hidden');
        btnNext.classList.remove('hidden');
        btnSubmit.classList.add('hidden');
    } else if (tpCurrentStep < 4) {
        btnPrev.classList.remove('hidden');
        btnNext.classList.remove('hidden');
        btnSubmit.classList.add('hidden');
    } else {
        btnPrev.classList.remove('hidden');
        btnNext.classList.add('hidden');
        btnSubmit.classList.remove('hidden');
        renderReviewData();
    }

    const bar = document.getElementById('tp-progress-bar');
    if (bar) bar.style.width = ((tpCurrentStep - 1) / 3) * 100 + '%';

    [1, 2, 3, 4].forEach(s => {
        const ind = document.getElementById('tp-step-indicator-' + s);
        const lbl = document.getElementById('tp-step-label-' + s);
        if (!ind) return;
        if (s < tpCurrentStep) {
            ind.className = 'w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-emerald-500 text-white transition-colors';
            ind.innerHTML = '<i class="fa-solid fa-check"></i>';
            if(lbl) lbl.className = 'text-[9px] font-bold text-emerald-500 absolute -bottom-5 w-max text-center';
        } else if (s === tpCurrentStep) {
            ind.className = 'w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-narmadaGreen text-white ring-4 ring-emerald-50 transition-colors';
            ind.innerHTML = s;
            if(lbl) lbl.className = 'text-[9px] font-bold text-narmadaGreen absolute -bottom-5 w-max text-center';
        } else {
            ind.className = 'w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-slate-100 text-slate-400 transition-colors';
            ind.innerHTML = s;
            if(lbl) lbl.className = 'text-[9px] font-bold text-slate-400 absolute -bottom-5 w-max text-center';
        }
    });
}

function validateStep(step) {
    if (step === 1) {
        const nama = document.getElementById('tp-nama').value.trim();
        if (!nama) { pushToast('Nama Lengkap harus diisi!', 'warning'); return false; }
        return true;
    }
    if (step === 2) {
        const peran = document.getElementById('tp-peran').value;
        const username = document.getElementById('tp-username').value.trim();
        if (!peran) { pushToast('Jenis Akun harus dipilih!', 'warning'); return false; }
        if (peran === 'Operator Pelayanan' && tpSelectedJabatan.length === 0) { pushToast('Pilih minimal satu Jabatan/Bidang!', 'warning'); return false; }
        if (!username) { pushToast('Username harus diisi!', 'warning'); return false; }
        if (username.includes(' ')) { pushToast('Username tidak boleh mengandung spasi!', 'warning'); return false; }
        return true;
    }
    if (step === 3) {
        const pass = document.getElementById('tp-password').value;
        const confirm = document.getElementById('tp-password-confirm').value;
        const err = document.getElementById('tp-password-error');
        if (!pass) { pushToast('Kata sandi harus diisi!', 'warning'); return false; }
        if (pass !== confirm) { err.classList.remove('hidden'); return false; }
        err.classList.add('hidden');
        return true;
    }
    return true;
}

function setupStepEvents() {
    const btnNext = document.getElementById('tp-btn-next');
    const btnPrev = document.getElementById('tp-btn-prev');
    if (btnNext) {
        btnNext.addEventListener('click', function() {
            if (validateStep(tpCurrentStep)) {
                tpCurrentStep++;
                if (tpCurrentStep > 4) tpCurrentStep = 4;
                updateStepUI();
            }
        });
    }
    if (btnPrev) {
        btnPrev.addEventListener('click', function() {
            tpCurrentStep--;
            if (tpCurrentStep < 1) tpCurrentStep = 1;
            updateStepUI();
        });
    }
}

function renderReviewData() {
    const nama = document.getElementById('tp-nama').value || '-';
    const email = document.getElementById('tp-email').value || '-';
    const wa = document.getElementById('tp-wa').value || '-';
    const peran = document.getElementById('tp-peran').value || '-';
    const jabatan = tpSelectedJabatan.join(', ') || '-';
    const username = document.getElementById('tp-username').value || '-';
    document.getElementById('tp-review-nama').textContent = nama;
    document.getElementById('tp-review-kontak').textContent = email + ' / ' + wa;
    document.getElementById('tp-review-akun').textContent = peran;
    document.getElementById('tp-review-jabatan').textContent = jabatan;
    document.getElementById('tp-review-username').textContent = username;
}

// --- JABATAN MULTI-SELECT ---
function renderJabatanTags(containerId, dataArray, removeCallback) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    dataArray.forEach(val => {
        const tag = document.createElement('div');
        tag.className = 'flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 shadow-sm';
        tag.innerHTML = `<span>${val}</span> <button type="button" class="text-slate-400 hover:text-red-500 transition-colors" onclick="${removeCallback}('${val}')"><i class="fa-solid fa-xmark"></i></button>`;
        container.appendChild(tag);
    });
}

window.removeTpJabatan = function(val) {
    tpSelectedJabatan = tpSelectedJabatan.filter(j => j !== val);
    renderJabatanTags('tp-jabatan-selected-tags', tpSelectedJabatan, 'removeTpJabatan');
};

window.removeTeJabatan = function(val) {
    teSelectedJabatan = teSelectedJabatan.filter(j => j !== val);
    renderJabatanTags('te-jabatan-selected-tags', teSelectedJabatan, 'removeTeJabatan');
};

function setupJabatanEvents() {
    const tpRole = document.getElementById('tp-peran');
    const tpSelect = document.getElementById('tp-jabatan-select');
    const teRole = document.getElementById('te-peran');
    const teSelect = document.getElementById('te-jabatan-select');

    if (tpRole) {
        tpRole.addEventListener('change', function() {
            const role = this.value;
            if (role === 'Kepala Desa' || role === 'Sekretaris Desa') {
                document.getElementById('tp-jabatan-dropdown').classList.add('hidden');
                document.getElementById('tp-jabatan-locked').classList.remove('hidden');
                document.getElementById('tp-jabatan-locked').textContent = role;
                tpSelectedJabatan = [role];
            } else {
                document.getElementById('tp-jabatan-dropdown').classList.remove('hidden');
                document.getElementById('tp-jabatan-locked').classList.add('hidden');
                tpSelectedJabatan = [];
                renderJabatanTags('tp-jabatan-selected-tags', tpSelectedJabatan, 'removeTpJabatan');
            }
        });
    }
    if (tpSelect) {
        tpSelect.addEventListener('change', function() {
            const val = this.value;
            if (val && !tpSelectedJabatan.includes(val)) {
                tpSelectedJabatan.push(val);
                renderJabatanTags('tp-jabatan-selected-tags', tpSelectedJabatan, 'removeTpJabatan');
            }
            this.value = ''; 
        });
    }

    if (teRole) {
        teRole.addEventListener('change', function() {
            const role = this.value;
            if (role === 'Kepala Desa' || role === 'Sekretaris Desa') {
                document.getElementById('te-jabatan-dropdown').classList.add('hidden');
                document.getElementById('te-jabatan-locked').classList.remove('hidden');
                document.getElementById('te-jabatan-locked').textContent = role;
                teSelectedJabatan = [role];
            } else {
                document.getElementById('te-jabatan-dropdown').classList.remove('hidden');
                document.getElementById('te-jabatan-locked').classList.add('hidden');
                if (!teSelectedJabatan.every(j => j !== 'Kepala Desa' && j !== 'Sekretaris Desa')) {
                    teSelectedJabatan = [];
                }
                renderJabatanTags('te-jabatan-selected-tags', teSelectedJabatan, 'removeTeJabatan');
            }
        });
    }
    if (teSelect) {
        teSelect.addEventListener('change', function() {
            const val = this.value;
            if (val && !teSelectedJabatan.includes(val)) {
                teSelectedJabatan.push(val);
                renderJabatanTags('te-jabatan-selected-tags', teSelectedJabatan, 'removeTeJabatan');
            }
            this.value = '';
        });
    }
}

// --- USERNAME AUTO-SUGGEST ---
function setupUsernameSuggestions() {
    const tpNama = document.getElementById('tp-nama');
    const tpUsername = document.getElementById('tp-username');
    const container = document.getElementById('tp-username-suggestions-container');
    const sugDiv = document.getElementById('tp-username-suggestions');
    
    if (tpNama && tpUsername) {
        tpNama.addEventListener('input', function() {
            const val = this.value.trim().toLowerCase();
            if (val.length < 3) { container.classList.add('hidden'); return; }
            container.classList.remove('hidden');
            const words = val.split(' ').filter(w => w.length > 0);
            
            let suggestions = [];
            if (words.length === 1) {
                suggestions.push(words[0]);
                suggestions.push(words[0] + '123');
                suggestions.push('admin_' + words[0]);
            } else if (words.length >= 2) {
                const first = words[0];
                const last = words[words.length - 1];
                suggestions.push(first + '_' + last);
                suggestions.push(first[0] + last);
                suggestions.push(first + last);
            }
            
            sugDiv.innerHTML = '';
            suggestions.forEach(sug => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-md text-[10px] font-bold border border-emerald-200 transition-colors';
                btn.textContent = sug;
                btn.onclick = () => { tpUsername.value = sug; container.classList.add('hidden'); };
                sugDiv.appendChild(btn);
            });
        });
        
        // Disable spaces in username field
        tpUsername.addEventListener('input', function() {
            this.value = this.value.toLowerCase().replace(/\s+/g, '_');
        });
    }
}

export function openModalEditPengguna(username) {
    if (!window.usersData) return;
    initPenggunaUI();
    let user = window.usersData.find(function(u) { return u.username === username; });
    if (!user) { pushToast('Data pengguna tidak ditemukan!', 'error'); return; }
    
    document.getElementById('te-username-hidden').value = user.username;
    document.getElementById('te-username').value = user.username;
    document.getElementById('te-nama').value = user.nama;
    document.getElementById('te-peran').value = user.peran;
    document.getElementById('te-status').value = user.status;
    document.getElementById('te-password').value = '';

    // Initialize jabatan logic for edit
    teSelectedJabatan = user.jabatan ? user.jabatan.split(',').map(s => s.trim()).filter(s => s) : [];
    if (user.peran === 'Kepala Desa' || user.peran === 'Sekretaris Desa') {
        document.getElementById('te-jabatan-dropdown').classList.add('hidden');
        document.getElementById('te-jabatan-locked').classList.remove('hidden');
        document.getElementById('te-jabatan-locked').textContent = user.peran;
        teSelectedJabatan = [user.peran];
    } else {
        document.getElementById('te-jabatan-dropdown').classList.remove('hidden');
        document.getElementById('te-jabatan-locked').classList.add('hidden');
        renderJabatanTags('te-jabatan-selected-tags', teSelectedJabatan, 'removeTeJabatan');
    }
    
    document.getElementById('mp-menu-container').classList.add('hidden');
    document.getElementById('mp-content-daftar').classList.add('hidden');
    let subview = document.getElementById('subview-admin-edit-pengguna');
    if (subview) subview.classList.remove('hidden');
}

export function closeModalEditPengguna() {
    let subview = document.getElementById('subview-admin-edit-pengguna');
    if (subview) subview.classList.add('hidden');
    document.getElementById('mp-content-daftar').classList.remove('hidden');
    
    let form = document.getElementById('form-edit-pengguna');
    if (form) form.reset();
}

export function simpanEditPengguna(event) {
    if (event) event.preventDefault();

    let username = document.getElementById('te-username-hidden').value;
    let nama = document.getElementById('te-nama').value;
    let peran = document.getElementById('te-peran').value;
    let status = document.getElementById('te-status').value;
    let jabatan = teSelectedJabatan.join(', ');
    let password = document.getElementById('te-password').value;
    
    if (peran === 'Operator Pelayanan' && teSelectedJabatan.length === 0) {
        pushToast('Pilih minimal satu Jabatan/Bidang!', 'warning');
        return;
    }

    showCustomConfirm(
        '<i class="fa-solid fa-floppy-disk text-narmadaGreen"></i> Konfirmasi Perubahan',
        'Apakah Anda yakin ingin menyimpan perubahan data pengguna ini?',
        function() {
            let payload = { username: username, updateData: { nama: nama, peran: peran, status: status, jabatan: jabatan } };
            if (password) payload.updateData.password = password;
            
            document.getElementById('btn-submit-edit-pengguna').disabled = true;
            document.getElementById('btn-submit-edit-pengguna').innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i> Menyimpan...';
            
            callCrudPengguna('update', payload, function() {
                closeModalEditPengguna();
                document.getElementById('btn-submit-edit-pengguna').disabled = false;
                document.getElementById('btn-submit-edit-pengguna').innerHTML = '<i class="fa-solid fa-save mr-1.5"></i> Simpan Perubahan';
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
