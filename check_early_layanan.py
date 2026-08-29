import re

with open('index.html', encoding='utf-8') as f:
    html = f.read()

start_idx = html.find('id="subview-admin-layanan"')
start_idx = html.rfind('<div', 0, start_idx)

end_idx = html.find('id="subview-admin-verifikasi"')
end_idx = html.rfind('<div', 0, end_idx)

chunk = html[start_idx:end_idx]

div_pattern = re.compile(r'(<\s*div[^>]*>|<\s*/\s*div\s*>)')
opened = 0
for m in div_pattern.finditer(chunk):
    tag = m.group(1)
    if tag.startswith('</'):
        opened -= 1
    else:
        opened += 1
    
    if opened < 0:
        print('Premature closing at chunk index:', m.start())
        print('Context:', chunk[max(0, m.start()-200):min(len(chunk), m.end()+200)])
        break
