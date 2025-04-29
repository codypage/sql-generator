// scripts/generate-metadata.js
import fs from 'fs';
import path from 'path';

if (process.argv.length < 3) {
  console.error('Usage: node generate-metadata.js <metadata.json>');
  process.exit(1);
}

const metaPath = process.argv[2];
const out = [];

const { fieldMapping } = JSON.parse(fs.readFileSync(metaPath, 'utf8'));

// 1) Generate fieldMeta
out.push(`// GENERATED — DO NOT EDIT`);
out.push(`export const fieldMeta = [`);
fieldMapping.forEach(f => {
  // default checked: only core fields
  const core = ['clientvisit_id','timein','client_name','visittype','cptcode'];
  const checked = core.includes(f.name) ? 'true' : 'false';
  out.push(`  { name: '${f.name}', label: '${f.label}', tooltip: '${f.tooltip}', checked: ${checked} },`);
});
out.push(`];\n`);

// 2) Generate stubs for fieldToSqlMap
out.push(`export const fieldToSqlMap = {`);
fieldMapping.forEach(f => {
  out.push(`  '${f.name}': '/* SQL for ${f.name} — e.g. cv.${f.name} AS "${f.label}" */',`);
});
out.push(`};`);

fs.writeFileSync(
  path.resolve(process.cwd(), 'src/metadata.generated.js'),
  out.join('\n'),
  'utf8'
);

console.log('✅ metadata.generated.js written.');
