import re

with open("c:\\Users\\alzia\\.gemini\\antigravity\\scratch\\PelayananDigitalDesa\\index.html", "r", encoding="utf-8") as f:
    content = f.read()

start_idx = content.find('<div id="subview-admin-layanan" class="hidden space-y-6 text-left">')
end_idx = content.find('<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start mt-6">')

new_html = """                <div id="subview-admin-layanan" class="hidden space-y-6 text-left">
                    <!-- STICKY HEADER -->
                    <div class="w-full flex justify-between items-center bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-slate-200 sticky top-20 z-40">
                        <div>
                            <h2 class="text-lg font-bold text-slate-800" id="unified-editor-title">Editor Layanan</h2>
                            <p class="text-[10px] text-slate-500">Konfigurasi detail, berkas persyaratan, dan kolom pertanyaan.</p>
                        </div>
                        <div class="flex gap-2">
                            <button onclick="closeLayananEditor()" class="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all">Batal</button>
                            <button onclick="submitBuilderDataToServer()" class="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-all">
                                <i class="fa-solid fa-save"></i> Simpan Perubahan
                            </button>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        <!-- LEFT COLUMN: INFO DASAR & KEPERLUAN -->
                        <div class="xl:col-span-1 space-y-6">
                            <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                                <h3 class="text-sm font-bold text-slate-800 border-b pb-2"><i class="fa-solid fa-info-circle text-narmadaGreen"></i> Info Dasar</h3>
                                
                                <!-- HIDDEN SELECT (For compatibility with existing JS, we hide it and set it programmatically) -->
                                <select id="builder-select-layanan" class="hidden"><option value="[+] TAMBAH LAYANAN BARU">[+] TAMBAH LAYANAN BARU</option></select>
                                
                                <div id="wrapper-builder-nama">
                                    <label class="block text-[10px] font-bold text-slate-505 mb-1">Nama Pelayanan *</label>
                                    <input type="text" id="builder-layanan-nama" placeholder="Contoh: Surat Pengantar Nikah" class="w-full px-3 py-2 rounded-xl custom-input text-xs shadow-inner bg-slate-50">
                                </div>
                                <div id="wrapper-builder-template">
                                    <label class="block text-[10px] font-bold text-slate-505 mb-1">ID Template Google Docs (PDF) *</label>
                                    <input type="text" id="builder-template-doc-id" placeholder="Kosongkan jika tidak butuh PDF" class="w-full px-3 py-2 rounded-xl custom-input text-xs shadow-inner bg-slate-50">
                                </div>
                            </div>

                            <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                                <h3 class="text-sm font-bold text-slate-800 border-b pb-2"><i class="fa-solid fa-list-check text-narmadaGreen"></i> Keperluan Surat</h3>
                                <p class="text-[9px] text-slate-500">Tentukan daftar keperluan (opsi dropdown) yang bisa dipilih warga saat mengajukan layanan ini.</p>
                                
                                <div>
                                    <div class="flex gap-2">
                                        <select id="builder-keperluan-select" onchange="handleKeperluanSelectChange()" class="flex-grow px-3 py-2 rounded-xl custom-input text-xs shadow-inner bg-slate-50">
                                            <option value="">-- Pilih / Edit Keperluan --</option>
                                            <option value="__ADD_NEW__" class="font-extrabold text-emerald-600">[+] TAMBAH KEPERLUAN BARU...</option>
                                        </select>
                                        <button type="button" onclick="deleteSelectedKeperluanOption()" class="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-bold transition-all shadow-sm" title="Hapus opsi terpilih">
                                            <i class="fa-solid fa-trash"></i>
                                        </button>
                                    </div>

                                    <div id="wrapper-new-keperluan" class="hidden mt-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl shadow-inner space-y-2">
                                        <label class="block text-[9px] font-bold text-slate-500">Ketik Keperluan Baru</label>
                                        <div class="flex gap-2">
                                            <input type="text" id="builder-keperluan-new-input" placeholder="Contoh: Melamar Pekerjaan" class="flex-grow px-3 py-1.5 rounded-lg custom-input text-xs shadow-inner">
                                            <button type="button" onclick="saveNewKeperluanOption()" class="px-4 py-1.5 bg-narmadaGreen hover:bg-narmadaGreen-dark text-white rounded-lg text-xs font-bold transition-all shadow-md">Simpan</button>
                                            <button type="button" onclick="cancelNewKeperluanOption()" class="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-bold transition-all">Batal</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- RIGHT COLUMN: PERSYARATAN & PERTANYAAN -->
                        <div class="xl:col-span-2 space-y-6">
                            
                            <!-- PERSYARATAN CARD -->
                            <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                                <h3 class="text-sm font-bold text-slate-800 border-b pb-2"><i class="fa-solid fa-file-invoice text-emerald-600"></i> Berkas Persyaratan (Upload Warga)</h3>
                                
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <div>
                                        <label class="block text-[10px] font-bold text-slate-550 mb-1">Berlaku Untuk Keperluan:</label>
                                        <select id="builder-req-keperluan" class="w-full px-3 py-2 rounded-xl custom-input text-xs shadow-inner bg-white"></select>
                                    </div>
                                    <div>
                                        <label class="block text-[10px] font-bold text-slate-550 mb-1">Pilih Berkas Persyaratan:</label>
                                        <div class="flex gap-2">
                                            <select id="builder-req-master" class="flex-grow px-3 py-2 rounded-xl custom-input text-xs shadow-inner bg-white"></select>
                                            <button type="button" onclick="addRequirementToKeperluan()" class="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-900 shadow-sm"><i class="fa-solid fa-plus"></i> Tambah</button>
                                        </div>
                                    </div>
                                </div>

                                <div class="space-y-2 mt-2">
                                    <h4 class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Daftar Persyaratan Terpilih:</h4>
                                    <div id="builder-req-mapping-list" class="space-y-2 max-h-[250px] overflow-y-auto pr-2"></div>
                                </div>
                            </div>

                            <!-- PERTANYAAN CARD -->
                            <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                                <h3 class="text-sm font-bold text-slate-800 border-b pb-2"><i class="fa-solid fa-question-circle text-blue-600"></i> Formulir Pertanyaan Tambahan</h3>
                                
                                <div class="bg-slate-50 p-4 border border-slate-200 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div class="sm:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3 mb-1 border-b border-slate-200 pb-3">
                                        <div>
                                            <label class="block text-[9px] font-bold text-slate-500 mb-0.5">Keperluan Surat (Opsional)</label>
                                            <select id="builder-q-keperluan" class="w-full px-2.5 py-1.5 rounded-lg custom-input text-xs shadow-inner bg-white">
                                                <option value="Wajib">Wajib (Berlaku Semua Keperluan)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label class="block text-[9px] font-bold text-slate-500 mb-0.5">Judul Penanda (Opsional)</label>
                                            <input type="text" id="builder-q-judul" placeholder="Contoh: Data Pribadi" class="w-full px-2.5 py-1.5 rounded-lg custom-input text-xs shadow-inner bg-white">
                                        </div>
                                    </div>

                                    <div class="sm:col-span-2 mt-1">
                                        <label class="block text-[9px] font-bold text-slate-500 mb-0.5">Nama Pertanyaan / Label</label>
                                        <input type="text" id="builder-q-label" placeholder="Contoh: Bidang Usaha" class="w-full px-2.5 py-1.5 rounded-lg custom-input text-xs shadow-inner bg-white">
                                    </div>
                                    <div class="mt-1">
                                        <label class="block text-[9px] font-bold text-slate-500 mb-0.5">Wajib Diisi?</label>
                                        <select id="builder-q-required" class="w-full px-2.5 py-1.5 rounded-lg custom-input text-xs shadow-inner bg-white">
                                            <option value="ya">Ya (Wajib)</option>
                                            <option value="tidak">Tidak (Opsional)</option>
                                        </select>
                                    </div>
                                    <div class="mt-1">
                                        <label class="block text-[9px] font-bold text-slate-500 mb-0.5">Tipe Input</label>
                                        <select id="builder-q-type" onchange="toggleBuilderOptionInput()" class="w-full px-2.5 py-1.5 rounded-lg custom-input text-xs shadow-inner bg-white">
                                            <option value="text">Input Teks</option>
                                            <option value="dropdown">Dropdown (Pilihan)</option>
                                            <option value="number">Angka (Number)</option>
                                            <option value="date">Tanggal (Date)</option>
                                        </select>
                                    </div>

                                    <div id="wrapper-q-options" class="hidden sm:col-span-3">
                                        <label class="block text-[9px] font-bold text-slate-500 mb-0.5">Opsi Pilihan (Pisahkan dengan koma)</label>
                                        <input type="text" id="builder-q-options" placeholder="Contoh: Pertanian, Perdagangan, Jasa" class="w-full px-2.5 py-1.5 rounded-lg custom-input text-xs shadow-inner bg-white">
                                    </div>
                                    <div id="wrapper-q-limit" class="hidden sm:col-span-3">
                                        <label class="block text-[9px] font-bold text-slate-500 mb-0.5">Batas Maksimal Digit (Opsional)</label>
                                        <input type="number" id="builder-q-limit" placeholder="Contoh: 16 untuk NIK" class="w-full px-2.5 py-1.5 rounded-lg custom-input text-xs shadow-inner bg-white">
                                    </div>
                                    <div class="sm:col-span-3 flex justify-end">
                                        <button id="btn-add-update-question" onclick="addBuilderQuestionToList()" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md">
                                            <i class="fa-solid fa-plus"></i> <span>Tambahkan Pertanyaan</span>
                                        </button>
                                        <button id="btn-cancel-update-question" onclick="cancelEditBuilderQuestion()" class="hidden ml-2 px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-bold transition-all">Batal</button>
                                    </div>
                                </div>

                                <!-- REPEATER GROUP -->
                                <div class="bg-indigo-50/40 p-4 border border-indigo-100 rounded-2xl">
                                    <div class="mb-3 border-b border-indigo-100 pb-2">
                                        <h4 class="text-xs font-extrabold text-indigo-700"><i class="fa-solid fa-layer-group"></i> Grup Pertanyaan Berulang (Opsional)</h4>
                                    </div>
                                    <div class="grid grid-cols-1 gap-3 mb-3">
                                        <div>
                                            <label class="block text-[9px] font-bold text-slate-500 mb-0.5">Keperluan Surat</label>
                                            <select id="builder-repeater-keperluan" class="w-full px-2.5 py-1.5 rounded-lg custom-input text-xs shadow-inner bg-white" onchange="populateBuilderRepeaterSelect()">
                                                <option value="Wajib">Wajib (Berlaku Semua Keperluan)</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label class="block text-[9px] font-bold text-slate-500 mb-0.5">Pilih Pertanyaan</label>
                                        <div class="flex gap-2">
                                            <select id="builder-repeater-select" class="flex-grow px-2.5 py-1.5 rounded-lg custom-input text-xs shadow-inner bg-white border border-indigo-200">
                                                <option value="">-- Pilih Pertanyaan Tunggal --</option>
                                            </select>
                                            <button type="button" onclick="addQuestionToRepeaterTempList()" class="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-xs font-bold transition-all whitespace-nowrap shadow-sm"><i class="fa-solid fa-plus"></i> Sisipkan</button>
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <h5 class="text-[9px] font-bold text-slate-500 mb-1">Daftar Grup Pertanyaan Berulang:</h5>
                                        <div id="builder-repeater-temp-list" class="space-y-1.5 min-h-[40px] bg-white p-2 rounded-xl border border-indigo-100 shadow-inner">
                                            <div class="text-center text-[10px] text-slate-400 italic py-2">Belum ada pertanyaan dipilih.</div>
                                        </div>
                                    </div>
                                    <div class="flex justify-end">
                                        <button id="btn-add-update-repeater" onclick="saveRepeaterGroup()" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md">
                                            <i class="fa-solid fa-save"></i> <span>Tambahkan Grup</span>
                                        </button>
                                        <button id="btn-cancel-update-repeater" onclick="cancelEditRepeaterGroup()" class="hidden ml-2 px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-bold transition-all">Batal</button>
                                    </div>
                                </div>

                                <div class="space-y-2 mt-4">
                                    <h4 class="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Daftar Pertanyaan Yang Dibuat:</h4>
                                    <div id="builder-q-list" class="space-y-2 max-h-[300px] overflow-y-auto pr-2"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
"""

new_content = content[:start_idx] + new_html + content[end_idx:]

with open("c:\\Users\\alzia\\.gemini\\antigravity\\scratch\\PelayananDigitalDesa\\index.html", "w", encoding="utf-8") as f:
    f.write(new_content)

print("HTML Replaced successfully")
