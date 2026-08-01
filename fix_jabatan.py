import io

with io.open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

old_jabatan = 'w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs relative'
new_jabatan = 'w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 relative transition-all'

text = text.replace(old_jabatan, new_jabatan)

with io.open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
print('Jabatan styling updated.')
