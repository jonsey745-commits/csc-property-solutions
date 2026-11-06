import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {seoPages,siteUrl} from '../.sites-runtime/prerender/entry-server.js';
const titles=new Set(), descriptions=new Set();
for(const route of Object.keys(seoPages)){
 const html=await readFile(route==='/'?'dist/index.html':`dist${route}.html`,'utf8');
 const title=html.match(/<title>(.*?)<\/title>/s)?.[1];
 const description=html.match(/<meta name="description" content="([^"]+)"/)?.[1];
 assert(title && !titles.has(title),`Missing/duplicate title: ${route}`);titles.add(title);
 assert(description && !descriptions.has(description),`Missing/duplicate description: ${route}`);descriptions.add(description);
 assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1,`Heading hierarchy: ${route}`);
 assert(html.includes(`<link rel="canonical" href="${new URL(route,siteUrl).href}"`),`Canonical: ${route}`);
 assert(html.includes('tel:07765641219'),`Missing rendered business contact: ${route}`);
 assert(html.includes('<main '),`Missing pre-rendered content: ${route}`);
 const schema=JSON.parse(html.match(/<script id="site-structured-data" type="application\/ld\+json">(.*?)<\/script>/s)[1]);
 assert(schema['@graph'].some(n=>n['@type']==='Organization'),`Business schema: ${route}`);
 if(route.startsWith('/services/'))assert(schema['@graph'].some(n=>n['@type']==='Service'),`Service schema: ${route}`);
 assert(!html.includes('aggregateRating')&&!html.includes('streetAddress'),`Unverified business claims: ${route}`);
 for(const [,href] of html.matchAll(/href="(\/(?!\/)[^"#?]*)"/g)){
  if(href==='/'||seoPages[href])continue;
  await access(`dist${href}`);
 }
}
const sitemap=await readFile('dist/sitemap.xml','utf8');
assert.equal((sitemap.match(/<loc>/g)||[]).length,Object.keys(seoPages).length);
const errorPage=await readFile('dist/404.html','utf8');assert(errorPage.includes('noindex, follow'));
assert(!(await readFile('dist/_redirects','utf8')).includes('/* /index.html 200'),'Catch-all would hide pre-rendered pages');
console.log(`SEO checks passed: ${Object.keys(seoPages).length} unique titles/descriptions, rendered page content, canonical URLs, structured data, links, sitemap and noindex 404.`);
