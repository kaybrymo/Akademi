const fs = require('fs');
const data = JSON.parse(fs.readFileSync('audit_results.json', 'utf8'));

const definedRoutes = data.routes;
const linkedRoutes = data.links.map(l => l.to);

console.log('--- DEFINED ROUTES ---');
console.log([...new Set(definedRoutes)].sort());

console.log('\n--- ALL LINKS ---');
const uniqueLinks = [...new Set(linkedRoutes)].sort();
console.log(uniqueLinks);

const unhandled = uniqueLinks.filter(l => {
  // basic check
  if (l.startsWith('mailto:') || l.startsWith('tel:') || l.startsWith('http')) return false;
  
  // replace dynamic segments like /tutors/:id
  const matchingRoute = definedRoutes.find(r => {
    const routeRegex = new RegExp('^' + r.replace(/\/:[^/]+/g, '/[^/]+') + '$');
    return routeRegex.test(l);
  });
  
  // App.tsx uses nested routes for /dashboard and /admin
  if (l.startsWith('/dashboard')) {
      const sub = l.replace('/dashboard', '').replace(/^\//, '') || '/';
      return !['/', 'sessions', 'students', 'recordings', 'courses', 'messages', 'billing', 'settings'].includes(sub);
  }
  if (l.startsWith('/admin')) {
      const sub = l.replace('/admin', '').replace(/^\//, '') || '/';
      return !['/', 'users', 'tutors', 'sessions', 'recordings', 'subjects', 'payments', 'settings'].includes(sub);
  }
  
  return !matchingRoute && !['/', '/courses', '/tutors', '/login', '/register', '*'].includes(l);
});

console.log('\n--- POTENTIAL UNHANDLED LINKS ---');
console.log(unhandled);
