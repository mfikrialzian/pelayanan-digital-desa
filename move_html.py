import io
with io.open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

start_idx = -1
end_idx = -1
target_idx = -1

for i, line in enumerate(lines):
    if '<!-- SUBVIEW EDIT PENGGUNA -->' in line:
        start_idx = i
    if '<div id="subview-admin-pengaturan-akun"' in line and start_idx != -1:
        end_idx = i - 1
    if '<div id="subview-admin-laporan"' in line:
        target_idx = i

if start_idx != -1 and end_idx != -1 and target_idx != -1:
    print(f'Found block from {start_idx} to {end_idx}, moving to {target_idx}')
    block = lines[start_idx:end_idx+1]
    
    del lines[start_idx:end_idx+1]
    
    lines = lines[:target_idx] + block + lines[target_idx:]
    
    with io.open('index.html', 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print('Done.')
else:
    print('Failed to find indices', start_idx, end_idx, target_idx)
