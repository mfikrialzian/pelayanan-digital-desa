export function saveWargaDraft() {
            if (!selectedLayananGlobal) return;
            let draft = {
                layanan: selectedLayananGlobal.nama,
                nik: document.getElementById('warga-nik') ? document.getElementById('warga-nik').value : "",
                nama: document.getElementById('warga-nama') ? document.getElementById('warga-nama').value : "",
                wa: document.getElementById('warga-wa') ? document.getElementById('warga-wa').value : "",
                alamat: document.getElementById('warga-alamat') ? document.getElementById('warga-alamat').value : "",
                keperluan: document.getElementById('warga-keperluan-surat') ? document.getElementById('warga-keperluan-surat').value : "",
                dynamic: {}
            };

            let qFields = document.querySelectorAll('.dynamic-question-field');
            qFields.forEach(function (f) {
                if (f.id) draft.dynamic[f.id] = f.value;
            });
            localStorage.setItem('wargaDraft_Narmada', JSON.stringify(draft));
        }

export function loadWargaDraft(layananNama) {
            let draftStr = localStorage.getItem('wargaDraft_Narmada');
            if (draftStr) {
                try {
                    let draft = JSON.parse(draftStr);
                    if (draft.nik) document.getElementById('warga-nik').value = draft.nik;
                    if (draft.nama) document.getElementById('warga-nama').value = draft.nama;
                    if (draft.wa) document.getElementById('warga-wa').value = draft.wa;
                    if (draft.alamat) document.getElementById('warga-alamat').value = draft.alamat;

                    if (draft.layanan === layananNama) {
                        let kepEl = document.getElementById('warga-keperluan-surat');
                        if (kepEl && draft.keperluan) {
                            kepEl.value = draft.keperluan;
                        }
                        if (draft.dynamic) {
                            Object.keys(draft.dynamic).forEach(function (key) {
                                let el = document.getElementById(key);
                                if (el) el.value = draft.dynamic[key];
                            });
                        }
                        runLiveConditionalLogicEvaluationForCitizen();
                        if(window.toggleWizardStep1State) window.toggleWizardStep1State();
                    }
                } catch (e) {
                    console.error("Gagal memuat draft:", e);
                }
            }
        }

export function handleMulaiPengajuan() {
            let isAdmin = localStorage.getItem('adminToken_Narmada') !== null;
            if (window.isServiceOpen === false && !isAdmin) {
                pushToast("Maaf, pelayanan saat ini sedang tutup. Silakan kembali pada jam operasional.", "error");
                return;
            }
            if (isAdmin && window.isServiceOpen === false) {
                pushToast("Bypass Akses Admin Aktif (Mode Pengecekan).", "info");
            }
            switchView('layanan');
        }

export function loadLayananDataWarga() {
            let container = document.getElementById('container-list-layanan');
            if (!container) return;
            
            let skeletonHtml = '';
            for (let i = 0; i < 3; i++) {
                skeletonHtml += '<div class="light-glass-card p-4 rounded-2xl animate-pulse bg-white border border-slate-100 flex items-center justify-between">' +
                    '<div class="flex items-center space-x-3">' +
                    '<div class="w-8 h-8 bg-slate-200 rounded-lg"></div>' +
                    '<div class="space-y-2">' +
                    '<div class="h-3 bg-slate-200 rounded w-32"></div>' +
                    '<div class="h-2 bg-slate-200 rounded w-24"></div>' +
                    '</div></div>' +
                    '<div class="w-4 h-4 bg-slate-200 rounded-full"></div>' +
                    '</div>';
            }
            container.innerHTML = skeletonHtml;

            try {
                    google.script.run
                        .withSuccessHandler(function (list) { renderLayananListWarga(list); })
                        .getLayananList();
                } catch (e) {
                    renderLayananListWarga(dummyLayananList);
                }

        }

export function renderLayananListWarga(list) {
            let container = document.getElementById('container-list-layanan');
            if (!container) return;

            if (!list || list.length === 0) {
                container.innerHTML = "<p class='text-xs text-slate-500 italic p-3 text-center'>Belum ada daftar pelayanan dari admin.</p>";
                return;
            }

            window.loadedLayananList = list;

            let htmlBuffer = "";
            list.forEach(function (row) {
                if (row.nama) row.nama = row.nama.replace(/[\n\r]+/g, ' ').trim(); // Bersihkan spasi berlebih atau enter (newline) dari backend
                let safeNamaForJS = row.nama ? row.nama.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '&quot;') : '';

                let keperluanText = (row.judulSectionIsian && row.judulSectionIsian.trim() !== "") 
                    ? row.judulSectionIsian.split(',').join(', ') 
                    : "Layanan Digital Terintegrasi";
                    
                let itemHtml = '<div onclick="openFormPengajuan(\'' + safeNamaForJS + '\')" class="light-glass-card p-3.5 md:p-4 rounded-2xl transition-all duration-300 shadow-md hover:shadow-xl cursor-pointer group bg-white border border-slate-100 hover:border-emerald-200 flex items-center justify-between tap-squish">' +
                    '<div class="flex items-center space-x-3.5 flex-1 min-w-0 pr-2">' +
                    '<div class="w-10 h-10 md:w-11 md:h-11 bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 border border-emerald-100/50 group-hover:bg-gradient-to-br group-hover:from-narmadaGreen group-hover:to-narmadaGreen-dark group-hover:text-white transition-all duration-500 shadow-sm">' +
                    '<i class="fa-solid fa-file-signature text-lg md:text-xl drop-shadow-sm group-hover:scale-110 transition-transform"></i>' +
                    '</div>' +
                    '<div class="text-left w-full overflow-hidden">' +
                    '<p class="font-extrabold text-xs md:text-sm text-slate-800 group-hover:text-narmadaGreen transition-colors truncate">' + escapeHtml(row.nama) + '</p>' +
                    '<p class="text-[10px] md:text-xs text-slate-500 font-medium leading-snug mt-0.5 line-clamp-2" title="' + escapeHtml(keperluanText) + '">' + escapeHtml(keperluanText) + '</p>' +
                    '</div>' +
                    '</div>' +
                    '<div class="bg-slate-50 group-hover:bg-emerald-50 w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors border border-slate-100 group-hover:border-emerald-100">' +
                    '<i class="fa-solid fa-chevron-right text-slate-400 group-hover:text-narmadaGreen text-[10px] transition-transform group-hover:translate-x-0.5"></i>' +
                    '</div>' +
                    '</div>';
                htmlBuffer += itemHtml;
            });
            container.innerHTML = htmlBuffer;
        }

export function openFormPengajuan(nama) {
            let list = window.loadedLayananList || dummyLayananList;
            let found = list.find(l => l.nama === nama);
            if (!found) return;

            selectedLayananGlobal = found;
            document.getElementById('text-judul-layanan-terpilih').innerText = found.nama;
            document.getElementById('text-desc-layanan-terpilih').classList.remove('hidden');
            document.getElementById('text-desc-layanan-terpilih').innerText = found.deskripsi || 'Silakan lengkapi form ini.';

            document.getElementById('lbl-judul-section-isian').innerText = "Isian Keperluan Surat & Formulir";
            document.getElementById('lbl-desc-section-isian').innerText = "Pilih keperluan pengurusan surat Anda dan isi formulir tambahan.";

            uploadDataStore = {};
            currentWizardStep = 1;
            document.getElementById('warga-syarat-checkbox').checked = false;

            let listSyaratDiv = document.getElementById('container-desc-syarat-vertikal');
            listSyaratDiv.innerHTML = "";

            let reqs = found.requirements || [];
            if (reqs.length === 0) {
                listSyaratDiv.innerHTML = '<p class="text-[10px] text-slate-400 italic">Tidak ada persyaratan berkas khusus.</p>';
            } else {
                let groupedReqs = {};
                reqs.forEach(function (req) {
                    let cleanName = String(req.name || "");
                    let keperluan = "Wajib";
                    let match = cleanName.match(/^\[(.*?)\]\s*(.*)$/);
                    if (match) {
                        keperluan = match[1];
                        cleanName = match[2];
                    }
                    if (!groupedReqs[keperluan]) groupedReqs[keperluan] = [];
                    if (!groupedReqs[keperluan].includes(cleanName)) {
                        groupedReqs[keperluan].push(cleanName);
                    }
                });

                let htmlBuffer = "";

                if (groupedReqs["Wajib"]) {
                    htmlBuffer += '<div class="mb-2">';
                    htmlBuffer += '<p class="font-bold text-slate-800 text-[10px] mb-1">Dokumen Wajib:</p>';
                    groupedReqs["Wajib"].forEach(function (item, index) {
                        htmlBuffer += '<div class="flex items-center space-x-1.5 py-1 pl-1"><span class="text-emerald-600 font-bold text-[9px] bg-emerald-50 w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 border border-emerald-100">' + (index + 1) + '</span> <span class="text-[10px] text-slate-600 font-semibold leading-snug flex-1">' + escapeHtml(item) + '</span></div>';
                    });
                    htmlBuffer += '</div>';
                }

                let hasTambahan = Object.keys(groupedReqs).some(k => k !== "Wajib");
                if (hasTambahan) {
                    htmlBuffer += '<p class="font-bold text-slate-800 text-[10px] mb-1 mt-2 border-t border-emerald-200 pt-1">Dokumen Tambahan:</p>';
                }

                Object.keys(groupedReqs).forEach(function (kep) {
                    if (kep !== "Wajib") {
                        htmlBuffer += '<div class="mb-2 border-l-2 border-emerald-300 pl-2 ml-1 wrapper-syarat-tambahan" data-syarat-keperluan="' + escapeHtml(kep) + '">';
                        htmlBuffer += '<p class="font-extrabold text-emerald-700 text-[10px] bg-emerald-50 px-2 py-0.5 rounded inline-block mb-1 border border-emerald-100">Jika Keperluan: ' + escapeHtml(kep) + '</p>';
                        groupedReqs[kep].forEach(function (item, index) {
                            htmlBuffer += '<div class="flex items-center space-x-1.5 py-1 pl-1"><span class="text-emerald-600 font-bold text-[9px] bg-emerald-50 w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 border border-emerald-100">' + (index + 1) + '</span> <span class="text-[10px] text-slate-600 font-semibold leading-snug flex-1">' + escapeHtml(item) + '</span></div>';
                        });
                        htmlBuffer += '</div>';
                    }
                });
                listSyaratDiv.innerHTML = htmlBuffer;
            }

            renderDynamicCustomQuestions(found.fields || []);
            renderDynamicUploadSlots(found.requirements || []);

            if(window.toggleWizardStep1State) window.toggleWizardStep1State();
            loadWargaDraft(found.nama);
            switchWizardSection(1);

            document.getElementById('btn-back-warga-nav').classList.remove('hidden');
            document.getElementById('wrapper-select-layanan').classList.add('hidden');

            let formWrapper = document.getElementById('wrapper-formulir-pengajuan');
            formWrapper.classList.remove('hidden');
            formWrapper.classList.remove('animate-fade-in');
            formWrapper.classList.add('animate-fade-in');

            document.getElementById('wizard-section-success').classList.add('hidden');
        }

export function renderDynamicCustomQuestions(fields) {
            let qContainer = document.getElementById('container-pertanyaan-tambahan');
            qContainer.innerHTML = "";

            let keperluanOptionsStr = selectedLayananGlobal.judulSectionIsian || "";
            let keperluanContainer = document.getElementById('container-keperluan-surat');
            if (keperluanContainer) {
                keperluanContainer.innerHTML = "";
                if (keperluanOptionsStr) {
                    let optionsList = keperluanOptionsStr.split(',').map(function(opt) { return opt.trim(); }).filter(function(opt) { return opt !== ""; });
                    
                    if (optionsList.length === 1) {
                        keperluanContainer.innerHTML = '<input type="hidden" id="warga-keperluan-surat" value="' + optionsList[0] + '">';
                        let btnNext1 = document.getElementById('btn-next-step-1');
                        if (btnNext1) {
                            btnNext1.disabled = false;
                            btnNext1.className = "px-5 py-2.5 rounded-xl bg-narmadaGreen hover:bg-narmadaGreen-dark text-white font-bold text-xs shadow-lg transition-all flex items-center gap-1.5 cursor-pointer tap-squish";
                        }
                    } else if (optionsList.length > 1) {
                        let selectHtml = '<div class="space-y-1">' +
                            '<label class="block text-xs font-semibold text-slate-600 mb-1.5">Silakan Pilih Keperluan Anda *</label>' +
                            '<select id="warga-keperluan-surat" onchange="if(window.toggleWizardStep1State) window.toggleWizardStep1State(); window.runLiveConditionalLogicEvaluationForCitizen();" required class="w-full px-3 py-2.5 rounded-xl custom-input text-sm font-medium shadow-sm bg-white">' +
                            '<option value="">-- Pilih Keperluan Surat --</option>';

                        optionsList.forEach(function (opt) {
                            selectHtml += '<option value="' + opt + '">' + opt + '</option>';
                        });

                        selectHtml += '</select></div>';
                        keperluanContainer.innerHTML = selectHtml;
                        
                        let btnNext1 = document.getElementById('btn-next-step-1');
                        if (btnNext1) {
                            btnNext1.disabled = true;
                            btnNext1.className = "px-5 py-2.5 rounded-xl bg-slate-300 text-slate-500 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-not-allowed tap-squish";
                        }
                    }
                } else {
                    let btnNext1 = document.getElementById('btn-next-step-1');
                    if (btnNext1) {
                        btnNext1.disabled = false;
                        btnNext1.className = "px-5 py-2.5 rounded-xl bg-narmadaGreen hover:bg-narmadaGreen-dark text-white font-bold text-xs shadow-lg transition-all flex items-center gap-1.5 cursor-pointer tap-squish";
                    }
                }
            }

            if (fields && fields.length > 0) {
                // Group fields by halaman (page number) from admin metadata
                let pageGroups = {};
                fields.forEach(function (f) {
                    let actualName = String(f.name || "");
                    let typeMatch = actualName.match(/(.*)\s*\|\|(number|date)\|\|$/);
                    if (typeMatch) actualName = typeMatch[1].trim();
                    let meta = parseQuestionMetadata(actualName);
                    let pageNum = meta.halaman || 1;
                    if (!pageGroups[pageNum]) pageGroups[pageNum] = [];
                    pageGroups[pageNum].push(f);
                });

                let sortedPageNums = Object.keys(pageGroups).map(Number).sort(function(a, b) { return a - b; });
                window.step3TotalPages = sortedPageNums.length;
                window.step3CurrentPage = 1;

                sortedPageNums.forEach(function (pageNum, idx) {
                    let pageIndex = idx + 1;
                    let isHidden = pageIndex > 1;
                    let fieldsInPage = pageGroups[pageNum];

                    // Sort hierarchically so children appear directly under their parents
                    let orderedFields = [];
                    let roots = fieldsInPage.filter(f => !f.conditionField);
                    function traverse(item) {
                        orderedFields.push(item);
                        let children = fieldsInPage.filter(child => child.conditionField === item.id);
                        children.forEach(traverse);
                    }
                    roots.forEach(traverse);
                    fieldsInPage.forEach(f => { if (orderedFields.indexOf(f) === -1) orderedFields.push(f); });
                    fieldsInPage = orderedFields;

                    let pageHtml = '<div class="step3-page' + (isHidden ? ' hidden' : '') + '" data-step3-page="' + pageIndex + '">';

                    let lastJudul = "";

                    fieldsInPage.forEach(function (f) {
                        let displayType = f.type;
                        let actualName = f.name;
                        let typeMatch = actualName.match(/(.*)\s*\|\|(number|date|currency)\|\|$/);
                        if (typeMatch) {
                            displayType = typeMatch[2];
                            actualName = typeMatch[1].trim();
                        }

                        let qInputId = "dyn_q_" + f.id;
                        let meta = parseQuestionMetadata(actualName);
                        
                        let condAttrs = "";
                        if (f.conditionField && f.conditionValue) {
                            condAttrs = ' data-bind-condition-field="' + f.conditionField + '" data-bind-condition-value="' + f.conditionValue + '"';
                        }

                        let hasCondition = (f.conditionField && f.conditionValue);
                        if (displayType === "repeater") {
                            let groupHtml = '<div class="dynamic-question-wrapper mt-3' + (hasCondition ? ' hidden' : '') + '" data-bind-keperluan="' + meta.keperluan + '"' + condAttrs + '>';
                            groupHtml += '<div id="' + qInputId + '_container" class="space-y-3"></div>';
                            let encodedOpts = encodeURIComponent(f.options || "[]");
                            groupHtml += '<button type="button" onclick="addRepeaterGroup(\'' + qInputId + '_container\', \'' + encodedOpts + '\')" class="mt-3 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold shadow-sm transition-all flex items-center gap-1.5"><i class="fa-solid fa-plus"></i> Tambah Jawaban Lain</button>';
                            groupHtml += '</div>';
                            pageHtml += groupHtml;
                            return;
                        }

                        let isRequiredStr = f.required === "ya" ? " *" : ' <span class="text-[9px] text-slate-400 font-semibold">(Opsional)</span>';
                        let requiredAttr = f.required === "ya" ? "required" : "";

                        let groupHtml = '<div class="dynamic-question-wrapper space-y-1.5 mt-3' + (hasCondition ? ' hidden' : '') + '" data-bind-keperluan="' + meta.keperluan + '"' + condAttrs + '>';

                        if (meta.judul && meta.judul !== "-" && meta.judul !== lastJudul) {
                            groupHtml += '<h4 class="text-sm font-semibold text-narmadaGreen border-b border-emerald-100 pb-1.5 mt-3 mb-2"><i class="fa-solid fa-list-check"></i> ' + meta.judul + '</h4>';
                            lastJudul = meta.judul;
                        }

                        groupHtml += '<label class="block text-xs font-semibold text-slate-600">' + escapeHtml(meta.cleanName) + isRequiredStr + '</label>';
                        let safeActualName = actualName.replace(/"/g, '&quot;');
                        groupHtml += generateFieldInputHtml(displayType, safeActualName, requiredAttr, f.options, f.id);
                        groupHtml += '</div>';
                        pageHtml += groupHtml;
                    });

                    pageHtml += '</div>';
                    qContainer.innerHTML += pageHtml;
                });
            } else {
                window.step3TotalPages = 1;
                window.step3CurrentPage = 1;
            }

            updateStep3PaginationUI();
            initDynamicMaps();
            initSearchableDropdowns();
        }

export function generateFieldInputHtml(displayType, actualName, requiredAttr, optionsStr, qId) {
            let inputHtml = "";
            let idAttr = qId ? ' data-field-id="' + qId + '"' : '';
            if (displayType === "dropdown") {
                let optionsList = optionsStr ? optionsStr.split(',') : [];
                if (optionsList.length > 10) {
                    let optionsJson = JSON.stringify(optionsList.map(function(o) { return o.trim(); }));
                    let uniqueId = "sd_" + Math.random().toString(36).substr(2, 9);
                    inputHtml = '<div class="sd-container" id="' + uniqueId + '" data-options=\'' + optionsJson.replace(/'/g, "&#39;") + '\'>' +
                                '<div class="sd-input-wrapper">' +
                                '<i class="fa-solid fa-search"></i>' +
                                '<input type="text" class="sd-input" placeholder="KETIK UNTUK MENCARI..." autocomplete="off">' +
                                '<i class="fa-solid fa-times btn-clear"></i>' +
                                '</div>' +
                                '<div class="sd-dropdown"></div>' +
                                '<input type="hidden" ' + requiredAttr + ' class="dynamic-question-field" data-question="' + actualName + '"' + idAttr + '>' +
                                '</div>';
                } else {
                    inputHtml = '<select ' + requiredAttr + ' class="w-full px-3 py-2.5 rounded-xl custom-input text-sm font-medium shadow-sm bg-white dynamic-question-field uppercase" data-question="' + actualName + '"' + idAttr + '><option value="">-- Pilih Salah Satu --</option>';
                    optionsList.forEach(function (opt) { inputHtml += '<option value="' + opt.trim() + '">' + opt.trim() + '</option>'; });
                    inputHtml += '</select>';
                }
            } else if (displayType === "number") {
                let limitJs = optionsStr ? 'if(this.value.length > ' + optionsStr + ') this.value = this.value.slice(0, ' + optionsStr + ');' : '';
                let onInput = 'oninput="this.value = this.value.replace(/[^0-9]/g, \'\'); ' + limitJs + '"';
                inputHtml = '<input type="text" inputmode="numeric" pattern="[0-9]*" ' + requiredAttr + ' ' + onInput + ' placeholder="KETIK ANGKA" class="w-full px-3 py-2.5 rounded-xl custom-input text-sm font-medium shadow-sm dynamic-question-field uppercase" data-question="' + actualName + '"' + idAttr + '>';
            } else if (displayType === "currency") {
                let onInput = 'oninput="let val = this.value.replace(/[^0-9]/g, \'\'); this.value = val ? parseInt(val, 10).toLocaleString(\'id-ID\') : \'\';"';
                inputHtml = '<div class="relative flex items-center">' +
                            '<span class="absolute left-3 font-bold text-slate-500 text-sm pointer-events-none">Rp</span>' +
                            '<input type="text" inputmode="numeric" ' + requiredAttr + ' ' + onInput + ' placeholder="0" class="w-full pl-9 pr-3 py-2.5 rounded-xl custom-input text-sm font-medium shadow-sm dynamic-question-field" data-question="' + actualName + '"' + idAttr + '>' +
                            '</div>';
            } else if (displayType === "date") {
                inputHtml = '<input type="date" ' + requiredAttr + ' class="w-full px-3 py-2.5 rounded-xl custom-input text-sm font-medium shadow-sm dynamic-question-field uppercase" data-question="' + actualName + '"' + idAttr + '>';
            } else if (displayType === "maps") {
                let uniqueMapId = "map_" + Math.random().toString(36).substr(2, 9);
                let uniqueInputId = "input_" + uniqueMapId;
                let latInputId = "lat_" + uniqueMapId;
                let lngInputId = "lng_" + uniqueMapId;
                inputHtml = '<div class="space-y-2">' +
                            '<div id="' + uniqueMapId + '" class="dynamic-map-container w-full h-48 rounded-xl border border-slate-200 shadow-inner z-0" style="z-index: 0;" data-input-id="' + uniqueInputId + '" data-lat-id="' + latInputId + '" data-lng-id="' + lngInputId + '"></div>' +
                            '<button type="button" onclick="getCurrentLocationForMap(\'' + uniqueMapId + '\', \'' + uniqueInputId + '\', \'' + latInputId + '\', \'' + lngInputId + '\')" class="w-full px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm tap-squish"><i class="fa-solid fa-location-crosshairs text-narmadaGreen"></i> Gunakan Lokasi Saya Saat Ini</button>' +
                            '<div class="grid grid-cols-2 gap-2">' +
                            '<div><label class="block text-[10px] font-bold text-slate-600 mb-1">Latitude</label><input type="number" step="any" id="' + latInputId + '" placeholder="Garis Lintang" class="w-full px-3 py-2 rounded-xl custom-input text-sm font-medium shadow-sm"></div>' +
                            '<div><label class="block text-[10px] font-bold text-slate-600 mb-1">Longitude</label><input type="number" step="any" id="' + lngInputId + '" placeholder="Garis Bujur" class="w-full px-3 py-2 rounded-xl custom-input text-sm font-medium shadow-sm"></div>' +
                            '</div>' +
                            '<input type="hidden" id="' + uniqueInputId + '" ' + requiredAttr + ' class="dynamic-question-field" data-question="' + actualName + '"' + idAttr + '>' +
                            '</div>';
            } else {
                inputHtml = '<input type="text" ' + requiredAttr + ' placeholder="Ketik jawaban Anda" oninput="this.value = this.value.toUpperCase();" class="w-full px-3 py-2.5 rounded-xl custom-input text-sm font-medium shadow-sm dynamic-question-field uppercase" data-question="' + actualName + '"' + idAttr + '>';
            }
            return inputHtml;
        }

export function generateRepeaterBlockHtml(encodedSubFields, isRemovable) {
            let subFields = JSON.parse(decodeURIComponent(encodedSubFields));
            let blockHtml = '<div class="repeater-block space-y-3 relative border-t border-dashed border-slate-300 pt-3 mt-3">';
            
            subFields.forEach(function(f) {
                let dType = f.type;
                let aName = f.name;
                let tMatch = aName.match(/(.*)\s*\|\|(number|date|currency)\|\|$/);
                if (tMatch) {
                    dType = tMatch[2];
                    aName = tMatch[1].trim();
                }
                let m = parseQuestionMetadata(aName);
                let reqStr = f.required === "ya" ? " *" : ' <span class="text-[9px] text-slate-400 font-semibold">(Opsional)</span>';
                let reqAttr = f.required === "ya" ? "required" : "";
                
                blockHtml += '<div class="dynamic-question-wrapper space-y-1">';
                blockHtml += '<label class="block text-xs font-semibold text-slate-600">' + escapeHtml(m.cleanName) + reqStr + '</label>';
                blockHtml += generateFieldInputHtml(dType, aName, reqAttr, f.options);
                blockHtml += '</div>';
            });
            
            if (isRemovable) {
                blockHtml += '<button type="button" onclick="this.parentElement.remove()" class="absolute -top-3 right-0 px-2 py-1 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-all shadow-sm text-[10px] flex items-center gap-1"><i class="fa-solid fa-trash"></i> Hapus</button>';
            }
            blockHtml += '</div>';
            return blockHtml;
        }

export function addRepeaterGroup(containerId, encodedSubFields) {
            let container = document.getElementById(containerId);
            if (!container) return;
            let wrapperDiv = document.createElement('div');
            wrapperDiv.className = "animate-fade-in mt-3";
            wrapperDiv.innerHTML = generateRepeaterBlockHtml(encodedSubFields, true);
            container.appendChild(wrapperDiv);
            initSearchableDropdowns();
        }

export function renderDynamicUploadSlots(requirements) {
            let containerUpload = document.getElementById('container-upload-persyaratan');
            containerUpload.innerHTML = "";

            if (requirements && requirements.length > 0) {
                requirements.forEach(function (req) {
                    let cleanName = String(req.name || "");
                    let match = cleanName.match(/^\[(.*?)\]\s*(.*)$/);
                    let boundKeperluan = "Wajib";
                    if (match) {
                        boundKeperluan = match[1];
                        cleanName = match[2];
                    }

                    let slotId = "slot_" + req.id;
                    let slotHtml = '<div id="wrapper-slot-card-' + slotId + '" data-bind-keperluan="' + boundKeperluan + '" class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xl space-y-2.5 flex flex-col justify-between min-h-[140px] wrapper-slot-card">' +
                        '<div>' +
                        '<p class="text-[11px] font-bold text-slate-900 mb-0.5"><i class="fa-solid fa-circle-check text-emerald-600"></i> ' + escapeHtml(cleanName) + ' *</p>' +
                        '<p class="text-[9px] text-slate-400 font-semibold">Maksimal 2MB. Hanya berkas foto/gambar.</p>' +
                        '</div>' +
                        '<div id="preview_box_' + slotId + '" class="preview-box rounded-lg p-2 text-center text-slate-400 flex flex-col items-center justify-center min-h-[60px] text-[9px] font-semibold">' +
                        '<i class="fa-solid fa-image text-sm mb-0.5 block opacity-40"></i> Belum ada berkas foto' +
                        '</div>' +
                        '<div class="flex justify-end">' +
                        '<label class="w-full py-1.5 rounded-lg border border-slate-200 hover:border-emerald-505 text-slate-700 hover:text-narmadaGreen text-[9px] font-bold flex items-center justify-center gap-1 bg-slate-50 transition-all cursor-pointer text-center shadow-inner">' +
                        '<i class="fa-solid fa-images"></i> Pilih Foto Dokumen' +
                        '<input type="file" accept="image/*" class="hidden" onchange="handleFileSelectImageAndCompress(event, \'' + slotId + '\')">' +
                        '</label>' +
                        '</div>' +
                        '</div>';

                    containerUpload.innerHTML += slotHtml;
                });
            }
            runLiveConditionalLogicEvaluationForCitizen();
        }

export function runLiveConditionalLogicEvaluationForCitizen() {
            if (window.evaluateBranchingQuestionsCitizen) window.evaluateBranchingQuestionsCitizen();
            if (!selectedLayananGlobal) return;

            let activeKeperluan = "";
            let elKeperluan = document.getElementById('warga-keperluan-surat');
            if (elKeperluan) activeKeperluan = elKeperluan.value.trim();
            let descEl = document.getElementById('text-desc-layanan-terpilih');
            if (descEl) {
                if (activeKeperluan) {
                    descEl.innerText = 'Keperluan: ' + activeKeperluan;
                } else {
                    descEl.innerText = selectedLayananGlobal.deskripsi || 'Silakan lengkapi formulir pengajuan.';
                }
            }

            let reqWrappers = document.querySelectorAll('.wrapper-syarat-tambahan');
            reqWrappers.forEach(function (el) {
                let boundKeperluan = el.getAttribute('data-syarat-keperluan');
                if (boundKeperluan === "Wajib" || (activeKeperluan !== "" && boundKeperluan === activeKeperluan)) {
                    el.classList.remove('hidden');
                } else {
                    el.classList.add('hidden');
                }
            });

            let qWrappers = document.querySelectorAll('.dynamic-question-wrapper');
            qWrappers.forEach(function (el) {
                if (el.closest('.repeater-block')) return;
                if (el.hasAttribute('data-bind-condition-field')) return; // Visibility dikontrol oleh branching evaluator
                let boundKeperluan = el.getAttribute('data-bind-keperluan');
                if (boundKeperluan === "Wajib" || (activeKeperluan !== "" && boundKeperluan === activeKeperluan)) {
                    el.classList.remove('hidden');
                } else {
                    el.classList.add('hidden');
                }
            });

            let requirements = selectedLayananGlobal.requirements || [];
            requirements.forEach(function (req) {
                let slotId = "slot_" + req.id;
                let el = document.getElementById('wrapper-slot-card-' + slotId);
                if (!el) return;

                let boundKeperluan = el.getAttribute('data-bind-keperluan');
                if (boundKeperluan === "Wajib" || (activeKeperluan !== "" && boundKeperluan === activeKeperluan)) {
                    el.classList.remove('hidden');
                } else {
                    el.classList.add('hidden');
                    delete uploadDataStore[slotId];
                }
            });
        }
        window.runLiveConditionalLogicEvaluationForCitizen = runLiveConditionalLogicEvaluationForCitizen;

window.toggleWizardStep1State = function() {
    let select = document.getElementById('warga-keperluan-surat');
    let checkbox = document.getElementById('warga-syarat-checkbox');
    let btnNext = document.getElementById('btn-next-step-1');
    
    let isKeperluanValid = (!select || select.value !== "");
    let isCheckboxChecked = checkbox && checkbox.checked;

    if (btnNext) {
        if (isKeperluanValid && isCheckboxChecked) {
            btnNext.disabled = false;
            btnNext.className = "px-5 py-2.5 rounded-xl bg-narmadaGreen hover:bg-narmadaGreen-dark text-white font-bold text-xs shadow-lg transition-all flex items-center gap-1.5 cursor-pointer tap-squish";
        } else {
            btnNext.disabled = true;
            btnNext.className = "px-5 py-2.5 rounded-xl bg-slate-300 text-slate-500 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-not-allowed tap-squish";
        }
    }
}

export function toggleWizardStep2State() {
            let isChecked = document.getElementById('warga-syarat-checkbox').checked;
            let btnNext = document.getElementById('btn-next-step-2');
            if (btnNext) {
                if (isChecked) {
                    btnNext.disabled = false;
                    btnNext.className = "px-5 py-2.5 rounded-xl bg-narmadaGreen hover:bg-narmadaGreen-dark text-white font-bold text-xs shadow-lg transition-all flex items-center gap-1.5 cursor-pointer tap-squish";
                } else {
                    btnNext.disabled = true;
                    btnNext.className = "px-5 py-2.5 rounded-xl bg-slate-300 text-slate-500 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-not-allowed tap-squish";
                }
            }
        }

export function switchWizardSection(stepNum) {
            currentWizardStep = stepNum;

            for (let s = 1; s <= 6; s++) {
                let el = document.getElementById('wizard-section-' + s);
                if (el) {
                    el.classList.add('hidden');
                    el.classList.remove('animate-fade-in');
                }
            }
            for (let b = 1; b <= 5; b++) {
                let badge = document.getElementById('step-badge-' + b);
                if (badge) {
                    badge.className = "w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold " +
                        (stepNum >= b ? "step-node-active" : "step-node-inactive");
                }
            }
            let targetStep = document.getElementById('wizard-section-' + stepNum);
            if (targetStep) {
                targetStep.classList.remove('hidden');
                targetStep.classList.add('animate-fade-in');
            }

            // Reset step 3 sub-page to first page when entering step 3
            if (stepNum === 4) {
                window.step3CurrentPage = 1;
                let allPages = document.querySelectorAll('.step3-page');
                allPages.forEach(function(el) {
                    let pIdx = parseInt(el.getAttribute('data-step3-page'));
                    if (pIdx === 1) {
                        el.classList.remove('hidden');
                    } else {
                        el.classList.add('hidden');
                        el.classList.remove('animate-fade-in');
                    }
                });
                updateStep3PaginationUI();
            }

            validateCurrentWizardStep();
        }

export function goToStep1() { switchWizardSection(1); }

export function goToStep2() {
    if (currentWizardStep === 1) {
        let select = document.getElementById('warga-keperluan-surat');
        if (select && select.tagName === 'SELECT' && !select.value) {
            pushToast("Mohon pilih Keperluan Surat!", "error");
            return;
        }
        let checkbox = document.getElementById('warga-syarat-checkbox');
        if (checkbox && !checkbox.checked) {
            pushToast("Mohon centang persetujuan persyaratan!", "error");
            return;
        }
    }
    switchWizardSection(2);
}

export function goToStep3() {
    let nikVal = document.getElementById('warga-nik').value.trim();
    let namaVal = document.getElementById('warga-nama').value.trim();
    let waVal = document.getElementById('warga-wa').value.trim();
    let alamatVal = document.getElementById('warga-alamat').value.trim();

    if (!nikVal || !namaVal || !waVal || !alamatVal) {
        pushToast("Lengkapi seluruh kolom identitas diri & alamat lengkap Anda!", "error");
        return;
    }

    if (nikVal.length !== 16) {
        pushToast("Peringatan: Jumlah NIK Anda wajib tepat 16 digit!", "error");
        document.getElementById('lbl-nik-warning').classList.remove('hidden');
        return;
    } else {
        document.getElementById('lbl-nik-warning').classList.add('hidden');
    }

    switchWizardSection(3);
}

export function goToStep4() {
    let reqWrappers = document.querySelectorAll('.wrapper-syarat-tambahan');
    reqWrappers.forEach(function (el) {
        let boundKeperluan = el.getAttribute('data-syarat-keperluan');
        if (boundKeperluan === "Wajib" || (activeKeperluan !== "" && boundKeperluan === activeKeperluan)) {
            el.classList.remove('hidden');
        } else {
            el.classList.add('hidden');
        }
    });

    let qWrappers = document.querySelectorAll('.dynamic-question-wrapper');
    for (let i = 0; i < qWrappers.length; i++) {
        if (!qWrappers[i].classList.contains('hidden')) {
            let inputField = qWrappers[i].querySelector('.dynamic-question-field');
            if (inputField && inputField.hasAttribute('required') && !inputField.value.trim()) {
                let label = parseQuestionMetadata(inputField.getAttribute('data-question')).cleanName;
                pushToast("Mohon lengkapi isian wajib: " + label, "error");
                return;
            }
        }
    }

    runLiveConditionalLogicEvaluationForCitizen();
    switchWizardSection(4);
}

export function goToStep5() {
    let requirements = selectedLayananGlobal.requirements || [];
    let missingFile = false;

    for (let i = 0; i < requirements.length; i++) {
        let slotId = "slot_" + requirements[i].id;
        let wrapperCard = document.getElementById('wrapper-slot-card-' + slotId);

        if (wrapperCard && !wrapperCard.classList.contains('hidden')) {
            if (!uploadDataStore[slotId]) {
                let cleanName = requirements[i].name;
                let match = cleanName.match(/^\[(.*?)\]\s*(.*)$/);
                if (match) cleanName = match[2];

                pushToast("Harap selesaikan unggahan berkas: " + cleanName, "error");
                missingFile = true;
                break;
            }
        }
    }
    if (missingFile) return;

    let identitasContainer = document.getElementById('review-display-identitas');
    identitasContainer.innerHTML = "";
    let identitasData = [
        { label: "Nama Pemohon", value: document.getElementById('warga-nama').value.trim() },
        { label: "NIK", value: document.getElementById('warga-nik').value.trim() },
        { label: "WhatsApp", value: document.getElementById('warga-wa').value.trim() },
        { label: "Alamat KTP", value: document.getElementById('warga-alamat').value.trim() }
    ];

    identitasData.forEach(function(item) {
        identitasContainer.innerHTML += '<div class="flex items-start border-b border-slate-50 py-1">' +
            '<span class="text-slate-555 text-[10px] text-left break-words" style="flex: 0 0 35%; padding-right: 4px;">' + item.label + '</span>' +
            '<span class="text-slate-400 text-[10px] text-center" style="flex: 0 0 10px;">:</span>' +
            '<span class="font-bold text-slate-800 text-[10px] text-left break-words" style="flex: 1; padding-left: 4px;">' + item.value + '</span></div>';
    });

    let isianContainer = document.getElementById('review-display-isian');
    isianContainer.innerHTML = "";

    let keperl = document.getElementById('warga-keperluan-surat');
    let optionsList = window.currentSelectedLayananObj ? (window.currentSelectedLayananObj.keperluan ? window.currentSelectedLayananObj.keperluan.split(',').map(function(s){return s.trim()}).filter(function(s){return s}) : []) : [];
    let hasIsian = false;

    if (keperl && keperl.value && optionsList.length > 1) {
        hasIsian = true;
        isianContainer.innerHTML += '<div class="flex items-start border-b border-slate-50 py-1">' +
            '<span class="text-slate-555 text-[10px] text-left break-words" style="flex: 0 0 35%; padding-right: 4px;">Keperluan</span>' +
            '<span class="text-slate-400 text-[10px] text-center" style="flex: 0 0 10px;">:</span>' +
            '<span class="font-bold text-slate-800 text-[10px] text-left break-words" style="flex: 1; padding-left: 4px;">' + keperl.value + '</span></div>';
    }

    let qWrappers = document.querySelectorAll('.dynamic-question-wrapper');
    qWrappers.forEach(function (w) {
        if (!w.classList.contains('hidden')) {
            let field = w.querySelector('.dynamic-question-field');
            if (field && field.value.trim() !== "") {
                hasIsian = true;
                let parsed = parseQuestionMetadata(field.getAttribute('data-question'));
                isianContainer.innerHTML += '<div class="flex items-start border-b border-slate-50 py-1">' +
                    '<span class="text-slate-555 text-[10px] text-left break-words" style="flex: 0 0 35%; padding-right: 4px;">' + parsed.cleanName + '</span>' +
                    '<span class="text-slate-400 text-[10px] text-center" style="flex: 0 0 10px;">:</span>' +
                    '<span class="font-bold text-slate-800 text-[10px] text-left break-words" style="flex: 1; padding-left: 4px;">' + field.value.trim() + '</span></div>';
            }
        }
    });

    if (!hasIsian) {
        isianContainer.innerHTML = '<p class="text-[10px] text-slate-400 italic">Tidak ada isian tambahan.</p>';
    }

    let fileContainer = document.getElementById('review-display-file');
    fileContainer.innerHTML = "";
    let fileKeys = Object.keys(uploadDataStore);
    if (fileKeys.length === 0) {
        fileContainer.innerHTML = '<p class="text-[10px] text-slate-400 italic">Tidak ada file yang diunggah.</p>';
    } else {
        fileKeys.forEach(function (k) {
            let info = uploadDataStore[k];
            let rawSize = typeof info.size === 'number' ? info.size : 0;
            let sizeMb = (rawSize / (1024 * 1024)).toFixed(2);
            fileContainer.innerHTML += '<div class="flex items-start border-b border-slate-50 py-1">' +
                '<span class="text-slate-555 text-[10px] text-left break-words" style="flex: 0 0 45%; padding-right: 4px;">' + info.cleanName + '</span>' +
                '<span class="text-slate-400 text-[10px] text-center" style="flex: 0 0 10px;">:</span>' +
                '<span class="font-bold text-narmadaGreen text-[10px] text-left break-words" style="flex: 1; padding-left: 4px;"><i class="fa-solid fa-check-circle mr-1"></i>Tersimpan (' + sizeMb + ' MB)</span></div>';
        });
    }

    switchWizardSection(5);
}

export function backToPrevStepOrMenu() {
            let formWrapper = document.getElementById('wrapper-formulir-pengajuan');
            let isFormHidden = formWrapper.classList.contains('hidden');

            if (isFormHidden) {
                switchView('beranda');
            } else {
                if (currentWizardStep > 1) {
                    askConfirmation("Peringatan Navigasi", "Anda sudah mulai mengisi data. Apakah Anda yakin ingin kembali ke langkah sebelumnya?", function () {
                        executeBackStep();
                    });
                } else {
                    executeBackStep();
                }
            }
        }

export function executeBackStep() {
            let formWrapper = document.getElementById('wrapper-formulir-pengajuan');
            if (currentWizardStep === 1) {
                let selectWrapper = document.getElementById('wrapper-select-layanan');
                selectWrapper.classList.remove('hidden');
                selectWrapper.classList.add('animate-fade-in');
                formWrapper.classList.add('hidden');
            } else if (currentWizardStep === 2) {
                goToStep1();
            } else if (currentWizardStep === 3) {
                goToStep2();
            } else if (currentWizardStep === 4) {
                goToStep3();
            } else if (currentWizardStep === 5) {
                goToStep4();
            } else if (currentWizardStep === 6) {
                goToStep5();
            }
        }

export function addRepeaterRow(containerId, configStr) {
            let container = document.getElementById(containerId + '_container');
            let rowCount = container.children.length + 1;
            let cols = configStr.split(',');

            let rowHtml = '<div class="p-3 bg-white border border-slate-200 rounded-xl relative shadow-sm repeater-row-' + containerId + ' animate-fade-in">';
            rowHtml += '<button type="button" onclick="this.parentElement.remove(); updateRepeaterHidden(\'' + containerId + '\');" class="absolute top-2 right-2 text-red-400 hover:text-red-600 bg-red-50 p-1 rounded-md transition-all tap-squish"><i class="fa-solid fa-xmark text-[10px]"></i></button>';
            rowHtml += '<p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2 border-b border-slate-100 pb-1">Data Ke-' + rowCount + '</p>';
            rowHtml += '<div class="space-y-2">';

            cols.forEach(function (c, i) {
                let match = c.match(/(.*)\[(.*)\]/);
                if (match) {
                    let label = match[1].trim();
                    let opts = match[2].split(';');
                    rowHtml += '<div><label class="block text-[10px] font-bold text-slate-600 mb-1">' + label + '</label>';
                    rowHtml += '<select onchange="updateRepeaterHidden(\'' + containerId + '\')" class="w-full px-2.5 py-2 rounded-lg border border-slate-200 custom-input text-xs bg-white rep-input uppercase" data-label="' + label + '"><option value="">-- Pilih --</option>';
                    opts.forEach(function (o) { rowHtml += '<option value="' + o.trim() + '">' + o.trim() + '</option>'; });
                    rowHtml += '</select></div>';
                } else {
                    let label = c.trim();
                    rowHtml += '<div><label class="block text-[10px] font-bold text-slate-600 mb-1">' + label + '</label>';
                    rowHtml += '<input type="text" oninput="this.value = this.value.toUpperCase(); updateRepeaterHidden(\'' + containerId + '\');" class="w-full px-2.5 py-2 rounded-lg border border-slate-200 custom-input text-xs rep-input uppercase" data-label="' + label + '"></div>';
                }
            });

            rowHtml += '</div></div>';
            container.insertAdjacentHTML('beforeend', rowHtml);
            updateRepeaterHidden(containerId);
        }

export function updateRepeaterHidden(containerId) {
            let rows = document.querySelectorAll('.repeater-row-' + containerId);
            let result = [];
            rows.forEach(function (row, idx) {
                let inputs = row.querySelectorAll('.rep-input');
                let rowData = [];
                inputs.forEach(function (inp) {
                    let val = inp.value.trim() || "-";
                    rowData.push(inp.getAttribute('data-label') + ": " + val);
                });
                result.push("[" + (idx + 1) + "] " + rowData.join(", "));
            });
            let hidden = document.getElementById(containerId);
            if (hidden) {
                hidden.value = result.length > 0 ? result.join("; ") : "";
                let event = new Event('input', { bubbles: true });
                hidden.dispatchEvent(event);
            }
        }

export function handleWargaSubmit() {
            if (!navigator.onLine) {
                pushToast("Sepertinya koneksi internet Anda terputus. Mohon periksa jaringan Anda sebelum mencoba lagi.", "error");
                return;
            }
            askConfirmation("Konfirmasi Pengiriman", "Apakah Anda sudah yakin semua data sudah benar? Pengajuan yang sudah terkirim akan masuk ke antrean admin dan tidak dapat dibatalkan atau diubah sendiri.", function() {
                let lastSubmitTime = localStorage.getItem('lastSubmitTime_Narmada');
            if (lastSubmitTime) {
                let timeDiffMinutes = (Date.now() - parseInt(lastSubmitTime)) / (1000 * 60);
                if (timeDiffMinutes < 15) {
                    let timeLeft = Math.ceil(15 - timeDiffMinutes);
                    pushToast("Anti-Spam: Mohon tunggu " + timeLeft + " menit lagi sebelum mengirim pengajuan baru.", "error");
                    return;
                }
            }

            let nikVal = document.getElementById('warga-nik').value.trim();
            let namaVal = document.getElementById('warga-nama').value.trim();
            let waVal = document.getElementById('warga-wa').value.trim();
            let alamatVal = document.getElementById('warga-alamat').value.trim();

            let requirements = selectedLayananGlobal.requirements || [];
            let berkasFotoPayload = [];

            for (let i = 0; i < requirements.length; i++) {
                let slotId = "slot_" + requirements[i].id;
                let wrapperCard = document.getElementById('wrapper-slot-card-' + slotId);
                if (wrapperCard && !wrapperCard.classList.contains('hidden') && uploadDataStore[slotId]) {
                    let cleanName = requirements[i].name;
                    let match = cleanName.match(/^\[(.*?)\]\s*(.*)$/);
                    if (match) cleanName = match[2];

                    berkasFotoPayload.push({
                        namaSyarat: cleanName,
                        base64: uploadDataStore[slotId]
                    });
                }
            }

            let detailLayananPayload = {};
            let reqKeperluan = document.getElementById('warga-keperluan-surat');
            if (reqKeperluan && reqKeperluan.value) {
                detailLayananPayload["Keperluan Surat"] = reqKeperluan.value.trim();
            }

            let allInputs = document.querySelectorAll('.dynamic-question-wrapper:not(.hidden) .dynamic-question-field');
            let tempPayload = {};
            allInputs.forEach(function(inp) {
                if (inp.value.trim()) {
                    let label = parseQuestionMetadata(inp.getAttribute('data-question')).cleanName;
                    if (!tempPayload[label]) tempPayload[label] = [];
                    tempPayload[label].push(inp.value.trim());
                }
            });
            
            Object.keys(tempPayload).forEach(function(key) {
                detailLayananPayload[key] = [...new Set(tempPayload[key])].join("; ");
            });

            let submitBtn = document.getElementById('btn-submit-warga');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i> <span>Mengirim...</span>';

            let wargaData = {
                nik: nikVal,
                nama: namaVal,
                layanan: selectedLayananGlobal.nama,
                wa: waVal,
                alamat: alamatVal,
                berkasFoto: berkasFotoPayload,
                detailLayanan: detailLayananPayload
            };

            try {
                    google.script.run
                        .withSuccessHandler(function (response) {
                            submitBtn.disabled = false;
                            submitBtn.innerHTML = '<span>Kirim Pengajuan</span> <i class="fa-solid fa-paper-plane text-[10px]"></i>';
                            if (response.success) {
                                localStorage.removeItem('wargaDraft_Narmada');
                                localStorage.setItem('lastSubmitTime_Narmada', Date.now());

                                pushToast(response.message, "success");
                                showWizardSuccessScreen(response.id);
                            } else {
                                pushToast(response.message, "error");
                            }
                        })
                        .withFailureHandler(function (err) {
                            submitBtn.disabled = false;
                            submitBtn.innerHTML = '<span>Kirim Pengajuan</span>';
                            pushToast("Error: " + err.message, "error");
                        })
                        .submitPengajuanDesa(wargaData);
                } catch (e) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<span>Kirim Pengajuan</span>';
                    pushToast("Koneksi gagal: " + e.toString(), "error");
                }

            }, "Batal", "Ya, Kirim Pengajuan");
        }

export function toggleSubmitButtonState() {
            let checkKebenaran = document.getElementById('warga-check-kebenaran') ? document.getElementById('warga-check-kebenaran').checked : false;
            let checkTanggungjawab = document.getElementById('warga-check-tanggungjawab') ? document.getElementById('warga-check-tanggungjawab').checked : false;
            let btnSubmit = document.getElementById('btn-submit-warga');
            if (!btnSubmit) return;
            
            if (checkKebenaran && checkTanggungjawab) {
                btnSubmit.disabled = false;
                btnSubmit.className = "px-5 py-2.5 bg-narmadaGreen hover:bg-narmadaGreen-dark text-white text-xs font-extrabold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 tap-squish";
            } else {
                btnSubmit.disabled = true;
                btnSubmit.className = "px-5 py-2.5 bg-slate-300 text-slate-500 text-xs font-extrabold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-not-allowed tap-squish";
            }
        }

export function showWizardSuccessScreen(regId) {
            document.getElementById('wizard-section-1').classList.add('hidden');
            document.getElementById('wizard-section-2').classList.add('hidden');
            document.getElementById('wizard-section-3').classList.add('hidden');
            document.getElementById('wizard-section-4').classList.add('hidden');
            document.getElementById('wizard-section-5').classList.add('hidden');
            document.getElementById('btn-back-warga-nav').classList.add('hidden');

            document.getElementById('success-reg-id').innerText = regId;

            // Populate Voucher Data
            let nama = document.getElementById('warga-nama').value.trim();
            let nik = document.getElementById('warga-nik').value.trim();
            let layanan = selectedLayananGlobal ? selectedLayananGlobal.nama : "-";
            document.getElementById('voucher-nama').innerText = nama || "-";
            document.getElementById('voucher-nik').innerText = nik ? "NIK: " + nik : "-";
            document.getElementById('voucher-layanan').innerText = layanan;

            // Generate QR Code URL
            let currentUrl = window.location.href.split('?')[0]; // Remove existing query params
            let trackingUrl = currentUrl + "?view=status&id=" + encodeURIComponent(regId);
            document.getElementById('voucher-qr').src = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + encodeURIComponent(trackingUrl);

            // Populate Requirements
            let reqUl = document.getElementById('voucher-requirements');
            reqUl.innerHTML = "";
            if (selectedLayananGlobal && selectedLayananGlobal.requirements) {
                selectedLayananGlobal.requirements.forEach(req => {
                    let cleanName = req.name.replace(/^\[(.*?)\]\s*/, '');
                    let li = document.createElement('li');
                    li.innerText = cleanName;
                    reqUl.appendChild(li);
                });
            }

            let successScreen = document.getElementById('wizard-section-success');
            successScreen.classList.remove('hidden');
            successScreen.classList.remove('slide-in-backward');
            successScreen.classList.add('slide-in-forward');
        }

export function generateVoucherPDF(data) {
    let { regId, nama, nik, layanan, requirements } = data;
    
    // 1. Clone the original voucher element so we don't mess up the UI or deal with hidden parents
    let originalVoucher = document.getElementById('success-voucher');
    let clone = originalVoucher.cloneNode(true);
    clone.id = "temp-voucher-clone-" + Date.now();
    
    // 2. Temporarily place the clone off-screen in the body to allow rendering
    clone.style.position = 'fixed';
    clone.style.top = '-9999px';
    clone.style.left = '-9999px';
    clone.style.transform = "scale(1)";
    clone.style.zIndex = '-999';
    document.body.appendChild(clone);

    // 3. Populate clone data
    clone.querySelector('#success-reg-id').innerText = regId;
    clone.querySelector('#voucher-nama').innerText = nama || "-";
    clone.querySelector('#voucher-nik').innerText = nik ? "NIK: " + nik : "-";
    clone.querySelector('#voucher-layanan').innerText = layanan || "-";

    let currentUrl = window.location.href.split('?')[0]; 
    let trackingUrl = currentUrl + "?view=status&id=" + encodeURIComponent(regId);
    let newQrSrc = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + encodeURIComponent(trackingUrl);
    let qrImg = clone.querySelector('#voucher-qr');
    qrImg.src = newQrSrc;

    let reqUl = clone.querySelector('#voucher-requirements');
    reqUl.innerHTML = "";
    if (requirements && requirements.length > 0) {
        requirements.forEach(req => {
            let reqName = typeof req === 'object' ? req.name : req;
            let cleanName = reqName.replace(/^\[(.*?)\]\s*/, '');
            let li = document.createElement('li');
            li.className = "flex items-start gap-1.5";
            li.innerHTML = '<i class="fa-solid fa-check text-emerald-500 mt-0.5"></i> <span>' + cleanName + '</span>';
            reqUl.appendChild(li);
        });
    } else {
        reqUl.innerHTML = '<li class="text-slate-400 italic col-span-full">Tidak ada persyaratan tambahan</li>';
    }

    // Function to capture and cleanup
    const doCapture = () => {
        html2canvas(clone, {
            scale: 3, 
            useCORS: true,
            backgroundColor: "#ffffff",
            logging: false
        }).then(function(canvas) {
            // Cleanup DOM immediately
            if (clone.parentNode) clone.parentNode.removeChild(clone);
            
            if (window.jspdf && window.jspdf.jsPDF) {
                const jsPDF = window.jspdf.jsPDF;
                
                // Create an 8x10 inch PDF in landscape (10 width, 8 height)
                const doc = new jsPDF({
                    orientation: 'landscape',
                    unit: 'in',
                    format: [10, 8]
                });

                // Calculate proportions to fit within 10x8
                let canvasRatio = canvas.height / canvas.width; // height / width
                let pdfWidth = 10;
                let pdfHeight = 10 * canvasRatio;
                
                // If height exceeds 8 inches, scale by height instead
                if (pdfHeight > 8) {
                    pdfHeight = 8;
                    pdfWidth = 8 / canvasRatio;
                }

                // Center the voucher on the 10x8 page
                let x = (10 - pdfWidth) / 2;
                let y = (8 - pdfHeight) / 2;

                doc.addImage(canvas.toDataURL('image/png', 1.0), 'PNG', x, y, pdfWidth, pdfHeight);
                doc.save('Tiket-Pengajuan-' + regId + '.pdf');
                if(window.pushToast) window.pushToast("Tiket berhasil diunduh!", "success");
            } else {
                let link = document.createElement('a');
                link.download = 'Tiket-Pengajuan-' + regId + '.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            }
        }).catch(function(err) {
            // Cleanup DOM
            if (clone.parentNode) clone.parentNode.removeChild(clone);
            console.error("Error generating tiket:", err);
            if(window.pushToast) window.pushToast("Gagal mengunduh tiket.", "error");
        });
    };

    // Wait slightly for QR image to load before capturing
    if (qrImg.complete) {
        setTimeout(doCapture, 150);
    } else {
        qrImg.onload = () => setTimeout(doCapture, 150);
        qrImg.onerror = () => setTimeout(doCapture, 150);
    }
}
window.generateVoucherPDF = generateVoucherPDF;

export function downloadVoucher() {
            let voucherEl = document.getElementById('success-voucher');
            let regId = document.getElementById('success-reg-id').innerText;
            
            // Just use the new generic function
            generateVoucherPDF({
                regId: regId,
                nama: document.getElementById('voucher-nama').innerText,
                nik: document.getElementById('voucher-nik').innerText.replace('NIK: ', ''),
                layanan: document.getElementById('voucher-layanan').innerText,
                requirements: Array.from(document.getElementById('voucher-requirements').children).map(li => li.innerText)
            });
        }

window.downloadVoucher = downloadVoucher;

export function copyRegIdToClipboard() {
            let regId = document.getElementById('success-reg-id').innerText;
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(regId).then(function () {
                    pushToast("No. Registrasi berhasil disalin ke clipboard!", "success");
                }, function () {
                    fallbackCopyText(regId);
                });
            } else {
                fallbackCopyText(regId);
            }
        }

export function sendWaAfterSubmit() {
            let regId = document.getElementById('success-reg-id').innerText;
            let waAdmin = globalSettings.kontak_wa || dummySetelan.kontak_wa;
            waAdmin = formatWhatsAppToInternational(waAdmin).replace('+', '');
            let namaDesa = globalSettings.nama_desa || dummySetelan.nama_desa;
            
            let msg = "Halo Admin Desa " + namaDesa + ",\nSaya baru saja mengirimkan pengajuan layanan digital dengan Nomor Registrasi: *" + regId + "*.\n\nMohon bantuannya untuk segera diproses. Terima kasih.";
            let url = "https://wa.me/" + waAdmin + "?text=" + encodeURIComponent(msg);
            window.open(url, '_blank');
        }

export function fallbackCopyText(text) {
            let textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                let successful = document.execCommand('copy');
                if (successful) pushToast("No. Registrasi berhasil disalin!", "success");
                else pushToast("Gagal menyalin text.", "error");
            } catch (err) {
                pushToast("Tidak mendukung penyalinan otomatis.", "error");
            }
            document.body.removeChild(textArea);
        }

export function validateCurrentWizardStep() {
            if (currentWizardStep === 2) {
                let btn = document.getElementById('btn-next-step-2');
                if (!btn) return;
                let nik = document.getElementById('warga-nik') ? document.getElementById('warga-nik').value.trim() : "";
                let nama = document.getElementById('warga-nama') ? document.getElementById('warga-nama').value.trim() : "";
                let wa = document.getElementById('warga-wa') ? document.getElementById('warga-wa').value.trim() : "";
                let alamat = document.getElementById('warga-alamat') ? document.getElementById('warga-alamat').value.trim() : "";
                if (nik.length === 16 && nama && wa && alamat) {
                    btn.disabled = false;
                    btn.className = "px-5 py-2.5 bg-narmadaGreen hover:bg-narmadaGreen-dark text-white font-semibold text-sm rounded-xl shadow-sm transition-all flex items-center gap-1.5 tap-squish";
                } else {
                    btn.disabled = true;
                    btn.className = "px-5 py-2.5 bg-slate-300 text-slate-500 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-not-allowed tap-squish";
                }
            } else if (currentWizardStep === 3) {
                // Validate "Lanjut ke Unggah Berkas" button (checks ALL fields across ALL pages)
                let btn = document.getElementById('btn-next-step-3');
                if (btn) {
                    let reqKeperluan = document.getElementById('warga-keperluan-surat');
                    let keperluanOk = !reqKeperluan || reqKeperluan.value.trim();
                    let isAllValid = keperluanOk;
                    if (keperluanOk) {
                        let qWrappers = document.querySelectorAll('.dynamic-question-wrapper');
                        for (let i = 0; i < qWrappers.length; i++) {
                            if (!qWrappers[i].classList.contains('hidden')) {
                                let inputField = qWrappers[i].querySelector('.dynamic-question-field');
                                if (inputField && inputField.hasAttribute('required') && !inputField.value.trim()) {
                                    isAllValid = false;
                                    break;
                                }
                            }
                        }
                    }
                    if (isAllValid) {
                        btn.disabled = false;
                        btn.className = "px-5 py-2.5 bg-narmadaGreen hover:bg-narmadaGreen-dark text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 tap-squish";
                    } else {
                        btn.disabled = true;
                        btn.className = "px-5 py-2.5 bg-slate-300 text-slate-500 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-not-allowed tap-squish";
                    }
                }

                // Also validate current page for "Selanjutnya" button
                let nextPageBtn = document.getElementById('btn-step3-next-page');
                if (nextPageBtn && window.step3TotalPages > 1 && window.step3CurrentPage < window.step3TotalPages) {
                    let isPageValid = validateStep3CurrentPageFields();
                    if (isPageValid) {
                        nextPageBtn.disabled = false;
                        nextPageBtn.className = "px-4 py-2 bg-narmadaGreen hover:bg-narmadaGreen-dark text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 tap-squish";
                    } else {
                        nextPageBtn.disabled = true;
                        nextPageBtn.className = "px-4 py-2 bg-slate-300 text-slate-400 font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-not-allowed tap-squish";
                    }
                }
            } else if (currentWizardStep === 4) {
                let btn = document.getElementById('btn-next-step-4');
                if (!btn) return;
                let requirements = selectedLayananGlobal.requirements || [];
                let missingFile = false;
                for (let i = 0; i < requirements.length; i++) {
                    let slotId = "slot_" + requirements[i].id;
                    let wrapperCard = document.getElementById('wrapper-slot-card-' + slotId);
                    if (wrapperCard && !wrapperCard.classList.contains('hidden')) {
                        if (!uploadDataStore[slotId]) {
                            missingFile = true;
                            break;
                        }
                    }
                }
                if (!missingFile) {
                    btn.disabled = false;
                    btn.className = "px-5 py-2.5 bg-narmadaGreen hover:bg-narmadaGreen-dark text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 tap-squish";
                } else {
                    btn.disabled = true;
                    btn.className = "px-5 py-2.5 bg-slate-300 text-slate-500 text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-not-allowed tap-squish";
                }
            }
        }

export function validateStep3CurrentPageFields() {
            let reqKeperluan = document.getElementById('warga-keperluan-surat');
            if (reqKeperluan && !reqKeperluan.value.trim()) return false;

            let currentPageEl = document.querySelector('.step3-page[data-step3-page="' + window.step3CurrentPage + '"]');
            if (!currentPageEl) return true;

            let qWrappers = currentPageEl.querySelectorAll('.dynamic-question-wrapper');
            for (let i = 0; i < qWrappers.length; i++) {
                if (!qWrappers[i].classList.contains('hidden')) {
                    let inputField = qWrappers[i].querySelector('.dynamic-question-field');
                    if (inputField && inputField.hasAttribute('required') && !inputField.value.trim()) {
                        return false;
                    }
                }
            }
            return true;
        }

export function switchStep3Page(pageIdx) {
            window.step3CurrentPage = pageIdx;

            let allPages = document.querySelectorAll('.step3-page');
            allPages.forEach(function(el) {
                let pIdx = parseInt(el.getAttribute('data-step3-page'));
                if (pIdx === pageIdx) {
                    el.classList.remove('hidden');
                    el.classList.add('animate-fade-in');
                    
                    // Invalidate Leaflet maps inside this page so they render correctly
                    setTimeout(function() {
                        if (window.leafletMaps) {
                            let mapsInPage = el.querySelectorAll('.dynamic-map-container');
                            mapsInPage.forEach(function(mapContainer) {
                                let mId = mapContainer.id;
                                if (window.leafletMaps[mId]) {
                                    window.leafletMaps[mId].map.invalidateSize();
                                }
                            });
                        }
                    }, 300);
                } else {
                    el.classList.add('hidden');
                    el.classList.remove('animate-fade-in');
                }
            });

            updateStep3PaginationUI();
            validateCurrentWizardStep();

            // Scroll to top of form
            let formWrapper = document.getElementById('container-pertanyaan-tambahan');
            if (formWrapper) formWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

export function goToNextStep3Page() {
            // Validate keperluan
            let reqKeperluan = document.getElementById('warga-keperluan-surat');
            if (reqKeperluan && !reqKeperluan.value.trim()) {
                pushToast("Mohon pilih Keperluan Surat terlebih dahulu!", "error");
                return;
            }

            // Validate current page fields
            let currentPageEl = document.querySelector('.step3-page[data-step3-page="' + window.step3CurrentPage + '"]');
            if (currentPageEl) {
                let qWrappers = currentPageEl.querySelectorAll('.dynamic-question-wrapper');
                for (let i = 0; i < qWrappers.length; i++) {
                    if (!qWrappers[i].classList.contains('hidden')) {
                        let inputField = qWrappers[i].querySelector('.dynamic-question-field');
                        if (inputField && inputField.hasAttribute('required') && !inputField.value.trim()) {
                            let label = parseQuestionMetadata(inputField.getAttribute('data-question')).cleanName;
                            pushToast("Mohon lengkapi isian wajib: " + label, "error");
                            return;
                        }
                    }
                }
            }

            if (window.step3CurrentPage < window.step3TotalPages) {
                if (typeof saveWargaDraft === 'function') saveWargaDraft();
                switchStep3Page(window.step3CurrentPage + 1);
            }
        }

export function goToPrevStep3Page() {
            if (window.step3CurrentPage > 1) {
                switchStep3Page(window.step3CurrentPage - 1);
            }
        }

export function updateStep3PaginationUI() {
            let paginationEl = document.getElementById('step3-pagination');
            let wrapperBtnNext = document.getElementById('wrapper-btn-next-step-3');

            if (!paginationEl) return;

            if (!window.step3TotalPages || window.step3TotalPages <= 1) {
                // Single page: hide pagination, show next step button
                paginationEl.classList.add('hidden');
                if (wrapperBtnNext) wrapperBtnNext.classList.remove('hidden');
                return;
            }

            // Multi-page: show pagination
            paginationEl.classList.remove('hidden');

            let prevBtn = document.getElementById('btn-step3-prev-page');
            let nextBtn = document.getElementById('btn-step3-next-page');
            let indicator = document.getElementById('step3-page-indicator');

            if (indicator) indicator.innerText = 'Halaman ' + window.step3CurrentPage + ' dari ' + window.step3TotalPages;

            // Prev button state
            if (prevBtn) {
                if (window.step3CurrentPage <= 1) {
                    prevBtn.disabled = true;
                    prevBtn.className = "px-4 py-2 bg-slate-100 text-slate-400 font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-not-allowed tap-squish";
                } else {
                    prevBtn.disabled = false;
                    prevBtn.className = "px-4 py-2 bg-white border border-slate-200 text-slate-600 font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 hover:bg-slate-50 tap-squish";
                }
            }

            // Next button & "Lanjut ke Unggah Berkas" visibility
            if (window.step3CurrentPage >= window.step3TotalPages) {
                // Last page: hide "Selanjutnya", show "Lanjut ke Unggah Berkas"
                if (nextBtn) nextBtn.classList.add('hidden');
                if (wrapperBtnNext) wrapperBtnNext.classList.remove('hidden');
            } else {
                // Not last page: show "Selanjutnya", hide "Lanjut ke Unggah Berkas"
                if (nextBtn) nextBtn.classList.remove('hidden');
                if (wrapperBtnNext) wrapperBtnNext.classList.add('hidden');
            }
        }

export function initDynamicMaps() {
            let mapsContainers = document.querySelectorAll('.dynamic-map-container');
            if (typeof L === 'undefined') {
                console.warn('Leaflet library is not loaded. Maps will not be available.');
                return;
            }
            if (!window.leafletMaps) window.leafletMaps = {};

            mapsContainers.forEach(container => {
                let mapId = container.id;
                let inputId = container.getAttribute('data-input-id');
                let latId = container.getAttribute('data-lat-id');
                let lngId = container.getAttribute('data-lng-id');
                let inputEl = document.getElementById(inputId);
                let latEl = document.getElementById(latId);
                let lngEl = document.getElementById(lngId);
                
                if (window.leafletMaps[mapId]) return; // Already initialized

                // Default location: Narmada, Lombok Barat
                let defaultLatLng = [-8.5714, 116.2086];
                
                let map = L.map(mapId).setView(defaultLatLng, 13);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; OpenStreetMap contributors'
                }).addTo(map);

                let marker = L.marker(defaultLatLng, {draggable: true}).addTo(map);

                function updateInputsFromMap(lat, lng) {
                    let latStr = lat.toFixed(6);
                    let lngStr = lng.toFixed(6);
                    if(latEl) latEl.value = latStr;
                    if(lngEl) lngEl.value = lngStr;
                    if(inputEl) {
                        inputEl.value = latStr + ', ' + lngStr;
                        inputEl.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                }

                marker.on('dragend', function (e) {
                    let latlng = marker.getLatLng();
                    updateInputsFromMap(latlng.lat, latlng.lng);
                });
                
                map.on('click', function(e) {
                    let latlng = e.latlng;
                    marker.setLatLng(latlng);
                    updateInputsFromMap(latlng.lat, latlng.lng);
                });

                function updateMapFromInputs() {
                    if(!latEl || !lngEl) return;
                    let lat = parseFloat(latEl.value);
                    let lng = parseFloat(lngEl.value);
                    if(!isNaN(lat) && !isNaN(lng)) {
                        let newLatLng = new L.LatLng(lat, lng);
                        marker.setLatLng(newLatLng);
                        map.setView(newLatLng, 15);
                        if(inputEl) {
                            inputEl.value = lat + ', ' + lng;
                            inputEl.dispatchEvent(new Event('input', { bubbles: true }));
                        }
                    }
                }

                if(latEl) latEl.addEventListener('input', updateMapFromInputs);
                if(lngEl) lngEl.addEventListener('input', updateMapFromInputs);

                // Initial populate if draft exists
                if(inputEl && inputEl.value) {
                    let parts = inputEl.value.split(',');
                    if(parts.length === 2) {
                        let plat = parseFloat(parts[0].trim());
                        let plng = parseFloat(parts[1].trim());
                        if(!isNaN(plat) && !isNaN(plng)) {
                            let newLatLng = new L.LatLng(plat, plng);
                            marker.setLatLng(newLatLng);
                            map.setView(newLatLng, 15);
                            if(latEl) latEl.value = plat;
                            if(lngEl) lngEl.value = plng;
                        }
                    }
                }

                // Invalidate size in case it renders inside hidden elements
                setTimeout(() => { map.invalidateSize(); }, 500);

                if (window.ResizeObserver) {
                    let resizeObserver = new ResizeObserver(() => {
                        map.invalidateSize();
                    });
                    resizeObserver.observe(container);
                }

                window.leafletMaps[mapId] = { map: map, marker: marker };
            });
        }

export function getCurrentLocationForMap(mapId, inputId, latId, lngId) {
            if (navigator.geolocation) {
                pushToast("Sedang mencari lokasi Anda...", "info");
                navigator.geolocation.getCurrentPosition(
                    function(position) {
                        let lat = position.coords.latitude;
                        let lng = position.coords.longitude;
                        let inputEl = document.getElementById(inputId);
                        let latEl = latId ? document.getElementById(latId) : null;
                        let lngEl = lngId ? document.getElementById(lngId) : null;
                        
                        let latStr = lat.toFixed(6);
                        let lngStr = lng.toFixed(6);

                        if(latEl) latEl.value = latStr;
                        if(lngEl) lngEl.value = lngStr;

                        if(inputEl) {
                            inputEl.value = latStr + ', ' + lngStr;
                            inputEl.dispatchEvent(new Event('input', { bubbles: true }));
                        }

                        if (window.leafletMaps && window.leafletMaps[mapId]) {
                            let mapObj = window.leafletMaps[mapId];
                            let newLatLng = new L.LatLng(lat, lng);
                            mapObj.map.setView(newLatLng, 16);
                            mapObj.marker.setLatLng(newLatLng);
                        }
                        pushToast("Lokasi berhasil ditemukan!", "success");
                    },
                    function(error) {
                        pushToast("Gagal mendapatkan lokasi. Pastikan GPS aktif dan izin browser diberikan.", "error");
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
                );
            } else {
                pushToast("Browser Anda tidak mendukung fitur lokasi (Geolocation).", "error");
            }
        }

document.addEventListener('input', function(e) {
            if (activeView === 'layanan' && currentWizardStep >= 2 && currentWizardStep <= 4) {
                validateCurrentWizardStep();
            }
        });

document.addEventListener('change', function(e) {
            if (activeView === 'layanan' && currentWizardStep >= 2 && currentWizardStep <= 4) {
                validateCurrentWizardStep();
            }
        });

export function initSearchableDropdowns() {
    let containers = document.querySelectorAll('.sd-container:not(.sd-initialized)');
    containers.forEach(function(container) {
        container.classList.add('sd-initialized');
        let input = container.querySelector('.sd-input');
        let hiddenInput = container.querySelector('input[type="hidden"]');
        let dropdown = container.querySelector('.sd-dropdown');
        let btnClear = container.querySelector('.btn-clear');
        let options = [];
        try {
            options = JSON.parse(container.getAttribute('data-options').replace(/&#39;/g, "'"));
        } catch(e) { console.error("Error parsing options", e); }

        function renderOptions(filterText) {
            dropdown.innerHTML = '';
            let filtered = options.filter(function(opt) {
                return opt.toLowerCase().indexOf(filterText.toLowerCase()) > -1;
            });

            if (filtered.length === 0) {
                dropdown.innerHTML = '<div class="sd-no-results">Tidak ada hasil ditemukan</div>';
                return;
            }

            filtered.forEach(function(opt) {
                let div = document.createElement('div');
                div.className = 'sd-option';
                div.innerText = opt;
                div.addEventListener('click', function() {
                    input.value = opt;
                    hiddenInput.value = opt;
                    dropdown.classList.remove('active');
                    btnClear.style.display = 'block';
                    input.classList.remove('text-slate-400');
                    input.classList.add('text-slate-800');
                    // Trigger input event to update summary
                    hiddenInput.dispatchEvent(new Event('input', { bubbles: true }));
                });
                dropdown.appendChild(div);
            });
        }

        input.addEventListener('focus', function() {
            renderOptions(input.value);
            dropdown.classList.add('active');
        });

        input.addEventListener('input', function() {
            renderOptions(input.value);
            dropdown.classList.add('active');
            hiddenInput.value = ""; // Reset hidden value when typing
            btnClear.style.display = input.value ? 'block' : 'none';
            hiddenInput.dispatchEvent(new Event('input', { bubbles: true }));
        });

        btnClear.addEventListener('click', function() {
            input.value = "";
            hiddenInput.value = "";
            btnClear.style.display = 'none';
            renderOptions("");
            input.focus();
            hiddenInput.dispatchEvent(new Event('input', { bubbles: true }));
        });

        // If hidden input already has value (from loadWargaDraft)
        if (hiddenInput.value) {
            input.value = hiddenInput.value;
            btnClear.style.display = 'block';
        }

        document.addEventListener('click', function(e) {
            if (!container.contains(e.target)) {
                dropdown.classList.remove('active');
                // Force reset to hidden input value if user typed something but didn't click an option
                if (input.value !== hiddenInput.value) {
                    input.value = hiddenInput.value;
                    btnClear.style.display = input.value ? 'block' : 'none';
                }
            }
        });
    });
}

window.evaluateBranchingQuestionsCitizen = function() {
    let allCondWrappers = document.querySelectorAll('.dynamic-question-wrapper[data-bind-condition-field]');
    if (!allCondWrappers.length) return;
    
    let hasChanges = false;
    let maxLoops = 10;
    let loops = 0;

    // Evaluate iteratively until no visibility state changes (handles nested conditions)
    do {
        hasChanges = false;
        allCondWrappers.forEach(function(wrapper) {
            let condField = wrapper.getAttribute('data-bind-condition-field');
            let condValue = wrapper.getAttribute('data-bind-condition-value');
            if (!condField || !condValue) return;

            let parentInput = document.querySelector('.dynamic-question-field[data-field-id="' + condField + '"]');
            let isParentVisible = false;
            let parentValueMatch = false;

            if (parentInput) {
                let parentWrapper = parentInput.closest('.dynamic-question-wrapper');
                isParentVisible = !(parentWrapper && parentWrapper.classList.contains('hidden'));
                parentValueMatch = (parentInput.value.trim() === condValue.trim());
            }

            let shouldBeVisible = isParentVisible && parentValueMatch;
            let currentlyVisible = !wrapper.classList.contains('hidden');

            if (shouldBeVisible !== currentlyVisible) {
                if (shouldBeVisible) {
                    wrapper.classList.remove('hidden');
                    wrapper.classList.add('animate-fade-in');
                } else {
                    wrapper.classList.add('hidden');
                    wrapper.classList.remove('animate-fade-in');
                    // When hiding, clear inner values so nested dependencies also hide
                    let inputs = wrapper.querySelectorAll('.dynamic-question-field');
                    inputs.forEach(function(inp) {
                        if (inp.value !== "") {
                            inp.value = "";
                            inp.dispatchEvent(new Event('input', { bubbles: true })); // trigger recursive evaluation
                        }
                    });
                    
                    let sdInputs = wrapper.querySelectorAll('.sd-input');
                    sdInputs.forEach(function(sdi) { sdi.value = ""; });
                    let sdClears = wrapper.querySelectorAll('.btn-clear');
                    sdClears.forEach(function(sdc) { sdc.style.display = 'none'; });
                }
                hasChanges = true;
            }
        });
        loops++;
    } while (hasChanges && loops < maxLoops);
};

document.addEventListener('DOMContentLoaded', function() {
    document.body.addEventListener('input', function(e) {
        if (e.target && e.target.classList && e.target.classList.contains('dynamic-question-field')) {
            if (window.runLiveConditionalLogicEvaluationForCitizen) window.runLiveConditionalLogicEvaluationForCitizen();
        }
    });
    document.body.addEventListener('change', function(e) {
        if (e.target && e.target.classList && e.target.classList.contains('dynamic-question-field')) {
            if (window.runLiveConditionalLogicEvaluationForCitizen) window.runLiveConditionalLogicEvaluationForCitizen();
        }
    });
});
