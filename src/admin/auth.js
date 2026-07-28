export function runAdminLoginAuth() {
            let u = document.getElementById('login-username').value.trim();
            let p = document.getElementById('login-password').value.trim();
            let btn = document.getElementById('btn-submit-login');

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
                            localStorage.setItem('userId', u);
                            if (res.email) localStorage.setItem('userEmail', res.email);
                            if (res.wa) localStorage.setItem('userPhone', res.wa);
                            if (res.avatar) localStorage.setItem('userAvatar', res.avatar);
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
                    
                    let userMatch = window.usersData.find(function(user) {
                        return user.username === u && user.password === p;
                    });

                    if (userMatch) {
                        localStorage.setItem('adminToken_Narmada', 'dummy-token');
                        localStorage.setItem('userRole', userMatch.role || 'Super Admin');
                        localStorage.setItem('userName', userMatch.name || 'Admin');
                        localStorage.setItem('userEmail', userMatch.email || 'alzian@desa-narmada.go.id');
                        localStorage.setItem('userNIK', userMatch.nik || '5201140000000000');
                        localStorage.setItem('userPhone', userMatch.phone || '081234567890');
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
            localStorage.removeItem('userId');
            pushToast("Berhasil keluar dari Dashboard Admin.", "info");
            switchView('admin-login');
        }

export function initRBAC() {
            let role = localStorage.getItem('userRole') || 'Super Admin';
            let userName = localStorage.getItem('userName') || 'Administrator';
            let mapping = ROLE_MAPPINGS[role] || ROLE_MAPPINGS['Super Admin'];
            
            // Update Profile Name and Role in UI (Header)
            let profileNames = document.querySelectorAll('.admin-profile-name');
            let profileRoles = document.querySelectorAll('.admin-profile-role');
            if (profileNames.length === 0) {
                // Specific targeted updates for the layout
                let hName = document.querySelector('header span.text-base.leading-none');
                if (hName) hName.innerText = userName;
                let hRole = document.querySelector('header span.bg-emerald-100');
                if (hRole) hRole.innerText = role;
                
                let dName = document.querySelector('#admin-profile-trigger p.text-sm');
                if (dName) dName.innerText = userName;
                let dRole = document.querySelector('#admin-profile-trigger p.text-\\[10px\\]');
                if (dRole) dRole.innerText = role;
                
                let userAvatar = localStorage.getItem('userAvatar');
                let headerAvatarImg = document.querySelector('#admin-profile-trigger img');
                if (headerAvatarImg) {
                    if (userAvatar && userAvatar.trim() !== '') {
                        headerAvatarImg.src = userAvatar;
                    } else {
                        headerAvatarImg.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(userName) + '&background=0D8ABC&color=fff';
                    }
                }
            }

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

export function initAdminHeader() {
    const greetingEl = document.getElementById('admin-header-greeting');
    const nameEl = document.getElementById('admin-header-name');
    const roleEl = document.getElementById('admin-header-role');
    const dateEl = document.getElementById('admin-current-date');

    if (!dateEl) return; // Exit if not on admin page

    // Update Name and Role
    const userName = localStorage.getItem('userName') || 'Administrator';
    const userRole = localStorage.getItem('userRole') || 'Super Admin';
    if (nameEl) nameEl.textContent = userName;
    if (roleEl) roleEl.textContent = userRole + ' Desa Narmada';

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
