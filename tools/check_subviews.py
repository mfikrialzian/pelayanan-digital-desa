import re
content = open(r'D:\PelayananDigitalDesa\vercel-frontend\index.html', encoding='utf-8').read()
for match in re.finditer(r'<div[^>]*id="subview-admin-[^"]*"[^>]*>', content):
    print(match.group(0))
