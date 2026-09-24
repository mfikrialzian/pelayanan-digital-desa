const fs = require('fs');
let js = fs.readFileSync('d:/PelayananDigitalDesa/vercel-frontend/src/warga/pengajuan_wizard.js', 'utf-8');

// Replace renderDynamicCustomQuestions
let regex1 = /let keperluanOptionsStr = selectedLayananGlobal\.judulSectionIsian \|\| "";\s+if \(keperluanOptionsStr\) \{[\s\S]*?qContainer\.innerHTML \+= selectHtml;\s+\}\s+\}/;
let repl1 = `let keperluanOptionsStr = selectedLayananGlobal.judulSectionIsian || "";
            let keperluanContainer = document.getElementById('container-keperluan-surat');
            if (keperluanContainer) {
                keperluanContainer.innerHTML = "";
                if (keperluanOptionsStr) {
                    let optionsList = keperluanOptionsStr.split(',').map(function(opt) { return opt.trim(); }).filter(function(opt) { return opt !== ""; });
                    
                    if (optionsList.length === 1) {
                        keperluanContainer.innerHTML = '<input type="hidden" id="warga-keperluan-surat" value="' + optionsList[0] + '">';
                        let btnNext1 = document.getElementById('btn-next-step-1');
                        if (btnNext1) {
                            btnNext1.disabled = false;
                            btnNext1.className = "px-5 py-2.5 rounded-xl bg-narmadaGreen hover:bg-narmadaGreen-dark text-white font-bold text-xs shadow-lg transition-all flex items-center gap-1.5 cursor-pointer tap-squish";
                        }
                    } else if (optionsList.length > 1) {
                        let selectHtml = '<div class="space-y-1">' +
                            '<label class="block text-xs font-semibold text-slate-600 mb-1.5">Silakan Pilih Keperluan Anda *</label>' +
                            '<select id="warga-keperluan-surat" onchange="window.toggleWizardStep1State(); window.runLiveConditionalLogicEvaluationForCitizen();" required class="w-full px-3 py-2.5 rounded-xl custom-input text-sm font-medium shadow-sm bg-white">' +
                            '<option value="">-- Pilih Keperluan Surat --</option>';

                        optionsList.forEach(function (opt) {
                            selectHtml += '<option value="' + opt + '">' + opt + '</option>';
                        });

                        selectHtml += '</select></div>';
                        keperluanContainer.innerHTML = selectHtml;
                        
                        let btnNext1 = document.getElementById('btn-next-step-1');
                        if (btnNext1) {
                            btnNext1.disabled = true;
                            btnNext1.className = "px-5 py-2.5 rounded-xl bg-slate-300 text-slate-500 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-not-allowed tap-squish";
                        }
                    }
                } else {
                    let btnNext1 = document.getElementById('btn-next-step-1');
                    if (btnNext1) {
                        btnNext1.disabled = false;
                        btnNext1.className = "px-5 py-2.5 rounded-xl bg-narmadaGreen hover:bg-narmadaGreen-dark text-white font-bold text-xs shadow-lg transition-all flex items-center gap-1.5 cursor-pointer tap-squish";
                    }
                }
            }`;
js = js.replace(regex1, repl1);

// Replace toggleWizardStep1State
let regex2 = /export function toggleWizardStep1State\(\) \{[\s\S]*?btnNext\.className = "px-5 py-2\.5 rounded-xl bg-slate-300 text-slate-500 font-bold text-xs shadow-md transition-all flex items-center gap-1\.5 cursor-not-allowed tap-squish";\s+\}\s+\}/;
let repl2 = `window.toggleWizardStep1State = function() {
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
}

export function toggleWizardStep2State() {
            let isChecked = document.getElementById('warga-syarat-checkbox').checked;
            let btnNext = document.getElementById('btn-next-step-2');
            if (btnNext) {
                if (isChecked) {
                    btnNext.disabled = false;
                    btnNext.className = "px-5 py-2.5 rounded-xl bg-narmadaGreen hover:bg-narmadaGreen-dark text-white font-bold text-xs shadow-lg transition-all flex items-center gap-1.5 cursor-pointer tap-squish";
                } else {
                    btnNext.disabled = true;
                    btnNext.className = "px-5 py-2.5 rounded-xl bg-slate-300 text-slate-500 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-not-allowed tap-squish";
                }
            }
        }`;
js = js.replace(regex2, repl2);

// Make sure toggleWizardStep1State() in openFormPengajuan is called correctly (it should call toggleWizardStep1State)
js = js.replace(/toggleWizardStep1State\(\);/g, 'if(window.toggleWizardStep1State) window.toggleWizardStep1State();');

// Also warga-syarat-checkbox should call toggleWizardStep2State
js = js.replace(/onchange="toggleWizardStep1State\(\)"/g, 'onchange="toggleWizardStep2State()"');
// Wait, is there a toggleWizardStep1State in HTML? Yes, let me check that later.

// switchWizardSection modifications
js = js.replace(/for \(let s = 1; s <= 5; s\+\+\)/g, 'for (let s = 1; s <= 6; s++)');
js = js.replace(/for \(let b = 1; b <= 5; b\+\+\)/g, 'for (let b = 1; b <= 6; b++)');
js = js.replace(/if \(stepNum === 3\) \{/g, 'if (stepNum === 4) {');

// Navigation functions
let regex3 = /export function goToStep2\(\) \{[\s\S]*?switchWizardSection\(5\);\s+\}/;
let repl3 = `export function goToStep2() {
            if (currentWizardStep === 1) {
                let select = document.getElementById('warga-keperluan-surat');
                if (select && select.tagName === 'SELECT' && !select.value) {
                    pushToast("Mohon pilih Keperluan Surat!", "error");
                    return;
                }
            }
            switchWizardSection(2);
        }

export function goToStep3() {
            if (currentWizardStep === 2) {
                let isChecked = document.getElementById('warga-syarat-checkbox').checked;
                if (!isChecked) {
                    pushToast("Centang pernyataan persetujuan kelengkapan dokumen terlebih dahulu!", "error");
                    return;
                }
            }
            switchWizardSection(3);
        }

export function goToStep4() {
            let nikVal = document.getElementById('warga-nik').value.trim();
            let namaVal = document.getElementById('warga-nama').value.trim();
            let waVal = document.getElementById('warga-wa').value.trim();
            let alamatVal = document.getElementById('warga-alamat').value.trim();

            if (!nikVal || !namaVal || !waVal || !alamatVal) {
                pushToast("Lengkapi seluruh kolom identitas diri & alamat lengkap Anda!", "error");
                return;
            }

            if (nikVal.length !== 16) {
                pushToast("Peringatan: Jumlah NIK Anda wajib tepat 16 digit!", "error");
                document.getElementById('lbl-nik-warning').classList.remove('hidden');
                return;
            } else {
                document.getElementById('lbl-nik-warning').classList.add('hidden');
            }

            switchWizardSection(4);
        }

export function goToStep5() {
            let qWrappers = document.querySelectorAll('.dynamic-question-wrapper');
            for (let i = 0; i < qWrappers.length; i++) {
                if (!qWrappers[i].classList.contains('hidden')) {
                    let inputField = qWrappers[i].querySelector('.dynamic-question-field');
                    if (inputField && inputField.hasAttribute('required') && !inputField.value.trim()) {
                        let label = parseQuestionMetadata(inputField.getAttribute('data-question')).cleanName;
                        pushToast("Mohon lengkapi isian wajib: " + label, "error");
                        return;
                    }
                }
            }

            runLiveConditionalLogicEvaluationForCitizen();
            switchWizardSection(5);
        }

export function goToStep6() {
            let requirements = selectedLayananGlobal.requirements || [];
            let missingFile = false;

            for (let i = 0; i < requirements.length; i++) {
                let slotId = "slot_" + requirements[i].id;
                let wrapperCard = document.getElementById('wrapper-slot-card-' + slotId);

                if (wrapperCard && !wrapperCard.classList.contains('hidden')) {
                    if (!uploadDataStore[slotId]) {
                        let cleanName = requirements[i].name;
                        let match = cleanName.match(/^\\[(.*?)\\]\\s*(.*)$/);
                        if (match) cleanName = match[2];

                        pushToast("Harap selesaikan unggahan berkas: " + cleanName, "error");
                        missingFile = true;
                        break;
                    }
                }
            }
            if (missingFile) return;

            let identitasContainer = document.getElementById('review-display-identitas');
            identitasContainer.innerHTML = "";
            let identitasData = [
                { label: "Nama Pemohon", value: document.getElementById('warga-nama').value.trim() },
                { label: "NIK", value: document.getElementById('warga-nik').value.trim() },
                { label: "WhatsApp", value: document.getElementById('warga-wa').value.trim() },
                { label: "Alamat KTP", value: document.getElementById('warga-alamat').value.trim() }
            ];

            identitasData.forEach(function(item) {
                identitasContainer.innerHTML += '<div class="flex items-start border-b border-slate-50 py-1">' +
                    '<span class="text-slate-555 text-[10px] text-left break-words" style="flex: 0 0 35%; padding-right: 4px;">' + item.label + '</span>' +
                    '<span class="text-slate-400 text-[10px] text-center" style="flex: 0 0 10px;">:</span>' +
                    '<span class="font-bold text-slate-800 text-[10px] text-left break-words" style="flex: 1; padding-left: 4px;">' + item.value + '</span></div>';
            });

            let isianContainer = document.getElementById('review-display-isian');
            isianContainer.innerHTML = "";

            let keperl = document.getElementById('warga-keperluan-surat');
            let optionsList = window.currentSelectedLayananObj ? (window.currentSelectedLayananObj.keperluan ? window.currentSelectedLayananObj.keperluan.split(',').map(function(s){return s.trim()}).filter(function(s){return s}) : []) : [];
            let hasIsian = false;

            if (keperl && keperl.value && optionsList.length > 1) {
                isianContainer.innerHTML += '<div class="flex items-start border-b border-slate-50 py-1">' +
                    '<span class="text-slate-555 text-[10px] text-left break-words" style="flex: 0 0 35%; padding-right: 4px;">Keperluan Surat</span>' +
                    '<span class="text-slate-400 text-[10px] text-center" style="flex: 0 0 10px;">:</span>' +
                    '<span class="font-bold text-slate-800 text-[10px] text-left break-words" style="flex: 1; padding-left: 4px;">' + keperl.value + '</span></div>';
                hasIsian = true;
            }

            let allDynamicInputs = document.querySelectorAll('.dynamic-question-field');

            allDynamicInputs.forEach(function (inp) {
                let wrapper = inp.closest('.dynamic-question-wrapper');
                if (wrapper && wrapper.classList.contains('hidden') && !wrapper.closest('.repeater-block')) return;
                
                if (wrapper && wrapper.closest('.repeater-block')) {
                    let outerWrapper = wrapper.closest('.repeater-block').closest('.dynamic-question-wrapper');
                    if (outerWrapper && outerWrapper.classList.contains('hidden')) return;
                }

                if (inp.value.trim()) {
                    let meta = parseQuestionMetadata(inp.getAttribute('data-question'));
                    let displayValue = inp.value.trim();
                    if (inp.type === 'date') {
                        let parts = displayValue.split('-');
                        if (parts.length === 3) displayValue = parts[2] + '/' + parts[1] + '/' + parts[0];
                    }
                    isianContainer.innerHTML += '<div class="flex items-start border-b border-slate-50 py-1">' +
                        '<span class="text-slate-555 text-[10px] text-left break-words" style="flex: 0 0 35%; padding-right: 4px;">' + meta.cleanName + '</span>' +
                        '<span class="text-slate-400 text-[10px] text-center" style="flex: 0 0 10px;">:</span>' +
                        '<span class="font-bold text-slate-800 text-[10px] text-left break-words" style="flex: 1; padding-left: 4px;">' + displayValue + '</span>' +
                        '</div>';
                    hasIsian = true;
                }
            });

            if (!hasIsian) {
                isianContainer.innerHTML = "<p class='text-slate-400 italic text-[10px]'>Tidak ada isian tambahan.</p>";
            }

            let berkasContainer = document.getElementById('review-display-berkas');
            berkasContainer.innerHTML = "";
            requirements.forEach(function (req) {
                let slotId = "slot_" + req.id;
                let base64 = uploadDataStore[slotId];
                let wrapperCard = document.getElementById('wrapper-slot-card-' + slotId);

                if (wrapperCard && !wrapperCard.classList.contains('hidden') && base64) {
                    let cleanName = req.name;
                    let match = cleanName.match(/^\\[(.*?)\\]\\s*(.*)$/);
                    if (match) cleanName = match[2];

                    berkasContainer.innerHTML += '<div class="border border-slate-101 rounded-xl p-1 bg-slate-50 text-center">' +
                        '<img src="' + base64 + '" class="w-full h-auto rounded-lg mb-1 shadow-sm">' +
                        '<span class="text-[8px] font-bold text-slate-500 block truncate">' + cleanName + '</span>' +
                        '</div>';
                }
            });

            switchWizardSection(6);
        }`;
js = js.replace(regex3, repl3);

let regex4 = /export function executeBackStep\(\) \{[\s\S]*?goToStep4\(\);\s+\}\s+\}/;
let repl4 = `export function executeBackStep() {
            let formWrapper = document.getElementById('wrapper-formulir-pengajuan');
            if (currentWizardStep === 1) {
                let selectWrapper = document.getElementById('wrapper-select-layanan');
                selectWrapper.classList.remove('hidden');
                selectWrapper.classList.add('animate-fade-in');
                formWrapper.classList.add('hidden');
            } else if (currentWizardStep === 2) {
                goToStep1();
            } else if (currentWizardStep === 3) {
                goToStep2();
            } else if (currentWizardStep === 4) {
                goToStep3();
            } else if (currentWizardStep === 5) {
                goToStep4();
            } else if (currentWizardStep === 6) {
                goToStep5();
            }
        }`;
js = js.replace(regex4, repl4);

fs.writeFileSync('d:/PelayananDigitalDesa/vercel-frontend/src/warga/pengajuan_wizard.js', js);
console.log('pengajuan_wizard.js updated');
