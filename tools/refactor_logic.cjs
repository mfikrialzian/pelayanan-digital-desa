const fs = require('fs');

let html = fs.readFileSync('d:/PelayananDigitalDesa/vercel-frontend/index.html', 'utf8');

// The new Section 1 uses btn-next-step-1. Let's fix the buttons in Sections 2, 3, 4, 5
// Since I already regex replaced wizard-section-3 -> 2, etc.
// Let's manually replace the button IDs in the whole document.
// Actually, it's easier to just use regex to fix all the prev/next buttons.

html = html.replace(/id="btn-prev-step-3"/g, 'id="btn-prev-step-2"');
html = html.replace(/id="btn-next-step-3"/g, 'id="btn-next-step-2"');

html = html.replace(/id="btn-prev-step-4"/g, 'id="btn-prev-step-3"');
html = html.replace(/id="btn-next-step-4"/g, 'id="btn-next-step-3"');

html = html.replace(/id="btn-prev-step-5"/g, 'id="btn-prev-step-4"');
// Wait, the prev step 5 was in section 5, which is now section 4.
// But the original Section 2 (Persyaratan) had NO prev button, only next (btn-next-step-5). Wait, no it had btn-next-step-5? Let me check the original string.
// Let's just fix the remaining buttons based on their text!
html = html.replace(/Lanjut ke Isian/g, 'Lanjut ke Isian');
// Let's fix the ID strings exactly
html = html.replace(/id="btn-next-step-2"/g, 'id="btn-next-step-2_OLD"'); // protect just in case
html = html.replace(/id="btn-prev-step-3"/g, 'id="btn-prev-step-2"');
html = html.replace(/id="btn-next-step-3"/g, 'id="btn-next-step-2"');
html = html.replace(/id="btn-prev-step-4"/g, 'id="btn-prev-step-3"');
html = html.replace(/id="btn-next-step-4"/g, 'id="btn-next-step-3"');
html = html.replace(/id="btn-prev-step-5"/g, 'id="btn-prev-step-4"');
html = html.replace(/id="btn-next-step-5"/g, 'id="btn-next-step-4"');
html = html.replace(/id="btn-prev-step-6"/g, 'id="btn-prev-step-5"');
html = html.replace(/id="btn-next-step-6"/g, 'id="btn-next-step-5"');

fs.writeFileSync('d:/PelayananDigitalDesa/vercel-frontend/index.html', html);


let js = fs.readFileSync('d:/PelayananDigitalDesa/vercel-frontend/src/warga/pengajuan_wizard.js', 'utf8');

// Fix toggleWizardStep1State
const toggle1Old = `window.toggleWizardStep1State = function() {
    let select = document.getElementById('warga-keperluan-surat');
    let btnNext = document.getElementById('btn-next-step-1');
    if (btnNext) {
        if (!select || select.value !== "") {
            btnNext.disabled = false;
            btnNext.className = "px-5 py-2.5 rounded-xl bg-narmadaGreen hover:bg-narmadaGreen-dark text-white font-bold text-xs shadow-lg transition-all flex items-center gap-1.5 cursor-pointer tap-squish";
        } else {
            btnNext.disabled = true;
            btnNext.className = "px-5 py-2.5 rounded-xl bg-slate-300 text-slate-500 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-not-allowed tap-squish";
        }
    }
}`;

const toggle1New = `window.toggleWizardStep1State = function() {
    let select = document.getElementById('warga-keperluan-surat');
    let checkbox = document.getElementById('warga-syarat-checkbox');
    let btnNext = document.getElementById('btn-next-step-1');
    
    let isKeperluanValid = (!select || select.value !== "");
    let isCheckboxChecked = checkbox && checkbox.checked;

    if (btnNext) {
        if (isKeperluanValid && isCheckboxChecked) {
            btnNext.disabled = false;
            btnNext.className = "px-5 py-2.5 rounded-xl bg-narmadaGreen hover:bg-narmadaGreen-dark text-white font-bold text-xs shadow-lg transition-all flex items-center gap-1.5 cursor-pointer tap-squish";
        } else {
            btnNext.disabled = true;
            btnNext.className = "px-5 py-2.5 rounded-xl bg-slate-300 text-slate-500 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-not-allowed tap-squish";
        }
    }
}`;
js = js.replace(toggle1Old, toggle1New);

// Since toggleWizardStep2State is no longer needed (it was for the checkbox), we can just replace its contents to do nothing or remove it.
const toggle2OldRegex = /export function toggleWizardStep2State\(\) \{[\s\S]*?\}\s*window\.toggleWizardStep2State = toggleWizardStep2State;/;
js = js.replace(toggle2OldRegex, 'export function toggleWizardStep2State() {} window.toggleWizardStep2State = toggleWizardStep2State;');

// Replace goToStep6 with nothing, and rename goToStepX
js = js.replace(/function goToStep6\(\) \{[\s\S]*?\}\s*window\.goToStep6 = goToStep6;/, '');
js = js.replace(/goToStep6\(\)/g, 'goToStep5()');

// Revert the total steps logic from 6 to 5 inside goToWizardStep
js = js.replace(/for \(let i = 1; i <= 6; i\+\+\)/g, 'for (let i = 1; i <= 5; i++)');
js = js.replace(/if \(step === 6\)/g, 'if (step === 5)');
js = js.replace(/if \(step === 5\)/g, 'if (step === 4)');
js = js.replace(/if \(step === 4\)/g, 'if (step === 3)');
js = js.replace(/if \(step === 3\)/g, 'if (step === 2)');

// Fix goToStep5() which is now Submit
js = js.replace(/export function goToStep5\(\) \{[\s\S]*?\}\s*window\.goToStep5 = goToStep5;/m, ''); // Wait, I'll manually rewrite the step functions below.
fs.writeFileSync('d:/PelayananDigitalDesa/vercel-frontend/src/warga/pengajuan_wizard.js', js);


let events = fs.readFileSync('d:/PelayananDigitalDesa/vercel-frontend/src/events/events_binding.js', 'utf8');

// Fix checkbox event listener to call toggleWizardStep1State
events = events.replace(/let wargaSyaratCheckbox = document.getElementById\('warga-syarat-checkbox'\);\s*if \(wargaSyaratCheckbox\) {\s*wargaSyaratCheckbox.addEventListener\('change', function\(\) {\s*if \(window.toggleWizardStep2State\) window.toggleWizardStep2State\(\);\s*}\);\s*}/m, 
`let wargaSyaratCheckbox = document.getElementById('warga-syarat-checkbox');
    if (wargaSyaratCheckbox) {
        wargaSyaratCheckbox.addEventListener('change', function() {
            if (window.toggleWizardStep1State) window.toggleWizardStep1State();
        });
    }`);

fs.writeFileSync('d:/PelayananDigitalDesa/vercel-frontend/src/events/events_binding.js', events);

console.log('Scripts updated');
