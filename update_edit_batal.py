import io
import re

with io.open('src/admin/pengguna.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Update closeModalEditPengguna
old_func = '''export function closeModalEditPengguna() {
    let subview = document.getElementById('subview-admin-edit-pengguna');
    if (subview) subview.classList.add('hidden');
    document.getElementById('mp-menu-container').classList.remove('hidden');
    document.getElementById('mp-content-daftar').classList.remove('hidden');
}'''

new_func = '''export function closeModalEditPengguna() {
    showCustomConfirm(
        '<i class="fa-solid fa-triangle-exclamation text-amber-500"></i> Batalkan Perubahan',
        'Apakah Anda yakin ingin membatalkan? Perubahan yang Anda buat tidak akan disimpan.',
        function() {
            let subview = document.getElementById('subview-admin-edit-pengguna');
            if (subview) subview.classList.add('hidden');
            document.getElementById('mp-menu-container').classList.remove('hidden');
            document.getElementById('mp-content-daftar').classList.remove('hidden');
        }
    );
}'''

if old_func in text:
    text = text.replace(old_func, new_func)

# Change text-blue-600 to text-narmadaGreen in simpanEditPengguna
text = text.replace('fa-floppy-disk text-blue-600', 'fa-floppy-disk text-narmadaGreen')

with io.open('src/admin/pengguna.js', 'w', encoding='utf-8') as f:
    f.write(text)
print('Updated edit pengguna js!')
