const fs = require('fs');
const html = fs.readFileSync('public/landing-pages/kage.html', 'utf8');

const scripts = html.match(/<script[\s\S]*?<\/script>/gi);
const s = scripts[2];

const getIds = (str, pattern) => {
  const matches = [];
  let m;
  while ((m = pattern.exec(str)) !== null) {
    matches.push(m[1]);
  }
  return [...new Set(matches)];
};

console.log('getElementById:', getIds(s, /getElementById\(['"]([^'"]+)['"]\)/g));
console.log('querySelector:', getIds(s, /querySelector\(['"]([^'"]+)['"]\)/g));
