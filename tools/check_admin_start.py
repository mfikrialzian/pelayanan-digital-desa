import re
content = open(r'D:\PelayananDigitalDesa\vercel-frontend\index.html', encoding='utf-8').read()
idx1 = content.find('id="admin-main-column"')
print(content[idx1:idx1+300])
