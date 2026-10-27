import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const assetsDir = path.resolve(distDir, 'assets');
const publicDir = path.resolve(rootDir, 'public');

if (!fs.existsSync(distDir) || !fs.existsSync(assetsDir)) {
  console.error('Dist directory does not exist. Please run npm run build first.');
  process.exit(1);
}

let html = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

// Find CSS file
const files = fs.readdirSync(assetsDir);
const cssFile = files.find((f) => f.endsWith('.css'));
const jsFile = files.find((f) => f.endsWith('.js'));

if (cssFile) {
  const cssContent = fs.readFileSync(path.join(assetsDir, cssFile), 'utf-8');
  html = html.replace(/<link[^>]*rel="stylesheet"[^>]*>/i, `<style>\n${cssContent}\n</style>`);
}

if (jsFile) {
  const jsContent = fs.readFileSync(path.join(assetsDir, jsFile), 'utf-8');
  html = html.replace(/<script[^>]*src="[^"]*"[^>]*><\/script>/i, `<script type="module">\n${jsContent}\n</script>`);
}

// Write standalone HTML files
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(rootDir, 'kalkulator-anuitas-pro.html'), html, 'utf-8');
fs.writeFileSync(path.join(distDir, 'kalkulator-anuitas-pro.html'), html, 'utf-8');
fs.writeFileSync(path.join(publicDir, 'kalkulator-anuitas-pro.html'), html, 'utf-8');

console.log('Successfully created standalone single-file HTML:');
console.log(' - kalkulator-anuitas-pro.html');
console.log(' - dist/kalkulator-anuitas-pro.html');
console.log(' - public/kalkulator-anuitas-pro.html');
