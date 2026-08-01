import re

with open('src/admin/layanan.js', 'r', encoding='utf-8') as f:
    js = f.read()

# 1. Update Keperluan List (add animate-fade-in)
js = js.replace('<div class="bg-white border border-slate-200 rounded-xl p-3 shadow-sm text-left mb-2 flex justify-between items-center gap-2">',
                '<div class="bg-white border border-slate-200 rounded-xl p-3 shadow-sm text-left mb-2 flex justify-between items-center gap-2 animate-fade-in">')

# 2. Update Keperluan delete button
js = js.replace('class="px-2 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-xs font-bold transition-colors shadow-sm shrink-0"',
                'class="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-xs font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-sm shrink-0"')

# 3. Update Persyaratan list wrapper (add animate-fade-in)
js = js.replace('let html = \'<div class="bg-white border border-slate-200 rounded-xl p-3 shadow-sm text-left mb-2">\'',
                'let html = \'<div class="bg-white border border-slate-200 rounded-xl p-3 shadow-sm text-left mb-2 animate-fade-in">\'')

# 4. Update Persyaratan delete button
js = js.replace('class="text-red-500 hover:text-red-700 px-1 bg-white border border-slate-200 rounded shadow-sm"',
                'class="text-red-500 hover:text-red-700 p-2 bg-white border border-slate-200 rounded shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"')

with open('src/admin/layanan.js', 'w', encoding='utf-8') as f:
    f.write(js)

print('Updated layanan.js')
