import os

def replace_in_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()
    for old, new in replacements:
        text = text.replace(old, new)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(text)

# 1. src/repository.js
replace_in_file('d:/PelayananDigitalDesa/src/repository.js', [
    ('matchesS = (rowStatus === ZettConstants.STATUS_SELESAI || rowStatus === "Selesai" || rowStatus === "Pelayanan Selesai");', 'matchesS = (rowStatus === ZettConstants.STATUS_SELESAI);'),
    ('matchesS = (rowStatus === "Diperiksa" || rowStatus === "Proses" || rowStatus === "Verifikasi");', 'matchesS = (rowStatus === ZettConstants.STATUS_DIPERIKSA);'),
    ('matchesS = (rowStatus === "Perbaikan" || rowStatus === "Upload Ulang");', 'matchesS = (rowStatus === ZettConstants.STATUS_REUPLOAD);')
])

# 2. src/service.js
replace_in_file('d:/PelayananDigitalDesa/src/service.js', [
    ('stat === ZettConstants.STATUS_DIPERIKSA || stat === "Proses" || stat === "Verifikasi"', 'stat === ZettConstants.STATUS_DIPERIKSA'),
    ('stat === ZettConstants.STATUS_SELESAI || stat === "Selesai" || stat === "Pelayanan Selesai"', 'stat === ZettConstants.STATUS_SELESAI'),
    ('stat === ZettConstants.STATUS_REUPLOAD || stat === ZettConstants.STATUS_DITOLAK', 'stat === ZettConstants.STATUS_REUPLOAD')
])

# 3. admin_core.js
replace_in_file('d:/PelayananDigitalDesa/vercel-frontend/src/admin/admin_core.js', [
    ("action: \"openPengajuanFilter('Proses')\"", "action: \"openPengajuanFilter('Diperiksa')\"")
])

# 4. dashboard.js
replace_in_file('d:/PelayananDigitalDesa/vercel-frontend/src/admin/dashboard.js', [
    ('r.status === "Diperiksa" || r.status === "Proses" || r.status === "Verifikasi"', 'r.status === "Diperiksa"'),
    ('r.status === "Selesai" || r.status === "Pelayanan Selesai"', 'r.status === "Selesai"'),
    ('r.status === "Perbaikan" || r.status === "Upload Ulang"', 'r.status === "Perbaikan"')
])

# 5. pengajuan.js
replace_in_file('d:/PelayananDigitalDesa/vercel-frontend/src/admin/pengajuan.js', [
    ('row.status === "Diperiksa" || row.status === "Verifikasi" || row.status === "Proses"', 'row.status === "Diperiksa"'),
    ('row.status === "Selesai" || row.status === "Pelayanan Selesai"', 'row.status === "Selesai"'),
    ('row.status === "Perbaikan" || row.status === "Upload Ulang"', 'row.status === "Perbaikan"'),
    ("row.status === 'Diperiksa' || row.status === 'Verifikasi' || row.status === 'Pelayanan Selesai' || row.status === 'Selesai'", "row.status === 'Diperiksa' || row.status === 'Selesai'"),
    ("r.status === 'Proses' || r.status === 'Verifikasi' || r.status === 'Diperiksa'", "r.status === 'Diperiksa'"),
    ("r.status === 'Selesai' || r.status === 'Pelayanan Selesai'", "r.status === 'Selesai'"),
    ("r.status === 'Perbaikan' || r.status === 'Upload Ulang'", "r.status === 'Perbaikan'"),
    ("item.status === 'Diperiksa' || item.status === 'Proses' || item.status === 'Verifikasi'", "item.status === 'Diperiksa'"),
    ("item.status === 'Perbaikan' || item.status === 'Upload Ulang'", "item.status === 'Perbaikan'"),
    ("item.status === 'Selesai' || item.status === 'Pelayanan Selesai'", "item.status === 'Selesai'"),
    ("row.status === 'Verifikasi' || row.status === 'Pelayanan Selesai' || row.status === 'Selesai'", "row.status === 'Selesai'")
])

# 6. status.js
replace_in_file('d:/PelayananDigitalDesa/vercel-frontend/src/warga/status.js', [
    ('item.status === "Diperiksa" || item.status === "Verifikasi" || item.status === "Proses"', 'item.status === "Diperiksa"'),
    ('item.status === "Selesai" || item.status === "Pelayanan Selesai"', 'item.status === "Selesai"'),
    ('item.status === "Perbaikan" || item.status === "Upload Ulang"', 'item.status === "Perbaikan"')
])
