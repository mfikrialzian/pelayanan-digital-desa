import io
import re

with io.open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Remove stepper container entirely (lines 2257 to 2283 roughly).
# Since it's a bit complex, let's use regex between <!-- Stepper Container --> and its closing div before <!-- Body -->
stepper_pattern = re.compile(r'<!-- Stepper Container -->.*?</div>\s*</div>\s*<!-- Body -->', re.DOTALL)
text = stepper_pattern.sub('</div>\n                        \n                        <!-- Body -->', text)

# 2. Remove description "Ikuti langkah berikut untuk mendaftarkan akun."
desc_pattern = re.compile(r'<p class="text-\[10px\] text-slate-500 mt-0\.5">Ikuti langkah berikut untuk mendaftarkan akun\.</p>\s*')
text = desc_pattern.sub('', text)

# 3. Remove nested cards. The nested cards have:
# <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-5">
# We want to replace this with just <div class="space-y-5">
nested_card_pattern = re.compile(r'<div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-5">')
text = nested_card_pattern.sub('<div class="space-y-5">', text)

# Step 4 (Konfirmasi) has a different nested card:
# <div class="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 space-y-4">
# We can just change it to not have background/border:
step4_card_pattern = re.compile(r'<div class="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 space-y-4">')
text = step4_card_pattern.sub('<div class="space-y-4">', text)

# Also step 4 has an inner white card: <div class="bg-white rounded-xl border border-emerald-100 p-4 space-y-3">
# We can change it to transparent:
step4_inner_pattern = re.compile(r'<div class="bg-white rounded-xl border border-emerald-100 p-4 space-y-3">')
text = step4_inner_pattern.sub('<div class="rounded-xl border border-slate-200 p-4 space-y-3">', text)

# Write back
with io.open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print('UI updated!')
