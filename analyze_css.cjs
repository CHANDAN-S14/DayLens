const fs = require('fs');
const html = fs.readFileSync('public/landing-pages/kage.html', 'utf8');

const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/i);
if (styleMatch) {
  const css = styleMatch[1];
  console.log('CSS length:', css.length);
  const lines = css.split('\n');
  console.log('CSS lines count:', lines.length);
  console.log('Sample CSS selectors:');
  const selectors = css.match(/[^{}]+(?=\{)/g) || [];
  console.log(selectors.slice(0, 15).map(s => s.trim()));
}
