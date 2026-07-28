window.dummyLayananList = [
            {
                id: "LAY-001",
                nama: "Surat Keterangan Usaha (SKU)",
                deskripsi: "Untuk pengurusan legalitas usaha dan modal bank.",
                judulSectionIsian: "Melamar Pekerjaan,Pengajuan Kredit Usaha Rakyat (KUR)",
                deskripsiSectionIsian: "Pilih keperluan pengurusan surat Anda.",
                logikaKondisional: "[]",
                fields: [
                    { id: "FLD-001", name: "{Wajib;;Data Usaha} Nama Usaha", type: "text", options: "", required: "ya", label: "Nama Usaha" },
                    { id: "FLD-002", name: "{Melamar Pekerjaan;;Posisi} Posisi yang dilamar", type: "text", options: "", required: "ya", label: "Posisi" }
                ],
                requirements: [
                    { id: "REQ-001", name: "[Wajib] Foto KTP Asli Pemohon" },
                    { id: "REQ-002", name: "[Wajib] Foto Kartu Keluarga (KK)" },
                    { id: "REQ-003", name: "[Pengajuan Kredit Usaha Rakyat (KUR)] Foto Lokasi Tempat Usaha" }
                ]
            },
            {
                id: "LAY-002",
                nama: "Permohonan KK Barcode",
                deskripsi: "Untuk pengurusan Kartu Keluarga dengan barcode.",
                judulSectionIsian: "Rubah Pendidikan Anak,Penambahan Anggota Keluarga",
                deskripsiSectionIsian: "Pilih keperluan permohonan KK Barcode Anda.",
                logikaKondisional: "[]",
                fields: [
                    { id: "FLD-KK-001", name: "{Wajib;;Data Pemohon} Nama Kepala Keluarga", type: "text", options: "", required: "ya", label: "Nama Kepala Keluarga" },
                    { id: "FLD-KK-002", name: "{Wajib;;Data Pemohon} Nomor KK", type: "text", options: "", required: "ya", label: "Nomor KK" },
                    { id: "FLD-KK-003", name: "{Rubah Pendidikan Anak;;Data Anak} Nama Lengkap Anak", type: "text", options: "", required: "ya", label: "Nama Lengkap Anak" },
                    { id: "FLD-KK-004", name: "{Rubah Pendidikan Anak;;Data Anak} Pendidikan Anak", type: "dropdown", options: "TIDAK/BELUM SEKOLAH,SD/SEDERAJAT,SMP/SEDERAJAT,SMA/SEDERAJAT,DIPLOMA,SARJANA", required: "ya", label: "Pendidikan Anak" }
                ],
                requirements: [
                    { id: "REQ-KK-001", name: "[Wajib] Foto KTP Asli Pemohon" },
                    { id: "REQ-KK-002", name: "[Wajib] Foto Kartu Keluarga (KK) Lama" }
                ]
            }
        ];



window.dummyPengajuanList = [
            {
                id: "REQ-20260701-0001",
                tanggal: "01/07/2026 10:00:00",
                nik: "3275011212950001",
                nama: "Budi Santoso",
                layanan: "Surat Keterangan Usaha (SKU)",
                wa: "+6281234567890",
                alamat: "Jalan Melati No. 4, Dusun Narmada Barat",
                linkDokumen: "[Wajib] Foto KTP Asli Pemohon: https://placehold.co/100x75?text=KTP, \n [Wajib] Foto Kartu Keluarga (KK): https://placehold.co/100x75?text=KK",
                status: "Verifikasi",
                catatan: "Menunggu verifikasi berkas digital oleh admin.",
                detailLayanan: "Keperluan Surat: Pengajuan Kredit Usaha Rakyat (KUR) | Nama Usaha: Toko Kelontong Budi"
            },
            {
                id: "REQ-20260701-0002",
                tanggal: "01/07/2026 14:30:00",
                nik: "3275011212950002",
                nama: "Siti Aminah",
                layanan: "Permohonan KK Barcode",
                wa: "+6289876543210",
                alamat: "Jalan Mawar No. 12, Dusun Narmada Timur",
                linkDokumen: "[Wajib] Foto KTP Asli Pemohon: https://placehold.co/100x75?text=KTP, \n [Wajib] Foto Kartu Keluarga (KK) Lama: https://placehold.co/100x75?text=KK",
                status: "Verifikasi",
                catatan: "Menunggu verifikasi berkas digital oleh admin.",
                detailLayanan: "Keperluan Surat: Rubah Pendidikan Anak | Nama Kepala Keluarga: AHMAD FAUZI | Nomor KK: 5204011234560001 | Nama Lengkap Anak: ANDI FAUZI; SARI FAUZI | Pendidikan Anak: SMP/SEDERAJAT; SMA/SEDERAJAT"
            }
        ];


window.dummySetelan = {
            username: "", // Dihapus untuk keamanan
            password: "", // Dihapus untuk keamanan
            kontak_wa: "+6281234567890",
            nama_desa: "Narmada",
            logo_url_desa: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Coat_of_arms_of_Indonesia_Garuda_Pancasila.svg",
            deskripsi_banner: "Urus kebutuhan administrasi desa lebih mudah, cepat, dan transparan.",
            banner_url_desa: "",
            status_jam_pelayanan: "on",
            deskripsi_jam_pelayanan: "Senin - Jumat 08.00 - 14.00 WITA",
            status_alur: "on",
            deskripsi_alur: "Ajukan Online -> Verifikasi -> Serahkan Berkas Fisik -> Ambil Surat",
            status_banner_semi: "on",
            deskripsi_banner_semi: "Anda dapat mengajukan permohonan secara online dari rumah. Setelah permohonan diverifikasi, silakan datang ke kantor desa untuk menyerahkan dokumen fisik sesuai dengan persyaratan."
        };

        window.AppState = {
            activeView: 'beranda',
            activeAdminTab: 'dashboard',
            currentAdminPage: 1,
            adminKeyword: '',
            activeStatusFilter: '',
            selectedLayananGlobal: null,
            uploadDataStore: {},
            currentWizardStep: 1,
            globalSettings: Object.assign({}, dummySetelan),
            isGoogleEnv: typeof google !== 'undefined' && typeof google.script !== 'undefined',
            isServiceOpen: false,
            editingQuestionIndex: -1
        };

        // Backward compatibility pointers (to be fully migrated in Phase 4)
window.activeView = window.AppState.activeView;
window.activeAdminTab = window.AppState.activeAdminTab;
window.currentAdminPage = window.AppState.currentAdminPage;
window.adminKeyword = window.AppState.adminKeyword;
window.activeStatusFilter = window.AppState.activeStatusFilter;

window.selectedLayananGlobal = window.AppState.selectedLayananGlobal;
window.uploadDataStore = window.AppState.uploadDataStore;
window.currentWizardStep = window.AppState.currentWizardStep;
window.globalSettings = window.AppState.globalSettings;
window.isGoogleEnv = window.AppState.isGoogleEnv;
        window.isServiceOpen = window.AppState.isServiceOpen;
        window.editingQuestionIndex = window.AppState.editingQuestionIndex;

window.builderActiveStep = 1;
window.builderQuestions = [];
window.builderReqMap = {};


        window.initApp = function () {
            setupInputRestrictions();
            checkServiceStatus();
            loadCMSConfigurationAndLayanan();

window.formWrapper = document.getElementById('wrapper-formulir-pengajuan');
            if (formWrapper) {
                formWrapper.addEventListener('input', function (e) {
                    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
                        saveWargaDraft();
                    }
                });
            }

window.initialPageParam = 'warga';
window.paramEl = document.getElementById('initial-page-param');
            if (paramEl && paramEl.value) {
                window.initialPageParam = paramEl.value.trim().toLowerCase();
            }
window.urlParams = new URLSearchParams(window.location.search);
window.pathname = window.location.pathname.toLowerCase();
            
            if (urlParams.has('page')) {
                window.initialPageParam = urlParams.get('page').trim().toLowerCase();
            } else if (pathname === '/admin' || pathname.startsWith('/admin/')) {
                window.initialPageParam = 'admin';
            }

            if (window.initialPageParam === 'admin') {
                if (localStorage.getItem('adminToken_Narmada')) {
                    switchView('admin');
                } else {
                    switchView('admin-login');
                }
            } else {
                switchView('beranda');
            }
        };

        function checkServiceStatus() {
window.el = document.getElementById('lbl-desc-jam-pelayanan');
            if (!el) return;
window.now = new Date();
window.day = now.getDay();
window.hour = now.getHours();

window.isBuka = false;
            if (day >= 1 && day <= 5 && hour >= 8 && hour < 14) {
                window.isBuka = true;
            }

            window.isServiceOpen = window.isBuka;

window.daysMap = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
window.dayName = daysMap[day];

window.timeTxt = (day === 0 || day === 6) ? "Tutup/Libur" : "Jam 08.00 - 14.00";
window.topText = dayName + " " + timeTxt;

            if (isBuka) {
                el.innerHTML = topText + "<br><span class='text-emerald-600 font-semibold mt-1 block text-xs'>Pelayanan Sudah Buka. Silahkan Buat Pengajuan</span>";
            } else {
                el.innerHTML = topText + "<br><span class='text-red-600 font-semibold mt-1 block text-xs'>Maaf Pelayanan Sudah Tutup. Silahkan Kembali Besok</span>";
            }
            el.className = "text-xs font-medium text-slate-600 mt-1";
        }
        function loadCMSConfigurationAndLayanan() {
            if (isGoogleEnv) {
                try {
                    google.script.run
                        .withSuccessHandler(function (res) {
                            globalSettings = res;
                            applyCMSConfigurations(res);
                            loadLayananDataWarga();
                        })
                        .withFailureHandler(function () {
                            applyCMSConfigurations(dummySetelan);
                            loadLayananDataWarga();
                        })
                        .getAdminSetelan();
                } catch (e) {
                    applyCMSConfigurations(dummySetelan);
                    loadLayananDataWarga();
                }
            } else {
                applyCMSConfigurations(dummySetelan);
                loadLayananDataWarga();
            }
        }

        function applyCMSConfigurations(settings) {
window.titleWarga = document.getElementById('warga-title-view');
window.logoWarga = document.getElementById('warga-logo-img');
window.logoAdmin = document.getElementById('admin-logo-img');
window.logoAdminLogin = document.getElementById('admin-login-logo');

            if (titleWarga) titleWarga.innerText = settings.nama_desa.toUpperCase();

window.defaultLogo = settings.logo_url_desa || dummySetelan.logo_url_desa;
            // Konversi jika itu adalah link Google Drive
window.finalLogo = defaultLogo.indexOf('drive.google.com') !== -1 ? getDirectDriveImageUrl(defaultLogo) : defaultLogo;

            if (logoWarga) logoWarga.src = finalLogo;
            if (logoAdmin) logoAdmin.src = finalLogo;
            if (logoAdminLogin) logoAdminLogin.src = finalLogo;

window.titleAdmin = document.getElementById('admin-title-view');
            if (titleAdmin) titleAdmin.innerText = settings.nama_desa.toUpperCase();

window.bannerName = document.getElementById('banner-desa-name');
window.bannerDesc = document.getElementById('banner-desa-desc');
            if (bannerName) bannerName.innerText = "Desa " + settings.nama_desa;
            if (bannerDesc) bannerDesc.innerText = settings.deskripsi_banner;

window.lblAlur = document.getElementById('lbl-desc-alur-pelayanan');
window.lblSemi = document.getElementById('lbl-desc-semi-digital');

            if (lblAlur) lblAlur.innerText = settings.deskripsi_alur;
            if (lblSemi) lblSemi.innerText = settings.deskripsi_banner_semi;

window.infoJam = document.getElementById('warga-info-jam');
window.infoAlur = document.getElementById('warga-info-alur');
window.infoBannerSemi = document.getElementById('warga-info-banner-semi');

            if (infoJam) {
                if (settings.status_jam_pelayanan === "on") infoJam.classList.remove('hidden');
                else infoJam.classList.add('hidden');
            }
            if (infoAlur) {
                if (settings.status_alur === "on") infoAlur.classList.remove('hidden');
                else infoAlur.classList.add('hidden');
            }
            if (infoBannerSemi) {
                if (settings.status_banner_semi === "on") infoBannerSemi.classList.remove('hidden');
                else infoBannerSemi.classList.add('hidden');
            }

window.bannerImg = document.getElementById('warga-banner-img');
            if (bannerImg) {
window.rawBanner = settings.banner_url_desa || "";
                bannerImg.src = rawBanner.indexOf('drive.google.com') !== -1 ? getDirectDriveImageUrl(rawBanner) : rawBanner;
            }

window.formattedWa = formatWhatsAppToInternational(settings.kontak_wa);
window.waLink = "https://wa.me/" + formattedWa.replace('+', '');
window.elLink = document.getElementById('link-wa-warga-beranda');
            if (elLink) elLink.href = waLink;

            checkServiceStatus();
        }


        function switchView(viewId) {
window.viewAdminLogin = document.getElementById('view-admin-login');
            if (viewId === 'admin') {
                document.getElementById('citizen-workspace').classList.add('hidden');
                if (viewAdminLogin) viewAdminLogin.classList.add('hidden');
                document.getElementById('admin-workspace').classList.remove('hidden');
                window.activeView = 'admin';
                window.currentAdminPage = 1;
                fetchAdminStats();
                loadBuilderLayananList();
                loadAdminSettingsForm();
                if (typeof initRBAC === 'function') initRBAC();
                
                if (typeof initAdminCharts === 'function') {
                    setTimeout(initAdminCharts, 100); // Tunggu DOM render sejenak
                }
            } else if (viewId === 'admin-login') {
                document.getElementById('citizen-workspace').classList.add('hidden');
                document.getElementById('admin-workspace').classList.add('hidden');
                if (viewAdminLogin) viewAdminLogin.classList.remove('hidden');
                window.activeView = 'admin-login';
            } else {
window.prevView = window.activeView;
                document.getElementById('admin-workspace').classList.add('hidden');
                if (viewAdminLogin) viewAdminLogin.classList.add('hidden');
                document.getElementById('citizen-workspace').classList.remove('hidden');

                document.getElementById('view-beranda').classList.add('hidden');
                document.getElementById('view-layanan').classList.add('hidden');
                document.getElementById('view-status').classList.add('hidden');

                document.getElementById('view-beranda').classList.remove('slide-in-forward', 'slide-in-backward');
                document.getElementById('view-layanan').classList.remove('slide-in-forward', 'slide-in-backward');
                document.getElementById('view-status').classList.remove('slide-in-forward', 'slide-in-backward');

window.targetEl = document.getElementById('view-' + viewId);
                targetEl.classList.remove('hidden');

                if (viewId === 'beranda' && prevView !== 'beranda') {
                    targetEl.classList.add('slide-in-backward');
                } else if (viewId !== 'beranda' && prevView === 'beranda') {
                    targetEl.classList.add('slide-in-forward');
                }

                window.activeView = viewId;
            }
        }

        window.switchView = switchView;
        window.checkServiceStatus = checkServiceStatus;
        window.loadCMSConfigurationAndLayanan = loadCMSConfigurationAndLayanan;
