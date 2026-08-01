import io

with io.open('src/admin/pengguna.js', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace("document.getElementById('mp-menu-container').classList.remove('hidden');\\n        document.getElementById('mp-content-daftar').classList.remove('hidden');", "document.getElementById('mp-content-daftar').classList.remove('hidden');")

text = text.replace("document.getElementById('mp-menu-container').classList.remove('hidden');\\n            document.getElementById('mp-content-daftar').classList.remove('hidden');", "document.getElementById('mp-content-daftar').classList.remove('hidden');")

with io.open('src/admin/pengguna.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Fixed menu bug")
