import io
import re

with io.open('src/admin/pengguna.js', 'r', encoding='utf-8') as f:
    text = f.read()

old_func = '''export function closeModalTambahPengguna() {
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

new_func = '''export function closeModalTambahPengguna(skipConfirm = false) {
    if (skipConfirm) {
        let subview = document.getElementById('subview-admin-tambah-pengguna');
        if (subview) subview.classList.add('hidden');
        document.getElementById('mp-menu-container').classList.remove('hidden');
        document.getElementById('mp-content-daftar').classList.remove('hidden');
        return;
    }
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

text = text.replace(old_func, new_func)

# Also update callCrudPengguna success handler to pass true
old_call = '''            callCrudPengguna('create', akunBaru, function() {
                closeModalTambahPengguna();'''
new_call = '''            callCrudPengguna('create', akunBaru, function() {
                closeModalTambahPengguna(true);'''
text = text.replace(old_call, new_call)


# Also do the same for closeModalEditPengguna!
old_edit_func = '''export function closeModalEditPengguna() {
    showCustomConfirm(
        '<i class="fa-solid fa-triangle-exclamation text-amber-500"></i> Batalkan Perubahan',
        'Apakah Anda yakin ingin membatalkan? Perubahan yang belum disimpan akan hilang.',
        function() {
            let subview = document.getElementById('subview-admin-edit-pengguna');
            if (subview) subview.classList.add('hidden');
            document.getElementById('mp-menu-container').classList.remove('hidden');
            document.getElementById('mp-content-daftar').classList.remove('hidden');
        }
    );
}'''

new_edit_func = '''export function closeModalEditPengguna(skipConfirm = false) {
    if (skipConfirm) {
        let subview = document.getElementById('subview-admin-edit-pengguna');
        if (subview) subview.classList.add('hidden');
        document.getElementById('mp-menu-container').classList.remove('hidden');
        document.getElementById('mp-content-daftar').classList.remove('hidden');
        return;
    }
    showCustomConfirm(
        '<i class="fa-solid fa-triangle-exclamation text-amber-500"></i> Batalkan Perubahan',
        'Apakah Anda yakin ingin membatalkan? Perubahan yang belum disimpan akan hilang.',
        function() {
            let subview = document.getElementById('subview-admin-edit-pengguna');
            if (subview) subview.classList.add('hidden');
            document.getElementById('mp-menu-container').classList.remove('hidden');
            document.getElementById('mp-content-daftar').classList.remove('hidden');
        }
    );
}'''
text = text.replace(old_edit_func, new_edit_func)

old_edit_call = '''            callCrudPengguna('update', window.editPenggunaData, function() {
                closeModalEditPengguna();'''
new_edit_call = '''            callCrudPengguna('update', window.editPenggunaData, function() {
                closeModalEditPengguna(true);'''
text = text.replace(old_edit_call, new_edit_call)


with io.open('src/admin/pengguna.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("pengguna.js updated")
