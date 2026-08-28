
export let builderKeperluanList = []; // Array of {nama, doc}

export function renderBuilderKeperluanList() {
    let container = document.getElementById('builder-keperluan-list');
    let select = document.getElementById('builder-keperluan-select');
    
    if (container) container.innerHTML = "";
    if (select) select.innerHTML = '<option value="">-- Pilih / Edit Keperluan --</option>';
    
    if (builderKeperluanList.length === 0) {
        if (container) container.innerHTML = '<p class="text-[10px] text-slate-400 italic py-1">Belum ada keperluan ditambahkan.</p>';
        return;
    }
    
    builderKeperluanList.forEach((item, index) => {
        // Render as compact inline chip tag
        let docTooltip = item.doc ? item.doc : 'Tanpa template';
        let docIcon = item.doc ? '<i class="fa-solid fa-link text-[7px] text-narmadaGreen opacity-60"></i>' : '';
        let html = `<span class="keperluan-chip inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-[11px] font-semibold text-emerald-800 animate-fade-in group" title="${docTooltip}">
            ${docIcon}<span class="max-w-[180px] truncate">${item.nama}</span>
            <button type="button" onclick="deleteKeperluanAtIndex(${index})" class="w-5 h-5 rounded-md flex items-center justify-center text-emerald-400 hover:text-red-500 hover:bg-red-50 transition-all duration-150 cursor-pointer ml-0.5" title="Hapus">
                <i class="fa-solid fa-xmark text-[10px]"></i>
            </button>
        </span>`;
        if (container) container.innerHTML += html;
        
        // Add to hidden select for compatibility with other scripts (req mapping, etc)
        if (select) {
            let opt = document.createElement('option');
            opt.value = item.nama;
            opt.text = item.nama;
            select.add(opt);
        }
    });
}

export function deleteKeperluanAtIndex(index) {
    if (index >= 0 && index < builderKeperluanList.length) {
        let name = builderKeperluanList[index].nama;
        // Check if there are requirements mapped to this keperluan
        if (window.builderReqMap && window.builderReqMap[name]) {
            askConfirmation("Hapus Keperluan", `Keperluan '${name}' memiliki persyaratan terkait. Tetap hapus?`, function() {
                delete window.builderReqMap[name];
                builderKeperluanList.splice(index, 1);
                renderBuilderKeperluanList();
                pushToast("Keperluan telah dihapus.", "success");
            });
        } else {
            builderKeperluanList.splice(index, 1);
            renderBuilderKeperluanList();
            pushToast("Keperluan telah dihapus.", "success");
        }
    }
}

export function openLayananEditor(id) {
            document.getElementById('subview-admin-daftar-layanan').classList.add('hidden');
            document.getElementById('subview-admin-layanan').classList.remove('hidden');
            let titleEl = document.getElementById('unified-editor-title');
            if(id === '__NEW__') {
                document.getElementById('builder-select-layanan').value = '[+] TAMBAH LAYANAN BARU';
                if(titleEl) titleEl.innerText = 'Buat Layanan Baru';
            } else {
                document.getElementById('builder-select-layanan').value = id;
                if(titleEl) titleEl.innerText = 'Edit Layanan: ' + id;
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
            if (!container) return;
            container.innerHTML = "";

            let keys = Object.keys(builderReqMap);
            if (keys.length === 0) {
                container.innerHTML = '<p class="text-[10px] text-slate-400 italic py-1">Belum ada persyaratan ditambahkan.</p>';
                return;
            }

            keys.forEach(function (kep) {
                let html = '<div class="mb-3 last:mb-0 animate-fade-in">' +
                    '<div class="flex items-center gap-1.5 mb-1.5">' +
                    '<i class="fa-solid fa-folder text-[10px] text-narmadaGreen"></i>' +
                    '<span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">' + kep + '</span>' +
                    '</div>' +
                    '<div class="flex flex-wrap gap-1.5 pl-4">';

                builderReqMap[kep].forEach(function (req, idx) {
                    html += '<span class="req-chip inline-flex items-center gap-1 pl-2.5 pr-1 py-1 rounded-md border border-slate-200 bg-white text-[10px] font-semibold text-slate-700 group">' +
                        '<i class="fa-solid fa-file-circle-check text-[8px] text-emerald-500"></i> ' +
                        '<span class="max-w-[160px] truncate">' + req + '</span>' +
                        '<button onclick="removeRequirementFromKeperluan(\'' + kep + '\', ' + idx + ')" class="w-4 h-4 rounded flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all duration-150 cursor-pointer ml-0.5" title="Hapus">' +
                        '<i class="fa-solid fa-xmark text-[9px]"></i></button>' +
                        '</span>';
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

            try {
                    google.script.run.withSuccessHandler(layHandler).getLayananList();
                } catch (e) {
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
            if (select && select.value === "__ADD_NEW__" && wrapper) {
                wrapper.classList.remove('hidden');
                let inputEl = document.getElementById('builder-keperluan-new-input');
                if (inputEl) inputEl.focus();
            } else if (wrapper) {
                wrapper.classList.add('hidden');
            }
        }

export function saveNewKeperluanOption() {
            let inputNama = document.getElementById('builder-keperluan-new-input');
            let inputDoc = document.getElementById('builder-keperluan-new-doc');
            
            let nama = inputNama.value.trim();
            let doc = inputDoc.value.trim();
            
            if (!nama) {
                pushToast("Ketik nama keperluan terlebih dahulu!", "error");
                return;
            }

            let exists = builderKeperluanList.find(k => k.nama.toLowerCase() === nama.toLowerCase());
            if (exists) {
                pushToast("Keperluan '" + nama + "' sudah terdaftar!", "error");
                return;
            }

            builderKeperluanList.push({ nama: nama, doc: doc });
            renderBuilderKeperluanList();

            inputNama.value = "";
            inputDoc.value = "";
            pushToast("Keperluan '" + nama + "' berhasil ditambahkan!", "success");
        }

export function cancelNewKeperluanOption() {
            let inputEl = document.getElementById('builder-keperluan-new-input');
            if (inputEl) inputEl.value = "";
            let wrapperEl = document.getElementById('wrapper-new-keperluan');
            if (wrapperEl) wrapperEl.classList.add('hidden');
            let selectEl = document.getElementById('builder-keperluan-select');
            if (selectEl) selectEl.value = "";
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
                        '<div class="flex flex-col gap-2 items-center justify-center">' +
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

            try {
                    google.script.run.withSuccessHandler(successHandler).getLayananList();
                } catch (e) {
                    setTimeout(function () { successHandler(dummyLayananList); }, 200);
                }

        }

export function populateBuilderLayananToEdit(id) {
            let list = window.loadedLayananList || dummyLayananList;
            let found = list.find(l => l.id === id);
            if (!found) return;

            document.getElementById('builder-select-layanan').value = found.nama;
            document.getElementById('wrapper-builder-nama').classList.add('hidden');
            document.getElementById('builder-layanan-nama').value = found.nama;

            let titleEl = document.getElementById('unified-editor-title');
            if(titleEl) titleEl.innerHTML = '<i class="fa-solid fa-layer-group text-narmadaGreen mr-2"></i> Edit Layanan: ' + found.nama;
            
            document.querySelectorAll('input[name="builder-bidang"]').forEach(cb => cb.checked = false);
            if (found.bidang) {
                let savedBidang = found.bidang.split(',').map(b => b.trim());
                document.querySelectorAll('input[name="builder-bidang"]').forEach(cb => {
                    if (savedBidang.includes(cb.value)) cb.checked = true;
                });
            }
            
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

window.openRepeaterModal = function(editIndex = -1) {
    let modal = document.getElementById('modal-repeater-group');
    if (!modal) return;
    
    let selectKeperluan = document.getElementById('modal-repeater-keperluan');
    selectKeperluan.innerHTML = '<option value="Wajib">Wajib (Berlaku Semua Keperluan)</option>';
    let builderKepSelect = document.getElementById('builder-keperluan-select');
    if (builderKepSelect) {
        for (let i = 0; i < builderKepSelect.options.length; i++) {
            let val = builderKepSelect.options[i].value;
            if (val && val !== "__ADD_NEW__") {
                selectKeperluan.innerHTML += `<option value="${val}">${val}</option>`;
            }
        }
    }
    
    window.editingRepeaterIndex = editIndex;
    window.editingRepeaterId = null;
    let selectedIds = [];
    
    if (editIndex !== -1) {
        let q = builderQuestions[editIndex];
        window.editingRepeaterId = q.id;
        let meta = parseQuestionMetadata(q.name);
        selectKeperluan.value = meta.keperluan || "Wajib";
        try {
            let items = JSON.parse(q.options || "[]");
            selectedIds = items.map(item => item.id);
        } catch(e) {}
    }
    
    window.repeaterSelectedIdsForModal = selectedIds;
    window.renderRepeaterModalCheckboxes();
    
    modal.classList.remove('hidden');
    setTimeout(() => { modal.classList.remove('opacity-0'); modal.querySelector('.transform').classList.remove('scale-95'); }, 10);
}

window.closeRepeaterModal = function() {
    let modal = document.getElementById('modal-repeater-group');
    if (!modal) return;
    modal.classList.add('opacity-0');
    modal.querySelector('.transform').classList.add('scale-95');
    setTimeout(() => { modal.classList.add('hidden'); }, 300);
}

window.renderRepeaterModalCheckboxes = function() {
    let container = document.getElementById('modal-repeater-checkboxes');
    let keperluan = document.getElementById('modal-repeater-keperluan').value;
    
    if (!container) return;
    container.innerHTML = "";
    
    let availableQuestions = builderQuestions.filter(q => {
        let meta = parseQuestionMetadata(q.name);
        return q.type !== "repeater" && !q.options?.startsWith("CONDITION_CHILD:") && (meta.keperluan === keperluan || meta.keperluan === "Wajib");
    });
    
    if (window.editingRepeaterIndex !== -1) {
        let editingGroup = builderQuestions.find(q => q.id === window.editingRepeaterId);
        if (editingGroup) {
            try {
                let innerItems = JSON.parse(editingGroup.options || "[]");
                innerItems.forEach(innerQ => {
                    let meta = parseQuestionMetadata(innerQ.name);
                    if (meta.keperluan === keperluan || meta.keperluan === "Wajib") {
                        if (!availableQuestions.some(aq => aq.id === innerQ.id)) {
                            availableQuestions.push(innerQ);
                        }
                    }
                });
            } catch(e){}
        }
    }
    
    if (availableQuestions.length === 0) {
        container.innerHTML = '<div class="text-center text-[10px] text-slate-400 italic py-4">Tidak ada pertanyaan yang tersedia untuk keperluan ini.</div>';
        return;
    }
    
    availableQuestions.forEach(q => {
        let meta = parseQuestionMetadata(q.name);
        let isChecked = window.repeaterSelectedIdsForModal.includes(q.id) ? "checked" : "";
        let escapedJson = JSON.stringify(q).replace(/'/g, "&#39;").replace(/"/g, "&quot;");
        let html = `
            <label class="flex items-start gap-3 p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition-colors">
                <input type="checkbox" value="${q.id}" data-qstr="${escapedJson}" class="repeater-cbx mt-1 text-indigo-600 focus:ring-indigo-500 rounded border-slate-300" ${isChecked}>
                <div class="flex-grow">
                    <div class="text-xs font-bold text-slate-700">[${meta.keperluan}] ${meta.cleanName}</div>
                    <div class="text-[10px] text-slate-500">Tipe: ${q.type}</div>
                </div>
            </label>
        `;
        container.innerHTML += html;
    });
}

window.saveRepeaterFromModal = function() {
    let keperluan = document.getElementById('modal-repeater-keperluan').value;
    let checkboxes = document.querySelectorAll('.repeater-cbx');
    
    let groupedQuestions = [];
    let selectedIds = [];
    
    checkboxes.forEach(cb => {
        if (cb.checked) {
            selectedIds.push(cb.value);
            groupedQuestions.push(JSON.parse(cb.getAttribute('data-qstr').replace(/&quot;/g, '"')));
        }
    });
    
    if (groupedQuestions.length === 0) {
        pushToast("Pilih minimal satu pertanyaan untuk dimasukkan ke grup!", "error");
        return;
    }
    
    let metaFirst = parseQuestionMetadata(groupedQuestions[0].name);
    let judul = "Grup Berulang: " + metaFirst.cleanName + (groupedQuestions.length > 1 ? " dll" : "");
    let formattedName = "{" + keperluan + ";;} " + judul;
    
    let newRepeaterObj = {
        id: "FLD-" + Math.random().toString(36).substr(2, 5).toUpperCase(),
        label: formattedName,
        name: formattedName,
        type: "repeater",
        options: JSON.stringify(groupedQuestions),
        required: "ya"
    };
    
    // Clean up builderQuestions: Remove selected ones so they don't duplicate
    builderQuestions = builderQuestions.filter(bq => !selectedIds.includes(bq.id));
    
    // Re-add unchecked ones back to flat array
    checkboxes.forEach(cb => {
        if (!cb.checked) {
            let q = JSON.parse(cb.getAttribute('data-qstr').replace(/&quot;/g, '"'));
            if (!builderQuestions.some(bq => bq.id === q.id)) {
                builderQuestions.push(q);
            }
        }
    });
    
    if (window.editingRepeaterIndex !== -1 && window.editingRepeaterId) {
        let idx = builderQuestions.findIndex(bq => bq.id === window.editingRepeaterId);
        if (idx !== -1) {
            newRepeaterObj.id = builderQuestions[idx].id;
            builderQuestions[idx] = newRepeaterObj;
        } else {
             builderQuestions.push(newRepeaterObj);
        }
        pushToast("Grup pertanyaan berhasil diupdate.", "success");
    } else {
        builderQuestions.push(newRepeaterObj);
        pushToast("Grup pertanyaan berhasil ditambahkan.", "success");
    }
    
    builderQuestions.sort(function (a, b) {
        let metaA = parseQuestionMetadata(a.name);
        let metaB = parseQuestionMetadata(b.name);
        if (metaA.keperluan === "Wajib" && metaB.keperluan !== "Wajib") return -1;
        if (metaB.keperluan === "Wajib" && metaA.keperluan !== "Wajib") return 1;
        if (metaA.keperluan < metaB.keperluan) return -1;
        if (metaA.keperluan > metaB.keperluan) return 1;
        if (a.type === "repeater" && b.type !== "repeater") return 1;
        if (b.type === "repeater" && a.type !== "repeater") return -1;
        return 0;
    });
    
    window.closeRepeaterModal();
    renderBuilderQuestionsUIList();
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

            let conditionParentId = document.getElementById('builder-q-condition-parent-id') ? document.getElementById('builder-q-condition-parent-id').value : "";
            let conditionValue = document.getElementById('builder-q-condition-value') ? document.getElementById('builder-q-condition-value').value : "";

            let newQuestionObj = {
                id: "FLD-" + Math.random().toString(36).substr(2, 5).toUpperCase(),
                label: formattedName,
                name: formattedName,
                type: type,
                options: finalOptions,
                required: reqStatus
            };

            if (conditionParentId && conditionValue && document.getElementById('wrapper-q-condition') && !document.getElementById('wrapper-q-condition').classList.contains('hidden')) {
                newQuestionObj.conditionField = conditionParentId;
                newQuestionObj.conditionValue = conditionValue;
            }

            if (window.editingQuestionIndex !== -1) {
                newQuestionObj.id = builderQuestions[window.editingQuestionIndex].id; // Pertahankan ID
                if (builderQuestions[window.editingQuestionIndex].conditionField) {
                    // Retain conditional logic if editing an existing conditional field
                    newQuestionObj.conditionField = builderQuestions[window.editingQuestionIndex].conditionField;
                    newQuestionObj.conditionValue = builderQuestions[window.editingQuestionIndex].conditionValue;
                }
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
            
            // Reset Conditional Wrapper
            let wrapperCond = document.getElementById('wrapper-q-condition');
            if (wrapperCond) {
                wrapperCond.classList.add('hidden');
                document.getElementById('builder-q-condition-parent-id').value = "";
                document.getElementById('builder-q-condition-parent-name').value = "";
                document.getElementById('builder-q-condition-value').innerHTML = "";
            }
            let formTitle = document.getElementById('builder-q-form-title');
            if (formTitle) formTitle.innerHTML = '<i class="fa-solid fa-question-circle text-blue-600"></i> Buat Pertanyaan Utama';

            renderBuilderQuestionsUIList();
        }

window.openConditionalBuilder = function(index) {
    let parentQ = builderQuestions[index];
    if (parentQ.type !== "dropdown") {
        pushToast("Hanya pertanyaan tipe dropdown yang dapat dicabangkan!", "error");
        return;
    }
    cancelEditBuilderQuestion();
    
    let meta = parseQuestionMetadata(parentQ.name);
    
    document.getElementById('wrapper-q-condition').classList.remove('hidden');
    document.getElementById('builder-q-condition-parent-id').value = parentQ.id;
    document.getElementById('builder-q-condition-parent-name').value = meta.cleanName;
    
    let selectEl = document.getElementById('builder-q-condition-value');
    selectEl.innerHTML = "";
    let opts = parentQ.options.split(',').map(o => o.trim()).filter(o => o !== "");
    opts.forEach(o => {
        let opt = document.createElement('option');
        opt.value = o;
        opt.text = o;
        selectEl.appendChild(opt);
    });
    
    document.getElementById('builder-q-keperluan').value = meta.keperluan || "Wajib";
    
    let formTitle = document.getElementById('builder-q-form-title');
    if (formTitle) formTitle.innerHTML = '<i class="fa-solid fa-code-branch text-indigo-600"></i> Buat Pertanyaan Lanjutan';
    
    document.getElementById('builder-step-2').scrollIntoView({ behavior: 'smooth', block: 'start' });
    pushToast("Silakan atur pertanyaan lanjutan untuk " + meta.cleanName, "success");
}

export function editBuilderQuestion(index) {
            let q = builderQuestions[index];
            let meta = parseQuestionMetadata(q.name);
            let baseType = q.type;

            if (baseType === "repeater") {
                cancelEditBuilderQuestion(); // Reset form standard
                window.openRepeaterModal(index);
                return;
            }

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

            let wrapperCond = document.getElementById('wrapper-q-condition');
            if (wrapperCond) {
                wrapperCond.classList.add('hidden');
                document.getElementById('builder-q-condition-parent-id').value = "";
                document.getElementById('builder-q-condition-parent-name').value = "";
                document.getElementById('builder-q-condition-value').innerHTML = "";
            }
            let formTitle = document.getElementById('builder-q-form-title');
            if (formTitle) formTitle.innerHTML = '<i class="fa-solid fa-question-circle text-blue-600"></i> Buat Pertanyaan Utama';

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

                let renderItem = function(item, depth, indexNum) {
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
                    
                    let numberStr = '<span class="font-bold text-slate-800 text-[10px] w-4 shrink-0 mt-0.5 inline-block">' + indexNum + '.</span>';
                    let highlightClass = (window.editingQuestionIndex === item.index) ? "border-amber-400 bg-amber-50" : "border-slate-100 bg-slate-50";

                    let marginLeft = depth > 0 ? ('ml-' + (depth * 4)) : '';
                    let conditionLabel = item.data.conditionField ? `<div class="text-[9px] text-indigo-600 font-bold mb-1"><i class="fa-solid fa-arrow-turn-up fa-rotate-90"></i> Muncul jika menjawab: "${item.data.conditionValue}"</div>` : '';

                    groupHtml += '<div class="builder-q-row flex items-center justify-between p-2 rounded-lg border ' + highlightClass + ' text-[10px] font-semibold text-slate-700 ' + marginLeft + ' transition-all" ' +
                        'draggable="true" ondragstart="handleDragStart(event, ' + item.index + ')" ondragover="handleDragOver(event)" ondrop="handleDrop(event, ' + item.index + ')" ondragend="handleDragEnd(event)">' +
                        '<div class="flex items-start gap-1">' +
                        '<div class="cursor-grab hover:text-slate-600 text-slate-300 py-1 pr-1" title="Drag to reorder"><i class="fa-solid fa-grip-dots-vertical"></i></div>' +
                        numberStr + 
                        '<div>' + conditionLabel + titleStr + '<span><i class="fa-solid fa-check text-emerald-500 mr-1"></i> ' + item.meta.cleanName + reqLabel + ' <span class="text-slate-400 block mt-0.5">' + detail + '</span></span></div></div>' +
                        '<div class="relative shrink-0 ml-2">' +
                        '<button type="button" onclick="toggleKebabMenu(event, \'kebab-menu-' + item.index + '\')" class="text-slate-400 hover:bg-slate-100 hover:text-slate-700 px-2.5 py-1.5 rounded-lg transition-colors"><i class="fa-solid fa-ellipsis-vertical"></i></button>' +
                        '<div id="kebab-menu-' + item.index + '" class="kebab-dropdown hidden absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50 text-left overflow-hidden">' +
                            (baseType === "dropdown" ? '<button type="button" onclick="openConditionalBuilder(' + item.index + ')" class="w-full text-left px-4 py-2 hover:bg-indigo-50 text-indigo-600 text-[10px] font-bold border-b border-slate-50"><i class="fa-solid fa-code-branch w-4"></i> Buat Lanjutan</button>' : '') +
                            '<button type="button" onclick="duplicateBuilderQuestion(' + item.index + ')" class="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 text-[10px] font-bold"><i class="fa-solid fa-copy w-4"></i> Duplikat</button>' +
                            '<button type="button" onclick="editBuilderQuestion(' + item.index + ')" class="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 text-[10px] font-bold"><i class="fa-solid fa-edit w-4"></i> Edit</button>' +
                            '<div class="border-t border-slate-100 my-1"></div>' +
                            '<button type="button" onclick="removeBuilderQuestion(' + item.index + ')" class="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 text-[10px] font-bold"><i class="fa-solid fa-trash w-4"></i> Hapus</button>' +
                        '</div>' +
                        '</div>' +
                        '</div>';

                    // Find children
                    let children = groupedQ[kep].filter(child => child.data.conditionField === item.data.id);
                    children.forEach((child, cIdx) => renderItem(child, depth + 1, indexNum + "." + (cIdx + 1)));
                };

                let roots = groupedQ[kep].filter(item => !item.data.conditionField);
                roots.forEach((item, rIdx) => renderItem(item, 0, (rIdx + 1).toString()));

                groupHtml += '</div></div>';
                container.innerHTML += groupHtml;
            });
            populateBuilderRepeaterSelect();
        }

export function submitBuilderDataToServer() {
            let selectVal = document.getElementById('builder-select-layanan').value;
            let isNew = selectVal === "[+] TAMBAH LAYANAN BARU";
            let name = document.getElementById('builder-layanan-nama').value.trim();
            let bidangChecked = [];
            document.querySelectorAll('input[name="builder-bidang"]:checked').forEach(cb => bidangChecked.push(cb.value));
            let bidangStr = bidangChecked.join(',');
            let templateDocIdEl = document.getElementById('builder-template-doc-id');
            let templateDocId = templateDocIdEl ? templateDocIdEl.value.trim() : "";
            let templatePratinjauEl = document.getElementById('builder-template-pratinjau');
            let templatePratinjau = templatePratinjauEl ? templatePratinjauEl.value.trim() : "";

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
            let payload_id = "";
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
                bidang: bidangStr,
                templateDocId: templateDocId,
                templatePratinjau: templatePratinjau
            };

            let action = payload.id ? "update" : "create";

            let saveBtn = document.getElementById('ev-bind-31');
            let originalText = "";
            if (saveBtn) {
                originalText = saveBtn.innerHTML;
                saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1.5"></i> Menyimpan...';
                saveBtn.disabled = true;
                saveBtn.classList.add('opacity-70', 'cursor-not-allowed');
                saveBtn.classList.remove('cursor-pointer', 'hover:scale-[1.02]', 'active:scale-[0.98]');
            }

            google.script.run
                    .withSuccessHandler(function (res) {
                        if (saveBtn) {
                            saveBtn.innerHTML = originalText;
                            saveBtn.disabled = false;
                            saveBtn.classList.remove('opacity-70', 'cursor-not-allowed');
                            saveBtn.classList.add('cursor-pointer', 'hover:scale-[1.02]', 'active:scale-[0.98]');
                        }
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
                    .withFailureHandler(function (err) {
                        if (saveBtn) {
                            saveBtn.innerHTML = originalText;
                            saveBtn.disabled = false;
                            saveBtn.classList.remove('opacity-70', 'cursor-not-allowed');
                            saveBtn.classList.add('cursor-pointer', 'hover:scale-[1.02]', 'active:scale-[0.98]');
                        }
                        pushToast("Terjadi kesalahan jaringan atau server.", "error");
                    })
                    .crudLayanan(localStorage.getItem('adminToken_Narmada'), action, payload);

        }

export function resetBuilderFormState() {
            builderKeperluanList = [];
            renderBuilderKeperluanList();
            document.getElementById("builder-keperluan-new-input").value = "";
            document.getElementById("builder-keperluan-new-doc").value = "";
            document.getElementById('builder-select-layanan').value = "[+] TAMBAH LAYANAN BARU";
            document.getElementById('builder-layanan-nama').value = "";
            let titleEl = document.getElementById('unified-editor-title');
            if(titleEl) titleEl.innerHTML = '<i class="fa-solid fa-layer-group text-narmadaGreen mr-2"></i> Buat Layanan Baru';
            document.querySelectorAll('input[name="builder-bidang"]').forEach(cb => cb.checked = false);
            let docIdEl = document.getElementById('builder-template-doc-id');
            if (docIdEl) docIdEl.value = "";
            let pratinjauEl = document.getElementById('builder-template-pratinjau');
            if (pratinjauEl) pratinjauEl.value = "";
            let wrapperNamaEl = document.getElementById('wrapper-builder-nama');
            if (wrapperNamaEl) wrapperNamaEl.classList.remove('hidden');

            let selectKeperluan = document.getElementById('builder-keperluan-select');
            if (selectKeperluan) {
                selectKeperluan.innerHTML = '<option value="">-- Pilih atau Tambah Keperluan --</option>' +
                    '<option value="__ADD_NEW__" class="font-extrabold text-emerald-600">[+] TAMBAH KEPERLUAN BARU...</option>';
            }

            let wrapperNew = document.getElementById('wrapper-new-keperluan');
            if (wrapperNew) wrapperNew.classList.add('hidden');

            builderQuestions = [];
            builderReqMap = {};

            cancelEditBuilderQuestion();
            renderBuilderQuestionsUIList();
            initStep2RequirementsBuilder();
            initStep3QuestionsBuilder();
        }

export function deleteBuilderMasterLayanan(nama) {
            askConfirmation("Hapus Layanan", "Apakah Anda yakin ingin menghapus layanan '" + nama + "' dari sistem secara permanen?", function () {
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

            });
        }

export let currentRepeaterGroup = [];

export let editingRepeaterIndex = -1;

document.addEventListener('DOMContentLoaded', function() {
    // Bind real-time summary updates
    document.getElementById('builder-layanan-nama')?.addEventListener('input', updateSummaryPanel);
    document.getElementById('builder-keperluan-select')?.addEventListener('change', updateSummaryPanel);
});

// Drawer Functions
export function openDrawer(drawerId) {
    document.getElementById('drawer-overlay')?.classList.add('is-open');
    document.getElementById(drawerId)?.classList.add('is-open');
}

export function closeAllDrawers() {
    document.getElementById('drawer-overlay')?.classList.remove('is-open');
    document.querySelectorAll('.drawer-panel').forEach(el => el.classList.remove('is-open'));
}

// Summary Panel Logic
export function updateSummaryPanel() {
    let nama = document.getElementById('builder-layanan-nama')?.value || '-';
    let summaryNamaEl = document.getElementById('summary-nama');
    if (summaryNamaEl) summaryNamaEl.innerText = nama;
    
    let isNew = document.getElementById('builder-select-layanan')?.value === "[+] TAMBAH LAYANAN BARU";
    let summaryStatus = document.getElementById('summary-status');
    let summaryStatusDot = document.getElementById('summary-status-dot');
    
    if (summaryStatus && summaryStatusDot) {
        if (isNew) {
            summaryStatus.innerText = "Draft Baru";
            summaryStatusDot.className = "w-1.5 h-1.5 rounded-full bg-slate-400";
        } else {
            summaryStatus.innerText = "Perubahan";
            summaryStatusDot.className = "w-1.5 h-1.5 rounded-full bg-amber-500";
        }
    }
    
    // Keperluan Count
    let selectKeperluan = document.getElementById('builder-keperluan-select');
    let kepCount = 0;
    if (selectKeperluan) {
        for (let i = 0; i < selectKeperluan.options.length; i++) {
            let val = selectKeperluan.options[i].value;
            if (val && val !== "__ADD_NEW__") kepCount++;
        }
    }
    let kepEl = document.getElementById('summary-count-keperluan');
    if (kepEl) kepEl.innerText = kepCount;
    
    // Requirements Count
    let reqCount = 0;
    if (typeof builderReqMap !== 'undefined') {
        Object.keys(builderReqMap).forEach(k => {
            reqCount += builderReqMap[k].length;
        });
    }
    let reqEl = document.getElementById('summary-count-syarat');
    if (reqEl) reqEl.innerText = reqCount;
    
    // Questions Count
    let qCount = (typeof builderQuestions !== 'undefined') ? builderQuestions.length : 0;
    let qEl = document.getElementById('summary-count-tanya');
    if (qEl) qEl.innerText = qCount;
}

// === KEBAB MENU & DRAG AND DROP GLOBALS === //

window.toggleKebabMenu = function(e, id) {
    e.stopPropagation();
    let menu = document.getElementById(id);
    let isHidden = menu.classList.contains('hidden');
    // Hide all menus first
    document.querySelectorAll('.kebab-dropdown').forEach(d => d.classList.add('hidden'));
    if (isHidden) {
        menu.classList.remove('hidden');
    }
}

document.addEventListener('click', function() {
    document.querySelectorAll('.kebab-dropdown').forEach(d => d.classList.add('hidden'));
});

let draggedItemIndex = null;

window.handleDragStart = function(e, index) {
    draggedItemIndex = index;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index);
    setTimeout(() => { e.target.classList.add('opacity-40'); }, 0);
}

window.handleDragOver = function(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
}

window.handleDrop = function(e, targetIndex) {
    e.stopPropagation();
    e.preventDefault();
    
    document.querySelectorAll('.builder-q-row').forEach(row => row.classList.remove('opacity-40'));

    if (draggedItemIndex !== null && draggedItemIndex !== targetIndex) {
        let draggedMeta = parseQuestionMetadata(builderQuestions[draggedItemIndex].name);
        let targetMeta = parseQuestionMetadata(builderQuestions[targetIndex].name);
        
        if (draggedMeta.keperluan !== targetMeta.keperluan) {
            pushToast("Hanya dapat menggeser dalam Keperluan yang sama!", "error");
            return false;
        }

        let item = builderQuestions.splice(draggedItemIndex, 1)[0];
        
        if (draggedItemIndex < targetIndex) {
            targetIndex--;
        }
        
        builderQuestions.splice(targetIndex, 0, item);
        renderBuilderQuestionsUIList();
    }
    draggedItemIndex = null;
    return false;
}

window.handleDragEnd = function(e) {
    e.target.classList.remove('opacity-40');
}

// Preview Generation Logic
export function updatePreviewLayanan() {
    let nama = document.getElementById('builder-layanan-nama')?.value || 'Nama Layanan';
    let previewTitle = document.getElementById('preview-title');
    if(previewTitle) previewTitle.innerText = nama;
    
    let dSec = "Pilih keperluan pengurusan surat Anda.";
    let previewDesc = document.getElementById('preview-desc');
    if(previewDesc) previewDesc.innerText = dSec;
    
    // Update validations
    let vInfo = document.getElementById('val-info');
    let vKep = document.getElementById('val-kep');
    let vReq = document.getElementById('val-req');
    let vQst = document.getElementById('val-qst');
    
    if(vInfo) vInfo.innerHTML = nama && nama !== '-' ? '<i class="fa-solid fa-check-circle text-emerald-500 mt-0.5"></i> <span>Informasi dasar lengkap</span>' : '<i class="fa-solid fa-circle-xmark text-red-500 mt-0.5"></i> <span>Nama layanan kosong</span>';
    
    let selectKeperluan = document.getElementById('builder-keperluan-select');
    let kepCount = 0;
    if (selectKeperluan) {
        for (let i = 0; i < selectKeperluan.options.length; i++) {
            let val = selectKeperluan.options[i].value;
            if (val && val !== "__ADD_NEW__") kepCount++;
        }
    }
    
    if(vKep) vKep.innerHTML = kepCount > 0 ? '<i class="fa-solid fa-check-circle text-emerald-500 mt-0.5"></i> <span>Terdapat ' + kepCount + ' keperluan</span>' : '<i class="fa-solid fa-circle-xmark text-red-500 mt-0.5"></i> <span>Belum ada keperluan</span>';
    
    let reqCount = 0;
    if (typeof builderReqMap !== 'undefined') {
        Object.keys(builderReqMap).forEach(k => reqCount += builderReqMap[k].length);
    }
    if(vReq) vReq.innerHTML = reqCount > 0 ? '<i class="fa-solid fa-check-circle text-emerald-500 mt-0.5"></i> <span>Persyaratan telah dikonfigurasi</span>' : '<i class="fa-solid fa-circle-exclamation text-amber-500 mt-0.5"></i> <span>Belum ada persyaratan</span>';
    
    let qCount = (typeof builderQuestions !== 'undefined') ? builderQuestions.length : 0;
    if(vQst) vQst.innerHTML = qCount > 0 ? '<i class="fa-solid fa-check-circle text-emerald-500 mt-0.5"></i> <span>Pertanyaan tambahan telah diatur</span>' : '<i class="fa-solid fa-circle-exclamation text-amber-500 mt-0.5"></i> <span>Tidak ada pertanyaan tambahan</span>';
}

window.deleteKeperluanAtIndex = deleteKeperluanAtIndex;
window.openDrawer = openDrawer;
window.closeAllDrawers = closeAllDrawers;
window.updateSummaryPanel = updateSummaryPanel;
window.updatePreviewLayanan = updatePreviewLayanan;
