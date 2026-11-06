import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {dirname} from 'node:path';
import {render,getSeo,structuredData,seoPages,siteUrl,siteName} from '../.sites-runtime/prerender/entry-server.js';
const base = await readFile('dist/index.html','utf8');
const escape = value => String(value).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
for (const path of [...Object.keys(seoPages), '/404']) {
  const page = getSeo(path);
  const data = structuredData(path);
  const tags = {description:page.description, robots:page.robots, 'og:title':page.title,'og:description':page.description,'og:url':page.url,'og:type':'website','og:site_name':siteName,'og:locale':'en_GB','twitter:card':'summary','twitter:title':page.title,'twitter:description':page.description};
  const head = `<link rel="canonical" href="${escape(page.url)}"/>\n` + Object.entries(tags).map(([name,content])=>`<meta ${name.startsWith('og:')?'property':'name'}="${name}" content="${escape(content)}"/>`).join('\n') + (data ? `\n<script id="site-structured-data" type="application/ld+json">${JSON.stringify(data).replace(/</g,'\\u003c')}</script>` : '');
  const html = base.replace(/<title>.*?<\/title>/s,`<title>${escape(page.title)}</title>`).replace('</head>',head+'\n</head>').replace('<div id="root"></div>',`<div id="root">${render(path)}</div>`);
  const file = path==='/'?'dist/index.html':`dist${path}.html`;
  await mkdir(dirname(file),{recursive:true}); await writeFile(file,html);
}
const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+Object.keys(seoPages).map(path=>`  <url><loc>${escape(new URL(path,siteUrl).href)}</loc></url>`).join('\n')+'\n</urlset>\n';
await writeFile('dist/sitemap.xml',sitemap);
await writeFile('dist/robots.txt',`User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
console.log(`Pre-rendered ${Object.keys(seoPages).length} pages, a 404 page, sitemap and robots.txt.`);
