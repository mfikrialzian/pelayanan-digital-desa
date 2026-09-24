const fs = require('fs');
let js = fs.readFileSync('d:/PelayananDigitalDesa/vercel-frontend/src/events/events_binding.js', 'utf8');

js = js.replace('goToStep5, goToStep6, toggleWizardStep2State', 'goToStep5, toggleWizardStep2State');
js = js.replace(/\/\/ Extracted from button #btn-next-step-5[\s\S]*?console\.warn\("Element #btn-next-step-5 not found for event binding\."\);\r?\n\}\r?\n/g, '');

fs.writeFileSync('d:/PelayananDigitalDesa/vercel-frontend/src/events/events_binding.js', js);
console.log('Fixed events binding');
