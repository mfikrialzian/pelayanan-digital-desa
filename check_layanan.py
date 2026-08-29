import re

with open('index.html', encoding='utf-8') as f:
    html = f.read()

start_idx = html.find('id="subview-admin-layanan"')
start_idx = html.rfind('<div', 0, start_idx)
end_idx = html.find('id="subview-admin-verifikasi"')
end_idx = html.rfind('<div', 0, end_idx)

chunk = html[start_idx:end_idx]
print(chunk[-400:])
