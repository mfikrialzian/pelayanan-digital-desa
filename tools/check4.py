with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()
    start = text.find('id="admin-workspace-wrapper"')
    print(text[start:start+1000])
