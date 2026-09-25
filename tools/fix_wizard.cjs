const fs = require('fs');
let file = 'src/admin/pengajuan.js';
let content = fs.readFileSync(file, 'utf8');

const target1 = `export function runAdminFilter() {
            adminKeyword = document.getElementById('admin-keyword-filter').value;
            currentAdminPage = 1;
            fetchAdminDashboardData();
        }`;
const replacement1 = `window.currentPengajuanTimeFilter = 'Semua';
window.currentPengajuanBidangFilter = '';

export function runAdminFilter() {
            let keywordEl = document.getElementById('admin-keyword-filter');
            if (keywordEl) adminKeyword = keywordEl.value;
            
            let bidangEl = document.getElementById('admin-bidang-filter');
            if (bidangEl) window.currentPengajuanBidangFilter = bidangEl.value;
            
            currentAdminPage = 1;
            if (typeof window.fetchAdminDashboardData === 'function') window.fetchAdminDashboardData();
        }

window.runAdminFilter = runAdminFilter;

window.setTimeFilter = function(timeFilter) {
    window.currentPengajuanTimeFilter = timeFilter;
    
    ['Semua', 'Hari Ini', 'Minggu Ini', 'Bulan Ini'].forEach(tf => {
        let el = document.getElementById('time-filter-' + tf);
        if (el) {
            if (tf === timeFilter) {
                el.className = "px-3 py-1 bg-white shadow-sm text-narmadaGreen font-bold text-xs rounded-md whitespace-nowrap transition-all";
            } else {
                el.className = "px-3 py-1 bg-transparent text-slate-500 hover:text-slate-700 font-bold text-xs rounded-md whitespace-nowrap transition-all";
            }
        }
    });
    
    runAdminFilter();
};`;

content = content.replace(target1, replacement1);

const target2 = `window.currentPengajuanFilterStatus = 'Semua';

window.openPengajuanFilter = function(status) {
    window.currentPengajuanFilterStatus = status;
    activeStatusFilter = status;
    switchAdminTab('pengajuan');
    runAdminFilter();
};`;

const replacement2 = `window.currentPengajuanFilterStatus = 'Semua';

window.openPengajuanFilter = function(status) {
    window.currentPengajuanFilterStatus = status;
    activeStatusFilter = status;
    
    ['Semua', 'Menunggu', 'Diperiksa', 'Perbaikan', 'Selesai'].forEach(tab => {
        let el = document.getElementById('tab-pengajuan-' + tab);
        if (el) {
            if (tab === status) {
                el.className = "px-2 py-2 text-sm font-bold border-b-2 border-narmadaGreen text-narmadaGreen whitespace-nowrap transition-all";
            } else {
                el.className = "px-2 py-2 text-sm font-bold border-b-2 border-transparent text-slate-500 hover:text-slate-700 whitespace-nowrap transition-all";
            }
        }
    });
    
    switchAdminTab('pengajuan');
    runAdminFilter();
};`;

content = content.replace(target2, replacement2);

// Make sure the title logic uses tabs
const target3 = `            if (titleEl) {
                let status = window.currentPengajuanFilterStatus;
                let titleText = "Daftar Pengajuan";
                let countColor = "bg-slate-100 text-slate-600";
                
                if (status === 'Menunggu') {
                    titleText = "Daftar Pengajuan Masuk";
                    countColor = "bg-blue-50 text-blue-600";
                } else if (status === 'Diperiksa') {
                    titleText = "Daftar Pengajuan Diperiksa";
                    countColor = "bg-amber-50 text-amber-600";
                } else if (status === 'Perbaikan') {
                    titleText = "Daftar Perbaiki Pengajuan";
                    countColor = "bg-red-50 text-red-600";
                } else if (status === 'Selesai') {
                    titleText = "Daftar Pengajuan Selesai";
                    countColor = "bg-emerald-50 text-emerald-600";
                } else {
                    titleText = "Semua Pengajuan";
                }
                titleEl.innerText = titleText;
                
                if (countEl) {
                    countEl.innerText = response.totalItems + " Pengajuan";
                    countEl.className = countColor + " px-2 py-0.5 rounded text-[10px] font-bold";
                }
            }`;

const replacement3 = `            if (titleEl) {
                // Not updating titleText anymore as we use tabs now
            }
            if (countEl) {
                countEl.innerText = response.totalItems + " Pengajuan";
                countEl.className = "bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] font-bold";
                countEl.classList.remove('hidden');
            }`;

content = content.replace(target3, replacement3);

const target4 = `    updateBadge('badge-pengajuan-menunggu', stats.pending);
    updateBadge('badge-pengajuan-proses', stats.diperiksa);
    updateBadge('badge-pengajuan-perbaikan', stats.perbaikan);
    updateBadge('badge-pengajuan-selesai', stats.selesai);`;

const replacement4 = `    updateBadge('badge-pengajuan-menunggu', stats.pending);
    updateBadge('badge-pengajuan-proses', stats.diperiksa);
    updateBadge('badge-pengajuan-perbaikan', stats.perbaikan);
    updateBadge('badge-pengajuan-selesai', stats.selesai);
    
    updateBadge('tab-badge-menunggu', stats.pending);
    updateBadge('tab-badge-diperiksa', stats.diperiksa);
    updateBadge('tab-badge-perbaikan', stats.perbaikan);`;

content = content.replace(target4, replacement4);

fs.writeFileSync(file, content);
console.log('Done replacing pengajuan.js');
