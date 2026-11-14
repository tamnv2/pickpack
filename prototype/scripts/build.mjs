import {cpSync, mkdirSync, readFileSync, rmSync, statSync} from 'node:fs';
import {join, dirname, resolve} from 'node:path';
const base=resolve(import.meta.dirname, '..');
const files=['index.html','app.html','assets/styles.css','assets/app.js'];
for(const path of files){
  const content=readFileSync(join(base,path),'utf8');
  if(!content.trim() || (path.endsWith('.html')&&!content.includes('assets/app.js')))throw Error(`Invalid source: ${path}`);
  if(/https?:\/\/|fetch\s*\(|XMLHttpRequest|WebSocket|firebase|cloudflare/i.test(content.replace(/\/\*[^]*?\*\//g,'')))throw Error(`Remote dependency or unexpected backend marker in ${path}`);
}
if(process.argv.includes('--check')){console.log('Source checks: PASS');process.exit(0)}
const dest=join(base,'dist');rmSync(dest,{recursive:true,force:true});mkdirSync(dest,{recursive:true});
for(const path of files){mkdirSync(dirname(join(dest,path)),{recursive:true});cpSync(join(base,path),join(dest,path));}
console.log(`BUILD_PASS: ${files.length} static files → dist/ (${files.reduce((s,f)=>s+statSync(join(dest,f)).size,0)} bytes)`);
