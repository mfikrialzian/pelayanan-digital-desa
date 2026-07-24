import re
import os

workspace_dir = r"C:\Users\alzia\.gemini\antigravity\scratch\PelayananDigitalDesa"
index_path = os.path.join(workspace_dir, "index.html")

with open(index_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Extract style block
style_match = re.search(r'<style>(.*?)</style>', content, re.DOTALL)
if style_match:
    style_content = style_match.group(0)
    with open(os.path.join(workspace_dir, "style.html"), 'w', encoding='utf-8') as f:
        f.write(style_content)
    content = content.replace(style_content, "<?!= include('style'); ?>")

# 2. Extract the last script block (excluding tailwind config)
script_matches = list(re.finditer(r'<script>(.*?)</script>', content, re.DOTALL))
if len(script_matches) > 1:
    last_script_match = script_matches[-1]
    script_content = last_script_match.group(0)
    with open(os.path.join(workspace_dir, "script.html"), 'w', encoding='utf-8') as f:
        f.write(script_content)
    content = content.replace(script_content, "<?!= include('script'); ?>")

# 3. Change the page parameter injection
content = content.replace(
    '<input type="hidden" id="initial-page-param" value="warga">',
    '<input type="hidden" id="initial-page-param" value="<?= pageParam ?>">'
)

with open(index_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Split completed successfully!")
