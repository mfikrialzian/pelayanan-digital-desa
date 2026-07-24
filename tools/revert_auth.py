import os
files = ['script_warga.html', 'script_core.html', 'script_admin.html', 'test.html', 'update_auth.js', 'update_auth.py']
for file in files:
    if os.path.exists(file):
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
        content = content.replace("sessionStorage.getItem('adminToken_Narmada')", "localStorage.getItem('adminToken_Narmada')")
        content = content.replace("sessionStorage.setItem('adminToken_Narmada'", "localStorage.setItem('adminToken_Narmada'")
        content = content.replace("sessionStorage.removeItem('adminToken_Narmada')", "localStorage.removeItem('adminToken_Narmada')")
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
print("Done")
