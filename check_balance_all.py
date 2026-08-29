import re

with open('index.html', encoding='utf-8') as f:
    html = f.read()

subviews = [
    'subview-admin-dashboard',
    'subview-admin-pengajuan',
    'subview-admin-daftar-layanan',
    'subview-admin-layanan',
    'subview-admin-verifikasi',
    'subview-admin-kontak',
    'subview-admin-beranda',
    'subview-admin-kredensial',
    'subview-admin-laporan',
    'subview-admin-aktivitas',
    'subview-admin-pengaturan-akun'
]

div_pattern = re.compile(r'<\s*div[^>]*>|<\s*/\s*div\s*>')

for i in range(len(subviews)):
    start_id = subviews[i]
    start_idx = html.find(f'id="{start_id}"')
    if start_idx == -1:
        print(f'{start_id}: NOT FOUND')
        continue
    start_idx = html.rfind('<div', 0, start_idx)
    
    if i < len(subviews) - 1:
        end_idx = html.find(f'id="{subviews[i+1]}"')
        if end_idx != -1:
            end_idx = html.rfind('<div', 0, end_idx)
        else:
            end_idx = len(html)
    else:
        end_idx = html.find('<!-- FOOTER ADMIN', start_idx)
        if end_idx == -1: end_idx = html.find('<!-- Modal', start_idx)
        if end_idx == -1: end_idx = len(html)
    
    chunk = html[start_idx:end_idx]
    
    opened = 0
    closed = 0
    for d in div_pattern.findall(chunk):
        if d.startswith('</'): closed += 1
        else: opened += 1
    
    print(f'{start_id}: Opened: {opened}, Closed: {closed}, Diff: {opened - closed}')
