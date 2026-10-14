const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\IT Manager\\.gemini\\antigravity\\scratch\\akademi\\frontend\\src';

const routes = [
  '/', '/courses', '/tutors', '/tutors/:id', '/tutor/:id',
  '/login', '/register', '/classroom/:sessionId',
  '/dashboard', '/dashboard/sessions', '/dashboard/students',
  '/dashboard/recordings', '/dashboard/courses', '/dashboard/messages',
  '/dashboard/billing', '/dashboard/settings',
  '/admin', '/admin/users', '/admin/tutors', '/admin/sessions',
  '/admin/recordings', '/admin/subjects', '/admin/payments', '/admin/settings'
];

const allLinks = [];
const localStorageKeys = new Set();
const todos = [];

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      walk(full);
    } else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
      const rel = path.relative(srcDir, full);
      const content = fs.readFileSync(full, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        const lineNum = idx + 1;
        const toMatches = line.matchAll(/to=['"{`]([^'">}`\s]+)/g);
        for (const m of toMatches) {
          const target = m[1];
          if (target && !target.startsWith('http') && !target.startsWith('mailto:') && !target.startsWith('#')) {
            allLinks.push({ file: rel, line: lineNum, target });
          }
        }

        const lsMatches = line.matchAll(/localStorage\.(?:getItem|setItem|removeItem)\(['"]([^'"]+)/g);
        for (const m of lsMatches) {
          localStorageKeys.add(m[1]);
        }

        if (line.includes('TODO') || line.includes('FIXME')) {
          todos.push({ file: rel, line: lineNum, text: line.trim() });
        }
      });
    }
  }
}

walk(srcDir);

const unhandled = [];
for (const l of allLinks) {
  const target = l.target;
  if (target.includes('${') || target.includes('{')) continue;
  let matched = false;
  for (const r of routes) {
    if (r === target) {
      matched = true;
      break;
    }
    if (r.includes(':')) {
      const base = r.split('/:')[0];
      if (target.startsWith(base + '/')) {
        matched = true;
        break;
      }
    }
  }
  if (!matched) {
    unhandled.push(l);
  }
}

const result = {
  totalLinksCount: allLinks.length,
  unhandledLinksCount: unhandled.length,
  unhandledLinks: unhandled,
  localStorageKeys: Array.from(localStorageKeys).sort(),
  todos: todos
};

console.log(JSON.stringify(result, null, 2));
fs.writeFileSync('C:\\Users\\IT Manager\\.gemini\\antigravity\\scratch\\audit_results.json', JSON.stringify(result, null, 2));
