const fs = require('fs');
let html = fs.readFileSync('d:/PelayananDigitalDesa/vercel-frontend/index.html', 'utf8');

const startTag = '<h3 class="text-sm font-extrabold text-narmadaGreen" id="text-judul-layanan-terpilih">Nama Pelayanan</h3>';
const endTag = '    <div class="flex justify-end pt-2">';

const newBlock = `                    <h3 class="text-sm font-extrabold text-narmadaGreen mb-4" id="text-judul-layanan-terpilih">Nama Pelayanan</h3>

                    <!-- STEP 1: PANDUAN & PERSYARATAN -->
<div id="wizard-section-1" class="space-y-4">
    <div id="container-keperluan-surat" class="space-y-3 mb-2"></div>
    
    <div class="space-y-2">
        <h4 class="font-bold text-slate-700 text-xs">Persyaratan Layanan:</h4>
        <div id="container-desc-syarat-vertikal" class="space-y-2 text-[10px] text-slate-600 font-semibold pl-1"></div>
    </div>

`;

const startIndex = html.indexOf(startTag);
const endIndex = html.indexOf(endTag, startIndex);

if(startIndex !== -1 && endIndex !== -1) {
    html = html.substring(0, startIndex) + newBlock + html.substring(endIndex);
    fs.writeFileSync('d:/PelayananDigitalDesa/vercel-frontend/index.html', html);
    console.log('Replaced successfully');
} else {
    console.log('Not found');
}
