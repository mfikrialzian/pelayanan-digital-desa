const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

html = html.replace('id="time-filter-Hari Ini"', 'id="time-filter-Hari-Ini"');
html = html.replace('id="time-filter-Minggu Ini"', 'id="time-filter-Minggu-Ini"');
html = html.replace('id="time-filter-Bulan Ini"', 'id="time-filter-Bulan-Ini"');

fs.writeFileSync('index.html', html);

let js = fs.readFileSync('src/admin/pengajuan.js', 'utf8');
const target = `    ['Semua', 'Hari Ini', 'Minggu Ini', 'Bulan Ini'].forEach(tf => {
        let el = document.getElementById('time-filter-' + tf);`;
const replacement = `    ['Semua', 'Hari Ini', 'Minggu Ini', 'Bulan Ini'].forEach(tf => {
        let el = document.getElementById('time-filter-' + tf.replace(' ', '-'));`;

js = js.replace(target, replacement);

fs.writeFileSync('src/admin/pengajuan.js', js);
console.log('Fixed time-filter IDs with spaces');
