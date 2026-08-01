import re

with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

def replace_line(line_num, new_text):
    lines[line_num - 1] = new_text + '\n'

# Line 589
# <div id="view-admin-login" class="hidden flex flex-row w-full h-screen bg-slate-50 z-50 fixed top-0 left-0">
replace_line(589, '    <div id="view-admin-login" class="hidden z-50 fixed inset-0 w-full h-screen">\n        <div class="flex flex-row w-full h-full bg-slate-50">')
# Need to close the wrapper. The closing tag for line 589 is around line 621 (end of login).
# Wait, it's safer to just read the file and insert closing tags, but I don't know exactly where they close.
