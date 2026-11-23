const fs = require('fs');
const body = fs.readFileSync('kage_body_only.html', 'utf8');

const lines = body.split('\n');
console.log('Total lines in body:', lines.length);

lines.forEach((l, i) => {
  const t = l.trim();
  if (t.startsWith('<section') || t.startsWith('<header') || t.startsWith('<footer') || t.startsWith('<h1') || t.startsWith('<h2') || t.startsWith('<h3') || t.startsWith('<!-- =')) {
    console.log(i + 1, t);
  }
});
