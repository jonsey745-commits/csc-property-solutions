import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
const headers=await readFile('dist/_headers','utf8');
for(const header of ['X-Content-Type-Options: nosniff','Permissions-Policy:','frame-ancestors','Strict-Transport-Security:']) assert(headers.includes(header),header);
const files=await readdir('dist',{recursive:true});
for(const file of files){
 assert(!/(^|\/)(\.env(?:\.|$)|\.git\/)|\.(pem|key|map)$/.test(file),`Private/debug file in deployment: ${file}`);
 if(!file.endsWith('.html'))continue;
 const html=await readFile(`dist/${file}`,'utf8');
 assert(html.includes('http-equiv="Content-Security-Policy"'),`Missing CSP on ${file}`);
 assert(html.includes("script-src 'self';"),`Scripts unrestricted: ${file}`);
 assert(html.includes("object-src 'none'"),`Objects unrestricted: ${file}`);
 assert(!/\son(?:click|error|load)=/i.test(html),`Inline event handler: ${file}`);
}
const contact=await readFile('dist/contact.html','utf8');
assert(contact.includes('action="https://formsubmit.co/caeleb@cscpropertysolutionsltd.co.uk" method="POST"'));
assert(contact.includes('name="_captcha" value="true"'));
assert(contact.includes('name="_honey"'));
assert(!contact.includes('your enquiry has been sent'));
for(const limit of ['100','30','254','5000'])assert(contact.includes(`maxLength="${limit}"`),`Missing field limit ${limit}`);
console.log('Security checks passed: form destination/CAPTCHA/honeypot, field limits, CSP on every page, no inline event handlers or private/debug deployment files.');
