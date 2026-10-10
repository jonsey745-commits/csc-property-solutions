import {serviceAreas} from './areas.js';
export const siteName = 'CSC Property Solutions Ltd';
export const siteUrl = (import.meta.env?.VITE_SITE_URL || 'http://localhost:4173').replace(/\/$/, '');
export const seoPages = {
  '/privacy': { title: 'Privacy Notice | CSC Property Solutions Ltd, Farnborough', name: 'Privacy notice', description: 'How CSC Property Solutions Ltd handles driveway and patio cleaning enquiries, personal information, form delivery and privacy requests.' },
  '/': { title: 'Driveway & Patio Cleaning in Farnborough | CSC Property Solutions', name: 'Home', description: 'Fully insured driveway and patio cleaning in Farnborough GU14 and within a 20-mile radius. Contact CSC for a free quote.' },
  '/services': { title: 'Driveway & Patio Cleaning Services | CSC Property Solutions', name: 'Services', description: 'Explore driveway and patio cleaning services across Farnborough GU14 and within a 20-mile radius.' },
  '/services/driveway-cleaning': { title: 'Driveway Cleaning in Farnborough | CSC Property Solutions', name: 'Driveway cleaning', service: 'Driveway cleaning', description: 'Refresh your driveway with cleaning for built-up dirt and moss. Serving Farnborough GU14 and within a 20-mile radius. Request a free quote.' },
  '/services/patio-cleaning': { title: 'Patio Cleaning in Farnborough | CSC Property Solutions', name: 'Patio cleaning', service: 'Patio cleaning', description: 'Refresh your patio with cleaning for dirt, moss and algae. Fully insured service in Farnborough GU14 and within a 20-mile radius. Get a free quote.' },
  '/about': { title: 'About Our Fully Insured Team | CSC Property Solutions', name: 'About', type: 'AboutPage', description: 'Meet CSC Property Solutions Ltd: fully insured driveway and patio cleaning for Farnborough GU14 and within a 20-mile radius.' },
  '/our-work': { title: 'Driveway & Patio Cleaning Project Gallery | CSC Property Solutions', name: 'Our work', type: 'CollectionPage', description: 'Explore the CSC driveway and patio cleaning project gallery. Photographs of completed work are being added. Contact us to discuss your property.' },
  '/areas': { title: 'Cleaning Within 20 Miles of Farnborough GU14 | CSC Service Areas', name: 'Service areas', description: 'CSC covers Farnborough GU14 and within a 20-mile radius for driveway and patio cleaning. Send your postcode to check availability.' },
  '/contact': { title: 'Contact CSC Property Solutions | Free Quote in Farnborough', name: 'Contact', type: 'ContactPage', description: 'Call CSC Property Solutions on 07765 641219 for a free driveway or patio cleaning quote in Farnborough GU14 and within a 20-mile radius.' }
};
export function normalisePath(path) { return path.replace(/\/$/, '') || '/'; }
export function getSeo(path) {
  const route = normalisePath(path);
  const page = seoPages[route];
  return { ...(page || { title: 'Page Not Found | CSC Property Solutions', name: 'Page not found', description: 'Find driveway and patio cleaning services from CSC Property Solutions Ltd.' }), path: route, url: new URL(route, siteUrl).href, robots: page ? 'index, follow, max-image-preview:large' : 'noindex, follow' };
}
export function structuredData(path) {
  const page = getSeo(path);
  if (!seoPages[page.path]) return null;
  const areas = serviceAreas.map(name => ({ '@type': 'Place', name }));
  const businessId = siteUrl + '/#business';
  const organisation = { '@type': 'Organization', '@id': businessId, name: siteName, legalName: 'CSC PROPERTY SOLUTIONS LTD', url: siteUrl + '/', telephone: '+447765641219', email: 'caeleb@cscpropertysolutionsltd.co.uk', description: 'Fully insured driveway and patio cleaning across Farnborough GU14 and within a 20-mile radius.', areaServed: areas, contactPoint: { '@type': 'ContactPoint', telephone: '+447765641219', email: 'caeleb@cscpropertysolutionsltd.co.uk', contactType: 'customer enquiries', availableLanguage: 'en-GB' } };
  const website = { '@type': 'WebSite', '@id': siteUrl + '/#website', url: siteUrl + '/', name: siteName, publisher: { '@id': businessId }, inLanguage: 'en-GB' };
  const webpage = { '@type': page.type || 'WebPage', '@id': page.url + '#webpage', url: page.url, name: page.title, description: page.description, isPartOf: { '@id': website['@id'] }, about: { '@id': businessId }, inLanguage: 'en-GB' };
  const graph = [organisation, website, webpage];
  if (page.path !== '/') {
    const items = [{ '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl + '/' }];
    if (page.service) items.push({ '@type': 'ListItem', position: 2, name: 'Services', item: siteUrl + '/services' });
    items.push({ '@type': 'ListItem', position: items.length + 1, name: page.name, item: page.url });
    const breadcrumb = { '@type': 'BreadcrumbList', '@id': page.url + '#breadcrumb', itemListElement: items };
    webpage.breadcrumb = { '@id': breadcrumb['@id'] };
    graph.push(breadcrumb);
  }
  if (page.service) {
    const service = { '@type': 'Service', '@id': page.url + '#service', name: page.service, serviceType: page.service, description: page.description, url: page.url, provider: { '@id': businessId }, areaServed: areas };
    webpage.mainEntity = { '@id': service['@id'] }; graph.push(service);
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}
export function syncSeo(path) {
  const page = getSeo(path);
  document.title = page.title;
  const tags = { description: page.description, robots: page.robots, 'og:title': page.title, 'og:description': page.description, 'og:url': page.url, 'og:type': 'website', 'og:site_name': siteName, 'og:locale': 'en_GB', 'twitter:card': 'summary', 'twitter:title': page.title, 'twitter:description': page.description };
  for (const [name, content] of Object.entries(tags)) {
    const attr = name.startsWith('og:') ? 'property' : 'name';
    let tag = document.head.querySelector(`meta[${attr}="${name}"]`);
    if (!tag) { tag = document.createElement('meta'); tag.setAttribute(attr, name); document.head.appendChild(tag); }
    tag.content = content;
  }
  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
  canonical.href = page.url;
  let schema = document.getElementById('site-structured-data');
  const data = structuredData(path);
  if (!data) { schema?.remove(); return; }
  if (!schema) { schema = document.createElement('script'); schema.id = 'site-structured-data'; schema.type = 'application/ld+json'; document.head.appendChild(schema); }
  schema.textContent = JSON.stringify(data);
}
