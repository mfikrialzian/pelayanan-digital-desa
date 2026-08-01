import io
import re

with io.open('src/admin/pengguna.js', 'r', encoding='utf-8') as f:
    text = f.read()

# We need to replace closeModalTambahPengguna
old_func = '''export function closeModalTambahPengguna() {
    let subview = document.getElementById('subview-admin-tambah-pengguna');
    if (subview) subview.classList.add('hidden');
    document.getElementById('mp-menu-container').classList.remove('hidden');
    document.getElementById('mp-content-daftar').classList.remove('hidden');
}'''

new_func = '''export function closeModalTambahPengguna() {
    showCustomConfirm(
        '<i class="fa-solid fa-triangle-exclamation text-amber-500"></i> Batalkan Pembuatan',
        'Apakah Anda yakin ingin membatalkan? Data yang telah diisi akan hilang.',
        function() {
            let subview = document.getElementById('subview-admin-tambah-pengguna');
            if (subview) subview.classList.add('hidden');
            document.getElementById('mp-menu-container').classList.remove('hidden');
            document.getElementById('mp-content-daftar').classList.remove('hidden');
        }
    );
}'''

if old_func in text:
    text = text.replace(old_func, new_func)
    with io.open('src/admin/pengguna.js', 'w', encoding='utf-8') as f:
        f.write(text)
    print('Updated closeModalTambahPengguna')
else:
    print('Could not find the function exactly as written.')
