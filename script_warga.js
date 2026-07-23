function saveWargaDraft() {
            if (!selectedLayananGlobal) return;
            var draft = {
                layanan: selectedLayananGlobal.nama,
                nik: document.getElementById('warga-nik') ? document.getElementById('warga-nik').value : "",
                nama: document.getElementById('warga-nama') ? document.getElementById('warga-nama').value : "",
                wa: document.getElementById('warga-wa') ? document.getElementById('warga-wa').value : "",
                alamat: document.getElementById('warga-alamat') ? document.getElementById('warga-alamat').value : "",
                keperluan: document.getElementById('warga-keperluan-surat') ? document.getElementById('warga-keperluan-surat').value : "",
                dynamic: {}
            };

            var qFields = document.querySelectorAll('.dynamic-question-field');
            qFields.forEach(function (f) {
                if (f.id) draft.dynamic[f.id] = f.value;
            });
            localStorage.setItem('wargaDraft_Narmada', JSON.stringify(draft));
        }

        function loadWargaDraft(layananNama) {
            var draftStr = localStorage.getItem('wargaDraft_Narmada');
            if (draftStr) {
                try {
                    var draft = JSON.parse(draftStr);
                    if (draft.nik) document.getElementById('warga-nik').value = draft.nik;
                    if (draft.nama) document.getElementById('warga-nama').value = draft.nama;
                    if (draft.wa) document.getElementById('warga-wa').value = draft.wa;
                    if (draft.alamat) document.getElementById('warga-alamat').value = draft.alamat;

                    if (draft.layanan === layananNama) {
                        var kepEl = document.getElementById('warga-keperluan-surat');
                        if (kepEl && draft.keperluan) {
                            kepEl.value = draft.keperluan;
                        }
                        if (draft.dynamic) {
                            Object.keys(draft.dynamic).forEach(function (key) {
                                var el = document.getElementById(key);
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
        function toggleInfoDetail(id) {
            var detailEl = document.getElementById(id);
            var iconEl = document.getElementById(id + "-icon");
            if (detailEl && iconEl) {
                detailEl.classList.toggle('is-open');
                iconEl.classList.toggle('rotate-180');
            }
        }
        function handleMulaiPengajuan() {
            var isAdmin = localStorage.getItem('adminToken_Narmada') !== null;
            if (window.isServiceOpen === false && !isAdmin) {
                pushToast("Maaf, pelayanan saat ini sedang tutup. Silakan kembali pada jam operasional.", "error");
                return;
            }
            if (isAdmin && window.isServiceOpen === false) {
                pushToast("Bypass Akses Admin Aktif (Mode Pengecekan).", "info");
            }
            switchView('layanan');
        }

        function loadLayananDataWarga() {
            var container = document.getElementById('container-list-layanan');
            if (!container) return;
            
            var skeletonHtml = '';
            for (var i = 0; i < 3; i++) {
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

            if (isGoogleEnv) {
                try {
                    google.script.run
                        .withSuccessHandler(function (list) { renderLayananListWarga(list); })
                        .getLayananList();
                } catch (e) {
                    renderLayananListWarga(dummyLayananList);
                }
            } else {
                renderLayananListWarga(dummyLayananList);
            }
        }

        function renderLayananListWarga(list) {
            var container = document.getElementById('container-list-layanan');
            if (!container) return;

            if (!list || list.length === 0) {
                container.innerHTML = "<p class='text-xs text-slate-500 italic p-3 text-center'>Belum ada daftar pelayanan dari admin.</p>";
                return;
            }

            window.loadedLayananList = list;

            var htmlBuffer = "";
            list.forEach(function (row) {
                var keperluanText = (row.judulSectionIsian && row.judulSectionIsian.trim() !== "") 
                    ? row.judulSectionIsian.split(',').join(', ') 
                    : "Layanan Digital Terintegrasi";
                    
                var itemHtml = '<div onclick="openFormPengajuan(\'' + row.nama + '\')" class="light-glass-card p-3.5 md:p-4 rounded-2xl transition-all duration-300 shadow-md hover:shadow-xl cursor-pointer group bg-white border border-slate-100 hover:border-emerald-200 flex items-center justify-between tap-squish">' +
                    '<div class="flex items-center space-x-3.5 flex-1 min-w-0 pr-2">' +
                    '<div class="w-10 h-10 md:w-11 md:h-11 bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 border border-emerald-100/50 group-hover:bg-gradient-to-br group-hover:from-narmadaGreen group-hover:to-narmadaGreen-dark group-hover:text-white transition-all duration-500 shadow-sm">' +
                    '<i class="fa-solid fa-file-signature text-lg md:text-xl drop-shadow-sm group-hover:scale-110 transition-transform"></i>' +
                    '</div>' +
                    '<div class="text-left w-full overflow-hidden">' +
                    '<p class="font-extrabold text-xs md:text-sm text-slate-800 group-hover:text-narmadaGreen transition-colors truncate">' + row.nama + '</p>' +
                    '<p class="text-[10px] md:text-xs text-slate-500 font-medium leading-snug mt-0.5 line-clamp-2" title="' + keperluanText + '">' + keperluanText + '</p>' +
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

        function openFormPengajuan(nama) {
            var list = window.loadedLayananList || dummyLayananList;
            var found = list.find(l => l.nama === nama);
            if (!found) return;

            selectedLayananGlobal = found;
            document.getElementById('text-judul-layanan-terpilih').innerText = found.nama;

            document.getElementById('lbl-judul-section-isian').innerText = "Isian Keperluan Surat & Formulir";
            document.getElementById('lbl-desc-section-isian').innerText = "Pilih keperluan pengurusan surat Anda dan isi formulir tambahan.";

            uploadDataStore = {};
            currentWizardStep = 1;
            document.getElementById('warga-syarat-checkbox').checked = false;

            var listSyaratDiv = document.getElementById('container-desc-syarat-vertikal');
            listSyaratDiv.innerHTML = "";

            var reqs = found.requirements || [];
            if (reqs.length === 0) {
                listSyaratDiv.innerHTML = '<p class="text-[10px] text-slate-400 italic">Tidak ada persyaratan berkas khusus.</p>';
            } else {
                var groupedReqs = {};
                reqs.forEach(function (req) {
                    var cleanName = req.name;
                    var keperluan = "Wajib";
                    var match = cleanName.match(/^\[(.*?)\]\s*(.*)$/);
                    if (match) {
                        keperluan = match[1];
                        cleanName = match[2];
                    }
                    if (!groupedReqs[keperluan]) groupedReqs[keperluan] = [];
                    if (!groupedReqs[keperluan].includes(cleanName)) {
                        groupedReqs[keperluan].push(cleanName);
                    }
                });

                var htmlBuffer = "";

                if (groupedReqs["Wajib"]) {
                    htmlBuffer += '<div class="mb-2">';
                    htmlBuffer += '<p class="font-bold text-slate-800 text-[10px] mb-1">Dokumen Wajib:</p>';
                    groupedReqs["Wajib"].forEach(function (item, index) {
                        htmlBuffer += '<div class="flex items-center space-x-1.5 py-1 pl-1"><span class="text-emerald-600 font-bold text-[9px] bg-emerald-50 w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 border border-emerald-100">' + (index + 1) + '</span> <span class="text-[10px] text-slate-600 font-semibold leading-snug flex-1">' + item + '</span></div>';
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
                        htmlBuffer += '<p class="font-extrabold text-emerald-700 text-[10px] bg-emerald-50 px-2 py-0.5 rounded inline-block mb-1 border border-emerald-100">Jika Keperluan: ' + kep + '</p>';
                        groupedReqs[kep].forEach(function (item, index) {
                            htmlBuffer += '<div class="flex items-center space-x-1.5 py-1 pl-1"><span class="text-emerald-600 font-bold text-[9px] bg-emerald-50 w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 border border-emerald-100">' + (index + 1) + '</span> <span class="text-[10px] text-slate-600 font-semibold leading-snug flex-1">' + item + '</span></div>';
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

            var formWrapper = document.getElementById('wrapper-formulir-pengajuan');
            formWrapper.classList.remove('hidden');
            formWrapper.classList.remove('animate-fade-in');
            formWrapper.classList.add('animate-fade-in');

            document.getElementById('wizard-section-success').classList.add('hidden');
        }

        function renderDynamicCustomQuestions(fields) {
            var qContainer = document.getElementById('container-pertanyaan-tambahan');
            qContainer.innerHTML = "";

            var keperluanOptionsStr = selectedLayananGlobal.judulSectionIsian || "";
            if (keperluanOptionsStr) {
                var optionsList = keperluanOptionsStr.split(',');
                var selectHtml = '<div class="space-y-1">' +
                    '<label class="block text-xs font-semibold text-slate-600 mb-1.5">Keperluan Surat *</label>' +
                    '<select id="warga-keperluan-surat" onchange="runLiveConditionalLogicEvaluationForCitizen()" required class="w-full px-3 py-2.5 rounded-xl custom-input text-sm font-medium shadow-sm bg-white">' +
                    '<option value="">-- Pilih Keperluan Surat --</option>';

                optionsList.forEach(function (opt) {
                    var cleanOpt = opt.trim();
                    if (cleanOpt) {
                        selectHtml += '<option value="' + cleanOpt + '">' + cleanOpt + '</option>';
                    }
                });

                selectHtml += '</select></div>';
                qContainer.innerHTML += selectHtml;
            }

            if (fields && fields.length > 0) {
                fields.forEach(function (f) {
                    var displayType = f.type;


                    var actualName = f.name;
                    var typeMatch = actualName.match(/(.*)\s*\|\|(number|date)\|\|$/);
                    if (typeMatch) {
                        displayType = typeMatch[2];
                        actualName = typeMatch[1].trim();
                    }

                    var qInputId = "dyn_q_" + f.id;
                    var meta = parseQuestionMetadata(actualName);
                    
                    if (displayType === "repeater") {
                        var groupHtml = '<div class="dynamic-question-wrapper mt-3" data-bind-keperluan="' + meta.keperluan + '">';
                        groupHtml += '<div id="' + qInputId + '_container" class="space-y-3"></div>';
                        var encodedOpts = encodeURIComponent(f.options || "[]");
                        groupHtml += '<button type="button" onclick="addRepeaterGroup(\'' + qInputId + '_container\', \'' + encodedOpts + '\')" class="mt-3 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold shadow-sm transition-all flex items-center gap-1.5"><i class="fa-solid fa-plus"></i> Tambah Jawaban Lain</button>';
                        groupHtml += '</div>';
                        qContainer.innerHTML += groupHtml;
                        return;
                    }

                    var isRequiredStr = f.required === "ya" ? " *" : ' <span class="text-[9px] text-slate-400 font-semibold">(Opsional)</span>';
                    var requiredAttr = f.required === "ya" ? "required" : "";

                    var groupHtml = '<div class="dynamic-question-wrapper space-y-1.5 mt-3" data-bind-keperluan="' + meta.keperluan + '">';

                    if (meta.judul) {
                        groupHtml += '<h4 class="text-sm font-semibold text-narmadaGreen border-b border-emerald-100 pb-1.5 mt-3 mb-2"><i class="fa-solid fa-list-check"></i> ' + meta.judul + '</h4>';
                    }

                    groupHtml += '<label class="block text-xs font-semibold text-slate-600">' + meta.cleanName + isRequiredStr + '</label>';
                    groupHtml += generateFieldInputHtml(displayType, actualName, requiredAttr, f.options);
                    groupHtml += '</div>';
                    qContainer.innerHTML += groupHtml;
                });
            }
        }

        function generateFieldInputHtml(displayType, actualName, requiredAttr, optionsStr) {
            var inputHtml = "";
            if (displayType === "dropdown") {
                var optionsList = optionsStr ? optionsStr.split(',') : [];
                inputHtml = '<select ' + requiredAttr + ' class="w-full px-3 py-2.5 rounded-xl custom-input text-sm font-medium shadow-sm bg-white dynamic-question-field uppercase" data-question="' + actualName + '"><option value="">-- Pilih Salah Satu --</option>';
                optionsList.forEach(function (opt) { inputHtml += '<option value="' + opt.trim() + '">' + opt.trim() + '</option>'; });
                inputHtml += '</select>';
            } else if (displayType === "number") {
                var limitAttr = optionsStr ? ' oninput="if(this.value.length > ' + optionsStr + ') this.value = this.value.slice(0, ' + optionsStr + ');"' : '';
                inputHtml = '<input type="number" ' + requiredAttr + limitAttr + ' placeholder="Ketik angka" class="w-full px-3 py-2.5 rounded-xl custom-input text-sm font-medium shadow-sm dynamic-question-field" data-question="' + actualName + '">';
            } else if (displayType === "date") {
                inputHtml = '<input type="date" ' + requiredAttr + ' class="w-full px-3 py-2.5 rounded-xl custom-input text-sm font-medium shadow-sm dynamic-question-field" data-question="' + actualName + '">';
            } else {
                inputHtml = '<input type="text" ' + requiredAttr + ' placeholder="Ketik jawaban Anda" oninput="this.value = this.value.toUpperCase();" class="w-full px-3 py-2.5 rounded-xl custom-input text-sm font-medium shadow-sm dynamic-question-field uppercase" data-question="' + actualName + '">';
            }
            return inputHtml;
        }

        function generateRepeaterBlockHtml(encodedSubFields, isRemovable) {
            var subFields = JSON.parse(decodeURIComponent(encodedSubFields));
            var blockHtml = '<div class="repeater-block space-y-3 relative border-t border-dashed border-slate-300 pt-3 mt-3">';
            
            subFields.forEach(function(f) {
                var dType = f.type;
                var aName = f.name;
                var tMatch = aName.match(/(.*)\s*\|\|(number|date)\|\|$/);
                if (tMatch) {
                    dType = tMatch[2];
                    aName = tMatch[1].trim();
                }
                var m = parseQuestionMetadata(aName);
                var reqStr = f.required === "ya" ? " *" : ' <span class="text-[9px] text-slate-400 font-semibold">(Opsional)</span>';
                var reqAttr = f.required === "ya" ? "required" : "";
                
                blockHtml += '<div class="dynamic-question-wrapper space-y-1">';
                blockHtml += '<label class="block text-xs font-semibold text-slate-600">' + m.cleanName + reqStr + '</label>';
                blockHtml += generateFieldInputHtml(dType, aName, reqAttr, f.options);
                blockHtml += '</div>';
            });
            
            if (isRemovable) {
                blockHtml += '<button type="button" onclick="this.parentElement.remove()" class="absolute -top-3 right-0 px-2 py-1 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-all shadow-sm text-[10px] flex items-center gap-1"><i class="fa-solid fa-trash"></i> Hapus</button>';
            }
            blockHtml += '</div>';
            return blockHtml;
        }

        function addRepeaterGroup(containerId, encodedSubFields) {
            var container = document.getElementById(containerId);
            if (!container) return;
            var wrapperDiv = document.createElement('div');
            wrapperDiv.className = "animate-fade-in mt-3";
            wrapperDiv.innerHTML = generateRepeaterBlockHtml(encodedSubFields, true);
            container.appendChild(wrapperDiv);
        }

        function renderDynamicUploadSlots(requirements) {
            var containerUpload = document.getElementById('container-upload-persyaratan');
            containerUpload.innerHTML = "";

            if (requirements && requirements.length > 0) {
                requirements.forEach(function (req) {
                    var cleanName = req.name;
                    var match = cleanName.match(/^\[(.*?)\]\s*(.*)$/);
                    var boundKeperluan = "Wajib";
                    if (match) {
                        boundKeperluan = match[1];
                        cleanName = match[2];
                    }

                    var slotId = "slot_" + req.id;
                    var slotHtml = '<div id="wrapper-slot-card-' + slotId + '" data-bind-keperluan="' + boundKeperluan + '" class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xl space-y-2.5 flex flex-col justify-between min-h-[140px] wrapper-slot-card">' +
                        '<div>' +
                        '<p class="text-[11px] font-bold text-slate-900 mb-0.5"><i class="fa-solid fa-circle-check text-emerald-600"></i> ' + cleanName + ' *</p>' +
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

        function runLiveConditionalLogicEvaluationForCitizen() {
            if (!selectedLayananGlobal) return;

            var activeKeperluan = "";
            var elKeperluan = document.getElementById('warga-keperluan-surat');
            if (elKeperluan) activeKeperluan = elKeperluan.value.trim();

            var qWrappers = document.querySelectorAll('.dynamic-question-wrapper');
            qWrappers.forEach(function (el) {
                if (el.closest('.repeater-block')) return;
                var boundKeperluan = el.getAttribute('data-bind-keperluan');
                if (boundKeperluan === "Wajib" || (activeKeperluan !== "" && boundKeperluan === activeKeperluan)) {
                    el.classList.remove('hidden');
                } else {
                    el.classList.add('hidden');
                }
            });

            var requirements = selectedLayananGlobal.requirements || [];
            requirements.forEach(function (req) {
                var slotId = "slot_" + req.id;
                var el = document.getElementById('wrapper-slot-card-' + slotId);
                if (!el) return;

                var boundKeperluan = el.getAttribute('data-bind-keperluan');
                if (boundKeperluan === "Wajib" || (activeKeperluan !== "" && boundKeperluan === activeKeperluan)) {
                    el.classList.remove('hidden');
                } else {
                    el.classList.add('hidden');
                    delete uploadDataStore[slotId];
                }
            });
        }

        function toggleWizardStep1State() {
            var isChecked = document.getElementById('warga-syarat-checkbox').checked;
            var btnNext = document.getElementById('btn-next-step-1');
            if (isChecked) {
                btnNext.disabled = false;
                btnNext.className = "px-5 py-2.5 rounded-xl bg-narmadaGreen hover:bg-narmadaGreen-dark text-white font-bold text-xs shadow-lg transition-all flex items-center gap-1.5 cursor-pointer tap-squish";
            } else {
                btnNext.disabled = true;
                btnNext.className = "px-5 py-2.5 rounded-xl bg-slate-300 text-slate-500 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-not-allowed tap-squish";
            }
        }

        function switchWizardSection(stepNum) {
            currentWizardStep = stepNum;

            for (var s = 1; s <= 5; s++) {
                var el = document.getElementById('wizard-section-' + s);
                if (el) {
                    el.classList.add('hidden');
                    el.classList.remove('animate-fade-in');
                }
            }
            for (var b = 1; b <= 5; b++) {
                var badge = document.getElementById('step-badge-' + b);
                if (badge) {
                    badge.className = "w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold " +
                        (stepNum >= b ? "step-node-active" : "step-node-inactive");
                }
            }
            var targetStep = document.getElementById('wizard-section-' + stepNum);
            if (targetStep) {
                targetStep.classList.remove('hidden');
                targetStep.classList.add('animate-fade-in');
            }
        }

        function goToStep1() { switchWizardSection(1); }

        function goToStep2() {
            if (currentWizardStep === 1) {
                var isChecked = document.getElementById('warga-syarat-checkbox').checked;
                if (!isChecked) {
                    pushToast("Centang pernyataan persetujuan kelengkapan dokumen terlebih dahulu!", "error");
                    return;
                }
            }
            switchWizardSection(2);
        }

        function goToStep3() {
            var nikVal = document.getElementById('warga-nik').value.trim();
            var namaVal = document.getElementById('warga-nama').value.trim();
            var waVal = document.getElementById('warga-wa').value.trim();
            var alamatVal = document.getElementById('warga-alamat').value.trim();

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

        function goToStep4() {
            var reqKeperluan = document.getElementById('warga-keperluan-surat');
            if (reqKeperluan && !reqKeperluan.value.trim()) {
                pushToast("Mohon pilih Keperluan Surat!", "error");
                return;
            }

            var qWrappers = document.querySelectorAll('.dynamic-question-wrapper');
            for (var i = 0; i < qWrappers.length; i++) {
                if (!qWrappers[i].classList.contains('hidden')) {
                    var inputField = qWrappers[i].querySelector('.dynamic-question-field');
                    if (inputField && inputField.hasAttribute('required') && !inputField.value.trim()) {
                        var label = parseQuestionMetadata(inputField.getAttribute('data-question')).cleanName;
                        pushToast("Mohon lengkapi isian wajib: " + label, "error");
                        return;
                    }
                }
            }

            runLiveConditionalLogicEvaluationForCitizen();
            switchWizardSection(4);
        }

        function goToStep5() {
            var requirements = selectedLayananGlobal.requirements || [];
            var missingFile = false;

            for (var i = 0; i < requirements.length; i++) {
                var slotId = "slot_" + requirements[i].id;
                var wrapperCard = document.getElementById('wrapper-slot-card-' + slotId);

                if (wrapperCard && !wrapperCard.classList.contains('hidden')) {
                    if (!uploadDataStore[slotId]) {
                        var cleanName = requirements[i].name;
                        var match = cleanName.match(/^\[(.*?)\]\s*(.*)$/);
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

            var isianContainer = document.getElementById('review-display-isian');
            isianContainer.innerHTML = "";

            var keperl = document.getElementById('warga-keperluan-surat');
            if (keperl && keperl.value) {
                isianContainer.innerHTML += '<div class="flex justify-between border-b border-slate-50 py-1"><span class="text-slate-555">Keperluan Surat:</span><span class="font-bold text-slate-800">' + keperl.value + '</span></div>';
            }

            var allDynamicInputs = document.querySelectorAll('.dynamic-question-field');
            var hasIsian = (keperl && keperl.value) ? true : false;

            allDynamicInputs.forEach(function (inp) {
                var wrapper = inp.closest('.dynamic-question-wrapper');
                // Skip if parent wrapper is hidden (unless it's an inner repeater wrapper which relies on outer wrapper visibility)
                if (wrapper && wrapper.classList.contains('hidden') && !wrapper.closest('.repeater-block')) return;
                
                // If it's in a repeater block, check if the outer wrapper is hidden
                if (wrapper && wrapper.closest('.repeater-block')) {
                    var outerWrapper = wrapper.closest('.repeater-block').closest('.dynamic-question-wrapper');
                    if (outerWrapper && outerWrapper.classList.contains('hidden')) return;
                }

                if (inp.value.trim()) {
                    var meta = parseQuestionMetadata(inp.getAttribute('data-question'));
                    isianContainer.innerHTML += '<div class="flex justify-between border-b border-slate-50 py-1">' +
                        '<span class="text-slate-555">' + meta.cleanName + ':</span>' +
                        '<span class="font-bold text-slate-800">' + inp.value.trim() + '</span>' +
                        '</div>';
                    hasIsian = true;
                }
            });

            if (!hasIsian) {
                isianContainer.innerHTML = "<p class='text-slate-400 italic text-[10px]'>Tidak ada isian tambahan.</p>";
            }

            var berkasContainer = document.getElementById('review-display-berkas');
            berkasContainer.innerHTML = "";
            requirements.forEach(function (req) {
                var slotId = "slot_" + req.id;
                var base64 = uploadDataStore[slotId];
                var wrapperCard = document.getElementById('wrapper-slot-card-' + slotId);

                if (wrapperCard && !wrapperCard.classList.contains('hidden') && base64) {
                    var cleanName = req.name;
                    var match = cleanName.match(/^\[(.*?)\]\s*(.*)$/);
                    if (match) cleanName = match[2];

                    berkasContainer.innerHTML += '<div class="border border-slate-101 rounded-xl p-1 bg-slate-50 text-center">' +
                        '<img src="' + base64 + '" class="w-full h-20 object-cover rounded-lg mb-1 shadow-sm">' +
                        '<span class="text-[8px] font-bold text-slate-500 block truncate">' + cleanName + '</span>' +
                        '</div>';
                }
            });

            switchWizardSection(5);
        }

        function backToPrevStepOrMenu() {
            var formWrapper = document.getElementById('wrapper-formulir-pengajuan');
            var isFormHidden = formWrapper.classList.contains('hidden');

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

        function executeBackStep() {
            var formWrapper = document.getElementById('wrapper-formulir-pengajuan');
            if (currentWizardStep === 1) {
                var selectWrapper = document.getElementById('wrapper-select-layanan');
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

        function addRepeaterRow(containerId, configStr) {
            var container = document.getElementById(containerId + '_container');
            var rowCount = container.children.length + 1;
            var cols = configStr.split(',');

            var rowHtml = '<div class="p-3 bg-white border border-slate-200 rounded-xl relative shadow-sm repeater-row-' + containerId + ' animate-fade-in">';
            rowHtml += '<button type="button" onclick="this.parentElement.remove(); updateRepeaterHidden(\'' + containerId + '\');" class="absolute top-2 right-2 text-red-400 hover:text-red-600 bg-red-50 p-1 rounded-md transition-all tap-squish"><i class="fa-solid fa-xmark text-[10px]"></i></button>';
            rowHtml += '<p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2 border-b border-slate-100 pb-1">Data Ke-' + rowCount + '</p>';
            rowHtml += '<div class="space-y-2">';

            cols.forEach(function (c, i) {
                var match = c.match(/(.*)\[(.*)\]/);
                if (match) {
                    var label = match[1].trim();
                    var opts = match[2].split(';');
                    rowHtml += '<div><label class="block text-[10px] font-bold text-slate-600 mb-1">' + label + '</label>';
                    rowHtml += '<select onchange="updateRepeaterHidden(\'' + containerId + '\')" class="w-full px-2.5 py-2 rounded-lg border border-slate-200 custom-input text-xs bg-white rep-input uppercase" data-label="' + label + '"><option value="">-- Pilih --</option>';
                    opts.forEach(function (o) { rowHtml += '<option value="' + o.trim() + '">' + o.trim() + '</option>'; });
                    rowHtml += '</select></div>';
                } else {
                    var label = c.trim();
                    rowHtml += '<div><label class="block text-[10px] font-bold text-slate-600 mb-1">' + label + '</label>';
                    rowHtml += '<input type="text" oninput="this.value = this.value.toUpperCase(); updateRepeaterHidden(\'' + containerId + '\');" class="w-full px-2.5 py-2 rounded-lg border border-slate-200 custom-input text-xs rep-input uppercase" data-label="' + label + '"></div>';
                }
            });

            rowHtml += '</div></div>';
            container.insertAdjacentHTML('beforeend', rowHtml);
            updateRepeaterHidden(containerId);
        }

        function updateRepeaterHidden(containerId) {
            var rows = document.querySelectorAll('.repeater-row-' + containerId);
            var result = [];
            rows.forEach(function (row, idx) {
                var inputs = row.querySelectorAll('.rep-input');
                var rowData = [];
                inputs.forEach(function (inp) {
                    var val = inp.value.trim() || "-";
                    rowData.push(inp.getAttribute('data-label') + ": " + val);
                });
                result.push("[" + (idx + 1) + "] " + rowData.join(", "));
            });
            var hidden = document.getElementById(containerId);
            if (hidden) {
                hidden.value = result.length > 0 ? result.join("; ") : "";
                var event = new Event('input', { bubbles: true });
                hidden.dispatchEvent(event);
            }
        }

        function analyzeImageSharpnessLocal(imgElement, callback) {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            canvas.width = 100;
            canvas.height = 75;
            ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);

            var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            var data = imgData.data;
            var width = imgData.width;
            var height = imgData.height;
            var score = 0;
            var count = 0;

            for (var y = 1; y < height - 1; y += 3) {
                for (var x = 1; x < width - 1; x += 3) {
                    var idx = (y * width + x) * 4;
                    var h = data[idx] - data[idx + 4];
                    var v = data[idx] - data[idx + width * 4];
                    score += (h * h + v * v);
                    count++;
                }
            }
            var avgVariance = Math.sqrt(score / count);
            callback(avgVariance);
        }

        function handleFileSelectImageAndCompress(event, slotId) {
            var file = event.target.files[0];
            if (!file) return;

            pushToast("Membaca & Memproses Gambar...", "info");

            var reader = new FileReader();
            reader.onload = function (e) {
                var img = new Image();
                img.onload = function () {
                    var canvas = document.createElement('canvas');
                    var ctx = canvas.getContext('2d');

                    var maxWidth = 1024;
                    var maxHeight = 768;
                    var width = img.width;
                    var height = img.height;

                    if (width > height) {
                        if (width > maxWidth) {
                            height *= maxWidth / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width *= maxHeight / height;
                            height = maxHeight;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);

                    var compressedBase64 = canvas.toDataURL("image/jpeg", 0.70);

                    analyzeImageSharpnessLocal(img, function (score) {
                        var pBox = document.getElementById("preview_box_" + slotId);
                        if (!pBox) return;

                        if (score < 9.0) {
                            pushToast("Foto terlalu buram. Silakan gunakan kamera stabil dan pencahayaan terang!", "error");
                            pBox.className = "preview-box rounded-lg p-2 text-center text-red-600 border border-red-500 bg-red-50 flex flex-col items-center justify-center min-h-[60px] text-[9px] font-extrabold";
                            pBox.innerHTML = '<i class="fa-solid fa-triangle-exclamation text-base mb-0.5 animate-bounce"></i> File Foto Terlalu Buram!';
                            delete uploadDataStore[slotId];
                        } else {
                            uploadDataStore[slotId] = compressedBase64;
                            pBox.className = "preview-box has-image rounded-lg overflow-hidden relative aspect-[4/3] flex items-center justify-center shadow-xl";
                            pBox.innerHTML = '<img id="img_preview_' + slotId + '" src="' + compressedBase64 + '" class="w-full h-full object-cover">' +
                                '<div class="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[8px] py-0.5 font-bold text-center"><i class="fa-solid fa-circle-check text-emerald-400"></i> Berkas Layak (Sharpness: ' + Math.round(score) + ')</div>';
                            pushToast("Foto berhasil dilampirkan.", "success");
                        }
                    });
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }

        function handleWargaSubmit() {
            if (!navigator.onLine) {
                pushToast("Sepertinya koneksi internet Anda terputus. Mohon periksa jaringan Anda sebelum mencoba lagi.", "error");
                return;
            }
            var lastSubmitTime = localStorage.getItem('lastSubmitTime_Narmada');
            if (lastSubmitTime) {
                var timeDiffMinutes = (Date.now() - parseInt(lastSubmitTime)) / (1000 * 60);
                if (timeDiffMinutes < 15) {
                    var timeLeft = Math.ceil(15 - timeDiffMinutes);
                    pushToast("Anti-Spam: Mohon tunggu " + timeLeft + " menit lagi sebelum mengirim pengajuan baru.", "error");
                    return;
                }
            }

            var nikVal = document.getElementById('warga-nik').value.trim();
            var namaVal = document.getElementById('warga-nama').value.trim();
            var waVal = document.getElementById('warga-wa').value.trim();
            var alamatVal = document.getElementById('warga-alamat').value.trim();

            var requirements = selectedLayananGlobal.requirements || [];
            var berkasFotoPayload = [];

            for (var i = 0; i < requirements.length; i++) {
                var slotId = "slot_" + requirements[i].id;
                var wrapperCard = document.getElementById('wrapper-slot-card-' + slotId);
                if (wrapperCard && !wrapperCard.classList.contains('hidden') && uploadDataStore[slotId]) {
                    var cleanName = requirements[i].name;
                    var match = cleanName.match(/^\[(.*?)\]\s*(.*)$/);
                    if (match) cleanName = match[2];

                    berkasFotoPayload.push({
                        namaSyarat: cleanName,
                        base64: uploadDataStore[slotId]
                    });
                }
            }

            var detailLayananPayload = {};
            var reqKeperluan = document.getElementById('warga-keperluan-surat');
            if (reqKeperluan && reqKeperluan.value) {
                detailLayananPayload["Keperluan Surat"] = reqKeperluan.value.trim();
            }

            var allInputs = document.querySelectorAll('.dynamic-question-wrapper:not(.hidden) .dynamic-question-field');
            var tempPayload = {};
            allInputs.forEach(function(inp) {
                if (inp.value.trim()) {
                    var label = parseQuestionMetadata(inp.getAttribute('data-question')).cleanName;
                    if (!tempPayload[label]) tempPayload[label] = [];
                    tempPayload[label].push(inp.value.trim());
                }
            });
            
            Object.keys(tempPayload).forEach(function(key) {
                detailLayananPayload[key] = tempPayload[key].join("; ");
            });

            var submitBtn = document.getElementById('btn-submit-warga');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i> <span>Mengirim...</span>';

            var wargaData = {
                nik: nikVal,
                nama: namaVal,
                layanan: selectedLayananGlobal.nama,
                wa: waVal,
                alamat: alamatVal,
                berkasFoto: berkasFotoPayload,
                detailLayanan: detailLayananPayload
            };

            if (isGoogleEnv) {
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
            } else {
                setTimeout(function () {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<span>Kirim Pengajuan</span>';
                    var mockId = "REQ-20260701-000" + (dummyPengajuanList.length + 1);
                    dummyPengajuanList.unshift({
                        id: mockId, tanggal: "01/07/2026 15:45:00", nik: wargaData.nik, nama: wargaData.nama,
                        layanan: wargaData.layanan, wa: wargaData.wa, alamat: wargaData.alamat, linkDokumen: "Foto KTP: #, Foto KK: #",
                        status: "Menunggu", catatan: "Menunggu verifikasi berkas digital oleh admin.", detailLayanan: JSON.stringify(wargaData.detailLayanan)
                    });

                    localStorage.removeItem('wargaDraft_Narmada');
                    localStorage.setItem('lastSubmitTime_Narmada', Date.now());

                    showWizardSuccessScreen(mockId);
                }, 1200);
            }
        }

        function showWizardSuccessScreen(regId) {
            document.getElementById('wizard-section-1').classList.add('hidden');
            document.getElementById('wizard-section-2').classList.add('hidden');
            document.getElementById('wizard-section-3').classList.add('hidden');
            document.getElementById('wizard-section-4').classList.add('hidden');
            document.getElementById('wizard-section-5').classList.add('hidden');
            document.getElementById('btn-back-warga-nav').classList.add('hidden');

            document.getElementById('success-reg-id').innerText = regId;

            var successScreen = document.getElementById('wizard-section-success');
            successScreen.classList.remove('hidden');
            successScreen.classList.remove('slide-in-backward');
            successScreen.classList.add('slide-in-forward');
        }

        function copyRegIdToClipboard() {
            var regId = document.getElementById('success-reg-id').innerText;
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

        function sendWaAfterSubmit() {
            var regId = document.getElementById('success-reg-id').innerText;
            var waAdmin = globalSettings.kontak_wa || dummySetelan.kontak_wa;
            waAdmin = formatWhatsAppToInternational(waAdmin).replace('+', '');
            var namaDesa = globalSettings.nama_desa || dummySetelan.nama_desa;
            
            var msg = "Halo Admin Desa " + namaDesa + ",\nSaya baru saja mengirimkan pengajuan layanan digital dengan Nomor Registrasi: *" + regId + "*.\n\nMohon bantuannya untuk segera diproses. Terima kasih.";
            var url = "https://wa.me/" + waAdmin + "?text=" + encodeURIComponent(msg);
            window.open(url, '_blank');
        }

        function fallbackCopyText(text) {
            var textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                var successful = document.execCommand('copy');
                if (successful) pushToast("No. Registrasi berhasil disalin!", "success");
                else pushToast("Gagal menyalin text.", "error");
            } catch (err) {
                pushToast("Tidak mendukung penyalinan otomatis.", "error");
            }
            document.body.removeChild(textArea);
        }

        function runSearchStatus() {
            var key = document.getElementById('search-status-key').value.trim();
            var boxList = document.getElementById('box-list-status');
            var wrapper = document.getElementById('wrapper-hasil-status');
            if (!boxList || !wrapper) return;

            boxList.innerHTML = '<div class="animate-pulse space-y-4"><div class="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm h-32 w-full"></div><div class="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm h-32 w-full"></div></div>';
            wrapper.classList.remove('hidden');

            if (isGoogleEnv) {
                try {
                    google.script.run
                        .withSuccessHandler(function (res) { renderStatusCards(res); })
                        .getPengajuanStatus(key);
                } catch (e) {
                    renderStatusCards([]);
                }
            } else {
                var localKey = key.toLowerCase();
                var localRes = dummyPengajuanList.filter(function (r) {
                    return r.id.toLowerCase().indexOf(localKey) !== -1 || r.nik === localKey;
                });
                setTimeout(function () { renderStatusCards(localRes); }, 500);
            }
        }

        function renderStatusCards(results) {
            var boxList = document.getElementById('box-list-status');
            if (!boxList) return;

            if (results.length === 0) {
                boxList.innerHTML = "<div class='text-center py-4 text-slate-505 font-bold bg-slate-50 border rounded-xl text-xs shadow-inner'>Registrasi tidak ditemukan.</div>";
                return;
            }

            var htmlBuffer = "";
            results.forEach(function (item) {
                var badgeColor = "bg-slate-100 text-slate-700 border-slate-200";
                if (item.status === "Menunggu") badgeColor = "bg-blue-50 text-blue-600 border-blue-200";
                else if (item.status === "Verifikasi") badgeColor = "bg-amber-50 text-amber-600 border-amber-200 font-bold";
                else if (item.status === "Selesai" || item.status === "Pelayanan Selesai") badgeColor = "bg-slate-900 text-emerald-400 border-slate-900";
                else if (item.status === "Perbaikan" || item.status === "Upload Ulang") badgeColor = "bg-red-50 text-red-600 border-red-200 font-bold";

                var cleanWaNum = item.wa.replace('+', '');
                var encodedNote = encodeURIComponent(item.catatan || "");
                var waLink = "https://api.whatsapp.com/send?phone=" + cleanWaNum + "&text=" + encodedNote;

                var linksSplit = item.linkDokumen.split(",").map(function (l) {
                    var p = l.split(":");
                    if (p.length >= 2) {
                        var rawName = p[0].trim();
                        var match = rawName.match(/^\[(.*?)\]\s*(.*)$/);
                        if (match) rawName = match[2];

                        return '<a href="' + p.slice(1).join(":").trim() + '" target="_blank" class="text-blue-600 hover:underline block text-[10px] font-bold"><i class="fa-solid fa-file-image"></i> ' + rawName + '</a>';
                    }
                    return '<span class="text-slate-400 block text-[10px]">' + l + '</span>';
                }).join("");

                var cardHtml = '<div class="bg-white border border-slate-200 p-4 rounded-xl shadow-2xl space-y-2.5 text-xs text-left">' +
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
                    '<div class="col-span-2 border-t border-slate-50 pt-1.5"><span class="text-slate-400 block text-[9px] font-bold uppercase tracking-wide">ISIAN FORMULIR WARGA:</span><span class="font-bold text-slate-800">' + (item.detailLayanan || "-") + '</span></div>' +
                    '</div>' +
                    '<div class="p-2.5 bg-slate-50 border rounded-lg text-[11px] italic text-slate-600 shadow-inner"><strong>Catatan Petugas:</strong> "' + item.catatan + '"</div>';

                if (item.status === "Perbaikan" || item.status === "Upload Ulang") {
                    var matchedLayanan = (window.loadedLayananList || dummyLayananList).find(function (lay) {
                        return lay.nama === item.layanan;
                    });

                    var reqList = matchedLayanan ? (matchedLayanan.requirements || []) : [];

                    if (reqList.length > 0) {
                        cardHtml += '<div class="mt-2 border-t border-red-200 pt-2.5 space-y-2 bg-red-50/50 p-3 rounded-xl border border-red-100 shadow-inner">' +
                            '<p class="text-[10px] font-extrabold text-red-700"><i class="fa-solid fa-circle-exclamation"></i> Unggah Ulang Berkas Yang Diperlukan:</p>' +
                            '<div class="grid grid-cols-1 gap-1.5">';

                        reqList.forEach(function (req) {
                            var cleanName = req.name;
                            var match = cleanName.match(/^\[(.*?)\]\s*(.*)$/);
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

        function runReuploadProcessDirect(event, idPengajuan, labelNamaBerkas) {
            var file = event.target.files[0];
            if (!file) return;

            pushToast("Membaca & Memproses...", "info");

            var reader = new FileReader();
            reader.onload = function (e) {
                var img = new Image();
                img.onload = function () {
                    var canvas = document.createElement('canvas');
                    var ctx = canvas.getContext('2d');
                    canvas.width = 1024;
                    canvas.height = 768;
                    ctx.drawImage(img, 0, 0, 1024, 768);
                    var compressedBase64 = canvas.toDataURL("image/jpeg", 0.70);

                    if (isGoogleEnv) {
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
                                .processReuploadBerkas(idPengajuan, labelNamaBerkas, compressedBase64);
                        } catch (err) { }
                    } else {
                        setTimeout(function () {
                            var findIdx = dummyPengajuanList.findIndex(function (r) { return r.id === idPengajuan; });
                            if (findIdx !== -1) {
                                dummyPengajuanList[findIdx].status = "Menunggu";
                                dummyPengajuanList[findIdx].catatan = "Berkas '" + labelNamaBerkas + "' sudah diupload ulang. Segera segarkan dashboard.";
                            }
                            pushToast("SIMULASI: Berkas '" + labelNamaBerkas + "' diperbarui.", "success");
                            runSearchStatus();
                        }, 1000);
                    }
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
