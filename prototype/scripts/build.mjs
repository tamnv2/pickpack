import {cpSync, mkdirSync, readFileSync, rmSync, statSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
const dir=resolve(import.meta.dirname,'..');
const files=['index.html','app.html','assets/styles.css','assets/app.js','assets/supra-mark.png','assets/favicon.png','assets/favicon.ico'];
for(const file of files){
 const c=readFileSync(join(dir,file),'utf8');
 if(!c.trim() || (file.endsWith('.html') && !c.includes('assets/app.js')))throw Error(`Invalid file: ${file}`);
 if(/\b(fetch\s*\(|XMLHttpRequest|WebSocket|EventSource|importScripts)\b/i.test(c.replace(/\/\*[\s\S]*?\*\//g,'')))throw Error(`External IO marker: ${file}`);
}
if(process.argv.includes('--check')){console.log('SOURCE_CHECK_PASS');process.exit(0)}
const dest=join(dir,'dist');rmSync(dest,{recursive:true,force:true});mkdirSync(dest,{recursive:true});
for(const file of files){mkdirSync(dirname(join(dest,file)),{recursive:true});cpSync(join(dir,file),join(dest,file))}
console.log(`BUILD_PASS: ${files.length} files; ${files.reduce((n,f)=>n+statSync(join(dest,f)).size,0)} bytes`);
