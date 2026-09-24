const fs = require('fs');
let content = fs.readFileSync('d:/PelayananDigitalDesa/vercel-frontend/src/warga/pengajuan_wizard.js', 'utf8');

// Replace the htmlBuffer line for syarat tambahan
content = content.replace(
  'htmlBuffer += \'<div class="mb-2 border-l-2 border-emerald-300 pl-2 ml-1">\';',
  'htmlBuffer += \'<div class="mb-2 border-l-2 border-emerald-300 pl-2 ml-1 wrapper-syarat-tambahan" data-syarat-keperluan="\' + escapeHtml(kep) + \'">\';'
);

// Inject logic into runLiveConditionalLogicEvaluationForCitizen to hide/show requirements
let logicCode = `
            let qWrappers = document.querySelectorAll('.dynamic-question-wrapper');
`;
let newLogicCode = `
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
`;

content = content.replace(logicCode, newLogicCode);

fs.writeFileSync('d:/PelayananDigitalDesa/vercel-frontend/src/warga/pengajuan_wizard.js', content);
console.log('Done!');
