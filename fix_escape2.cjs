const fs = require('fs');
let js = fs.readFileSync('src/warga/pengajuan_wizard.js', 'utf8');

// Use precise replacement
js = js.replace(
    'inputHtml = \'<div class="sd-container" id="\' + uniqueId + \'" data-options=\\\\\\\'\' + optionsJson.replace(/\\\\\\\'/g, "&#39;") + \'\\\\\\\'>\' +',
    'inputHtml = `<div class="sd-container" id="${uniqueId}" data-options=\\'${optionsJson.replace(/\\'/g, "&#39;")}\\'>` +'
);
// Or even simpler:
let lines = js.split('\n');
for(let i=0; i<lines.length; i++) {
    if(lines[i].includes('data-options=\\\\'') && lines[i].includes('optionsJson')) {
        lines[i] = '                    inputHtml = `<div class="sd-container" id="${uniqueId}" data-options=\\'${optionsJson.replace(/\\\'/g, "&#39;")}\\'>` +';
    }
}

fs.writeFileSync('src/warga/pengajuan_wizard.js', lines.join('\n'));
console.log('Fixed');
