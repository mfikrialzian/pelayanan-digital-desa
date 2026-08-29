import io

with io.open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

end_layanan = html.find('id="subview-admin-verifikasi"')
end_layanan = html.rfind('<div', 0, end_layanan)

html = html[:end_layanan] + '</div>\n' + html[end_layanan:]

with io.open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
