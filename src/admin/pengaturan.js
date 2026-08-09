export function loadAdminSettingsForm() {
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

                    document.getElementById('setelan-desc-browser').value = res.login_desc_browser || "Google Chrome atau Edge terbaru.";
                    document.getElementById('setelan-desc-kendala').value = res.login_desc_kendala || "Hubungi 0812-3456-7890 (08:00 - 16:00).";
                    document.getElementById('setelan-desc-keamanan').value = res.login_desc_keamanan || "Sistem menggunakan enkripsi data.";
                }).getAdminSetelan();

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
                status_banner_semi: document.getElementById('setelan-toggle-banner').checked ? "on" : "off",

                login_desc_browser: document.getElementById('setelan-desc-browser').value.trim(),
                login_desc_kendala: document.getElementById('setelan-desc-kendala').value.trim(),
                login_desc_keamanan: document.getElementById('setelan-desc-keamanan').value.trim()
            };

            google.script.run.withSuccessHandler(function (res) {
                    if (res && res.authError) { pushToast(res.message, "error"); handleAdminLogout(); return; }
                    if (res.success) {
                        pushToast(res.message, "success");
                        loadCMSConfigurationAndLayanan();
                    }
                }).updateAdminSetelan(localStorage.getItem('adminToken_Narmada'), payload);

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
        
        // Sembunyikan tombol avatar
        const btnUbahFoto = document.getElementById('ev-bind-20');
        if (btnUbahFoto) btnUbahFoto.classList.add('hidden');
        const btnDeleteAvatar = document.getElementById('btn-delete-avatar');
        if (btnDeleteAvatar) btnDeleteAvatar.classList.add('hidden');
        
        // Kembalikan foto profil jika dibatalkan
        if (isCancel) {
            const avatarImg = document.getElementById('profil-avatar-img');
            const originalAvatar = localStorage.getItem('userAvatar');
            if (avatarImg) {
                if (originalAvatar && originalAvatar.trim() !== '') {
                    avatarImg.src = originalAvatar;
                } else {
                    const userNameEl = document.getElementById('profil-header-nama');
                    const userName = userNameEl ? userNameEl.innerText : 'Admin';
                    avatarImg.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=0D8ABC&color=fff&size=100`;
                }
                delete avatarImg.dataset.pendingAvatar;
                delete avatarImg.dataset.pendingDelete;
            }
        }
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
        
        // Munculkan tombol avatar
        const btnUbahFoto = document.getElementById('ev-bind-20');
        if (btnUbahFoto) btnUbahFoto.classList.remove('hidden');
        
        const btnDeleteAvatar = document.getElementById('btn-delete-avatar');
        const currentAvatar = localStorage.getItem('userAvatar');
        if (btnDeleteAvatar && currentAvatar && currentAvatar.trim() !== '') {
            btnDeleteAvatar.classList.remove('hidden');
        }
    }
}

let otpInterval = null;
let pendingProfileUpdate = null;

function executeProfileSave(payload) {
    const token = localStorage.getItem('adminToken_Narmada');
    
    Swal.fire({
        title: 'Menyimpan...',
        text: 'Mohon tunggu sebentar',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    if (payload.nama) {
        localStorage.setItem('userName', payload.nama);
        const headerNama = document.getElementById('profil-header-nama');
        if (headerNama) headerNama.innerText = payload.nama;
        const topbarName = document.getElementById('admin-topbar-name');
        if (topbarName) topbarName.innerText = payload.nama;
        const headerGreetingName = document.getElementById('admin-header-name');
        if (headerGreetingName) headerGreetingName.innerText = payload.nama;
    }
    if (payload.email) {
        localStorage.setItem('userEmail', payload.email);
        const headerEmail = document.getElementById('profil-header-email');
        if (headerEmail) headerEmail.innerText = payload.email;
    }
    if (payload.wa) localStorage.setItem('userPhone', payload.wa);

    const avatarImg = document.getElementById('profil-avatar-img');
    if (avatarImg) {
        if (avatarImg.dataset.pendingDelete) {
            localStorage.removeItem('userAvatar');
            delete avatarImg.dataset.pendingDelete;
        } else if (avatarImg.dataset.pendingAvatar) {
            localStorage.setItem('userAvatar', avatarImg.dataset.pendingAvatar);
            delete avatarImg.dataset.pendingAvatar;
        }
    }

    if (typeof google !== 'undefined' && google.script && google.script.run) {
        google.script.run
            .withSuccessHandler(function (res) {
                if (res && res.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Berhasil',
                        text: 'Data profil berhasil diperbarui.',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#059669'
                    }).then(() => {
                        toggleEditProfile(false);
                        closeOtpForm();
                        // if initRBAC is needed, you can call it here. Assuming it is imported or available.
                    });
                } else {
                    Swal.fire('Gagal', res ? res.message : 'Terjadi kesalahan.', 'error');
                }
            })
            .withFailureHandler(function (err) {
                Swal.fire('Error Jaringan', 'Gagal terhubung ke server.', 'error');
            })
            .updateProfilPengguna(token, payload);
    } else {
        setTimeout(() => {
            Swal.fire('Berhasil (Simulasi)', 'Profil diperbarui.', 'success').then(() => {
                toggleEditProfile(false);
                closeOtpForm();
            });
        }, 1500);
    }
}

function startOtpTimer(durationSeconds) {
    clearInterval(otpInterval);
    const timerDisplay = document.getElementById('otp-timer');
    let timer = durationSeconds;
    
    otpInterval = setInterval(() => {
        let minutes = parseInt(timer / 60, 10);
        let seconds = parseInt(timer % 60, 10);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        timerDisplay.textContent = minutes + ":" + seconds;
        
        if (--timer < 0) {
            clearInterval(otpInterval);
            timerDisplay.textContent = "00:00 (Kedaluwarsa)";
            timerDisplay.classList.replace('text-emerald-600', 'text-red-500');
        }
    }, 1000);
}

export function verifyOTPAndSave() {
    const inputs = document.querySelectorAll('.otp-input');
    let otpCode = '';
    inputs.forEach(input => otpCode += input.value);
    
    if (otpCode.length < 6) {
        Swal.fire('OTP Tidak Lengkap', 'Masukkan 6 digit kode OTP', 'warning');
        return;
    }
    
    if (!pendingProfileUpdate) {
        closeOtpForm();
        return;
    }
    
    const token = localStorage.getItem('adminToken_Narmada');
    
    Swal.fire({
        title: 'Memverifikasi OTP...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });
    
    if (typeof google !== 'undefined' && google.script && google.script.run) {
        google.script.run
            .withSuccessHandler(function (res) {
                if (res && res.success) {
                    executeProfileSave(pendingProfileUpdate.payload);
                } else {
                    Swal.fire('Gagal Verifikasi', res ? res.message : 'OTP Salah', 'error');
                }
            })
            .withFailureHandler(function (err) {
                Swal.fire('Error', 'Gagal menghubungi server.', 'error');
            })
            .verifyContactOTP(token, pendingProfileUpdate.target, pendingProfileUpdate.type, otpCode);
    } else {
        // Local simulation
        setTimeout(() => {
            if (otpCode === '123456') {
                executeProfileSave(pendingProfileUpdate.payload);
            } else {
                Swal.fire('Gagal Verifikasi', 'OTP Salah (Gunakan 123456 untuk simulasi)', 'error');
            }
        }, 1000);
    }
}

export function bindOtpInputs() {
    const inputs = document.querySelectorAll('.otp-input');
    inputs.forEach((input, index) => {
        input.addEventListener('input', function(e) {
            // allow only numbers
            this.value = this.value.replace(/[^0-9]/g, '');
            if (this.value !== '') {
                if (index < inputs.length - 1) {
                    inputs[index + 1].focus();
                } else {
                    this.blur();
                    // auto verify
                    verifyOTPAndSave();
                }
            }
        });
        
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && this.value === '') {
                if (index > 0) {
                    inputs[index - 1].focus();
                    inputs[index - 1].value = '';
                }
            }
        });
        
        // paste handle
        input.addEventListener('paste', function(e) {
            e.preventDefault();
            const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
            if (pastedData) {
                for (let i = 0; i < pastedData.length; i++) {
                    if (inputs[index + i]) {
                        inputs[index + i].value = pastedData[i];
                    }
                }
                if (index + pastedData.length < inputs.length) {
                    inputs[index + pastedData.length].focus();
                } else {
                    inputs[inputs.length - 1].focus();
                    verifyOTPAndSave();
                }
            }
        });
    });
}

export function closeOtpForm() {
    clearInterval(otpInterval);
    document.getElementById('otp-verification-container').classList.add('hidden');
    document.getElementById('profil-action-buttons').classList.remove('hidden');
    
    // Unlock form
    document.querySelectorAll('.profil-input').forEach(input => {
        input.removeAttribute('readonly');
        input.classList.remove('bg-slate-100', 'cursor-not-allowed', 'opacity-75');
    });
    
    // Clear inputs
    document.querySelectorAll('.otp-input').forEach(input => input.value = '');
    pendingProfileUpdate = null;
}

export function saveProfileData(e) {
    e.preventDefault();
    
    const elNama = document.getElementById('input-profil-nama');
    const elEmail = document.getElementById('input-profil-email');
    const elWa = document.getElementById('input-profil-wa');
    
    const nama = elNama ? elNama.value.trim() : '';
    const email = elEmail ? elEmail.value.trim() : '';
    let wa = elWa ? elWa.value.trim() : '';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
        Swal.fire('Format Email Salah', 'Masukkan email yang valid', 'warning');
        return;
    }

    const waRegex = /^(08|\+628)\d{8,14}$/;
    if (wa && !waRegex.test(wa)) {
        Swal.fire('Format WA Salah', 'Gunakan format 08/628', 'warning');
        return;
    }
    
    if (wa && wa.startsWith('08')) {
        wa = '+628' + wa.substring(2);
        if (elWa) elWa.value = wa;
    }

    const oldEmail = localStorage.getItem('userEmail') || '';
    const oldWa = localStorage.getItem('userPhone') || '';
    
    const payload = {
        username: localStorage.getItem('userId'),
        nama: nama,
        email: email,
        wa: wa,
        avatar: localStorage.getItem('userAvatar') || ''
    };

    const isEmailChanged = email !== oldEmail && email !== '';
    const isWaChanged = wa !== oldWa && wa !== '';

    if (isEmailChanged || isWaChanged) {
        // Prepare OTP
        pendingProfileUpdate = { payload, type: isEmailChanged ? 'email' : 'wa', target: isEmailChanged ? email : wa };
        
        Swal.fire({
            title: 'Mengirim OTP...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });
        
        const token = localStorage.getItem('adminToken_Narmada');
        
        if (typeof google !== 'undefined' && google.script && google.script.run) {
            google.script.run
                .withSuccessHandler(function (res) {
                    Swal.close();
                    if (res && res.success) {
                        // Lock form
                        document.querySelectorAll('.profil-input').forEach(input => {
                            input.setAttribute('readonly', 'true');
                            input.classList.add('bg-slate-100', 'cursor-not-allowed', 'opacity-75');
                        });
                        
                        document.getElementById('profil-action-buttons').classList.add('hidden');
                        document.getElementById('otp-verification-container').classList.remove('hidden');
                        
                        document.getElementById('otp-instruction-text').innerHTML = `Kode OTP telah dikirim ke <b>${pendingProfileUpdate.target}</b>. Masukkan kode 6 digit di bawah ini.`;
                        
                        const timerDisplay = document.getElementById('otp-timer');
                        timerDisplay.classList.replace('text-red-500', 'text-emerald-600');
                        startOtpTimer(180);
                        
                        // Focus first input
                        setTimeout(() => document.querySelectorAll('.otp-input')[0].focus(), 100);
                    } else {
                        Swal.fire('Gagal Mengirim OTP', res ? res.message : 'Kesalahan server', 'error');
                    }
                })
                .withFailureHandler(function (err) {
                    Swal.fire('Error', 'Gagal menghubungi server.', 'error');
                })
                .requestContactOTP(token, pendingProfileUpdate.target, pendingProfileUpdate.type);
        } else {
            // Simulasi lokal
            setTimeout(() => {
                Swal.close();
                document.getElementById('profil-action-buttons').classList.add('hidden');
                document.getElementById('otp-verification-container').classList.remove('hidden');
                startOtpTimer(180);
                setTimeout(() => document.querySelectorAll('.otp-input')[0].focus(), 100);
            }, 1000);
        }
    } else {
        // Normal save
        executeProfileSave(payload);
    }
}

export function handleProfilePhotoChange(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            Swal.fire({
                title: 'Sesuaikan Foto Profil',
                html: `
                    <div style="max-height: 400px; overflow: hidden; width: 100%;">
                        <img id="cropper-image" src="${event.target.result}" style="max-width: 100%; display: block;">
                    </div>
                `,
                showCancelButton: true,
                confirmButtonText: 'Simpan',
                cancelButtonText: 'Batal',
                confirmButtonColor: '#059669',
                didOpen: () => {
                    const image = document.getElementById('cropper-image');
                    window.cropper = new Cropper(image, {
                        aspectRatio: 1,
                        viewMode: 1,
                        autoCropArea: 1,
                    });
                },
                preConfirm: () => {
                    if (window.cropper) {
                        return window.cropper.getCroppedCanvas({
                            width: 150,
                            height: 150
                        }).toDataURL('image/jpeg', 0.8);
                    }
                    return null;
                }
            }).then((result) => {
                if (result.isConfirmed && result.value) {
                    const dataUrl = result.value;
                    const avatarImg = document.getElementById('profil-avatar-img');
                    if (avatarImg) {
                        avatarImg.src = dataUrl;
                        avatarImg.dataset.pendingAvatar = dataUrl;
                        delete avatarImg.dataset.pendingDelete;
                    }
                    
                    const btnDelete = document.getElementById('btn-delete-avatar');
                    if (btnDelete) btnDelete.classList.remove('hidden');
                }
                
                // Bersihkan memori
                e.target.value = '';
                if (window.cropper) {
                    window.cropper.destroy();
                    window.cropper = null;
                }
            });
        };
        reader.readAsDataURL(file);
    }
}

export function deleteProfilePhoto() {
    const userNameEl = document.getElementById('profil-header-nama');
    const userName = userNameEl ? userNameEl.innerText : 'Admin';
    const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=0D8ABC&color=fff&size=100`;
    
    const avatarImg = document.getElementById('profil-avatar-img');
    if (avatarImg) {
        avatarImg.src = defaultAvatar;
        avatarImg.dataset.pendingDelete = "true";
        delete avatarImg.dataset.pendingAvatar;
    }
    
    const btnDelete = document.getElementById('btn-delete-avatar');
    if (btnDelete) btnDelete.classList.add('hidden');
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
    
    if (!token) {
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
    const nama = localStorage.getItem('userName') || '';
    const email = localStorage.getItem('userEmail') || '';
    const phone = localStorage.getItem('userPhone') || '';
    const role = localStorage.getItem('userRole') || 'Administrator Desa';
    const userId = localStorage.getItem('userId') || '';
    const avatar = localStorage.getItem('userAvatar');

    const elNama = document.getElementById('input-profil-nama');
    if (elNama) elNama.value = nama;
    const elEmail = document.getElementById('input-profil-email');
    if (elEmail) elEmail.value = email;
    const elWa = document.getElementById('input-profil-wa');
    if (elWa) elWa.value = phone;

    const avatarImg = document.getElementById('profil-avatar-img');
    const btnDeleteAvatar = document.getElementById('btn-delete-avatar');
    
    if (avatarImg) {
        if (avatar && avatar.trim() !== '') {
            avatarImg.src = avatar;
            if (btnDeleteAvatar) btnDeleteAvatar.classList.remove('hidden');
        } else {
            avatarImg.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(nama || 'User') + '&background=0D8ABC&color=fff&size=100';
            if (btnDeleteAvatar) btnDeleteAvatar.classList.add('hidden');
        }
    }

    const headerNama = document.getElementById('profil-header-nama');
    if (headerNama) headerNama.innerText = nama || 'Belum diatur';
    
    // Also update role tag under name if it exists
    const roleTag = document.querySelector('#profil-header-nama + div > span');
    if (roleTag) roleTag.innerText = role;

    const headerEmail = document.getElementById('profil-header-email');
    if (headerEmail) headerEmail.innerText = email || 'Belum ada email';
    
    const verifEmail = document.getElementById('verif-icon-email');
    if (verifEmail) {
        if (email) verifEmail.classList.remove('hidden');
        else verifEmail.classList.add('hidden');
    }

    const verifWa = document.getElementById('verif-icon-wa');
    if (verifWa) {
        if (phone) verifWa.classList.remove('hidden');
        else verifWa.classList.add('hidden');
    }

    const roleBadge = document.querySelector('#pa-content-profil .bg-emerald-100');
    if (roleBadge) roleBadge.innerText = role;

    const usernameInput = document.getElementById('admin-profile-username-view');
    if (usernameInput) usernameInput.value = userId;

    const roleText = document.getElementById('admin-profile-role-view');
    if (roleText) roleText.innerText = role;
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
    if (tabId === 'aktivitas') {
        loadActiveSessions();
    } else if (tabId === 'keamanan') {
        if (typeof window.loadLogKeamanan === 'function') {
            window.loadLogKeamanan();
        }
    }
}

window.loadLogKeamanan = function() {
    const tbody = document.getElementById('table-log-keamanan-body');
    if (!tbody) return;
    
    tbody.innerHTML = '<tr><td colspan="4" class="p-6 text-center text-slate-400 text-xs"><i class="fa-solid fa-spinner animate-spin"></i> Memuat log keamanan...</td></tr>';
    
    let token = localStorage.getItem('adminToken_Narmada');
    if (!token) return;
    
    google.script.run
            .withSuccessHandler(function(res) {
                if (res.success) {
                    renderLogKeamananTable(res.data);
                } else {
                    tbody.innerHTML = '<tr><td colspan="4" class="p-6 text-center text-red-500 text-xs">' + res.message + '</td></tr>';
                }
            })
            .withFailureHandler(function(err) {
                tbody.innerHTML = '<tr><td colspan="4" class="p-6 text-center text-red-500 text-xs">Error: ' + err + '</td></tr>';
            })
            .getLogKeamanan(token);

};

function renderLogKeamananTable(logs) {
    const tbody = document.getElementById('table-log-keamanan-body');
    if (!tbody) return;
    
    if (!logs || logs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="p-6 text-center text-slate-400 text-xs">Belum ada aktivitas keamanan.</td></tr>';
        return;
    }
    
    let html = '';
    logs.forEach(function(l) {
        let statusColor = l.status === 'Sukses' ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50';
        let actionColor = 'text-narmadaBlue';
        if (l.tindakan.toLowerCase().includes('gagal') || l.tindakan.toLowerCase().includes('hapus') || l.tindakan.toLowerCase().includes('cabut')) {
            actionColor = 'text-red-500';
        }
        
        html += `
            <tr class="hover:bg-slate-50 transition-colors">
                <td class="p-4 whitespace-nowrap"><span class="font-semibold text-slate-800">${l.waktu}</span></td>
                <td class="p-4"><span class="font-bold ${actionColor}">${l.tindakan}</span><br><span class="text-[9px] text-slate-400 border border-slate-200 rounded px-1 mt-1 inline-block ${statusColor}">${l.status}</span></td>
                <td class="p-4"><p class="text-xs text-slate-600">${l.deskripsi}</p></td>
                <td class="p-4 text-[10px] text-slate-500">
                    <span class="font-bold text-slate-700">${l.pengguna}</span><br>
                    <i class="fa-solid fa-desktop mt-1 mr-1"></i>${l.userAgent}
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

function loadActiveSessions() {
    const tbody = document.getElementById('table-active-sessions-body');
    if (!tbody) return;
    
    tbody.innerHTML = '<tr><td colspan="4" class="p-6 text-center text-slate-400 text-xs"><i class="fa-solid fa-spinner animate-spin"></i> Memuat data perangkat...</td></tr>';
    
    let token = localStorage.getItem('adminToken_Narmada');
    if (!token) return;
    
    google.script.run
            .withSuccessHandler(function(res) {
                if (res.success) {
                    renderSessionsTable(res.data);
                } else {
                    tbody.innerHTML = '<tr><td colspan="4" class="p-6 text-center text-red-500 text-xs">' + res.message + '</td></tr>';
                }
            })
            .withFailureHandler(function(err) {
                tbody.innerHTML = '<tr><td colspan="4" class="p-6 text-center text-red-500 text-xs">Error: ' + err + '</td></tr>';
            })
            .getActiveSessions(token);

}

function renderSessionsTable(sessions) {
    const tbody = document.getElementById('table-active-sessions-body');
    if (!tbody) return;
    
    if (!sessions || sessions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="p-6 text-center text-slate-400 text-xs">Tidak ada perangkat aktif.</td></tr>';
        return;
    }
    
    let html = '';
    sessions.forEach(function(s) {
        let isCurrent = s.isCurrent ? '<span class="px-2 py-0.5 bg-blue-100 text-blue-600 text-[10px] font-bold rounded">Sesi Ini</span>' : '';
        let btnAksi = s.isCurrent ? '-' : `<button onclick="window.revokeAdminSession('${s.id}')" class="text-xs font-bold text-red-500 hover:text-red-700 hover:underline">Cabut</button>`;
        
        let icon = '<i class="fa-solid fa-desktop text-slate-400 mr-2"></i>';
        if (s.deviceInfo.toLowerCase().includes('windows')) icon = '<i class="fa-brands fa-windows text-slate-400 mr-2"></i>';
        else if (s.deviceInfo.toLowerCase().includes('mac') || s.deviceInfo.toLowerCase().includes('ios')) icon = '<i class="fa-brands fa-apple text-slate-400 mr-2"></i>';
        else if (s.deviceInfo.toLowerCase().includes('android')) icon = '<i class="fa-brands fa-android text-slate-400 mr-2"></i>';
        
        html += `
            <tr class="hover:bg-slate-50 transition-colors">
                <td class="p-4 whitespace-nowrap"><span class="font-semibold text-slate-800">${s.loginTime}</span></td>
                <td class="p-4">${icon} ${s.deviceInfo}</td>
                <td class="p-4"><span class="px-2 py-0.5 bg-emerald-100 text-narmadaGreen text-[10px] font-bold rounded">Aktif</span> ${isCurrent}</td>
                <td class="p-4 text-center">${btnAksi}</td>
            </tr>
        `;
    });
    
    // Add "Cabut Semua Perangkat Lain" if there's more than 1 session
    if (sessions.length > 1) {
        html += `
            <tr class="bg-red-50/50">
                <td colspan="4" class="p-4 text-center">
                    <button onclick="window.revokeAdminSession('all_others')" class="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors">
                        <i class="fa-solid fa-power-off mr-1"></i> Cabut Akses Semua Perangkat Lain
                    </button>
                </td>
            </tr>
        `;
    }
    
    tbody.innerHTML = html;
}

window.revokeAdminSession = function(sessionId) {
    Swal.fire({
        title: 'Cabut Sesi?',
        text: sessionId === 'all_others' ? 'Semua perangkat lain akan dikeluarkan dari akun Anda.' : 'Perangkat ini akan dikeluarkan secara paksa.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#94a3b8',
        confirmButtonText: 'Ya, Cabut Sesi',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            let token = localStorage.getItem('adminToken_Narmada');
            window.pushToast("Memproses...", "info");
                google.script.run
                    .withSuccessHandler(function(res) {
                        if (res.success) {
                            window.pushToast("Sesi berhasil dicabut.", "success");
                            loadActiveSessions();
                        } else {
                            window.pushToast(res.message, "error");
                        }
                    })
                    .withFailureHandler(function(err) {
                        window.pushToast("Error: " + err, "error");
                    })
                    .revokeSession(token, sessionId);

        }
    });
};

export function promptKeamananAccess() {
    Swal.fire({
        title: 'Verifikasi Keamanan',
        html: `
            <div style="text-align: left; margin-bottom: 10px; font-size: 14px; font-weight: normal; color: #475569;">
                Masukkan kata sandi Anda saat ini untuk mengakses menu Keamanan:
            </div>
            <div style="position: relative;">
                <input id="swal-input-password" type="password" class="swal2-input" placeholder="Kata Sandi" style="width: 100%; box-sizing: border-box; margin: 0;" autocapitalize="off">
                <i id="toggle-password" class="fas fa-eye" style="position: absolute; right: 15px; top: 50%; transform: translateY(-50%); cursor: pointer; color: #64748b;"></i>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Verifikasi',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#059669',
        showLoaderOnConfirm: true,
        didOpen: () => {
            const togglePassword = document.getElementById('toggle-password');
            const passwordInput = document.getElementById('swal-input-password');
            if (togglePassword && passwordInput) {
                togglePassword.addEventListener('click', function () {
                    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                    passwordInput.setAttribute('type', type);
                    this.classList.toggle('fa-eye-slash');
                });
            }
        },
        preConfirm: () => {
            const password = document.getElementById('swal-input-password').value;
            if (!password) {
                Swal.showValidationMessage('Kata sandi tidak boleh kosong');
                return false;
            }
            const token = localStorage.getItem('adminToken_Narmada');
            if (!token) {
                return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 1000));
            }
            
            return new Promise((resolve, reject) => {
                google.script.run
                    .withSuccessHandler(res => resolve(res))
                    .withFailureHandler(err => reject(err))
                    .verifyCurrentPassword(token, password);
            }).catch(error => {
                Swal.showValidationMessage(`Gagal terhubung: ${error}`);
            });
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed) {
            if (result.value && result.value.success) {
                switchPengaturanAkunTab('keamanan');
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Akses Ditolak',
                    text: result.value ? result.value.message : 'Kata sandi salah.'
                });
            }
        }
    });
}
