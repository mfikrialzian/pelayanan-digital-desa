export function runAdminLoginAuth() {
            let u = document.getElementById('login-username').value.trim();
            let p = document.getElementById('login-password').value.trim();
            let btn = document.getElementById('btn-submit-login');

            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i> Login...';

            function getDeviceInfo() {
                let ua = navigator.userAgent;
                let browser = "Web Browser";
                let os = "Device";
                if (ua.indexOf("Chrome") > -1) browser = "Chrome";
                else if (ua.indexOf("Safari") > -1) browser = "Safari";
                else if (ua.indexOf("Firefox") > -1) browser = "Firefox";
                else if (ua.indexOf("Edge") > -1) browser = "Edge";
                
                if (ua.indexOf("Win") > -1) os = "Windows";
                else if (ua.indexOf("Mac") > -1) os = "MacOS";
                else if (ua.indexOf("Linux") > -1) os = "Linux";
                else if (ua.indexOf("Android") > -1) os = "Android";
                else if (ua.indexOf("like Mac") > -1) os = "iOS";
                return browser + " on " + os;
            }
            let deviceInfo = getDeviceInfo();

            if (isGoogleEnv) {
                google.script.run
                    .withSuccessHandler(function (res) {
                        btn.disabled = false;
                        btn.innerHTML = '<span>Login</span>';
                        if (res.success) {
                            localStorage.setItem('adminToken_Narmada', res.token);
                            localStorage.setItem('userRole', res.role || 'Super Admin');
                            localStorage.setItem('userName', res.name || 'Admin');
                            localStorage.setItem('userId', u);
                            if (res.email) localStorage.setItem('userEmail', res.email); else localStorage.removeItem('userEmail');
                            if (res.wa) localStorage.setItem('userPhone', res.wa); else localStorage.removeItem('userPhone');
                            if (res.avatar) localStorage.setItem('userAvatar', res.avatar); else localStorage.removeItem('userAvatar');
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
                    .checkAdminLogin(u, p, deviceInfo);
            } else {
                setTimeout(function () {
                    btn.disabled = false;
                    btn.innerHTML = '<span>Login</span>';
                    
                    let userMatch = window.usersData.find(function(user) {
                        return user.username === u && user.password === p;
                    });

                    if (userMatch) {
                        localStorage.setItem('adminToken_Narmada', 'dummy-token');
                        localStorage.setItem('userRole', userMatch.role || 'Super Admin');
                        localStorage.setItem('userName', userMatch.name || 'Admin');
                        if (userMatch.email) localStorage.setItem('userEmail', userMatch.email); else localStorage.removeItem('userEmail');
                        if (userMatch.nik) localStorage.setItem('userNIK', userMatch.nik); else localStorage.removeItem('userNIK');
                        if (userMatch.phone) localStorage.setItem('userPhone', userMatch.phone); else localStorage.removeItem('userPhone');
                        if (userMatch.avatar) localStorage.setItem('userAvatar', userMatch.avatar); else localStorage.removeItem('userAvatar');
                        localStorage.setItem('userId', userMatch.username || 'admin');
                        initRBAC();
                        switchView('admin');
                    } else {
                        pushToast("Kredensial login admin salah!", "error");
                    }
                }, 800);
            }
        }

export function confirmAdminLogout() {
            askConfirmation("Konfirmasi Keluar", "Apakah Anda yakin ingin keluar dari Dashboard Admin?", function() {
                handleAdminLogout();
            });
        }

export function handleAdminLogout() {
            let token = localStorage.getItem('adminToken_Narmada');
            if (token && isGoogleEnv) {
                google.script.run.logoutAdmin(token);
            }
            localStorage.removeItem('adminToken_Narmada');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userNIK');
            localStorage.removeItem('userPhone');
            localStorage.removeItem('userAvatar');
            localStorage.removeItem('userId');
            pushToast("Berhasil keluar dari Dashboard Admin.", "info");
            switchView('admin-login');
        }

        export function initRBAC() {
            let role = localStorage.getItem('userRole') || 'Admin';
            let userName = localStorage.getItem('userName') || 'Administrator';
            let mapping = ROLE_MAPPINGS[role] || ROLE_MAPPINGS['Admin'];
            
            // Update Profile Name, Role, and Avatar in UI (Header)
            const nameEl = document.getElementById('admin-header-name');
            const roleEl = document.getElementById('admin-header-role');
            const topbarName = document.getElementById('admin-topbar-name');
            const topbarRole = document.getElementById('admin-topbar-role');
            const topbarAvatar = document.getElementById('admin-topbar-avatar');
            
            let userAvatar = localStorage.getItem('userAvatar');
            if (!userAvatar || userAvatar.trim() === '') {
                userAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=0D8ABC&color=fff`;
            }

            if (nameEl) nameEl.textContent = userName;
            if (roleEl) roleEl.textContent = role + ' Desa Narmada';
            
            if (topbarName) topbarName.textContent = userName;
            if (topbarRole) topbarRole.textContent = role;
            if (topbarAvatar) topbarAvatar.src = userAvatar;

            // Render Sidebar
            let sidebarNav = document.getElementById('admin-sidebar-nav');
            if (sidebarNav) {
                sidebarNav.innerHTML = '';
                mapping.sidebar.forEach(function(itemId) {
                    let item = SIDEBAR_ITEMS.find(function(i) { return i.id === itemId; });
                    if (item) {
                        let disabledAttr = item.disabled ? 'disabled=""' : '';
                        let btnHtml = '<button id="tab-adm-' + item.id + '" onclick="' + item.action + '" ' + disabledAttr + ' class="w-full text-left flex items-center px-3 py-2.5 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-semibold text-sm transition-colors">' +
                                      '<i class="fa-solid ' + item.icon + ' w-5 text-center mr-2"></i> ' + item.label +
                                      '</button>';
                        sidebarNav.innerHTML += btnHtml;
                    }
                });
            }

            // Render Avatar Menu
            let avatarMenu = document.getElementById('admin-profile-menu');
            if (avatarMenu) {
                avatarMenu.innerHTML = '<div class="px-4 py-2 border-b border-slate-100 mb-2">' +
                                       '<p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Akun Saya</p>' +
                                       '</div>';
                
                mapping.avatar.forEach(function(itemId) {
                    let item = AVATAR_ITEMS.find(function(i) { return i.id === itemId; });
                    if (item) {
                        if (item.type === 'divider') {
                            avatarMenu.innerHTML += '<div class="my-1 border-t border-slate-100"></div>';
                        } else {
                        let targetAttr = item.target ? 'target="' + item.target + '"' : '';
                        let clickAttr = item.onclick ? 'onclick="' + item.onclick + '"' : '';
                        let linkHtml = '<a href="' + item.action + '" ' + targetAttr + ' ' + clickAttr + ' class="flex items-center gap-3 px-4 py-2 text-sm transition-colors group ' + item.textClass + '">' +
                                       '<div class="w-8 h-8 rounded-full flex items-center justify-center transition-colors ' + item.bgClass + ' ' + item.groupBgClass + '">' +
                                       '<i class="fa-solid ' + item.icon + ' transition-colors ' + item.colorClass + ' ' + item.groupHoverClass + '"></i>' +
                                       '</div>' +
                                       '<span class="font-semibold">' + item.label + '</span>' +
                                       '</a>';
                        avatarMenu.innerHTML += linkHtml;
                    }
                }
            });
        }
        
        // Show or Hide "Tambah Pengguna" button
        let btnTambah = document.getElementById('ev-bind-44');
        if (btnTambah) {
            if (role === 'Super Admin') {
                btnTambah.classList.remove('hidden');
            } else {
                btnTambah.classList.add('hidden');
            }
        }
    }

export function initAdminHeader() {
    const greetingEl = document.getElementById('admin-header-greeting');
    const nameEl = document.getElementById('admin-header-name');
    const roleEl = document.getElementById('admin-header-role');
    const dateEl = document.getElementById('admin-current-date');

    if (!dateEl) return; // Exit if not on admin page


    function updateDateTime() {
        const now = new Date();
        const hour = now.getHours();
        
        // Greeting logic
        let greeting = 'Selamat Pagi';
        if (hour >= 11 && hour < 15) {
            greeting = 'Selamat Siang';
        } else if (hour >= 15 && hour < 18) {
            greeting = 'Selamat Sore';
        } else if (hour >= 18 || hour < 4) {
            greeting = 'Selamat Malam';
        }
        if (greetingEl) greetingEl.innerHTML = `${greeting},`;

        // Time logic
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        
        const dayName = days[now.getDay()];
        const day = now.getDate();
        const monthName = months[now.getMonth()];
        const year = now.getFullYear();
        
        if (dateEl) {
            dateEl.textContent = `${dayName}, ${day} ${monthName} ${year}`;
        }
    }

    updateDateTime();
    setInterval(updateDateTime, 1000);
    fetchWeather();
}

let forgotTimerInterval;
let forgotIdentifier = '';

export function showForgotPassword() {
    document.getElementById('ev-bind-9').classList.add('hidden'); // form-login
    document.getElementById('form-forgot-password').classList.remove('hidden');
    document.getElementById('forgot-step-1').classList.remove('hidden');
    document.getElementById('forgot-step-2').classList.add('hidden');
    document.getElementById('forgot-step-3').classList.add('hidden');
    document.getElementById('forgot-identifier').value = '';
}

export function showLogin() {
    document.getElementById('form-forgot-password').classList.add('hidden');
    document.getElementById('ev-bind-9').classList.remove('hidden');
    clearInterval(forgotTimerInterval);
}

export function requestForgotOTP() {
    forgotIdentifier = document.getElementById('forgot-identifier').value.trim();
    if (!forgotIdentifier) {
        pushToast('Masukkan Username atau Email!', 'warning');
        return;
    }
    
    let method = document.querySelector('input[name="forgot_method"]:checked').value;
    let btn = document.getElementById('btn-submit-forgot');
    
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i> Mengirim...';
    
    if (isGoogleEnv) {
        google.script.run
            .withSuccessHandler(function (res) {
                btn.disabled = false;
                btn.innerHTML = 'Kirim Kode OTP';
                if (res.success) {
                    pushToast('OTP berhasil dikirim ke ' + method + ' Anda', 'success');
                    document.getElementById('forgot-step-1').classList.add('hidden');
                    document.getElementById('forgot-step-2').classList.remove('hidden');
                    startForgotOtpTimer();
                } else {
                    pushToast(res.message, 'error');
                }
            })
            .withFailureHandler(function (err) {
                btn.disabled = false;
                btn.innerHTML = 'Kirim Kode OTP';
                pushToast('Error: ' + err, 'error');
            })
            .requestResetOTP(forgotIdentifier, method);
    } else {
        setTimeout(function() {
            btn.disabled = false;
            btn.innerHTML = 'Kirim Kode OTP';
            pushToast('Simulasi: OTP terkirim ke ' + forgotIdentifier, 'success');
            document.getElementById('forgot-step-1').classList.add('hidden');
            document.getElementById('forgot-step-2').classList.remove('hidden');
            startForgotOtpTimer();
        }, 1500);
    }
}

export function verifyForgotOTP() {
    const inputs = document.querySelectorAll('.forgot-otp-input');
    let otpCode = '';
    inputs.forEach(input => otpCode += input.value);
    
    if (otpCode.length < 6) {
        Swal.fire('OTP Tidak Lengkap', 'Masukkan 6 digit kode OTP', 'warning');
        return;
    }
    
    let btn = document.getElementById('btn-verify-forgot-otp');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i> Verifikasi...';
    
    if (isGoogleEnv) {
        google.script.run
            .withSuccessHandler(function (res) {
                btn.disabled = false;
                btn.innerHTML = 'Verifikasi OTP';
                if (res.success) {
                    clearInterval(forgotTimerInterval);
                    document.getElementById('forgot-step-2').classList.add('hidden');
                    document.getElementById('forgot-step-3').classList.remove('hidden');
                    pushToast('Verifikasi sukses! Silakan masukkan sandi baru.', 'success');
                } else {
                    pushToast(res.message, 'error');
                }
            })
            .withFailureHandler(function (err) {
                btn.disabled = false;
                btn.innerHTML = 'Verifikasi OTP';
                pushToast('Error: ' + err, 'error');
            })
            .verifyResetOTP(forgotIdentifier, otpCode);
    } else {
        setTimeout(function() {
            btn.disabled = false;
            btn.innerHTML = 'Verifikasi OTP';
            if (otpCode === '123456') {
                clearInterval(forgotTimerInterval);
                document.getElementById('forgot-step-2').classList.add('hidden');
                document.getElementById('forgot-step-3').classList.remove('hidden');
                pushToast('Verifikasi sukses!', 'success');
            } else {
                pushToast('OTP Salah', 'error');
            }
        }, 1000);
    }
}

export function saveNewPassword() {
    let p1 = document.getElementById('forgot-new-password').value;
    let p2 = document.getElementById('forgot-confirm-password').value;
    
    if (!p1 || p1.length < 6) {
        pushToast('Kata sandi minimal 6 karakter', 'warning');
        return;
    }
    if (p1 !== p2) {
        pushToast('Konfirmasi kata sandi tidak cocok', 'warning');
        return;
    }
    
    let btn = document.getElementById('btn-save-new-password');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i> Menyimpan...';
    
    if (isGoogleEnv) {
        google.script.run
            .withSuccessHandler(function (res) {
                btn.disabled = false;
                btn.innerHTML = 'Simpan Sandi Baru';
                if (res.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Berhasil!',
                        text: 'Kata sandi Anda telah diperbarui.',
                        confirmButtonColor: '#059669'
                    }).then(() => {
                        showLogin();
                    });
                } else {
                    pushToast(res.message, 'error');
                }
            })
            .withFailureHandler(function (err) {
                btn.disabled = false;
                btn.innerHTML = 'Simpan Sandi Baru';
                pushToast('Error: ' + err, 'error');
            })
            .resetPasswordWithOTP(forgotIdentifier, p1);
    } else {
        setTimeout(function() {
            btn.disabled = false;
            btn.innerHTML = 'Simpan Sandi Baru';
            Swal.fire('Berhasil!', 'Simulasi: Sandi berhasil diubah.', 'success').then(() => showLogin());
        }, 1500);
    }
}

function startForgotOtpTimer() {
    let timeLeft = 180;
    const timerDisplay = document.getElementById('forgot-otp-timer');
    clearInterval(forgotTimerInterval);
    
    forgotTimerInterval = setInterval(() => {
        timeLeft--;
        let m = Math.floor(timeLeft / 60);
        let s = timeLeft % 60;
        timerDisplay.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            clearInterval(forgotTimerInterval);
            timerDisplay.textContent = "00:00 (Kedaluwarsa)";
        }
    }, 1000);
}

export function bindForgotOtpInputs() {
    const inputs = document.querySelectorAll('.forgot-otp-input');
    inputs.forEach((input, index) => {
        input.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
            if (this.value.length === 1 && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });
        
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && !this.value && index > 0) {
                inputs[index - 1].focus();
            }
        });
        
        input.addEventListener('paste', function(e) {
            e.preventDefault();
            const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
            if (pastedData) {
                for(let i = 0; i < pastedData.length; i++) {
                    if (inputs[i]) inputs[i].value = pastedData[i];
                }
                if (pastedData.length < 6) {
                    inputs[pastedData.length].focus();
                } else {
                    inputs[5].focus();
                }
            }
        });
    });
}
