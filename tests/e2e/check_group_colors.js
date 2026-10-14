const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\IT Manager\\.gemini\\antigravity\\scratch\\akademi\\frontend\\src';

function scan(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      scan(full);
    } else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
      const content = fs.readFileSync(full, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, i) => {
        if ((line.toLowerCase().includes('group') || line.toLowerCase().includes('1on1')) && 
            (line.includes('bg-blue-') || line.includes('text-blue-') || line.includes('border-blue-'))) {
          console.log(`[BLUE DETECTED ON GROUP] ${path.relative(srcDir, full)}:${i+1} -> ${line.trim()}`);
        }
      });
    }
  }
}

scan(srcDir);
console.log("Scan complete.");
