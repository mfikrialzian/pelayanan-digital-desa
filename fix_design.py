import re

with open('DESIGN.md', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix MD022 (blanks around headings)
# Ensure blank line before and after headings
text = re.sub(r'([^\n])\n(#+ .*?)\n', r'\1\n\n\2\n', text)
text = re.sub(r'\n(#+ .*?)\n([^\n])', r'\n\1\n\n\2', text)

# Fix MD031 (blanks around fenced code blocks)
text = re.sub(r'([^\n])\n(`)', r'\1\n\n\2', text)
text = re.sub(r'(`)\n([^\n])', r'\1\n\n\2', text)

# Fix MD032 (blanks around lists)
# This is trickier, let's do it manually since DESIGN.md is small.
