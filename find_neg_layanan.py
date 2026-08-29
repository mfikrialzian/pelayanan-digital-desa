import re

with open('index.html', encoding='utf-8') as f:
    html = f.read()

idx1 = html.find('id="subview-admin-layanan"')
idx2 = html.rfind('<div', 0, html.find('id="subview-admin-daftar-layanan"'))

chunk = html[idx1:idx2]
div_pattern = re.compile(r'<\s*div[^>]*>|<\s*/\s*div\s*>')
opened = 0
for i, line in enumerate(chunk.split('\n')):
    for d in div_pattern.findall(line):
        if d.startswith('</'): opened -= 1
        else: opened += 1
    if opened < 0:
        print(f'Negative balance reached at chunk line {i+1}: {line.strip()[:100]}')
        break
