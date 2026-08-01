with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

bidang_html = """
                    <div id="wrapper-builder-bidang" class="mt-4">
                        <label class="block text-[10px] font-bold text-slate-600 mb-2 uppercase tracking-wider">Bidang Terkait *</label>
                        <div class="flex flex-col gap-2">
                            <label class="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" name="builder-bidang" value="Kasi Pelayanan" class="w-4 h-4 text-emerald-600 bg-slate-50 border-slate-300 rounded focus-visible:ring-narmadaGreen focus-visible:ring-2 transition-all cursor-pointer accent-emerald-600">
                                <span class="text-xs font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">Kasi Pelayanan</span>
                            </label>
                            <label class="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" name="builder-bidang" value="Kasi Pemerintahan" class="w-4 h-4 text-emerald-600 bg-slate-50 border-slate-300 rounded focus-visible:ring-narmadaGreen focus-visible:ring-2 transition-all cursor-pointer accent-emerald-600">
                                <span class="text-xs font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">Kasi Pemerintahan</span>
                            </label>
                            <label class="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" name="builder-bidang" value="Kasi Kesejahteraan" class="w-4 h-4 text-emerald-600 bg-slate-50 border-slate-300 rounded focus-visible:ring-narmadaGreen focus-visible:ring-2 transition-all cursor-pointer accent-emerald-600">
                                <span class="text-xs font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">Kasi Kesejahteraan</span>
                            </label>
                        </div>
                    </div>
"""

target = '<datalist id="saran-nama-layanan"></datalist>\n                    </div>'

if target in html and 'wrapper-builder-bidang' not in html:
    html = html.replace(target, target + bidang_html)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Added Bidang HTML to index.html")
else:
    print("Target not found or already added")
