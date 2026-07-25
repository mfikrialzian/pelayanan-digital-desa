const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('index.html', 'utf8');
const $ = cheerio.load(html, { decodeEntities: false });

const idsToMove = [
    'subview-admin-layanan',
    'subview-admin-daftar-layanan',
    'subview-admin-verifikasi',
    'subview-admin-kontak',
    'subview-admin-beranda',
    'subview-admin-kredensial',
    'subview-admin-laporan',
    'subview-admin-aktivitas'
];

const container = $('.flex-grow.overflow-y-auto.p-6.scroll-smooth.bg-slate-50');

idsToMove.forEach(id => {
    const el = $('#' + id);
    if (el.length > 0) {
        const cloned = el.clone();
        el.remove();
        container.append(cloned);
        console.log('Moved ' + id);
    } else {
        console.log('Could not find ' + id);
    }
});

fs.writeFileSync('index.html', $.html());
console.log('Done');
