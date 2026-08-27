import re
content = open(r'D:\PelayananDigitalDesa\vercel-frontend\index.html', encoding='utf-8').read()
start_idx = content.find('<form id="form-builder-layanan"')
end_idx = content.find('</form>', start_idx)
sub = content[start_idx:end_idx]

tags = re.finditer(r'<(/?div)[^>]*>', sub, re.IGNORECASE)
depth = 0
for m in tags:
    tag = m.group(1).lower()
    if tag == 'div':
        depth += 1
    elif tag == '/div':
        depth -= 1

print(f"Depth at end of form-builder-layanan: {depth}")
