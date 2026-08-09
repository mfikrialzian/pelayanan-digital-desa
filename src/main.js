import './core/script_core.js';
import './core/script_utils.js';

import * as Auth from './admin/auth.js';
import * as Dashboard from './admin/dashboard.js';
import * as Pengajuan from './admin/pengajuan.js';
import * as Layanan from './admin/layanan.js';
import * as Pengguna from './admin/pengguna.js';
import * as Pengaturan from './admin/pengaturan.js';
import * as Notifikasi from './admin/notifikasi.js';
import * as AdminCore from './admin/admin_core.js';

import * as WargaPengajuan from './warga/pengajuan_wizard.js';
import * as WargaStatus from './warga/status.js';
import * as WargaUI from './warga/ui.js';
import * as ImageUtils from './warga/image_utils.js';

// Expose all exported functions to window for events_binding.js and global compatibility
Object.assign(window, 
    Auth, Dashboard, Pengajuan, Layanan, Pengguna, Pengaturan, Notifikasi, AdminCore,
    WargaPengajuan, WargaStatus, WargaUI, ImageUtils
);

// Gunakan dynamic import agar file ini dieksekusi SETELAH Object.assign selesai
import('./events/events_binding.js').then(() => {
    if (typeof window.initApp === 'function') {
        window.initApp();
    }
}).catch(err => {
    console.error("Gagal memuat events_binding.js:", err);
});
