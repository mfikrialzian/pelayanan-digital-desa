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
        for j, char in enumerate(line):
            if char == '{':
                stack.append((i, j))
            elif char == '}':
                if stack:
                    stack.pop()
                else:
                    print(f"Unmatched }} at line {i+1}, col {j}")

    if stack:
        print(f"Unmatched {{ found. {len(stack)} remaining.")
        for item in stack:
            print(f"Line {item[0]+1}, col {item[1]}")
    else:
        print("Braces match!")

check_braces('script_admin.html')
