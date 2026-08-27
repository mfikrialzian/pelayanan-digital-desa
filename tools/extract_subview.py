import re
content = open(r'D:\PelayananDigitalDesa\vercel-frontend\index.html', encoding='utf-8').read()
idx1 = content.find('id="subview-admin-daftar-layanan"')
idx2 = content.find('id="subview-admin-verifikasi"')
if idx1 != -1 and idx2 != -1:
    print(content[idx1:idx2])
