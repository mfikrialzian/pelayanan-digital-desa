import re
content = open(r'D:\PelayananDigitalDesa\vercel-frontend\index.html', encoding='utf-8').read()
idx = content.find('id="subview-admin-daftar-layanan"')
start = content.rfind('id="admin-main-column"', 0, idx)
print(content[start:start+100])
if start != -1:
    print('Found admin-main-column before subview-admin-daftar-layanan')
else:
    print('Not inside admin-main-column?')
