const fs = require('fs');
const path = require('path');
const acorn = require('acorn');

const inputPath = path.join(__dirname, '../script_admin.js.bak');
const code = fs.readFileSync(inputPath, 'utf8');
const ast = acorn.parse(code, { ecmaVersion: 2020 });

const appendMap = {
    'admin_core': ['SIDEBAR_ITEMS', 'AVATAR_ITEMS', 'ROLE_MAPPINGS'],
    'layanan': ['currentRepeaterGroup', 'editingRepeaterIndex'],
    'dashboard': ['updateLaporanStats']
};

for (const node of ast.body) {
    let name = null;
    if (node.type === 'FunctionDeclaration') {
        name = node.id.name;
    } else if (node.type === 'VariableDeclaration') {
        name = node.declarations[0].id.name;
    }
    
    if (name) {
        for (const [mod, names] of Object.entries(appendMap)) {
            if (names.includes(name)) {
                let nodeCode = code.substring(node.start, node.end);
                const filePath = path.join(__dirname, '../src/admin', `${mod}.js`);
                fs.appendFileSync(filePath, '\n\nexport ' + nodeCode, 'utf8');
                console.log(`Appended ${name} to ${mod}.js`);
            }
        }
    }
}
