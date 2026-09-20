export function runSearchStatus() {
            let key = document.getElementById('search-status-key').value.trim();
            let boxList = document.getElementById('box-list-status');
            let wrapper = document.getElementById('wrapper-hasil-status');
            if (!boxList || !wrapper) return;

            boxList.innerHTML = '<div class="animate-pulse space-y-4"><div class="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm h-32 w-full"></div><div class="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm h-32 w-full"></div></div>';
            wrapper.classList.remove('hidden');

            try {
                    google.script.run
                        .withSuccessHandler(function (res) { renderStatusCards(res); })
                        .getPengajuanStatus(key);
                } catch (e) {
                    renderStatusCards([]);
                }

        }

export function renderStatusCards(results) {
            window.lastStatusResults = results; // Save for voucher downloads
            
            let boxList = document.getElementById('box-list-status');
            if (!boxList) return;

            if (results.length === 0) {
                boxList.innerHTML = "<div class='text-center py-4 text-slate-505 font-bold bg-slate-50 border rounded-xl text-xs shadow-inner'>Registrasi tidak ditemukan.</div>";
                return;
            }

            let htmlBuffer = "";
            results.forEach(function (item) {
                let badgeColor = "bg-slate-100 text-slate-700 border-slate-200";
                if (item.status === "Menunggu") badgeColor = "bg-blue-50 text-blue-600 border-blue-200";
                else if (item.status === "Diperiksa") badgeColor = "bg-amber-50 text-amber-600 border-amber-200 font-bold";
                else if (item.status === "Selesai") badgeColor = "bg-slate-900 text-emerald-400 border-slate-900";
                else if (item.status === "Perbaikan") badgeColor = "bg-red-50 text-red-600 border-red-200 font-bold";

                let cleanWaNum = item.wa.replace('+', '');
                let encodedNote = encodeURIComponent(item.catatan || "");
                let waLink = "https://api.whatsapp.com/send?phone=" + cleanWaNum + "&text=" + encodedNote;

                let linksSplit = item.linkDokumen.split(",").map(function (l) {
                    let p = l.split(":");
                    if (p.length >= 2) {
                        let rawName = p[0].trim();
                        let match = rawName.match(/^\[(.*?)\]\s*(.*)$/);
                        if (match) rawName = match[2];

                        return '<a href="' + p.slice(1).join(":").trim() + '" target="_blank" class="text-blue-600 hover:underline block text-[10px] font-bold"><i class="fa-solid fa-file-image"></i> ' + rawName + '</a>';
                    }
                    return '<span class="text-slate-400 block text-[10px]">' + l + '</span>';
                }).join("");

                let matchedLayananStatus = (window.loadedLayananList || dummyLayananList).find(function (lay) {
                    return lay.nama === item.layanan;
                });
                let statusOptionsList = matchedLayananStatus ? (matchedLayananStatus.keperluan ? matchedLayananStatus.keperluan.split(',').map(function(s){return s.trim()}).filter(function(s){return s}) : []) : [];

                let parsedDetailsHtml = "";
                if (item.detailLayanan && item.detailLayanan !== "-") {
                    try {
                        let parsedObj = JSON.parse(item.detailLayanan);
                        Object.keys(parsedObj).forEach(function (k) {
                            if (k === "Keperluan Surat" && statusOptionsList.length <= 1) return;
                            parsedDetailsHtml += '<div class="grid grid-cols-[1fr_10px_1fr] gap-2 border-b border-slate-100 py-1"><span class="text-slate-500 text-[10px] text-left break-words">' + k + '</span><span class="text-slate-400 text-[10px] text-center">:</span><span class="font-bold text-slate-800 text-[10px] text-left break-words">' + parsedObj[k] + '</span></div>';
                        });
                    } catch (e) {
                        let parts = item.detailLayanan.split('|');
                        if (parts.length > 1) {
                            parts.forEach(function (part) {
                                let kv = part.split(':');
                                if (kv.length >= 2) {
                                    let k = kv[0].trim();
                                    if (k === "Keperluan Surat" && statusOptionsList.length <= 1) return;
                                    let v = kv.slice(1).join(':').trim();
                                    parsedDetailsHtml += '<div class="grid grid-cols-[1fr_10px_1fr] gap-2 border-b border-slate-100 py-1"><span class="text-slate-500 text-[10px] text-left break-words">' + k + '</span><span class="text-slate-400 text-[10px] text-center">:</span><span class="font-bold text-slate-800 text-[10px] text-left break-words">' + v + '</span></div>';
                                } else {
                                    parsedDetailsHtml += '<div class="border-b border-slate-100 py-1 text-slate-800 font-bold">' + part.trim() + '</div>';
                                }
                            });
                        } else {
                            parsedDetailsHtml += '<div class="font-bold text-slate-800">' + item.detailLayanan + '</div>';
                        }
                    }
                } else {
                    parsedDetailsHtml += '<div class="font-bold text-slate-800">-</div>';
                }

                let downloadSuratBtn = '';
                let tteNoteMatch = item.catatan ? item.catatan.match(/TTE_APPROVED\|(.*?)\|(.*)/) : null;
                if (item.status === "Selesai" && tteNoteMatch) {
                    downloadSuratBtn = '<button onclick="if(window.downloadTteSurat) window.downloadTteSurat(\'' + item.id + '\')" class="bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 rounded text-[9px] font-bold transition-all shadow-sm"><i class="fa-solid fa-file-pdf"></i> Surat (TTE)</button>';
                } else if (item.status === "Selesai") {
                    downloadSuratBtn = '<button onclick="if(window.downloadTteSurat) window.downloadTteSurat(\'' + item.id + '\')" class="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-[9px] font-bold transition-all shadow-sm"><i class="fa-solid fa-print"></i> Cetak Surat</button>';
                }

                let cardHtml = '<div class="bg-white border border-slate-200 p-4 rounded-xl shadow-2xl space-y-2.5 text-xs text-left">' +
                    '<div class="flex justify-between items-center pb-2 border-b border-slate-101">' +
                    '<div><span class="text-[8px] text-slate-400 block font-bold uppercase">No. Registrasi</span>' +
                    '<span class="font-extrabold text-slate-900">' + item.id + '</span></div>' +
                    '<div class="flex items-center gap-1.5">' + downloadSuratBtn +
                    '<button onclick="if(window.downloadStatusVoucher) window.downloadStatusVoucher(\'' + item.id + '\')" class="bg-slate-800 hover:bg-slate-900 text-white px-2 py-1 rounded text-[9px] font-bold transition-all shadow-sm"><i class="fa-solid fa-download"></i> Tiket</button>' +
                    '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold border ' + badgeColor + '">' + item.status + '</span>' +
                    '</div>' +
                    '</div>' +
                    '<div class="grid grid-cols-2 gap-2 text-slate-700">' +
                    '<div><span class="text-slate-400 block text-[9px]">Pemohon:</span><span class="font-bold text-slate-900">' + item.nama + '</span></div>' +
                    '<div><span class="text-slate-400 block text-[9px]">Layanan:</span><span class="font-bold text-narmadaGreen">' + item.layanan + '</span></div>' +
                    '<div><span class="text-slate-400 block text-[9px]">Alamat:</span><span class="font-semibold text-slate-800">' + (item.alamat || "-") + '</span></div>' +
                    '<div><span class="text-slate-400 block text-[9px]">WhatsApp:</span><span>' + item.wa + '</span></div>' +
                    '</div>' +
                    '<div class="p-2.5 bg-slate-50 border rounded-lg text-[11px] italic text-slate-600 shadow-inner mt-2"><strong>Catatan Petugas:</strong> "' + item.catatan + '"</div>';

                if (item.status === "Perbaikan") {
                    let matchedLayanan = (window.loadedLayananList || dummyLayananList).find(function (lay) {
                        return lay.nama === item.layanan;
                    });

                    let reqList = matchedLayanan ? (matchedLayanan.requirements || []) : [];

                    if (reqList.length > 0) {
                        cardHtml += '<div class="mt-2 border-t border-t-red-200 pt-2.5 space-y-2 bg-red-50/50 p-3 rounded-xl border border-red-100 shadow-inner">' +
                            '<p class="text-[10px] font-extrabold text-red-700"><i class="fa-solid fa-circle-exclamation"></i> Unggah Ulang Berkas Yang Diperlukan:</p>' +
                            '<div class="grid grid-cols-1 gap-1.5">';

                        reqList.forEach(function (req) {
                            let cleanName = req.name;
                            let match = cleanName.match(/^\[(.*?)\]\s*(.*)$/);
                            if (match) cleanName = match[2];

                            cardHtml += '<div class="flex items-center justify-between bg-white p-2 rounded-lg border border-red-101 shadow-sm">' +
                                '<span class="text-[10px] font-bold text-slate-700 truncate max-w-[170px]">' + cleanName + '</span>' +
                                '<label class="px-3 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded text-[9px] font-bold transition-all cursor-pointer shadow-md flex items-center gap-1 shrink-0">' +
                                '<i class="fa-solid fa-cloud-arrow-up"></i> Upload' +
                                '<input type="file" accept="image/*" class="hidden" onchange="runReuploadProcessDirect(event, \'' + item.id + '\', \'' + cleanName + '\')">' +
                                '</label>' +
                                '</div>';
                        });

                        cardHtml += '</div></div>';
                    }
                }

                cardHtml += '</div>';
                htmlBuffer += cardHtml;
            });
            boxList.innerHTML = htmlBuffer;
        }

window.downloadStatusVoucher = function(id) {
    if (!window.lastStatusResults) return;
    let item = window.lastStatusResults.find(i => i.id === id);
    if (!item) return;

    let matchedLayanan = (window.loadedLayananList || window.dummyLayananList).find(l => l.nama === item.layanan);
    let reqs = matchedLayanan ? matchedLayanan.requirements : [];
    
    if (window.generateVoucherPDF) {
        window.generateVoucherPDF({
            regId: item.id,
            nama: item.nama,
            nik: item.nik,
            layanan: item.layanan,
            requirements: reqs
        });
    } else {
        if(window.pushToast) window.pushToast("Fitur tiket sedang dimuat, coba lagi.", "error");
    }
};

export function runReuploadProcessDirect(event, idPengajuan, labelNamaBerkas) {
    let file = event.target.files[0];
    if (!file) return;
    
    let currentNik = document.getElementById('search-status-key').value.trim();

    pushToast("Membaca & Memproses...", "info");

            let reader = new FileReader();
            reader.onload = function (e) {
                let img = new Image();
                img.onload = function () {
                    let canvas = document.createElement('canvas');
                    let ctx = canvas.getContext('2d');
                    canvas.width = 1024;
                    canvas.height = 768;
                    ctx.drawImage(img, 0, 0, 1024, 768);
                    let compressedBase64 = canvas.toDataURL("image/jpeg", 0.70);

                    try {
                            google.script.run
                                .withSuccessHandler(function (res) {
                                    if (res.success) {
                                        pushToast(res.message, "success");
                                        runSearchStatus();
                                    } else {
                                        pushToast(res.message, "error");
                                    }
                                })
                                .processReuploadBerkas(idPengajuan, labelNamaBerkas, compressedBase64, currentNik);
                        } catch (err) { }

                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }

window.downloadTteSurat = function(id) {
    let item = window.lastStatusResults.find(r => r.id === id);
    if (!item) return;

    Swal.fire({
        title: 'Mempersiapkan Dokumen',
        text: 'Sedang merender surat Anda...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    let templateMap = {};
    let matchedLayanan = (window.loadedLayananList || (typeof dummyLayananList !== 'undefined' ? dummyLayananList : [])).find(l => l.nama === item.layanan);
    
    if (matchedLayanan && matchedLayanan.templatePratinjau) {
        try {
            templateMap = JSON.parse(matchedLayanan.templatePratinjau);
        } catch(e) {
            templateMap[item.keperluan] = matchedLayanan.templatePratinjau;
        }
    }
    
    let templateHtml = templateMap[item.keperluan] || "Template belum tersedia untuk layanan ini.";
    
    let qMap = {};
    if (item.isianDetail && item.isianDetail !== "-") {
        try {
            qMap = JSON.parse(item.isianDetail);
        } catch (e) {}
    }
    
    let tteNoteMatch = item.catatan ? item.catatan.match(/TTE_APPROVED\|(.*?)\|(.*)/) : null;
    let tteTimestamp = tteNoteMatch ? tteNoteMatch[1] : "";
    let tteSigner = tteNoteMatch ? tteNoteMatch[2] : "";

    let variables = {
        nomor_surat: item.id,
        tanggal_cetak: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
        pemohon_nama: item.nama,
        pemohon_nik: item.nik || "-",
        pemohon_alamat: item.alamat || "-",
        pejabat_nama: tteSigner.split(" (")[0] || "",
        pejabat_jabatan: tteSigner.includes("(") ? tteSigner.split(" (")[1].replace(")", "") : "",
        pejabat_keterangan: ""
    };
    
    Object.keys(qMap).forEach(k => {
        qMap[k].forEach(qa => {
            let safeVal = qa.q.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
            variables[safeVal] = qa.a || "-";
        });
    });
    
    Object.keys(variables).forEach(k => {
        let regex = new RegExp(`{{${k}}}`, 'g');
        templateHtml = templateHtml.replace(regex, variables[k]);
    });

    let container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.innerHTML = `
        <div id="pdf-content-${id}" style="font-family: 'Times New Roman', Times, serif; font-size: 12pt; padding: 2cm; color: black; line-height: 1.5; background: white; width: 800px;">
            ${templateHtml}
            ${tteNoteMatch ? `
            <div style="margin-top: 50px; text-align: right; padding-right: 50px;">
                <p><strong>Ditandatangani secara elektronik oleh:</strong></p>
                <div id="qr-code-${id}" style="display: inline-block; margin: 15px 0;"></div>
                <p style="text-decoration: underline; font-weight: bold;">${variables.pejabat_nama}</p>
                <p>${variables.pejabat_jabatan}</p>
                <p style="font-size: 9pt; color: #666; margin-top: 5px;">Waktu: ${tteTimestamp}</p>
            </div>
            ` : ''}
        </div>
    `;
    document.body.appendChild(container);

    if (tteNoteMatch && typeof QRCode !== 'undefined') {
        new QRCode(document.getElementById(`qr-code-${id}`), {
            text: `Validasi TTE Desa Narmada\nDokumen: ${item.id}\nPenandatangan: ${tteSigner}\nWaktu: ${tteTimestamp}`,
            width: 120,
            height: 120
        });
    }

    setTimeout(() => {
        let element = document.getElementById(`pdf-content-${id}`);
        let opt = {
            margin:       0,
            filename:     `Surat_${item.layanan}_${item.nama}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        if (typeof html2pdf !== 'undefined') {
            html2pdf().set(opt).from(element).save().then(() => {
                document.body.removeChild(container);
                Swal.fire('Berhasil', 'Dokumen PDF telah diunduh.', 'success');
            });
        } else {
            Swal.fire('Gagal', 'Library pembuat PDF belum dimuat.', 'error');
            document.body.removeChild(container);
        }
    }, 1000);
};
