window.dummyUsersData = [
            { u: "superadmin", p: "123", role: "Super Admin", name: "Budi (Super Admin)", status: "Aktif", unit: "Pusat", terakhirLogin: "Hari ini, 08:15 WITA" },
            { u: "op1", p: "123", role: "Operator Pelayanan 1", name: "Siti (OP 1)", status: "Aktif", unit: "Pelayanan", terakhirLogin: "Kemarin, 14:30 WITA" },
            { u: "op2", p: "123", role: "Operator Pelayanan 2", name: "Andi (OP 2)", status: "Nonaktif", unit: "Pelayanan", terakhirLogin: "23 Jul 2026, 09:12 WITA" },
            { u: "sekdes", p: "123", role: "Sekretaris Desa", name: "Ahmad (Sekdes)", status: "Aktif", unit: "Sekretariat", terakhirLogin: "Hari ini, 09:00 WITA" },
            { u: "kades", p: "123", role: "Kepala Desa", name: "Joko (Kades)", status: "Aktif", unit: "Pimpinan", terakhirLogin: "20 Jul 2026, 11:45 WITA" }
        ];

        function runAdminLoginAuth() {
            var u = document.getElementById('login-username').value.trim();
            var p = document.getElementById('login-password').value.trim();
            var btn = document.getElementById('btn-submit-login');

            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i> Login...';

            if (isGoogleEnv) {
                google.script.run
                    .withSuccessHandler(function (res) {
                        btn.disabled = false;
                        btn.innerHTML = '<span>Login</span>';
                        if (res.success) {
                            localStorage.setItem('adminToken_Narmada', res.token);
                            localStorage.setItem('userRole', res.role || 'Super Admin');
                            localStorage.setItem('userName', res.name || 'Admin');
                            initRBAC();
                            switchView('admin');
                            pushToast("Otentikasi Sukses. Selamat Bekerja Admin.", "success");
                        } else {
                            pushToast(res.message, "error");
                        }
                    })
                    .withFailureHandler(function (err) {
                        btn.disabled = false;
                        btn.innerHTML = '<span>Login</span>';
                        pushToast("Error: " + err, "error");
                    })
                    .checkAdminLogin(u, p);
            } else {
                setTimeout(function () {
                    btn.disabled = false;
                    btn.innerHTML = '<span>Login</span>';
                    
                    var userMatch = window.dummyUsersData.find(function(user) {
                        return user.u === u && user.p === p;
                    });

                    if (userMatch) {
                        localStorage.setItem('adminToken_Narmada', 'dummy-token');
                        localStorage.setItem('userRole', userMatch.role);
                        localStorage.setItem('userName', userMatch.name);
                        initRBAC();
                        switchView('admin');
                    } else {
                        pushToast("Kredensial login admin salah!", "error");
                    }
                }, 800);
            }
        }

        function confirmAdminLogout() {
            askConfirmation("Konfirmasi Keluar", "Apakah Anda yakin ingin keluar dari Dashboard Admin?", function() {
                handleAdminLogout();
            });
        }

        function handleAdminLogout() {
            var token = localStorage.getItem('adminToken_Narmada');
            if (token && isGoogleEnv) {
                google.script.run.logoutAdmin(token);
            }
            localStorage.removeItem('adminToken_Narmada');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userName');
            pushToast("Berhasil keluar dari Dashboard Admin.", "info");
            switchView('admin-login');
        }

        const SIDEBAR_ITEMS = [
            { id: 'dashboard', icon: 'fa-house', label: 'Dashboard', action: "switchAdminTab('dashboard')" },
            { id: 'daftar-layanan', icon: 'fa-layer-group', label: 'Layanan', action: "switchAdminTab('daftar-layanan')" },
            { id: 'pengajuan', icon: 'fa-file-lines', label: 'Pengajuan', action: "switchAdminTab('dashboard')" },
            { id: 'kontak', icon: 'fa-address-book', label: 'Kontak Pelayanan', action: "switchAdminTab('kontak')" },
            { id: 'verifikasi', icon: 'fa-check-to-slot', label: 'Verifikasi Berkas', action: "switchAdminTab('dashboard')" },
            { id: 'tte', icon: 'fa-signature', label: 'Persetujuan & TTE', action: "pushToast('Fitur Persetujuan & TTE segera hadir', 'info')" },
            { id: 'data-penduduk', icon: 'fa-users', label: 'Data Penduduk', action: "pushToast('Fitur Data Penduduk segera hadir', 'info')" },
            { id: 'dokumen', icon: 'fa-folder-open', label: 'Dokumen & Surat', action: "", disabled: true },
            { id: 'laporan', icon: 'fa-chart-simple', label: 'Laporan', action: "switchAdminTab('laporan')" },
            { id: 'beranda', icon: 'fa-gear', label: 'Pengaturan Web', action: "switchAdminTab('beranda')" },
            { id: 'kredensial', icon: 'fa-regular fa-user', label: 'Manajemen Pengguna', action: "switchAdminTab('kredensial')" },
            { id: 'aktivitas', icon: 'fa-clock-rotate-left', label: 'Log Aktivitas', action: "switchAdminTab('aktivitas')" }
        ];

        const AVATAR_ITEMS = [
            { id: 'pengaturan-akun', icon: 'fa-gear', label: 'Pengaturan Akun', action: "javascript:switchAdminTab('pengaturan-akun');", onclick: "document.getElementById('admin-profile-trigger').click()", colorClass: "text-slate-500", groupHoverClass: "group-hover:text-narmadaGreen", bgClass: "bg-slate-100", groupBgClass: "group-hover:bg-emerald-50", textClass: "text-slate-700 hover:bg-slate-50 hover:text-narmadaGreen" },
            { id: 'panduan', icon: 'fa-regular fa-circle-question', label: 'Bantuan & Panduan', action: "https://docs.google.com/document/d/dummy-link-panduan-admin", target: "_blank", colorClass: "text-slate-500", groupHoverClass: "group-hover:text-narmadaGreen", bgClass: "bg-slate-100", groupBgClass: "group-hover:bg-emerald-50", textClass: "text-slate-700 hover:bg-slate-50 hover:text-narmadaGreen" },
            { id: 'log-saya', icon: 'fa-clock-rotate-left', label: 'Riwayat Aktivitas', action: "javascript:switchAdminTab('aktivitas');", onclick: "document.getElementById('admin-profile-trigger').click()", colorClass: "text-slate-500", groupHoverClass: "group-hover:text-narmadaGreen", bgClass: "bg-slate-100", groupBgClass: "group-hover:bg-emerald-50", textClass: "text-slate-700 hover:bg-slate-50 hover:text-narmadaGreen" },
            { id: 'divider', type: 'divider' },
            { id: 'logout', icon: 'fa-arrow-right-from-bracket', label: 'Keluar', action: "javascript:void(0)", onclick: "confirmAdminLogout()", colorClass: "text-red-500", groupHoverClass: "", bgClass: "bg-red-50", groupBgClass: "group-hover:bg-red-100", textClass: "text-red-600 hover:bg-red-50" }
        ];

        const ROLE_MAPPINGS = {
            "Super Admin": {
                sidebar: ['dashboard', 'daftar-layanan', 'pengajuan', 'kontak', 'verifikasi', 'tte', 'data-penduduk', 'dokumen', 'laporan', 'beranda', 'kredensial', 'aktivitas'],
                avatar: ['pengaturan-akun', 'panduan', 'log-saya', 'divider', 'logout']
            },
            "Operator Pelayanan 1": {
                sidebar: ['dashboard', 'pengajuan', 'verifikasi', 'data-penduduk', 'laporan'],
                avatar: ['pengaturan-akun', 'log-saya', 'divider', 'logout']
            },
            "Operator Pelayanan 2": {
                sidebar: ['dashboard', 'pengajuan', 'verifikasi', 'data-penduduk', 'laporan'],
                avatar: ['pengaturan-akun', 'log-saya', 'divider', 'logout']
            },
            "Sekretaris Desa": {
                sidebar: ['dashboard', 'pengajuan', 'verifikasi', 'tte', 'data-penduduk', 'laporan'],
                avatar: ['pengaturan-akun', 'log-saya', 'divider', 'logout']
            },
            "Kepala Desa": {
                sidebar: ['dashboard', 'pengajuan', 'tte', 'data-penduduk', 'laporan'],
                avatar: ['pengaturan-akun', 'log-saya', 'divider', 'logout']
            }
        };

        function initRBAC() {
            var role = localStorage.getItem('userRole') || 'Super Admin';
            var userName = localStorage.getItem('userName') || 'Administrator';
            var mapping = ROLE_MAPPINGS[role] || ROLE_MAPPINGS['Super Admin'];
            
            // Update Profile Name and Role in UI (Header)
            var profileNames = document.querySelectorAll('.admin-profile-name');
            var profileRoles = document.querySelectorAll('.admin-profile-role');
            if (profileNames.length === 0) {
                // Specific targeted updates for the layout
                var hName = document.querySelector('header span.text-base.leading-none');
                if (hName) hName.innerText = userName;
                var hRole = document.querySelector('header span.bg-emerald-100');
                if (hRole) hRole.innerText = role;
                
                var dName = document.querySelector('#admin-profile-trigger p.text-sm');
                if (dName) dName.innerText = userName;
                var dRole = document.querySelector('#admin-profile-trigger p.text-\\[10px\\]');
                if (dRole) dRole.innerText = role;
            }

            // Render Sidebar
            var sidebarNav = document.getElementById('admin-sidebar-nav');
            if (sidebarNav) {
                sidebarNav.innerHTML = '';
                mapping.sidebar.forEach(function(itemId) {
                    var item = SIDEBAR_ITEMS.find(function(i) { return i.id === itemId; });
                    if (item) {
                        var disabledAttr = item.disabled ? 'disabled=""' : '';
                        var btnHtml = '<button id="tab-adm-' + item.id + '" onclick="' + item.action + '" ' + disabledAttr + ' class="w-full text-left flex items-center px-3 py-2.5 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-semibold text-sm transition-colors">' +
                                      '<i class="fa-solid ' + item.icon + ' w-5 text-center mr-2"></i> ' + item.label +
                                      '</button>';
                        sidebarNav.innerHTML += btnHtml;
                    }
                });
            }

            // Render Avatar Menu
            var avatarMenu = document.getElementById('admin-profile-menu');
            if (avatarMenu) {
                avatarMenu.innerHTML = '<div class="px-4 py-2 border-b border-slate-100 mb-2">' +
                                       '<p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Akun Saya</p>' +
                                       '</div>';
                
                mapping.avatar.forEach(function(itemId) {
                    var item = AVATAR_ITEMS.find(function(i) { return i.id === itemId; });
                    if (item) {
                        if (item.type === 'divider') {
                            avatarMenu.innerHTML += '<div class="my-1 border-t border-slate-100"></div>';
                        } else {
                            var targetAttr = item.target ? 'target="' + item.target + '"' : '';
                            var clickAttr = item.onclick ? 'onclick="' + item.onclick + '"' : '';
                            var linkHtml = '<a href="' + item.action + '" ' + targetAttr + ' ' + clickAttr + ' class="flex items-center gap-3 px-4 py-2 text-sm transition-colors group ' + item.textClass + '">' +
                                           '<div class="w-8 h-8 rounded-full flex items-center justify-center transition-colors ' + item.bgClass + ' ' + item.groupBgClass + '">' +
                                           '<i class="fa-solid ' + item.icon + ' ' + item.colorClass + ' ' + item.groupHoverClass + '"></i>' +
                                           '</div>' +
                                           '<span class="font-medium">' + item.label + '</span>' +
                                           '</a>';
                            avatarMenu.innerHTML += linkHtml;
                        }
                    }
                });
            }
        }

        window.isVerifikasiDirty = false;
        function markVerifikasiDirty() {
            window.isVerifikasiDirty = true;
        }

        function initManajemenPengguna() {
            var users = window.dummyUsersData || [];
            
            // Hide all contents and show menu initially
            backToManajemenPengguna();

            // Calculate Stats
            var stats = { total: 0, admin: 0, operator: 0, pimpinan: 0, viewer: 0 };
            users.forEach(function(u) {
                stats.total++;
                if (u.role === 'Super Admin') stats.admin++;
                if (u.role.includes('Operator')) stats.operator++;
                if (u.role.includes('Desa')) stats.pimpinan++; // Kades & Sekdes
            });
            // Simulate active online users accessing the web admin
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

            renderUserTable(users);
            
            // Attach event listeners for search and filter
            var searchInput = document.getElementById('mp-search-user');
            var filterRole = document.getElementById('mp-filter-role');
            if (searchInput) {
                searchInput.addEventListener('input', filterUserTable);
            }
            if (filterRole) {
                filterRole.addEventListener('change', filterUserTable);
            }
        }

        function filterUserTable() {
            var searchVal = document.getElementById('mp-search-user').value.toLowerCase();
            var roleVal = document.getElementById('mp-filter-role').value;
            
            var users = window.dummyUsersData || [];
            var filtered = users.filter(function(u) {
                var matchSearch = u.name.toLowerCase().includes(searchVal) || u.u.toLowerCase().includes(searchVal);
                var matchRole = true;
                if (roleVal !== 'all') {
                    if (roleVal === 'Super Admin' && u.role !== 'Super Admin') matchRole = false;
                    if (roleVal === 'Operator' && !u.role.includes('Operator')) matchRole = false;
                    if (roleVal === 'Pimpinan' && !u.role.includes('Desa')) matchRole = false;
                }
                return matchSearch && matchRole;
            });
            renderUserTable(filtered);
        }

        function renderUserTable(users) {
            var tbody = document.getElementById('mp-table-body');
            if (!tbody) return;
            
            tbody.innerHTML = '';
            if (users.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="py-6 text-center text-slate-500 text-sm">Tidak ada data pengguna ditemukan.</td></tr>';
                return;
            }

            users.forEach(function(u) {
                var roleBadge = '';
                if (u.role === 'Super Admin') roleBadge = '<span class="px-2 py-1 bg-red-100 text-red-700 rounded-lg text-[10px] font-bold">' + u.role + '</span>';
                else if (u.role.includes('Operator')) roleBadge = '<span class="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-[10px] font-bold">' + u.role + '</span>';
                else if (u.role.includes('Desa')) roleBadge = '<span class="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-[10px] font-bold">' + u.role + '</span>';
                else roleBadge = '<span class="px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-[10px] font-bold">' + u.role + '</span>';
                
                var statusBadge = u.status === 'Aktif' 
                    ? '<span class="px-2 py-1 bg-emerald-100 text-narmadaGreen rounded-lg text-[10px] font-bold"><i class="fa-solid fa-circle text-[8px] mr-1"></i>Aktif</span>'
                    : '<span class="px-2 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-bold"><i class="fa-solid fa-circle text-[8px] mr-1"></i>Nonaktif</span>';
                
                var dropdownId = 'dropdown-aksi-' + u.u;
                
                var tr = '<tr class="border-b border-slate-50 hover:bg-slate-50 transition-colors">' +
                            '<td class="py-3 px-4">' +
                                '<div class="font-bold text-slate-800">' + u.name + '</div>' +
                                '<div class="text-xs text-slate-500">@' + u.u + '</div>' +
                            '</td>' +
                            '<td class="py-3 px-4">' + roleBadge + '</td>' +
                            '<td class="py-3 px-4 text-xs font-semibold text-slate-600">' + (u.unit || '-') + '</td>' +
                            '<td class="py-3 px-4">' + statusBadge + '</td>' +
                            '<td class="py-3 px-4 text-xs text-slate-500">' + (u.terakhirLogin || '-') + '</td>' +
                            '<td class="py-3 px-4 text-right relative">' +
                                '<button onclick="toggleDropdown(\'' + dropdownId + '\')" class="w-8 h-8 rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"><i class="fa-solid fa-ellipsis-vertical"></i></button>' +
                                '<div id="' + dropdownId + '" class="hidden absolute right-4 top-10 w-48 bg-white border border-slate-100 shadow-lg rounded-xl z-10 overflow-hidden text-left">' +
                                    '<button onclick="pushToast(\'Edit Pengguna: ' + u.u + '\', \'info\'); toggleDropdown(\'' + dropdownId + '\')" class="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"><i class="fa-solid fa-pen-to-square w-4"></i> Edit Pengguna</button>' +
                                    '<button onclick="pushToast(\'Reset Sandi: ' + u.u + '\', \'info\'); toggleDropdown(\'' + dropdownId + '\')" class="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"><i class="fa-solid fa-key w-4"></i> Reset Password</button>' +
                                    '<div class="h-px bg-slate-100 w-full my-1"></div>' +
                                    (u.status === 'Aktif' 
                                        ? '<button onclick="pushToast(\'Nonaktifkan Akun: ' + u.u + '\', \'warning\'); toggleDropdown(\'' + dropdownId + '\')" class="w-full text-left px-4 py-2.5 text-xs font-medium text-amber-600 hover:bg-amber-50 transition-colors flex items-center gap-2"><i class="fa-solid fa-user-slash w-4"></i> Nonaktifkan Akun</button>'
                                        : '<button onclick="pushToast(\'Aktifkan Akun: ' + u.u + '\', \'success\'); toggleDropdown(\'' + dropdownId + '\')" class="w-full text-left px-4 py-2.5 text-xs font-medium text-narmadaGreen hover:bg-emerald-50 transition-colors flex items-center gap-2"><i class="fa-solid fa-user-check w-4"></i> Aktifkan Akun</button>'
                                    ) +
                                    '<button onclick="pushToast(\'Hapus Pengguna: ' + u.u + '\', \'error\'); toggleDropdown(\'' + dropdownId + '\')" class="w-full text-left px-4 py-2.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"><i class="fa-solid fa-trash w-4"></i> Hapus Pengguna</button>' +
                                '</div>' +
                            '</td>' +
                         '</tr>';
                tbody.innerHTML += tr;
            });
        }

        // Helper function for table row dropdowns
        function toggleDropdown(id) {
            var el = document.getElementById(id);
            if (el) el.classList.toggle('hidden');
        }

        function switchManajemenPenggunaTab(tabId) {
            // Sembunyikan menu container utama
            var menuContainer = document.getElementById('mp-menu-container');
            if (menuContainer) menuContainer.classList.add('hidden');

            // Sembunyikan semua konten terlebih dahulu
            var tabs = ['daftar', 'akses', 'aktifitas'];
            tabs.forEach(function(t) {
                var content = document.getElementById('mp-content-' + t);
                if (content) content.classList.add('hidden');
            });

            // Tampilkan konten yang dipilih
            var activeContent = document.getElementById('mp-content-' + tabId);
            if (activeContent) activeContent.classList.remove('hidden');
        }

        function saveRoleAccess() {
            pushToast('Perubahan Hak Akses berhasil disimpan!', 'success');
        }

        function backToManajemenPengguna() {
            // Sembunyikan semua konten
            var tabs = ['daftar', 'akses', 'aktifitas'];
            tabs.forEach(function(t) {
                var content = document.getElementById('mp-content-' + t);
                if (content) content.classList.add('hidden');
            });

            // Tampilkan kembali menu container utama
            var menuContainer = document.getElementById('mp-menu-container');
            if (menuContainer) menuContainer.classList.remove('hidden');
        }
        function resetVerifikasiDirty() {
            window.isVerifikasiDirty = false;
        }

        function switchAdminTab(tabId, updateUrl = true) {
            // RBAC Protection
            if (typeof ROLE_MAPPINGS !== 'undefined') {
                var role = localStorage.getItem('userRole') || 'Super Admin';
                var mapping = ROLE_MAPPINGS[role] || ROLE_MAPPINGS['Super Admin'];
                
                // Normalisasi ID untuk pengecekan (misal 'pengaturan-akun' diijinkan jika ada di avatar)
                var allowed = false;
                
                // Dashboard is always allowed for admin roles
                if (tabId === 'dashboard') allowed = true;
                
                if (!allowed && mapping.sidebar.includes(tabId)) allowed = true;
                if (!allowed && mapping.avatar.includes(tabId)) allowed = true;
                
                // Special mapping logic for avatar items to tabIds
                if (!allowed && tabId === 'aktivitas' && mapping.avatar.includes('log-saya')) allowed = true;
                if (!allowed && tabId === 'aktivitas' && mapping.avatar.includes('aktivitas-semua')) allowed = true;
                
                if (!allowed && tabId !== 'verifikasi' && tabId !== 'layanan') {
                    pushToast("Akses Ditolak: Peran Anda (" + role + ") tidak memiliki akses ke menu ini.", "error");
                    return;
                }
            }

            // Berikan peringatan jika user mencoba keluar dari editor layanan
            if (activeAdminTab === 'layanan' && tabId !== 'layanan') {
                askConfirmation(
                    "Tutup Editor?",
                    "Anda sedang berada di mode Editor Layanan. Perubahan yang belum disimpan akan hilang. Apakah Anda yakin ingin berpindah halaman?",
                    function() {
                        executeSwitchAdminTab(tabId, updateUrl);
                    }
                );
                return;
            }
            if (activeAdminTab === 'verifikasi' && tabId !== 'verifikasi' && window.isVerifikasiDirty) {
                askConfirmation(
                    "Batal Verifikasi?",
                    "Anda telah mengubah status atau catatan. Perubahan belum disimpan. Yakin ingin membatalkan?",
                    function() {
                        resetVerifikasiDirty();
                        executeSwitchAdminTab(tabId, updateUrl);
                    }
                );
                return;
            }
            executeSwitchAdminTab(tabId, updateUrl);
        }

        function executeSwitchAdminTab(tabId, updateUrl = true) {
            document.getElementById('subview-admin-dashboard').classList.add('hidden');
            document.getElementById('subview-admin-daftar-layanan').classList.add('hidden');
            document.getElementById('subview-admin-layanan').classList.add('hidden');
            document.getElementById('subview-admin-verifikasi').classList.add('hidden');
            document.getElementById('subview-admin-kontak').classList.add('hidden');
            document.getElementById('subview-admin-beranda').classList.add('hidden');
            document.getElementById('subview-admin-kredensial').classList.add('hidden');
            document.getElementById('subview-admin-laporan').classList.add('hidden');
            document.getElementById('subview-admin-aktivitas').classList.add('hidden');
            document.getElementById('subview-admin-pengaturan-akun').classList.add('hidden');

            const allTabs = ['tab-adm-dashboard', 'tab-adm-pengajuan', 'tab-adm-daftar-layanan', 'tab-adm-kontak', 'tab-adm-beranda', 'tab-adm-kredensial', 'tab-adm-laporan', 'tab-adm-aktivitas'];

            var inactiveClass = "w-full text-left flex items-center px-3 py-2.5 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-semibold text-sm transition-colors";
            var activeClass = "w-full text-left flex items-center px-3 py-2.5 bg-emerald-50 text-narmadaGreen rounded-xl font-bold text-sm transition-colors";

            allTabs.forEach(function(id) {
                var el = document.getElementById(id);
                if (el) el.className = inactiveClass;
            });

            document.getElementById('subview-admin-' + tabId).classList.remove('hidden');
            var activeTabEl = document.getElementById('tab-adm-' + tabId);
            if (activeTabEl) {
                activeTabEl.className = activeClass;
            }

            // Jika di mobile, sembunyikan sidebar setelah klik menu
            if (window.innerWidth < 768) {
                document.getElementById('admin-sidebar').classList.add('hidden');
            }

            activeAdminTab = tabId;

            if (tabId === 'dashboard') {
                document.getElementById('admin-right-column').classList.remove('hidden');
                document.getElementById('admin-main-column').classList.remove('w-full');
                if (!document.getElementById('admin-main-column').className.includes('lg:w-3/4')) {
                    document.getElementById('admin-main-column').className += ' lg:w-3/4';
                }
                fetchAdminStats();
            } else {
                document.getElementById('admin-right-column').classList.add('hidden');
                document.getElementById('admin-main-column').classList.add('w-full');
                document.getElementById('admin-main-column').className = document.getElementById('admin-main-column').className.replace('lg:w-3/4', '').trim();
                
                if (tabId === 'daftar-layanan') {
                    loadBuilderDaftarLayananTab();
                } else if (tabId === 'laporan') {
                    updateLaporanStats();
                } else if (tabId === 'aktivitas') {
                    fetchActivities();
                } else if (tabId === 'pengaturan-akun') {
                    showPengaturanAkunMenu();
                } else if (tabId === 'kredensial') {
                    initManajemenPengguna();
                }
            }

            if (updateUrl) {
                var newUrl = '/admin/' + tabId;
                if (tabId === 'dashboard') {
                    newUrl = '/admin'; // Opsional: /admin/dashboard atau /admin
                }
                window.history.pushState({ tab: tabId }, '', newUrl);
            }
        }

        window.addEventListener('popstate', function(event) {
            if (event.state && event.state.tab) {
                switchAdminTab(event.state.tab, false);
            } else {
                // Parse URL to determine tab
                var path = window.location.pathname;
                if (path.startsWith('/admin/')) {
                    var tab = path.replace('/admin/', '');
                    if (tab) {
                        switchAdminTab(tab, false);
                        return;
                    }
                }
                switchAdminTab('dashboard', false);
            }
        });

        function setStatusFilter(statusVal) {
            activeStatusFilter = statusVal;

            var label = "Semua Berkas";
            if (statusVal === "Menunggu") label = "Menunggu";
            else if (statusVal === "Verifikasi") label = "Verifikasi";
            else if (statusVal === "Selesai") label = "Selesai";
            else if (statusVal === "Perbaikan") label = "Perbaikan";

            document.getElementById('label-active-filter').innerText = label;

            document.getElementById('card-stat-total').className = document.getElementById('card-stat-total').className.replace(' stat-card-active', '');
            document.getElementById('card-stat-menunggu').className = document.getElementById('card-stat-menunggu').className.replace(' stat-card-active', '');
            document.getElementById('card-stat-verifikasi').className = document.getElementById('card-stat-verifikasi').className.replace(' stat-card-active', '');
            document.getElementById('card-stat-selesai').className = document.getElementById('card-stat-selesai').className.replace(' stat-card-active', '');
            document.getElementById('card-stat-perbaikan').className = document.getElementById('card-stat-perbaikan').className.replace(' stat-card-active', '');

            var selectedCardId = 'card-stat-total';
            if (statusVal === 'Menunggu') selectedCardId = 'card-stat-menunggu';
            else if (statusVal === 'Semua') selectedCardId = 'card-stat-semua';
            else if (statusVal === 'Verifikasi') selectedCardId = 'card-stat-verifikasi';
            else if (statusVal === 'Selesai') selectedCardId = 'card-stat-selesai';
            else if (statusVal === 'Perbaikan') selectedCardId = 'card-stat-perbaikan';

            document.getElementById(selectedCardId).className += ' stat-card-active';

            currentAdminPage = 1;
            fetchAdminDashboardData();
        }

        function fetchAdminStats() {
            if (isGoogleEnv) {
                google.script.run
                    .withSuccessHandler(function (stats) {
                        window.lastDashboardStats = stats;
                        renderStatsDashboard(stats);
                        fetchAdminDashboardData();
                        fetchNotifications();
                    })
                    .getDashboardStats();
            } else {

                var mockStats = {
                    total: dummyPengajuanList.length,
                    pending: dummyPengajuanList.filter(r => r.status === "Menunggu").length,
                    verifikasi: dummyPengajuanList.filter(r => r.status === "Verifikasi").length,
                    selesai: dummyPengajuanList.filter(r => r.status === "Selesai" || r.status === "Pelayanan Selesai").length,
                    uploadUlang: dummyPengajuanList.filter(r => r.status === "Perbaikan" || r.status === "Upload Ulang").length
                };
                window.lastDashboardStats = mockStats;
                renderStatsDashboard(mockStats);
                fetchAdminDashboardData();
                fetchNotifications();
            }
        }

        function renderStatsDashboard(stats) {
            document.getElementById('stat-total').innerText = stats.total;
            document.getElementById('stat-menunggu').innerText = stats.pending;
            document.getElementById('stat-verifikasi').innerText = stats.verifikasi;
            document.getElementById('stat-selesai').innerText = stats.selesai;
            document.getElementById('stat-perbaikan').innerText = stats.uploadUlang;
        }

        function fetchUserDashboardData(nik, noReq) {
            var tbody = document.getElementById('table-user-rows');
            if(!tbody) return;
            tbody.innerHTML = getTableSkeleton(4, 3);

            if (isGoogleEnv) {
                try {
                    google.script.run
                        .withSuccessHandler(function (res) { renderUserTable(res); })
                        .getUserDashboardData(nik, noReq);
                } catch (e) { }
            } else {
                var filtered = dummyPengajuanList.filter(function (r) {
                    return (r.nik === nik && r.id === noReq);
                });
                renderUserTable({ data: filtered });
            }
        }

        function fetchAdminDashboardData() {
            var tbody = document.getElementById('table-admin-rows');
            if (!tbody) return;
            tbody.innerHTML = getTableSkeleton(7, 5);

            if (isGoogleEnv) {
                try {
                    google.script.run
                        .withSuccessHandler(function (res) {
                            if (res && res.authError) { pushToast(res.error, "error"); handleAdminLogout(); return; }
                            renderAdminTable(res);
                        })
                        .getAdminDashboardData(localStorage.getItem('adminToken_Narmada'), adminKeyword, currentAdminPage, activeStatusFilter);
                } catch (e) { }
            } else {
                var fKeyword = adminKeyword.toLowerCase().trim();
                var filtered = dummyPengajuanList.filter(function (r) {
                    var matchK = !fKeyword || r.nama.toLowerCase().indexOf(fKeyword) !== -1 || r.id.toLowerCase().indexOf(fKeyword) !== -1 || r.nik.indexOf(fKeyword) !== -1;
                    var matchS = true;
                    if (activeStatusFilter) {
                        if (activeStatusFilter === "Selesai") {
                            matchS = (r.status === "Pelayanan Selesai" || r.status === "Selesai");
                        } else {
                            matchS = (r.status === activeStatusFilter);
                        }
                    }
                    return matchK && matchS;
                });

                var total = filtered.length;
                var limit = 10;
                var pages = Math.max(1, Math.ceil(total / limit));
                var paginated = filtered.slice((currentAdminPage - 1) * limit, currentAdminPage * limit);

                setTimeout(function () {
                    renderAdminTable({ data: paginated, totalPages: pages, currentPage: currentAdminPage, totalItems: total });
                }, 400);
            }
        }

        function renderAdminTable(response) {
            var tbody = document.getElementById('table-admin-rows');
            if (!tbody) return;

            document.getElementById('txt-pagination-info').innerText = "Halaman " + response.currentPage + " dari " + response.totalPages + " (" + response.totalItems + " Berkas)";
            document.getElementById('btn-adm-prev').disabled = response.currentPage <= 1;
            document.getElementById('btn-adm-next').disabled = response.currentPage >= response.totalPages;

            if (!response.data || response.data.length === 0) {
                tbody.innerHTML = "<tr><td colspan='7' class='p-6 text-center text-slate-400 italic'>Tidak ada berkas pelayanan terdaftar dengan kriteria ini.</td></tr>";
                return;
            }

            window.currentAdminData = response.data;
            var htmlBuffer = "";
            var startIndex = (response.currentPage - 1) * 10;

            response.data.forEach(function (row, idx) {
                var rowNo = startIndex + idx + 1;
                var badgeColor = "bg-slate-100 text-slate-600 font-bold border-slate-200";
                if (row.status === "Menunggu") badgeColor = "bg-blue-100 text-blue-700 font-bold border-blue-200";
                else if (row.status === "Verifikasi") badgeColor = "bg-amber-100 text-amber-700 font-bold border-amber-200";
                else if (row.status === "Selesai" || row.status === "Pelayanan Selesai") badgeColor = "bg-emerald-100 text-emerald-700 font-bold border-emerald-200";
                else if (row.status === "Perbaikan" || row.status === "Upload Ulang") badgeColor = "bg-red-100 text-red-700 font-bold border-red-200";

                var cleanWaNum = row.wa.replace('+', '');
                var encodedNote = encodeURIComponent(row.catatan || "");
                var waLink = "https://api.whatsapp.com/send?phone=" + cleanWaNum + "&text=" + encodedNote;

                var linksSplit = row.linkDokumen.split(",").map(function (l) {
                    var p = l.split(":");
                    if (p.length >= 2) {
                        var rawName = p[0].trim();
                        var match = rawName.match(/^\[(.*?)\]\s*(.*)$/);
                        if (match) rawName = match[2];
                        return '<a href="' + p.slice(1).join(":").trim() + '" target="_blank" class="text-blue-600 hover:underline block text-[10px] font-bold"><i class="fa-solid fa-file-image"></i> ' + rawName + '</a>';
                    }
                    return '<span class="text-slate-400 block text-[10px]">' + l + '</span>';
                }).join("");

                var trHtml = '<tr class="hover:bg-emerald-50/50 transition-all border-b border-slate-101">' +
                    '<td class="p-4 text-center font-bold text-slate-500 text-[10px]">' + rowNo + '</td>' +
                    '<td class="p-4">' +
                    '<p class="text-[9px] font-bold text-slate-700 mt-0.5">' + row.tanggal + '</p>' +
                    '<p class="text-[9px] text-slate-500 font-semibold italic mt-0.5"><i class="fa-solid fa-map-location-dot"></i> ' + (row.alamat || "-") + '</p>' +
                    '</td>' +
                    '<td class="p-4">' +
                    '<p class="text-[11px] font-bold text-slate-700">No Req: <span class="font-extrabold text-slate-950">' + row.id + '</span></p>' +
                    '<p class="text-[11px] font-bold text-slate-700 mt-0.5">Nama: ' + row.nama + '</p>' +
                    '<p class="text-[11px] font-bold text-slate-700 mt-0.5">NIK: ' + row.nik + '</p>' +
                    '<p class="text-[10px] text-green-600 font-bold mt-0.5"><i class="fa-brands fa-whatsapp"></i> ' + row.wa + '</p>' +
                    '</td>' +
                    '<td class="p-4"><span class="font-bold text-narmadaGreen text-[11px]">' + row.layanan + '</span></td>' +
                    '<td class="p-4 text-center"><span class="px-2.5 py-1 rounded-full text-[10px] font-bold border ' + badgeColor + '">' + row.status + '</span></td>' +
                    '<td class="p-4 text-center">' +
                    '<div class="flex flex-col gap-1.5 items-center justify-center">' +
                    '<button onclick="openManageStatusModalById(\'' + row.id + '\')" class="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-[10px] transition-all flex items-center justify-center gap-1.5 shadow-sm w-[90px] border border-amber-200">' +
                    '<i class="fa-solid fa-pencil"></i> Edit' +
                    '</button>' +
                    ((row.status === 'Verifikasi' || row.status === 'Pelayanan Selesai' || row.status === 'Selesai') ? 
                        '<button onclick="triggerGeneratePDF(\'' + row.id + '\')" class="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[10px] transition-all flex items-center justify-center gap-1.5 shadow-sm w-[90px] border border-blue-200">' +
                        '<i class="fa-solid fa-file-pdf"></i> PDF' +
                        '</button>' 
                    : '') +
                    '</div>' +
                    '</td>' +
                    '<td class="p-4 text-center">' +
                    '<a href="' + waLink + '" target="_blank" class="px-3 py-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 font-bold text-[10px] transition-all flex items-center justify-center gap-1.5 shadow-sm mx-auto max-w-[100px] border border-green-200">' +
                    '<i class="fa-brands fa-whatsapp text-xs"></i> Kirim WA' +
                    '</a>' +
                    '</td>' +
                    '</tr>';

                htmlBuffer += trHtml;
            });
            tbody.innerHTML = htmlBuffer;
        }

        function triggerGeneratePDF(idPengajuan) {
            pushToast("Mempersiapkan dokumen PDF... Mohon tunggu.", "info");
            if (isGoogleEnv) {
                google.script.run
                    .withSuccessHandler(function (res) {
                        if (res && res.authError) { pushToast(res.message, "error"); handleAdminLogout(); return; }
                        if (res.success) {
                            pushToast(res.message, "success");
                            window.open(res.url, "_blank");
                        } else {
                            pushToast(res.message, "error");
                        }
                    })
                    .generateSuratPDF(localStorage.getItem('adminToken_Narmada'), idPengajuan);
            } else {
                setTimeout(function () {
                    pushToast("SIMULASI: PDF Surat berhasil digenerate.", "success");
                }, 1500);
            }
        }

        function runAdminFilter() {
            adminKeyword = document.getElementById('admin-keyword-filter').value;
            currentAdminPage = 1;
            fetchAdminDashboardData();
        }

        function moveAdminPage(offset) {
            currentAdminPage += offset;
            fetchAdminDashboardData();
        }

        function openManageStatusModalById(id) {
            if (!window.currentAdminData) return;
            var row = window.currentAdminData.find(function (item) {
                return item.id === id;
            });
            if (!row) return;

            document.getElementById('edit-status-id').value = row.id;
            
            var keperluanEl = document.getElementById('info-modal-keperluan');
            if(keperluanEl) {
                keperluanEl.innerHTML = "<div class='text-[15px] font-extrabold text-slate-800 leading-tight'>" + row.id + "</div>" +
                                        "<div class='text-[13px] font-bold text-slate-700 leading-tight mt-0.5'>" + row.nama + "</div>" +
                                        "<div class='text-[12px] font-semibold text-narmadaGreen leading-tight mt-0.5'>" + row.layanan + "</div>";
            }
            
            var jawabanFormatted = "<div class='space-y-1 pt-1'>";
            
            if (row.detailLayanan && row.detailLayanan !== "-") {
                var matchedLayanan = window.loadedLayananList ? window.loadedLayananList.find(l => l.nama === row.layanan) : null;
                var qMap = {};
                var items = row.detailLayanan.split(" | ");
                
                var submittedKeperluan = "Wajib";
                items.forEach(function(item) {
                    var colon = item.indexOf(":");
                    if (colon > -1) {
                        var q = item.substring(0, colon).trim();
                        var a = item.substring(colon + 1).trim();
                        if (q === "Keperluan Surat") {
                            submittedKeperluan = a;
                        }
                    }
                });

                // Badge Keperluan Surat
                if (submittedKeperluan && submittedKeperluan !== "Wajib") {
                    jawabanFormatted += "<div class='flex items-center gap-2 mb-2'><span class='inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-bold border border-emerald-200'><i class='fa-solid fa-tag'></i> Keperluan: " + submittedKeperluan + "</span></div>";
                }

                items.forEach(function(item) {
                    var colon = item.indexOf(":");
                    if (colon > -1) {
                        var q = item.substring(0, colon).trim();
                        var a = item.substring(colon + 1).trim();
                        
                        // Skip Keperluan Surat (sudah ditampilkan sebagai badge)
                        if (q === "Keperluan Surat") return;
                        
                        var keperluan = "Wajib";
                        var categoryKey = "Data Pemohon";
                        var order = 999;
                        if (matchedLayanan && matchedLayanan.fields) {
                            var fieldMatches = matchedLayanan.fields.filter(function(f) {
                                return f.label === q || parseQuestionMetadata(f.name).cleanName === q;
                            });
                            
                            if (fieldMatches.length > 0) {
                                var bestMatch = fieldMatches.find(function(f) {
                                    return parseQuestionMetadata(f.name).keperluan === submittedKeperluan;
                                }) || fieldMatches.find(function(f) {
                                    return parseQuestionMetadata(f.name).keperluan === "Wajib";
                                }) || fieldMatches[0];
                                
                                order = matchedLayanan.fields.indexOf(bestMatch);
                                var parsed = parseQuestionMetadata(bestMatch.name);
                                if (parsed.keperluan && parsed.keperluan !== "Wajib") {
                                    keperluan = parsed.keperluan;
                                    categoryKey = parsed.judul || parsed.keperluan.replace(/^TAMBAHAN:\s*/i, '');
                                } else if (parsed.judul) {
                                    categoryKey = parsed.judul;
                                }
                            }
                        }
                        
                        // Jika isian ini berulang (memiliki titik koma), gabungkan paksa ke satu grup
                        if (a && a.match(/\s*;\s*/)) {
                            categoryKey = submittedKeperluan || "Data Tambahan";
                        }
                        
                        if (!qMap[categoryKey]) qMap[categoryKey] = [];
                        qMap[categoryKey].push({q: q, a: a, order: order});
                    } else {
                        if (!qMap["Data Pemohon"]) qMap["Data Pemohon"] = [];
                        qMap["Data Pemohon"].push({q: item, a: "", order: 999});
                    }
                });
                
                Object.keys(qMap).forEach(function(k) {
                    qMap[k].sort(function(a, b) { return a.order - b.order; });
                    var groupName = k;
                    var groupIcon = (groupName === 'Data Pemohon') ? 'fa-solid fa-user' : 'fa-solid fa-clipboard-list';
                    jawabanFormatted += "<div class='mb-3'>";
                    jawabanFormatted += "<h6 class='font-bold text-slate-800 mb-1.5 text-[12px] border-b border-slate-200 pb-1 mt-3 flex items-center gap-1.5'><i class='" + groupIcon + " text-narmadaGreen text-[10px]'></i> " + groupName + "</h6>";
                    jawabanFormatted += "<div class='grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-[10px] text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100 mb-1'>";
                    
                    var isRepeatedGroup = false;
                    var maxRepeats = 1;
                    qMap[k].forEach(function(qa) {
                        if (qa.a && qa.a.match(/\s*;\s*/)) {
                            isRepeatedGroup = true;
                            var parts = qa.a.split(/\s*;\s*/);
                            if (parts.length > maxRepeats) maxRepeats = parts.length;
                        }
                    });

                    if (isRepeatedGroup) {
                        for (var i = 0; i < maxRepeats; i++) {
                            if (i > 0) {
                                jawabanFormatted += "<div class='col-span-2 border-t border-dashed border-slate-300 mt-3 pt-3 mb-1'><span class='font-bold text-slate-600 text-[10px] bg-slate-200 px-2 py-1 rounded-md'>" + groupName + " Ke-" + (i + 1) + "</span></div>";
                            }
                            qMap[k].forEach(function(qa) {
                                var parts = qa.a ? qa.a.split(/\s*;\s*/) : [];
                                var val = parts[i] || "-";
                                jawabanFormatted += "<div class='font-bold flex items-start whitespace-nowrap mt-0.5'><span>" + qa.q + "</span></div><div class='font-extrabold text-slate-900 break-words mt-0.5 flex gap-1'><span>:</span> <div class='flex-1'>" + val + "</div></div>";
                            });
                        }
                    } else {
                        qMap[k].forEach(function(qa) {
                            if (qa.a && qa.a !== "" && qa.a !== "-") {
                                jawabanFormatted += "<div class='font-bold flex items-start whitespace-nowrap mt-0.5'><span>" + qa.q + "</span></div><div class='font-extrabold text-slate-900 break-words mt-0.5 flex gap-1'><span>:</span> <div class='flex-1'>" + qa.a + "</div></div>";
                            }
                        });
                    }
                    jawabanFormatted += "</div></div>";
                });
            } else {
                jawabanFormatted += "<p class='text-slate-400 italic text-[10px] pt-1'>Tidak ada isian tambahan.</p>";
            }
            jawabanFormatted += "</div>";
            document.getElementById('info-modal-jawaban').innerHTML = jawabanFormatted;

            document.getElementById('edit-status-select').value = row.status;
            document.getElementById('edit-status-catatan').value = row.catatan === "-" ? "" : row.catatan;

            renderChecklistTable(row.linkDokumen, row.nama, row.id, row.layanan);

            resetVerifikasiDirty();
            switchAdminTab('verifikasi');
        }

        function closeManageStatusModal() {
            if (window.isVerifikasiDirty) {
                askConfirmation(
                    "Batal Verifikasi?",
                    "Anda telah mengubah status atau catatan. Perubahan belum disimpan. Yakin ingin membatalkan?",
                    function() {
                        resetVerifikasiDirty();
                        switchAdminTab('dashboard');
                    }
                );
            } else {
                switchAdminTab('dashboard');
            }
        }

        function renderChecklistTable(rawLinks, nama, id, layanan) {
            var tbody = document.getElementById('modal-checklist-rows');
            tbody.innerHTML = "";

            var linksArray = rawLinks.split(",");
            window.activeVerifFiles = [];

            linksArray.forEach(function (item, idx) {
                var p = item.split(":");
                if (p.length >= 2) {
                    var labelName = p[0].trim();
                    var match = labelName.match(/^\[(.*?)\]\s*(.*)$/);
                    if (match) labelName = match[2];
                    
                    window.activeVerifFiles.push({ name: labelName });

                    var fileUrl = p.slice(1).join(":").trim();
                    var previewUrl = fileUrl;
                    
                    if (fileUrl.includes('drive.google.com/open?id=')) {
                        var idMatch = fileUrl.match(/id=([a-zA-Z0-9_-]+)/);
                        if (idMatch) {
                            previewUrl = 'https://drive.google.com/uc?export=view&id=' + idMatch[1];
                        }
                    } else if (fileUrl.includes('drive.google.com/file/d/')) {
                        var idMatch2 = fileUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
                        if (idMatch2) {
                            previewUrl = 'https://drive.google.com/uc?export=view&id=' + idMatch2[1];
                        }
                    }

                    var card = '<div class="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">' +
                        '<div class="flex justify-between items-start mb-2">' +
                        '<h6 class="text-[10px] font-bold text-slate-800 leading-tight pr-2">' + labelName + '</h6>' +
                        '<a href="' + fileUrl + '" target="_blank" class="text-narmadaGreen hover:text-narmadaGreen-dark" title="Buka berkas di tab baru"><i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i></a>' +
                        '</div>' +
                        '<div class="relative group cursor-zoom-in mb-2 bg-slate-100 rounded-lg overflow-hidden border border-slate-200" onclick="openLightbox(\'' + previewUrl + '\', \'' + labelName.replace(/'/g, "\\'") + '\')">' +
                        '<img src="' + previewUrl + '" class="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105" alt="Berkas" onerror="this.onerror=null; this.src=\'https://placehold.co/400x300/e2e8f0/64748b?text=Berkas+Tidak+Ditemukan\';">' +
                        '<div class="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-all flex items-center justify-center">' +
                        '<i class="fa-solid fa-expand text-white opacity-0 group-hover:opacity-100 text-2xl drop-shadow-md transition-opacity"></i>' +
                        '</div>' +
                        '</div>' +
                        '<div class="grid grid-cols-2 gap-2">' +
                        '<label class="cursor-pointer">' +
                        '<input type="radio" name="verif_radio_' + idx + '" value="Sesuai" checked onchange="calculateAutoVerificationResult(\'' + nama + '\', \'' + id + '\', \'' + layanan + '\')" class="peer sr-only">' +
                        '<div class="py-2 px-1 rounded-lg border border-slate-200 bg-white peer-checked:bg-emerald-50 peer-checked:border-emerald-500 peer-checked:text-emerald-700 text-center text-[10px] font-bold transition-all text-slate-500 hover:bg-slate-50">' +
                        '<i class="fa-solid fa-check mr-1"></i> Sesuai' +
                        '</div>' +
                        '</label>' +
                        '<label class="cursor-pointer">' +
                        '<input type="radio" name="verif_radio_' + idx + '" value="Tidak Sesuai" onchange="calculateAutoVerificationResult(\'' + nama + '\', \'' + id + '\', \'' + layanan + '\')" class="peer sr-only">' +
                        '<div class="py-2 px-1 rounded-lg border border-slate-200 bg-white peer-checked:bg-rose-50 peer-checked:border-rose-500 peer-checked:text-rose-700 text-center text-[10px] font-bold transition-all text-slate-500 hover:bg-slate-50">' +
                        '<i class="fa-solid fa-xmark mr-1"></i> Tidak Sesuai' +
                        '</div>' +
                        '</label>' +
                        '</div>' +
                        '</div>';

                    tbody.innerHTML += card;
                }
            });

            calculateAutoVerificationResult(nama, id, layanan);
        }

        function calculateAutoVerificationResult(nama, id, layanan) {
            var fileCount = window.activeVerifFiles ? window.activeVerifFiles.length : 0;
            var brokenFiles = [];

            for (var i = 0; i < fileCount; i++) {
                var radios = document.getElementsByName('verif_radio_' + i);
                var chosenVal = "Sesuai";
                for (var j = 0; j < radios.length; j++) {
                    if (radios[j].checked) chosenVal = radios[j].value;
                }

                if (chosenVal === "Tidak Sesuai") {
                    brokenFiles.push(window.activeVerifFiles[i].name);
                }
            }

            var selectStatus = document.getElementById('edit-status-select');
            var textNotes = document.getElementById('edit-status-catatan');

            if (brokenFiles.length > 0) {
                selectStatus.value = "Perbaikan";
                var filesBullet = brokenFiles.join(", ");
                textNotes.value = "Halo Bapak/Ibu *" + nama + "*, permohonan *" + layanan + "* dengan ID *" + id + "* belum lengkap. " +
                    "Mohon lakukan unggah ulang dokumen berkas berikut: *" + filesBullet + "*, karena foto dokumen yang dikirim buram atau tidak sesuai. " +
                    "Silakan buka menu 'Cek Status' di website resmi kami untuk melakukan upload ulang tanpa harus mengetik ulang nama berkas. Terima kasih.";
            } else {
                selectStatus.value = "Selesai";
                textNotes.value = "Halo Bapak/Ibu *" + nama + "*, berkas pengajuan *" + layanan + "* dengan ID *" + id + "* telah diperiksa dan dinyatakan LENGKAP & SESUAI. " +
                    "Surat pelayanan Anda kini sudah selesai diproses dan siap diserahterimakan di kantor desa. Terima kasih.";
            }
        }

        function confirmSaveVerification() {
            askConfirmation(
                "Konfirmasi Verifikasi",
                "Apakah Anda yakin ingin menyimpan hasil verifikasi berkas ini?",
                function() {
                    executeAdminStatusUpdate();
                }
            );
        }

        function executeAdminStatusUpdate() {
            var id = document.getElementById('edit-status-id').value;
            var nextStat = document.getElementById('edit-status-select').value;
            var nextNotes = document.getElementById('edit-status-catatan').value.trim();

            if (isGoogleEnv) {
                try {
                    google.script.run
                        .withSuccessHandler(function (res) {
                            if (res && res.authError) { pushToast(res.message, "error"); handleAdminLogout(); return; }
                            if (res.success) {
                                pushToast(res.message, "success");
                                resetVerifikasiDirty();
                                switchAdminTab('dashboard');
                                fetchAdminStats();
                            }
                        })
                        .updatePengajuanStatus(localStorage.getItem('adminToken_Narmada'), id, nextStat, nextNotes);
                } catch (e) { }
            } else {
                var findIdx = dummyPengajuanList.findIndex(function (r) { return r.id === id; });
                if (findIdx !== -1) {
                    dummyPengajuanList[findIdx].status = nextStat;
                    dummyPengajuanList[findIdx].catatan = nextNotes || "-";
                    pushToast("SIMULASI: Status berkas diperbarui.", "success");
                    resetVerifikasiDirty();
                    switchAdminTab('dashboard');
                    fetchAdminStats();
                }
            }
        }

        
        function openLayananEditor(id) {
            document.getElementById('subview-admin-daftar-layanan').classList.add('hidden');
            document.getElementById('subview-admin-layanan').classList.remove('hidden');
            if(id === '__NEW__') {
                document.getElementById('builder-select-layanan').value = '[+] TAMBAH LAYANAN BARU';
            } else {
                document.getElementById('builder-select-layanan').value = id;
            }
            handleBuilderLayananLoad();
        }

        function closeLayananEditor() {
            document.getElementById('subview-admin-layanan').classList.add('hidden');
            document.getElementById('subview-admin-daftar-layanan').classList.remove('hidden');
        }

        function initStep2RequirementsBuilder() {
            var selKeperluan = document.getElementById('builder-req-keperluan');
            selKeperluan.innerHTML = '';
            var mainSelect = document.getElementById('builder-keperluan-select');
            var hasOptions = false;

            for (var i = 0; i < mainSelect.options.length; i++) {
                var val = mainSelect.options[i].value;
                if (val && val !== "__ADD_NEW__") {
                    selKeperluan.innerHTML += '<option value="' + val + '">' + val + '</option>';
                    hasOptions = true;
                }
            }

            if (!hasOptions) {
                selKeperluan.innerHTML = '<option value="Wajib">Wajib (Berlaku untuk Semua Keperluan)</option>';
            } else {
                var o = document.createElement('option');
                o.value = "Wajib";
                o.text = "Wajib (Berlaku untuk Semua Keperluan)";
                selKeperluan.add(o, selKeperluan.options[0]);
            }

            // Persyaratan sekarang menggunakan input teks dinamis dengan datalist
            var reqInput = document.getElementById('builder-req-input');
            if (reqInput) reqInput.value = '';

            renderRequirementsMappingList();
        }

        function initStep3QuestionsBuilder() {
            var selKeperluan = document.getElementById('builder-q-keperluan');
            var repKeperluan = document.getElementById('builder-repeater-keperluan');
            selKeperluan.innerHTML = '<option value="Wajib">Wajib (Berlaku Semua Keperluan)</option>';
            if (repKeperluan) repKeperluan.innerHTML = '<option value="Wajib">Wajib (Berlaku Semua Keperluan)</option>';
            var mainSelect = document.getElementById('builder-keperluan-select');

            for (var i = 0; i < mainSelect.options.length; i++) {
                var val = mainSelect.options[i].value;
                if (val && val !== "__ADD_NEW__") {
                    selKeperluan.innerHTML += '<option value="' + val + '">' + val + '</option>';
                    if (repKeperluan) repKeperluan.innerHTML += '<option value="' + val + '">' + val + '</option>';
                }
            }
            populateBuilderRepeaterSelect();
        }

        function addRequirementToKeperluan() {
            var keperluan = document.getElementById('builder-req-keperluan').value;
            var reqInput = document.getElementById('builder-req-input');
            var reqName = reqInput.value.trim();

            if (!reqName) {
                pushToast("Ketik atau pilih nama persyaratan!", "error");
                return;
            }

            if (!builderReqMap[keperluan]) {
                builderReqMap[keperluan] = [];
            }

            if (!builderReqMap[keperluan].includes(reqName)) {
                builderReqMap[keperluan].push(reqName);
                renderRequirementsMappingList();
                reqInput.value = '';
                pushToast("Persyaratan ditambahkan ke '" + keperluan + "'", "success");
            } else {
                pushToast("Persyaratan ini sudah ada di keperluan tersebut!", "error");
            }
        }

        function removeRequirementFromKeperluan(keperluan, index) {
            if (builderReqMap[keperluan]) {
                builderReqMap[keperluan].splice(index, 1);
                if (builderReqMap[keperluan].length === 0) {
                    delete builderReqMap[keperluan];
                }
                renderRequirementsMappingList();
            }
        }

        function renderRequirementsMappingList() {
            var container = document.getElementById('builder-req-mapping-list');
            container.innerHTML = "";

            var keys = Object.keys(builderReqMap);
            if (keys.length === 0) {
                container.innerHTML = '<p class="text-[10px] text-slate-400 italic">Belum ada persyaratan yang ditambahkan.</p>';
                return;
            }

            keys.forEach(function (kep) {
                var html = '<div class="bg-white border border-slate-200 rounded-xl p-3 shadow-sm text-left mb-2">' +
                    '<h5 class="text-[10px] font-extrabold text-narmadaGreen mb-2 border-b pb-1 flex items-center gap-1.5"><i class="fa-solid fa-folder-open"></i> Keperluan: ' + kep + '</h5>' +
                    '<div class="space-y-1.5 pl-1">';

                builderReqMap[kep].forEach(function (req, idx) {
                    html += '<div class="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-101 text-[10px] font-semibold text-slate-700">' +
                        '<span><i class="fa-solid fa-check text-emerald-500 mr-1"></i> ' + req + '</span>' +
                        '<button onclick="removeRequirementFromKeperluan(\'' + kep + '\', ' + idx + ')" class="text-red-500 hover:text-red-700 px-1 bg-white border border-slate-200 rounded shadow-sm"><i class="fa-solid fa-xmark"></i></button>' +
                        '</div>';
                });

                html += '</div></div>';
                container.innerHTML += html;
            });
        }

        function loadBuilderLayananList() {
            var dropdownEditor = document.getElementById('builder-select-layanan');
            if (!dropdownEditor) return;
            dropdownEditor.innerHTML = '<option value="[+] TAMBAH LAYANAN BARU">[+] TAMBAH LAYANAN BARU</option>';

            var layHandler = function (list) {
                window.loadedLayananList = list; // Update dari Layanan Aktif
                list.forEach(function (row) {
                    dropdownEditor.innerHTML += '<option value="' + row.nama + '">' + row.nama + '</option>';
                });
                extractSuggestions(list);
            };

            if (isGoogleEnv) {
                try {
                    google.script.run.withSuccessHandler(layHandler).getLayananList();
                } catch (e) {
                    layHandler(dummyLayananList);
                }
            } else {
                layHandler(dummyLayananList);
            }
        }

        function extractSuggestions(list) {
            var nameSet = new Set();
            var reqSet = new Set();
            list.forEach(function (layanan) {
                if (layanan.nama) nameSet.add(layanan.nama);
                if (layanan.persyaratan) {
                    try {
                        var reqObj = JSON.parse(layanan.persyaratan);
                        Object.keys(reqObj).forEach(function(kep) {
                            reqObj[kep].forEach(function(req) {
                                reqSet.add(req);
                            });
                        });
                    } catch(e) {}
                }
            });

            var nameDatalist = document.getElementById('saran-nama-layanan');
            if (nameDatalist) {
                nameDatalist.innerHTML = '';
                nameSet.forEach(function(n) {
                    var opt = document.createElement('option');
                    opt.value = n;
                    nameDatalist.appendChild(opt);
                });
            }

            var reqDatalist = document.getElementById('saran-persyaratan-list');
            if (reqDatalist) {
                reqDatalist.innerHTML = '';
                reqSet.forEach(function(r) {
                    var opt = document.createElement('option');
                    opt.value = r;
                    reqDatalist.appendChild(opt);
                });
            }

            var reqSuggestions = document.getElementById('builder-req-suggestions');
            if (reqSuggestions) {
                reqSuggestions.innerHTML = '';
                reqSet.forEach(function(r) {
                    var btn = document.createElement('button');
                    btn.type = 'button';
                    btn.className = 'px-2 py-1 bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 rounded text-[10px] font-semibold border border-slate-200 transition-colors cursor-pointer';
                    btn.innerText = r;
                    btn.onclick = function() {
                        var input = document.getElementById('builder-req-input');
                        if(input) {
                            input.value = r;
                            addRequirementToKeperluan();
                        }
                    };
                    reqSuggestions.appendChild(btn);
                });
            }
        }

        function handleBuilderLayananLoad() {
            var selectVal = document.getElementById('builder-select-layanan').value;
            if (selectVal === "[+] TAMBAH LAYANAN BARU") {
                resetBuilderFormState();
                return;
            }

            var list = window.loadedLayananList || dummyLayananList;
            var found = list.find(l => l.nama === selectVal);

            if (found) {
                populateBuilderLayananToEdit(found.id);
            } else {
                resetBuilderFormState();
                document.getElementById('builder-select-layanan').value = selectVal;
                document.getElementById('builder-layanan-nama').value = selectVal;
                document.getElementById('wrapper-builder-nama').classList.add('hidden');
            }
        }
        function handleKeperluanSelectChange() {
            var select = document.getElementById('builder-keperluan-select');
            var wrapper = document.getElementById('wrapper-new-keperluan');
            if (select.value === "__ADD_NEW__") {
                wrapper.classList.remove('hidden');
                document.getElementById('builder-keperluan-new-input').focus();
            } else {
                wrapper.classList.add('hidden');
            }
        }

        function saveNewKeperluanOption() {
            var input = document.getElementById('builder-keperluan-new-input');
            var val = input.value.trim();
            if (!val) {
                pushToast("Ketik opsi keperluan terlebih dahulu!", "error");
                return;
            }

            var select = document.getElementById('builder-keperluan-select');

            for (var i = 0; i < select.options.length; i++) {
                if (select.options[i].value.toLowerCase() === val.toLowerCase()) {
                    pushToast("Opsi keperluan '" + val + "' sudah terdaftar!", "error");
                    return;
                }
            }

            var opt = document.createElement('option');
            opt.value = val;
            opt.text = val;

            select.add(opt, select.options[select.options.length - 1]);
            select.value = val;

            input.value = "";
            document.getElementById('wrapper-new-keperluan').classList.add('hidden');
            pushToast("Keperluan '" + val + "' berhasil ditambahkan!", "success");
        }

        function cancelNewKeperluanOption() {
            document.getElementById('builder-keperluan-new-input').value = "";
            document.getElementById('wrapper-new-keperluan').classList.add('hidden');
            document.getElementById('builder-keperluan-select').value = "";
        }

        function deleteSelectedKeperluanOption() {
            var select = document.getElementById('builder-keperluan-select');
            var val = select.value;
            if (!val || val === "__ADD_NEW__") {
                pushToast("Pilih salah satu opsi keperluan yang ingin dihapus!", "error");
                return;
            }

            askConfirmation("Hapus Opsi Keperluan", "Apakah Anda yakin ingin menghapus opsi keperluan '" + val + "'?", function () {
                select.remove(select.selectedIndex);
                select.value = "";
                pushToast("Opsi keperluan telah dihapus.", "success");
            });
        }

        function runLayananFilter() {
            var keyword = document.getElementById('admin-layanan-keyword-filter').value.toLowerCase().trim();
            var list = window.loadedLayananList || [];
            
            if (!keyword) {
                renderLayananTable(list);
                return;
            }

            var filtered = list.filter(function (row) {
                return row.nama.toLowerCase().indexOf(keyword) !== -1;
            });
            renderLayananTable(filtered);
        }

        function renderLayananTable(list) {
            var listContainer = document.getElementById('standalone-active-services-list');
            var totalBadge = document.getElementById('txt-total-layanan-aktif');
            if (!listContainer) return;
            
            listContainer.innerHTML = "";

            if (totalBadge) totalBadge.innerText = list.length + " Layanan";

            if (!list || list.length === 0) {
                listContainer.innerHTML = '<tr><td colspan="6" class="p-6 text-center text-slate-400 italic">Belum ada pelayanan aktif terdaftar.</td></tr>';
                return;
            }

            var htmlBuffer = "";
            list.forEach(function (row, index) {
                var keperluanList = row.judulSectionIsian ? row.judulSectionIsian.split(',').map(s => s.trim()).filter(s => s) : [];
                var kepHtml = keperluanList.length > 0
                    ? '<ul class="list-disc pl-3 text-[9px] space-y-0.5 text-slate-600"><li>' + keperluanList.join('</li><li>') + '</li></ul>'
                    : '<span class="text-slate-400 italic text-[9px]">Wajib (Tanpa Pilihan)</span>';

                var reqMap = {};
                (row.requirements || []).forEach(function (r) {
                    var cleanName = r.name;
                    var kep = "Wajib";
                    var match = cleanName.match(/^\[(.*?)\]\s*(.*)$/);
                    if (match) { kep = match[1]; cleanName = match[2]; }
                    if (!reqMap[kep]) reqMap[kep] = [];
                    reqMap[kep].push(cleanName);
                });
                var docHtml = "";
                Object.keys(reqMap).forEach(k => {
                    docHtml += '<p class="text-[9px] font-bold text-slate-700 mt-1 mb-0.5">' + (k === "Wajib" ? "DOKUMEN WAJIB" : "TAMBAHAN: " + k) + '</p>';
                    docHtml += '<ul class="list-disc pl-3 text-[9px] space-y-0.5 text-slate-600"><li>' + reqMap[k].join('</li><li>') + '</li></ul>';
                });
                if (docHtml === "") docHtml = '<span class="text-slate-400 italic text-[9px]">Tanpa lampiran</span>';

                var qMap = {};
                (row.fields || []).forEach(function (f) {
                    var meta = parseQuestionMetadata(f.name);
                    if (!qMap[meta.keperluan]) qMap[meta.keperluan] = [];
                    var typeStr = f.type === 'dropdown' ? ' (Dropdown)' :
                        f.type === 'number' ? ' (Angka)' :
                            f.type === 'date' ? ' (Tanggal)' : ' (Teks)';
                    qMap[meta.keperluan].push(meta.cleanName + typeStr);
                });
                var qHtml = "";
                Object.keys(qMap).forEach(k => {
                    qHtml += '<p class="text-[9px] font-bold text-slate-700 mt-1 mb-0.5">' + (k === "Wajib" ? "ISIAN UMUM" : "TAMBAHAN: " + k) + '</p>';
                    qHtml += '<ul class="list-disc pl-3 text-[9px] space-y-0.5 text-slate-600"><li>' + qMap[k].join('</li><li>') + '</li></ul>';
                });
                if (qHtml === "") qHtml = '<span class="text-slate-400 italic text-[9px]">Tanpa pertanyaan</span>';

                var tr = '<tr class="hover:bg-slate-50 transition-all group">' +
                    '<td class="p-3 text-center text-xs font-bold text-slate-500">' + (index + 1) + '</td>' +
                    '<td class="p-3 font-extrabold text-xs text-slate-800">' + row.nama + '</td>' +
                    '<td class="p-3 align-top">' + kepHtml + '</td>' +
                    '<td class="p-3 align-top">' + docHtml + '</td>' +
                    '<td class="p-3 align-top">' + qHtml + '</td>' +
                    '<td class="p-3 text-center align-middle">' +
                    '<div class="flex flex-col gap-1.5 items-center justify-center">' +
                    '<button onclick="switchAdminTab(\'layanan\'); populateBuilderLayananToEdit(\'' + row.id + '\')" class="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-[10px] transition-all flex items-center justify-center gap-1.5 shadow-sm w-[90px] border border-amber-200">' +
                    '<i class="fa-solid fa-pencil"></i> Edit' +
                    '</button>' +
                    '<button onclick="deleteBuilderMasterLayanan(\'' + row.nama + '\')" class="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-bold text-[10px] transition-all flex items-center justify-center gap-1.5 shadow-sm w-[90px] border border-red-200">' +
                    '<i class="fa-solid fa-trash"></i> Hapus' +
                    '</button>' +
                    '</div>' +
                    '</td>' +
                    '</tr>';
                htmlBuffer += tr;
            });
            listContainer.innerHTML = htmlBuffer;
        }

        function loadBuilderDaftarLayananTab() {
            var listContainer = document.getElementById('standalone-active-services-list');
            if (!listContainer) return;
            listContainer.innerHTML = getTableSkeleton(5, 5);

            var successHandler = function (list) {
                window.loadedLayananList = list;
                
                var keywordInput = document.getElementById('admin-layanan-keyword-filter');
                if (keywordInput && keywordInput.value.trim() !== "") {
                    runLayananFilter();
                } else {
                    renderLayananTable(list);
                }
            };

            if (isGoogleEnv) {
                google.script.run.withSuccessHandler(successHandler).getLayananList();
            } else {
                setTimeout(function () { successHandler(dummyLayananList); }, 200);
            }
        }

        function populateBuilderLayananToEdit(id) {
            var list = window.loadedLayananList || dummyLayananList;
            var found = list.find(l => l.id === id);
            if (!found) return;

            document.getElementById('builder-select-layanan').value = found.nama;
            document.getElementById('wrapper-builder-nama').classList.add('hidden');
            document.getElementById('builder-layanan-nama').value = found.nama;
            document.getElementById('builder-template-doc-id').value = found.templateDocId || "";

            var selectKeperluan = document.getElementById('builder-keperluan-select');
            selectKeperluan.innerHTML = '<option value="">-- Pilih atau Tambah Keperluan --</option>' +
                '<option value="__ADD_NEW__" class="font-extrabold text-emerald-600">[+] TAMBAH KEPERLUAN BARU...</option>';

            var optionsStr = found.judulSectionIsian || "";
            if (optionsStr) {
                var optionsArray = optionsStr.split(",");
                optionsArray.forEach(function (opt) {
                    var cleanOpt = opt.trim();
                    if (cleanOpt) {
                        var o = document.createElement('option');
                        o.value = cleanOpt;
                        o.text = cleanOpt;
                        selectKeperluan.add(o, selectKeperluan.options[selectKeperluan.options.length - 1]);
                    }
                });
            }

            builderQuestions = [];
            (found.fields || []).forEach(function (f) {
                var displayType = f.type;
                var actualName = f.name;
                var typeMatch = actualName.match(/(.*)\s*\|\|(number|date)\|\|$/);
                if (typeMatch) {
                    displayType = typeMatch[2];
                    actualName = typeMatch[1].trim();
                }

                builderQuestions.push({
                    id: f.id,
                    label: f.label || actualName,
                    name: actualName,
                    type: displayType,
                    options: f.options || "",
                    required: f.required || "ya"
                });
            });

            builderReqMap = {};
            (found.requirements || []).forEach(function (req) {
                var match = req.name.match(/^\[(.*?)\]\s*(.*)$/);
                if (match) {
                    var kep = match[1];
                    var reqName = match[2];
                    if (!builderReqMap[kep]) builderReqMap[kep] = [];
                    builderReqMap[kep].push(reqName);
                } else {
                    if (!builderReqMap["Wajib"]) builderReqMap["Wajib"] = [];
                    builderReqMap["Wajib"].push(req.name);
                }
            });

            renderBuilderQuestionsUIList();
            pushToast("Konfigurasi '" + found.nama + "' berhasil dimuat.", "info");
            initStep2RequirementsBuilder();
            initStep3QuestionsBuilder();
        }

        var currentRepeaterGroup = [];
        var editingRepeaterIndex = -1;

        function toggleBuilderOptionInput() {
            var type = document.getElementById('builder-q-type').value;
            var wrapperOpt = document.getElementById('wrapper-q-options');
            var wrapperLim = document.getElementById('wrapper-q-limit');

            wrapperOpt.classList.add('hidden');
            if (wrapperLim) wrapperLim.classList.add('hidden');

            if (type === "dropdown") {
                wrapperOpt.classList.remove('hidden');
            } else if (type === "number" && wrapperLim) {
                wrapperLim.classList.remove('hidden');
            }
        }
        
        function populateBuilderRepeaterSelect() {
            var selRep = document.getElementById('builder-repeater-select');
            var repKeperluan = document.getElementById('builder-repeater-keperluan') ? document.getElementById('builder-repeater-keperluan').value : "Wajib";
            if (selRep) {
                selRep.innerHTML = '<option value="">-- Pilih Pertanyaan Tunggal --</option>';
                builderQuestions.forEach(function (q, idx) {
                    if (q.type === "repeater") return;
                    var meta = parseQuestionMetadata(q.name);
                    var k = meta.keperluan || "Wajib";
                    if (k === repKeperluan) {
                        var optHtml = '<option value="' + idx + '">[' + k + '] ' + meta.cleanName + '</option>';
                        selRep.innerHTML += optHtml;
                    }
                });
            }
        }

        function addQuestionToRepeaterTempList() {
            var sel = document.getElementById('builder-repeater-select');
            var val = sel.value;
            if (val === "") {
                pushToast("Silakan pilih pertanyaan terlebih dahulu!", "error");
                return;
            }
            var idx = parseInt(val);
            var q = builderQuestions[idx];
            
            if (currentRepeaterGroup.some(item => item.id === q.id)) {
                pushToast("Pertanyaan ini sudah ada di dalam grup!", "error");
                return;
            }
            
            currentRepeaterGroup.push(q);
            renderRepeaterTempList();
        }

        function renderRepeaterTempList() {
            var container = document.getElementById('builder-repeater-temp-list');
            if (!container) return;
            
            if (currentRepeaterGroup.length === 0) {
                container.innerHTML = '<div class="text-center text-[10px] text-slate-400 italic py-2">Belum ada pertanyaan dipilih.</div>';
                return;
            }
            
            var html = '';
            currentRepeaterGroup.forEach(function(q, i) {
                var meta = parseQuestionMetadata(q.name);
                html += '<div class="flex items-center justify-between p-2 rounded-lg border border-slate-200 bg-slate-50 text-[10px] font-semibold text-slate-700">' +
                    '<div class="flex gap-2 items-center">' +
                        '<span class="text-indigo-500 font-extrabold w-4">' + (i + 1) + '.</span>' +
                        '<span>[' + meta.keperluan + '] ' + meta.cleanName + '</span>' +
                    '</div>' +
                    '<div class="flex gap-1">' +
                        '<button type="button" onclick="moveRepeaterTempItem(' + i + ', -1)" class="px-2 py-1 bg-white hover:bg-slate-100 border rounded text-slate-500 shadow-sm"><i class="fa-solid fa-arrow-up"></i></button>' +
                        '<button type="button" onclick="moveRepeaterTempItem(' + i + ', 1)" class="px-2 py-1 bg-white hover:bg-slate-100 border rounded text-slate-500 shadow-sm"><i class="fa-solid fa-arrow-down"></i></button>' +
                        '<button type="button" onclick="removeRepeaterTempItem(' + i + ')" class="px-2 py-1 bg-red-50 hover:bg-red-100 border border-red-200 rounded text-red-500 ml-2 shadow-sm"><i class="fa-solid fa-trash"></i></button>' +
                    '</div>' +
                '</div>';
            });
            container.innerHTML = html;
        }

        function moveRepeaterTempItem(index, dir) {
            if (dir === -1 && index > 0) {
                var temp = currentRepeaterGroup[index];
                currentRepeaterGroup[index] = currentRepeaterGroup[index - 1];
                currentRepeaterGroup[index - 1] = temp;
                renderRepeaterTempList();
            } else if (dir === 1 && index < currentRepeaterGroup.length - 1) {
                var temp = currentRepeaterGroup[index];
                currentRepeaterGroup[index] = currentRepeaterGroup[index + 1];
                currentRepeaterGroup[index + 1] = temp;
                renderRepeaterTempList();
            }
        }

        function removeRepeaterTempItem(index) {
            currentRepeaterGroup.splice(index, 1);
            renderRepeaterTempList();
        }

        function saveRepeaterGroup() {
            if (currentRepeaterGroup.length === 0) {
                pushToast("Grup masih kosong! Pilih minimal satu pertanyaan.", "error");
                return;
            }
            
            var keperluan = document.getElementById('builder-repeater-keperluan').value || "Wajib";
            
            // Auto generate judul based on first question
            var metaFirst = parseQuestionMetadata(currentRepeaterGroup[0].name);
            var judul = "Grup Berulang: " + metaFirst.cleanName + (currentRepeaterGroup.length > 1 ? " dll" : "");
            
            var formattedName = "{" + keperluan + ";;} " + judul;
            
            var newQuestionObj = {
                id: "FLD-" + Math.random().toString(36).substr(2, 5).toUpperCase(),
                label: formattedName,
                name: formattedName,
                type: "repeater",
                options: JSON.stringify(currentRepeaterGroup),
                required: "ya"
            };
            
            if (editingRepeaterIndex !== -1) {
                newQuestionObj.id = builderQuestions[editingRepeaterIndex].id;
                builderQuestions[editingRepeaterIndex] = newQuestionObj;
                pushToast("Grup pertanyaan berhasil diupdate.", "success");
            } else {
                builderQuestions.push(newQuestionObj);
                pushToast("Grup pertanyaan berhasil ditambahkan.", "success");
            }
            
            builderQuestions.sort(function (a, b) {
                var metaA = parseQuestionMetadata(a.name);
                var metaB = parseQuestionMetadata(b.name);
                if (metaA.keperluan === "Wajib" && metaB.keperluan !== "Wajib") return -1;
                if (metaB.keperluan === "Wajib" && metaA.keperluan !== "Wajib") return 1;
                if (metaA.keperluan < metaB.keperluan) return -1;
                if (metaA.keperluan > metaB.keperluan) return 1;
                
                // Ensure repeater group marker stays AFTER its constituent elements
                if (a.type === "repeater" && b.type !== "repeater") return 1;
                if (b.type === "repeater" && a.type !== "repeater") return -1;
                return 0;
            });
            
            cancelEditRepeaterGroup();
            renderBuilderQuestionsUIList();
        }

        function cancelEditRepeaterGroup() {
            editingRepeaterIndex = -1;
            currentRepeaterGroup = [];
            document.getElementById('builder-repeater-select').value = "";
            renderRepeaterTempList();
            
            var btnAdd = document.getElementById('btn-add-update-repeater');
            btnAdd.innerHTML = '<i class="fa-solid fa-save"></i> <span>Tambahkan Grup</span>';
            btnAdd.className = "px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md";
            document.getElementById('btn-cancel-update-repeater').classList.add('hidden');
        }

        function addBuilderQuestionToList() {
            var keperluan = document.getElementById('builder-q-keperluan').value || "Wajib";
            var judul = document.getElementById('builder-q-judul').value.trim();
            var label = document.getElementById('builder-q-label').value.trim();
            var type = document.getElementById('builder-q-type').value;
            var reqStatus = document.getElementById('builder-q-required') ? document.getElementById('builder-q-required').value : "ya";

            var finalOptions = "";
            if (type === "dropdown") {
                finalOptions = document.getElementById('builder-q-options').value.trim();
                if (!finalOptions) { pushToast("Tulis opsi dropdown dipisahkan tanda koma!", "error"); return; }
            } else if (type === "number") {
                var limEl = document.getElementById('builder-q-limit');
                if (limEl) finalOptions = limEl.value.trim();
            }

            if (!label) {
                pushToast("Label pertanyaan wajib ditulis!", "error");
                return;
            }

            var formattedName = "{" + keperluan + ";;" + judul + "} " + label;

            var newQuestionObj = {
                id: "FLD-" + Math.random().toString(36).substr(2, 5).toUpperCase(),
                label: formattedName,
                name: formattedName,
                type: type,
                options: finalOptions,
                required: reqStatus
            };

            if (window.editingQuestionIndex !== -1) {
                newQuestionObj.id = builderQuestions[window.editingQuestionIndex].id; // Pertahankan ID
                builderQuestions[window.editingQuestionIndex] = newQuestionObj;
                cancelEditBuilderQuestion();
                pushToast("Pertanyaan berhasil diupdate.", "success");
            } else {
                builderQuestions.push(newQuestionObj);
                pushToast("Pertanyaan berhasil ditambahkan.", "success");
            }

            // Sort / Urutkan Berdasarkan Keperluan (Wajib selalu teratas)
            builderQuestions.sort(function (a, b) {
                var metaA = parseQuestionMetadata(a.name);
                var metaB = parseQuestionMetadata(b.name);
                if (metaA.keperluan === "Wajib" && metaB.keperluan !== "Wajib") return -1;
                if (metaB.keperluan === "Wajib" && metaA.keperluan !== "Wajib") return 1;
                if (metaA.keperluan < metaB.keperluan) return -1;
                if (metaA.keperluan > metaB.keperluan) return 1;
                return 0;
            });

            document.getElementById('builder-q-label').value = "";
            document.getElementById('builder-q-options').value = "";
            document.getElementById('builder-q-judul').value = "";
            if (document.getElementById('builder-q-limit')) document.getElementById('builder-q-limit').value = "";

            renderBuilderQuestionsUIList();
        }

        function editBuilderQuestion(index) {
            var q = builderQuestions[index];
            var meta = parseQuestionMetadata(q.name);
            var baseType = q.type;

            if (baseType === "repeater") {
                cancelEditBuilderQuestion(); // Reset form standard
                editingRepeaterIndex = index;
                
                document.getElementById('builder-repeater-keperluan').value = meta.keperluan || "Wajib";
                
                currentRepeaterGroup = JSON.parse(q.options || "[]");
                
                renderRepeaterTempList();
                populateBuilderRepeaterSelect();
                
                var btnAdd = document.getElementById('btn-add-update-repeater');
                btnAdd.innerHTML = '<i class="fa-solid fa-save"></i> <span>Update Grup</span>';
                btnAdd.className = "px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md";
                document.getElementById('btn-cancel-update-repeater').classList.remove('hidden');
                
                document.getElementById('builder-repeater-select').scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }

            cancelEditRepeaterGroup(); // Reset form repeater
            window.editingQuestionIndex = index;

            // Populate Input Form
            document.getElementById('builder-q-keperluan').value = meta.keperluan || "Wajib";
            document.getElementById('builder-q-judul').value = meta.judul;
            document.getElementById('builder-q-label').value = meta.cleanName;
            document.getElementById('builder-q-type').value = baseType;
            document.getElementById('builder-q-required').value = q.required;

            toggleBuilderOptionInput();

            if (baseType === "dropdown") {
                document.getElementById('builder-q-options').value = q.options;
            } else if (baseType === "number") {
                document.getElementById('builder-q-limit').value = q.options;
            }

            // Update UI Buttons
            var btnAdd = document.getElementById('btn-add-update-question');
            btnAdd.innerHTML = '<i class="fa-solid fa-save"></i> <span>Update Pertanyaan</span>';
            btnAdd.className = "px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md";
            document.getElementById('btn-cancel-update-question').classList.remove('hidden');

            // Auto Scroll to form
            document.getElementById('builder-step-2').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        function cancelEditBuilderQuestion() {
            window.editingQuestionIndex = -1;

            document.getElementById('builder-q-label').value = "";
            document.getElementById('builder-q-options').value = "";
            document.getElementById('builder-q-judul').value = "";
            if (document.getElementById('builder-q-limit')) document.getElementById('builder-q-limit').value = "";

            var btnAdd = document.getElementById('btn-add-update-question');
            btnAdd.innerHTML = '<i class="fa-solid fa-plus-circle"></i> <span>Tambahkan Pertanyaan</span>';
            btnAdd.className = "px-4 py-2 bg-narmadaGreen hover:bg-narmadaGreen-dark text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md";
            document.getElementById('btn-cancel-update-question').classList.add('hidden');
        }

        function removeBuilderQuestion(index) {
            builderQuestions.splice(index, 1);
            if (window.editingQuestionIndex === index) cancelEditBuilderQuestion();
            renderBuilderQuestionsUIList();
        }

        function moveBuilderQuestionUp(index) {
            var currentQ = builderQuestions[index];
            var currentMeta = parseQuestionMetadata(currentQ.name);
            var prevIndex = -1;
            for (var i = index - 1; i >= 0; i--) {
                var meta = parseQuestionMetadata(builderQuestions[i].name);
                if (meta.keperluan === currentMeta.keperluan) {
                    prevIndex = i;
                    break;
                }
            }
            if (prevIndex !== -1) {
                var temp = builderQuestions[prevIndex];
                builderQuestions[prevIndex] = builderQuestions[index];
                builderQuestions[index] = temp;
                renderBuilderQuestionsUIList();
            }
        }

        function moveBuilderQuestionDown(index) {
            var currentQ = builderQuestions[index];
            var currentMeta = parseQuestionMetadata(currentQ.name);
            var nextIndex = -1;
            for (var i = index + 1; i < builderQuestions.length; i++) {
                var meta = parseQuestionMetadata(builderQuestions[i].name);
                if (meta.keperluan === currentMeta.keperluan) {
                    nextIndex = i;
                    break;
                }
            }
            if (nextIndex !== -1) {
                var temp = builderQuestions[nextIndex];
                builderQuestions[nextIndex] = builderQuestions[index];
                builderQuestions[index] = temp;
                renderBuilderQuestionsUIList();
            }
        }

        function duplicateBuilderQuestion(index) {
            var q = JSON.parse(JSON.stringify(builderQuestions[index]));
            var meta = parseQuestionMetadata(q.name);
            var newJudul = (meta.judul || meta.cleanName) + " (Copy)";
            q.name = "{" + meta.keperluan + ";;" + newJudul + "} " + meta.cleanName;
            builderQuestions.splice(index + 1, 0, q);
            renderBuilderQuestionsUIList();
        }

        function renderBuilderQuestionsUIList() {
            var container = document.getElementById('builder-q-list');
            if (!container) return;
            container.innerHTML = "";

            if (builderQuestions.length === 0) {
                container.innerHTML = '<p class="text-[10px] text-slate-400 italic font-semibold">Belum ada pertanyaan kustom ditambahkan.</p>';
                return;
            }

            var groupedQ = {};
            builderQuestions.forEach(function (q, idx) {
                var meta = parseQuestionMetadata(q.name);
                if (!groupedQ[meta.keperluan]) groupedQ[meta.keperluan] = [];
                groupedQ[meta.keperluan].push({ data: q, index: idx, meta: meta });
            });

            Object.keys(groupedQ).forEach(function (kep) {
                var groupHtml = '<div class="bg-white border border-slate-200 rounded-xl p-3 shadow-sm text-left mb-2">' +
                    '<h5 class="text-[10px] font-extrabold text-blue-600 mb-2 border-b pb-1 flex items-center gap-1.5"><i class="fa-solid fa-list-ul"></i> Keperluan: ' + kep + '</h5>' +
                    '<div class="space-y-1.5 pl-1">';

                groupedQ[kep].forEach(function (item, idxInGroup) {
                    var baseType = item.data.type;

                    var detail = baseType === "dropdown" ? " (Dropdown: " + item.data.options + ")" :
                        baseType === "number" ? " (Angka" + (item.data.options ? ", Max Digit: " + item.data.options : "") + ")" :
                            baseType === "date" ? " (Tanggal)" : 
                                baseType === "repeater" ? (() => {
                                    try { 
                                        var subs = JSON.parse(item.data.options || "[]"); 
                                        return " (Grup Berulang: " + subs.length + " pertanyaan)";
                                    } catch(e) { return " (Grup Berulang)"; }
                                })() : " (Teks)";

                    if (baseType === "repeater") detail += " <span class='text-indigo-500 font-bold'>[Grup Repeater]</span>";

                    var reqLabel = item.data.required === "tidak" ? '<span class="ml-1 text-amber-500 font-bold">[Opsional]</span>' : '<span class="ml-1 text-emerald-500 font-bold">[Wajib]</span>';
                    var titleStr = item.meta.judul ? '<span class="block text-[8px] text-slate-400 font-extrabold uppercase mb-0.5"><i class="fa-solid fa-tag"></i> Judul: ' + item.meta.judul + '</span>' : '';
                    
                    var numberStr = '<span class="font-bold text-slate-800 text-[10px] w-4 inline-block">' + (idxInGroup + 1) + '.</span>';

                    var highlightClass = (window.editingQuestionIndex === item.index) ? "border-amber-400 bg-amber-50" : "border-slate-101 bg-slate-50";

                    groupHtml += '<div class="flex items-center justify-between p-2 rounded-lg border ' + highlightClass + ' text-[10px] font-semibold text-slate-700">' +
                        '<div class="flex items-start gap-1">' + numberStr + '<div>' + titleStr + '<span><i class="fa-solid fa-check text-emerald-500 mr-1"></i> ' + item.meta.cleanName + reqLabel + ' <span class="text-slate-400 block mt-0.5">' + detail + '</span></span></div></div>' +
                        '<div class="flex gap-1 shrink-0 flex-wrap justify-end max-w-[120px]">' +
                        '<button onclick="moveBuilderQuestionUp(' + item.index + ')" class="text-slate-500 hover:text-slate-700 px-1.5 py-1 bg-white border border-slate-200 rounded shadow-sm transition-all" title="Naik"><i class="fa-solid fa-arrow-up"></i></button>' +
                        '<button onclick="moveBuilderQuestionDown(' + item.index + ')" class="text-slate-500 hover:text-slate-700 px-1.5 py-1 bg-white border border-slate-200 rounded shadow-sm transition-all" title="Turun"><i class="fa-solid fa-arrow-down"></i></button>' +
                        '<button onclick="duplicateBuilderQuestion(' + item.index + ')" class="text-indigo-500 hover:text-indigo-700 px-1.5 py-1 bg-white border border-slate-200 rounded shadow-sm transition-all" title="Duplikat"><i class="fa-solid fa-copy"></i></button>' +
                        '<button onclick="editBuilderQuestion(' + item.index + ')" class="text-blue-500 hover:text-blue-700 px-1.5 py-1 bg-white border border-slate-200 rounded shadow-sm transition-all" title="Edit"><i class="fa-solid fa-edit"></i></button>' +
                        '<button onclick="removeBuilderQuestion(' + item.index + ')" class="text-red-500 hover:text-red-700 px-1.5 py-1 bg-white border border-slate-200 rounded shadow-sm transition-all" title="Hapus"><i class="fa-solid fa-trash"></i></button>' +
                        '</div>' +
                        '</div>';
                });
                groupHtml += '</div></div>';
                container.innerHTML += groupHtml;
            });
            populateBuilderRepeaterSelect();
        }

        function submitBuilderDataToServer() {
            var selectVal = document.getElementById('builder-select-layanan').value;
            var isNew = selectVal === "[+] TAMBAH LAYANAN BARU";
            var name = document.getElementById('builder-layanan-nama').value.trim();
            var templateDocId = document.getElementById('builder-template-doc-id').value.trim();

            var selectKeperluan = document.getElementById('builder-keperluan-select');
            var keperluanOpts = [];
            for (var i = 0; i < selectKeperluan.options.length; i++) {
                var val = selectKeperluan.options[i].value;
                if (val && val !== "__ADD_NEW__") {
                    keperluanOpts.push(val);
                }
            }

            var jSec = keperluanOpts.join(",");
            var dSec = "Pilih keperluan pengurusan surat Anda.";

            if (!name) {
                pushToast("Nama pelayanan administrasi surat wajib diisi!", "error");
                return;
            }

            var activeReqs = [];
            Object.keys(builderReqMap).forEach(function (kep) {
                builderReqMap[kep].forEach(function (req) {
                    activeReqs.push("[" + kep + "] " + req);
                });
            });

            var mappedFieldsTextArray = builderQuestions.map(function (q) {
                return JSON.stringify(q);
            });

            var oldName = "";
            if (!isNew && window.loadedLayananList) {
                var found = window.loadedLayananList.find(l => l.nama === selectVal);
                if (found) {
                    payload_id = found.id;
                    oldName = found.nama;
                } else {
                    payload_id = "";
                }
            } else {
                payload_id = "";
            }

            var payload = {
                id: payload_id,
                nama: name,
                namaOld: isNew ? "" : oldName,
                syarat: activeReqs.join(";;;"),
                pertanyaan: mappedFieldsTextArray.join(";;;"),
                judulSectionIsian: jSec,
                deskripsiSectionIsian: dSec,
                logikaKondisional: "[]",
                templateDocId: templateDocId
            };

            var action = payload.id ? "update" : "create";

            if (isGoogleEnv) {
                google.script.run
                    .withSuccessHandler(function (res) {
                        if (res && res.authError) { pushToast(res.message, "error"); handleAdminLogout(); return; }
                        if (res.success) {
                            pushToast("Layanan '" + name + "' sukses dipublikasikan ke warga!", "success");
                            resetBuilderFormState();
                            executeSwitchAdminTab('daftar-layanan');
                            loadBuilderLayananList();
                            loadLayananDataWarga();
                        } else {
                            pushToast("Gagal menyimpan: " + res.message, "error");
                        }
                    })
                    .crudLayanan(localStorage.getItem('adminToken_Narmada'), action, payload);
            } else {
                if (!payload.id) {
                    dummyLayananList.push({
                        id: "LAY-MOCK-" + Math.random().toString(36).substr(2, 5).toUpperCase(),
                        nama: payload.nama,
                        deskripsi: "Pelayanan baru terdaftar via Service Builder.",
                        judulSectionIsian: payload.judulSectionIsian,
                        deskripsiSectionIsian: payload.deskripsiSectionIsian,
                        logikaKondisional: payload.logikaKondisional,
                        requirements: activeReqs.map(function (r) { return { id: "REQ-" + Math.random(), name: r }; }),
                        fields: builderQuestions
                    });
                } else {
                    var idx = dummyLayananList.findIndex(l => l.id === payload.id);
                    if (idx !== -1) {
                        dummyLayananList[idx].nama = payload.nama;
                        dummyLayananList[idx].judulSectionIsian = payload.judulSectionIsian;
                        dummyLayananList[idx].deskripsiSectionIsian = payload.deskripsiSectionIsian;
                        dummyLayananList[idx].logikaKondisional = payload.logikaKondisional;
                        dummyLayananList[idx].requirements = activeReqs.map(function (r) { return { id: "REQ-" + Math.random(), name: r }; });
                        dummyLayananList[idx].fields = builderQuestions;
                    }
                }
                pushToast("SIMULASI: Sukses mempublikasikan layanan baru.", "success");
                resetBuilderFormState();
                executeSwitchAdminTab('daftar-layanan');
                loadBuilderLayananList();
                renderLayananListWarga(dummyLayananList);
            }
        }

        function resetBuilderFormState() {
            document.getElementById('builder-select-layanan').value = "[+] TAMBAH LAYANAN BARU";
            document.getElementById('builder-layanan-nama').value = "";
            document.getElementById('builder-template-doc-id').value = "";
            document.getElementById('wrapper-builder-nama').classList.remove('hidden');

            var selectKeperluan = document.getElementById('builder-keperluan-select');
            if (selectKeperluan) {
                selectKeperluan.innerHTML = '<option value="">-- Pilih atau Tambah Keperluan --</option>' +
                    '<option value="__ADD_NEW__" class="font-extrabold text-emerald-600">[+] TAMBAH KEPERLUAN BARU...</option>';
            }

            var wrapperNew = document.getElementById('wrapper-new-keperluan');
            if (wrapperNew) wrapperNew.classList.add('hidden');

            builderQuestions = [];
            builderReqMap = {};

            renderBuilderQuestionsUIList();
            initStep2RequirementsBuilder();
            initStep3QuestionsBuilder();
        }

        function deleteBuilderMasterLayanan(nama) {
            askConfirmation("Hapus Layanan", "Apakah Anda yakin ingin menghapus layanan '" + nama + "' dari sistem secara permanen?", function () {
                if (isGoogleEnv) {
                    google.script.run
                        .withSuccessHandler(function (res) {
                            if (res && res.authError) { pushToast(res.message, "error"); handleAdminLogout(); return; }
                            if (res.success) {
                                pushToast("Layanan '" + nama + "' berhasil dihapus.", "success");
                                loadBuilderLayananList();
                                loadLayananDataWarga();
                            }
                        })
                        .crudLayanan(localStorage.getItem('adminToken_Narmada'), "delete", { nama: nama });
                } else {
                    dummyLayananList = dummyLayananList.filter(l => l.nama !== nama);
                    pushToast("SIMULASI: Layanan terhapus.", "success");
                    loadBuilderLayananList();
                    renderLayananListWarga(dummyLayananList);
                }
            });
        }

        function loadAdminSettingsForm() {
            if (isGoogleEnv) {
                google.script.run.withSuccessHandler(function (res) {
                    globalSettings = res;
                    document.getElementById('setelan-wa').value = res.kontak_wa || "";
                    document.getElementById('setelan-nama-desa').value = res.nama_desa || "";
                    document.getElementById('setelan-logo-url-desa').value = res.logo_url_desa || "";
                    document.getElementById('setelan-deskripsi-banner').value = res.deskripsi_banner || "";
                    document.getElementById('setelan-banner-url-desa').value = res.banner_url_desa || "";

                    document.getElementById('setelan-desc-jam').value = res.deskripsi_jam_pelayanan || "";
                    document.getElementById('setelan-desc-alur').value = res.deskripsi_alur || "";
                    document.getElementById('setelan-desc-banner-semi').value = res.deskripsi_banner_semi || "";

                    document.getElementById('setelan-user').value = res.username || "";
                    document.getElementById('setelan-pass').value = res.password || "";

                    document.getElementById('setelan-toggle-jam').checked = (res.status_jam_pelayanan === "on");
                    document.getElementById('setelan-toggle-alur').checked = (res.status_alur === "on");
                    document.getElementById('setelan-toggle-banner').checked = (res.status_banner_semi === "on");
                }).getAdminSetelan();
            } else {
                document.getElementById('setelan-wa').value = dummySetelan.kontak_wa;
                document.getElementById('setelan-nama-desa').value = dummySetelan.nama_desa;
                document.getElementById('setelan-logo-url-desa').value = dummySetelan.logo_url_desa;
                document.getElementById('setelan-deskripsi-banner').value = dummySetelan.deskripsi_banner;
                document.getElementById('setelan-banner-url-desa').value = dummySetelan.banner_url_desa;

                document.getElementById('setelan-desc-jam').value = dummySetelan.deskripsi_jam_pelayanan;
                document.getElementById('setelan-desc-alur').value = dummySetelan.deskripsi_alur;
                document.getElementById('setelan-desc-banner-semi').value = dummySetelan.deskripsi_banner_semi;

                document.getElementById('setelan-user').value = dummySetelan.username;
                document.getElementById('setelan-pass').value = dummySetelan.password;

                document.getElementById('setelan-toggle-jam').checked = (dummySetelan.status_jam_pelayanan === "on");
                document.getElementById('setelan-toggle-alur').checked = (dummySetelan.status_alur === "on");
                document.getElementById('setelan-toggle-banner').checked = (dummySetelan.status_banner_semi === "on");
            }
        }

        function saveAdminSettings() {
            var preWa = document.getElementById('setelan-wa').value.trim();
            var formattedWaAdmin = formatWhatsAppToInternational(preWa);

            var payload = {
                kontak_wa: formattedWaAdmin,
                nama_desa: document.getElementById('setelan-nama-desa').value.trim(),
                logo_url_desa: document.getElementById('setelan-logo-url-desa').value.trim(),
                deskripsi_banner: document.getElementById('setelan-deskripsi-banner').value.trim(),
                banner_url_desa: document.getElementById('setelan-banner-url-desa').value.trim(),

                deskripsi_jam_pelayanan: document.getElementById('setelan-desc-jam').value.trim(),
                deskripsi_alur: document.getElementById('setelan-desc-alur').value.trim(),
                deskripsi_banner_semi: document.getElementById('setelan-desc-banner-semi').value.trim(),

                username: document.getElementById('setelan-user').value.trim(),
                password: document.getElementById('setelan-pass').value.trim(),

                status_jam_pelayanan: document.getElementById('setelan-toggle-jam').checked ? "on" : "off",
                status_alur: document.getElementById('setelan-toggle-alur').checked ? "on" : "off",
                status_banner_semi: document.getElementById('setelan-toggle-banner').checked ? "on" : "off"
            };

            if (isGoogleEnv) {
                google.script.run.withSuccessHandler(function (res) {
                    if (res && res.authError) { pushToast(res.message, "error"); handleAdminLogout(); return; }
                    if (res.success) {
                        pushToast(res.message, "success");
                        loadCMSConfigurationAndLayanan();
                    }
                }).updateAdminSetelan(localStorage.getItem('adminToken_Narmada'), payload);
            } else {
                dummySetelan = payload;
                globalSettings = payload;
                applyCMSConfigurations(payload);
                pushToast("SIMULASI: Konfigurasi setelan disimpan.", "success");
            }
        }

// =========================================================
// FASE 3: INIT CHART.JS ADMIN DASHBOARD
// =========================================================
let adminCharts = {
    mingguan: null,
    status: null,
    layanan: null
};

function initAdminCharts() {
    const narmadaGreen = '#059669';
    const narmadaBlue = '#0ea5e9';
    
    // 1. Chart Pengajuan Mingguan (Line)
    const ctxMingguan = document.getElementById('chartPengajuanMingguan');
    if (ctxMingguan && !adminCharts.mingguan) {
        adminCharts.mingguan = new Chart(ctxMingguan, {
            type: 'line',
            data: {
                labels: ['18 Jul', '19 Jul', '20 Jul', '21 Jul', '22 Jul', '23 Jul', '24 Jul'],
                datasets: [{
                    label: 'Jumlah Pengajuan',
                    data: [45, 62, 38, 60, 39, 85, 75],
                    borderColor: narmadaGreen,
                    backgroundColor: 'rgba(5, 150, 105, 0.1)',
                    borderWidth: 2,
                    pointBackgroundColor: narmadaGreen,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { borderDash: [5, 5] }, max: 100 },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    // 2. Chart Status Pengajuan (Donut)
    const ctxStatus = document.getElementById('chartStatusPengajuan');
    if (ctxStatus && !adminCharts.status) {
        adminCharts.status = new Chart(ctxStatus, {
            type: 'doughnut',
            data: {
                labels: ['Menunggu', 'Verifikasi', 'Selesai', 'Perbaikan'],
                datasets: [{
                    data: [47, 36, 112, 18],
                    backgroundColor: [narmadaBlue, '#f59e0b', narmadaGreen, '#ef4444'],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: { size: 11, family: "'Plus Jakarta Sans', sans-serif" }
                        }
                    }
                }
            }
        });
    }

    // 3. Chart Jenis Layanan (Bar)
    const ctxLayanan = document.getElementById('chartJenisLayanan');
    if (ctxLayanan && !adminCharts.layanan) {
        adminCharts.layanan = new Chart(ctxLayanan, {
            type: 'bar',
            data: {
                labels: ['KK', 'KTP', 'BPJS', 'SKTM', 'Domisili', 'Lainnya'],
                datasets: [{
                    label: 'Pengajuan',
                    data: [65, 45, 32, 26, 15, 12],
                    backgroundColor: narmadaGreen,
                    borderRadius: 4,
                    barPercentage: 0.6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { borderDash: [5, 5] }, max: 80 },
                    x: { grid: { display: false } }
                }
            }
        });
    }
}


// -----------------------------------------------------
// NEW FUNCTIONS: Laporan, Log Aktivitas, Export, Cetak
// -----------------------------------------------------

async function fetchActivities() {
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

function renderActivities(res, tbody) {
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

async function fetchNotifications() {
    const container = document.getElementById("notification-container");
    if (!container) return;
    container.innerHTML = `<div class="text-center text-slate-400 py-4 text-xs">Memuat notifikasi...</div>`;
    
    if (isGoogleEnv) {
        google.script.run
            .withSuccessHandler(function (res) {
                renderNotifications(res, container);
            })
            .withFailureHandler(function (err) {
                container.innerHTML = `<div class="text-center text-red-500 py-4 text-xs">Gagal: ${err.toString()}</div>`;
            })
            .getNotifications(localStorage.getItem('adminToken_Narmada'), 10);
    } else {
        setTimeout(function() {
            renderNotifications({ success: true, data: [] }, container);
        }, 800);
    }
}

function renderNotifications(res, container) {
    if (res && res.success === false) {
        container.innerHTML = `<div class="text-center text-red-500 py-4 text-xs">${res.error || res.message}</div>`;
        return;
    }
    
    let data = Array.isArray(res) ? res : (res.data || []);
    if (data.length === 0) {
        container.innerHTML = `<div class="text-center text-slate-400 py-4 text-xs">Belum ada notifikasi.</div>`;
        return;
    }
    
    let html = "";
    data.forEach(item => {
        let icon = "fa-info-circle";
        let colorClass = "bg-blue-50 text-blue-500";
        let dotClass = "bg-blue-500";
        
        if (item.tipe === "NEW_REQUEST") { icon = "fa-file-arrow-up"; colorClass = "bg-emerald-50 text-emerald-500"; dotClass = "bg-emerald-500"; }
        
        let dot = item.dibaca ? "" : `<div class="w-2 h-2 rounded-full ${dotClass} mt-1 ml-auto shrink-0"></div>`;
        
        html += `
        <div class="flex gap-3">
            <div class="w-8 h-8 rounded-full ${colorClass} flex items-center justify-center shrink-0">
                <i class="fa-solid ${icon} text-xs"></i>
            </div>
            <div>
                <p class="text-xs font-bold text-slate-800">${item.judul}</p>
                <p class="text-[10px] text-slate-500 mt-0.5">${item.pesan}</p>
                <p class="text-[9px] font-bold text-slate-400 mt-1">${item.waktu}</p>
            </div>
            ${dot}
        </div>`;
    });
    
    container.innerHTML = html;
}

function exportDataExcel() {
    if (!window.currentAdminData || window.currentAdminData.length === 0) {
        pushToast("Tidak ada data untuk diexport.", "warning");
        return;
    }

    Swal.fire({
        title: "Konfirmasi Export",
        text: "Unduh data yang tampil di tabel saat ini sebagai CSV?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Ya, Unduh CSV",
        cancelButtonText: "Batal",
        customClass: {
            popup: "rounded-2xl border border-slate-100 shadow-sm",
            confirmButton: "bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl px-4 py-2",
            cancelButton: "bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl px-4 py-2"
        }
    }).then((result) => {
        if (result.isConfirmed) {
            let csvContent = "ID Pengajuan,Tanggal,NIK,Nama Pemohon,Layanan,Status\n";
            window.currentAdminData.forEach(row => {
                let nama = (row.nama || "").replace(/,/g, " ");
                let lay = (row.layanan || "").replace(/,/g, " ");
                csvContent += `${row.id},${row.tanggal},${row.nik},${nama},${lay},${row.status}\n`;
            });
            
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `Data_Pengajuan_${new Date().toISOString().slice(0,10)}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            pushToast("Export CSV berhasil.", "success");
        }
    });
}

function cetakMassal() {
    if (!window.currentAdminData || window.currentAdminData.length === 0) {
        pushToast("Tidak ada data untuk dicetak.", "warning");
        return;
    }
    window.print();
}

function updateLaporanStats() {
    const totalAll = document.getElementById("laporan-total-all");
    const totalSelesai = document.getElementById("laporan-total-selesai");
    
    if (totalAll && window.lastDashboardStats) {
        totalAll.innerText = window.lastDashboardStats.total;
    }
    if (totalSelesai && window.lastDashboardStats) {
        totalSelesai.innerText = window.lastDashboardStats.selesai;
    }
}

// --- Profile Dropdown Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const profileTrigger = document.getElementById('admin-profile-trigger');
    const profileMenu = document.getElementById('admin-profile-menu');
    const profileChevron = document.getElementById('admin-profile-chevron');

    if (profileTrigger && profileMenu) {
        // Toggle dropdown on click
        profileTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isHidden = profileMenu.classList.contains('hidden');
            
            if (isHidden) {
                // Show menu
                profileMenu.classList.remove('hidden');
                // Small delay to allow display:block to apply before animating opacity/transform
                setTimeout(() => {
                    profileMenu.classList.remove('opacity-0', 'scale-95');
                    profileMenu.classList.add('opacity-100', 'scale-100');
                    if (profileChevron) profileChevron.style.transform = 'rotate(180deg)';
                }, 10);
            } else {
                // Hide menu
                profileMenu.classList.remove('opacity-100', 'scale-100');
                profileMenu.classList.add('opacity-0', 'scale-95');
                if (profileChevron) profileChevron.style.transform = 'rotate(0deg)';
                // Wait for animation to finish before hiding
                setTimeout(() => {
                    profileMenu.classList.add('hidden');
                }, 200);
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!profileMenu.contains(e.target) && !profileTrigger.contains(e.target)) {
                if (!profileMenu.classList.contains('hidden')) {
                    profileMenu.classList.remove('opacity-100', 'scale-100');
                    profileMenu.classList.add('opacity-0', 'scale-95');
                    if (profileChevron) profileChevron.style.transform = 'rotate(0deg)';
                    setTimeout(() => {
                        profileMenu.classList.add('hidden');
                    }, 200);
                }
            }
        });
    }
});

// Dark Mode Toggle Logic (Mock for UI)
function toggleDarkModeUI(element) {
    const isDarkMode = document.documentElement.classList.contains('dark');
    const track = document.getElementById('dark-mode-track');
    const thumb = document.getElementById('dark-mode-thumb');
    
    if (isDarkMode) {
        // Switch to Light Mode
        document.documentElement.classList.remove('dark');
        if (track) track.classList.replace('bg-emerald-500', 'bg-slate-200');
        if (thumb) thumb.classList.replace('translate-x-4', 'translate-x-0');
        localStorage.setItem('theme', 'light');
    } else {
        // Switch to Dark Mode
        document.documentElement.classList.add('dark');
        if (track) { track.classList.remove('bg-slate-200'); track.classList.add('bg-emerald-500'); }
        if (thumb) { thumb.classList.remove('translate-x-0'); thumb.classList.add('translate-x-4'); }
        localStorage.setItem('theme', 'dark');
    }
}

// --- Profil Logic ---
function toggleEditProfile() {
    const inputs = document.querySelectorAll('.profil-input');
    const actionButtons = document.getElementById('profil-action-buttons');
    const btnEdit = document.getElementById('btn-edit-profil');
    
    let isEditing = !inputs[0].hasAttribute('readonly');
    
    if (isEditing) {
        // Cancel edit
        inputs.forEach(input => {
            input.setAttribute('readonly', true);
            input.classList.remove('bg-white', 'border-narmadaGreen');
            input.classList.add('bg-slate-50', 'border-slate-200');
        });
        actionButtons.classList.add('hidden');
        btnEdit.classList.remove('hidden');
    } else {
        // Start edit
        inputs.forEach(input => {
            input.removeAttribute('readonly');
            input.classList.remove('bg-slate-50', 'border-slate-200');
            input.classList.add('bg-white', 'border-slate-300'); // Or narmadaGreen on focus
        });
        inputs[0].focus();
        actionButtons.classList.remove('hidden');
        btnEdit.classList.add('hidden');
    }
}

function saveProfileData(e) {
    e.preventDefault();
    // Simulate API call
    Swal.fire({
        title: 'Menyimpan...',
        text: 'Mohon tunggu sebentar',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    setTimeout(() => {
        Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: 'Data profil berhasil diperbarui.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#059669'
        }).then(() => {
            toggleEditProfile(); // Exit edit mode
        });
    }, 1500);
}

function changePasswordMock(e) {
    e.preventDefault();
    const newPass = document.getElementById('new-password').value;
    const confirmPass = document.getElementById('confirm-password').value;
    const errorText = document.getElementById('password-error');
    
    if (newPass !== confirmPass) {
        errorText.classList.remove('hidden');
        return;
    } else {
        errorText.classList.add('hidden');
    }
    
    // Simulate API call
    Swal.fire({
        title: 'Memperbarui Password...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    setTimeout(() => {
        Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: 'Password Anda telah berhasil diubah.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#059669'
        }).then(() => {
            document.getElementById('form-password').reset();
        });
    }, 1500);
}

// --- Pengaturan Logic ---
function toggleSettingSwitch(button, settingName) {
    const isChecked = button.getAttribute('aria-checked') === 'true';
    const track = button.querySelector('.toggle-track');
    const thumb = button.querySelector('.toggle-thumb');
    
    if (isChecked) {
        // Turn OFF
        button.setAttribute('aria-checked', 'false');
        if (track) track.classList.replace('bg-emerald-500', 'bg-slate-200');
        if (thumb) thumb.classList.replace('translate-x-4', 'translate-x-0');
        
        // Mock notification
        pushToast(`${settingName} dinonaktifkan.`, 'info');
    } else {
        // Turn ON
        button.setAttribute('aria-checked', 'true');
        if (track) track.classList.replace('bg-slate-200', 'bg-emerald-500');
        if (thumb) thumb.classList.replace('translate-x-0', 'translate-x-4');
        
        // Mock notification
        pushToast(`${settingName} diaktifkan.`, 'success');
    }
}

function mockSaveSetting(settingName) {
    pushToast(`Pengaturan ${settingName} disimpan.`, 'success');
}

// --- Pengaturan Akun Tabs (Drill-Down) ---
function showPengaturanAkunMenu() {
    const menuUtama = document.getElementById('pa-menu-utama');
    const contentContainer = document.getElementById('pa-content-container');
    
    if (menuUtama) {
        menuUtama.classList.remove('hidden');
        menuUtama.classList.add('block');
    }
    if (contentContainer) {
        contentContainer.classList.add('hidden');
    }
}

function switchPengaturanAkunTab(tabId) {
    const allTabs = ['profil', 'keamanan', 'tampilan', 'notifikasi', 'aktivitas'];
    
    // Sembunyikan menu utama
    const menuUtama = document.getElementById('pa-menu-utama');
    if (menuUtama) {
        menuUtama.classList.add('hidden');
        menuUtama.classList.remove('block');
    }
    
    // Tampilkan container konten
    const contentContainer = document.getElementById('pa-content-container');
    if (contentContainer) {
        contentContainer.classList.remove('hidden');
    }
    
    // Sembunyikan semua spesifik konten
    allTabs.forEach(id => {
        const el = document.getElementById('pa-content-' + id);
        if (el) {
            el.classList.remove('block');
            el.classList.add('hidden');
        }
    });

    // Tampilkan konten yang dipilih
    const activeContent = document.getElementById('pa-content-' + tabId);
    if (activeContent) {
        activeContent.classList.remove('hidden');
        activeContent.classList.add('block');
    }
}

// --- Tambah Pengguna Logic ---
function openModalTambahPengguna() {
    var modal = document.getElementById('modal-tambah-pengguna');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function closeModalTambahPengguna() {
    var modal = document.getElementById('modal-tambah-pengguna');
    if (modal) {
        modal.classList.add('hidden');
        // Reset form
        var form = document.getElementById('form-tambah-pengguna');
        if (form) form.reset();
    }
}

function simpanPenggunaBaru(event) {
    event.preventDefault(); // Mencegah reload halaman
    
    // Ambil nilai dari input
    var nama = document.getElementById('tp-nama').value;
    var username = document.getElementById('tp-username').value;
    var password = document.getElementById('tp-password').value;
    var peran = document.getElementById('tp-peran').value;
    var unit = document.getElementById('tp-unit').value;
    var status = document.getElementById('tp-status').value;
    
    // Buat format tanggal hari ini untuk "Terakhir Login"
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var tanggalFormatted = dd + '/' + mm + '/' + yyyy + ', -'; // Belum pernah login

    // Buat object akun baru
    var akunBaru = {
        u: username,
        p: password,
        role: peran,
        name: nama,
        status: status,
        unit: unit,
        terakhirLogin: tanggalFormatted
    };
    
    // Tambahkan ke database dummy
    if(window.dummyUsersData) {
        window.dummyUsersData.push(akunBaru);
        
        // Render ulang tabel pengguna (mempertahankan filter jika ada)
        if (typeof filterUserTable === 'function') {
            filterUserTable();
        } else {
            renderUserTable(window.dummyUsersData);
        }
        
        // Update statistik secara manual
        var elTotal = document.getElementById('stat-user-total');
        if (elTotal) elTotal.innerText = parseInt(elTotal.innerText) + 1;
        
        if (peran.includes('Operator')) {
            var elOperator = document.getElementById('stat-user-operator');
            if (elOperator) elOperator.innerText = parseInt(elOperator.innerText) + 1;
        } else if (peran.includes('Pimpinan') || peran.includes('Desa')) {
            var elPimpinan = document.getElementById('stat-user-pimpinan');
            if (elPimpinan) elPimpinan.innerText = parseInt(elPimpinan.innerText) + 1;
        } else if (peran === 'Super Admin') {
            var elAdmin = document.getElementById('stat-user-admin');
            if (elAdmin) elAdmin.innerText = parseInt(elAdmin.innerText) + 1;
        }
        
        // Tutup modal
        closeModalTambahPengguna();
        
        // Tampilkan notifikasi
        pushToast('Akun ' + nama + ' berhasil dibuat!', 'success');
    } else {
        pushToast('Gagal menambahkan pengguna.', 'error');
    }
}

// --- Initial Route Logic ---
document.addEventListener('DOMContentLoaded', function() {
    var path = window.location.pathname;
    if (path.startsWith('/admin/')) {
        var tab = path.replace('/admin/', '');
        if (tab && tab !== 'dashboard') {
            // We use setTimeout to ensure other initializations are done
            setTimeout(function() {
                switchAdminTab(tab, false);
            }, 100);
        }
    }
});
