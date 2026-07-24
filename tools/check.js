const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const str1 = '<div id="subview-admin-layanan" class="hidden space-y-6 text-left">';
const str2 = '<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start mt-6">';
console.log('str1 index:', content.indexOf(str1));
console.log('str2 index:', content.indexOf(str2));
