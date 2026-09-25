const fs = require('fs');

let file = 'src/admin/pengajuan.js';
let content = fs.readFileSync(file, 'utf8');

const target1 = `            // Populate Bidang Filter if empty and data is available
            let bidangFilterEl = document.getElementById('admin-bidang-filter');
            if (bidangFilterEl && bidangFilterEl.options.length <= 1 && window.loadedLayananList) {
                window.loadedLayananList.forEach(layanan => {
                    let opt = document.createElement('option');
                    opt.value = layanan.nama;
                    opt.innerText = layanan.nama;
                    if (window.currentPengajuanBidangFilter === layanan.nama) opt.selected = true;
                    bidangFilterEl.appendChild(opt);
                });
            }`;

const replacement1 = `            // Populate Bidang Filter if empty and data is available
            let bidangFilterEl = document.getElementById('admin-bidang-filter');
            if (bidangFilterEl && bidangFilterEl.options.length <= 1) {
                if (window.loadedLayananList) {
                    window.loadedLayananList.forEach(layanan => {
                        let opt = document.createElement('option');
                        opt.value = layanan.nama;
                        opt.innerText = layanan.nama;
                        if (window.currentPengajuanBidangFilter === layanan.nama) opt.selected = true;
                        bidangFilterEl.appendChild(opt);
                    });
                } else {
                    google.script.run.withSuccessHandler(function(list) {
                        window.loadedLayananList = list;
                        list.forEach(layanan => {
                            let opt = document.createElement('option');
                            opt.value = layanan.nama;
                            opt.innerText = layanan.nama;
                            if (window.currentPengajuanBidangFilter === layanan.nama) opt.selected = true;
                            bidangFilterEl.appendChild(opt);
                        });
                    }).getLayananList();
                }
            }`;

content = content.replace(target1, replacement1);

fs.writeFileSync(file, content);
console.log('Done replacing pengajuan.js populate logic.');
