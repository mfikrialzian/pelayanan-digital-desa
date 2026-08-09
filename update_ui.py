import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

start_tag = 'id="subview-admin-layanan"'
start_idx = html.find(start_tag)
if start_idx == -1:
    print('Could not find subview-admin-layanan')
    exit(1)

end_tag = 'id="subview-admin-kontak"'
end_idx = html.find(end_tag, start_idx)
if end_idx == -1:
    end_idx = len(html)

sub_html = html[start_idx:end_idx]

def add_focus(match):
    tag = match.group(0)
    if 'class="' in tag:
        if 'focus-visible:ring-2' not in tag:
            tag = tag.replace('class="', 'class="transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-narmadaGreen focus-visible:outline-none ')
    else:
        tag = tag[:-1] + ' class="transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-narmadaGreen focus-visible:outline-none">'
    return tag

sub_html = re.sub(r'<(input|textarea|select)[^>]+>', add_focus, sub_html)

def add_btn_classes(match):
    tag = match.group(0)
    if 'class="' in tag:
        new_classes = ''
        if 'cursor-pointer' not in tag: new_classes += 'cursor-pointer '
        if 'transition-' not in tag: new_classes += 'transition-all duration-200 '
        if 'hover:scale' not in tag: new_classes += 'hover:scale-[1.02] active:scale-[0.98] '
        tag = tag.replace('class="', 'class="' + new_classes)
    else:
        tag = tag[:-1] + ' class="cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">'
    return tag

sub_html = re.sub(r'<button[^>]+>', add_btn_classes, sub_html)

sub_html = sub_html.replace('px-2 py-1', 'px-3 py-2')
sub_html = sub_html.replace('p-1 ', 'p-2 ')
sub_html = sub_html.replace('p-1.5', 'p-2.5')

html = html[:start_idx] + sub_html + html[end_idx:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print('Updated index.html')
