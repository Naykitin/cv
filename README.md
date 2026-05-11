# Vladyslav Nikitin CV

Modern React CV website with animations, downloadable PDF, and a third-party contact form endpoint.

## Scripts

```bash
npm start
npm test -- --watchAll=false
npm run build
```

## Contact Form

The contact form posts to Formspree. The default endpoint is already configured in `src/App.js`.

To override it for another form, create `.env.local` from `.env.example` and set:

```bash
REACT_APP_FORMSPREE_ENDPOINT=https://formspree.io/f/xkoykqdk
```

For GitHub Pages or another static host, the fallback endpoint will be bundled during the build unless a build environment variable overrides it.
