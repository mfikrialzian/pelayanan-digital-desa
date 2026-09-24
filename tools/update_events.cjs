const fs = require('fs');
let js = fs.readFileSync('d:/PelayananDigitalDesa/vercel-frontend/src/events/events_binding.js', 'utf-8');

let step5Binding = `// Extracted from button #btn-next-step-5
const el_btn_next_step_5 = document.getElementById('btn-next-step-5');
if (el_btn_next_step_5) {
    el_btn_next_step_5.addEventListener('click', function(event) {
        goToStep6()
    });
} else {
    console.warn("Element #btn-next-step-5 not found for event binding.");
}

`;

js = js.replace('// Extracted from input #warga-check-kebenaran', step5Binding + '\n// Extracted from input #warga-check-kebenaran');

fs.writeFileSync('d:/PelayananDigitalDesa/vercel-frontend/src/events/events_binding.js', js);
console.log('events_binding.js updated');
