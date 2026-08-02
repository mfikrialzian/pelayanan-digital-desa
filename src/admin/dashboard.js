export function fetchAdminStats() {
            if (isGoogleEnv) {
                google.script.run
                    .withSuccessHandler(function (stats) {
                        window.lastDashboardStats = stats;
                        renderStatsDashboard(stats);
                        fetchAdminDashboardData();
                        fetchDashboardInboxData();
                        fetchNotifications();
                    })
                    .getDashboardStats();
            } else {

                let pendingCount = dummyPengajuanList.filter(r => r.status === "Menunggu").length;
                let verifikasiCount = dummyPengajuanList.filter(r => r.status === "Diperiksa").length;
                let selesaiCount = dummyPengajuanList.filter(r => r.status === "Selesai" || r.status === "Pelayanan Selesai").length;
                let uploadUlangCount = dummyPengajuanList.filter(r => r.status === "Perbaikan" || r.status === "Upload Ulang").length;
                let now = new Date();
                let isToday = (dStr) => {
                    if(!dStr) return false;
                    let parts = dStr.split(' ')[0].split('/');
                    if(parts.length !== 3) return false;
                    let tDate = new Date(parts[2], parts[1]-1, parts[0]);
                    return tDate.getDate() === now.getDate() && tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
                };

                let todayTotal = dummyPengajuanList.filter(r => isToday(r.tanggal)).length;
                let todayPending = dummyPengajuanList.filter(r => isToday(r.tanggal) && r.status === "Menunggu").length;
                let todayVerifikasi = dummyPengajuanList.filter(r => isToday(r.tanggal) && r.status === "Diperiksa").length;
                let todaySelesai = dummyPengajuanList.filter(r => isToday(r.tanggal) && (r.status === "Selesai" || r.status === "Pelayanan Selesai")).length;
                let todayUploadUlang = dummyPengajuanList.filter(r => isToday(r.tanggal) && (r.status === "Perbaikan" || r.status === "Upload Ulang")).length;

                let mockStats = {
                    total: dummyPengajuanList.length,
                    pending: pendingCount,
                    verifikasi: verifikasiCount,
                    selesai: selesaiCount,
                    uploadUlang: uploadUlangCount,
                    todayTotal: todayTotal,
                    todayPending: todayPending,
                    todayVerifikasi: todayVerifikasi,
                    todaySelesai: todaySelesai,
                    todayUploadUlang: todayUploadUlang,
                    chartMingguan: [10, 15, 8, 20, 25, 12, 6],
                    chartBulanIni: [45, 60, 50, 58],
                    chartStatus: [selesaiCount, verifikasiCount, pendingCount, uploadUlangCount], // Backend format
                    chartLayanan: { labels: ['Ket. Usaha', 'Ket. Domisili', 'SKCK', 'Ket. Tidak Mampu', 'Lainnya'], data: [35, 25, 20, 15, 5] }
                };
                window.lastDashboardStats = mockStats;
                renderStatsDashboard(mockStats);
                fetchAdminDashboardData();
                fetchNotifications();
            }
        }

export function renderStatsDashboard(stats) {
            document.getElementById('stat-total').innerText = stats.total;
            document.getElementById('stat-menunggu').innerText = stats.pending;
            document.getElementById('stat-verifikasi').innerText = stats.verifikasi;
            document.getElementById('stat-selesai').innerText = stats.selesai;
            document.getElementById('stat-perbaikan').innerText = stats.uploadUlang;

            const updateTrend = (id, count, textSuf) => {
                let elIcon = document.getElementById('trend-' + id + '-icon');
                let elText = document.getElementById('trend-' + id + '-text');
                if(elIcon && elText) {
                    let parent = elIcon.parentElement;
                    if(count > 0) {
                        if(parent) parent.classList.remove('hidden');
                        elIcon.className = "fa-solid fa-arrow-trend-up";
                        elText.innerText = "+" + count + " " + textSuf;
                    } else {
                        if(parent) parent.classList.add('hidden');
                    }
                }
            };

            if (stats.todayTotal !== undefined) {
                updateTrend('total', stats.todayTotal, 'pengajuan masuk');
                updateTrend('menunggu', stats.todayPending, 'pending baru');
                updateTrend('verifikasi', stats.todayVerifikasi, 'diverifikasi');
                updateTrend('selesai', stats.todaySelesai, 'selesai');
                updateTrend('perbaikan', stats.todayUploadUlang, 'ditolak');
            }
            
            if (stats.chartMingguan || stats.chartStatus) {
                updateAdminChartsData(stats);
            }
        }

export function fetchUserDashboardData(nik, noReq) {
            let tbody = document.getElementById('table-user-rows');
            if(!tbody) return;
            tbody.innerHTML = getTableSkeleton(4, 3);

            if (isGoogleEnv) {
                try {
                    google.script.run
                        .withSuccessHandler(function (res) { renderUserTable(res); })
                        .getUserDashboardData(nik, noReq);
                } catch (e) { }
            } else {
                let filtered = dummyPengajuanList.filter(function (r) {
                    return (r.nik === nik && r.id === noReq);
                });
                renderUserTable({ data: filtered });
            }
        }

window.currentDashInboxPage = 1;

export function fetchDashboardInboxData() {
    let tbody = document.getElementById('table-dashboard-rows');
    if (!tbody) return;
    tbody.innerHTML = getTableSkeleton(6, 5);

    if (isGoogleEnv) {
        try {
            google.script.run
                .withSuccessHandler(function (res) {
                    if (res && res.authError) return;
                    renderDashboardInboxTable(res);
                })
                .getAdminDashboardData(localStorage.getItem('adminToken_Narmada'), '', window.currentDashInboxPage, 'Menunggu');
        } catch (e) { }
    } else {
        let filtered = dummyPengajuanList.filter(function (r) {
            return r.status === 'Menunggu';
        });

        let total = filtered.length;
        let limit = 10;
        let pages = Math.max(1, Math.ceil(total / limit));
        let paginated = filtered.slice((window.currentDashInboxPage - 1) * limit, window.currentDashInboxPage * limit);

        renderDashboardInboxTable({
            data: paginated,
            totalPages: pages,
            currentPage: window.currentDashInboxPage,
            totalItems: total
        });
    }
}

window.changeDashPage = function(delta) {
    window.currentDashInboxPage += delta;
    fetchDashboardInboxData();
};

window.toggleInboxRow = function(id) {
    let row = document.getElementById('inbox-detail-' + id);
    let icon = document.getElementById('inbox-icon-' + id);
    if(row) {
        if(row.classList.contains('hidden')) {
            row.classList.remove('hidden');
            if(icon) icon.classList.add('rotate-180');
        } else {
            row.classList.add('hidden');
            if(icon) icon.classList.remove('rotate-180');
        }
    }
};

window.copyInboxReq = function(req) {
    navigator.clipboard.writeText(req).then(() => {
        pushToast('No Request berhasil disalin', 'success');
    });
};

export function renderDashboardInboxTable(response) {
    let tbody = document.getElementById('table-dashboard-rows');
    if (!tbody) return;

    let info = document.getElementById('txt-dash-pagination-info');
    if(info) info.innerText = "Halaman " + response.currentPage + " dari " + response.totalPages + " (" + response.totalItems + " Berkas)";
    
    let btnPrev = document.getElementById('btn-dash-prev');
    if(btnPrev) btnPrev.disabled = response.currentPage <= 1;
    let btnNext = document.getElementById('btn-dash-next');
    if(btnNext) btnNext.disabled = response.currentPage >= response.totalPages;
    
    let countEl = document.getElementById('dashboard-table-count');
    if(countEl) countEl.innerText = response.totalItems + " Pengajuan";

    tbody.innerHTML = '';
    if (!response.data || response.data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="py-8 text-center text-slate-400 font-medium"><i class="fa-regular fa-folder-open text-3xl mb-3 block text-slate-300"></i><div class="mt-2">Tidak ada pengajuan masuk</div></td></tr>';
        return;
    }

    let no = (response.currentPage - 1) * 10 + 1;
    response.data.forEach(function (row) {
        let trMain = document.createElement('tr');
        trMain.className = 'hover:bg-emerald-50/50 transition-all border-b border-slate-101';
        
        trMain.innerHTML = `
            <td class="p-4 text-center font-bold text-slate-500 text-[10px]">${no++}</td>
            <td class="p-4">
                <p class="text-[9px] font-bold text-slate-700 mt-0.5">${row.tanggal || '-'}</p>
                <p class="text-[9px] text-slate-500 font-semibold italic mt-0.5"><i class="fa-solid fa-map-location-dot"></i> ${row.alamat || "-"}</p>
            </td>
            <td class="p-4">
                <p class="text-[11px] font-bold text-slate-700">No Req: <span class="font-extrabold text-slate-950">${row.id}</span></p>
                <p class="text-[11px] font-bold text-slate-700 mt-0.5">Nama: ${row.nama || '-'}</p>
                <p class="text-[11px] font-bold text-slate-700 mt-0.5">NIK: ${row.nik || '-'}</p>
                <p class="text-[10px] text-green-600 font-bold mt-0.5"><i class="fa-brands fa-whatsapp"></i> ${row.telepon || row.wa || '-'}</p>
            </td>
            <td class="p-4"><span class="font-bold text-narmadaGreen text-[11px]">${row.layanan || '-'}</span></td>
            <td class="p-4 text-center">
                <span class="px-2.5 py-1 rounded-full text-[10px] font-bold border bg-blue-100 text-blue-700 border-blue-200">Menunggu</span>
            </td>
            <td class="p-4 text-center">
                <button onclick="event.stopPropagation(); window.openPengajuanFilter('Menunggu'); setTimeout(() => window.quickProcessPengajuan('${row.id}'), 300);" class="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[10px] transition-all flex items-center justify-center gap-1.5 shadow-sm mx-auto min-w-[90px] border border-blue-200"><i class="fa-solid fa-arrow-right-to-bracket"></i> Proses</button>
            </td>
        `;
        
        tbody.appendChild(trMain);
    });
}


export function fetchAdminDashboardData() {
            let tbody = document.getElementById('table-admin-rows');
            if (!tbody) return;
            tbody.innerHTML = getTableSkeleton(7, 5);

            if (isGoogleEnv) {
                try {
                    google.script.run
                        .withSuccessHandler(function (res) {
                            if (res && res.authError) { pushToast(res.error, "error"); handleAdminLogout(); return; }
                            renderAdminTable(res);
                            if (res.data && typeof updatePengajuanSidebarBadges === 'function') {
                                updatePengajuanSidebarBadges(res.data);
                            }
                        })
                        .getAdminDashboardData(localStorage.getItem('adminToken_Narmada'), adminKeyword, currentAdminPage, activeStatusFilter);
                } catch (e) { }
            } else {
                let fKeyword = adminKeyword.toLowerCase().trim();
                let filtered = dummyPengajuanList.filter(function (r) {
                    let matchK = !fKeyword || r.nama.toLowerCase().indexOf(fKeyword) !== -1 || r.id.toLowerCase().indexOf(fKeyword) !== -1 || r.nik.indexOf(fKeyword) !== -1;
                    let matchS = true;
                    if (activeStatusFilter) {
                        if (activeStatusFilter === "Selesai") {
                            matchS = (r.status === "Pelayanan Selesai" || r.status === "Selesai");
                        } else if (activeStatusFilter === "Diperiksa") {
                            matchS = (r.status === "Diperiksa" || r.status === "Proses" || r.status === "Verifikasi");
                        } else if (activeStatusFilter === "Perbaikan") {
                            matchS = (r.status === "Perbaikan" || r.status === "Upload Ulang");
                        } else if (activeStatusFilter !== "Semua") {
                            matchS = (r.status === activeStatusFilter);
                        }
                    }
                    return matchK && matchS;
                });

                let total = filtered.length;
                let limit = 10;
                let pages = Math.max(1, Math.ceil(total / limit));
                let paginated = filtered.slice((currentAdminPage - 1) * limit, currentAdminPage * limit);

                setTimeout(function () {
                    renderAdminTable({ data: paginated, totalPages: pages, currentPage: currentAdminPage, totalItems: total });
                    if (typeof updatePengajuanSidebarBadges === 'function') {
                        updatePengajuanSidebarBadges(dummyPengajuanList);
                    }
                }, 400);
            }
        }

export let adminCharts = {
    mingguan: null,
    status: null,
    layanan: null
};

export let isChartJsLoaded = false;

export function loadChartJs(callback) {
    if (isChartJsLoaded || typeof Chart !== 'undefined') {
        if (callback) callback();
        return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = () => {
        isChartJsLoaded = true;
        if (callback) callback();
    };
    document.head.appendChild(script);
}

export function initAdminCharts() {
    loadChartJs(function() {
        const narmadaGreen = '#059669';
        const narmadaBlue = '#0ea5e9';
        
        // 1. Chart Pengajuan Mingguan (Line)
        const ctxMingguan = document.getElementById('chartPengajuanMingguan');
        if (ctxMingguan && !adminCharts.mingguan) {
            adminCharts.mingguan = new Chart(ctxMingguan, {
                type: 'line',
                data: {
                    labels: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'],
                    datasets: [{
                        label: 'Pengajuan Baru',
                        data: [0, 0, 0, 0],
                        borderColor: narmadaGreen,
                        backgroundColor: 'rgba(5, 150, 105, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: '#fff',
                        pointBorderColor: narmadaGreen,
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false, backgroundColor: 'rgba(15, 23, 42, 0.9)' } },
                    scales: {
                        y: { beginAtZero: true, grid: { borderDash: [5, 5], color: '#e2e8f0' } },
                        x: { grid: { display: false } }
                    },
                    interaction: { mode: 'nearest', axis: 'x', intersect: false }
                }
            });
        }

        // 2. Chart Status Pengajuan (Donut)
        const ctxStatus = document.getElementById('chartStatusPengajuan');
        if (ctxStatus && !adminCharts.status) {
            adminCharts.status = new Chart(ctxStatus, {
                type: 'doughnut',
                data: {
                    labels: ['Menunggu', 'Diperiksa', 'Selesai', 'Perbaikan'],
                    datasets: [{
                        data: [0, 0, 0, 0],
                        backgroundColor: [narmadaBlue, '#f59e0b', narmadaGreen, '#ef4444'],
                        borderWidth: 0,
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: {
                        legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20, font: { size: 11 } } }
                    },
                    layout: { padding: 10 }
                }
            });
        }

        // 3. Chart Jenis Layanan (Bar)
        const ctxLayanan = document.getElementById('chartJenisLayanan');
        if (ctxLayanan && !adminCharts.layanan) {
            adminCharts.layanan = new Chart(ctxLayanan, {
                type: 'bar',
                data: {
                    labels: ['Memuat...', 'Memuat...', 'Memuat...', 'Memuat...', 'Memuat...'],
                    datasets: [{
                        label: 'Total Pengajuan',
                        data: [0, 0, 0, 0, 0],
                        backgroundColor: narmadaBlue,
                        borderRadius: 6,
                        barThickness: 24
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, grid: { borderDash: [5, 5] }, max: 80 },
                        x: { grid: { display: false }, ticks: { display: false } }
                    }
                }
            });
        }
        
        const filterLayanan = document.getElementById('filter-layanan');
        if (filterLayanan) {
            filterLayanan.addEventListener('change', function(e) {
                if (!window.lastDashboardStats) return;
                let val = e.target.value;
                let dataObj = null;
                if (val === '7') {
                    dataObj = window.lastDashboardStats.chartLayanan7Hari;
                } else if (val === '30') {
                    dataObj = window.lastDashboardStats.chartLayanan30Hari;
                } else {
                    dataObj = window.lastDashboardStats.chartLayanan;
                }
                
                if (dataObj && dataObj.labels.length > 0) {
                    adminCharts.layanan.data.labels = dataObj.labels;
                    adminCharts.layanan.data.datasets[0].data = dataObj.data;
                    let maxVal = Math.max(...dataObj.data) || 10;
                    adminCharts.layanan.options.scales.y.max = maxVal + Math.ceil(maxVal * 0.2);
                    adminCharts.layanan.update();
                } else {
                    adminCharts.layanan.data.labels = [];
                    adminCharts.layanan.data.datasets[0].data = [];
                    adminCharts.layanan.update();
                }
            });
        }
        
        const filterMingguan = document.getElementById('filter-mingguan');
        if (filterMingguan) {
            filterMingguan.addEventListener('change', function(e) {
                if (!window.lastDashboardStats) return;
                let val = e.target.value;
                if (val === '7') {
                    adminCharts.mingguan.data.labels = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
                    if(window.lastDashboardStats.chartMingguan) adminCharts.mingguan.data.datasets[0].data = window.lastDashboardStats.chartMingguan;
                } else if (val === '30') {
                    adminCharts.mingguan.data.labels = ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'];
                    if(window.lastDashboardStats.chartBulanIni) adminCharts.mingguan.data.datasets[0].data = window.lastDashboardStats.chartBulanIni;
                }
                adminCharts.mingguan.update();
            });
        }

        if (window.lastDashboardStats) {
            updateAdminChartsData(window.lastDashboardStats);
        }
    });
}

export function updateAdminChartsData(stats) {
    if (!adminCharts.mingguan || !adminCharts.status || !adminCharts.layanan) return;
    
    if (stats.chartMingguan) {
        const filterMingguan = document.getElementById('filter-mingguan');
        let valM = filterMingguan ? filterMingguan.value : '7';
        
        if (valM === '7') {
            adminCharts.mingguan.data.labels = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
            adminCharts.mingguan.data.datasets[0].data = stats.chartMingguan;
        } else if (valM === '30' && stats.chartBulanIni) {
            adminCharts.mingguan.data.labels = ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'];
            adminCharts.mingguan.data.datasets[0].data = stats.chartBulanIni;
        }
        adminCharts.mingguan.update();
    }
    
    if (stats.chartStatus) {
        // Backend returns: [Selesai(0), Verifikasi(1), Menunggu(2), Perbaikan(3)]
        // We want: [Menunggu, Proses, Selesai, Perbaikan]
        adminCharts.status.data.datasets[0].data = [
            stats.chartStatus[2], // Menunggu
            stats.chartStatus[1], // Verifikasi
            stats.chartStatus[0], // Selesai
            stats.chartStatus[3]  // Perbaikan
        ];
        adminCharts.status.update();
    }
    
    if (stats.chartLayanan) {
        const filterLayanan = document.getElementById('filter-layanan');
        let val = filterLayanan ? filterLayanan.value : '7'; // Default to 7
        let dataObj = stats.chartLayanan;
        
        if (val === '7' && stats.chartLayanan7Hari) {
            dataObj = stats.chartLayanan7Hari;
        } else if (val === '30' && stats.chartLayanan30Hari) {
            dataObj = stats.chartLayanan30Hari;
        }

        if (dataObj.labels.length > 0) {
            adminCharts.layanan.data.labels = dataObj.labels;
            adminCharts.layanan.data.datasets[0].data = dataObj.data;
            let maxVal = Math.max(...dataObj.data) || 10;
            adminCharts.layanan.options.scales.y.max = maxVal + Math.ceil(maxVal * 0.2);
            adminCharts.layanan.update();
        }
    }
}

export async function fetchWeather() {
    const weatherIconEl = document.getElementById('admin-weather-icon');
    const weatherTempEl = document.getElementById('admin-weather-temp');
    const weatherDescEl = document.getElementById('admin-weather-desc');
    
    if (!weatherIconEl || !weatherTempEl || !weatherDescEl) return;
    
    try {
        // Narmada coordinates (approx: -8.59, 116.17)
        const lat = -8.5913;
        const lon = 116.1776;
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        if (!res.ok) throw new Error('Weather fetch failed');
        const data = await res.json();
        
        const current = data.current_weather;
        const temp = Math.round(current.temperature);
        const code = current.weathercode;
        
        // WMO Weather interpretation codes
        let icon = '☁️';
        let desc = 'Berawan';
        
        if (code === 0) { icon = '☀️'; desc = 'Cerah'; }
        else if (code === 1 || code === 2 || code === 51) { icon = '⛅'; desc = 'Cerah Berawan'; }
        else if (code === 3) { icon = '☁️'; desc = 'Berawan'; }
        else if (code === 45 || code === 48) { icon = '🌫️'; desc = 'Berkabut'; }
        else if (code >= 52 && code <= 55) { icon = '🌦️'; desc = 'Gerimis'; }
        else if (code >= 61 && code <= 65) { icon = '🌧️'; desc = 'Hujan'; }
        else if (code >= 71 && code <= 77) { icon = '❄️'; desc = 'Salju'; }
        else if (code >= 80 && code <= 82) { icon = '🌧️'; desc = 'Hujan Deras'; }
        else if (code >= 95 && code <= 99) { icon = '⛈️'; desc = 'Badai Petir'; }
        
        weatherTempEl.textContent = `${temp}°C`;
        weatherDescEl.textContent = desc;
        weatherIconEl.textContent = icon;
    } catch(err) {
        console.error('Failed to fetch weather', err);
        // Fallback
        weatherTempEl.textContent = '28°C';
        weatherDescEl.textContent = 'Cerah Berawan';
        weatherIconEl.textContent = '⛅';
    }
}

export function updateLaporanStats() {
    const totalAll = document.getElementById("laporan-total-all");
    const totalSelesai = document.getElementById("laporan-total-selesai");
    
    if (totalAll && window.lastDashboardStats) {
        totalAll.innerText = window.lastDashboardStats.total;
    }
    if (totalSelesai && window.lastDashboardStats) {
        totalSelesai.innerText = window.lastDashboardStats.selesai;
    }
}
