const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', '..', 'src');
const filesToScan = [];

function walk(dir) {
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) walk(file);
    else if (file.endsWith('.tsx') || file.endsWith('.ts')) filesToScan.push(file);
  });
}
walk(srcDir);

const keyMap = {};
const storageListeners = [];
const customDispatches = [];

filesToScan.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const shortPath = path.relative(srcDir, file).replace(/\\/g, '/');
  const lines = content.split('\n');

  lines.forEach((line, i) => {
    const lineNum = i + 1;
    const loc = `${shortPath}:${lineNum}`;

    if (line.includes("window.addEventListener('storage'") || line.includes('window.addEventListener("storage"')) {
      storageListeners.push(loc);
    }
    if (line.includes("window.dispatchEvent(new Event('storage'))") || line.includes('window.dispatchEvent(new Event("storage"))')) {
      customDispatches.push(loc);
    }

    const matches = line.matchAll(/localStorage\.(getItem|setItem|removeItem)\s*\(\s*['"`]([^'"`]+)['"`]/g);
    for (const m of matches) {
      const op = m[1];
      const key = m[2];
      if (!keyMap[key]) keyMap[key] = { key, gets: [], sets: [], removes: [] };
      if (op === 'getItem' && !keyMap[key].gets.includes(loc)) keyMap[key].gets.push(loc);
      if (op === 'setItem' && !keyMap[key].sets.includes(loc)) keyMap[key].sets.push(loc);
      if (op === 'removeItem' && !keyMap[key].removes.includes(loc)) keyMap[key].removes.push(loc);
    }
  });
});

console.log('=== LOCALSTORAGE STATE SYNC AUDIT ===\n');
console.log(`Total Keys Found: ${Object.keys(keyMap).length}`);
console.log(`Storage Listeners (window.addEventListener('storage')): ${storageListeners.length}`);
storageListeners.forEach(l => console.log(`  - ${l}`));
console.log(`\nStorage Dispatches (window.dispatchEvent(new Event('storage'))): ${customDispatches.length}`);
customDispatches.forEach(d => console.log(`  - ${d}`));

console.log('\n=== DETAILED KEY ACCESS BREAKDOWN ===\n');
Object.values(keyMap).sort((a,b) => a.key.localeCompare(b.key)).forEach(k => {
  console.log(`[KEY] ${k.key}`);
  console.log(`  Reads (${k.gets.length}): ${k.gets.join(', ') || 'None'}`);
  console.log(`  Writes (${k.sets.length}): ${k.sets.join(', ') || 'None'}`);
  if (k.removes.length) console.log(`  Deletes (${k.removes.length}): ${k.removes.join(', ')}`);
});
