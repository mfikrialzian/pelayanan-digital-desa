const fs = require('fs');
let js = fs.readFileSync('d:/PelayananDigitalDesa/vercel-frontend/src/warga/pengajuan_wizard.js', 'utf8');

// We will find the start of goToStep1 and the end of goToStep5 (the last one)
let lines = js.split('\n');
let startIdx = lines.findIndex(l => l.includes('export function goToStep1()'));
// Find where submitFormLayanan starts, which is after goToStep5
let endIdx = lines.findIndex(l => l.includes('export function backToPrevStepOrMenu()'));

if (startIdx !== -1 && endIdx !== -1) {
    let newStepsLogic = `export function goToStep1() { switchWizardSection(1); }

export function goToStep2() {
    if (currentWizardStep === 1) {
        let select = document.getElementById('warga-keperluan-surat');
        if (select && select.tagName === 'SELECT' && !select.value) {
            pushToast("Mohon pilih Keperluan Surat!", "error");
            return;
        }
        let checkbox = document.getElementById('warga-syarat-checkbox');
        if (checkbox && !checkbox.checked) {
            pushToast("Mohon centang persetujuan persyaratan!", "error");
            return;
        }
    }
    switchWizardSection(2);
}

export function goToStep3() {
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

    switchWizardSection(3);
}

export function goToStep4() {
    let reqWrappers = document.querySelectorAll('.wrapper-syarat-tambahan');
    reqWrappers.forEach(function (el) {
        let boundKeperluan = el.getAttribute('data-syarat-keperluan');
        if (boundKeperluan === "Wajib" || (activeKeperluan !== "" && boundKeperluan === activeKeperluan)) {
            el.classList.remove('hidden');
        } else {
            el.classList.add('hidden');
        }
    });

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
    switchWizardSection(4);
}

export function goToStep5() {
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
        hasIsian = true;
        isianContainer.innerHTML += '<div class="flex items-start border-b border-slate-50 py-1">' +
            '<span class="text-slate-555 text-[10px] text-left break-words" style="flex: 0 0 35%; padding-right: 4px;">Keperluan</span>' +
            '<span class="text-slate-400 text-[10px] text-center" style="flex: 0 0 10px;">:</span>' +
            '<span class="font-bold text-slate-800 text-[10px] text-left break-words" style="flex: 1; padding-left: 4px;">' + keperl.value + '</span></div>';
    }

    let qWrappers = document.querySelectorAll('.dynamic-question-wrapper');
    qWrappers.forEach(function (w) {
        if (!w.classList.contains('hidden')) {
            let field = w.querySelector('.dynamic-question-field');
            if (field && field.value.trim() !== "") {
                hasIsian = true;
                let parsed = parseQuestionMetadata(field.getAttribute('data-question'));
                isianContainer.innerHTML += '<div class="flex items-start border-b border-slate-50 py-1">' +
                    '<span class="text-slate-555 text-[10px] text-left break-words" style="flex: 0 0 35%; padding-right: 4px;">' + parsed.cleanName + '</span>' +
                    '<span class="text-slate-400 text-[10px] text-center" style="flex: 0 0 10px;">:</span>' +
                    '<span class="font-bold text-slate-800 text-[10px] text-left break-words" style="flex: 1; padding-left: 4px;">' + field.value.trim() + '</span></div>';
            }
        }
    });

    if (!hasIsian) {
        isianContainer.innerHTML = '<p class="text-[10px] text-slate-400 italic">Tidak ada isian tambahan.</p>';
    }

    let fileContainer = document.getElementById('review-display-file');
    fileContainer.innerHTML = "";
    let fileKeys = Object.keys(uploadDataStore);
    if (fileKeys.length === 0) {
        fileContainer.innerHTML = '<p class="text-[10px] text-slate-400 italic">Tidak ada file yang diunggah.</p>';
    } else {
        fileKeys.forEach(function (k) {
            let info = uploadDataStore[k];
            let rawSize = typeof info.size === 'number' ? info.size : 0;
            let sizeMb = (rawSize / (1024 * 1024)).toFixed(2);
            fileContainer.innerHTML += '<div class="flex items-start border-b border-slate-50 py-1">' +
                '<span class="text-slate-555 text-[10px] text-left break-words" style="flex: 0 0 45%; padding-right: 4px;">' + info.cleanName + '</span>' +
                '<span class="text-slate-400 text-[10px] text-center" style="flex: 0 0 10px;">:</span>' +
                '<span class="font-bold text-narmadaGreen text-[10px] text-left break-words" style="flex: 1; padding-left: 4px;"><i class="fa-solid fa-check-circle mr-1"></i>Tersimpan (' + sizeMb + ' MB)</span></div>';
        });
    }

    switchWizardSection(5);
}
`;

    lines.splice(startIdx, endIdx - startIdx, newStepsLogic);
    fs.writeFileSync('d:/PelayananDigitalDesa/vercel-frontend/src/warga/pengajuan_wizard.js', lines.join('\n'));
    console.log("Successfully replaced goToStep logic.");
} else {
    console.log("Could not find start or end index.", startIdx, endIdx);
}
