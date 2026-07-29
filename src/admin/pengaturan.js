export function loadAdminSettingsForm() {
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

                document.getElementById('setelan-toggle-jam').checked = (dummySetelan.status_jam_pelayanan === "on");
                document.getElementById('setelan-toggle-alur').checked = (dummySetelan.status_alur === "on");
                document.getElementById('setelan-toggle-banner').checked = (dummySetelan.status_banner_semi === "on");
            }
        }

export function saveAdminSettings() {
            let preWa = document.getElementById('setelan-wa').value.trim();
            let formattedWaAdmin = formatWhatsAppToInternational(preWa);

            let payload = {
                kontak_wa: formattedWaAdmin,
                nama_desa: document.getElementById('setelan-nama-desa').value.trim(),
                logo_url_desa: document.getElementById('setelan-logo-url-desa').value.trim(),
                deskripsi_banner: document.getElementById('setelan-deskripsi-banner').value.trim(),
                banner_url_desa: document.getElementById('setelan-banner-url-desa').value.trim(),

                deskripsi_jam_pelayanan: document.getElementById('setelan-desc-jam').value.trim(),
                deskripsi_alur: document.getElementById('setelan-desc-alur').value.trim(),
                deskripsi_banner_semi: document.getElementById('setelan-desc-banner-semi').value.trim(),

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

export function toggleDarkModeUI(element) {
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

export let originalProfileData = {};

export function toggleEditProfile(isCancel = false) {
    const inputs = document.querySelectorAll('.profil-input');
    const actionButtons = document.getElementById('profil-action-buttons');
    const btnEdit = document.getElementById('btn-edit-profil');
    
    let isEditing = !inputs[0].hasAttribute('readonly');
    
    if (isEditing) {
        // Cancel edit
        inputs.forEach(input => {
            if (isCancel && input.id && originalProfileData[input.id] !== undefined) {
                input.value = originalProfileData[input.id];
            }
            input.setAttribute('readonly', true);
            input.classList.remove('bg-white', 'border-narmadaGreen');
            input.classList.add('bg-slate-50', 'border-slate-200');
        });
        actionButtons.classList.add('hidden');
        btnEdit.classList.remove('hidden');
    } else {
        // Start edit
        inputs.forEach(input => {
            if (input.id) {
                originalProfileData[input.id] = input.value;
            }
            input.removeAttribute('readonly');
            input.classList.remove('bg-slate-50', 'border-slate-200');
            input.classList.add('bg-white', 'border-slate-300'); // Or narmadaGreen on focus
        });
        inputs[0].focus();
        actionButtons.classList.remove('hidden');
        btnEdit.classList.add('hidden');
    }
}

export function saveProfileData(e) {
    e.preventDefault();
    
    // Add confirmation before saving
    Swal.fire({
        title: 'Konfirmasi Simpan',
        text: 'Apakah Anda yakin ingin menyimpan perubahan profil ini?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#059669',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, Simpan!',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Menyimpan...',
                text: 'Mohon tunggu sebentar',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            // Update local storage first
            const elNama = document.getElementById('input-profil-nama');
            const elEmail = document.getElementById('input-profil-email');
            const elWa = document.getElementById('input-profil-wa');
            
            const nama = elNama ? elNama.value : '';
            const email = elEmail ? elEmail.value : '';
            let wa = elWa ? elWa.value : '';
            
            if (wa && wa.startsWith('08')) {
                wa = '+628' + wa.substring(2);
                if (elWa) elWa.value = wa;
            }
            
            if (nama) {
                localStorage.setItem('userName', nama);
                const headerNama = document.getElementById('profil-header-nama');
                if (headerNama) headerNama.innerText = nama;
                
                const topbarName = document.querySelector('.admin-topbar-name');
                if (topbarName) topbarName.innerText = nama;
            }
            if (email) {
                localStorage.setItem('userEmail', email);
                const headerEmail = document.getElementById('profil-header-email');
                if (headerEmail) headerEmail.innerText = email;
            }
            if (wa) localStorage.setItem('userPhone', wa);

            const payload = {
                username: localStorage.getItem('userId'),
                nama: nama,
                email: email,
                wa: wa,
                avatar: localStorage.getItem('userAvatar') || ''
            };
            const token = localStorage.getItem('adminToken_Narmada');


            if (typeof google !== 'undefined' && google.script && google.script.run) {
                // Real backend call
                google.script.run
                    .withSuccessHandler(function (res) {
                        if (res && res.success) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Berhasil',
                                text: 'Data profil berhasil diperbarui di database.',
                                confirmButtonText: 'OK',
                                confirmButtonColor: '#059669'
                            }).then(() => {
                                toggleEditProfile(false);
                                initRBAC();
                            });
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Gagal',
                                text: res ? res.message : 'Terjadi kesalahan saat menyimpan.',
                            });
                        }
                    })
                    .withFailureHandler(function (err) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error Jaringan',
                            text: 'Gagal terhubung ke server backend.',
                        });
                    })
                    .updateProfilPengguna(token, payload);
            } else {
                // Fallback / Simulation for local dev
                setTimeout(() => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Berhasil (Simulasi)',
                        text: 'Data profil berhasil diperbarui secara lokal (Development Mode).',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#059669'
                    }).then(() => {
                        toggleEditProfile(false);
                    });
                }, 1500);
            }
        }
    });
}

export function handleProfilePhotoChange(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const avatarImg = document.getElementById('profil-avatar-img');
            if (avatarImg) {
                avatarImg.src = event.target.result;
            }
            localStorage.setItem('userAvatar', event.target.result);
            
            Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: 'Foto profil berhasil diperbarui!',
                confirmButtonColor: '#059669'
            });
        };
        reader.readAsDataURL(file);
    }
}

export function savePassword(e) {
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
    
    const token = localStorage.getItem('adminToken_Narmada');
    const username = localStorage.getItem('userId');
    
    if (!token || !isGoogleEnv) {
        pushToast("Error: Tidak dapat menghubungi server.", "error");
        return;
    }

    Swal.fire({
        title: 'Memperbarui Kata Sandi...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    google.script.run
        .withSuccessHandler(function (res) {
            if (res && res.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: 'Kata sandi Anda telah berhasil diubah.',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#059669'
                }).then(() => {
                    document.getElementById('form-password').reset();
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: res ? res.message : 'Terjadi kesalahan saat mengubah kata sandi.',
                });
            }
        })
        .withFailureHandler(function (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error Jaringan',
                text: 'Gagal terhubung ke server backend.',
            });
        })
        .updatePasswordPengguna(token, { username: username, password: newPass });
}

export function toggleSettingSwitch(button, settingName) {
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

export function mockSaveSetting(settingName) {
    pushToast(`Pengaturan ${settingName} disimpan.`, 'success');
}

export function showPengaturanAkunMenu() {
    const menuUtama = document.getElementById('pa-menu-utama');
    const contentContainer = document.getElementById('pa-content-container');
    
    if (menuUtama) {
        menuUtama.classList.remove('hidden');
        menuUtama.classList.add('block');
    }
    if (contentContainer) {
        contentContainer.classList.add('hidden');
    }
    
    // Populate profile inputs with current user data
    const nama = localStorage.getItem('userName') || 'Muhamad Alzian';
    const email = localStorage.getItem('userEmail') || 'alzian@desa-narmada.go.id';
    const phone = localStorage.getItem('userPhone') || '081234567890';
    const role = localStorage.getItem('userRole') || 'Administrator Desa';
    const userId = localStorage.getItem('userId') || 'alzian_admin';
    const avatar = localStorage.getItem('userAvatar');

    const elNama = document.getElementById('input-profil-nama');
    if (elNama) elNama.value = nama;
    const elEmail = document.getElementById('input-profil-email');
    if (elEmail) elEmail.value = email;
    const elWa = document.getElementById('input-profil-wa');
    if (elWa) elWa.value = phone;

    const avatarImg = document.getElementById('profil-avatar-img');
    if (avatarImg && avatar) {
        avatarImg.src = avatar;
    }

    const headNama = document.getElementById('profil-header-nama');
    if (headNama) headNama.innerText = nama;
    const headEmail = document.getElementById('profil-header-email');
    if (headEmail) headEmail.innerText = email;
    
    const roleBadge = document.querySelector('#pa-content-profil .bg-emerald-100');
    if (roleBadge) roleBadge.innerText = role;

    const usernameInput = document.querySelector('#pa-content-profil input[value="alzian_admin"]');
    if (usernameInput) usernameInput.value = userId;

    const roleInput = document.querySelector('#pa-content-profil input[value="Administrator Utama"]');
    if (roleInput) roleInput.value = role;
}

export function switchPengaturanAkunTab(tabId) {
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
