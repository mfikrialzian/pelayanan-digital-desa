var dummyLayananList = [
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



        var dummyPengajuanList = [
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


        var dummySetelan = {
            username: "admin_narmada",
            password: "Narmada2026",
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

        var activeView = 'beranda';
        var activeAdminTab = 'dashboard';
        var currentAdminPage = 1;
        var adminKeyword = '';
        var activeStatusFilter = '';

        var selectedLayananGlobal = null;
        var uploadDataStore = {};
        var currentWizardStep = 1;
        var globalSettings = Object.assign({}, dummySetelan);
        var isGoogleEnv = typeof google !== 'undefined';
        window.isServiceOpen = false;
        window.editingQuestionIndex = -1; // Variabel Global State Edit Pertanyaan

        var builderActiveStep = 1;
        var builderQuestions = [];
        var builderReqMap = {};


        window.onload = function () {
            setupInputRestrictions();
            checkServiceStatus();
            loadCMSConfigurationAndLayanan();

            var formWrapper = document.getElementById('wrapper-formulir-pengajuan');
            if (formWrapper) {
                formWrapper.addEventListener('input', function (e) {
                    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
                        saveWargaDraft();
                    }
                });
            }

            var initialPageParam = 'warga';
            var paramEl = document.getElementById('initial-page-param');
            if (paramEl && paramEl.value) {
                initialPageParam = paramEl.value.trim().toLowerCase();
            }
            var urlParams = new URLSearchParams(window.location.search);
            if (urlParams.has('page')) {
                initialPageParam = urlParams.get('page').trim().toLowerCase();
            }

            if (initialPageParam === 'admin') {
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
            var el = document.getElementById('lbl-desc-jam-pelayanan');
            if (!el) return;
            var now = new Date();
            var day = now.getDay();
            var hour = now.getHours();

            var isBuka = false;
            if (day >= 1 && day <= 5 && hour >= 8 && hour < 14) {
                isBuka = true;
            }

            window.isServiceOpen = isBuka;

            var daysMap = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
            var dayName = daysMap[day];

            var timeTxt = (day === 0 || day === 6) ? "Tutup/Libur" : "Jam 08.00 - 14.00";
            var topText = dayName + " " + timeTxt;

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
            var titleWarga = document.getElementById('warga-title-view');
            var logoWarga = document.getElementById('warga-logo-img');
            var logoAdmin = document.getElementById('admin-logo-img');
            var logoAdminLogin = document.getElementById('admin-login-logo');

            if (titleWarga) titleWarga.innerText = settings.nama_desa.toUpperCase();

            var defaultLogo = settings.logo_url_desa || dummySetelan.logo_url_desa;
            // Konversi jika itu adalah link Google Drive
            var finalLogo = defaultLogo.indexOf('drive.google.com') !== -1 ? getDirectDriveImageUrl(defaultLogo) : defaultLogo;

            if (logoWarga) logoWarga.src = finalLogo;
            if (logoAdmin) logoAdmin.src = finalLogo;
            if (logoAdminLogin) logoAdminLogin.src = finalLogo;

            var titleAdmin = document.getElementById('admin-title-view');
            if (titleAdmin) titleAdmin.innerText = settings.nama_desa.toUpperCase();

            var bannerName = document.getElementById('banner-desa-name');
            var bannerDesc = document.getElementById('banner-desa-desc');
            if (bannerName) bannerName.innerText = "Desa " + settings.nama_desa;
            if (bannerDesc) bannerDesc.innerText = settings.deskripsi_banner;

            var lblAlur = document.getElementById('lbl-desc-alur-pelayanan');
            var lblSemi = document.getElementById('lbl-desc-semi-digital');

            if (lblAlur) lblAlur.innerText = settings.deskripsi_alur;
            if (lblSemi) lblSemi.innerText = settings.deskripsi_banner_semi;

            var infoJam = document.getElementById('warga-info-jam');
            var infoAlur = document.getElementById('warga-info-alur');
            var infoBannerSemi = document.getElementById('warga-info-banner-semi');

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

            var bannerImg = document.getElementById('warga-banner-img');
            if (bannerImg) {
                var rawBanner = settings.banner_url_desa || "";
                bannerImg.src = rawBanner.indexOf('drive.google.com') !== -1 ? getDirectDriveImageUrl(rawBanner) : rawBanner;
            }

            var formattedWa = formatWhatsAppToInternational(settings.kontak_wa);
            var waLink = "https://wa.me/" + formattedWa.replace('+', '');
            var elLink = document.getElementById('link-wa-warga-beranda');
            if (elLink) elLink.href = waLink;

            checkServiceStatus();
        }


        function switchView(viewId) {
            var viewAdminLogin = document.getElementById('view-admin-login');
            if (viewId === 'admin') {
                document.getElementById('citizen-workspace').classList.add('hidden');
                if (viewAdminLogin) viewAdminLogin.classList.add('hidden');
                document.getElementById('admin-workspace').classList.remove('hidden');
                activeView = 'admin';
                currentAdminPage = 1;
                fetchAdminStats();
                loadBuilderLayananList();
                loadAdminSettingsForm();
            } else if (viewId === 'admin-login') {
                document.getElementById('citizen-workspace').classList.add('hidden');
                document.getElementById('admin-workspace').classList.add('hidden');
                if (viewAdminLogin) viewAdminLogin.classList.remove('hidden');
                activeView = 'admin-login';
            } else {
                var prevView = activeView;
                document.getElementById('admin-workspace').classList.add('hidden');
                if (viewAdminLogin) viewAdminLogin.classList.add('hidden');
                document.getElementById('citizen-workspace').classList.remove('hidden');

                document.getElementById('view-beranda').classList.add('hidden');
                document.getElementById('view-layanan').classList.add('hidden');
                document.getElementById('view-status').classList.add('hidden');

                document.getElementById('view-beranda').classList.remove('slide-in-forward', 'slide-in-backward');
                document.getElementById('view-layanan').classList.remove('slide-in-forward', 'slide-in-backward');
                document.getElementById('view-status').classList.remove('slide-in-forward', 'slide-in-backward');

                var targetEl = document.getElementById('view-' + viewId);
                targetEl.classList.remove('hidden');

                if (viewId === 'beranda' && prevView !== 'beranda') {
                    targetEl.classList.add('slide-in-backward');
                } else if (viewId !== 'beranda' && prevView === 'beranda') {
                    targetEl.classList.add('slide-in-forward');
                }

                activeView = viewId;
            }
        }
