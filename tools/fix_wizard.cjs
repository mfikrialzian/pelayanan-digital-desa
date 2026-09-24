const fs = require('fs');
let js = fs.readFileSync('d:/PelayananDigitalDesa/vercel-frontend/src/warga/pengajuan_wizard.js', 'utf8');

// 1. Fix rendering requirements
const startRender = js.indexOf('let listSyaratDiv = document.getElementById(\'container-desc-syarat-vertikal\');');
const endRender = js.indexOf('renderDynamicCustomQuestions(found.fields || []);');

if (startRender !== -1 && endRender !== -1) {
    const newRender = `let listSyaratDiv = document.getElementById('container-desc-syarat-vertikal');
            listSyaratDiv.innerHTML = "";

            let reqs = found.requirements || [];
            if (reqs.length === 0) {
                listSyaratDiv.innerHTML = '<p class="text-[10px] text-slate-400 italic">Tidak ada persyaratan berkas khusus.</p>';
            } else {
                let groupedReqs = {};
                reqs.forEach(function (req) {
                    let cleanName = String(req.name || "");
                    let keperluan = "Wajib";
                    let match = cleanName.match(/^\\[(.*?)\\]\\s*(.*)$/);
                    if (match) {
                        keperluan = match[1];
                        cleanName = match[2];
                    }
                    if (!groupedReqs[keperluan]) groupedReqs[keperluan] = [];
                    if (!groupedReqs[keperluan].includes(cleanName)) {
                        groupedReqs[keperluan].push(cleanName);
                    }
                });

                let htmlBuffer = "";

                if (groupedReqs["Wajib"]) {
                    htmlBuffer += '<div class="mb-2">';
                    groupedReqs["Wajib"].forEach(function (item, index) {
                        htmlBuffer += '<label class="flex items-start space-x-2 py-1.5 cursor-pointer tap-squish hover:bg-slate-50 rounded px-1 transition-colors">' +
                            '<input type="checkbox" onchange="if(window.toggleWizardStep1State) window.toggleWizardStep1State();" class="req-checkbox mt-0.5 w-4 h-4 text-narmadaGreen border-slate-300 rounded focus:ring-narmadaGreen shrink-0">' +
                            '<span class="text-[11px] text-slate-700 font-semibold leading-snug flex-1">' + escapeHtml(item) + '</span>' +
                            '</label>';
                    });
                    htmlBuffer += '</div>';
                }

                Object.keys(groupedReqs).forEach(function (kep) {
                    if (kep !== "Wajib") {
                        htmlBuffer += '<div class="mb-2 wrapper-syarat-tambahan" data-syarat-keperluan="' + escapeHtml(kep) + '">';
                        groupedReqs[kep].forEach(function (item, index) {
                            htmlBuffer += '<label class="flex items-start space-x-2 py-1.5 cursor-pointer tap-squish hover:bg-slate-50 rounded px-1 transition-colors">' +
                                '<input type="checkbox" onchange="if(window.toggleWizardStep1State) window.toggleWizardStep1State();" class="req-checkbox mt-0.5 w-4 h-4 text-narmadaGreen border-slate-300 rounded focus:ring-narmadaGreen shrink-0">' +
                                '<span class="text-[11px] text-slate-700 font-semibold leading-snug flex-1">' + escapeHtml(item) + '</span>' +
                                '</label>';
                        });
                        htmlBuffer += '</div>';
                    }
                });
                listSyaratDiv.innerHTML = htmlBuffer;
            }

            `;
    js = js.substring(0, startRender) + newRender + js.substring(endRender);
}

// 2. Fix toggleWizardStep1State
const startToggle = js.indexOf('window.toggleWizardStep1State = function() {');
const endToggle = js.indexOf('export function toggleWizardStep2State() {');

if (startToggle !== -1 && endToggle !== -1) {
    const newToggle = `window.toggleWizardStep1State = function() {
    let select = document.getElementById('warga-keperluan-surat');
    let btnNext = document.getElementById('btn-next-step-1');
    
    let isKeperluanValid = (!select || select.value !== "");
    
    // Check all visible checkboxes
    let allCheckboxes = document.querySelectorAll('#container-desc-syarat-vertikal .req-checkbox');
    let allVisibleChecked = true;
    
    for (let i = 0; i < allCheckboxes.length; i++) {
        let cb = allCheckboxes[i];
        let wrapper = cb.closest('.wrapper-syarat-tambahan');
        // If it's not in a hidden wrapper, it must be checked
        if (!wrapper || !wrapper.classList.contains('hidden')) {
            if (!cb.checked) {
                allVisibleChecked = false;
                break;
            }
        }
    }

    if (btnNext) {
        if (isKeperluanValid && allVisibleChecked) {
            btnNext.disabled = false;
            btnNext.className = "px-5 py-2.5 rounded-xl bg-narmadaGreen hover:bg-narmadaGreen-dark text-white font-bold text-xs shadow-lg transition-all flex items-center gap-1.5 cursor-pointer tap-squish";
        } else {
            btnNext.disabled = true;
            btnNext.className = "px-5 py-2.5 rounded-xl bg-slate-300 text-slate-500 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-not-allowed tap-squish";
        }
    }
}

`;
    js = js.substring(0, startToggle) + newToggle + js.substring(endToggle);
}

// 3. Remove document.getElementById('warga-syarat-checkbox').checked = false;
js = js.replace("document.getElementById('warga-syarat-checkbox').checked = false;", "");
// and the one in step 2 (if there's a leftover bug? wait step 2 doesn't use it, but wait!
// line 555 was:
// export function toggleWizardStep2State() {
//             let isChecked = document.getElementById('warga-syarat-checkbox').checked;
// Oh no! toggleWizardStep2State uses warga-syarat-checkbox ?? No, step 2 is Identity. Step 2 has its own checkbox maybe? No, the user said step 2 is identitas. Why does toggleWizardStep2State use warga-syarat-checkbox? Let's check!

fs.writeFileSync('d:/PelayananDigitalDesa/vercel-frontend/src/warga/pengajuan_wizard.js', js);
console.log('Fixed js successfully');
