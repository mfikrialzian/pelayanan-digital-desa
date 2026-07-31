window.isVerifikasiDirty = false;

export function markVerifikasiDirty() {
            window.isVerifikasiDirty = true;
        }

export function resetVerifikasiDirty() {
            window.isVerifikasiDirty = false;
        }

export function switchAdminTab(tabId, updateUrl = true) {
            // RBAC Protection
            if (typeof ROLE_MAPPINGS !== 'undefined') {
                let role = localStorage.getItem('userRole') || 'Admin';
                let mapping = ROLE_MAPPINGS[role] || ROLE_MAPPINGS['Admin'];
                
                // Normalisasi ID untuk pengecekan (misal 'pengaturan-akun' diijinkan jika ada di avatar)
                let allowed = false;
                
                // Dashboard is always allowed for admin roles
                if (tabId === 'dashboard') allowed = true;
                
                if (!allowed && mapping.sidebar.includes(tabId)) allowed = true;
                if (!allowed && mapping.avatar.includes(tabId)) allowed = true;
                
                // Special mapping logic for avatar items to tabIds
                if (!allowed && tabId === 'aktivitas' && mapping.avatar.includes('log-saya')) allowed = true;
                if (!allowed && tabId === 'aktivitas' && mapping.avatar.includes('aktivitas-semua')) allowed = true;
                
                if (!allowed && tabId !== 'verifikasi' && tabId !== 'layanan') {
                    pushToast("Akses Ditolak: Jenis Akun Anda (" + role + ") tidak memiliki akses ke menu ini.", "error");
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

export function executeSwitchAdminTab(tabId, updateUrl = true) {
            const subviews = [
                'subview-admin-dashboard', 'subview-admin-pengajuan', 'subview-admin-daftar-layanan',
                'subview-admin-layanan', 'subview-admin-verifikasi', 'subview-admin-kontak',
                'subview-admin-beranda', 'subview-admin-kredensial', 'subview-admin-laporan',
                'subview-admin-aktivitas', 'subview-admin-pengaturan-akun'
            ];
            subviews.forEach(id => {
                let el = document.getElementById(id);
                if (el) el.classList.add('hidden');
            });


            const allTabs = ['tab-adm-dashboard', 'tab-adm-pengajuan', 'tab-adm-daftar-layanan', 'tab-adm-kontak', 'tab-adm-beranda', 'tab-adm-kredensial', 'tab-adm-laporan', 'tab-adm-aktivitas'];

            let inactiveClass = "w-full text-left flex items-center px-3 py-2.5 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-semibold text-sm transition-colors";
            let activeClass = "w-full text-left flex items-center px-3 py-2.5 bg-emerald-50 text-narmadaGreen rounded-xl font-bold text-sm transition-colors";

            allTabs.forEach(function(id) {
                let el = document.getElementById(id);
                if (el) el.className = inactiveClass;
            });

            let targetSubview = document.getElementById('subview-admin-' + tabId);
            if (targetSubview) targetSubview.classList.remove('hidden');
            let activeTabEl = document.getElementById('tab-adm-' + tabId);
            if (activeTabEl) {
                activeTabEl.className = activeClass;
            }

            // Jika di mobile, sembunyikan sidebar setelah klik menu
            if (window.innerWidth < 768) {
                let sidebar = document.getElementById('admin-sidebar');
                if (sidebar) sidebar.classList.add('hidden');
            }

            activeAdminTab = tabId;

            let rightColumn = document.getElementById('admin-right-column');
            let mainColumn = document.getElementById('admin-main-column');

            if (tabId === 'dashboard') {
                if (rightColumn) rightColumn.classList.remove('hidden');
                if (mainColumn) {
                    mainColumn.classList.remove('w-full');
                    if (!mainColumn.className.includes('lg:w-3/4')) {
                        mainColumn.className += ' lg:w-3/4';
                    }
                }
                fetchAdminStats();
            } else {
                if (rightColumn) rightColumn.classList.add('hidden');
                if (mainColumn) {
                    mainColumn.classList.add('w-full');
                    mainColumn.className = mainColumn.className.replace('lg:w-3/4', '').trim();
                }
                
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
                let newUrl = '/admin/' + tabId;
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
                let path = window.location.pathname;
                if (path.startsWith('/admin/')) {
                    let tab = path.replace('/admin/', '');
                    if (tab) {
                        switchAdminTab(tab, false);
                        return;
                    }
                }
                switchAdminTab('dashboard', false);
            }
        });

export function setStatusFilter(statusVal) {
            activeStatusFilter = statusVal;

            let label = "Semua Berkas";
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

            let selectedCardId = 'card-stat-total';
            if (statusVal === 'Menunggu') selectedCardId = 'card-stat-menunggu';
            else if (statusVal === 'Semua') selectedCardId = 'card-stat-semua';
            else if (statusVal === 'Verifikasi') selectedCardId = 'card-stat-verifikasi';
            else if (statusVal === 'Selesai') selectedCardId = 'card-stat-selesai';
            else if (statusVal === 'Perbaikan') selectedCardId = 'card-stat-perbaikan';

            document.getElementById(selectedCardId).className += ' stat-card-active';

            currentAdminPage = 1;
            fetchAdminDashboardData();
        }

window.switchVerifTab = function(tabName) {
            let tabDraf = document.getElementById('verif-tab-draf');
            let tabLampiran = document.getElementById('verif-tab-lampiran');
            let btnDraf = document.getElementById('btn-tab-draf');
            let btnLampiran = document.getElementById('btn-tab-lampiran');
            
            if (tabName === 'draf') {
                tabDraf.classList.remove('hidden');
                tabLampiran.classList.add('hidden');
                btnDraf.className = 'py-3 px-2 text-xs font-bold text-narmadaGreen border-b-2 border-narmadaGreen transition-colors flex items-center gap-2';
                btnLampiran.className = 'py-3 px-2 text-xs font-bold text-slate-400 border-b-2 border-transparent hover:text-slate-600 transition-colors flex items-center gap-2';
            } else {
                tabDraf.classList.add('hidden');
                tabLampiran.classList.remove('hidden');
                btnLampiran.className = 'py-3 px-2 text-xs font-bold text-narmadaGreen border-b-2 border-narmadaGreen transition-colors flex items-center gap-2';
                btnDraf.className = 'py-3 px-2 text-xs font-bold text-slate-400 border-b-2 border-transparent hover:text-slate-600 transition-colors flex items-center gap-2';
            }
        };

window.currentVerifSlide = 0;

document.addEventListener('DOMContentLoaded', () => {
    const profileTrigger = document.getElementById('admin-profile-trigger');
    const profileMenu = document.getElementById('admin-profile-menu');
    const profileChevron = document.getElementById('admin-profile-chevron');

    const notificationTrigger = document.getElementById('admin-notification-trigger');
    const notificationMenu = document.getElementById('admin-notification-menu');

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

    // --- Notification Dropdown Logic ---
    if (notificationTrigger && notificationMenu) {
        notificationTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isHidden = notificationMenu.classList.contains('hidden');
            
            if (isHidden) {
                // Show menu
                notificationMenu.classList.remove('hidden');
                setTimeout(() => {
                    notificationMenu.classList.remove('opacity-0', 'scale-95');
                    notificationMenu.classList.add('opacity-100', 'scale-100');
                }, 10);
                
                // Populate dummy data if not already populated
                const list = document.getElementById('notification-dropdown-list');
                if (list && list.innerHTML.includes('Memuat')) {
                    renderNotificationDropdown(list);
                }
            } else {
                // Hide menu
                notificationMenu.classList.remove('opacity-100', 'scale-100');
                notificationMenu.classList.add('opacity-0', 'scale-95');
                setTimeout(() => {
                    notificationMenu.classList.add('hidden');
                }, 200);
            }
        });

        document.addEventListener('click', (e) => {
            if (!notificationMenu.contains(e.target) && !notificationTrigger.contains(e.target)) {
                if (!notificationMenu.classList.contains('hidden')) {
                    notificationMenu.classList.remove('opacity-100', 'scale-100');
                    notificationMenu.classList.add('opacity-0', 'scale-95');
                    setTimeout(() => {
                        notificationMenu.classList.add('hidden');
                    }, 200);
                }
            }
        });
    }
});



document.addEventListener('DOMContentLoaded', () => {
    const formProfil = document.getElementById('form-profil');
    if (formProfil) {
        formProfil.addEventListener('submit', window.saveProfileData);
    }
});

export function showCustomConfirm(title, message, onConfirm) {
    let modal = document.getElementById('modal-custom-confirm');
    let titleEl = document.getElementById('confirm-modal-title');
    let messageEl = document.getElementById('confirm-modal-message');
    let btnOk = document.getElementById('confirm-modal-btn-ok');
    let btnCancel = document.getElementById('confirm-modal-btn-cancel');
    
    if (modal && titleEl && messageEl && btnOk && btnCancel) {
        titleEl.innerHTML = title;
        messageEl.innerHTML = message;
        
        let newBtnOk = btnOk.cloneNode(true);
        btnOk.parentNode.replaceChild(newBtnOk, btnOk);
        let newBtnCancel = btnCancel.cloneNode(true);
        btnCancel.parentNode.replaceChild(newBtnCancel, btnCancel);
        
        newBtnCancel.addEventListener('click', function() { modal.classList.add('hidden'); });
        newBtnOk.addEventListener('click', function() {
            modal.classList.add('hidden');
            if(typeof onConfirm === 'function') onConfirm();
        });
        
        modal.classList.remove('hidden');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initAdminHeader();
    
    let path = window.location.pathname;
    if (path.startsWith('/admin/')) {
        let tab = path.replace('/admin/', '');
        if (tab && tab !== 'dashboard') {
            // We use setTimeout to ensure other initializations are done
            setTimeout(function() {
                switchAdminTab(tab, false);
            }, 100);
        }
    }
});

window.triggerNewNotification = function(tipe, detailPemohon) {
    // 1. Play Sound
    playNotificationSound();
    
    // 2. Animate Bell Logo
    const bellIcon = document.getElementById('header-bell-icon');
    if (bellIcon) {
        bellIcon.classList.add('animate-ring', 'text-amber-500');
        setTimeout(() => {
            bellIcon.classList.remove('animate-ring', 'text-amber-500');
        }, 3000); // Animasi 3 detik
    }
    
    // 3. Tentukan Ikon & Tipe
    let icon = "fa-info-circle";
    let type = "info";
    
    let tipeLower = tipe.toLowerCase();
    if (tipeLower.includes("baru")) { 
        icon = "fa-file-arrow-up"; type = "success"; 
    } else if (tipeLower.includes("gagal")) { 
        icon = "fa-triangle-exclamation"; type = "error"; 
    } else if (tipeLower.includes("belum lengkap") || tipeLower.includes("revisi")) { 
        icon = "fa-file-pen"; type = "warning"; 
    }

    // 4. Tambahkan Notifikasi (akan otomatis memperbarui badge dan render ulang)
    addNotification(tipe, "Pemohon: " + detailPemohon, type, icon);
};

export const SIDEBAR_ITEMS = [
    { id: 'dashboard', icon: 'fa-house', label: 'Dashboard', action: "switchAdminTab('dashboard')" },
    { id: 'pengajuan', icon: 'fa-file-lines', label: 'Pengajuan', action: "switchAdminTab('pengajuan')" },
    { id: 'verifikasi', icon: 'fa-check-to-slot', label: 'Verifikasi Berkas', action: "switchAdminTab('dashboard')" },
    { id: 'tte', icon: 'fa-signature', label: 'Persetujuan & TTE', action: "pushToast('Fitur Persetujuan & TTE segera hadir', 'info')" },
    { id: 'data-penduduk', icon: 'fa-users', label: 'Data Penduduk', action: "pushToast('Fitur Data Penduduk segera hadir', 'info')" },
    { id: 'dokumen', icon: 'fa-folder-open', label: 'Dokumen & Surat', action: "", disabled: true },
    { id: 'daftar-layanan', icon: 'fa-layer-group', label: 'Layanan', action: "switchAdminTab('daftar-layanan')" },
    { id: 'kontak', icon: 'fa-address-book', label: 'Kontak Pelayanan', action: "switchAdminTab('kontak')" },
    { id: 'laporan', icon: 'fa-chart-simple', label: 'Laporan', action: "switchAdminTab('laporan')" },
    { id: 'beranda', icon: 'fa-gear', label: 'Pengaturan Web', action: "switchAdminTab('beranda')" },
    { id: 'kredensial', icon: 'fa-regular fa-user', label: 'Manajemen Pengguna', action: "switchAdminTab('kredensial')" },
    { id: 'aktivitas', icon: 'fa-clock-rotate-left', label: 'Log Aktivitas', action: "switchAdminTab('aktivitas')" }
];

export const AVATAR_ITEMS = [
    { id: 'pengaturan-akun', icon: 'fa-gear', label: 'Pengaturan Akun', action: "javascript:switchAdminTab('pengaturan-akun');", onclick: "document.getElementById('admin-profile-trigger').click()", colorClass: "text-slate-500", groupHoverClass: "group-hover:text-narmadaGreen", bgClass: "bg-slate-100", groupBgClass: "group-hover:bg-emerald-50", textClass: "text-slate-700 hover:bg-slate-50 hover:text-narmadaGreen" },
    { id: 'panduan', icon: 'fa-regular fa-circle-question', label: 'Bantuan & Panduan', action: "javascript:void(0);", onclick: "pushToast('Fitur Bantuan & Panduan segera hadir', 'info'); document.getElementById('admin-profile-trigger').click()", colorClass: "text-slate-500", groupHoverClass: "group-hover:text-narmadaGreen", bgClass: "bg-slate-100", groupBgClass: "group-hover:bg-emerald-50", textClass: "text-slate-700 hover:bg-slate-50 hover:text-narmadaGreen" },
    { id: 'log-saya', icon: 'fa-clock-rotate-left', label: 'Riwayat Aktivitas', action: "javascript:switchAdminTab('aktivitas');", onclick: "document.getElementById('admin-profile-trigger').click()", colorClass: "text-slate-500", groupHoverClass: "group-hover:text-narmadaGreen", bgClass: "bg-slate-100", groupBgClass: "group-hover:bg-emerald-50", textClass: "text-slate-700 hover:bg-slate-50 hover:text-narmadaGreen" },
    { id: 'divider', type: 'divider' },
    { id: 'logout', icon: 'fa-arrow-right-from-bracket', label: 'Keluar', action: "javascript:void(0)", onclick: "document.getElementById('admin-profile-trigger').click(); confirmAdminLogout();", colorClass: "text-red-500", groupHoverClass: "", bgClass: "bg-red-50", groupBgClass: "group-hover:bg-red-100", textClass: "text-red-600 hover:bg-red-50" }
];

export const ROLE_MAPPINGS = {
    "Super Admin": {
        sidebar: ['dashboard', 'pengajuan', 'verifikasi', 'tte', 'data-penduduk', 'dokumen', 'daftar-layanan', 'kontak', 'laporan', 'beranda', 'kredensial', 'aktivitas'],
        avatar: ['pengaturan-akun', 'panduan', 'log-saya', 'divider', 'logout']
    },
    "Operator Pelayanan": {
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
