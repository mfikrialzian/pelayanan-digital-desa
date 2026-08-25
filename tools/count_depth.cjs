const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const s = html.indexOf('<div class="flex-grow space-y-6 overflow-hidden w-full" id="admin-main-column">');
const e = html.indexOf('<!-- RIGHT COLUMN');
const snip = html.substring(s, e);
let d = 0;
let m;
const regex = /<\/?div[^>]*>/g;
while ((m = regex.exec(snip)) !== null) {
  if (m[0].startsWith('</')) d--;
  else d++;
}
console.log('Depth of admin-main-column:', d);
