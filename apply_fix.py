import re
import io

with io.open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Fix subview-admin-pengajuan
# Find the end of subview-admin-pengajuan
end_pengajuan = html.find('id="subview-admin-daftar-layanan"')
end_pengajuan = html.rfind('<div', 0, end_pengajuan)
chunk1 = html[:end_pengajuan]
rest1 = html[end_pengajuan:]

# Remove the last </div> in chunk1
last_div = chunk1.rfind('</div>')
if last_div != -1:
    chunk1 = chunk1[:last_div] + chunk1[last_div+6:]

html = chunk1 + rest1

# Fix subview-admin-layanan
end_layanan = html.find('id="subview-admin-verifikasi"')
end_layanan = html.rfind('<div', 0, end_layanan)
chunk2 = html[:end_layanan]
rest2 = html[end_layanan:]

last_div_layanan = chunk2.rfind('</div>')
if last_div_layanan != -1:
    chunk2 = chunk2[:last_div_layanan] + chunk2[last_div_layanan+6:]

html = chunk2 + rest2

with io.open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Applied fixes to index.html")
