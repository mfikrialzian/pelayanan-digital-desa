with open('index.html', encoding='utf-8') as f:
    html = f.read()
idx2 = html.rfind('<div', 0, html.find('id="subview-admin-daftar-layanan"'))
start = html.rfind('<form', 0, idx2)
print(html[start-150:start+100])
