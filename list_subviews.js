const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('index.html', 'utf8');
const $ = cheerio.load(html, { decodeEntities: false });
const subviews = $('[id^="subview-admin-"]');
subviews.each((i, el) => console.log($(el).attr('id')));
