import re

html = open('index.html', encoding='utf-8').read()
start = html.find('<div id="subview-admin-layanan"')
end = html.find('<div id="subview-admin-daftar-layanan"')
snippet = html[start:end]

opens = len(re.findall(r'<div\b[^>]*>', snippet))
closes = len(re.findall(r'</div>', snippet))

print("Opens:", opens, "Closes:", closes, "Diff:", opens - closes)
