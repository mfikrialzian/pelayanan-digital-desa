import re
with open('index.html', encoding='utf-8') as f:
    html = f.read()
ids = re.findall(r'id=\"(subview-admin-[^\"]+)\"', html)
print(ids)
