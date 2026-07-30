export function fetchAdminStats() {
            if (isGoogleEnv) {
                google.script.run
                    .withSuccessHandler(function (stats) {
                        window.lastDashboardStats = stats;
                        renderStatsDashboard(stats);
                        fetchAdminDashboardData();
                        fetchNotifications();
                    })
                    .getDashboardStats();
            } else {

                let mockStats = {
                    total: dummyPengajuanList.length,
                    pending: dummyPengajuanList.filter(r => r.status === "Menunggu").length,
                    verifikasi: dummyPengajuanList.filter(r => r.status === "Verifikasi").length,
                    selesai: dummyPengajuanList.filter(r => r.status === "Selesai" || r.status === "Pelayanan Selesai").length,
                    uploadUlang: dummyPengajuanList.filter(r => r.status === "Perbaikan" || r.status === "Upload Ulang").length,
                    chartMingguan: [10, 15, 8, 20, 25, 12, 6],
                    chartStatus: [15, 20, 40, 5],
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
                        } else {
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
                    labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
                    datasets: [{
                        label: 'Pengajuan Baru',
                        data: [12, 19, 15, 25, 22, 10, 5],
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
                    labels: ['Menunggu', 'Verifikasi', 'Selesai', 'Perbaikan'],
                    datasets: [{
                        data: [20, 25, 45, 10],
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
                    labels: ['Ket. Usaha', 'Ket. Domisili', 'Pengantar SKCK', 'Ket. Tidak Mampu', 'Lainnya'],
                    datasets: [{
                        label: 'Total Pengajuan',
                        data: [65, 45, 30, 25, 15],
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
                        x: { grid: { display: false } }
                    }
                }
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
        adminCharts.mingguan.data.datasets[0].data = stats.chartMingguan;
        adminCharts.mingguan.update();
    }
    
    if (stats.chartStatus) {
        adminCharts.status.data.datasets[0].data = stats.chartStatus;
        adminCharts.status.update();
    }
    
    if (stats.chartLayanan && stats.chartLayanan.labels.length > 0) {
        adminCharts.layanan.data.labels = stats.chartLayanan.labels;
        adminCharts.layanan.data.datasets[0].data = stats.chartLayanan.data;
        // Dynamically adjust Y axis max
        let maxVal = Math.max(...stats.chartLayanan.data) || 10;
        adminCharts.layanan.options.scales.y.max = maxVal + Math.ceil(maxVal * 0.2);
        adminCharts.layanan.update();
    }
}

export async function fetchWeather() {
    const weatherIconEl = document.getElementById('admin-weather-icon');
    const weatherTempEl = document.getElementById('admin-weather-temp');
    const weatherDescEl = document.getElementById('admin-weather-desc');
    
    if (!weatherIconEl || !weatherTempEl || !weatherDescEl) return;
    
    try {
        // Narmada coordinates (approx: -8.58, 116.12)
        const lat = -8.5833;
        const lon = 116.1167;
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
        else if (code === 1 || code === 2) { icon = '⛅'; desc = 'Cerah Berawan'; }
        else if (code === 3) { icon = '☁️'; desc = 'Berawan'; }
        else if (code === 45 || code === 48) { icon = '🌫️'; desc = 'Berkabut'; }
        else if (code >= 51 && code <= 55) { icon = '🌦️'; desc = 'Gerimis'; }
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
