export function renderAdminTable(response) {
            let tbody = document.getElementById('table-admin-rows');
            if (!tbody) return;

            document.getElementById('txt-pagination-info').innerText = "Halaman " + response.currentPage + " dari " + response.totalPages + " (" + response.totalItems + " Berkas)";
            document.getElementById('btn-adm-prev').disabled = response.currentPage <= 1;
            document.getElementById('btn-adm-next').disabled = response.currentPage >= response.totalPages;

            if (!response.data || response.data.length === 0) {
                tbody.innerHTML = "<tr><td colspan='7' class='p-6 text-center text-slate-400 italic'>Tidak ada berkas pelayanan terdaftar dengan kriteria ini.</td></tr>";
                return;
            }

            window.currentAdminData = response.data;
            let htmlBuffer = "";
            let startIndex = (response.currentPage - 1) * 10;

            response.data.forEach(function (row, idx) {
                let rowNo = startIndex + idx + 1;
                let badgeColor = "bg-slate-100 text-slate-600 font-bold border-slate-200";
                if (row.status === "Menunggu") badgeColor = "bg-blue-100 text-blue-700 font-bold border-blue-200";
                else if (row.status === "Verifikasi") badgeColor = "bg-amber-100 text-amber-700 font-bold border-amber-200";
                else if (row.status === "Selesai" || row.status === "Pelayanan Selesai") badgeColor = "bg-emerald-100 text-emerald-700 font-bold border-emerald-200";
                else if (row.status === "Perbaikan" || row.status === "Upload Ulang") badgeColor = "bg-red-100 text-red-700 font-bold border-red-200";

                let cleanWaNum = row.wa.replace('+', '');
                let encodedNote = encodeURIComponent(row.catatan || "");
                let waLink = "https://api.whatsapp.com/send?phone=" + cleanWaNum + "&text=" + encodedNote;

                let linksSplit = row.linkDokumen.split(",").map(function (l) {
                    let p = l.split(":");
                    if (p.length >= 2) {
                        let rawName = p[0].trim();
                        let match = rawName.match(/^\[(.*?)\]\s*(.*)$/);
                        if (match) rawName = match[2];
                        return '<a href="' + p.slice(1).join(":").trim() + '" target="_blank" class="text-blue-600 hover:underline block text-[10px] font-bold"><i class="fa-solid fa-file-image"></i> ' + rawName + '</a>';
                    }
                    return '<span class="text-slate-400 block text-[10px]">' + l + '</span>';
                }).join("");

                let aksiHtml = '';
                if (window.currentPengajuanFilterStatus === 'Menunggu') {
                    aksiHtml = '<button onclick="quickProcessPengajuan(\'' + row.id + '\')" class="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[10px] transition-all flex items-center justify-center gap-1.5 shadow-sm mx-auto min-w-[90px] border border-blue-200"><i class="fa-solid fa-arrow-right-to-bracket"></i> Proses</button>';
                } else if (window.currentPengajuanFilterStatus === 'Proses') {
                    aksiHtml = '<div class="flex flex-col gap-1.5 items-center justify-center">' +
                        '<button onclick="openManageStatusModalById(\'' + row.id + '\')" class="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-[10px] transition-all flex items-center justify-center gap-1.5 shadow-sm min-w-[90px] border border-amber-200"><i class="fa-solid fa-check-double"></i> Verifikasi</button>' +
                        ((row.status === 'Verifikasi' || row.status === 'Pelayanan Selesai' || row.status === 'Selesai') ? 
                        '<button onclick="triggerGeneratePDF(\'' + row.id + '\')" class="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] transition-all flex items-center justify-center gap-1.5 shadow-sm min-w-[90px] border border-emerald-200"><i class="fa-solid fa-print"></i> Cetak Pengajuan</button>' : '') +
                        '</div>';
                } else if (window.currentPengajuanFilterStatus === 'Selesai') {
                    aksiHtml = '<div class="flex flex-col gap-1.5 items-center justify-center">' +
                        '<a href="' + waLink + '" target="_blank" class="px-3 py-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 font-bold text-[10px] transition-all flex items-center justify-center gap-1.5 shadow-sm min-w-[90px] border border-green-200"><i class="fa-brands fa-whatsapp text-xs"></i> Kirim WA</a>' +
                        ((row.status === 'Verifikasi' || row.status === 'Pelayanan Selesai' || row.status === 'Selesai') ? 
                        '<button onclick="triggerGeneratePDF(\'' + row.id + '\')" class="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] transition-all flex items-center justify-center gap-1.5 shadow-sm min-w-[90px] border border-emerald-200"><i class="fa-solid fa-print"></i> Cetak Pengajuan</button>' : '') +
                        '</div>';
                } else {
                    aksiHtml = '<a href="' + waLink + '" target="_blank" class="px-3 py-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 font-bold text-[10px] transition-all flex items-center justify-center gap-1.5 shadow-sm mx-auto min-w-[90px] border border-green-200"><i class="fa-brands fa-whatsapp text-xs"></i> Kirim WA</a>';
                }

                let trHtml = '<tr class="hover:bg-emerald-50/50 transition-all border-b border-slate-101">' +
                    '<td class="p-4 text-center font-bold text-slate-500 text-[10px]">' + rowNo + '</td>' +
                    '<td class="p-4">' +
                    '<p class="text-[9px] font-bold text-slate-700 mt-0.5">' + row.tanggal + '</p>' +
                    '<p class="text-[9px] text-slate-500 font-semibold italic mt-0.5"><i class="fa-solid fa-map-location-dot"></i> ' + (row.alamat || "-") + '</p>' +
                    '</td>' +
                    '<td class="p-4">' +
                    '<p class="text-[11px] font-bold text-slate-700">No Req: <span class="font-extrabold text-slate-950">' + row.id + '</span></p>' +
                    '<p class="text-[11px] font-bold text-slate-700 mt-0.5">Nama: ' + row.nama + '</p>' +
                    '<p class="text-[11px] font-bold text-slate-700 mt-0.5">NIK: ' + row.nik + '</p>' +
                    '<p class="text-[10px] text-green-600 font-bold mt-0.5"><i class="fa-brands fa-whatsapp"></i> ' + row.wa + '</p>' +
                    '</td>' +
                    '<td class="p-4"><span class="font-bold text-narmadaGreen text-[11px]">' + row.layanan + '</span></td>' +
                    '<td class="p-4 text-center"><span class="px-2.5 py-1 rounded-full text-[10px] font-bold border ' + badgeColor + '">' + row.status + '</span></td>' +
                    '<td class="p-4 text-center">' + aksiHtml + '</td>' +
                    '</tr>';

                htmlBuffer += trHtml;
            });
            tbody.innerHTML = htmlBuffer;
        }

export function triggerGeneratePDF(idPengajuan) {
            pushToast("Mempersiapkan dokumen PDF... Mohon tunggu.", "info");
            if (isGoogleEnv) {
                google.script.run
                    .withSuccessHandler(function (res) {
                        if (res && res.authError) { pushToast(res.message, "error"); handleAdminLogout(); return; }
                        if (res.success) {
                            pushToast(res.message, "success");
                            window.open(res.url, "_blank");
                        } else {
                            pushToast(res.message, "error");
                        }
                    })
                    .generateSuratPDF(localStorage.getItem('adminToken_Narmada'), idPengajuan);
            } else {
                setTimeout(function () {
                    pushToast("SIMULASI: PDF Surat berhasil digenerate.", "success");
                }, 1500);
            }
        }

export function runAdminFilter() {
            adminKeyword = document.getElementById('admin-keyword-filter').value;
            currentAdminPage = 1;
            fetchAdminDashboardData();
        }

export function moveAdminPage(offset) {
            currentAdminPage += offset;
            fetchAdminDashboardData();
        }

export function openManageStatusModalById(id) {
            if (!window.currentAdminData) return;
            let row = window.currentAdminData.find(function (item) {
                return item.id === id;
            });
            if (!row) return;

            document.getElementById('edit-status-id').value = row.id;
            
            let keperluanEl = document.getElementById('info-modal-keperluan');
            if(keperluanEl) {
                keperluanEl.innerHTML = "<div class='text-[10px] text-slate-500 font-bold'>No Req: <span class='text-slate-700'>" + row.id + "</span></div>" +
                                        "<div class='font-bold text-slate-900 mt-1'>" + row.nama + "</div>" +
                                        "<div class='text-[10px] font-bold text-emerald-600 mt-1'>" + row.layanan + "</div>";
            }
            
            let jawabanFormatted = "<div class='space-y-1 pt-1'>";
            
            if (row.detailLayanan && row.detailLayanan !== "-") {
                let matchedLayanan = window.loadedLayananList ? window.loadedLayananList.find(l => l.nama === row.layanan) : null;
                let qMap = {};
                let items = row.detailLayanan.split(" | ");
                
                let submittedKeperluan = "Wajib";
                items.forEach(function(item) {
                    let colon = item.indexOf(":");
                    if (colon > -1) {
                        let q = item.substring(0, colon).trim();
                        let a = item.substring(colon + 1).trim();
                        if (q === "Keperluan Surat") {
                            submittedKeperluan = a;
                        }
                    }
                });

                items.forEach(function(item) {
                    let colon = item.indexOf(":");
                    if (colon > -1) {
                        let q = item.substring(0, colon).trim();
                        let a = item.substring(colon + 1).trim();
                        if (q !== "Keperluan Surat") {
                            let groupName = "Isian Tambahan";
                            let order = 999;
                            
                            if (matchedLayanan && matchedLayanan.fields) {
                                let bestMatch = matchedLayanan.fields.find(function(f) {
                                    return f.label === q || parseQuestionMetadata(f.name).cleanName === q;
                                });
                                
                                if (bestMatch) {
                                    let possibleMatches = matchedLayanan.fields.filter(function(f) {
                                        return f.label === q || parseQuestionMetadata(f.name).cleanName === q;
                                    });
                                    if (possibleMatches.length > 1 && submittedKeperluan) {
                                        let exactMatch = possibleMatches.find(function(f) {
                                            return parseQuestionMetadata(f.name).keperluan === submittedKeperluan;
                                        });
                                        if (exactMatch) bestMatch = exactMatch;
                                        else {
                                            let defaultMatch = possibleMatches.find(function(f) {
                                                return parseQuestionMetadata(f.name).keperluan === "Wajib";
                                            });
                                            if (defaultMatch) bestMatch = defaultMatch;
                                        }
                                    }
                                    
                                    let parsed = parseQuestionMetadata(bestMatch.name);
                                    groupName = (parsed.keperluan === "Wajib") ? "Data Pemohon" : "Isian Tambahan";
                                    order = matchedLayanan.fields.indexOf(bestMatch);
                                }
                            }
                            
                            if (!qMap[groupName]) qMap[groupName] = [];
                            qMap[groupName].push({ q: q, a: a, order: order });
                        }
                    }
                });

                let templatePratinjau = matchedLayanan && matchedLayanan.templatePratinjau ? matchedLayanan.templatePratinjau.trim() : null;
                
                if (templatePratinjau) {
                    let flatQa = {};
                    flatQa["Keperluan"] = submittedKeperluan;
                    items.forEach(function(item) {
                        let colon = item.indexOf(":");
                        if (colon > -1) {
                            let q = item.substring(0, colon).trim();
                            let a = item.substring(colon + 1).trim();
                            flatQa[q] = a;
                        }
                    });
                    
                    let replacedTemplate = templatePratinjau.replace(/\{([^}]+)\}/g, function(match, key) {
                        let k = key.trim();
                        return flatQa[k] !== undefined ? "<strong class='font-bold bg-yellow-100 px-1 py-0.5 rounded text-black'>" + flatQa[k] + "</strong>" : match;
                    });
                    
                    jawabanFormatted = "<div class='whitespace-pre-wrap text-[14px] leading-loose'>" + replacedTemplate + "</div>";
                } else {
                    jawabanFormatted += "<div class='space-y-1 pt-1'>";
                    // Badge Keperluan Surat (Stacked Text)
                    if (submittedKeperluan && submittedKeperluan !== "Wajib") {
                        jawabanFormatted += "<div class='flex flex-col leading-tight mb-4 border-b border-slate-50 pb-2'><span class='font-black text-slate-900 text-[11px]'>" + submittedKeperluan + "</span><span class='text-slate-400 font-medium mt-0.5'>Keperluan</span></div>";
                    }
                    
                    Object.keys(qMap).forEach(function(k) {
                        qMap[k].sort(function(a, b) { return a.order - b.order; });
                        let groupName = k;
                        let groupIcon = (groupName === 'Data Pemohon') ? 'fa-solid fa-user' : 'fa-solid fa-clipboard-list';
                        jawabanFormatted += "<div class='mb-4'>";
                        jawabanFormatted += "<h6 class='font-bold text-slate-800 mb-2 text-[12px] border-b border-slate-50 pb-2 mt-4 flex items-center gap-1.5'><i class='" + groupIcon + " text-narmadaGreen text-[10px]'></i> " + groupName + "</h6>";
                        jawabanFormatted += "<div class='flex flex-col gap-y-3.5 text-[10px] text-slate-700 mt-2 mb-2'>";
                        
                        let isRepeatedGroup = false;
                        let maxRepeats = 1;
                        qMap[k].forEach(function(qa) {
                            if (qa.a && qa.a.match(/\s*;\s*/)) {
                                isRepeatedGroup = true;
                                let parts = qa.a.split(/\s*;\s*/);
                                if (parts.length > maxRepeats) maxRepeats = parts.length;
                            }
                        });

                        if (isRepeatedGroup) {
                            for (let i = 0; i < maxRepeats; i++) {
                                if (i > 0) {
                                    jawabanFormatted += "<div class='border-t border-slate-50 mt-1 pt-3 mb-1'><span class='font-bold text-slate-500 text-[9px] uppercase tracking-wider'>" + groupName + " Ke-" + (i + 1) + "</span></div>";
                                }
                                qMap[k].forEach(function(qa) {
                                    let parts = qa.a ? qa.a.split(/\s*;\s*/) : [];
                                    let val = parts[i] || "-";
                                    jawabanFormatted += "<div class='flex flex-col leading-tight'><span class='font-black text-slate-900 text-[11px] break-words'>" + val + "</span><span class='text-slate-400 font-medium mt-0.5'>" + qa.q + "</span></div>";
                                });
                            }
                        } else {
                            qMap[k].forEach(function(qa) {
                                if (qa.a && qa.a !== "" && qa.a !== "-") {
                                    jawabanFormatted += "<div class='flex flex-col leading-tight'><span class='font-black text-slate-900 text-[11px] break-words'>" + qa.a + "</span><span class='text-slate-400 font-medium mt-0.5'>" + qa.q + "</span></div>";
                                }
                            });
                        }
                        jawabanFormatted += "</div></div>";
                    });
                    jawabanFormatted += "</div>";
                }
            } else {
                jawabanFormatted += "<p class='text-slate-400 italic text-[10px] pt-1'>Tidak ada isian tambahan.</p>";
            }
            document.getElementById('info-modal-jawaban').innerHTML = jawabanFormatted;

            let selStatus = document.getElementById('edit-status-select');
            if(selStatus) selStatus.value = row.status;
            
            let selCatatan = document.getElementById('edit-status-catatan');
            if(selCatatan) selCatatan.value = row.catatan === "-" ? "" : row.catatan;

            renderChecklistTable(row.linkDokumen, row.nama, row.id, row.layanan);

            resetVerifikasiDirty();
            switchAdminTab('verifikasi');
        }

export function closeManageStatusModal() {
            if (window.isVerifikasiDirty) {
                askConfirmation(
                    "Batal Verifikasi?",
                    "Anda telah mengubah status atau catatan. Perubahan belum disimpan. Yakin ingin membatalkan?",
                    function() {
                        resetVerifikasiDirty();
                        switchAdminTab('dashboard');
                    }
                );
            } else {
                switchAdminTab('dashboard');
            }
        }

export function changeVerifSlide(direction) {
            let slides = document.querySelectorAll('.verif-slide');
            if (slides.length === 0) return;

            slides[window.currentVerifSlide].classList.add('hidden');
            window.currentVerifSlide += direction;

            if (window.currentVerifSlide >= slides.length) {
                window.currentVerifSlide = 0;
            } else if (window.currentVerifSlide < 0) {
                window.currentVerifSlide = slides.length - 1;
            }

            slides[window.currentVerifSlide].classList.remove('hidden');
            
            // Update counter
            let counterEl = document.getElementById('slide-counter');
            if(counterEl) {
                counterEl.innerText = (window.currentVerifSlide + 1) + " / " + slides.length;
            }
        }

export function renderChecklistTable(rawLinks, nama, id, layanan) {
            let tbody = document.getElementById('modal-checklist-rows');
            if (tbody) tbody.innerHTML = "";
            window.currentVerifSlide = 0;
            window.activeVerifFiles = [];

            if (!rawLinks || rawLinks === "-" || rawLinks === "") {
                if (tbody) {
                    tbody.innerHTML = '<div class="absolute inset-0 flex flex-col items-center justify-center p-6 text-slate-400 text-sm italic w-full h-full gap-3">' +
                                      '<i class="fa-regular fa-folder-open text-4xl text-slate-300"></i>' +
                                      '<span>Tidak ada dokumen lampiran.</span>' +
                                      '</div>';
                }
                return;
            }

            let linksArray = rawLinks.split(",");
            window.activeVerifFiles = [];

            // Add navigation and counter controls container if there's more than 1 file
            let navControls = "";
            if (linksArray.length > 1) {
                navControls = '<div class="absolute top-4 right-4 flex items-center gap-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-sm border border-slate-200 z-20">' +
                                '<button type="button" onclick="changeVerifSlide(-1)" class="w-6 h-6 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 transition-colors"><i class="fa-solid fa-chevron-left text-xs"></i></button>' +
                                '<span id="slide-counter" class="text-xs font-bold text-slate-700">1 / ' + linksArray.length + '</span>' +
                                '<button type="button" onclick="changeVerifSlide(1)" class="w-6 h-6 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 transition-colors"><i class="fa-solid fa-chevron-right text-xs"></i></button>' +
                              '</div>';
                tbody.innerHTML += navControls;
            }

            linksArray.forEach(function (item, idx) {
                let p = item.split(":");
                if (p.length >= 2) {
                    let labelName = p[0].trim();
                    let match = labelName.match(/^\[(.*?)\]\s*(.*)$/);
                    if (match) labelName = match[2];
                    
                    window.activeVerifFiles.push({ name: labelName });

                    let fileUrl = p.slice(1).join(":").trim();
                    let previewUrl = parseLinkDokumen(fileUrl);

                    let slideClass = idx === 0 ? "verif-slide flex-1 flex flex-col h-full w-full p-6 absolute inset-0 bg-white" : "verif-slide flex-1 flex flex-col h-full w-full p-6 absolute inset-0 bg-white hidden";

                    let card = '<div class="' + slideClass + '">' +
                        '<div class="flex justify-between items-center mb-4 shrink-0">' +
                        '<h6 class="text-sm font-black text-slate-800 flex items-center gap-2"><i class="fa-regular fa-file-image text-emerald-500"></i> ' + labelName + '</h6>' +
                        '<a href="' + fileUrl + '" target="_blank" class="text-xs font-bold text-narmadaGreen hover:text-emerald-700 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors"><i class="fa-solid fa-arrow-up-right-from-square"></i> Buka Tab Baru</a>' +
                        '</div>' +
                        '<div class="relative group cursor-zoom-in mb-5 flex-1 bg-slate-50/50 rounded-2xl overflow-hidden" onclick="openLightbox(\'' + previewUrl + '\', \'' + labelName.replace(/'/g, "\\'") + '\')">' +
                        '<img src="' + previewUrl + '" class="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.02]" alt="Berkas" onerror="this.onerror=null; this.src=\'https://placehold.co/800x600/e2e8f0/64748b?text=Berkas+Tidak+Ditemukan\';">' +
                        '<div class="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-all flex items-center justify-center">' +
                        '<i class="fa-solid fa-expand text-white opacity-0 group-hover:opacity-100 text-3xl drop-shadow-md transition-opacity"></i>' +
                        '</div>' +
                        '</div>' +
                        '<div class="grid grid-cols-2 gap-3 shrink-0">' +
                        '<label class="cursor-pointer">' +
                        '<input type="radio" name="verif_radio_' + idx + '" value="Sesuai" checked onchange="calculateAutoVerificationResult(\'' + nama + '\', \'' + id + '\', \'' + layanan + '\')" class="peer sr-only">' +
                        '<div class="py-2.5 px-4 rounded-full border border-transparent bg-slate-50 peer-checked:bg-emerald-50 peer-checked:text-emerald-600 text-center text-xs font-bold transition-all text-slate-400 hover:bg-slate-100">' +
                        '<i class="fa-solid fa-check mr-1.5"></i> Sesuai' +
                        '</div>' +
                        '</label>' +
                        '<label class="cursor-pointer">' +
                        '<input type="radio" name="verif_radio_' + idx + '" value="Tidak Sesuai" onchange="calculateAutoVerificationResult(\'' + nama + '\', \'' + id + '\', \'' + layanan + '\')" class="peer sr-only">' +
                        '<div class="py-2.5 px-4 rounded-full border border-transparent bg-slate-50 peer-checked:bg-rose-50 peer-checked:text-rose-600 text-center text-xs font-bold transition-all text-slate-400 hover:bg-slate-100">' +
                        '<i class="fa-solid fa-xmark mr-1.5"></i> Tidak Sesuai' +
                        '</div>' +
                        '</label>' +
                        '</div>' +
                        '</div>';

                    tbody.innerHTML += card;
                }
            });

            calculateAutoVerificationResult(nama, id, layanan);
        }

export function calculateAutoVerificationResult(nama, id, layanan) {
            let fileCount = window.activeVerifFiles ? window.activeVerifFiles.length : 0;
            let brokenFiles = [];

            for (let i = 0; i < fileCount; i++) {
                let radios = document.getElementsByName('verif_radio_' + i);
                let chosenVal = "Sesuai";
                for (let j = 0; j < radios.length; j++) {
                    if (radios[j].checked) chosenVal = radios[j].value;
                }

                if (chosenVal === "Tidak Sesuai") {
                    brokenFiles.push(window.activeVerifFiles[i].name);
                }
            }

            let selectStatus = document.getElementById('edit-status-select');
            let textNotes = document.getElementById('edit-status-catatan');

            if (brokenFiles.length > 0) {
                selectStatus.value = "Perbaikan";
                let filesBullet = brokenFiles.join(", ");
                textNotes.value = "Halo Bapak/Ibu *" + nama + "*, permohonan *" + layanan + "* dengan ID *" + id + "* belum lengkap. " +
                    "Mohon lakukan unggah ulang dokumen berkas berikut: *" + filesBullet + "*, karena foto dokumen yang dikirim buram atau tidak sesuai. " +
                    "Silakan buka menu 'Cek Status' di website resmi kami untuk melakukan upload ulang tanpa harus mengetik ulang nama berkas. Terima kasih.";
            } else {
                selectStatus.value = "Selesai";
                textNotes.value = "Halo Bapak/Ibu *" + nama + "*, berkas pengajuan *" + layanan + "* dengan ID *" + id + "* telah diperiksa dan dinyatakan LENGKAP & SESUAI. " +
                    "Surat pelayanan Anda kini sudah selesai diproses dan siap diserahterimakan di kantor desa. Terima kasih.";
            }
        }

export function confirmSaveVerification() {
            askConfirmation(
                "Konfirmasi Verifikasi",
                "Apakah Anda yakin ingin menyimpan hasil verifikasi berkas ini?",
                function() {
                    executeAdminStatusUpdate();
                }
            );
        }

export function executeAdminStatusUpdate() {
            let id = document.getElementById('edit-status-id').value;
            let nextStat = document.getElementById('edit-status-select').value;
            let nextNotes = document.getElementById('edit-status-catatan').value.trim();

            if (isGoogleEnv) {
                try {
                    google.script.run
                        .withSuccessHandler(function (res) {
                            if (res && res.authError) { pushToast(res.message, "error"); handleAdminLogout(); return; }
                            if (res.success) {
                                pushToast(res.message, "success");
                                resetVerifikasiDirty();
                                switchAdminTab('dashboard');
                                fetchAdminStats();
                            }
                        })
                        .updatePengajuanStatus(localStorage.getItem('adminToken_Narmada'), id, nextStat, nextNotes);
                } catch (e) { }
            } else {
                let findIdx = dummyPengajuanList.findIndex(function (r) { return r.id === id; });
                if (findIdx !== -1) {
                    dummyPengajuanList[findIdx].status = nextStat;
                    dummyPengajuanList[findIdx].catatan = nextNotes || "-";
                    pushToast("SIMULASI: Status berkas diperbarui.", "success");
                    resetVerifikasiDirty();
                    switchAdminTab('dashboard');
                    fetchAdminStats();
                }
            }
        }

export function exportDataExcel() {
    if (!window.currentAdminData || window.currentAdminData.length === 0) {
        pushToast("Tidak ada data untuk diexport.", "warning");
        return;
    }

    Swal.fire({
        title: "Konfirmasi Export",
        text: "Unduh data yang tampil di tabel saat ini sebagai CSV?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Ya, Unduh CSV",
        cancelButtonText: "Batal",
        customClass: {
            popup: "rounded-2xl border border-slate-100 shadow-sm",
            confirmButton: "bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl px-4 py-2",
            cancelButton: "bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl px-4 py-2"
        }
    }).then((result) => {
        if (result.isConfirmed) {
            let csvContent = "ID Pengajuan,Tanggal,NIK,Nama Pemohon,Layanan,Status\n";
            window.currentAdminData.forEach(row => {
                let nama = (row.nama || "").replace(/,/g, " ");
                let lay = (row.layanan || "").replace(/,/g, " ");
                csvContent += `${row.id},${row.tanggal},${row.nik},${nama},${lay},${row.status}\n`;
            });
            
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `Data_Pengajuan_${new Date().toISOString().slice(0,10)}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            pushToast("Export CSV berhasil.", "success");
        }
    });
}

export function cetakMassal() {
    if (!window.currentAdminData || window.currentAdminData.length === 0) {
        pushToast("Tidak ada data untuk dicetak.", "warning");
        return;
    }
    window.print();
}

window.currentPengajuanFilterStatus = 'Semua';

window.openPengajuanFilter = function(status) {
    window.currentPengajuanFilterStatus = status;
    switchAdminTab('pengajuan');
    runAdminFilter();
};

window.quickProcessPengajuan = function(id) {
    let row = window.loadedPengajuanList.find(r => r.id === id);
    if (!row) return;
    showLoading();
    google.script.run.withSuccessHandler(function(response) {
        hideLoading();
        if (response.status === 'success') {
            pushToast('Pengajuan ' + id + ' berhasil diproses.', 'success');
            loadAdminPengajuanTab();
        } else {
            pushToast(response.message || 'Gagal memproses.', 'error');
        }
    }).updatePengajuanStatus(id, 'Proses', 'Sedang diproses oleh operator', row.wa);
};

window.updatePengajuanSidebarBadges = function(list) {
    let menunggu = 0, proses = 0, perbaikan = 0, selesai = 0;
    list.forEach(item => {
        if (item.status === 'Menunggu') menunggu++;
        else if (item.status === 'Proses' || item.status === 'Verifikasi') proses++;
        else if (item.status === 'Perbaikan' || item.status === 'Upload Ulang') perbaikan++;
        else if (item.status === 'Selesai' || item.status === 'Pelayanan Selesai') selesai++;
    });

    const updateBadge = (id, count) => {
        let b = document.getElementById(id);
        if (b) {
            b.innerText = count;
            if (count > 0) {
                b.classList.remove('hidden');
            } else {
                b.classList.add('hidden');
            }
        }
    };
    updateBadge('badge-pengajuan-menunggu', menunggu);
    updateBadge('badge-pengajuan-proses', proses);
    updateBadge('badge-pengajuan-perbaikan', perbaikan);
};


