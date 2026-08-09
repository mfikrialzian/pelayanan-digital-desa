export async function fetchNotifications() {
    const container = document.getElementById("notification-container");
    if (!container) return;
    container.innerHTML = `<div class="text-center text-slate-400 py-4 text-xs">Memuat notifikasi...</div>`;
    
    google.script.run
            .withSuccessHandler(function (res) {
                renderNotifications(res, container);
            })
            .withFailureHandler(function (err) {
                container.innerHTML = `<div class="text-center text-red-500 py-4 text-xs">Gagal: ${err.toString()}</div>`;
            })
            .getNotifications(localStorage.getItem('adminToken_Narmada'), 10);

}

export function renderNotifications(res, container) {
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

export let dummyNotifikasiList = [];

export function getNotifications() {
    // Di backend sungguhan, fungsi ini memanggil API GET /notifications
    // Untuk simulasi, kita urutkan berdasarkan waktu terbaru
    return dummyNotifikasiList.sort((a, b) => new Date(b.time) - new Date(a.time));
}

export function getUnreadNotificationCount() {
    return dummyNotifikasiList.filter(n => !n.isRead).length;
}

export function addNotification(title, desc, type, icon) {
    const newNotif = {
        id: "NOTIF-" + Date.now(),
        title: title,
        desc: desc,
        time: new Date().toISOString(),
        type: type,
        icon: icon,
        isRead: false
    };
    dummyNotifikasiList.unshift(newNotif);
    updateNotificationBadge();
    const container = document.getElementById("notification-dropdown-list");
    if (container) {
        renderNotificationDropdown(container);
    }
}

export function markAllNotificationsAsRead() {
    dummyNotifikasiList.forEach(n => n.isRead = true);
    updateNotificationBadge();
    const container = document.getElementById("notification-dropdown-list");
    if (container) {
        renderNotificationDropdown(container);
    }
}

export function deleteNotification(id) {
    dummyNotifikasiList = dummyNotifikasiList.filter(n => n.id !== id);
    updateNotificationBadge();
    const container = document.getElementById("notification-dropdown-list");
    if (container) {
        renderNotificationDropdown(container);
    }
}

export function deleteAllNotifications() {
    dummyNotifikasiList = [];
    updateNotificationBadge();
    const container = document.getElementById("notification-dropdown-list");
    if (container) {
        renderNotificationDropdown(container);
    }
}

export function updateNotificationBadge() {
    const redDot = document.getElementById('header-bell-dot');
    if (!redDot) return;
    
    const count = getUnreadNotificationCount();
    if (count > 0) {
        redDot.classList.remove('hidden');
        // Opsional: Jika ingin menampilkan angka
        // redDot.innerText = count > 9 ? '9+' : count;
    } else {
        redDot.classList.add('hidden');
    }
}

export function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);

    if (diffMins < 1) return "Baru saja";
    if (diffMins < 60) return diffMins + " menit yang lalu";
    if (diffHours < 24) return diffHours + " jam yang lalu";
    if (diffDays === 1) return "Kemarin";
    return diffDays + " hari yang lalu";
}

export function renderNotificationDropdown(container) {
    const notifications = getNotifications();

    if (notifications.length === 0) {
        container.innerHTML = `<div class="text-center text-slate-400 py-6 text-xs">Belum ada notifikasi.</div>`;
        return;
    }

    container.innerHTML = '';
    notifications.forEach(item => {
        let iconColor = 'text-blue-500';
        let bgIcon = 'bg-blue-50';
        if (item.type === 'success') { iconColor = 'text-emerald-500'; bgIcon = 'bg-emerald-50'; }
        else if (item.type === 'warning') { iconColor = 'text-amber-500'; bgIcon = 'bg-amber-50'; }
        else if (item.type === 'error') { iconColor = 'text-red-500'; bgIcon = 'bg-red-50'; }
        else if (item.type === 'info') { iconColor = 'text-narmadaGreen'; bgIcon = 'bg-emerald-50'; }

        // Styling berbeda untuk dibaca vs belum dibaca
        const readClass = item.isRead ? 'opacity-60 bg-white' : 'bg-slate-50';
        const titleClass = item.isRead ? 'text-slate-600 font-semibold' : 'text-slate-800 font-bold';
        const unreadDot = item.isRead ? '' : `<div class="w-2 h-2 rounded-full bg-narmadaGreen mt-1 shrink-0"></div>`;

        container.innerHTML += `
            <div class="flex gap-3 p-3 rounded-lg transition-colors border-b border-slate-50 last:border-0 items-start group relative ${readClass} hover:bg-slate-100">
                <div class="w-8 h-8 rounded-full ${bgIcon} ${iconColor} flex items-center justify-center shrink-0 mt-0.5">
                    <i class="fa-solid ${item.icon} text-xs"></i>
                </div>
                <div class="flex-grow pr-6">
                    <p class="text-xs ${titleClass}">${item.title}</p>
                    <p class="text-[10px] text-slate-500 mt-0.5 leading-relaxed">${item.desc}</p>
                    <p class="text-[9px] font-semibold text-slate-400 mt-1">${formatTimeAgo(item.time)}</p>
                </div>
                ${unreadDot}
                <button onclick="deleteNotification('${item.id}')" class="absolute right-2 top-2 w-6 h-6 flex items-center justify-center rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity" title="Hapus Notifikasi">
                    <i class="fa-solid fa-xmark text-xs"></i>
                </button>
            </div>
        `;
    });
}

export function playNotificationSound() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        
        const playNote = (freq, startTime, duration) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);
            
            gain.gain.setValueAtTime(0, ctx.currentTime + startTime);
            gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + startTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);
            
            osc.start(ctx.currentTime + startTime);
            osc.stop(ctx.currentTime + startTime + duration);
        };
        
        playNote(523.25, 0, 0.3); // C5
        playNote(659.25, 0.15, 0.4); // E5
    } catch(e) {
        console.log("Audio play failed:", e);
    }
}
