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
print(f'Inside form opened: {opened}')
