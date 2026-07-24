import sys

def check_braces(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        text = f.read()

    start_idx = text.find('<script>')
    end_idx = text.find('</script>')
    if start_idx == -1 or end_idx == -1:
        print("No script tags found")
        return

    script_content = text[start_idx+8:end_idx]

    stack = []
    lines = script_content.split('\n')
    for i, line in enumerate(lines):
        # Very simple check, ignores strings and comments but gives a rough idea
        # We'll just print out function scopes or look at the end
        pass

    # A better way is to print out the last 20 lines of the script content
    print("Last 20 lines of script content:")
    for line in lines[-20:]:
        print(line)

check_braces('script_admin.html')
