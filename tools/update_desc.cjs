const fs = require('fs');

let html = fs.readFileSync('d:/PelayananDigitalDesa/vercel-frontend/index.html', 'utf8');

if (!html.includes('id="text-desc-layanan-terpilih"')) {
    html = html.replace(/<h3 class="text-sm font-extrabold text-narmadaGreen" id="text-judul-layanan-terpilih">Nama Pelayanan[\r\n\s]*<\/h3>/m, 
        '<h3 class="text-sm font-extrabold text-narmadaGreen" id="text-judul-layanan-terpilih">Nama Pelayanan</h3>\n<p class="text-[10px] text-slate-500 font-medium leading-snug mt-1 mb-2 hidden" id="text-desc-layanan-terpilih"></p>');
    fs.writeFileSync('d:/PelayananDigitalDesa/vercel-frontend/index.html', html);
}

let js = fs.readFileSync('d:/PelayananDigitalDesa/vercel-frontend/src/warga/pengajuan_wizard.js', 'utf8');

if (!js.includes("document.getElementById('text-desc-layanan-terpilih')")) {
    js = js.replace("document.getElementById('text-judul-layanan-terpilih').innerText = found.nama;",
        "document.getElementById('text-judul-layanan-terpilih').innerText = found.nama;\n            document.getElementById('text-desc-layanan-terpilih').classList.remove('hidden');\n            document.getElementById('text-desc-layanan-terpilih').innerText = found.deskripsi || 'Silakan lengkapi form ini.';");
        
    js = js.replace("if (elKeperluan) activeKeperluan = elKeperluan.value.trim();",
        "if (elKeperluan) activeKeperluan = elKeperluan.value.trim();\n            let descEl = document.getElementById('text-desc-layanan-terpilih');\n            if (descEl) {\n                if (activeKeperluan) {\n                    descEl.innerText = 'Keperluan: ' + activeKeperluan;\n                } else {\n                    descEl.innerText = selectedLayananGlobal.deskripsi || 'Silakan lengkapi formulir pengajuan.';\n                }\n            }");
        
    fs.writeFileSync('d:/PelayananDigitalDesa/vercel-frontend/src/warga/pengajuan_wizard.js', js);
}
console.log("Updated both files");
