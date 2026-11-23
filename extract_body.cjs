const fs = require('fs');
const html = fs.readFileSync('public/landing-pages/kage.html', 'utf8');

const bodyStart = html.indexOf('<body');
const script2 = html.indexOf('KAGE — a live Kyoto mountain temple');
const script2Tag = html.lastIndexOf('<script', script2);

const bodyContent = html.substring(bodyStart, script2Tag);
console.log('Body HTML length:', bodyContent.length);

fs.writeFileSync('kage_body_only.html', bodyContent, 'utf8');
console.log('Saved kage_body_only.html');
