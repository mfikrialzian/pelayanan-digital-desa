import re
content = open(r'D:\PelayananDigitalDesa\vercel-frontend\index.html', encoding='utf-8').read()
admin_idx = content.find('id="admin-main-column"')
idx1 = content.rfind('<div', 0, admin_idx)
end_idx = content.find('id="subview-admin-daftar-layanan"')
sub = content[idx1:end_idx]

tags = re.finditer(r'<(/?div)[^>]*>', sub, re.IGNORECASE)
stack = []
for m in tags:
    tag = m.group(1).lower()
    full = m.group(0)
    if tag == 'div':
        id_m = re.search(r'id=["\']([^"\']+)["\']', full)
        id_str = id_m.group(1) if id_m else 'div'
        stack.append(id_str)
    elif tag == '/div':
        if stack:
            popped = stack.pop()

print("Final stack:", stack)
