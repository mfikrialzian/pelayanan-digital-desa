window.AppState = {
            activeView: 'beranda',
            activeAdminTab: 'dashboard',
            currentAdminPage: 1,
            adminKeyword: '',
            activeStatusFilter: '',
            selectedLayananGlobal: null,
            uploadDataStore: {},
            currentWizardStep: 1,
            globalSettings: {},
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
            try {
                    google.script.run
                        .withSuccessHandler(function (res) {
                            globalSettings = res;
                            applyCMSConfigurations(res);
                            loadLayananDataWarga();
                        })
                        .withFailureHandler(function () {
                            
                            loadLayananDataWarga();
                        })
                        .getAdminSetelan();
                } catch (e) {
                    
                    loadLayananDataWarga();
                }

        }

        function applyCMSConfigurations(settings) {
window.titleWarga = document.getElementById('warga-title-view');
window.logoWarga = document.getElementById('warga-logo-img');
window.logoAdmin = document.getElementById('admin-logo-img');
window.logoAdminLogin = document.getElementById('admin-login-logo');

            if (titleWarga) titleWarga.innerText = settings.nama_desa.toUpperCase();

window.defaultLogo = settings.logo_url_desa;
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

window.infoBrowserDesc = document.getElementById('info-browser-desc');
window.infoKendalaDesc = document.getElementById('info-kendala-desc');
window.infoKeamananDesc = document.getElementById('info-keamanan-desc');
            
            if (infoBrowserDesc && settings.login_desc_browser) infoBrowserDesc.innerText = settings.login_desc_browser;
            if (infoKendalaDesc && settings.login_desc_kendala) infoKendalaDesc.innerText = settings.login_desc_kendala;
            if (infoKeamananDesc && settings.login_desc_keamanan) infoKeamananDesc.innerText = settings.login_desc_keamanan;

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
        
        window.dummyLayananList = [];
