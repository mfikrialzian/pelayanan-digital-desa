import io
import re

print("Starting update...")

# --- UPDATE index.html ---
with io.open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Replace the grid wrapper
grid_start = '<div class="grid grid-cols-1 xl:grid-cols-3 gap-6">'
if grid_start in html:
    html = html.replace(grid_start, '<div class="max-w-4xl mx-auto space-y-6">', 1)

# 2. Remove left column wrapper
if '<!-- LEFT COLUMN:' in html:
    html = re.sub(r'<!-- LEFT COLUMN:.*?-->\s*<div class="xl:col-span-1 space-y-6">', '<!-- INFO DASAR & KEPERLUAN -->', html)
    # The closing div for left column is right before RIGHT COLUMN
    html = re.sub(r'                            </div>\s*<!-- RIGHT COLUMN: PERSYARATAN & PERTANYAAN -->\s*<div class="xl:col-span-2 space-y-6">', '<!-- PERSYARATAN & PERTANYAAN -->', html)
    
    # We still need to remove the closing div of the old right column.
    # It is right before:
    #                             <!-- TOMBOL SIMPAN -->
    html = re.sub(r'                            </div>\s*</div>\s*<!-- TOMBOL SIMPAN -->', r'                            </div>\n\n                            <!-- TOMBOL SIMPAN -->', html)

with io.open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated index.html")

# --- UPDATE src/admin/layanan.js ---
with io.open('src/admin/layanan.js', 'r', encoding='utf-8') as f:
    js = f.read()

old_js = """export function openLayananEditor(id) {
            document.getElementById('subview-admin-daftar-layanan').classList.add('hidden');
            document.getElementById('subview-admin-layanan').classList.remove('hidden');
            if(id === '__NEW__') {
                document.getElementById('builder-select-layanan').value = '[+] TAMBAH LAYANAN BARU';
            } else {
                document.getElementById('builder-select-layanan').value = id;
            }
            handleBuilderLayananLoad();
        }"""

new_js = """export function openLayananEditor(id) {
            document.getElementById('subview-admin-daftar-layanan').classList.add('hidden');
            document.getElementById('subview-admin-layanan').classList.remove('hidden');
            let titleEl = document.getElementById('unified-editor-title');
            if(id === '__NEW__') {
                document.getElementById('builder-select-layanan').value = '[+] TAMBAH LAYANAN BARU';
                if(titleEl) titleEl.innerText = 'Buat Layanan Baru';
            } else {
                document.getElementById('builder-select-layanan').value = id;
                if(titleEl) titleEl.innerText = 'Edit Layanan: ' + id;
            }
            handleBuilderLayananLoad();
        }"""

if old_js in js:
    js = js.replace(old_js, new_js)
    with io.open('src/admin/layanan.js', 'w', encoding='utf-8') as f:
        f.write(js)
    print("Updated src/admin/layanan.js")
else:
    print("WARNING: Could not find old_js in src/admin/layanan.js")

print("Done.")
