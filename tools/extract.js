const fs = require('fs');

function extract(src, dest, regex) {
  if (!fs.existsSync(src)) return;
  let content = fs.readFileSync(src, 'utf8');
  let match = content.match(regex);
  if (match) {
    fs.writeFileSync(dest, match[1].trim() + '\n');
  } else {
    fs.writeFileSync(dest, content.trim() + '\n');
  }
}

fs.mkdirSync('vercel-frontend', { recursive: true });

extract('src/style.html', 'vercel-frontend/style.css', /<style[^>]*>([\s\S]*?)<\/style>/i);
extract('src/script_core.html', 'vercel-frontend/script_core.js', /<script[^>]*>([\s\S]*?)<\/script>/i);
extract('src/script_admin.html', 'vercel-frontend/script_admin.js', /<script[^>]*>([\s\S]*?)<\/script>/i);
extract('src/script_warga.html', 'vercel-frontend/script_warga.js', /<script[^>]*>([\s\S]*?)<\/script>/i);
extract('src/script_utils.html', 'vercel-frontend/script_utils.js', /<script[^>]*>([\s\S]*?)<\/script>/i);

console.log("Extraction complete.");
