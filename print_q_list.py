with open('index.html', encoding='utf-8') as f:
    lines = f.readlines()
for i, line in enumerate(lines):
    if 'id="builder-q-list"' in line:
        for j in range(max(0, i-30), min(len(lines), i+20)):
            print(f'{j+1}: {lines[j]}', end='')
        break
