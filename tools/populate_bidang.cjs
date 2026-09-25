const fs = require('fs');
let file = 'src/admin/pengajuan.js';
let content = fs.readFileSync(file, 'utf8');

const target = `            let titleEl = document.getElementById('pengajuan-table-title');`;
const replacement = `            // Populate Bidang Filter if empty and data is available
            let bidangFilterEl = document.getElementById('admin-bidang-filter');
            if (bidangFilterEl && bidangFilterEl.options.length <= 1 && window.loadedLayananList) {
                window.loadedLayananList.forEach(layanan => {
                    let opt = document.createElement('option');
                    opt.value = layanan.nama;
                    opt.innerText = layanan.nama;
                    if (window.currentPengajuanBidangFilter === layanan.nama) opt.selected = true;
                    bidangFilterEl.appendChild(opt);
                });
            }
            
            let titleEl = document.getElementById('pengajuan-table-title');`;

content = content.replace(target, replacement);

fs.writeFileSync(file, content);
console.log('Done adding populate Bidang Filter logic to pengajuan.js');
