import re
html = open('index.html', encoding='utf-8').read()
idx1 = html.find('id="form-builder-layanan"')
idx2 = html.find('</form>', idx1)
chunk = html[idx1:idx2]
div_pattern = re.compile(r'<\s*div[^>]*>|<\s*/\s*div\s*>')
opened = 0
for i, line in enumerate(chunk.split('\n')):
    for d in div_pattern.findall(line):
        if d.startswith('</'): opened -= 1
        else: opened += 1
    if opened < 0:
        print(f'Negative balance reached inside form at line {i+1}: {line.strip()[:100]}')
        # Let's print some lines before it to provide context
        lines = chunk.split('\n')
        for j in range(max(0, i-10), i+2):
            if j < len(lines):
                print(f'{j+1}: {lines[j].strip()}')
        break
