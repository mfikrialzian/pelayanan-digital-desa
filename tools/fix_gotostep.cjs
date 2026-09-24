
const fs = require('fs');
let js = fs.readFileSync('d:/PelayananDigitalDesa/vercel-frontend/src/warga/pengajuan_wizard.js', 'utf8');

js = js.replace(/if \(stepNum === 4\) \{\s*window\.step3CurrentPage = 1;/g, 'if (stepNum === 3) {\n                window.step3CurrentPage = 1;');

fs.writeFileSync('d:/PelayananDigitalDesa/vercel-frontend/src/warga/pengajuan_wizard.js', js);
