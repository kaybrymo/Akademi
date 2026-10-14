const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
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

const routes = [];
const links = [];
const localStorages = [];
const emptyClicks = [];
const missingClicks = [];
const todos = [];

filesToScan.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    
    lines.forEach((line, i) => {
        const lineNum = i + 1;
        const shortPath = file.replace(srcDir, '');
        
        // Find routes
        if (line.includes('<Route ')) {
            const match = line.match(/path=['"]([^'"]+)['"]/);
            if (match) routes.push(match[1]);
        }
        
        // Find links
        if (line.includes('to=')) {
            const match = line.match(/to=\{?['"]([^'"]+)['"]\}?/);
            if (match) links.push({file: shortPath, line: lineNum, to: match[1]});
        }
        
        // Find localstorage
        if (line.includes('localStorage.')) {
            localStorages.push({file: shortPath, line: lineNum, text: line.trim()});
        }
        
        // Find empty clicks
        if (line.match(/onClick=\{\(\) => \{\s*\}\}/)) {
            emptyClicks.push({file: shortPath, line: lineNum, text: line.trim()});
        }
        if (line.includes('onClick={undefined}')) {
            emptyClicks.push({file: shortPath, line: lineNum, text: line.trim()});
        }
        
        // Find buttons without handlers
        if (line.includes('<button') && !line.includes('onClick') && !line.includes('type="submit"') && !line.includes('type="button"') && !content.includes('type="submit"', content.indexOf(line))) {
            // Note: simple check, might have false positives
            missingClicks.push({file: shortPath, line: lineNum, text: line.trim()});
        }
        
        // TODOs
        if (line.includes('TODO') || line.includes('FIXME')) {
            todos.push({file: shortPath, line: lineNum, text: line.trim()});
        }
    });
});

fs.writeFileSync('audit_results.json', JSON.stringify({
    routes, links, localStorages, emptyClicks, missingClicks, todos
}, null, 2));

console.log('Done!');
