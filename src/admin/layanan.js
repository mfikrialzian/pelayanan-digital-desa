
export let builderKeperluanList = []; // Array of {nama, templatePratinjau, _isEditing}

export function renderBuilderKeperluanList() {
    let container = document.getElementById('builder-keperluan-workspace');
    let hiddenSelect = document.getElementById('builder-keperluan-select');
    
    if (container) container.innerHTML = "";
    if (hiddenSelect) hiddenSelect.innerHTML = '<option value="">-- Pilih / Edit Keperluan --</option>';
    
    if (builderKeperluanList.length === 0) {
        if (container) {
            container.innerHTML = '<div class="text-center py-8 text-slate-400 text-xs italic bg-slate-50 rounded-xl border border-dashed border-slate-200">Belum ada keperluan ditambahkan. Klik tombol di bawah untuk menambah.</div>';
        }
    } else {
        builderKeperluanList.forEach((item, index) => {
            let html = `
            <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm relative group transition-all hover:border-narmadaGreen hover:shadow-md mb-3">
                <div class="flex justify-between items-start mb-2">
                    <h4 class="font-bold text-sm text-slate-800">${item.nama}</h4>
                    <div class="flex gap-2">
                        <button type="button" onclick="window.openKeperluanModal(${index})" class="w-7 h-7 rounded-lg bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center border border-slate-100" title="Edit">
                            <i class="fa-solid fa-pen text-[10px]"></i>
                        </button>
                        <button type="button" onclick="deleteKeperluanAtIndex(${index})" class="w-7 h-7 rounded-lg bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center border border-slate-100" title="Hapus">
                            <i class="fa-solid fa-trash text-[10px]"></i>
                        </button>
                    </div>
                </div>
                ${item.templatePratinjau ? `
                <div class="bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-2 relative overflow-hidden flex items-center gap-2">
                    <div class="absolute top-0 left-0 w-1 h-full bg-narmadaGreen/50"></div>
                    <i class="fa-solid fa-link text-slate-400 text-xs ml-1"></i>
                    <a href="${item.templatePratinjau}" target="_blank" class="text-xs font-semibold text-blue-600 hover:underline line-clamp-1 truncate w-full" title="${item.templatePratinjau}">${item.templatePratinjau}</a>
                </div>` : ''}
            </div>`;
            if (container) container.innerHTML += html;
            
            if (hiddenSelect) {
                let opt = document.createElement('option');
                opt.value = item.nama;
                opt.text = item.nama;
                hiddenSelect.add(opt);
            }
        });
    }
    
    let globalTemplate = document.getElementById('builder-template-pratinjau');
    if(globalTemplate) {
        let tmplMap = {};
        builderKeperluanList.forEach(k => { if(k.templatePratinjau) tmplMap[k.nama] = k.templatePratinjau; });
        globalTemplate.value = JSON.stringify(tmplMap);
    }
    
    if (typeof initStep2RequirementsBuilder === 'function') initStep2RequirementsBuilder();
    if (typeof renderBuilderPersyaratanTabs === 'function') renderBuilderPersyaratanTabs();
}

window.openKeperluanModal = function(index) {
    let modal = document.getElementById('modal-keperluan-editor');
    if(!modal) return;
    
    let idxInput = document.getElementById('modal-keperluan-index');
    let namaInput = document.getElementById('modal-keperluan-nama');
    let templateInput = document.getElementById('modal-keperluan-template');
    let titleEl = document.getElementById('modal-keperluan-title');
    
    idxInput.value = index;
    if(index >= 0 && builderKeperluanList[index]) {
        titleEl.innerHTML = '<i class="fa-solid fa-list-check text-narmadaGreen mr-2"></i> Edit Keperluan';
        namaInput.value = builderKeperluanList[index].nama || '';
        templateInput.value = builderKeperluanList[index].templatePratinjau || '';
    } else {
        titleEl.innerHTML = '<i class="fa-solid fa-list-check text-narmadaGreen mr-2"></i> Tambah Keperluan';
        namaInput.value = '';
        templateInput.value = '';
    }
    
    modal.classList.remove('hidden');
    setTimeout(() => { namaInput.focus(); }, 100);
};

window.closeKeperluanModal = function() {
    let modal = document.getElementById('modal-keperluan-editor');
    if(modal) modal.classList.add('hidden');
};

window.saveKeperluanFromModal = function() {
    let idx = parseInt(document.getElementById('modal-keperluan-index').value, 10);
    let namaInput = document.getElementById('modal-keperluan-nama');
    let templateInput = document.getElementById('modal-keperluan-template');
    
    let namaVal = (namaInput.value || '').trim();
    let tmplVal = (templateInput.value || '').trim();
    
    if(!namaVal) {
        pushToast('Nama keperluan wajib diisi!', 'warning');
        namaInput.focus();
        return;
    }
    
    // Check for duplicates
    let duplicate = builderKeperluanList.find((k, i) => i !== idx && k.nama.toLowerCase() === namaVal.toLowerCase());
    if(duplicate) {
        pushToast('Keperluan sudah ada!', 'error');
        namaInput.focus();
        return;
    }
    
    if(idx >= 0 && builderKeperluanList[idx]) {
        let oldName = builderKeperluanList[idx].nama;
        builderKeperluanList[idx].nama = namaVal;
        builderKeperluanList[idx].templatePratinjau = tmplVal;
        
        if(oldName && oldName !== namaVal) {
            // Sync persyaratan map if name changed
            if(window.builderReqMap && window.builderReqMap[oldName]) {
                window.builderReqMap[namaVal] = window.builderReqMap[oldName];
                delete window.builderReqMap[oldName];
            }
            // Sync questions
            if(window.builderQuestions) {
                window.builderQuestions.forEach(q => {
                    let meta = parseQuestionMetadata(q.name);
                    if(meta.keperluan === oldName) {
                        q.name = `{${namaVal};;${meta.halaman}}` + meta.asli;
                    }
                });
            }
        }
        pushToast('Keperluan berhasil disimpan', 'success');
    } else {
        builderKeperluanList.push({
            nama: namaVal,
            templatePratinjau: tmplVal
        });
        if(window.builderReqMap) {
            window.builderReqMap[namaVal] = [];
        }
        pushToast('Keperluan berhasil ditambahkan', 'success');
    }
    
    closeKeperluanModal();
    renderBuilderKeperluanList();
    if (typeof renderBuilderQuestionsUIList === 'function') renderBuilderQuestionsUIList();
};

export function deleteKeperluanAtIndex(index) {
    if (index >= 0 && index < builderKeperluanList.length) {
        let name = builderKeperluanList[index].nama;
        
        if (!name) {
            builderKeperluanList.splice(index, 1);
            renderBuilderKeperluanList();
            return;
        }
        
        let hasReq = window.builderReqMap && window.builderReqMap[name];
        let hasQuestions = window.builderQuestions && window.builderQuestions.some(q => parseQuestionMetadata(q.name).keperluan === name);
        
        if (hasReq || hasQuestions) {
            askConfirmation("Hapus Keperluan", `Keperluan '${name}' memiliki persyaratan dokumen atau pertanyaan isian terkait. Tetap hapus semua konfigurasi tersebut?`, function() {
                if (window.builderReqMap) {
                    delete window.builderReqMap[name];
                }
                if (window.builderQuestions) {
                    window.builderQuestions = window.builderQuestions.filter(q => parseQuestionMetadata(q.name).keperluan !== name);
                }
                
                builderKeperluanList.splice(index, 1);
                renderBuilderKeperluanList();
                
                if (typeof renderRequirementsMappingList === 'function') renderRequirementsMappingList();
                if (typeof renderBuilderQuestionsUIList === 'function') renderBuilderQuestionsUIList();
                if (typeof initStep2RequirementsBuilder === 'function') initStep2RequirementsBuilder();
                if (typeof initStep3QuestionsBuilder === 'function') initStep3QuestionsBuilder();
                
                pushToast("Keperluan dan konfigurasi terkait berhasil dihapus.", "success");
            });
        } else {
            builderKeperluanList.splice(index, 1);
            renderBuilderKeperluanList();
            
            if (typeof renderRequirementsMappingList === 'function') renderRequirementsMappingList();
            if (typeof renderBuilderQuestionsUIList === 'function') renderBuilderQuestionsUIList();
            if (typeof initStep2RequirementsBuilder === 'function') initStep2RequirementsBuilder();
            if (typeof initStep3QuestionsBuilder === 'function') initStep3QuestionsBuilder();
            
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
    renderBuilderQuestionsUIList();
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

export let currentPersyaratanTab = 'Wajib';

window.switchPersyaratanTab = function(tabName) {
    currentPersyaratanTab = tabName;
    renderBuilderPersyaratanTabs();
};

export function renderBuilderPersyaratanTabs() {
    let tabsContainer = document.getElementById('builder-persyaratan-tabs');
    let selKeperluan = document.getElementById('builder-req-keperluan');
    if(!tabsContainer) return;
    
    let kepNames = builderKeperluanList.map(k => k.nama).filter(n => n);
    kepNames.unshift('Wajib');
    
    if(!kepNames.includes(currentPersyaratanTab)) {
        currentPersyaratanTab = kepNames[0];
    }
    
    tabsContainer.innerHTML = '';
    kepNames.forEach(kep => {
        let active = (kep === currentPersyaratanTab);
        let badgeCount = window.builderReqMap && window.builderReqMap[kep] ? window.builderReqMap[kep].length : 0;
        
        let activeClasses = active ? 'bg-emerald-50 text-narmadaGreen border-narmadaGreen' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50';
        let badgeClasses = active ? 'bg-narmadaGreen text-white' : 'bg-slate-200 text-slate-500';
        
        let html = `
        <button type="button" onclick="window.switchPersyaratanTab('${kep}')" class="shrink-0 flex items-center gap-2 px-4 py-2 border rounded-full text-xs font-bold transition-all ${activeClasses}">
            ${kep}
            <span class="inline-flex items-center justify-center w-5 h-5 rounded-full text-[9px] ${badgeClasses}">${badgeCount}</span>
        </button>`;
        tabsContainer.innerHTML += html;
    });
    
    if(selKeperluan) {
        selKeperluan.innerHTML = '';
        kepNames.forEach(kep => {
            let opt = document.createElement('option');
            opt.value = kep;
            opt.text = kep;
            if(kep === currentPersyaratanTab) opt.selected = true;
            selKeperluan.add(opt);
        });
    }
    
    renderRequirementsMappingList();
}

export function renderRequirementsMappingList() {
    let container = document.getElementById('builder-persyaratan-workspace');
    if (!container) {
        // Fallback backward compat if not updated HTML
        container = document.getElementById('builder-req-mapping-list'); 
        if(!container) return;
    }
    container.innerHTML = "";
    
    if (!window.builderReqMap) window.builderReqMap = {};
    let reqs = window.builderReqMap[currentPersyaratanTab] || [];
    
    if (reqs.length === 0) {
        container.innerHTML = '<div class="text-center py-8 text-slate-400 text-xs italic">Belum ada persyaratan dokumen untuk keperluan ini.</div>';
        return;
    }
    
    reqs.forEach(function(req, idx) {
        let html = `
        <div class="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between group animate-fade-in mb-2">
            <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded bg-emerald-50 text-narmadaGreen flex items-center justify-center shrink-0">
                    <i class="fa-solid fa-file-circle-check text-xs"></i>
                </div>
                <span class="text-sm font-semibold text-slate-700">${req}</span>
            </div>
            <button type="button" onclick="removeRequirementFromKeperluan('${currentPersyaratanTab}', ${idx})" class="w-8 h-8 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center border border-transparent hover:border-red-100" title="Hapus">
                <i class="fa-solid fa-trash text-xs"></i>
            </button>
        </div>`;
        container.innerHTML += html;
    });
    
    // Update badge on tab if called independently
    let selKeperluan = document.getElementById('builder-req-keperluan');
    if(selKeperluan && selKeperluan.value !== currentPersyaratanTab) {
        renderBuilderPersyaratanTabs();
    }
}

window.openPersyaratanModal = function() {
    let modal = document.getElementById('modal-persyaratan-editor');
    if(!modal) return;
    
    let namaInput = document.getElementById('modal-persyaratan-nama');
    if (namaInput) namaInput.value = '';
    
    if (!currentPersyaratanTab) {
        pushToast('Pilih tab keperluan terlebih dahulu', 'warning');
        return;
    }
    
    modal.classList.remove('hidden');
    setTimeout(() => { if (namaInput) namaInput.focus(); }, 100);
};

window.closePersyaratanModal = function() {
    let modal = document.getElementById('modal-persyaratan-editor');
    if(modal) modal.classList.add('hidden');
};

window.savePersyaratanFromModal = function() {
    let namaInput = document.getElementById('modal-persyaratan-nama');
    let val = namaInput ? namaInput.value.trim() : '';
    
    if (!val) {
        pushToast('Nama persyaratan wajib diisi!', 'warning');
        if (namaInput) namaInput.focus();
        return;
    }
    
    if (!window.builderReqMap) window.builderReqMap = {};
    if (!window.builderReqMap[currentPersyaratanTab]) window.builderReqMap[currentPersyaratanTab] = [];
    
    if (window.builderReqMap[currentPersyaratanTab].includes(val)) {
        pushToast('Persyaratan sudah ada di tab ini!', 'error');
        if (namaInput) namaInput.focus();
        return;
    }
    
    window.builderReqMap[currentPersyaratanTab].push(val);
    closePersyaratanModal();
    renderRequirementsMappingList();
    renderBuilderPersyaratanTabs(); // update badges
};

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
                        ? '<div class="flex flex-wrap gap-1.5 items-start">' + keperluanList.map(k => '<span class="inline-block px-2 py-1 rounded-md text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100 text-center leading-tight shadow-sm">' + k + '</span>').join('') + '</div>'
                        : '<span class="inline-block px-2 py-1 rounded-md text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200 text-center leading-tight shadow-sm">Wajib (Tanpa Pilihan)</span>';

                    let bidangStr = row.bidang || "-";
                    let bidangList = bidangStr.split(',').map(b => b.trim()).filter(b => b && b !== "-");
                    let bidangHtml = bidangList.length > 0
                        ? '<div class="flex flex-wrap gap-1.5 items-start">' + bidangList.map(b => '<span class="inline-block px-2 py-1 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 text-center leading-tight shadow-sm">' + b + '</span>').join('') + '</div>'
                        : '<span class="text-slate-400 italic text-[10px]">-</span>';

                    let tr = '<tr class="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">' +
                        '<td class="py-4 px-2 text-center font-bold text-slate-400 text-xs">' + (index + 1) + '</td>' +
                        '<td class="py-4 px-4">' +
                        '<div class="font-bold text-slate-800 text-sm mb-0.5">' + (row.nama || "-") + '</div>' +
                        '<div class="text-[10px] text-slate-500 max-w-xs leading-relaxed">' + (row.deskripsi || "-") + '</div>' +
                        '</td>' +
                        '<td class="py-4 px-4 align-top">' + bidangHtml + '</td>' +
                        '<td class="py-4 px-4 align-top">' + kepHtml + '</td>' +
                        '<td class="py-4 px-4 text-center align-middle relative">' +
                        '<button onclick="toggleActionMenu(event, \'menu-aksi-' + index + '\')" class="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors focus:outline-none ml-auto mr-auto">' +
                        '<i class="fa-solid fa-ellipsis-vertical"></i>' +
                        '</button>' +
                        '<div id="menu-aksi-' + index + '" class="hidden action-dropdown-menu w-36 bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-slate-100 py-1.5 z-[100] text-left overflow-hidden">' +
                        '<button onclick="switchAdminTab(\'layanan\'); populateBuilderLayananToEdit(\'' + row.id + '\')" class="w-full text-left px-4 py-2.5 text-[11px] font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"><i class="fa-solid fa-pencil text-amber-500 w-3"></i> Edit</button>' +
                        '<button onclick="duplicateBuilderMasterLayanan(\'' + row.id + '\')" class="w-full text-left px-4 py-2.5 text-[11px] font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"><i class="fa-solid fa-copy text-blue-500 w-3"></i> Duplikat</button>' +
                        '<div class="border-t border-slate-100 my-1"></div>' +
                        '<button onclick="deleteBuilderMasterLayanan(\'' + row.nama + '\')" class="w-full text-left px-4 py-2.5 text-[11px] font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"><i class="fa-solid fa-trash w-3"></i> Hapus</button>' +
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
            document.getElementById('wrapper-builder-nama').classList.remove('hidden');
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
            builderKeperluanList = [];
            
            if (optionsStr) {
                let optionsArray = optionsStr.split(",");
                optionsArray.forEach(function (opt) {
                    let cleanOpt = opt.trim();
                    if (cleanOpt) {
                        let o = document.createElement('option');
                        o.value = cleanOpt;
                        o.text = cleanOpt;
                        selectKeperluan.add(o, selectKeperluan.options[selectKeperluan.options.length - 1]);
                        builderKeperluanList.push({ nama: cleanOpt, doc: "" });
                    }
                });
            }
            renderBuilderKeperluanList();

            window.builderQuestions = [];
            let savedPertanyaan = found.pertanyaan || "";
            if (savedPertanyaan) {
                let pArr = savedPertanyaan.split(";;;");
                pArr.forEach(function (pStr) {
                    try {
                        if(!pStr.trim()) return;
                        let pObj = JSON.parse(pStr);
                        let pKeperluan = pObj.keperluan || "Wajib";
                        let pName = "{" + pKeperluan + ";;" + pObj.label + "} " + pObj.label;
                        
                        let bq = {
                            id: pObj.id || ("FLD-" + Math.random().toString(36).substr(2, 5).toUpperCase()),
                            label: pObj.label,
                            name: pName,
                            type: pObj.type || "text",
                            options: pObj.options || "",
                            required: pObj.required ? "ya" : "tidak"
                        };
                        builderQuestions.push(bq);
                    } catch(e) {}
                });
            } else if (found.fields) {
                // Fallback backward compatibility
                try {
                    let fieldsArr = Array.isArray(found.fields) ? found.fields : [];
                    if (typeof found.fields === 'string') {
                        try { fieldsArr = JSON.parse(found.fields); } catch(e) { fieldsArr = []; }
                    }
                    if (!Array.isArray(fieldsArr)) fieldsArr = [];
                    
                    fieldsArr.forEach(function (f) {
                        let actualName = typeof f === 'string' ? f : (f.name || f.label || "");
                        if (!actualName) return;
                        
                        let displayType = (f && f.type) ? f.type : "text";
                        let typeMatch = actualName.match(/(.*)\s*\|\|(number|date)\|\|$/);
                        if (typeMatch) {
                            displayType = typeMatch[2];
                            actualName = typeMatch[1].trim();
                        }
    
                        builderQuestions.push({
                            id: (f && f.id) ? f.id : ("FLD-" + Math.random().toString(36).substr(2, 5).toUpperCase()),
                            label: (f && f.label) ? f.label : actualName,
                            name: actualName,
                            type: displayType,
                            options: (f && f.options) ? f.options : "",
                            required: (f && f.required) ? f.required : "ya"
                        });
                    });
                } catch(err) {
                    console.error("Error parsing fields for builder", err);
                }
            }

            window.builderReqMap = {};
            try {
                let savedSyarat = found.syarat || found.persyaratan || "";
                if (savedSyarat) {
                    let isJson = false;
                    try {
                        let parsed = JSON.parse(savedSyarat);
                        if (typeof parsed === 'object' && !Array.isArray(parsed)) {
                            isJson = true;
                            Object.keys(parsed).forEach(function(kep) {
                                parsed[kep].forEach(function(reqName) {
                                    if (!builderReqMap[kep]) builderReqMap[kep] = [];
                                    builderReqMap[kep].push(reqName);
                                });
                            });
                        }
                    } catch(e) {}
                    
                    if (!isJson) {
                        let syArr = savedSyarat.split(";;;");
                        syArr.forEach(function (sStr) {
                            let s = sStr.trim();
                            if (!s) return;
                            let match = s.match(/^\[(.*?)\]\s*(.*)$/);
                            if (match) {
                                let kep = match[1];
                                let reqName = match[2];
                                if (!builderReqMap[kep]) builderReqMap[kep] = [];
                                builderReqMap[kep].push(reqName);
                            } else {
                                if (!builderReqMap["Wajib"]) builderReqMap["Wajib"] = [];
                                builderReqMap["Wajib"].push(s);
                            }
                        });
                    }
                } else if (found.requirements) {
                    let reqs = found.requirements;
                    if (typeof reqs === 'string') {
                        try { reqs = JSON.parse(reqs); } catch(e) { reqs = []; }
                    }
                    if (!Array.isArray(reqs)) reqs = [];
                    
                    reqs.forEach(function (req) {
                        let reqName = typeof req === 'string' ? req : (req.name || "");
                        if (!reqName) return;
                        let match = reqName.match(/^\[(.*?)\]\s*(.*)$/);
                        if (match) {
                            let kep = match[1];
                            let reqNameInner = match[2];
                            if (!builderReqMap[kep]) builderReqMap[kep] = [];
                            builderReqMap[kep].push(reqNameInner);
                        } else {
                            if (!builderReqMap["Wajib"]) builderReqMap["Wajib"] = [];
                            builderReqMap["Wajib"].push(reqName);
                        }
                    });
                }
            } catch (err) {
                console.error("Error parsing requirements for builder", err);
            }

            try { renderBuilderQuestionsUIList(); } catch(e) { console.error("renderBuilderQuestionsUIList crashed", e); }
            try { renderRequirementsMappingList(); } catch(e) { console.error("renderRequirementsMappingList crashed", e); }
            pushToast("Konfigurasi '" + found.nama + "' berhasil dimuat.", "info");
            try { initStep2RequirementsBuilder(); } catch(e) { console.error("initStep2RequirementsBuilder crashed", e); }
            try { initStep3QuestionsBuilder(); } catch(e) { console.error("initStep3QuestionsBuilder crashed", e); }
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

window.builderKeperluanActive = "";

export function renderBuilderQuestionsUIList() {
    let container = document.getElementById('builder-workspace');
    let tabsContainer = document.getElementById('builder-keperluan-tabs');
    if (!container || !tabsContainer) return;

    let availableKeperluan = builderKeperluanList.map(k => k.nama);
    if(availableKeperluan.length === 0) {
        container.innerHTML = '<div class="text-center py-8 text-slate-400 text-xs italic">Silakan tambahkan keperluan terlebih dahulu di Langkah 3.</div>';
        tabsContainer.innerHTML = '';
        return;
    }

    if (!window.builderKeperluanActive || !availableKeperluan.includes(window.builderKeperluanActive)) {
        window.builderKeperluanActive = availableKeperluan[0];
    }

    let tabsHtml = '';
    availableKeperluan.forEach(kep => {
        let activeCls = (kep === window.builderKeperluanActive) 
            ? 'bg-narmadaGreen text-white shadow-sm border-narmadaGreen' 
            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50';
        tabsHtml += `<button type="button" onclick="window.builderKeperluanActive='${kep}'; window.renderBuilderQuestionsUIList();" class="px-4 py-2 rounded-full border text-[11px] font-bold whitespace-nowrap transition-colors ${activeCls}">${kep}</button>`;
    });
    tabsContainer.innerHTML = tabsHtml;

    let activeQuestions = window.builderQuestions.filter(q => {
        let meta = parseQuestionMetadata(q.name);
        return meta.keperluan === window.builderKeperluanActive;
    });

    let pages = [];
    activeQuestions.forEach((q, idx) => {
        let meta = parseQuestionMetadata(q.name);
        let pNo = parseInt(meta.halaman) || 1;
        let pJudul = meta.judul || "-";
        
        let lastPage = pages.length > 0 ? pages[pages.length - 1] : null;
        if (!lastPage || lastPage.pageNo !== pNo || lastPage.judul !== pJudul) {
            pages.push({ pageNo: pNo, judul: pJudul, questions: [], startIndex: window.builderQuestions.indexOf(q) });
            lastPage = pages[pages.length - 1];
        }
        lastPage.questions.push({ q: q, globalIndex: window.builderQuestions.indexOf(q) });
    });

    if (pages.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-slate-400 text-xs italic">Belum ada halaman/pertanyaan untuk keperluan ini.</div>
            <div class="flex justify-center mt-2">
                <button type="button" onclick="addBuilderPage()" class="cursor-pointer px-4 py-2 bg-emerald-50 text-narmadaGreen hover:bg-emerald-100 border border-emerald-200 rounded-lg text-[11px] font-bold shadow-sm transition-all flex items-center gap-2"><i class="fa-solid fa-folder-plus"></i> Tambah Halaman Pertama</button>
            </div>
        `;
    } else {
        let html = '';
        pages.forEach((page, pIdx) => {
            html += `<div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-4 relative">`;
            
            html += `<div class="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                        <div class="flex items-center gap-3">
                            <span class="w-6 h-6 flex items-center justify-center rounded-full bg-narmadaGreen text-white text-[10px] font-bold">${page.pageNo}</span>
                            <div>
                                <h4 class="text-xs font-bold text-slate-800">${page.judul === "-" ? "Tanpa Judul" : page.judul}</h4>
                            </div>
                        </div>
                        <div class="flex gap-2">
                            <button type="button" onclick="editPageTitle(${page.pageNo}, '${page.judul}')" class="text-amber-500 hover:text-amber-600 p-1 bg-white rounded shadow-sm border border-slate-200" title="Edit Judul Halaman"><i class="fa-solid fa-pen text-[10px]"></i></button>
                        </div>
                     </div>`;
                     
            html += `<div class="p-3 space-y-2">`;
            page.questions.forEach((item, localIdx) => {
                let baseType = item.q.type;
                let reqBadge = item.q.required === "tidak" ? '<span class="text-[9px] text-amber-500 font-bold ml-1">(opsional)</span>' : '<span class="text-[9px] text-slate-400 font-bold ml-1">(wajib)</span>';
                let conditionTag = item.q.conditionField ? `<div class="text-[9px] text-indigo-500 font-bold mt-1"><i class="fa-solid fa-arrow-turn-up fa-rotate-90 text-[8px]"></i> Lanjutan jika: "${item.q.conditionValue}"</div>` : '';
                
                html += `<div class="flex justify-between items-center p-2.5 rounded-lg border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors group">
                            <div>
                                <div class="text-[11px] font-bold text-slate-700">${(item.q.label || '').replace(/\{.*?\}/, '').trim()} ${reqBadge}</div>
                                <div class="text-[10px] text-slate-500 flex gap-2 mt-0.5">
                                    <span class="capitalize border border-slate-200 bg-white rounded px-1">${baseType}</span>
                                </div>
                                ${conditionTag}
                            </div>
                            <div class="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                <button type="button" onclick="openFieldEditorModal(${item.globalIndex})" class="w-6 h-6 rounded bg-white border border-slate-200 shadow-sm hover:bg-amber-50 text-amber-600 flex items-center justify-center text-[10px]"><i class="fa-solid fa-pen"></i></button>
                                <button type="button" onclick="removeBuilderQuestion(${item.globalIndex})" class="w-6 h-6 rounded bg-white border border-slate-200 shadow-sm hover:bg-red-50 text-red-600 flex items-center justify-center text-[10px]"><i class="fa-solid fa-trash"></i></button>
                            </div>
                         </div>`;
            });
            html += `</div>`;
            
            html += `<div class="px-4 py-2 bg-slate-50/50 border-t border-slate-100 text-center">
                        <button type="button" onclick="openFieldEditorModal(-1, ${page.pageNo}, '${page.judul}')" class="text-[10px] font-bold text-narmadaGreen hover:text-emerald-700 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-emerald-200"><i class="fa-solid fa-plus mr-1"></i> Tambah Pertanyaan di Halaman Ini</button>
                     </div>`;
                     
            html += `</div>`;
        });
        
        html += `<div class="flex justify-center mt-4">
                    <button type="button" onclick="addBuilderPage()" class="cursor-pointer px-4 py-2 bg-emerald-50 text-narmadaGreen hover:bg-emerald-100 border border-emerald-200 rounded-lg text-[11px] font-bold shadow-sm transition-all flex items-center gap-2"><i class="fa-solid fa-folder-plus"></i> Tambah Halaman Baru</button>
                </div>`;
                
        container.innerHTML = html;
    }
}

window.renderBuilderQuestionsUIList = renderBuilderQuestionsUIList;

window.addBuilderPage = function() {
    if(!window.builderKeperluanActive) return Swal.fire("Peringatan", "Pilih keperluan terlebih dahulu.", "warning");
    
    let activeQuestions = window.builderQuestions.filter(q => parseQuestionMetadata(q.name).keperluan === window.builderKeperluanActive);
    let maxPage = 0;
    activeQuestions.forEach(q => {
        let pNo = parseInt(parseQuestionMetadata(q.name).halaman) || 1;
        if(pNo > maxPage) maxPage = pNo;
    });
    
    let nextPage = maxPage + 1;
    
    Swal.fire({
        title: 'Tambah Halaman ' + nextPage,
        input: 'text',
        inputLabel: 'Judul Halaman (contoh: Data Usaha)',
        inputPlaceholder: 'Boleh dikosongkan...',
        showCancelButton: true,
        confirmButtonText: 'Lanjut Tambah Pertanyaan',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            let judul = result.value.trim() || "-";
            openFieldEditorModal(-1, nextPage, judul);
        }
    });
}

window.editPageTitle = function(pNo, oldJudul) {
    Swal.fire({
        title: 'Edit Judul Halaman ' + pNo,
        input: 'text',
        inputValue: oldJudul === "-" ? "" : oldJudul,
        inputPlaceholder: 'Judul Halaman...',
        showCancelButton: true,
        confirmButtonText: 'Simpan',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            let newJudul = result.value.trim() || "-";
            window.builderQuestions.forEach(q => {
                let meta = parseQuestionMetadata(q.name);
                if(meta.keperluan === window.builderKeperluanActive && parseInt(meta.halaman) === pNo && (meta.judul === oldJudul)) {
                    q.name = "{" + meta.keperluan + ";;" + meta.halaman + ";;" + newJudul + "} " + meta.cleanName;
                }
            });
            renderBuilderQuestionsUIList();
        }
    });
}

window.openFieldEditorModal = function(globalIndex = -1, targetPageNo = 1, targetJudul = "-") {
    let modal = document.getElementById('modal-field-editor');
    if(!modal) return;
    
    let isEdit = globalIndex >= 0;
    document.getElementById('modal-field-q-id').value = isEdit ? globalIndex : "";
    document.getElementById('modal-field-editor-title').innerHTML = isEdit ? '<i class="fa-solid fa-pen text-amber-500 mr-2"></i> Edit Pertanyaan' : '<i class="fa-solid fa-plus text-narmadaGreen mr-2"></i> Tambah Pertanyaan';
    
    document.getElementById('modal-field-q-type').onchange = function() {
        let t = this.value;
        document.getElementById('wrapper-modal-q-options').classList.toggle('hidden', t !== 'dropdown');
        document.getElementById('wrapper-modal-q-limit').classList.toggle('hidden', t !== 'number');
    };
    
    if(isEdit) {
        let q = window.builderQuestions[globalIndex];
        let meta = parseQuestionMetadata(q.name);
        document.getElementById('modal-field-q-keperluan').value = meta.keperluan;
        document.getElementById('modal-field-q-page-index').value = meta.halaman + ":::" + meta.judul;
        
        document.getElementById('modal-field-q-label').value = meta.cleanName;
        document.getElementById('modal-field-q-type').value = q.type;
        document.getElementById('modal-field-q-required').value = q.required;
        document.getElementById('modal-field-q-options').value = q.options || "";
        
        document.getElementById('modal-field-q-type').dispatchEvent(new Event('change'));
    } else {
        document.getElementById('modal-field-q-keperluan').value = window.builderKeperluanActive;
        document.getElementById('modal-field-q-page-index').value = targetPageNo + ":::" + targetJudul;
        
        document.getElementById('modal-field-q-label').value = "";
        document.getElementById('modal-field-q-type').value = "text";
        document.getElementById('modal-field-q-required').value = "ya";
        document.getElementById('modal-field-q-options').value = "";
        document.getElementById('modal-field-q-type').dispatchEvent(new Event('change'));
    }
    
    modal.classList.remove('hidden');
}

window.closeFieldEditorModal = function() {
    document.getElementById('modal-field-editor').classList.add('hidden');
}

window.saveFieldFromModal = function() {
    let globalIndex = document.getElementById('modal-field-q-id').value;
    let keperluan = document.getElementById('modal-field-q-keperluan').value;
    let pageInfo = document.getElementById('modal-field-q-page-index').value.split(":::");
    let halaman = pageInfo[0];
    let judul = pageInfo[1];
    
    let label = document.getElementById('modal-field-q-label').value.trim();
    let type = document.getElementById('modal-field-q-type').value;
    let required = document.getElementById('modal-field-q-required').value;
    let options = document.getElementById('modal-field-q-options').value.trim();
    
    if(!label) {
        return Swal.fire('Error', 'Label pertanyaan wajib diisi.', 'error');
    }
    
    let combinedName = "{" + keperluan + ";;" + halaman + ";;" + judul + "} " + label;
    
    let newQ = {
        id: "FLD-" + Math.random().toString(36).substr(2, 5).toUpperCase(),
        name: combinedName,
        label: label,
        type: type,
        required: required,
        options: type === 'dropdown' ? options : ""
    };
    
    if(globalIndex !== "") {
        let orig = window.builderQuestions[parseInt(globalIndex)];
        newQ.id = orig.id;
        window.builderQuestions[parseInt(globalIndex)] = newQ;
    } else {
        window.builderQuestions.push(newQ);
    }
    
    window.builderQuestions.sort((a,b) => {
        let ma = parseQuestionMetadata(a.name);
        let mb = parseQuestionMetadata(b.name);
        if(ma.keperluan !== mb.keperluan) return ma.keperluan.localeCompare(mb.keperluan);
        let ha = parseInt(ma.halaman) || 1;
        let hb = parseInt(mb.halaman) || 1;
        return ha - hb;
    });
    
    closeFieldEditorModal();
    if(typeof renderBuilderQuestionsUIList === 'function') renderBuilderQuestionsUIList();
}

window.removeBuilderQuestion = function(index) {
    Swal.fire({
        title: 'Hapus Pertanyaan',
        text: "Anda yakin ingin menghapus pertanyaan ini?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            window.builderQuestions.splice(index, 1);
            renderBuilderQuestionsUIList();
        }
    });
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
                        console.error("Server Error in crudLayanan:", err);
                        if (saveBtn) {
                            saveBtn.innerHTML = originalText;
                            saveBtn.disabled = false;
                            saveBtn.classList.remove('opacity-70', 'cursor-not-allowed');
                            saveBtn.classList.add('cursor-pointer', 'hover:scale-[1.02]', 'active:scale-[0.98]');
                        }
                        pushToast("Terjadi kesalahan: " + (err.message || err), "error");
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

            window.builderQuestions = [];
            window.builderReqMap = {};

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

export function duplicateBuilderMasterLayanan(id) {
            let list = window.loadedLayananList || dummyLayananList;
            let found = list.find(l => l.id === id);
            if (!found) return;

            askConfirmation("Duplikat Layanan", "Apakah Anda yakin ingin membuat salinan layanan ini?", function () {
                let dupName = found.nama + " (Salinan)";
                let payload = {
                    id: "",
                    nama: dupName,
                    namaOld: "",
                    syarat: found.syarat || found.persyaratan || "",
                    pertanyaan: found.pertanyaan || found.fields || "",
                    judulSectionIsian: found.judulSectionIsian || "",
                    deskripsiSectionIsian: found.deskripsiSectionIsian || "",
                    logikaKondisional: found.logikaKondisional || "[]",
                    bidang: found.bidang || "",
                    templateDocId: found.templateDocId || "",
                    templatePratinjau: found.templatePratinjau || ""
                };

                google.script.run
                    .withSuccessHandler(function (res) {
                        if (res && res.authError) { pushToast(res.message, "error"); handleAdminLogout(); return; }
                        if (res.success) {
                            pushToast("Layanan berhasil diduplikat.", "success");
                            loadBuilderLayananList();
                        } else {
                            pushToast("Gagal duplikat: " + res.message, "error");
                        }
                    })
                    .crudLayanan(localStorage.getItem('adminToken_Narmada'), "create", payload);
            });
        }

window.toggleActionMenu = function(event, menuId) {
            event.stopPropagation();
            let menu = document.getElementById(menuId);
            let isHidden = menu.classList.contains('hidden');
            
            // Tutup semua menu aksi lainnya
            document.querySelectorAll('.action-dropdown-menu').forEach(m => m.classList.add('hidden'));
            
            if (isHidden) {
                menu.classList.remove('hidden');
                
                // Kalkulasi posisi fixed agar tidak terpotong oleh overflow-hidden pada tabel
                let btn = event.currentTarget;
                let rect = btn.getBoundingClientRect();
                
                menu.style.position = 'fixed';
                menu.style.top = (rect.bottom + 4) + 'px';
                
                // w-36 pada tailwind sama dengan 144px. 
                // Kita posisikan agar sejajar dengan kanan tombol.
                let menuWidth = 144;
                let leftPos = rect.right - menuWidth;
                
                // Pastikan tidak keluar layar sebelah kiri
                if (leftPos < 10) leftPos = 10;
                
                menu.style.left = leftPos + 'px';
            }
        };

        // Tutup menu saat klik di luar
document.addEventListener('click', function() {
            document.querySelectorAll('.action-dropdown-menu').forEach(m => m.classList.add('hidden'));
        });

export let currentRepeaterGroup = [];

export let editingRepeaterIndex = -1;

window.lockStep1 = function() {
    let nameInput = document.getElementById('builder-layanan-nama');
    let btnSave = document.getElementById('ev-bind-save-info');
    let step1Card = document.getElementById('bl-step-1');
    if(nameInput && nameInput.value.trim() === '') {
        pushToast('Nama layanan wajib diisi!', 'error');
        return;
    }
    if(nameInput) {
        nameInput.classList.add('pointer-events-none');
    }
    document.querySelectorAll('.bidang-pill input').forEach(el => el.disabled = true);
    
    if(btnSave) {
        btnSave.innerHTML = '<i class="fa-solid fa-pen"></i> Edit Informasi';
        btnSave.classList.remove('bg-narmadaGreen', 'hover:bg-emerald-700');
        btnSave.classList.add('bg-slate-200', 'text-slate-600', 'hover:bg-slate-300');
        btnSave.onclick = window.unlockStep1;
    }
    pushToast('Informasi Layanan tersimpan sementara', 'success');
};

window.unlockStep1 = function() {
    let nameInput = document.getElementById('builder-layanan-nama');
    let btnSave = document.getElementById('ev-bind-save-info');
    let step1Card = document.getElementById('bl-step-1');
    
    if(nameInput) {
        nameInput.classList.remove('pointer-events-none');
    }
    document.querySelectorAll('.bidang-pill input').forEach(el => el.disabled = false);
    
    if(btnSave) {
        btnSave.innerHTML = '<i class="fa-solid fa-check"></i> Simpan Informasi';
        btnSave.classList.add('bg-narmadaGreen', 'hover:bg-emerald-700');
        btnSave.classList.remove('bg-slate-200', 'text-slate-600', 'hover:bg-slate-300');
        btnSave.onclick = window.lockStep1;
    }
};

document.addEventListener('DOMContentLoaded', function() {
    // Bind real-time summary updates
    document.getElementById('builder-layanan-nama')?.addEventListener('input', updateSummaryPanel);
    document.getElementById('builder-keperluan-select')?.addEventListener('change', updateSummaryPanel);
    
    // Bind new UI buttons
    let btnSaveInfo = document.getElementById('ev-bind-save-info');
    if(btnSaveInfo) btnSaveInfo.onclick = window.lockStep1;
    
    let btnAddKeperluan = document.getElementById('btn-add-keperluan');
    if(btnAddKeperluan) btnAddKeperluan.onclick = window.addNewKeperluanCard;
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
