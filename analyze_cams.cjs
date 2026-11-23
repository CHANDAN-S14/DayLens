const fs = require('fs');
const html = fs.readFileSync('public/landing-pages/kage.html', 'utf8');

const matches = html.match(/<[^>]+data-cam[^>]*>/g) || [];
console.log('Elements with data-cam count:', matches.length);
matches.forEach((m, i) => console.log(i, m));
