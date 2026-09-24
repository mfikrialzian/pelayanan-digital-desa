const fs = require('fs');
let html = fs.readFileSync('d:/PelayananDigitalDesa/vercel-frontend/index.html', 'utf-8');

// Replace stepper
let stepperRegex = /<div class="flex items-center justify-between mt-3 px-1 md:px-4">[\s\S]*?<\/div>\s*<\/div>\s*<h3 class="text-sm font-extrabold/m;
let newStepper = `<div class="flex items-center justify-between mt-3 px-1 md:px-4">
    <div class="flex items-center space-x-1 shrink-0">
        <span id="step-badge-1" class="w-4 h-4 rounded-full flex items-center justify-center step-node-active text-[8px] font-bold">1</span>
        <span class="text-slate-400 text-[8px] font-bold hidden sm:block">Keperluan</span>
    </div>
    <div class="flex-grow border-t border-slate-200 min-w-[10px]"></div>
    <div class="flex items-center space-x-1 shrink-0">
        <span id="step-badge-2" class="w-4 h-4 rounded-full flex items-center justify-center step-node-inactive text-[8px] font-bold">2</span>
        <span class="text-slate-400 text-[8px] font-bold hidden sm:block">Syarat</span>
    </div>
    <div class="flex-grow border-t border-slate-200 min-w-[10px]"></div>
    <div class="flex items-center space-x-1 shrink-0">
        <span id="step-badge-3" class="w-4 h-4 rounded-full flex items-center justify-center step-node-inactive text-[8px] font-bold">3</span>
        <span class="text-slate-400 text-[8px] font-bold hidden sm:block">Identitas</span>
    </div>
    <div class="flex-grow border-t border-slate-200 min-w-[10px]"></div>
    <div class="flex items-center space-x-1 shrink-0">
        <span id="step-badge-4" class="w-4 h-4 rounded-full flex items-center justify-center step-node-inactive text-[8px] font-bold">4</span>
        <span class="text-slate-400 text-[8px] font-bold hidden sm:block">Formulir</span>
    </div>
    <div class="flex-grow border-t border-slate-200 min-w-[10px]"></div>
    <div class="flex items-center space-x-1 shrink-0">
        <span id="step-badge-5" class="w-4 h-4 rounded-full flex items-center justify-center step-node-inactive text-[8px] font-bold">5</span>
        <span class="text-slate-400 text-[8px] font-bold hidden sm:block">Unggah</span>
    </div>
    <div class="flex-grow border-t border-slate-200 min-w-[10px]"></div>
    <div class="flex items-center space-x-1 shrink-0">
        <span id="step-badge-6" class="w-4 h-4 rounded-full flex items-center justify-center step-node-inactive text-[8px] font-bold">6</span>
        <span class="text-slate-400 text-[8px] font-bold hidden sm:block">Tinjau</span>
    </div>
</div>
</div>
<h3 class="text-sm font-extrabold`;

html = html.replace(stepperRegex, newStepper);

html = html.replace('id="wizard-section-5"', 'id="wizard-section-6"');
html = html.replace('id="wizard-section-4"', 'id="wizard-section-5"');
html = html.replace('id="wizard-section-3"', 'id="wizard-section-4"');
html = html.replace('id="wizard-section-2"', 'id="wizard-section-3"');
html = html.replace('id="wizard-section-1"', 'id="wizard-section-2" class="hidden space-y-4"');

let step1New = `<!-- STEP 1: KEPERLUAN -->
<div id="wizard-section-1" class="space-y-4">
    <div id="container-keperluan-surat" class="space-y-3"></div>
    <div class="flex justify-end pt-2">
        <button type="button" id="btn-next-step-1" disabled class="px-5 py-2.5 rounded-xl bg-slate-300 text-slate-500 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-not-allowed tap-squish">
            Lanjut ke Persyaratan <i class="fa-solid fa-arrow-right text-[10px]"></i>
        </button>
    </div>
</div>
`;

html = html.replace('<!-- STEP 1: PERSYARATAN & PANDUAN -->', step1New + '\n<!-- STEP 2: PERSYARATAN & PANDUAN -->');

html = html.replace('id="btn-next-step-1" disabled=""', 'id="btn-next-step-2" disabled=""');
html = html.replace('id="btn-next-step-2" disabled=""', 'id="btn-next-step-3" disabled=""');
html = html.replace('id="btn-next-step-3" disabled=""', 'id="btn-next-step-4" disabled=""');
html = html.replace('id="btn-next-step-4" disabled=""', 'id="btn-next-step-5" disabled=""');

fs.writeFileSync('d:/PelayananDigitalDesa/vercel-frontend/index.html', html);
console.log('index.html updated successfully');
