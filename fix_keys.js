const fs = require('fs');
let content = fs.readFileSync('script_admin.js', 'utf8');

// replace u.name -> u.nama
content = content.replace(/u\.name/g, 'u.nama');

// replace u.role -> u.peran
content = content.replace(/u\.role/g, 'u.peran');

// replace u.u -> u.username
// wait, `u.u` is tricky. Need \bu\.u\b
content = content.replace(/\bu\.u\b/g, 'u.username');

// replace user.u -> user.username
content = content.replace(/\buser\.u\b/g, 'user.username');

// replace user.p -> user.password
content = content.replace(/\buser\.p\b/g, 'user.password');

// replace user.role -> user.peran
content = content.replace(/\buser\.role\b/g, 'user.peran');

// replace user.name -> user.nama
content = content.replace(/\buser\.name\b/g, 'user.nama');

fs.writeFileSync('script_admin.js', content);
console.log('Done replacing keys.');
