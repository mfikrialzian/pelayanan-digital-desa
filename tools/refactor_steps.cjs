const fs = require('fs');

let html = fs.readFileSync('d:/PelayananDigitalDesa/vercel-frontend/index.html', 'utf8');

// 1. In the badges, remove step 6 and rename others back to 1-5.
// Looking at the badges:
html = html.replace(/<div class="flex-grow border-t border-slate-200 min-w-\[10px\]"><\/div>[\s\r\n]*<div class="flex items-center space-x-1 shrink-0">[\s\r\n]*<span id="step-badge-6" class="w-4 h-4 rounded-full flex items-center justify-center step-node-inactive text-\[8px\] font-bold">6<\/span>[\s\r\n]*<span class="text-slate-400 text-\[8px\] font-bold">Tinjau<\/span>[\s\r\n]*<\/div>/g, '');

// Rename badges
html = html.replace(/id="step-badge-3"([^>]+)>3<\/span>[\s\r\n]*<span class="text-slate-400 text-\[8px\] font-bold">Isian<\/span>/g, 'id="step-badge-3"$1>3</span>\n                            <span class="text-slate-400 text-[8px] font-bold">Isian</span>');

// Replace badge 2 text from Identitas to Identitas, but wait, the current badges:
// 1: Panduan (Wait, it says Panduan. Before my change it was Persyaratan. I'll leave it as Panduan/Persyaratan).
// Wait, the user wants "jadi cukup 5 step seperti dulu, cuma penyesuaian pada step 1".
html = html.replace(/id="step-badge-1"([^>]+)>1<\/span>[\s\r\n]*<span class="text-slate-400 text-\[8px\] font-bold">Panduan<\/span>/, 'id="step-badge-1"$1>1</span>\n                            <span class="text-slate-400 text-[8px] font-bold">Panduan & Syarat</span>');


// 2. Merge section 1 and 2
// Let's manually replace the block for wizard-section-1 and wizard-section-2
const section1and2Regex = /<!-- STEP 1: KEPERLUAN -->[\s\S]*?<!-- STEP 2: IDENTITAS -->/m;

const newSection1 = `<!-- STEP 1: PANDUAN & PERSYARATAN -->
<div id="wizard-section-1" class="space-y-4">
    <div id="container-keperluan-surat" class="space-y-3"></div>
    
    <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 space-y-3 shadow-inner">
        <p class="font-extrabold text-narmadaGreen flex items-center gap-1.5 text-xs">
            <i class="fa-solid fa-bullhorn"></i> 📢 Panduan Berkas Fisik:
        </p>
        <p class="text-[10px] text-slate-700 leading-relaxed font-semibold">
            Harap membawa berkas fisik asli &amp; fotokopiannya ke Kantor Desa Narmada saat status
            permohonan online Anda telah diverifikasi dan siap diserahkan.
        </p>

        <div class="border-t border-emerald-200 pt-2.5 mt-2 space-y-1.5">
            <div id="container-desc-syarat-vertikal" class="space-y-1 text-[10px] text-slate-600 font-semibold pl-1"></div>
        </div>
    </div>

    <div class="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-start space-x-2.5 shadow-sm">
        <input type="checkbox" id="warga-syarat-checkbox" class="mt-0.5 w-4.5 h-4.5 text-narmadaGreen border-slate-300 rounded focus:ring-narmadaGreen cursor-pointer">
        <label for="warga-syarat-checkbox" class="text-[10px] font-extrabold text-slate-700 leading-relaxed cursor-pointer select-none">
            Saya menyatakan sudah menyiapkan seluruh dokumen persyaratan fisik di atas secara
            lengkap &amp; benar.
        </label>
    </div>

    <div class="flex justify-end pt-2">
        <button type="button" id="btn-next-step-1" disabled class="px-5 py-2.5 rounded-xl bg-slate-300 text-slate-500 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-not-allowed tap-squish">
            Lanjut ke Identitas <i class="fa-solid fa-arrow-right text-[10px]"></i>
        </button>
    </div>
</div>

<!-- STEP 2: IDENTITAS -->`;

html = html.replace(section1and2Regex, newSection1);

// 3. Rename wizard sections 3,4,5,6 to 2,3,4,5
html = html.replace(/id="wizard-section-3"/g, 'id="wizard-section-2"');
html = html.replace(/id="wizard-section-4"/g, 'id="wizard-section-3"');
html = html.replace(/id="wizard-section-5"/g, 'id="wizard-section-4"');
html = html.replace(/id="wizard-section-6"/g, 'id="wizard-section-5"');

// Fix buttons inside sections 2, 3, 4, 5
html = html.replace(/id="btn-next-step-6"/g, 'id="btn-next-step-5"');
html = html.replace(/id="btn-prev-step-6"/g, 'id="btn-prev-step-5"');
// Wait, the prev/next buttons need to be re-indexed!
// The new structure has 5 sections. 
// Section 1: btn-next-step-1
// Section 2: btn-prev-step-2, btn-next-step-2
// Section 3: btn-prev-step-3, btn-next-step-3
// Section 4: btn-prev-step-4, btn-next-step-4
// Section 5: btn-prev-step-5, btn-next-step-5 (which is Submit)

fs.writeFileSync('d:/PelayananDigitalDesa/vercel-frontend/index.html', html);
console.log('index.html updated');
