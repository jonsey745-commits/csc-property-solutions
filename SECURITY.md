# Security maintenance

Reviewed 2 October 2026. This is a static marketing site: no customer accounts, payments, database or secret API keys are required in browser code.

- CSP is present in each generated HTML page. Scripts are restricted to this origin; plugins and base URL changes are blocked. Inline styles remain allowed for the existing design. Google Fonts remains an explicitly permitted dependency.
- `public/_headers` configures HTTPS persistence, MIME sniffing protection, restricted device permissions and framing limited to this origin and ChatGPT. These directives require hosting support; check actual HTTP responses after moving to another host. The CSP meta tag cannot enforce framing restrictions.
- The enquiry form POSTs over HTTPS to FormSubmit, with its CAPTCHA enabled and its documented honeypot field. Verification and the delivery result happen on FormSubmit. FormSubmit must have the recipient activated. Front-end length constraints improve input handling but are not server-side validation or rate limiting. Those controls are managed by the provider.
- Never add sensitive personal information, payment data, secret keys or email credentials to the form, browser code or `VITE_*` environment variables. Environment files and key files are ignored by Git.
- Run `npm ci`, `npm audit`, `npm run build` and `node scripts/check-security.mjs` when updating dependencies. Keep the lockfile committed. Review dependency alerts regularly.
- Enable MFA for hosting, source control, domain registrar and the business mailbox; restrict collaborators and preserve source history. These account settings are outside the website source review.
- Before launch, verify provider activation and complete an authorised delivery test, publish an appropriate privacy notice, check real response headers and HTTPS on the final domain, and retest the form there.

A clean dependency audit is not a penetration test or a guarantee of security. No real enquiry was sent during this review.
