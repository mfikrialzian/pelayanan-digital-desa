const fs = require('fs');
let js = fs.readFileSync('src/warga/pengajuan_wizard.js', 'utf8');

// Replace the req list generation in openFormPengajuan
let oldHtmlBufferGeneration = `                let htmlBuffer = "";

                if (groupedReqs["Wajib"]) {
                    htmlBuffer += '<div class="mb-2">';
                    htmlBuffer += '<p class="font-bold text-slate-800 text-[10px] mb-1">Dokumen Wajib:</p>';
                    groupedReqs["Wajib"].forEach(function (item, index) {
                        htmlBuffer += '<div class="flex items-center space-x-1.5 py-1 pl-1"><span class="text-emerald-600 font-bold text-[9px] bg-emerald-50 w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 border border-emerald-100">' + (index + 1) + '</span> <span class="text-[10px] text-slate-600 font-semibold leading-snug flex-1">' + escapeHtml(item) + '</span></div>';
                    });
                    htmlBuffer += '</div>';
                }

                let hasTambahan = Object.keys(groupedReqs).some(k => k !== "Wajib");
                if (hasTambahan) {
                    htmlBuffer += '<p class="font-bold text-slate-800 text-[10px] mb-1 mt-2 border-t border-emerald-200 pt-1">Dokumen Tambahan:</p>';
                }

                Object.keys(groupedReqs).forEach(function (kep) {
                    if (kep !== "Wajib") {
                        htmlBuffer += '<div class="mb-2 border-l-2 border-emerald-300 pl-2 ml-1 wrapper-syarat-tambahan" data-syarat-keperluan="' + escapeHtml(kep) + '">';
                        htmlBuffer += '<p class="font-extrabold text-emerald-700 text-[10px] bg-emerald-50 px-2 py-0.5 rounded inline-block mb-1 border border-emerald-100">Jika Keperluan: ' + escapeHtml(kep) + '</p>';
                        groupedReqs[kep].forEach(function (item, index) {
                            htmlBuffer += '<div class="flex items-center space-x-1.5 py-1 pl-1"><span class="text-emerald-600 font-bold text-[9px] bg-emerald-50 w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 border border-emerald-100">' + (index + 1) + '</span> <span class="text-[10px] text-slate-600 font-semibold leading-snug flex-1">' + escapeHtml(item) + '</span></div>';
                        });
                        htmlBuffer += '</div>';
                    }
                });
                listSyaratDiv.innerHTML = htmlBuffer;`;

let newHtmlBufferGeneration = `                let htmlBuffer = "";

                Object.keys(groupedReqs).forEach(function (kep) {
                    if (kep === "Wajib") {
                        groupedReqs[kep].forEach(function (item, index) {
                            let chkId = 'chk_req_wajib_' + index;
                            htmlBuffer += '<div class="flex items-start space-x-2.5 py-1.5 pl-1"><input type="checkbox" id="' + chkId + '" class="req-checkbox mt-0.5 w-4.5 h-4.5 text-narmadaGreen border-slate-300 rounded focus:ring-narmadaGreen cursor-pointer" onchange="if(window.toggleWizardStep1State) window.toggleWizardStep1State()"><label for="' + chkId + '" class="text-[10px] font-bold text-slate-700 leading-relaxed cursor-pointer select-none flex-1">' + escapeHtml(item) + '</label></div>';
                        });
                    } else {
                        htmlBuffer += '<div class="wrapper-syarat-tambahan hidden" data-syarat-keperluan="' + escapeHtml(kep) + '">';
                        groupedReqs[kep].forEach(function (item, index) {
                            let chkId = 'chk_req_dyn_' + kep.replace(/\\s+/g,'') + '_' + index;
                            htmlBuffer += '<div class="flex items-start space-x-2.5 py-1.5 pl-1"><input type="checkbox" id="' + chkId + '" class="req-checkbox mt-0.5 w-4.5 h-4.5 text-narmadaGreen border-slate-300 rounded focus:ring-narmadaGreen cursor-pointer" onchange="if(window.toggleWizardStep1State) window.toggleWizardStep1State()"><label for="' + chkId + '" class="text-[10px] font-bold text-slate-700 leading-relaxed cursor-pointer select-none flex-1">' + escapeHtml(item) + '</label></div>';
                        });
                        htmlBuffer += '</div>';
                    }
                });
                listSyaratDiv.innerHTML = htmlBuffer;`;

if (!js.includes('if (hasTambahan)')) {
    console.error('Target string for UI not found!');
} else {
    js = js.replace(oldHtmlBufferGeneration, newHtmlBufferGeneration);
    console.log('Replaced UI Generation');
}

// Replace toggleWizardStep1State function
let oldToggle = `window.toggleWizardStep1State = function() {
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

let newToggle = `window.toggleWizardStep1State = function() {
    let select = document.getElementById('warga-keperluan-surat');
    let btnNext = document.getElementById('btn-next-step-1');
    let isKeperluanValid = (!select || select.value !== "");

    let allCheckboxes = document.querySelectorAll('#container-desc-syarat-vertikal .req-checkbox');
    let allChecked = true;
    let anyVisible = false;

    allCheckboxes.forEach(function(chk) {
        let group = chk.closest('.wrapper-syarat-tambahan');
        if (group && group.classList.contains('hidden')) return;
        anyVisible = true;
        if (!chk.checked) allChecked = false;
    });
    
    if (!anyVisible) allChecked = true;

    if (btnNext) {
        if (isKeperluanValid && allChecked) {
            btnNext.disabled = false;
            btnNext.className = "px-5 py-2.5 rounded-xl bg-narmadaGreen hover:bg-narmadaGreen-dark text-white font-bold text-xs shadow-lg transition-all flex items-center gap-1.5 cursor-pointer tap-squish";
        } else {
            btnNext.disabled = true;
            btnNext.className = "px-5 py-2.5 rounded-xl bg-slate-300 text-slate-500 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-not-allowed tap-squish";
        }
    }
}`;
if (!js.includes('let isCheckboxChecked = checkbox && checkbox.checked;')) {
    console.error('Target string for toggleWizardStep1State not found!');
} else {
    js = js.replace(oldToggle, newToggle);
    console.log('Replaced toggleWizardStep1State');
}

fs.writeFileSync('src/warga/pengajuan_wizard.js', js);
console.log('Done.');
