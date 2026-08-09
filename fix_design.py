import re
import os

if os.path.exists('DESIGN.md'):
    with open('DESIGN.md', 'r', encoding='utf-8') as f:
        text = f.read()

    # Fix MD022 (blanks around headings)
    text = re.sub(r'([^\n])\n(#+ .*?)\n', r'\1\n\n\2\n', text)
    text = re.sub(r'\n(#+ .*?)\n([^\n])', r'\n\1\n\n\2', text)

    # Fix MD031 (blanks around fenced code blocks)
    text = re.sub(r'([^\n])\n(`)', r'\1\n\n\2', text)
    text = re.sub(r'(`)\n([^\n])', r'\1\n\n\2', text)

    with open('DESIGN.md', 'w', encoding='utf-8') as f:
        f.write(text)

if os.path.exists('index.html'):
    with open('index.html', 'r', encoding='utf-8') as f:
        text = f.read()

    # 1. pa-content-keamanan inputs: bg-white -> bg-slate-50
    keamanan_pattern = re.compile(r'(<form id=\"form-password\".*?<\/form>)', re.DOTALL)
    def fix_keamanan(m):
        form_text = m.group(1)
        form_text = form_text.replace('bg-white border', 'bg-slate-50 border')
        return form_text
    text = keamanan_pattern.sub(fix_keamanan, text)

    # 2. subview-admin-beranda toggles container: remove nested card
    beranda_pattern = re.compile(r'<div class=\"p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3\">')
    text = beranda_pattern.sub('<div class=\"space-y-3\">', text)

    # 3. subview-admin-layanan requirements container
    req_pattern = re.compile(r'<div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100\">')
    text = req_pattern.sub('<div class=\"grid grid-cols-1 md:grid-cols-2 gap-4\">', text)

    # 4. subview-admin-layanan questions container
    q_pattern = re.compile(r'<div class=\"bg-slate-50 p-4 border border-slate-200 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-3\">')
    text = q_pattern.sub('<div class=\"grid grid-cols-1 sm:grid-cols-3 gap-3\">', text)

    # Also fix the inputs inside subview-admin-layanan that are currently bg-white to bg-slate-50
    builder_inputs = [
        'builder-req-keperluan',
        'builder-req-input',
        'builder-q-keperluan',
        'builder-q-judul',
        'builder-q-label',
        'builder-q-required',
        'builder-q-type'
    ]

    for b_id in builder_inputs:
        input_pattern = re.compile(rf'(id=\"{b_id}\"[^>]*?)bg-white')
        text = input_pattern.sub(r'\1bg-slate-50', text)

    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(text)

print('Fixed.')
