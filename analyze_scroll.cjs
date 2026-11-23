const fs = require('fs');
const html = fs.readFileSync('public/landing-pages/kage.html', 'utf8');

const scripts = html.match(/<script[\s\S]*?<\/script>/gi);
const s = scripts[2];

const lines = s.split('\n');
console.log('Total script lines:', lines.length);

const scrollLines = lines.filter(l => l.includes('scroll') || l.includes('scrollY') || l.includes('wheel'));
console.log('Scroll-related lines count:', scrollLines.length);
console.log('Sample scroll lines:');
scrollLines.slice(0, 10).forEach(l => console.log('  ', l.trim()));
