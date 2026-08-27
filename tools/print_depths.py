import re
content = open(r'D:\PelayananDigitalDesa\vercel-frontend\index.html', encoding='utf-8').read()
start_idx = content.find('<form id="form-builder-layanan"')
end_idx = content.find('</form>', start_idx)
sub = content[start_idx:end_idx]

lines = sub.split('\n')
depth = 0
for i, line in enumerate(lines):
    tags = re.finditer(r'<(/?div)[^>]*>', line, re.IGNORECASE)
    for m in tags:
        tag = m.group(1).lower()
        if tag == 'div':
            depth += 1
        elif tag == '/div':
            depth -= 1
    print(f"L{i}: Depth={depth} | {line.strip()}")
