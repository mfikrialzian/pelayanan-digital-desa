import io

with io.open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

start_idx = 2200 # 2201 in 1-based index (<!-- SUBVIEW EDIT PENGGUNA -->)
end_idx = 2466   # 2467 in 1-based index, which is the </div> closing tambah-pengguna

with io.open('subviews.html', 'w', encoding='utf-8') as f:
    f.writelines(lines[start_idx:end_idx])

# Verify what we extracted
print('First line:', lines[start_idx].strip())
print('Last line:', lines[end_idx-1].strip())
