const fs = require('fs');
let js = fs.readFileSync('d:/PelayananDigitalDesa/vercel-frontend/src/warga/pengajuan_wizard.js', 'utf8');
const start = js.indexOf('export function toggleWizardStep2State()');
const end = js.indexOf('export function toggleSubmitButtonState()');
if(start !== -1 && end !== -1) {
    const newFunc = `export function toggleWizardStep2State() {
    let nik = document.getElementById('warga-nik').value.trim();
    let nama = document.getElementById('warga-nama').value.trim();
    let wa = document.getElementById('warga-wa').value.trim();
    let alamat = document.getElementById('warga-alamat').value.trim();
    let isValid = (nik.length === 16 && nama !== '' && wa !== '' && alamat !== '');
    let btnNext = document.getElementById('btn-next-step-2');
    if (btnNext) {
        if (isValid) {
            btnNext.disabled = false;
            btnNext.className = 'px-5 py-2.5 rounded-xl bg-narmadaGreen hover:bg-narmadaGreen-dark text-white font-bold text-xs shadow-lg transition-all flex items-center gap-1.5 cursor-pointer tap-squish';
        } else {
            btnNext.disabled = true;
            btnNext.className = 'px-5 py-2.5 rounded-xl bg-slate-300 text-slate-500 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-not-allowed tap-squish';
        }
    }
}

`;
    js = js.substring(0, start) + newFunc + js.substring(end);
    fs.writeFileSync('d:/PelayananDigitalDesa/vercel-frontend/src/warga/pengajuan_wizard.js', js);
    console.log('Replaced toggleWizardStep2State');
} else {
    console.log('Not found');
}
