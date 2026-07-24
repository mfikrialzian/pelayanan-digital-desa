import re

path = 'script.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Storage checks
content = re.sub(r"localStorage\.getItem\('isAdminLoggedIn_Narmada'\) === 'true'", "sessionStorage.getItem('adminToken_Narmada') !== null", content)

# 2. Login success
content = re.sub(
    r"if \(res\.success\) \{\s*localStorage\.setItem\('isAdminLoggedIn_Narmada', 'true'\);",
    "if (res.success) {\n                            sessionStorage.setItem('adminToken_Narmada', res.token);",
    content
)

# 3. Dummy login success (offline)
content = re.sub(
    r"if \(u === dummySetelan\.username && p === dummySetelan\.password\) \{\s*localStorage\.setItem\('isAdminLoggedIn_Narmada', 'true'\);",
    "if (u === dummySetelan.username && p === dummySetelan.password) {\n                        sessionStorage.setItem('adminToken_Narmada', 'dummy-token');",
    content
)

# 4. Logout
content = re.sub(
    r"localStorage\.removeItem\('isAdminLoggedIn_Narmada'\);",
    "var token = sessionStorage.getItem('adminToken_Narmada');\n            if (token && isGoogleEnv) {\n                google.script.run.logoutAdmin(token);\n            }\n            sessionStorage.removeItem('adminToken_Narmada');",
    content
)

# 5. Admin endpoints
endpoints = [
    'getAdminDashboardData',
    'updatePengajuanStatus',
    'crudLayanan',
    'updateAdminSetelan',
    'crudJenisPelayanan',
    'crudJenisPersyaratan'
]

for ep in endpoints:
    content = re.sub(rf"\.{ep}\(", f".{ep}(sessionStorage.getItem('adminToken_Narmada'), ", content)

# 6. Handle auth error globally
def repl_success_handler(match):
    p1 = match.group(1)
    if f"if ({p1} && {p1}.authError)" in content:
        return match.group(0)
    return f'withSuccessHandler(function ({p1}) {{\n                        if ({p1} && {p1}.authError) {{\n                            pushToast({p1}.error || {p1}.message, "error");\n                            handleAdminLogout();\n                            return;\n                        }}'

content = re.sub(r"withSuccessHandler\(function\s*\(([^)]+)\)\s*\{", repl_success_handler, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("script.html updated.")
