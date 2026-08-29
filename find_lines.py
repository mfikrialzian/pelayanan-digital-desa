import re

with open('index.html', encoding='utf-8') as f:
    lines = f.readlines()

subviews = [
    'subview-admin-dashboard',
    'subview-admin-daftar-layanan',
    'subview-admin-beranda',
    'subview-admin-kredensial',
    'subview-admin-aktivitas'
]

for subview in subviews:
    for i, line in enumerate(lines):
        if subview in line:
            print(f'{subview}: line {i+1}')
            break
