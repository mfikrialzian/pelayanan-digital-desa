import io

with io.open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# For Tambah Pengguna
target_1 = '<div id="subview-admin-tambah-pengguna" class="hidden w-full max-w-4xl mx-auto mt-4 pb-10">\n                    <div class="bg-slate-50 rounded-2xl shadow-sm border border-slate-100 flex flex-col">'
repl_1 = '<div id="subview-admin-tambah-pengguna" class="hidden w-full max-w-4xl mx-auto mt-4 pb-10">\n                    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col">'

# For Edit Pengguna
target_2 = '<div id="subview-admin-edit-pengguna" class="hidden w-full max-w-4xl mx-auto mt-4 pb-10">\n                    <div class="bg-slate-50 rounded-2xl shadow-sm border border-slate-100 flex flex-col">'
repl_2 = '<div id="subview-admin-edit-pengguna" class="hidden w-full max-w-4xl mx-auto mt-4 pb-10">\n                    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col">'

if target_1 in text:
    text = text.replace(target_1, repl_1)
    print('Updated Tambah Pengguna bg')

if target_2 in text:
    text = text.replace(target_2, repl_2)
    print('Updated Edit Pengguna bg')

with io.open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
