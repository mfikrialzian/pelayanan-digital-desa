export function openLayananEditor(id) {
            document.getElementById('subview-admin-daftar-layanan').classList.add('hidden');
            document.getElementById('subview-admin-layanan').classList.remove('hidden');
            if(id === '__NEW__') {
                document.getElementById('builder-select-layanan').value = '[+] TAMBAH LAYANAN BARU';
            } else {
                document.getElementById('builder-select-layanan').value = id;
            }
            handleBuilderLayananLoad();
        }

export function closeLayananEditor() {
            document.getElementById('subview-admin-layanan').classList.add('hidden');
            document.getElementById('subview-admin-daftar-layanan').classList.remove('hidden');
        }

export function initStep2RequirementsBuilder() {
            let selKeperluan = document.getElementById('builder-req-keperluan');
            selKeperluan.innerHTML = '';
            let mainSelect = document.getElementById('builder-keperluan-select');
            let hasOptions = false;

            for (let i = 0; i < mainSelect.options.length; i++) {
                let val = mainSelect.options[i].value;
                if (val && val !== "__ADD_NEW__") {
                    selKeperluan.innerHTML += '<option value="' + val + '">' + val + '</option>';
                    hasOptions = true;
                }
            }

            if (!hasOptions) {
                selKeperluan.innerHTML = '<option value="Wajib">Wajib (Berlaku untuk Semua Keperluan)</option>';
            } else {
                let o = document.createElement('option');
                o.value = "Wajib";
                o.text = "Wajib (Berlaku untuk Semua Keperluan)";
                selKeperluan.add(o, selKeperluan.options[0]);
            }

            // Persyaratan sekarang menggunakan input teks dinamis dengan datalist
            let reqInput = document.getElementById('builder-req-input');
            if (reqInput) reqInput.value = '';

            renderRequirementsMappingList();
        }

export function initStep3QuestionsBuilder() {
            let selKeperluan = document.getElementById('builder-q-keperluan');
            let repKeperluan = document.getElementById('builder-repeater-keperluan');
            selKeperluan.innerHTML = '<option value="Wajib">Wajib (Berlaku Semua Keperluan)</option>';
            if (repKeperluan) repKeperluan.innerHTML = '<option value="Wajib">Wajib (Berlaku Semua Keperluan)</option>';
            let mainSelect = document.getElementById('builder-keperluan-select');

            for (let i = 0; i < mainSelect.options.length; i++) {
                let val = mainSelect.options[i].value;
                if (val && val !== "__ADD_NEW__") {
                    selKeperluan.innerHTML += '<option value="' + val + '">' + val + '</option>';
                    if (repKeperluan) repKeperluan.innerHTML += '<option value="' + val + '">' + val + '</option>';
                }
            }
            populateBuilderRepeaterSelect();
        }

export function addRequirementToKeperluan() {
            let keperluan = document.getElementById('builder-req-keperluan').value;
            let reqInput = document.getElementById('builder-req-input');
            let reqName = reqInput.value.trim();

            if (!reqName) {
                pushToast("Ketik atau pilih nama persyaratan!", "error");
                return;
            }

            if (!builderReqMap[keperluan]) {
                builderReqMap[keperluan] = [];
            }

            if (!builderReqMap[keperluan].includes(reqName)) {
                builderReqMap[keperluan].push(reqName);
                renderRequirementsMappingList();
                reqInput.value = '';
                pushToast("Persyaratan ditambahkan ke '" + keperluan + "'", "success");
            } else {
                pushToast("Persyaratan ini sudah ada di keperluan tersebut!", "error");
            }
        }

export function removeRequirementFromKeperluan(keperluan, index) {
            if (builderReqMap[keperluan]) {
                builderReqMap[keperluan].splice(index, 1);
                if (builderReqMap[keperluan].length === 0) {
                    delete builderReqMap[keperluan];
                }
                renderRequirementsMappingList();
            }
        }

export function renderRequirementsMappingList() {
            let container = document.getElementById('builder-req-mapping-list');
            container.innerHTML = "";

            let keys = Object.keys(builderReqMap);
            if (keys.length === 0) {
                container.innerHTML = '<p class="text-[10px] text-slate-400 italic">Belum ada persyaratan yang ditambahkan.</p>';
                return;
            }

            keys.forEach(function (kep) {
                let html = '<div class="bg-white border border-slate-200 rounded-xl p-3 shadow-sm text-left mb-2">' +
                    '<h5 class="text-[10px] font-extrabold text-narmadaGreen mb-2 border-b pb-1 flex items-center gap-1.5"><i class="fa-solid fa-folder-open"></i> Keperluan: ' + kep + '</h5>' +
                    '<div class="space-y-1.5 pl-1">';

                builderReqMap[kep].forEach(function (req, idx) {
                    html += '<div class="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-101 text-[10px] font-semibold text-slate-700">' +
                        '<span><i class="fa-solid fa-check text-emerald-500 mr-1"></i> ' + req + '</span>' +
                        '<button onclick="removeRequirementFromKeperluan(\'' + kep + '\', ' + idx + ')" class="text-red-500 hover:text-red-700 px-1 bg-white border border-slate-200 rounded shadow-sm"><i class="fa-solid fa-xmark"></i></button>' +
                        '</div>';
                });

                html += '</div></div>';
                container.innerHTML += html;
            });
        }

export function loadBuilderLayananList() {
            let dropdownEditor = document.getElementById('builder-select-layanan');
            if (!dropdownEditor) return;
            dropdownEditor.innerHTML = '<option value="[+] TAMBAH LAYANAN BARU">[+] TAMBAH LAYANAN BARU</option>';

            let layHandler = function (list) {
                window.loadedLayananList = list; // Update dari Layanan Aktif
                list.forEach(function (row) {
                    dropdownEditor.innerHTML += '<option value="' + row.nama + '">' + row.nama + '</option>';
                });
                extractSuggestions(list);
            };

            if (isGoogleEnv) {
                try {
                    google.script.run.withSuccessHandler(layHandler).getLayananList();
                } catch (e) {
                    layHandler(dummyLayananList);
                }
            } else {
                layHandler(dummyLayananList);
            }
        }

export function extractSuggestions(list) {
            let nameSet = new Set();
            let reqSet = new Set();
            list.forEach(function (layanan) {
                if (layanan.nama) nameSet.add(layanan.nama);
                if (layanan.persyaratan) {
                    try {
                        let reqObj = JSON.parse(layanan.persyaratan);
                        Object.keys(reqObj).forEach(function(kep) {
                            reqObj[kep].forEach(function(req) {
                                reqSet.add(req);
                            });
                        });
                    } catch(e) {}
                }
            });

            let nameDatalist = document.getElementById('saran-nama-layanan');
            if (nameDatalist) {
                nameDatalist.innerHTML = '';
                nameSet.forEach(function(n) {
                    let opt = document.createElement('option');
                    opt.value = n;
                    nameDatalist.appendChild(opt);
                });
            }

            let reqDatalist = document.getElementById('saran-persyaratan-list');
            if (reqDatalist) {
                reqDatalist.innerHTML = '';
                reqSet.forEach(function(r) {
                    let opt = document.createElement('option');
                    opt.value = r;
                    reqDatalist.appendChild(opt);
                });
            }

            let reqSuggestions = document.getElementById('builder-req-suggestions');
            if (reqSuggestions) {
                reqSuggestions.innerHTML = '';
                reqSet.forEach(function(r) {
                    let btn = document.createElement('button');
                    btn.type = 'button';
                    btn.className = 'px-2 py-1 bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 rounded text-[10px] font-semibold border border-slate-200 transition-colors cursor-pointer';
                    btn.innerText = r;
                    btn.onclick = function() {
                        let input = document.getElementById('builder-req-input');
                        if(input) {
                            input.value = r;
                            addRequirementToKeperluan();
                        }
                    };
                    reqSuggestions.appendChild(btn);
                });
            }
        }

export function handleBuilderLayananLoad() {
            let selectVal = document.getElementById('builder-select-layanan').value;
            if (selectVal === "[+] TAMBAH LAYANAN BARU") {
                resetBuilderFormState();
                return;
            }

            let list = window.loadedLayananList || dummyLayananList;
            let found = list.find(l => l.nama === selectVal);

            if (found) {
                populateBuilderLayananToEdit(found.id);
            } else {
                resetBuilderFormState();
                document.getElementById('builder-select-layanan').value = selectVal;
                document.getElementById('builder-layanan-nama').value = selectVal;
                document.getElementById('wrapper-builder-nama').classList.add('hidden');
            }
        }

export function handleKeperluanSelectChange() {
            let select = document.getElementById('builder-keperluan-select');
            let wrapper = document.getElementById('wrapper-new-keperluan');
            if (select.value === "__ADD_NEW__") {
                wrapper.classList.remove('hidden');
                document.getElementById('builder-keperluan-new-input').focus();
            } else {
                wrapper.classList.add('hidden');
            }
        }

export function saveNewKeperluanOption() {
            let input = document.getElementById('builder-keperluan-new-input');
            let val = input.value.trim();
            if (!val) {
                pushToast("Ketik opsi keperluan terlebih dahulu!", "error");
                return;
            }

            let select = document.getElementById('builder-keperluan-select');

            for (let i = 0; i < select.options.length; i++) {
                if (select.options[i].value.toLowerCase() === val.toLowerCase()) {
                    pushToast("Opsi keperluan '" + val + "' sudah terdaftar!", "error");
                    return;
                }
            }

            let opt = document.createElement('option');
            opt.value = val;
            opt.text = val;

            select.add(opt, select.options[select.options.length - 1]);
            select.value = val;

            input.value = "";
            document.getElementById('wrapper-new-keperluan').classList.add('hidden');
            pushToast("Keperluan '" + val + "' berhasil ditambahkan!", "success");
        }

export function cancelNewKeperluanOption() {
            document.getElementById('builder-keperluan-new-input').value = "";
            document.getElementById('wrapper-new-keperluan').classList.add('hidden');
            document.getElementById('builder-keperluan-select').value = "";
        }

export function deleteSelectedKeperluanOption() {
            let select = document.getElementById('builder-keperluan-select');
            let val = select.value;
            if (!val || val === "__ADD_NEW__") {
                pushToast("Pilih salah satu opsi keperluan yang ingin dihapus!", "error");
                return;
            }

            askConfirmation("Hapus Opsi Keperluan", "Apakah Anda yakin ingin menghapus opsi keperluan '" + val + "'?", function () {
                select.remove(select.selectedIndex);
                select.value = "";
                pushToast("Opsi keperluan telah dihapus.", "success");
            });
        }

export function runLayananFilter() {
            let keyword = document.getElementById('admin-layanan-keyword-filter').value.toLowerCase().trim();
            let list = window.loadedLayananList || [];
            
            if (!keyword) {
                renderLayananTable(list);
                return;
            }

            let filtered = list.filter(function (row) {
                return row.nama.toLowerCase().indexOf(keyword) !== -1;
            });
            renderLayananTable(filtered);
        }

export function renderLayananTable(list) {
            let listContainer = document.getElementById('standalone-active-services-list');
            let totalBadge = document.getElementById('txt-total-layanan-aktif');
            if (!listContainer) return;
            
            // 1) Fallback if list is undefined/null/empty array
            if (!list || !Array.isArray(list) || list.length === 0) {
                list = window.loadedLayananList;
                if (!list || !Array.isArray(list) || list.length === 0) {
                    list = typeof dummyLayananList !== 'undefined' ? dummyLayananList : [];
                }
            }
            
            listContainer.innerHTML = "";

            if (totalBadge) totalBadge.innerText = (list ? list.length : 0) + " Layanan";

            if (!list || list.length === 0) {
                listContainer.innerHTML = '<tr><td colspan="6" class="p-8 text-center text-slate-500 bg-slate-50/50 italic border-b border-slate-100"><div class="flex flex-col items-center justify-center gap-2"><div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center"><i class="fa-solid fa-folder-open text-slate-400 text-lg"></i></div><span>Belum ada pelayanan aktif terdaftar.</span></div></td></tr>';
                return;
            }

            let htmlBuffer = "";
            list.forEach(function (row, index) {
                try {
                    let keperluanList = row.judulSectionIsian ? row.judulSectionIsian.split(',').map(s => s.trim()).filter(s => s) : [];
                    let kepHtml = keperluanList.length > 0
                        ? '<div class="flex flex-wrap gap-1">' + keperluanList.map(k => '<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-50 text-blue-600 border border-blue-100">' + k + '</span>').join('') + '</div>'
                        : '<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 text-slate-500 border border-slate-200">Wajib (Tanpa Pilihan)</span>';

                    let reqMap = {};
                    (row.requirements || []).forEach(function (r) {
                        let cleanName = r.name || "";
                        let kep = "Wajib";
                        let match = cleanName.match(/^\[(.*?)\]\s*(.*)$/);
                        if (match) { kep = match[1]; cleanName = match[2]; }
                        if (!reqMap[kep]) reqMap[kep] = [];
                        reqMap[kep].push(cleanName);
                    });
                    let docHtml = "";
                    Object.keys(reqMap).forEach(k => {
                        docHtml += '<div class="mb-2 last:mb-0">';
                        docHtml += '<p class="text-[9px] font-bold text-slate-700 uppercase mb-1 flex items-center gap-1"><i class="fa-solid fa-file-contract text-slate-400"></i> ' + (k === "Wajib" ? "DOKUMEN WAJIB" : k) + '</p>';
                        docHtml += '<ul class="list-none space-y-1">';
                        reqMap[k].forEach(item => {
                            docHtml += '<li class="text-[10px] text-slate-600 flex items-start gap-1.5"><i class="fa-solid fa-check text-emerald-500 mt-[2px] text-[8px]"></i> <span>' + item + '</span></li>';
                        });
                        docHtml += '</ul></div>';
                    });
                    if (docHtml === "") docHtml = '<span class="text-slate-400 italic text-[10px]">Tanpa lampiran</span>';

                    let qMap = {};
                    (row.fields || []).forEach(function (f) {
                        if(!f || !f.name) return;
                        let meta = parseQuestionMetadata(f.name);
                        if (!qMap[meta.keperluan]) qMap[meta.keperluan] = [];
                        let typeStr = f.type === 'dropdown' ? ' <span class="text-slate-400">(Dropdown)</span>' :
                            f.type === 'number' ? ' <span class="text-slate-400">(Angka)</span>' :
                                f.type === 'date' ? ' <span class="text-slate-400">(Tanggal)</span>' : ' <span class="text-slate-400">(Teks)</span>';
                        qMap[meta.keperluan].push(meta.cleanName + typeStr);
                    });
                    let qHtml = "";
                    Object.keys(qMap).forEach(k => {
                        qHtml += '<div class="mb-2 last:mb-0">';
                        qHtml += '<p class="text-[9px] font-bold text-slate-700 uppercase mb-1 flex items-center gap-1"><i class="fa-solid fa-clipboard-list text-slate-400"></i> ' + (k === "Wajib" ? "ISIAN UMUM" : k) + '</p>';
                        qHtml += '<ul class="list-none space-y-1">';
                        qMap[k].forEach(item => {
                            qHtml += '<li class="text-[10px] text-slate-600 flex items-start gap-1.5"><i class="fa-solid fa-minus text-slate-300 mt-[2px] text-[8px]"></i> <span>' + item + '</span></li>';
                        });
                        qHtml += '</ul></div>';
                    });
                    if (qHtml === "") qHtml = '<span class="text-slate-400 italic text-[10px]">Tanpa pertanyaan</span>';

                    let tr = '<tr class="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">' +
                        '<td class="py-4 px-2 text-center font-bold text-slate-400 text-xs">' + (index + 1) + '</td>' +
                        '<td class="py-4 px-4">' +
                        '<div class="font-bold text-slate-800 text-sm mb-0.5">' + (row.nama || "-") + '</div>' +
                        '<div class="text-[10px] text-slate-500 max-w-xs leading-relaxed">' + (row.deskripsi || "-") + '</div>' +
                        '</td>' +
                        '<td class="py-4 px-4 align-top">' + kepHtml + '</td>' +
                        '<td class="py-4 px-4 align-top">' + docHtml + '</td>' +
                        '<td class="py-4 px-4 align-top">' + qHtml + '</td>' +
                        '<td class="py-4 px-4 text-center align-middle">' +
                        '<div class="flex flex-col gap-2 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">' +
                        '<button onclick="switchAdminTab(\'layanan\'); populateBuilderLayananToEdit(\'' + row.id + '\')" class="w-20 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 hover:-translate-y-0.5 text-amber-700 font-bold text-[10px] transition-all flex items-center justify-center gap-1.5 shadow-sm border border-amber-200/50">' +
                        '<i class="fa-solid fa-pencil"></i> Edit' +
                        '</button>' +
                        '<button onclick="deleteBuilderMasterLayanan(\'' + row.nama + '\')" class="w-20 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 hover:-translate-y-0.5 text-red-700 font-bold text-[10px] transition-all flex items-center justify-center gap-1.5 shadow-sm border border-red-200/50">' +
                        '<i class="fa-solid fa-trash"></i> Hapus' +
                        '</button>' +
                        '</div>' +
                        '</td>' +
                        '</tr>';
                    htmlBuffer += tr;
                } catch (e) {
                    console.error("Error rendering row:", row, e);
                }
            });
            listContainer.innerHTML = htmlBuffer;
        }

export function loadBuilderDaftarLayananTab() {
            let listContainer = document.getElementById('standalone-active-services-list');
            if (!listContainer) return;
            listContainer.innerHTML = getTableSkeleton(5, 5);

            let successHandler = function (list) {
                window.loadedLayananList = list;
                
                let keywordInput = document.getElementById('admin-layanan-keyword-filter');
                if (keywordInput && keywordInput.value.trim() !== "") {
                    runLayananFilter();
                } else {
                    renderLayananTable(list);
                }
            };

            if (isGoogleEnv) {
                try {
                    google.script.run.withSuccessHandler(successHandler).getLayananList();
                } catch (e) {
                    setTimeout(function () { successHandler(dummyLayananList); }, 200);
                }
            }
        }

export function populateBuilderLayananToEdit(id) {
            let list = window.loadedLayananList || dummyLayananList;
            let found = list.find(l => l.id === id);
            if (!found) return;

            document.getElementById('builder-select-layanan').value = found.nama;
            document.getElementById('wrapper-builder-nama').classList.add('hidden');
            document.getElementById('builder-layanan-nama').value = found.nama;
            document.getElementById('builder-template-doc-id').value = found.templateDocId || "";
            document.getElementById('builder-template-pratinjau').value = found.templatePratinjau || "";

            let selectKeperluan = document.getElementById('builder-keperluan-select');
            selectKeperluan.innerHTML = '<option value="">-- Pilih atau Tambah Keperluan --</option>' +
                '<option value="__ADD_NEW__" class="font-extrabold text-emerald-600">[+] TAMBAH KEPERLUAN BARU...</option>';

            let optionsStr = found.judulSectionIsian || "";
            if (optionsStr) {
                let optionsArray = optionsStr.split(",");
                optionsArray.forEach(function (opt) {
                    let cleanOpt = opt.trim();
                    if (cleanOpt) {
                        let o = document.createElement('option');
                        o.value = cleanOpt;
                        o.text = cleanOpt;
                        selectKeperluan.add(o, selectKeperluan.options[selectKeperluan.options.length - 1]);
                    }
                });
            }

            builderQuestions = [];
            (found.fields || []).forEach(function (f) {
                let displayType = f.type;
                let actualName = f.name;
                let typeMatch = actualName.match(/(.*)\s*\|\|(number|date)\|\|$/);
                if (typeMatch) {
                    displayType = typeMatch[2];
                    actualName = typeMatch[1].trim();
                }

                builderQuestions.push({
                    id: f.id,
                    label: f.label || actualName,
                    name: actualName,
                    type: displayType,
                    options: f.options || "",
                    required: f.required || "ya"
                });
            });

            builderReqMap = {};
            (found.requirements || []).forEach(function (req) {
                let match = req.name.match(/^\[(.*?)\]\s*(.*)$/);
                if (match) {
                    let kep = match[1];
                    let reqName = match[2];
                    if (!builderReqMap[kep]) builderReqMap[kep] = [];
                    builderReqMap[kep].push(reqName);
                } else {
                    if (!builderReqMap["Wajib"]) builderReqMap["Wajib"] = [];
                    builderReqMap["Wajib"].push(req.name);
                }
            });

            renderBuilderQuestionsUIList();
            pushToast("Konfigurasi '" + found.nama + "' berhasil dimuat.", "info");
            initStep2RequirementsBuilder();
            initStep3QuestionsBuilder();
        }

export function toggleBuilderOptionInput() {
            let type = document.getElementById('builder-q-type').value;
            let wrapperOpt = document.getElementById('wrapper-q-options');
            let wrapperLim = document.getElementById('wrapper-q-limit');

            wrapperOpt.classList.add('hidden');
            if (wrapperLim) wrapperLim.classList.add('hidden');

            if (type === "dropdown") {
                wrapperOpt.classList.remove('hidden');
            } else if (type === "number" && wrapperLim) {
                wrapperLim.classList.remove('hidden');
            }
        }

export function populateBuilderRepeaterSelect() {
            let selRep = document.getElementById('builder-repeater-select');
            let repKeperluan = document.getElementById('builder-repeater-keperluan') ? document.getElementById('builder-repeater-keperluan').value : "Wajib";
            if (selRep) {
                selRep.innerHTML = '<option value="">-- Pilih Pertanyaan Tunggal --</option>';
                builderQuestions.forEach(function (q, idx) {
                    if (q.type === "repeater") return;
                    let meta = parseQuestionMetadata(q.name);
                    let k = meta.keperluan || "Wajib";
                    if (k === repKeperluan) {
                        let optHtml = '<option value="' + idx + '">[' + k + '] ' + meta.cleanName + '</option>';
                        selRep.innerHTML += optHtml;
                    }
                });
            }
        }

export function addQuestionToRepeaterTempList() {
            let sel = document.getElementById('builder-repeater-select');
            let val = sel.value;
            if (val === "") {
                pushToast("Silakan pilih pertanyaan terlebih dahulu!", "error");
                return;
            }
            let idx = parseInt(val);
            let q = builderQuestions[idx];
            
            if (currentRepeaterGroup.some(item => item.id === q.id)) {
                pushToast("Pertanyaan ini sudah ada di dalam grup!", "error");
                return;
            }
            
            currentRepeaterGroup.push(q);
            renderRepeaterTempList();
        }

export function renderRepeaterTempList() {
            let container = document.getElementById('builder-repeater-temp-list');
            if (!container) return;
            
            if (currentRepeaterGroup.length === 0) {
                container.innerHTML = '<div class="text-center text-[10px] text-slate-400 italic py-2">Belum ada pertanyaan dipilih.</div>';
                return;
            }
            
            let html = '';
            currentRepeaterGroup.forEach(function(q, i) {
                let meta = parseQuestionMetadata(q.name);
                html += '<div class="flex items-center justify-between p-2 rounded-lg border border-slate-200 bg-slate-50 text-[10px] font-semibold text-slate-700">' +
                    '<div class="flex gap-2 items-center">' +
                        '<span class="text-indigo-500 font-extrabold w-4">' + (i + 1) + '.</span>' +
                        '<span>[' + meta.keperluan + '] ' + meta.cleanName + '</span>' +
                    '</div>' +
                    '<div class="flex gap-1">' +
                        '<button type="button" onclick="moveRepeaterTempItem(' + i + ', -1)" class="px-2 py-1 bg-white hover:bg-slate-100 border rounded text-slate-500 shadow-sm"><i class="fa-solid fa-arrow-up"></i></button>' +
                        '<button type="button" onclick="moveRepeaterTempItem(' + i + ', 1)" class="px-2 py-1 bg-white hover:bg-slate-100 border rounded text-slate-500 shadow-sm"><i class="fa-solid fa-arrow-down"></i></button>' +
                        '<button type="button" onclick="removeRepeaterTempItem(' + i + ')" class="px-2 py-1 bg-red-50 hover:bg-red-100 border border-red-200 rounded text-red-500 ml-2 shadow-sm"><i class="fa-solid fa-trash"></i></button>' +
                    '</div>' +
                '</div>';
            });
            container.innerHTML = html;
        }

export function moveRepeaterTempItem(index, dir) {
            if (dir === -1 && index > 0) {
                let temp = currentRepeaterGroup[index];
                currentRepeaterGroup[index] = currentRepeaterGroup[index - 1];
                currentRepeaterGroup[index - 1] = temp;
                renderRepeaterTempList();
            } else if (dir === 1 && index < currentRepeaterGroup.length - 1) {
                let temp = currentRepeaterGroup[index];
                currentRepeaterGroup[index] = currentRepeaterGroup[index + 1];
                currentRepeaterGroup[index + 1] = temp;
                renderRepeaterTempList();
            }
        }

export function removeRepeaterTempItem(index) {
            currentRepeaterGroup.splice(index, 1);
            renderRepeaterTempList();
        }

export function saveRepeaterGroup() {
            if (currentRepeaterGroup.length === 0) {
                pushToast("Grup masih kosong! Pilih minimal satu pertanyaan.", "error");
                return;
            }
            
            let keperluan = document.getElementById('builder-repeater-keperluan').value || "Wajib";
            
            // Auto generate judul based on first question
            let metaFirst = parseQuestionMetadata(currentRepeaterGroup[0].name);
            let judul = "Grup Berulang: " + metaFirst.cleanName + (currentRepeaterGroup.length > 1 ? " dll" : "");
            
            let formattedName = "{" + keperluan + ";;} " + judul;
            
            let newQuestionObj = {
                id: "FLD-" + Math.random().toString(36).substr(2, 5).toUpperCase(),
                label: formattedName,
                name: formattedName,
                type: "repeater",
                options: JSON.stringify(currentRepeaterGroup),
                required: "ya"
            };
            
            if (editingRepeaterIndex !== -1) {
                newQuestionObj.id = builderQuestions[editingRepeaterIndex].id;
                builderQuestions[editingRepeaterIndex] = newQuestionObj;
                pushToast("Grup pertanyaan berhasil diupdate.", "success");
            } else {
                builderQuestions.push(newQuestionObj);
                pushToast("Grup pertanyaan berhasil ditambahkan.", "success");
            }
            
            builderQuestions.sort(function (a, b) {
                let metaA = parseQuestionMetadata(a.name);
                let metaB = parseQuestionMetadata(b.name);
                if (metaA.keperluan === "Wajib" && metaB.keperluan !== "Wajib") return -1;
                if (metaB.keperluan === "Wajib" && metaA.keperluan !== "Wajib") return 1;
                if (metaA.keperluan < metaB.keperluan) return -1;
                if (metaA.keperluan > metaB.keperluan) return 1;
                
                // Ensure repeater group marker stays AFTER its constituent elements
                if (a.type === "repeater" && b.type !== "repeater") return 1;
                if (b.type === "repeater" && a.type !== "repeater") return -1;
                return 0;
            });
            
            cancelEditRepeaterGroup();
            renderBuilderQuestionsUIList();
        }

export function cancelEditRepeaterGroup() {
            editingRepeaterIndex = -1;
            currentRepeaterGroup = [];
            document.getElementById('builder-repeater-select').value = "";
            renderRepeaterTempList();
            
            let btnAdd = document.getElementById('btn-add-update-repeater');
            btnAdd.innerHTML = '<i class="fa-solid fa-save"></i> <span>Tambahkan Grup</span>';
            btnAdd.className = "px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md";
            document.getElementById('btn-cancel-update-repeater').classList.add('hidden');
        }

export function addBuilderQuestionToList() {
            let keperluan = document.getElementById('builder-q-keperluan').value || "Wajib";
            let judul = document.getElementById('builder-q-judul').value.trim();
            let label = document.getElementById('builder-q-label').value.trim();
            let type = document.getElementById('builder-q-type').value;
            let reqStatus = document.getElementById('builder-q-required') ? document.getElementById('builder-q-required').value : "ya";

            let finalOptions = "";
            if (type === "dropdown") {
                finalOptions = document.getElementById('builder-q-options').value.trim();
                if (!finalOptions) { pushToast("Tulis opsi dropdown dipisahkan tanda koma!", "error"); return; }
            } else if (type === "number") {
                let limEl = document.getElementById('builder-q-limit');
                if (limEl) finalOptions = limEl.value.trim();
            }

            if (!label) {
                pushToast("Label pertanyaan wajib ditulis!", "error");
                return;
            }

            let formattedName = "{" + keperluan + ";;" + judul + "} " + label;

            let newQuestionObj = {
                id: "FLD-" + Math.random().toString(36).substr(2, 5).toUpperCase(),
                label: formattedName,
                name: formattedName,
                type: type,
                options: finalOptions,
                required: reqStatus
            };

            if (window.editingQuestionIndex !== -1) {
                newQuestionObj.id = builderQuestions[window.editingQuestionIndex].id; // Pertahankan ID
                builderQuestions[window.editingQuestionIndex] = newQuestionObj;
                cancelEditBuilderQuestion();
                pushToast("Pertanyaan berhasil diupdate.", "success");
            } else {
                builderQuestions.push(newQuestionObj);
                pushToast("Pertanyaan berhasil ditambahkan.", "success");
            }

            // Sort / Urutkan Berdasarkan Keperluan (Wajib selalu teratas)
            builderQuestions.sort(function (a, b) {
                let metaA = parseQuestionMetadata(a.name);
                let metaB = parseQuestionMetadata(b.name);
                if (metaA.keperluan === "Wajib" && metaB.keperluan !== "Wajib") return -1;
                if (metaB.keperluan === "Wajib" && metaA.keperluan !== "Wajib") return 1;
                if (metaA.keperluan < metaB.keperluan) return -1;
                if (metaA.keperluan > metaB.keperluan) return 1;
                return 0;
            });

            document.getElementById('builder-q-label').value = "";
            document.getElementById('builder-q-options').value = "";
            document.getElementById('builder-q-judul').value = "";
            if (document.getElementById('builder-q-limit')) document.getElementById('builder-q-limit').value = "";

            renderBuilderQuestionsUIList();
        }

export function editBuilderQuestion(index) {
            let q = builderQuestions[index];
            let meta = parseQuestionMetadata(q.name);
            let baseType = q.type;

            if (baseType === "repeater") {
                cancelEditBuilderQuestion(); // Reset form standard
                editingRepeaterIndex = index;
                
                document.getElementById('builder-repeater-keperluan').value = meta.keperluan || "Wajib";
                
                currentRepeaterGroup = JSON.parse(q.options || "[]");
                
                renderRepeaterTempList();
                populateBuilderRepeaterSelect();
                
                let btnAdd = document.getElementById('btn-add-update-repeater');
                btnAdd.innerHTML = '<i class="fa-solid fa-save"></i> <span>Update Grup</span>';
                btnAdd.className = "px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md";
                document.getElementById('btn-cancel-update-repeater').classList.remove('hidden');
                
                document.getElementById('builder-repeater-select').scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }

            cancelEditRepeaterGroup(); // Reset form repeater
            window.editingQuestionIndex = index;

            // Populate Input Form
            document.getElementById('builder-q-keperluan').value = meta.keperluan || "Wajib";
            document.getElementById('builder-q-judul').value = meta.judul;
            document.getElementById('builder-q-label').value = meta.cleanName;
            document.getElementById('builder-q-type').value = baseType;
            document.getElementById('builder-q-required').value = q.required;

            toggleBuilderOptionInput();

            if (baseType === "dropdown") {
                document.getElementById('builder-q-options').value = q.options;
            } else if (baseType === "number") {
                document.getElementById('builder-q-limit').value = q.options;
            }

            // Update UI Buttons
            let btnAdd = document.getElementById('btn-add-update-question');
            btnAdd.innerHTML = '<i class="fa-solid fa-save"></i> <span>Update Pertanyaan</span>';
            btnAdd.className = "px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md";
            document.getElementById('btn-cancel-update-question').classList.remove('hidden');

            // Auto Scroll to form
            document.getElementById('builder-step-2').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

export function cancelEditBuilderQuestion() {
            window.editingQuestionIndex = -1;

            document.getElementById('builder-q-label').value = "";
            document.getElementById('builder-q-options').value = "";
            document.getElementById('builder-q-judul').value = "";
            if (document.getElementById('builder-q-limit')) document.getElementById('builder-q-limit').value = "";

            let btnAdd = document.getElementById('btn-add-update-question');
            btnAdd.innerHTML = '<i class="fa-solid fa-plus-circle"></i> <span>Tambahkan Pertanyaan</span>';
            btnAdd.className = "px-4 py-2 bg-narmadaGreen hover:bg-narmadaGreen-dark text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md";
            document.getElementById('btn-cancel-update-question').classList.add('hidden');
        }

export function removeBuilderQuestion(index) {
            builderQuestions.splice(index, 1);
            if (window.editingQuestionIndex === index) cancelEditBuilderQuestion();
            renderBuilderQuestionsUIList();
        }

export function moveBuilderQuestionUp(index) {
            let currentQ = builderQuestions[index];
            let currentMeta = parseQuestionMetadata(currentQ.name);
            let prevIndex = -1;
            for (let i = index - 1; i >= 0; i--) {
                let meta = parseQuestionMetadata(builderQuestions[i].name);
                if (meta.keperluan === currentMeta.keperluan) {
                    prevIndex = i;
                    break;
                }
            }
            if (prevIndex !== -1) {
                let temp = builderQuestions[prevIndex];
                builderQuestions[prevIndex] = builderQuestions[index];
                builderQuestions[index] = temp;
                renderBuilderQuestionsUIList();
            }
        }

export function moveBuilderQuestionDown(index) {
            let currentQ = builderQuestions[index];
            let currentMeta = parseQuestionMetadata(currentQ.name);
            let nextIndex = -1;
            for (let i = index + 1; i < builderQuestions.length; i++) {
                let meta = parseQuestionMetadata(builderQuestions[i].name);
                if (meta.keperluan === currentMeta.keperluan) {
                    nextIndex = i;
                    break;
                }
            }
            if (nextIndex !== -1) {
                let temp = builderQuestions[nextIndex];
                builderQuestions[nextIndex] = builderQuestions[index];
                builderQuestions[index] = temp;
                renderBuilderQuestionsUIList();
            }
        }

export function duplicateBuilderQuestion(index) {
            let q = JSON.parse(JSON.stringify(builderQuestions[index]));
            let meta = parseQuestionMetadata(q.name);
            let newJudul = (meta.judul || meta.cleanName) + " (Copy)";
            q.name = "{" + meta.keperluan + ";;" + newJudul + "} " + meta.cleanName;
            builderQuestions.splice(index + 1, 0, q);
            renderBuilderQuestionsUIList();
        }

export function renderBuilderQuestionsUIList() {
            let container = document.getElementById('builder-q-list');
            if (!container) return;
            container.innerHTML = "";

            if (builderQuestions.length === 0) {
                container.innerHTML = '<p class="text-[10px] text-slate-400 italic font-semibold">Belum ada pertanyaan kustom ditambahkan.</p>';
                return;
            }

            let groupedQ = {};
            builderQuestions.forEach(function (q, idx) {
                let meta = parseQuestionMetadata(q.name);
                if (!groupedQ[meta.keperluan]) groupedQ[meta.keperluan] = [];
                groupedQ[meta.keperluan].push({ data: q, index: idx, meta: meta });
            });

            Object.keys(groupedQ).forEach(function (kep) {
                let groupHtml = '<div class="bg-white border border-slate-200 rounded-xl p-3 shadow-sm text-left mb-2">' +
                    '<h5 class="text-[10px] font-extrabold text-blue-600 mb-2 border-b pb-1 flex items-center gap-1.5"><i class="fa-solid fa-list-ul"></i> Keperluan: ' + kep + '</h5>' +
                    '<div class="space-y-1.5 pl-1">';

                groupedQ[kep].forEach(function (item, idxInGroup) {
                    let baseType = item.data.type;

                    let detail = baseType === "dropdown" ? " (Dropdown: " + item.data.options + ")" :
                        baseType === "number" ? " (Angka" + (item.data.options ? ", Max Digit: " + item.data.options : "") + ")" :
                            baseType === "date" ? " (Tanggal)" : 
                                baseType === "repeater" ? (() => {
                                    try { 
                                        let subs = JSON.parse(item.data.options || "[]"); 
                                        return " (Grup Berulang: " + subs.length + " pertanyaan)";
                                    } catch(e) { return " (Grup Berulang)"; }
                                })() : " (Teks)";

                    if (baseType === "repeater") detail += " <span class='text-indigo-500 font-bold'>[Grup Repeater]</span>";

                    let reqLabel = item.data.required === "tidak" ? '<span class="ml-1 text-amber-500 font-bold">[Opsional]</span>' : '<span class="ml-1 text-emerald-500 font-bold">[Wajib]</span>';
                    let titleStr = item.meta.judul ? '<span class="block text-[8px] text-slate-400 font-extrabold uppercase mb-0.5"><i class="fa-solid fa-tag"></i> Judul: ' + item.meta.judul + '</span>' : '';
                    
                    let numberStr = '<span class="font-bold text-slate-800 text-[10px] w-4 inline-block">' + (idxInGroup + 1) + '.</span>';

                    let highlightClass = (window.editingQuestionIndex === item.index) ? "border-amber-400 bg-amber-50" : "border-slate-101 bg-slate-50";

                    groupHtml += '<div class="flex items-center justify-between p-2 rounded-lg border ' + highlightClass + ' text-[10px] font-semibold text-slate-700">' +
                        '<div class="flex items-start gap-1">' + numberStr + '<div>' + titleStr + '<span><i class="fa-solid fa-check text-emerald-500 mr-1"></i> ' + item.meta.cleanName + reqLabel + ' <span class="text-slate-400 block mt-0.5">' + detail + '</span></span></div></div>' +
                        '<div class="flex gap-1 shrink-0 flex-wrap justify-end max-w-[120px]">' +
                        '<button onclick="moveBuilderQuestionUp(' + item.index + ')" class="text-slate-500 hover:text-slate-700 px-1.5 py-1 bg-white border border-slate-200 rounded shadow-sm transition-all" title="Naik"><i class="fa-solid fa-arrow-up"></i></button>' +
                        '<button onclick="moveBuilderQuestionDown(' + item.index + ')" class="text-slate-500 hover:text-slate-700 px-1.5 py-1 bg-white border border-slate-200 rounded shadow-sm transition-all" title="Turun"><i class="fa-solid fa-arrow-down"></i></button>' +
                        '<button onclick="duplicateBuilderQuestion(' + item.index + ')" class="text-indigo-500 hover:text-indigo-700 px-1.5 py-1 bg-white border border-slate-200 rounded shadow-sm transition-all" title="Duplikat"><i class="fa-solid fa-copy"></i></button>' +
                        '<button onclick="editBuilderQuestion(' + item.index + ')" class="text-blue-500 hover:text-blue-700 px-1.5 py-1 bg-white border border-slate-200 rounded shadow-sm transition-all" title="Edit"><i class="fa-solid fa-edit"></i></button>' +
                        '<button onclick="removeBuilderQuestion(' + item.index + ')" class="text-red-500 hover:text-red-700 px-1.5 py-1 bg-white border border-slate-200 rounded shadow-sm transition-all" title="Hapus"><i class="fa-solid fa-trash"></i></button>' +
                        '</div>' +
                        '</div>';
                });
                groupHtml += '</div></div>';
                container.innerHTML += groupHtml;
            });
            populateBuilderRepeaterSelect();
        }

export function submitBuilderDataToServer() {
            let selectVal = document.getElementById('builder-select-layanan').value;
            let isNew = selectVal === "[+] TAMBAH LAYANAN BARU";
            let name = document.getElementById('builder-layanan-nama').value.trim();
            let templateDocId = document.getElementById('builder-template-doc-id').value.trim();
            let templatePratinjau = document.getElementById('builder-template-pratinjau').value.trim();

            let selectKeperluan = document.getElementById('builder-keperluan-select');
            let keperluanOpts = [];
            for (let i = 0; i < selectKeperluan.options.length; i++) {
                let val = selectKeperluan.options[i].value;
                if (val && val !== "__ADD_NEW__") {
                    keperluanOpts.push(val);
                }
            }

            let jSec = keperluanOpts.join(",");
            let dSec = "Pilih keperluan pengurusan surat Anda.";

            if (!name) {
                pushToast("Nama pelayanan administrasi surat wajib diisi!", "error");
                return;
            }

            let activeReqs = [];
            Object.keys(builderReqMap).forEach(function (kep) {
                builderReqMap[kep].forEach(function (req) {
                    activeReqs.push("[" + kep + "] " + req);
                });
            });

            let mappedFieldsTextArray = builderQuestions.map(function (q) {
                return JSON.stringify(q);
            });

            let oldName = "";
            if (!isNew && window.loadedLayananList) {
                let found = window.loadedLayananList.find(l => l.nama === selectVal);
                if (found) {
                    payload_id = found.id;
                    oldName = found.nama;
                } else {
                    payload_id = "";
                }
            } else {
                payload_id = "";
            }

            let payload = {
                id: payload_id,
                nama: name,
                namaOld: isNew ? "" : oldName,
                syarat: activeReqs.join(";;;"),
                pertanyaan: mappedFieldsTextArray.join(";;;"),
                judulSectionIsian: jSec,
                deskripsiSectionIsian: dSec,
                logikaKondisional: "[]",
                templateDocId: templateDocId,
                templatePratinjau: templatePratinjau
            };

            let action = payload.id ? "update" : "create";

            if (isGoogleEnv) {
                google.script.run
                    .withSuccessHandler(function (res) {
                        if (res && res.authError) { pushToast(res.message, "error"); handleAdminLogout(); return; }
                        if (res.success) {
                            pushToast("Layanan '" + name + "' sukses dipublikasikan ke warga!", "success");
                            resetBuilderFormState();
                            executeSwitchAdminTab('daftar-layanan');
                            loadBuilderLayananList();
                            loadLayananDataWarga();
                        } else {
                            pushToast("Gagal menyimpan: " + res.message, "error");
                        }
                    })
                    .crudLayanan(localStorage.getItem('adminToken_Narmada'), action, payload);
            } else {
                if (!payload.id) {
                    dummyLayananList.push({
                        id: "LAY-MOCK-" + Math.random().toString(36).substr(2, 5).toUpperCase(),
                        nama: payload.nama,
                        deskripsi: "Pelayanan baru terdaftar via Service Builder.",
                        judulSectionIsian: payload.judulSectionIsian,
                        deskripsiSectionIsian: payload.deskripsiSectionIsian,
                        logikaKondisional: payload.logikaKondisional,
                        requirements: activeReqs.map(function (r) { return { id: "REQ-" + Math.random(), name: r }; }),
                        fields: builderQuestions
                    });
                } else {
                    let idx = dummyLayananList.findIndex(l => l.id === payload.id);
                    if (idx !== -1) {
                        dummyLayananList[idx].nama = payload.nama;
                        dummyLayananList[idx].judulSectionIsian = payload.judulSectionIsian;
                        dummyLayananList[idx].deskripsiSectionIsian = payload.deskripsiSectionIsian;
                        dummyLayananList[idx].logikaKondisional = payload.logikaKondisional;
                        dummyLayananList[idx].requirements = activeReqs.map(function (r) { return { id: "REQ-" + Math.random(), name: r }; });
                        dummyLayananList[idx].fields = builderQuestions;
                    }
                }
                pushToast("SIMULASI: Sukses mempublikasikan layanan baru.", "success");
                resetBuilderFormState();
                executeSwitchAdminTab('daftar-layanan');
                loadBuilderLayananList();
                renderLayananListWarga(dummyLayananList);
            }
        }

export function resetBuilderFormState() {
            document.getElementById('builder-select-layanan').value = "[+] TAMBAH LAYANAN BARU";
            document.getElementById('builder-layanan-nama').value = "";
            document.getElementById('builder-template-doc-id').value = "";
            document.getElementById('builder-template-pratinjau').value = "";
            document.getElementById('wrapper-builder-nama').classList.remove('hidden');

            let selectKeperluan = document.getElementById('builder-keperluan-select');
            if (selectKeperluan) {
                selectKeperluan.innerHTML = '<option value="">-- Pilih atau Tambah Keperluan --</option>' +
                    '<option value="__ADD_NEW__" class="font-extrabold text-emerald-600">[+] TAMBAH KEPERLUAN BARU...</option>';
            }

            let wrapperNew = document.getElementById('wrapper-new-keperluan');
            if (wrapperNew) wrapperNew.classList.add('hidden');

            builderQuestions = [];
            builderReqMap = {};

            renderBuilderQuestionsUIList();
            initStep2RequirementsBuilder();
            initStep3QuestionsBuilder();
        }

export function deleteBuilderMasterLayanan(nama) {
            askConfirmation("Hapus Layanan", "Apakah Anda yakin ingin menghapus layanan '" + nama + "' dari sistem secara permanen?", function () {
                if (isGoogleEnv) {
                    google.script.run
                        .withSuccessHandler(function (res) {
                            if (res && res.authError) { pushToast(res.message, "error"); handleAdminLogout(); return; }
                            if (res.success) {
                                pushToast("Layanan '" + nama + "' berhasil dihapus.", "success");
                                loadBuilderLayananList();
                                loadLayananDataWarga();
                            }
                        })
                        .crudLayanan(localStorage.getItem('adminToken_Narmada'), "delete", { nama: nama });
                } else {
                    dummyLayananList = dummyLayananList.filter(l => l.nama !== nama);
                    pushToast("SIMULASI: Layanan terhapus.", "success");
                    loadBuilderLayananList();
                    renderLayananListWarga(dummyLayananList);
                }
            });
        }

export let currentRepeaterGroup = [];

export let editingRepeaterIndex = -1;
