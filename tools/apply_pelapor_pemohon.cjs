const fs = require('fs');
const path = require('path');

const indexHtmlPath = path.join(__dirname, '../index.html');
const wizardJsPath = path.join(__dirname, '../src/warga/pengajuan_wizard.js');
const eventsJsPath = path.join(__dirname, '../src/events/events_binding.js');

function applyIndexHtml() {
    let content = fs.readFileSync(indexHtmlPath, 'utf8');

    // Ubah Judul
    content = content.replace(
        '<h3 class="text-sm font-bold text-slate-800 mb-2">Identitas Pemohon</h3>',
        '<h3 class="text-sm font-bold text-slate-800 mb-2">Identitas Pelapor / Pengurus</h3>'
    );

    // Tambah Checkbox & Wrapper Identitas Pemohon
    const targetHtml = `<textarea id="warga-alamat" required="" placeholder="Tuliskan alamat lengkap pemohon sesuai KTP" rows="2" class="w-full px-3 py-2.5 rounded-xl custom-input text-sm font-medium shadow-sm" oninput="this.value = this.value.toUpperCase();"></textarea>
                            </div>
                        </div>`;
    
    const replacementHtml = `<textarea id="warga-alamat" required="" placeholder="Tuliskan alamat lengkap sesuai KTP" rows="2" class="w-full px-3 py-2.5 rounded-xl custom-input text-sm font-medium shadow-sm" oninput="this.value = this.value.toUpperCase();"></textarea>
                            </div>
                        </div>
                        
                        <div class="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                            <label class="flex items-start gap-2 cursor-pointer group">
                                <input type="checkbox" id="warga-check-wakil" class="mt-0.5 w-4 h-4 text-narmadaGreen border-slate-300 rounded focus:ring-narmadaGreen cursor-pointer shrink-0">
                                <span class="text-xs font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                                    Saya mengajukan layanan ini untuk orang lain / anggota keluarga (Bukan untuk diri saya sendiri)
                                </span>
                            </label>
                        </div>

                        <div id="wrapper-identitas-wakil" class="hidden mt-4 pt-4 border-t border-slate-200">
                            <h3 class="text-sm font-bold text-slate-800 mb-2">Identitas Yang Bersangkutan (Pemohon Utama)</h3>
                            <div class="space-y-3">
                                <div>
                                    <label for="warga-nik-wakil" class="block text-xs font-semibold text-slate-600 mb-1">NIK Yang Bersangkutan *</label>
                                    <input type="text" id="warga-nik-wakil" placeholder="16 digit NIK" class="w-full px-3 py-2.5 rounded-xl custom-input text-sm font-medium shadow-sm">
                                </div>
                                <div>
                                    <label for="warga-nama-wakil" class="block text-xs font-semibold text-slate-600 mb-1">Nama Lengkap Yang Bersangkutan *</label>
                                    <input type="text" id="warga-nama-wakil" placeholder="Nama Lengkap sesuai KTP" class="w-full px-3 py-2.5 rounded-xl custom-input text-sm font-medium shadow-sm" oninput="this.value = this.value.toUpperCase();">
                                </div>
                                <div>
                                    <label for="warga-alamat-wakil" class="block text-xs font-semibold text-slate-600 mb-1">Alamat Yang Bersangkutan *</label>
                                    <textarea id="warga-alamat-wakil" placeholder="Alamat Lengkap sesuai KTP" rows="2" class="w-full px-3 py-2.5 rounded-xl custom-input text-sm font-medium shadow-sm" oninput="this.value = this.value.toUpperCase();"></textarea>
                                </div>
                            </div>
                        </div>`;
    
    if (content.includes('warga-check-wakil')) {
        console.log('Index.html already contains checkbox wakil.');
    } else {
        content = content.replace(targetHtml, replacementHtml);
        fs.writeFileSync(indexHtmlPath, content);
        console.log('Modified index.html');
    }
}

function applyEventsJs() {
    let content = fs.readFileSync(eventsJsPath, 'utf8');

    const injection = `
// Extracted from checkbox #warga-check-wakil
const el_warga_check_wakil = document.getElementById('warga-check-wakil');
if (el_warga_check_wakil) {
    el_warga_check_wakil.addEventListener('change', function(event) {
        let wrapper = document.getElementById('wrapper-identitas-wakil');
        if (this.checked) {
            wrapper.classList.remove('hidden');
            wrapper.classList.add('animate-fade-in');
        } else {
            wrapper.classList.add('hidden');
            wrapper.classList.remove('animate-fade-in');
        }
        if(typeof validateCurrentWizardStep === 'function') validateCurrentWizardStep();
    });
}
`;

    if (!content.includes('warga-check-wakil')) {
        content = content + injection;
        fs.writeFileSync(eventsJsPath, content);
        console.log('Modified events_binding.js');
    }
}

function applyWizardJs() {
    let content = fs.readFileSync(wizardJsPath, 'utf8');

    // 1. Modifikasi validateCurrentWizardStep (Langkah 2)
    const oldValidate = `                let nik = document.getElementById('warga-nik') ? document.getElementById('warga-nik').value.trim() : "";
                let nama = document.getElementById('warga-nama') ? document.getElementById('warga-nama').value.trim() : "";
                let wa = document.getElementById('warga-wa') ? document.getElementById('warga-wa').value.trim() : "";
                let alamat = document.getElementById('warga-alamat') ? document.getElementById('warga-alamat').value.trim() : "";

                if (nik && nama && wa && alamat) {`;
                
    const newValidate = `                let nik = document.getElementById('warga-nik') ? document.getElementById('warga-nik').value.trim() : "";
                let nama = document.getElementById('warga-nama') ? document.getElementById('warga-nama').value.trim() : "";
                let wa = document.getElementById('warga-wa') ? document.getElementById('warga-wa').value.trim() : "";
                let alamat = document.getElementById('warga-alamat') ? document.getElementById('warga-alamat').value.trim() : "";
                
                let chkWakil = document.getElementById('warga-check-wakil');
                let isValidWakil = true;
                if (chkWakil && chkWakil.checked) {
                    let wNik = document.getElementById('warga-nik-wakil').value.trim();
                    let wNama = document.getElementById('warga-nama-wakil').value.trim();
                    let wAlamat = document.getElementById('warga-alamat-wakil').value.trim();
                    if (!wNik || !wNama || !wAlamat) isValidWakil = false;
                }

                if (nik && nama && wa && alamat && isValidWakil) {`;

    content = content.replace(oldValidate, newValidate);


    // 2. Modifikasi goToStep5 (Tinjauan)
    const oldReview = `    let identitasContainer = document.getElementById('review-display-identitas');
    identitasContainer.innerHTML = "";
    let identitasData = [
        { label: "Nama Pemohon", value: document.getElementById('warga-nama').value.trim() },
        { label: "NIK", value: document.getElementById('warga-nik').value.trim() },
        { label: "WhatsApp", value: document.getElementById('warga-wa').value.trim() },
        { label: "Alamat KTP", value: document.getElementById('warga-alamat').value.trim() }
    ];

    identitasData.forEach(function(item) {`;

    const newReview = `    let identitasContainer = document.getElementById('review-display-identitas');
    identitasContainer.innerHTML = "";
    
    let chkWakil = document.getElementById('warga-check-wakil');
    let isWakil = chkWakil && chkWakil.checked;
    
    let identitasData = [];
    if (isWakil) {
        identitasData = [
            { label: "Nama Pemohon (Ybs)", value: document.getElementById('warga-nama-wakil').value.trim() },
            { label: "NIK (Ybs)", value: document.getElementById('warga-nik-wakil').value.trim() },
            { label: "Alamat KTP (Ybs)", value: document.getElementById('warga-alamat-wakil').value.trim() },
            { label: "Nama Pelapor/Pengurus", value: document.getElementById('warga-nama').value.trim() },
            { label: "WA Pelapor/Pengurus", value: document.getElementById('warga-wa').value.trim() }
        ];
    } else {
        identitasData = [
            { label: "Nama Pemohon", value: document.getElementById('warga-nama').value.trim() },
            { label: "NIK", value: document.getElementById('warga-nik').value.trim() },
            { label: "WhatsApp", value: document.getElementById('warga-wa').value.trim() },
            { label: "Alamat KTP", value: document.getElementById('warga-alamat').value.trim() }
        ];
    }

    identitasData.forEach(function(item) {`;
    
    content = content.replace(oldReview, newReview);


    // 3. Modifikasi handleWargaSubmit (Payload Backend)
    const oldPayload = `            let nikVal = document.getElementById('warga-nik').value.trim();
            let namaVal = document.getElementById('warga-nama').value.trim();
            let waVal = document.getElementById('warga-wa').value.trim();
            let alamatVal = document.getElementById('warga-alamat').value.trim();`;

    const newPayload = `            let chkWakil = document.getElementById('warga-check-wakil');
            let isWakil = chkWakil && chkWakil.checked;

            let nikVal = document.getElementById('warga-nik').value.trim();
            let namaVal = document.getElementById('warga-nama').value.trim();
            let waVal = document.getElementById('warga-wa').value.trim();
            let alamatVal = document.getElementById('warga-alamat').value.trim();
            
            let nikPemohon = isWakil ? document.getElementById('warga-nik-wakil').value.trim() : nikVal;
            let namaPemohon = isWakil ? document.getElementById('warga-nama-wakil').value.trim() : namaVal;
            let alamatPemohon = isWakil ? document.getElementById('warga-alamat-wakil').value.trim() : alamatVal;`;
            
    content = content.replace(oldPayload, newPayload);
    
    // Ganti mapping wargaData (baris 933)
    const oldWargaData = `            let wargaData = {
                nik: nikVal,
                nama: namaVal,
                layanan: selectedLayananGlobal.nama,
                wa: waVal,
                alamat: alamatVal,`;

    const newWargaData = `            if (isWakil) {
                detailLayananPayload["Identitas Pengurus/Pelapor"] = "NIK: " + nikVal + ", Nama: " + namaVal;
            }

            let wargaData = {
                nik: nikPemohon,
                nama: namaPemohon,
                layanan: selectedLayananGlobal.nama,
                wa: waVal, // Selalu gunakan WA Pelapor
                alamat: alamatPemohon,`;

    content = content.replace(oldWargaData, newWargaData);

    fs.writeFileSync(wizardJsPath, content);
    console.log('Modified pengajuan_wizard.js');
}

applyIndexHtml();
applyEventsJs();
applyWizardJs();
console.log('All changes applied successfully!');
