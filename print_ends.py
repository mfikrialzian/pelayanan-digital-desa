with open('index.html', encoding='utf-8') as f:
    html = f.read()

def print_end(start_id, next_id):
    start = html.find(f'id="{start_id}"')
    start = html.rfind('<div', 0, start)
    end = html.find(f'id="{next_id}"')
    end = html.rfind('<div', 0, end)
    chunk = html[start:end]
    print(f'\n--- End of {start_id} ---')
    print(chunk[-400:])

print_end('subview-admin-pengajuan', 'subview-admin-daftar-layanan')
print_end('subview-admin-layanan', 'subview-admin-verifikasi')
