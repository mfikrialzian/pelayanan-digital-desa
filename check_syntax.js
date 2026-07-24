const fs = require('fs');
const vm = require('vm');
const html = fs.readFileSync('script_admin.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (scriptMatch) {
  try {
    new vm.Script(scriptMatch[1]);
    console.log('Syntax OK');
  } catch (e) {
    console.error('Syntax Error:', e.message);
  }
} else {
  console.log('No script tag found');
}
