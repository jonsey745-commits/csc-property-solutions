# CSC Property Solutions — Complete Performance Master Package

## Contents
Full Vite/React website (`src/`), SEO pre-rendering and validation (`scripts/`), all retained images converted to WebP (`public/`), analytics and consent (`public/analytics.js`), security headers (`public/_headers` and `vercel.json`), redirects (`public/_redirects`), and deployment configs.

## Upload
1. Unzip this package.
2. In the **TEST** GitHub repository, replace the old repository contents with the contents of this ZIP **keeping the `public/`, `src/`, `scripts/` folders intact**. Do not upload the ZIP as a single file. Delete obsolete JPEG/PNG assets and files that are not in this package to avoid stale references.
3. Keep Vercel's `VITE_SITE_URL` environment variable set to the canonical HTTPS domain appropriate for the deployment. If using a TEST domain to avoid search indexing, do not connect the client live domain to the TEST Vercel project.
4. Confirm Vercel deployment status **Ready**, then check every page and photo.
5. Run PageSpeed Insights on the TEST URL (mobile and desktop), check image requests and check analytics only after consent.

## Notes
- `public/` is REQUIRED: Vite copies it into the deployment root. Do not move assets to the repository root.
- The Driveway Cleaning service now uses `/driveway-after.webp` rather than a broken JPEG or multi-photo collage.
- Legacy image references were converted to WebP. Unused source JPEGs/PNGs were replaced with compressed WebP equivalents.
- SEO and security checks run as part of `npm run build`.
- A successful build is not a substitute for visual and functional QA.
- This package is assembled from the previously provided CSC project files, not a fresh export of any changes made directly in GitHub since then. Check those newer changes before replacing the live site.
