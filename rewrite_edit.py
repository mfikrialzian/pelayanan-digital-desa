import io
import re

with io.open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

start_idx = -1
end_idx = -1

for i, line in enumerate(lines):
    if '<!-- SUBVIEW EDIT PENGGUNA -->' in line:
        start_idx = i
    if '<div id="subview-admin-tambah-pengguna"' in line:
        end_idx = i
        break

if start_idx != -1 and end_idx != -1:
    print(f'Applying DESIGN.md to Edit Pengguna (lines {start_idx} to {end_idx})')
    
    # 1. Labels
    label_pattern = re.compile(r'<label class="block text-\[10px\] font-bold text-slate-600 mb-1\.5">')
    label_repl = r'<label class="block text-[10px] font-bold text-slate-600 mb-1 uppercase tracking-wider">'
    
    # 2. Input/Select fields (old style with blue rings)
    input_pattern = re.compile(r'w-full px-4 py-2\.5 rounded-xl bg-slate-[0-9]+ border border-slate-200 text-xs text-slate-[0-9]+ cursor-not-allowed font-mono')
    # wait, the disabled one is special:
    # <input ... class="w-full px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-500 cursor-not-allowed font-mono">
    
    # let's do simple replaces
    for i in range(start_idx, end_idx):
        line = lines[i]
        
        # Change label
        line = label_pattern.sub(label_repl, line)
        
        # Change blue-600 to narmadaGreen
        line = line.replace('text-blue-600', 'text-narmadaGreen')
        line = line.replace('bg-blue-600', 'bg-narmadaGreen')
        line = line.replace('bg-blue-700', 'bg-emerald-700')
        line = line.replace('focus:ring-blue-600', 'focus:ring-narmadaGreen')
        line = line.replace('focus:border-blue-600', 'focus:border-narmadaGreen')
        
        # Update inputs (standard)
        input_old = 'w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-narmadaGreen focus:border-narmadaGreen outline-none transition-colors'
        input_new = 'w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-1 focus:ring-narmadaGreen focus:border-narmadaGreen block px-4 py-2.5 outline-none transition-all placeholder-slate-400'
        line = line.replace(input_old, input_new)
        
        # Update select
        select_old = 'w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-narmadaGreen focus:border-narmadaGreen outline-none transition-colors'
        line = line.replace(select_old, input_new)
        
        # Update disabled input
        disabled_old = 'w-full px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-500 cursor-not-allowed font-mono'
        disabled_new = 'w-full bg-slate-100 border border-slate-200 text-slate-500 text-sm rounded-xl cursor-not-allowed block px-4 py-2.5 font-mono'
        line = line.replace(disabled_old, disabled_new)
        
        # Update Batal button
        batal_old = 'px-4 py-2 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors'
        batal_new = 'px-5 py-2.5 text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all'
        line = line.replace(batal_old, batal_new)
        
        lines[i] = line
        
    with io.open('index.html', 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print('Edit Pengguna styles updated!')
else:
    print('Could not find boundaries.')
