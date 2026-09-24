const fs = require('fs');
let js = fs.readFileSync('src/warga/pengajuan_wizard.js', 'utf8');

// Fix line 102
js = js.replace(
    "if (row.nama) row.nama = row.nama.replace(/[nr]+/g, ' ').trim();",
    "if (row.nama) row.nama = row.nama.replace(/[\\\\n\\\\r]+/g, ' ').trim();"
);

// Fix line 103
js = js.replace(
    "let safeNamaForJS = row.nama ? row.nama.replace(//g, '').replace(/'/g, \"'\").replace(/\"/g, '&quot;') : '';",
    "let safeNamaForJS = row.nama ? row.nama.replace(/\\\\\\\\/g, '').replace(/\\'/g, \"&#39;\").replace(/\\\"/g, '&quot;') : '';"
);

fs.writeFileSync('src/warga/pengajuan_wizard.js', js);
console.log('Fixed');
