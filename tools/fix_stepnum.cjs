const fs = require('fs');
let js = fs.readFileSync('d:/PelayananDigitalDesa/vercel-frontend/src/warga/pengajuan_wizard.js', 'utf8');

js = js.replace('if (stepNum === 4) {\r\n                window.step3CurrentPage = 1;', 'if (stepNum === 3) {\n                window.step3CurrentPage = 1;');
js = js.replace('if (stepNum === 4) {\n                window.step3CurrentPage = 1;', 'if (stepNum === 3) {\n                window.step3CurrentPage = 1;');

// Fix goToStep3 to validate Identitas
const step3Old = `export function goToStep3() {
            let nik = document.getElementById('warga-nik').value.trim();
            let nama = document.getElementById('warga-nama').value.trim();
            let wa = document.getElementById('warga-wa').value.trim();`;

const step3New = `export function goToStep3() {
            let nik = document.getElementById('warga-nik').value.trim();
            let nama = document.getElementById('warga-nama').value.trim();
            let wa = document.getElementById('warga-wa').value.trim();`;

// Wait, I already refactored step logic in `refactor_logic.cjs`. Let's check `goToStep` logic again.
// Did it replace properly? 
// No, I need to explicitly fix goToStep3 (identitas to isian), goToStep4 (isian to upload), goToStep5 (upload to tinjau).
// Because my previous regex `js.replace(/goToStep6\(\)/g, 'goToStep5()');` and so on might be incomplete.

fs.writeFileSync('d:/PelayananDigitalDesa/vercel-frontend/tools/fix_gotostep.cjs', `
const fs = require('fs');
let js = fs.readFileSync('d:/PelayananDigitalDesa/vercel-frontend/src/warga/pengajuan_wizard.js', 'utf8');

js = js.replace(/if \\(stepNum === 4\\) \\{\\s*window\\.step3CurrentPage = 1;/g, 'if (stepNum === 3) {\\n                window.step3CurrentPage = 1;');

fs.writeFileSync('d:/PelayananDigitalDesa/vercel-frontend/src/warga/pengajuan_wizard.js', js);
`);
console.log('done writing fix script');
