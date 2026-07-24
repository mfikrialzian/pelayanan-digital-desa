const fs = require('fs');
const path = './script.html';

let content = fs.readFileSync(path, 'utf8');

// 1. Storage checks
content = content.replace(/localStorage\.getItem\('isAdminLoggedIn_Narmada'\) === 'true'/g, "sessionStorage.getItem('adminToken_Narmada') !== null");

// 2. Login success
content = content.replace(
    /if \(res\.success\) \{\s*localStorage\.setItem\('isAdminLoggedIn_Narmada', 'true'\);/g,
    "if (res.success) {\n                            sessionStorage.setItem('adminToken_Narmada', res.token);"
);

// 3. Dummy login success (offline)
content = content.replace(
    /if \(u === dummySetelan\.username && p === dummySetelan\.password\) \{\s*localStorage\.setItem\('isAdminLoggedIn_Narmada', 'true'\);/g,
    "if (u === dummySetelan.username && p === dummySetelan.password) {\n                        sessionStorage.setItem('adminToken_Narmada', 'dummy-token');"
);

// 4. Logout
content = content.replace(
    /localStorage\.removeItem\('isAdminLoggedIn_Narmada'\);/g,
    "var token = sessionStorage.getItem('adminToken_Narmada');\n            if (token && isGoogleEnv) {\n                google.script.run.logoutAdmin(token);\n            }\n            sessionStorage.removeItem('adminToken_Narmada');"
);

// 5. Admin endpoints
const endpoints = [
    'getAdminDashboardData',
    'updatePengajuanStatus',
    'crudLayanan',
    'updateAdminSetelan',
    'crudJenisPelayanan',
    'crudJenisPersyaratan'
];

endpoints.forEach(ep => {
    const regex = new RegExp(`\\.${ep}\\(`, 'g');
    content = content.replace(regex, `.${ep}(sessionStorage.getItem('adminToken_Narmada'), `);
});

// 6. Handle the auth error globally
content = content.replace(/withSuccessHandler\(function\s*\(([^)]+)\)\s*\{/g, (match, p1) => {
    // Avoid double patching if run multiple times
    if (content.indexOf(`if (${p1} && ${p1}.authError)`) !== -1) return match;
    return `withSuccessHandler(function (${p1}) {\n                        if (${p1} && ${p1}.authError) {\n                            pushToast(${p1}.error || ${p1}.message, "error");\n                            handleAdminLogout();\n                            return;\n                        }`;
});

fs.writeFileSync(path, content, 'utf8');
console.log("script.html updated.");
