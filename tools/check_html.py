import re
content = open(r'D:\PelayananDigitalDesa\vercel-frontend\index.html', encoding='utf-8').read()
idx = content.find('subview-admin-daftar-layanan')
start = content.rfind('id="subview-admin-', 0, idx - 100)
print(content[start:idx+100])
