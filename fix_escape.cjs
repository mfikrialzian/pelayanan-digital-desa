const fs = require('fs');
let js = fs.readFileSync('src/warga/pengajuan_wizard.js', 'utf8');

// The problematic line is around 360
// We want it to be: inputHtml = '<div class="sd-container" id="' + uniqueId + '" data-options=\\'' + optionsJson.replace(/\\'/g, "&#39;") + '\\'>' +

let lines = js.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('data-options=') && lines[i].includes('optionsJson.replace(')) {
        // Just hardcode the replacement for that specific line
        lines[i] = `                    inputHtml = '<div class="sd-container" id="' + uniqueId + '" data-options=\\'' + optionsJson.replace(/\\'/g, "&#39;") + '\\'>' +`;
    }
}
fs.writeFileSync('src/warga/pengajuan_wizard.js', lines.join('\n'));
console.log("Fixed!");
