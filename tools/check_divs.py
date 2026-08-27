import re
content = open(r'D:\PelayananDigitalDesa\vercel-frontend\index.html', encoding='utf-8').read()
idx = content.find('id="admin-main-column"')
end_idx = content.find('id="subview-admin-daftar-layanan"')
sub = content[idx:end_idx]
div_open = len(re.findall(r'<div', sub, re.IGNORECASE))
div_close = len(re.findall(r'</div', sub, re.IGNORECASE))
print(f"Open: {div_open}, Close: {div_close}")
