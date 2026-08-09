import sys
import re

html_path = 'd:/PelayananDigitalDesa/vercel-frontend/index.html'

with open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

step1_match = re.search(r'(<div id="bl-step-1" class="space-y-6">.*?</div>\s*)<!-- STEP 2:', content, re.DOTALL)
step2_match = re.search(r'(<div id="bl-step-2" class="space-y-6 hidden">.*?</div>\s*)<!-- STEP 3:', content, re.DOTALL)
step3_match = re.search(r'(<div id="bl-step-3" class="space-y-6 hidden">.*?</div>\s*)<!-- STEP 4:', content, re.DOTALL)
step4_match = re.search(r'(<div id="bl-step-4" class="space-y-6 hidden">.*?</div>\s*)</div>\s*<!-- FOOTER NAV BUTTONS -->', content, re.DOTALL)

if not (step1_match and step2_match and step3_match and step4_match):
    print("Could not extract all steps using regex.")
    sys.exit(1)

step1 = step1_match.group(1)
step2 = step2_match.group(1)
step3 = step3_match.group(1)
step4 = step4_match.group(1)

steps_html = step1 + "\n<!-- STEP 2: Keperluan -->\n" + step2 + "\n<!-- STEP 3: Persyaratan -->\n" + step3 + "\n<!-- STEP 4: Pertanyaan -->\n" + step4

new_subview = f"""<div id="subview-admin-layanan" class="hidden w-full max-w-6xl mx-auto mt-4 pb-10">
    <div class="flex justify-between items-center mb-6">
        <div>
            <h2 class="text-2xl font-bold text-slate-900" id="unified-editor-title">Buat Layanan Baru</h2>
            <p class="text-sm text-slate-500 mt-1">Konfigurasi informasi, keperluan, persyaratan, dan formulir layanan.</p>
        </div>
        <div class="flex gap-3">
            <button type="button" id="ev-bind-30" class="cursor-pointer px-5 py-2.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-sm">Kembali</button>
            <button type="button" id="btn-save-draft" class="cursor-pointer px-5 py-2.5 text-sm font-semibold text-narmadaGreen bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all shadow-sm hidden"><i class="fa-solid fa-bookmark mr-1.5"></i> Simpan Draft</button>
        </div>
    </div>

    <div class="builder-split-layout">
        <!-- LEFT: MAIN EDITOR -->
        <div class="flex flex-col gap-6 w-full min-w-0">
            <!-- STEPPER -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 md:p-6 overflow-x-auto custom-scrollbar">
                <div class="flex items-center min-w-max gap-6 md:gap-8 px-2" id="builder-stepper">
                    <div class="stepper-node stepper-current cursor-pointer w-full" onclick="switchBuilderTab(1)" id="bl-tab-1">
                        <div class="stepper-circle shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-colors">1</div>
                        <span class="text-xs font-bold text-slate-800 whitespace-nowrap hidden sm:inline-block">Info Dasar</span>
                    </div>
                    <div class="stepper-node stepper-upcoming cursor-pointer w-full" onclick="switchBuilderTab(2)" id="bl-tab-2">
                        <div class="stepper-circle shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-colors">2</div>
                        <span class="text-xs font-semibold whitespace-nowrap hidden sm:inline-block">Keperluan</span>
                    </div>
                    <div class="stepper-node stepper-upcoming cursor-pointer w-full" onclick="switchBuilderTab(3)" id="bl-tab-3">
                        <div class="stepper-circle shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-colors">3</div>
                        <span class="text-xs font-semibold whitespace-nowrap hidden sm:inline-block">Berkas Wajib</span>
                    </div>
                    <div class="stepper-node stepper-upcoming cursor-pointer w-full" onclick="switchBuilderTab(4)" id="bl-tab-4">
                        <div class="stepper-circle shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-colors">4</div>
                        <span class="text-xs font-semibold whitespace-nowrap hidden sm:inline-block">Pertanyaan</span>
                    </div>
                    <div class="stepper-node stepper-upcoming cursor-pointer w-full" onclick="switchBuilderTab(5)" id="bl-tab-5">
                        <div class="stepper-circle shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-colors">5</div>
                        <span class="text-xs font-semibold whitespace-nowrap hidden sm:inline-block">Preview</span>
                    </div>
                </div>
            </div>

            <!-- EDITOR BODY -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 md:p-8 relative">
                <form id="form-builder-layanan" onsubmit="event.preventDefault();">
                    
                    <!-- INJECT EXISTING STEPS -->
                    {steps_html}
                    
                    <!-- NEW STEP 5: PREVIEW -->
                    <div id="bl-step-5" class="space-y-6 hidden animate-fade-in">
                        <h3 class="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3"><i class="fa-solid fa-eye text-narmadaGreen mr-2"></i> Pratinjau & Validasi</h3>
                        
                        <div class="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6">
                            <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Status Validasi</h4>
                            <ul class="space-y-2 text-sm text-slate-600" id="builder-validation-list">
                                <li class="flex items-start gap-2" id="val-info"><i class="fa-solid fa-circle-notch fa-spin text-amber-500 mt-0.5"></i> <span>Mengecek Informasi Dasar...</span></li>
                                <li class="flex items-start gap-2" id="val-kep"><i class="fa-solid fa-circle-notch fa-spin text-amber-500 mt-0.5"></i> <span>Mengecek Keperluan...</span></li>
                                <li class="flex items-start gap-2" id="val-req"><i class="fa-solid fa-circle-notch fa-spin text-amber-500 mt-0.5"></i> <span>Mengecek Persyaratan...</span></li>
                                <li class="flex items-start gap-2" id="val-qst"><i class="fa-solid fa-circle-notch fa-spin text-amber-500 mt-0.5"></i> <span>Mengecek Pertanyaan Tambahan...</span></li>
                            </ul>
                        </div>
                        
                        <div class="border border-slate-200 rounded-xl overflow-hidden">
                            <div class="bg-slate-100 px-4 py-2 border-b border-slate-200 text-xs font-bold text-slate-500 text-center">Preview Tampilan Warga (Simulasi)</div>
                            <div class="p-6 bg-white pointer-events-none opacity-80" id="builder-preview-container">
                                <h2 class="text-xl font-bold text-slate-800 mb-2" id="preview-title">Nama Layanan</h2>
                                <p class="text-sm text-slate-600 mb-6" id="preview-desc">Deskripsi layanan akan muncul di sini.</p>
                                
                                <div class="space-y-4">
                                    <div>
                                        <label class="block text-xs font-bold text-slate-700 mb-1">Keperluan Pengurusan</label>
                                        <select class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm"><option>-- Pilih Keperluan --</option></select>
                                    </div>
                                    <button class="w-full py-3 rounded-xl bg-slate-300 text-slate-500 font-bold text-sm">Ajukan Layanan Ini</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- FOOTER ACTIONS -->
                    <div class="mt-10 flex justify-between items-center pt-5 border-t border-slate-100 gap-3 flex-wrap">
                        <button type="button" id="bl-btn-prev" onclick="switchBuilderTab(blCurrentStep - 1)" class="cursor-pointer hover:scale-[1.02] active:scale-[0.98] px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all hidden shadow-sm"><i class="fa-solid fa-arrow-left mr-2"></i> Sebelumnya</button>
                        <div class="flex-1 min-w-[20px]"></div>
                        <button type="button" id="bl-btn-next" onclick="switchBuilderTab(blCurrentStep + 1)" class="cursor-pointer hover:scale-[1.02] active:scale-[0.98] px-5 py-2.5 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-xl transition-all shadow-sm">Lanjutkan <i class="fa-solid fa-arrow-right ml-2"></i></button>
                        <button type="button" id="ev-bind-31" class="cursor-pointer hover:scale-[1.02] active:scale-[0.98] px-6 py-2.5 text-sm font-bold text-white bg-narmadaGreen hover:bg-emerald-700 rounded-xl transition-all shadow-sm hidden"><i class="fa-solid fa-paper-plane mr-2"></i> Publikasikan Layanan</button>
                    </div>
                </form>
            </div>
        </div>
        
        <!-- RIGHT: SUMMARY PANEL -->
        <div class="hidden lg:block w-full">
            <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 summary-panel-sticky">
                <h3 class="text-sm font-bold text-slate-800 mb-5 border-b border-slate-100 pb-3"><i class="fa-solid fa-chart-pie text-narmadaGreen mr-1.5"></i> Ringkasan Layanan</h3>
                
                <div class="space-y-4 mb-6">
                    <div>
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nama Layanan</p>
                        <p class="text-sm font-bold text-slate-800 leading-snug" id="summary-nama">-</p>
                    </div>
                    <div>
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                        <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                            <span class="w-1.5 h-1.5 rounded-full bg-slate-400" id="summary-status-dot"></span>
                            <span id="summary-status">Draft / Perubahan</span>
                        </div>
                    </div>
                </div>
                
                <div class="grid grid-cols-2 gap-3 mb-6">
                    <div class="bg-slate-50 rounded-xl p-3 border border-slate-100 transition-all duration-300" id="sum-card-kep">
                        <p class="text-[10px] font-bold text-slate-500 mb-1">Keperluan</p>
                        <p class="text-lg font-black text-slate-800" id="summary-count-keperluan">0</p>
                    </div>
                    <div class="bg-slate-50 rounded-xl p-3 border border-slate-100 transition-all duration-300" id="sum-card-req">
                        <p class="text-[10px] font-bold text-slate-500 mb-1">Syarat</p>
                        <p class="text-lg font-black text-slate-800" id="summary-count-syarat">0</p>
                    </div>
                    <div class="bg-slate-50 rounded-xl p-3 border border-slate-100 col-span-2 flex justify-between items-center transition-all duration-300" id="sum-card-q">
                        <p class="text-[10px] font-bold text-slate-500 mb-0">Pertanyaan Tambahan</p>
                        <p class="text-lg font-black text-slate-800" id="summary-count-tanya">0</p>
                    </div>
                </div>
                
                <div class="border-t border-slate-100 pt-4">
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Alur Tahapan</p>
                    <ul class="space-y-2 text-xs font-medium text-slate-600" id="summary-stepper-list">
                        <li class="flex items-center gap-2 text-emerald-600 font-bold" id="sum-step-1"><i class="fa-solid fa-circle-check"></i> Info Dasar</li>
                        <li class="flex items-center gap-2 text-slate-400" id="sum-step-2"><i class="fa-regular fa-circle"></i> Keperluan</li>
                        <li class="flex items-center gap-2 text-slate-400" id="sum-step-3"><i class="fa-regular fa-circle"></i> Berkas Wajib</li>
                        <li class="flex items-center gap-2 text-slate-400" id="sum-step-4"><i class="fa-regular fa-circle"></i> Pertanyaan</li>
                        <li class="flex items-center gap-2 text-slate-400" id="sum-step-5"><i class="fa-regular fa-circle"></i> Preview & Publish</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- DRAWER COMPONENTS (Append outside of the view) -->
<div class="drawer-overlay" id="drawer-overlay" onclick="closeAllDrawers()"></div>

<!-- Drawer: Persyaratan -->
<div class="drawer-panel" id="drawer-req">
    <div class="drawer-header flex justify-between items-center">
        <h3 class="text-sm font-bold text-slate-800"><i class="fa-solid fa-file-contract text-narmadaGreen mr-1.5"></i> Detail Persyaratan</h3>
        <button type="button" onclick="closeAllDrawers()" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="drawer-body space-y-4">
        <!-- We will move the detailed config for requirements here later in P1 -->
        <p class="text-xs text-slate-500 italic">Konfigurasi detail persyaratan (wajib/opsional, ekstensi file, dll) akan diletakkan di sini pada fase berikutnya.</p>
    </div>
    <div class="drawer-footer flex justify-end gap-2">
        <button type="button" onclick="closeAllDrawers()" class="cursor-pointer px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all shadow-sm">Batal</button>
        <button type="button" onclick="closeAllDrawers()" class="cursor-pointer px-4 py-2 bg-narmadaGreen hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm">Terapkan</button>
    </div>
</div>

<!-- Drawer: Pertanyaan -->
<div class="drawer-panel" id="drawer-q">
    <div class="drawer-header flex justify-between items-center">
        <h3 class="text-sm font-bold text-slate-800"><i class="fa-solid fa-clipboard-question text-blue-600 mr-1.5"></i> Detail Pertanyaan</h3>
        <button type="button" onclick="closeAllDrawers()" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="drawer-body space-y-4">
        <!-- Content will be moved here in P1 -->
        <p class="text-xs text-slate-500 italic">Konfigurasi pertanyaan (wajib, tipe input, logika) akan dipindahkan ke drawer ini pada fase berikutnya.</p>
    </div>
    <div class="drawer-footer flex justify-end gap-2">
        <button type="button" onclick="closeAllDrawers()" class="cursor-pointer px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all shadow-sm">Batal</button>
        <button type="button" onclick="closeAllDrawers()" class="cursor-pointer px-4 py-2 bg-narmadaGreen hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm">Terapkan</button>
    </div>
</div>
"""

pattern = r'<div id="subview-admin-layanan" class="hidden w-full max-w-4xl mx-auto mt-4 pb-10">.*?</div>\s*<!-- FOOTER NAV BUTTONS -->.*?</div>\s*</form>\s*</div>\s*</div>\s*</div>'
content = re.sub(pattern, new_subview.replace('\\', '\\\\'), content, flags=re.DOTALL)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully replaced HTML structure for subview-admin-layanan.")
