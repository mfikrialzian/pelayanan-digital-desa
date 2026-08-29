with open('index.html', encoding='utf-8') as f:
    html = f.read()
idx1 = html.rfind('<div', 0, html.find('id="subview-admin-daftar-layanan"'))
start = max(0, idx1 - 300)
print(html[start:idx1])
