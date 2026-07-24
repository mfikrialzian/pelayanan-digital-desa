const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lastGrid = content.substring(67917, 67917 + 500);
console.log(lastGrid);
