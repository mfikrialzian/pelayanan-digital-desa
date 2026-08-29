html = open('index.html', encoding='utf-8').read()
idx1 = html.find('id="subview-admin-layanan"')
idx2 = html.rfind('<div', 0, html.find('id="subview-admin-daftar-layanan"'))
chunk = html[idx1:idx2]
for i, line in enumerate(chunk.split('\n')):
    if 220 <= i <= 240:
        print(f'{i+1}: {line.strip()}')
