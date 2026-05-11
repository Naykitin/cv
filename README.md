# Vladyslav Nikitin CV

Modern React CV website with animations, downloadable PDF, and a third-party contact form endpoint.

## Scripts

```bash
npm start
npm test -- --watchAll=false
npm run build
```

## Contact Form

The contact form posts to a Formspree-compatible endpoint.

1. Create a form at https://formspree.io/.
2. Copy the form endpoint URL.
3. Create `.env.local` from `.env.example`.
4. Set:

```bash
REACT_APP_FORMSPREE_ENDPOINT=https://formspree.io/f/your-form-id
```

For GitHub Pages or another static host, add the same value as a build environment variable before running the production build.
