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
                        toggleWizardStep1State();
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
                let keperluanText = (row.judulSectionIsian && row.judulSectionIsian.trim() !== "") 
                    ? row.judulSectionIsian.split(',').join(', ') 
                    : "Layanan Digital Terintegrasi";
                    
                let itemHtml = '<div onclick="openFormPengajuan(\'' + row.nama + '\')" class="light-glass-card p-3.5 md:p-4 rounded-2xl transition-all duration-300 shadow-md hover:shadow-xl cursor-pointer group bg-white border border-slate-100 hover:border-emerald-200 flex items-center justify-between tap-squish">' +
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
                    let cleanName = req.name;
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
                        htmlBuffer += '<div class="mb-2 border-l-2 border-emerald-300 pl-2 ml-1">';
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

            toggleWizardStep1State();
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
            if (keperluanOptionsStr) {
                let optionsList = keperluanOptionsStr.split(',').map(function(opt) { return opt.trim(); }).filter(function(opt) { return opt !== ""; });
                
                if (optionsList.length === 1) {
                    qContainer.innerHTML += '<input type="hidden" id="warga-keperluan-surat" value="' + optionsList[0] + '">';
                } else if (optionsList.length > 1) {
                    let selectHtml = '<div class="space-y-1">' +
                        '<label class="block text-xs font-semibold text-slate-600 mb-1.5">Keperluan Surat *</label>' +
                        '<select id="warga-keperluan-surat" onchange="runLiveConditionalLogicEvaluationForCitizen()" required class="w-full px-3 py-2.5 rounded-xl custom-input text-sm font-medium shadow-sm bg-white">' +
                        '<option value="">-- Pilih Keperluan Surat --</option>';

                    optionsList.forEach(function (opt) {
                        selectHtml += '<option value="' + opt + '">' + opt + '</option>';
                    });

                    selectHtml += '</select></div>';
                    qContainer.innerHTML += selectHtml;
                }
            }

            if (fields && fields.length > 0) {
                let lastJudul = "";
                fields.forEach(function (f) {
                    let displayType = f.type;


                    let actualName = f.name;
                    let typeMatch = actualName.match(/(.*)\s*\|\|(number|date)\|\|$/);
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

                    if (displayType === "repeater") {
                        let groupHtml = '<div class="dynamic-question-wrapper mt-3" data-bind-keperluan="' + meta.keperluan + '"' + condAttrs + '>';
                        groupHtml += '<div id="' + qInputId + '_container" class="space-y-3"></div>';
                        let encodedOpts = encodeURIComponent(f.options || "[]");
                        groupHtml += '<button type="button" onclick="addRepeaterGroup(\'' + qInputId + '_container\', \'' + encodedOpts + '\')" class="mt-3 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold shadow-sm transition-all flex items-center gap-1.5"><i class="fa-solid fa-plus"></i> Tambah Jawaban Lain</button>';
                        groupHtml += '</div>';
                        qContainer.innerHTML += groupHtml;
                        return;
                    }

                    let isRequiredStr = f.required === "ya" ? " *" : ' <span class="text-[9px] text-slate-400 font-semibold">(Opsional)</span>';
                    let requiredAttr = f.required === "ya" ? "required" : "";

                    let groupHtml = '<div class="dynamic-question-wrapper space-y-1.5 mt-3" data-bind-keperluan="' + meta.keperluan + '"' + condAttrs + '>';

                    if (meta.judul && meta.judul !== "-" && meta.judul !== lastJudul) {
                        groupHtml += '<h4 class="text-sm font-semibold text-narmadaGreen border-b border-emerald-100 pb-1.5 mt-3 mb-2"><i class="fa-solid fa-list-check"></i> ' + meta.judul + '</h4>';
                        lastJudul = meta.judul;
                    }

                    groupHtml += '<label class="block text-xs font-semibold text-slate-600">' + escapeHtml(meta.cleanName) + isRequiredStr + '</label>';
                    groupHtml += generateFieldInputHtml(displayType, actualName, requiredAttr, f.options, f.id);
                    groupHtml += '</div>';
                    qContainer.innerHTML += groupHtml;
                });
            }
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
                let limitAttr = optionsStr ? ' oninput="if(this.value.length > ' + optionsStr + ') this.value = this.value.slice(0, ' + optionsStr + ');"' : '';
                inputHtml = '<input type="number" ' + requiredAttr + limitAttr + ' placeholder="KETIK ANGKA" class="w-full px-3 py-2.5 rounded-xl custom-input text-sm font-medium shadow-sm dynamic-question-field uppercase" data-question="' + actualName + '"' + idAttr + '>';
            } else if (displayType === "date") {
                inputHtml = '<input type="date" ' + requiredAttr + ' class="w-full px-3 py-2.5 rounded-xl custom-input text-sm font-medium shadow-sm dynamic-question-field uppercase" data-question="' + actualName + '"' + idAttr + '>';
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
                let tMatch = aName.match(/(.*)\s*\|\|(number|date)\|\|$/);
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
                    let cleanName = req.name;
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
            if (!selectedLayananGlobal) return;

            let activeKeperluan = "";
            let elKeperluan = document.getElementById('warga-keperluan-surat');
            if (elKeperluan) activeKeperluan = elKeperluan.value.trim();

            let qWrappers = document.querySelectorAll('.dynamic-question-wrapper');
            qWrappers.forEach(function (el) {
                if (el.closest('.repeater-block')) return;
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

export function toggleWizardStep1State() {
            let isChecked = document.getElementById('warga-syarat-checkbox').checked;
            let btnNext = document.getElementById('btn-next-step-1');
            if (isChecked) {
                btnNext.disabled = false;
                btnNext.className = "px-5 py-2.5 rounded-xl bg-narmadaGreen hover:bg-narmadaGreen-dark text-white font-bold text-xs shadow-lg transition-all flex items-center gap-1.5 cursor-pointer tap-squish";
            } else {
                btnNext.disabled = true;
                btnNext.className = "px-5 py-2.5 rounded-xl bg-slate-300 text-slate-500 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-not-allowed tap-squish";
            }
        }

export function switchWizardSection(stepNum) {
            currentWizardStep = stepNum;

            for (let s = 1; s <= 5; s++) {
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
            validateCurrentWizardStep();
        }

export function goToStep1() { switchWizardSection(1); }

export function goToStep2() {
            if (currentWizardStep === 1) {
                let isChecked = document.getElementById('warga-syarat-checkbox').checked;
                if (!isChecked) {
                    pushToast("Centang pernyataan persetujuan kelengkapan dokumen terlebih dahulu!", "error");
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
            let reqKeperluan = document.getElementById('warga-keperluan-surat');
            if (reqKeperluan && !reqKeperluan.value.trim()) {
                pushToast("Mohon pilih Keperluan Surat!", "error");
                return;
            }

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

            document.getElementById('review-display-nama').innerText = document.getElementById('warga-nama').value.trim();
            document.getElementById('review-display-nik').innerText = "NIK: " + document.getElementById('warga-nik').value.trim();
            document.getElementById('review-display-wa').innerText = "WhatsApp: " + document.getElementById('warga-wa').value.trim();
            document.getElementById('review-display-alamat').innerText = "Alamat KTP: " + document.getElementById('warga-alamat').value.trim();

            let isianContainer = document.getElementById('review-display-isian');
            isianContainer.innerHTML = "";

            let keperl = document.getElementById('warga-keperluan-surat');
            let optionsList = window.currentSelectedLayananObj ? (window.currentSelectedLayananObj.keperluan ? window.currentSelectedLayananObj.keperluan.split(',').map(function(s){return s.trim()}).filter(function(s){return s}) : []) : [];
            let hasIsian = false;

            if (keperl && keperl.value && optionsList.length > 1) {
                isianContainer.innerHTML += '<div class="grid grid-cols-[1fr_10px_1fr] gap-2 border-b border-slate-50 py-1">' +
                    '<span class="text-slate-555 text-[10px] text-left break-words">Keperluan Surat</span>' +
                    '<span class="text-slate-400 text-[10px] text-center">:</span>' +
                    '<span class="font-bold text-slate-800 text-[10px] text-left break-words">' + keperl.value + '</span></div>';
                hasIsian = true;
            }

            let allDynamicInputs = document.querySelectorAll('.dynamic-question-field');

            allDynamicInputs.forEach(function (inp) {
                let wrapper = inp.closest('.dynamic-question-wrapper');
                // Skip if parent wrapper is hidden (unless it's an inner repeater wrapper which relies on outer wrapper visibility)
                if (wrapper && wrapper.classList.contains('hidden') && !wrapper.closest('.repeater-block')) return;
                
                // If it's in a repeater block, check if the outer wrapper is hidden
                if (wrapper && wrapper.closest('.repeater-block')) {
                    let outerWrapper = wrapper.closest('.repeater-block').closest('.dynamic-question-wrapper');
                    if (outerWrapper && outerWrapper.classList.contains('hidden')) return;
                }

                if (inp.value.trim()) {
                    let meta = parseQuestionMetadata(inp.getAttribute('data-question'));
                    let displayValue = inp.value.trim();
                    if (inp.type === 'date') {
                        let parts = displayValue.split('-');
                        if (parts.length === 3) displayValue = parts[2] + '/' + parts[1] + '/' + parts[0];
                    }
                    isianContainer.innerHTML += '<div class="grid grid-cols-[1fr_10px_1fr] gap-2 border-b border-slate-50 py-1">' +
                        '<span class="text-slate-555 text-[10px] text-left break-words">' + meta.cleanName + '</span>' +
                        '<span class="text-slate-400 text-[10px] text-center">:</span>' +
                        '<span class="font-bold text-slate-800 text-[10px] text-left break-words">' + displayValue + '</span>' +
                        '</div>';
                    hasIsian = true;
                }
            });

            if (!hasIsian) {
                isianContainer.innerHTML = "<p class='text-slate-400 italic text-[10px]'>Tidak ada isian tambahan.</p>";
            }

            let berkasContainer = document.getElementById('review-display-berkas');
            berkasContainer.innerHTML = "";
            requirements.forEach(function (req) {
                let slotId = "slot_" + req.id;
                let base64 = uploadDataStore[slotId];
                let wrapperCard = document.getElementById('wrapper-slot-card-' + slotId);

                if (wrapperCard && !wrapperCard.classList.contains('hidden') && base64) {
                    let cleanName = req.name;
                    let match = cleanName.match(/^\[(.*?)\]\s*(.*)$/);
                    if (match) cleanName = match[2];

                    berkasContainer.innerHTML += '<div class="border border-slate-101 rounded-xl p-1 bg-slate-50 text-center">' +
                        '<img src="' + base64 + '" class="w-full h-auto rounded-lg mb-1 shadow-sm">' +
                        '<span class="text-[8px] font-bold text-slate-500 block truncate">' + cleanName + '</span>' +
                        '</div>';
                }
            });

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
                detailLayananPayload[key] = tempPayload[key].join("; ");
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

            let successScreen = document.getElementById('wizard-section-success');
            successScreen.classList.remove('hidden');
            successScreen.classList.remove('slide-in-backward');
            successScreen.classList.add('slide-in-forward');
        }

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
                let btn = document.getElementById('btn-next-step-3');
                if (!btn) return;
                let reqKeperluan = document.getElementById('warga-keperluan-surat');
                if (reqKeperluan && !reqKeperluan.value.trim()) {
                    btn.disabled = true;
                    btn.className = "px-5 py-2.5 bg-slate-300 text-slate-500 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-not-allowed tap-squish";
                    return;
                }
                let isValid = true;
                let qWrappers = document.querySelectorAll('.dynamic-question-wrapper');
                for (let i = 0; i < qWrappers.length; i++) {
                    if (!qWrappers[i].classList.contains('hidden')) {
                        let inputField = qWrappers[i].querySelector('.dynamic-question-field');
                        if (inputField && inputField.hasAttribute('required') && !inputField.value.trim()) {
                            isValid = false;
                            break;
                        }
                    }
                }
                if (isValid) {
                    btn.disabled = false;
                    btn.className = "px-5 py-2.5 bg-narmadaGreen hover:bg-narmadaGreen-dark text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 tap-squish";
                } else {
                    btn.disabled = true;
                    btn.className = "px-5 py-2.5 bg-slate-300 text-slate-500 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-not-allowed tap-squish";
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

window.runLiveConditionalLogicEvaluationForCitizen = function() {
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
