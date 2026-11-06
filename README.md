# CSC Property Solutions Ltd — website handover

Complete React website, exported on 2 October 2026 from source commit `1762597ced9fe45adac2f6cfb331336c4fab5c1f`, with portable hosting configuration added for this handover.

## Start here

**GitHub stores your code. Vercel hosts the website.** This package is set up for GitHub + Vercel, not GitHub Pages. It includes every photograph, logo, decorative background, style and page; do not paste everything into one HTML file or upload only `src`.

The existing private CSC website is unchanged by this export. No GitHub repository or Vercel deployment has been created for you yet. Uploading this ZIP itself to GitHub will not create a working website: extract it and upload the contents.

## What you need

- A GitHub account and a Vercel account with a plan suitable for your commercial/client use.
- The final domain you intend to use and access to its DNS settings, if using a custom domain.
- Access to `caeleb@cscpropertysolutionsltd.co.uk` to activate and test FormSubmit.
- Node.js 22 if building on your computer (not required for browser upload).

## 1. Put the source on GitHub

1. Extract the ZIP. Open `CSC-GitHub-Website`.
2. Create an empty repository on GitHub, for example `csc-property-solutions`. Keep it private unless you want the code and client photos public. Do not add a README or other starter files.
3. Choose **uploading an existing file** / **Add file → Upload files**. Upload the contents of the extracted folder, including `src`, `public`, `scripts`, `package.json`, `package-lock.json`, `index.html`, `vite.config.js`, `vercel.json`, README and security notes. Do not upload the outer folder as another nested directory.
4. On a Mac, press Command–Shift–Period to reveal hidden files. Include `.gitignore`, `.env.example` and `.nvmrc` as well. Never upload your real `.env.production` or credentials.
5. Commit the upload. Confirm `package.json` is visible at the repository root, with `src` and `public` beside it.

If the browser cannot upload the full folder, use GitHub Desktop or the terminal. In Terminal, type `cd ` and drag the extracted folder into the window; press Return. Then run:

```bash
git init -b main
git add .
git commit -m "Initial CSC website"
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Replace the remote URL with the HTTPS URL GitHub gives you. Sign in through GitHub's supported authentication prompt; do not put passwords or access tokens in these files.

## 2. Import into Vercel

1. Choose **Add New → Project**, connect GitHub and select your CSC repository.
2. Use the repository root as the Root Directory.
3. Use these settings (also supplied by `vercel.json`):

| Setting | Value |
| --- | --- |
| Framework | Vite |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node.js | 22.x |

4. Before deploying, add the environment variable **VITE_SITE_URL**. Set it to the final HTTPS origin, such as `https://cscpropertysolutionsltd.co.uk` **only if that is the domain you control and plan to use**. Use the exact preferred www or non-www version, without a path. Set it for Production and Preview builds.
5. Deploy. A missing or placeholder domain deliberately stops the build, to avoid publishing the wrong canonical URLs or sitemap.
6. If using a custom domain, add it in Vercel's Domains settings. Apply the exact DNS records Vercel supplies at your registrar. Do not change email/MX records. Verify HTTPS and choose one canonical version of the domain.
7. If you first use a Vercel subdomain, use the actual assigned production origin for `VITE_SITE_URL`. Update it and redeploy when moving to the custom domain.

Git integration handles future deployments when you push updates. No Vercel token needs to be committed. A private GitHub repository does not, by itself, make the deployed website private; check deployment access before sharing.

## 3. Check every route before launch

| Page | URL path |
| --- | --- |
| Home | `/` |
| Services | `/services` |
| Driveway cleaning | `/services/driveway-cleaning` |
| Patio cleaning | `/services/patio-cleaning` |
| About | `/about` |
| Our work | `/our-work` |
| Areas | `/areas` |
| Contact | `/contact` |
| Privacy notice | `/privacy` |

Each route has its own generated HTML page as well as React Router navigation. `cleanUrls` serves those files at the URLs above. Refresh each deep URL directly, not just after clicking the menu. Unknown URLs should show the 404 page. Do not add a blanket rewrite to `/index.html`: it would hide the individual pre-rendered pages and their metadata.

## 4. Enquiries

The form posts to FormSubmit and delivers to `caeleb@cscpropertysolutionsltd.co.uk`. The visitor leaves the site for the provider's verification and result screen. CAPTCHA and the honeypot field are enabled. No SMTP password, API key or custom server is needed in this project.

From the final website, send a test with the owner's permission. Follow any activation message in the business inbox and verify the complete enquiry arrives, including postcode. Check spam folders. Email delivery has NOT been verified by the export checks. Do not regard a build passing as proof that the mailbox receives messages.

## 5. Local preview — preserve the design

Do not double-click `index.html`. It is a Vite source entry, not a standalone saved webpage. Install Node.js 22, open Terminal in this folder and run:

```bash
npm ci
npm run dev
```

Open the localhost address printed by Vite. Photos and styles must remain in their supplied folder structure. To test the production build, copy `.env.example` to `.env.production`, replace its placeholder with your actual HTTPS domain, then:

```bash
npm run build
npm run preview
```

Do not commit `.env.production`. The build checks all page metadata, internal links and security-policy markers. The hostname in metadata comes from `VITE_SITE_URL`; local navigation still runs on localhost.

## 6. Final owner review

- Visually check all nine pages on real phones (320–430px widths), tablet and desktop. Confirm header call button, menu, text wrapping, images and form. Full browser/mobile QA was not completed in this environment.
- Check the live HTTP response for the security headers supplied in `vercel.json`. These were not applied by the previous static host; they are configured here for Vercel but still need verification after deployment.
- Review the privacy notice against actual business practices, especially retention and international provider arrangements. The exported notice now references Vercel rather than the previous host.
- Confirm legal business details, photos/permissions, services, locations, hours, and any remaining gallery wording with the owner.
- Confirm canonical URLs and `/sitemap.xml` contain the final domain. Submit the sitemap through your own Google Search Console account when public.
- Enable MFA for GitHub, hosting, domain and email accounts. Keep the repository lockfile and run `npm audit` regularly.

## Files and editing

- `src/App.jsx`: pages, shared header/footer, service details and contact form.
- `src/Privacy.jsx`: privacy notice.
- `src/style.css`: complete reflective dark design and responsive styles.
- `src/seo.js`: titles, descriptions, canonical URLs and structured data.
- `src/areas.js`: service-area directory.
- `public/`: all original website image assets and favicon. Included without recompression.
- `scripts/`: prerendering, configuration, SEO and security checks.
- `vercel.json`: clean URLs and HTTP security headers.

No `.git` history, `.openai` hosting identity, credentials, `node_modules` or generated build output is included. The build recreates `dist`. This export has no dependency on the private ChatGPT site URL.

## Official references

- GitHub import: https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github
- Vercel configuration: https://vercel.com/docs/project-configuration/vercel-json
- Vite hosting: https://vercel.com/docs/frameworks/frontend/vite
- FormSubmit: https://formsubmit.co/documentation
