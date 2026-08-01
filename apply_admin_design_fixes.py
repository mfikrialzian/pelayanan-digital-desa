import re

file_path = "index.html"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Warna Tombol Utama (bg-blue-600 -> bg-narmadaGreen)
content = content.replace("bg-blue-600 hover:bg-blue-700", "bg-narmadaGreen hover:bg-emerald-700")

# 2. Warna Tombol Utama (bg-indigo-600 -> bg-narmadaGreen)
content = content.replace("bg-indigo-600 hover:bg-indigo-700", "bg-narmadaGreen hover:bg-emerald-700")

# 3. Warna Tombol Outline (bg-indigo-500 -> outline)
content = content.replace("bg-indigo-500 hover:bg-indigo-600 text-white", "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200")

# 4. Warna Ikon Hijau Dashboard
content = content.replace("bg-green-50 rounded-full", "bg-emerald-50 rounded-full")
content = content.replace("bg-green-100 text-green-600", "bg-emerald-50 text-narmadaGreen")

# 5. Nested Cards di subview-admin-layanan
content = content.replace(
    'class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4"',
    'class="space-y-4 border-b border-slate-100 pb-5 mb-2"'
)

# 6. Tabel subview-admin-pengajuan (bg-slate-50/50 -> bg-slate-50)
content = content.replace(
    '<tr class="bg-slate-50/50 text-[10px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-100">',
    '<tr class="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-100">'
)

# 7. Tabel subview-admin-daftar-layanan (bg-gradient... -> bg-slate-50)
content = content.replace(
    '<tr class="bg-gradient-to-r from-slate-50 to-white text-[10px] uppercase tracking-wider text-slate-500 font-extrabold border-b border-slate-200 sticky top-0 z-10 shadow-sm">',
    '<tr class="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-100 sticky top-0 z-10">'
)

# 8. Tabel Hak Akses (Pengaturan Akun)
content = content.replace(
    '<tr class="bg-slate-50 text-slate-600 text-xs font-bold border-b border-slate-100">',
    '<tr class="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider font-bold border-b border-slate-100">'
)


with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Successfully applied fixes to index.html")
