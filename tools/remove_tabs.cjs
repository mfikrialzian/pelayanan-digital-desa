const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const targetStr = `<button onclick="window.openPengajuanFilter('Menunggu')" id="tab-pengajuan-Menunggu" class="px-2 py-2 text-sm font-bold border-b-2 border-transparent text-slate-500 hover:text-slate-700 whitespace-nowrap transition-all">Masuk <span id="tab-badge-menunggu" class="hidden ml-1 px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[9px]"></span></button>
                                <button onclick="window.openPengajuanFilter('Diperiksa')" id="tab-pengajuan-Diperiksa" class="px-2 py-2 text-sm font-bold border-b-2 border-transparent text-slate-500 hover:text-slate-700 whitespace-nowrap transition-all">Diperiksa <span id="tab-badge-diperiksa" class="hidden ml-1 px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[9px]"></span></button>`;
                                
html = html.replace(targetStr, '');
fs.writeFileSync('index.html', html);
console.log('Removed Masuk and Diperiksa tabs.');
