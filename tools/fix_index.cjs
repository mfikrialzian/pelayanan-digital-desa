const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const targetStr = `                            <div class="p-5 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div class="flex items-center gap-2">
                                    <h3 id="pengajuan-table-title" class="text-sm font-bold text-slate-800">Daftar Pengajuan Masuk</h3>
                                    <span id="pengajuan-table-count" class="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold"></span>
                                </div>
                                <div class="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                                    <button class="px-4 py-1.5 bg-emerald-50 text-narmadaGreen font-bold text-xs rounded-full whitespace-nowrap">Semua</button>
                                    <button class="px-4 py-1.5 bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700 font-semibold text-xs rounded-full whitespace-nowrap transition-colors">Hari Ini</button>
                                    <button class="px-4 py-1.5 bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700 font-semibold text-xs rounded-full whitespace-nowrap transition-colors">Minggu Ini</button>
                                    <button class="px-4 py-1.5 bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700 font-semibold text-xs rounded-full whitespace-nowrap transition-colors">Bulan Ini</button>
                                    <button class="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 ml-2">
                                        <i class="fa-solid fa-filter"></i> Filter
                                    </button>
                                </div>
                            </div>`;

const newStr = `                            <div class="p-5 border-b border-slate-100 flex flex-col gap-4">
                                <div class="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-4">
                                    <div class="flex items-center gap-4 border-b border-slate-200 w-full xl:w-auto overflow-x-auto pb-0" id="pengajuan-tabs-container">
                                        <button onclick="window.openPengajuanFilter('Semua')" id="tab-pengajuan-Semua" class="px-2 py-2 text-sm font-bold border-b-2 border-narmadaGreen text-narmadaGreen whitespace-nowrap transition-all">Semua</button>
                                        <button onclick="window.openPengajuanFilter('Menunggu')" id="tab-pengajuan-Menunggu" class="px-2 py-2 text-sm font-bold border-b-2 border-transparent text-slate-500 hover:text-slate-700 whitespace-nowrap transition-all">Masuk <span id="tab-badge-menunggu" class="hidden ml-1 px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[9px]"></span></button>
                                        <button onclick="window.openPengajuanFilter('Diperiksa')" id="tab-pengajuan-Diperiksa" class="px-2 py-2 text-sm font-bold border-b-2 border-transparent text-slate-500 hover:text-slate-700 whitespace-nowrap transition-all">Diperiksa <span id="tab-badge-diperiksa" class="hidden ml-1 px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[9px]"></span></button>
                                        <button onclick="window.openPengajuanFilter('Perbaikan')" id="tab-pengajuan-Perbaikan" class="px-2 py-2 text-sm font-bold border-b-2 border-transparent text-slate-500 hover:text-slate-700 whitespace-nowrap transition-all">Perbaikan <span id="tab-badge-perbaikan" class="hidden ml-1 px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 text-[9px]"></span></button>
                                        <button onclick="window.openPengajuanFilter('Selesai')" id="tab-pengajuan-Selesai" class="px-2 py-2 text-sm font-bold border-b-2 border-transparent text-slate-500 hover:text-slate-700 whitespace-nowrap transition-all">Selesai</button>
                                    </div>
                                    
                                    <div class="flex flex-wrap items-center gap-2 w-full xl:w-auto justify-end">
                                        <span id="pengajuan-table-count" class="bg-slate-100 text-slate-600 px-2 py-1.5 rounded text-[10px] font-bold"></span>
                                        <select id="admin-bidang-filter" onchange="window.runAdminFilter()" class="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 font-bold text-xs rounded-lg outline-none focus:border-narmadaGreen min-w-[150px]">
                                            <option value="">Semua Bidang</option>
                                        </select>
                                        <div class="flex bg-slate-100 rounded-lg p-1">
                                            <button id="time-filter-Semua" onclick="window.setTimeFilter('Semua')" class="px-3 py-1 bg-white shadow-sm text-narmadaGreen font-bold text-xs rounded-md whitespace-nowrap transition-all">Semua</button>
                                            <button id="time-filter-Hari Ini" onclick="window.setTimeFilter('Hari Ini')" class="px-3 py-1 bg-transparent text-slate-500 hover:text-slate-700 font-bold text-xs rounded-md whitespace-nowrap transition-all">Hari Ini</button>
                                            <button id="time-filter-Minggu Ini" onclick="window.setTimeFilter('Minggu Ini')" class="px-3 py-1 bg-transparent text-slate-500 hover:text-slate-700 font-bold text-xs rounded-md whitespace-nowrap transition-all">Minggu Ini</button>
                                            <button id="time-filter-Bulan Ini" onclick="window.setTimeFilter('Bulan Ini')" class="px-3 py-1 bg-transparent text-slate-500 hover:text-slate-700 font-bold text-xs rounded-md whitespace-nowrap transition-all">Bulan Ini</button>
                                        </div>
                                    </div>
                                </div>
                            </div>`;

html = html.replace(targetStr, newStr);
fs.writeFileSync('index.html', html);
console.log('Done replacing index.html filter section.');
