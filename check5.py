with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()
    start = text.find('id="modal-login-admin"')
    print(text[start-20:start+200])
