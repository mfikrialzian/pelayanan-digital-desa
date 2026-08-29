with open('index.html', encoding='utf-8') as f:
    html = f.read()
start = html.find('id="subview-admin-dashboard"')
start = html.rfind('<div', 0, start)
end = html.find('id="subview-admin-daftar-layanan"')
end = html.rfind('<div', 0, end)
chunk = html[start:end]
print(chunk[-2500:])
