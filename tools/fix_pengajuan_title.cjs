const fs = require('fs');

let file = 'src/admin/pengajuan.js';
let content = fs.readFileSync(file, 'utf8');

// Restore the dynamic title updating
const targetTitle = `            if (titleEl) {
                // Not updating titleText anymore as we use tabs now
            }
            if (countEl) {
                countEl.innerText = response.totalItems + " Pengajuan";
                countEl.className = "bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] font-bold";
                countEl.classList.remove('hidden');
            }`;

const replacementTitle = `            if (titleEl) {
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
                    countEl.classList.remove('hidden');
                }
            }`;

content = content.replace(targetTitle, replacementTitle);


const targetSetTimeFilter = `window.setTimeFilter = function(timeFilter) {
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

// We will update the setTimeFilter styling to match the original pill styles
const replacementSetTimeFilter = `window.setTimeFilter = function(timeFilter) {
    window.currentPengajuanTimeFilter = timeFilter;
    
    ['Semua', 'Hari Ini', 'Minggu Ini', 'Bulan Ini'].forEach(tf => {
        let el = document.getElementById('time-filter-' + tf);
        if (el) {
            if (tf === timeFilter) {
                el.className = "px-4 py-1.5 bg-emerald-50 text-narmadaGreen font-bold text-xs rounded-full whitespace-nowrap";
            } else {
                el.className = "px-4 py-1.5 bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700 font-semibold text-xs rounded-full whitespace-nowrap transition-colors";
            }
        }
    });
    
    runAdminFilter();
};`;

content = content.replace(targetSetTimeFilter, replacementSetTimeFilter);

fs.writeFileSync(file, content);
console.log("pengajuan.js logic restored.");
