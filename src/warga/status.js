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

                let cardHtml = '<div class="bg-white border border-slate-200 p-4 rounded-xl shadow-2xl space-y-2.5 text-xs text-left">' +
                    '<div class="flex justify-between items-center pb-2 border-b border-slate-101">' +
                    '<div><span class="text-[8px] text-slate-400 block font-bold uppercase">No. Registrasi</span>' +
                    '<span class="font-extrabold text-slate-900">' + item.id + '</span></div>' +
                    '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold border ' + badgeColor + '">' + item.status + '</span>' +
                    '</div>' +
                    '<div class="grid grid-cols-2 gap-2 text-slate-700">' +
                    '<div><span class="text-slate-400 block text-[9px]">Pemohon:</span><span class="font-bold text-slate-900">' + item.nama + '</span></div>' +
                    '<div><span class="text-slate-400 block text-[9px]">Layanan:</span><span class="font-bold text-narmadaGreen">' + item.layanan + '</span></div>' +
                    '<div><span class="text-slate-400 block text-[9px]">Alamat:</span><span class="font-semibold text-slate-800">' + (item.alamat || "-") + '</span></div>' +
                    '<div><span class="text-slate-400 block text-[9px]">WhatsApp:</span><span>' + item.wa + '</span></div>' +
                    '</div>' +
                    '<div class="border-t border-slate-50 pt-2"><span class="text-slate-400 block text-[9px] font-bold uppercase tracking-wide mb-1">ISIAN FORMULIR WARGA:</span>' + parsedDetailsHtml + '</div>' +
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
