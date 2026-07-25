const fs = require('fs');

const insertBlock = `
                            <!-- Informasi Akun -->
                            <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mt-6">
                                <div class="p-4 md:p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                    <h3 class="text-xs md:text-sm font-bold text-slate-800 flex items-center gap-2">
                                        <i class="fa-regular fa-id-badge text-narmadaBlue"></i> Informasi Akun
                                    </h3>
                                </div>
                                <div class="p-4 md:p-6">
                                    <div class="flex flex-col gap-5">
                                        <!-- Username -->
                                        <div>
                                            <label class="block text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Username (ID Admin)</label>
                                            <input type="text" value="alzian_admin" readonly class="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs md:text-sm font-semibold rounded-xl focus:ring-0 block px-4 py-2.5 outline-none cursor-not-allowed">
                                        </div>
                                        
                                        <!-- Peran -->
                                        <div>
                                            <label class="block text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Peran Akses (Role)</label>
                                            <div class="flex items-center gap-2 px-4 py-2.5 bg-emerald-50/50 border border-emerald-100 rounded-xl w-max">
                                                <div class="w-6 h-6 rounded-full bg-emerald-100 text-narmadaGreen flex items-center justify-center">
                                                    <i class="fa-solid fa-shield-halved text-[10px]"></i>
                                                </div>
                                                <span class="text-xs md:text-sm font-bold text-narmadaGreen">Administrator Utama</span>
                                            </div>
                                        </div>

                                        <!-- Status Akun -->
                                        <div>
                                            <label class="block text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Status Akun</label>
                                            <div class="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl w-max">
                                                <span class="relative flex h-3 w-3">
                                                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                  <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                                </span>
                                                <span class="text-xs md:text-sm font-bold text-slate-700">Aktif & Terverifikasi</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
`;

let html = fs.readFileSync('index.html', 'utf8');

// check if already inserted
if (!html.includes('<!-- Informasi Akun -->')) {
    html = html.replace('<!-- TAB KEAMANAN -->', insertBlock + '\n                        <!-- TAB KEAMANAN -->');
    fs.writeFileSync('index.html', html);
    console.log('Inserted Informasi Akun');
} else {
    console.log('Informasi Akun already exists');
}
