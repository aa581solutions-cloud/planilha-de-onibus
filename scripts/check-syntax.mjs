import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'sistema-viagens-check-'));
function check(label, source, filename) {
  const target = path.join(temp, filename);
  fs.writeFileSync(target, source, 'utf8');
  const result = spawnSync(process.execPath, ['--check', target], { encoding: 'utf8' });
  if (result.status !== 0) {
    process.stderr.write(`FALHA de sintaxe em ${label}\n${result.stderr || result.stdout}`);
    process.exitCode = 1;
  } else {
    process.stdout.write(`OK: sintaxe de ${label}\n`);
  }
}
const code = fs.readFileSync(path.join(root, 'apps-script/Code.gs'), 'utf8');
const html = fs.readFileSync(path.join(root, 'apps-script/Main.html'), 'utf8');
check('apps-script/Code.gs', code, 'Code.js');
const blocks = [...html.matchAll(/<script\\b[^>]*>([\\s\\S]*?)<\\/script>/gi)];
if (!blocks.length) {
  console.error('Nenhum bloco <script> encontrado em Main.html');
  process.exitCode = 1;
} else {
  blocks.forEach((block, i) => check(`Main.html bloco ${i + 1}`, block[1], `Main-${i + 1}.js`));
}
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'apps-script/appsscript.json'), 'utf8'));
if (manifest.runtimeVersion !== 'V8') {
  console.error('O manifesto não declara runtime V8.');
  process.exitCode = 1;
} else {
  console.log('OK: manifesto JSON e runtime V8');
}
