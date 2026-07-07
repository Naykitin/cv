# Vladyslav Nikitin CV

Modern React CV website with a dark editorial theme, animations, downloadable PDF, and a third-party contact form endpoint. Built with Vite.

## Scripts

```bash
npm run dev      # start the dev server
npm test         # run the Vitest suite once
npm run build    # production build into build/
npm run preview  # serve the production build locally
```

## Contact Form

The contact form posts to Formspree. The default endpoint is already configured in `src/App.jsx`.

To override it for another form, create `.env.local` from `.env.example` and set:

```bash
VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/xkoykqdk
```

For GitHub Pages or another static host, the fallback endpoint will be bundled during the build unless a build environment variable overrides it.
