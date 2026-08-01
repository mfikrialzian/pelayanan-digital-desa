import re

with open('src/admin/layanan.js', 'r', encoding='utf-8') as f:
    js = f.read()

# 1. Update populateBuilderLayananToEdit
populate_search = """document.getElementById('builder-layanan-nama').value = found.nama;"""
populate_replace = """document.getElementById('builder-layanan-nama').value = found.nama;

            let titleEl = document.getElementById('unified-editor-title');
            if(titleEl) titleEl.innerHTML = '<i class="fa-solid fa-layer-group text-narmadaGreen mr-2"></i> Edit Layanan: ' + found.nama;
            
            document.querySelectorAll('input[name="builder-bidang"]').forEach(cb => cb.checked = false);
            if (found.bidang) {
                let savedBidang = found.bidang.split(',').map(b => b.trim());
                document.querySelectorAll('input[name="builder-bidang"]').forEach(cb => {
                    if (savedBidang.includes(cb.value)) cb.checked = true;
                });
            }"""

js = js.replace(populate_search, populate_replace)

# 2. Update resetBuilderFormState
reset_search = """document.getElementById('builder-layanan-nama').value = "";"""
reset_replace = """document.getElementById('builder-layanan-nama').value = "";
            let titleEl = document.getElementById('unified-editor-title');
            if(titleEl) titleEl.innerHTML = '<i class="fa-solid fa-layer-group text-narmadaGreen mr-2"></i> Buat Layanan Baru';
            document.querySelectorAll('input[name="builder-bidang"]').forEach(cb => cb.checked = false);"""

js = js.replace(reset_search, reset_replace)

# 3. Update submitBuilderDataToServer to include bidang
submit_search = """let name = document.getElementById('builder-layanan-nama').value.trim();"""
submit_replace = """let name = document.getElementById('builder-layanan-nama').value.trim();
            let bidangChecked = [];
            document.querySelectorAll('input[name="builder-bidang"]:checked').forEach(cb => bidangChecked.push(cb.value));
            let bidangStr = bidangChecked.join(',');"""

js = js.replace(submit_search, submit_replace)

payload_search = """logikaKondisional: "[]","""
payload_replace = """logikaKondisional: "[]",
                bidang: bidangStr,"""

js = js.replace(payload_search, payload_replace)

# 4. Update dummyLayananList mock saving
mock_save_search_1 = """deskripsiSectionIsian: payload.deskripsiSectionIsian,"""
mock_save_replace_1 = """deskripsiSectionIsian: payload.deskripsiSectionIsian,
                        bidang: payload.bidang,"""

js = js.replace(mock_save_search_1, mock_save_replace_1)

mock_save_search_2 = """dummyLayananList[idx].deskripsiSectionIsian = payload.deskripsiSectionIsian;"""
mock_save_replace_2 = """dummyLayananList[idx].deskripsiSectionIsian = payload.deskripsiSectionIsian;
                        dummyLayananList[idx].bidang = payload.bidang;"""

js = js.replace(mock_save_search_2, mock_save_replace_2)


with open('src/admin/layanan.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("layanan.js updated successfully")
