# CSC mobile performance pass

- Moved Google Fonts import out of CSS into HTML so the browser can discover the font request immediately; added preconnects. Fonts still require a network request and may be render-blocking.
- Added a 640px responsive WebP for the home hero and matched preload + srcset/sizes for mobile and desktop.
- Added an 800px mobile decorative background. Original desktop artwork is retained.
- Corrected WebP favicon MIME type.
- Added cache policies for hashed Vite assets and WebP images.
- Kept original SEO, consent, routes, form, headers and redirects.

This does not guarantee a particular Lighthouse score. Verify all pages, image cropping, consent, headers, contact form and mobile PageSpeed on the new Vercel deployment.
