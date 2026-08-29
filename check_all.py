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
        
        if opened < 0:
            print(f'Mismatch on line {i+1}: {line.strip()}')
            print('Extra </div> found! Stopping.')
            exit(0)
