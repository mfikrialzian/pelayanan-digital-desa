import io
import re

with io.open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

start_idx = -1
end_idx = -1

for i, line in enumerate(lines):
    if '<div id="subview-admin-tambah-pengguna"' in line:
        start_idx = i
    if '<div id="subview-admin-laporan"' in line:
        end_idx = i
        break

if start_idx != -1 and end_idx != -1:
    print(f'Replacing styles from line {start_idx} to {end_idx}')
    
    # Target replacements
    # 1. Labels
    label_pattern = re.compile(r'<label class="block text-\[10px\] font-bold text-slate-600 mb-1\.5">')
    label_repl = r'<label class="block text-[10px] font-bold text-slate-600 mb-1 uppercase tracking-wider">'
    
    # 2. Input/Select fields
    input_old = 'w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-narmadaGreen focus:border-narmadaGreen outline-none transition-colors'
    input_new = 'w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-1 focus:ring-narmadaGreen focus:border-narmadaGreen block px-4 py-2.5 outline-none transition-all placeholder-slate-400'
    
    # For select, it might not have px-4 py-2.5 in exactly that order or placeholder
    select_old = 'w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-narmadaGreen focus:border-narmadaGreen outline-none cursor-pointer transition-colors'
    select_new = 'w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-1 focus:ring-narmadaGreen focus:border-narmadaGreen block px-4 py-2.5 outline-none cursor-pointer transition-all'
    
    # Buttons
    batal_old = 'px-4 py-2 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors'
    batal_new = 'px-5 py-2.5 text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all'
    
    for i in range(start_idx, end_idx):
        line = lines[i]
        line = label_pattern.sub(label_repl, line)
        line = line.replace(input_old, input_new)
        line = line.replace(select_old, select_new)
        line = line.replace(batal_old, batal_new)
        
        # Also need to fix tp-btn-next to have transition-all (it already does, but check if we need to modify bg-slate-800 to primary, but user didn't explicitly mention it)
        # We will keep bg-slate-800 for 'Selanjutnya' since it's a step navigation.
        
        lines[i] = line
        
    with io.open('index.html', 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print('Styles updated!')
else:
    print('Could not find boundaries.')
