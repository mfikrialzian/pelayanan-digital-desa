import re

with open('index.html', encoding='utf-8') as f:
    lines = f.readlines()

start_idx = 0
for i, line in enumerate(lines):
    if 'id="subview-admin-dashboard"' in line:
        start_idx = i
        break

div_pattern = re.compile(r'(<\s*div[^>]*>|<\s*/\s*div\s*>)')
opened = 0
for i in range(start_idx, len(lines)):
    line = lines[i]
    for m in div_pattern.finditer(line):
        tag = m.group(1)
        if tag.startswith('</'):
            opened -= 1
        else:
            opened += 1
        
        if opened == 0 and i > start_idx:
            print(f'Hit 0 prematurely on line {i+1}: {line.strip()}')
            exit(0)
