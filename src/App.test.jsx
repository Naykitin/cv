import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import App from './App';

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
});

test('renders CV hero heading', () => {
  global.fetch = undefined;

  render(<App />);
  const heading = screen.getByRole('heading', { name: /scalable SaaS, automation, and modern web platforms/i });
  expect(heading).toBeInTheDocument();
});

test('uses Ukrainian CV download for visitors from Ukraine', async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ countryCode: 'UA' }),
  });

  render(<App />);

  await waitFor(() => {
    expect(screen.getByRole('link', { name: /download cv/i })).toHaveAttribute(
      'href',
      '/Vladyslav_Nikitin_CV_UA.pdf'
    );
  });

  expect(screen.getAllByRole('link', { name: /\+380 99 764 4998/i })).toHaveLength(2);
  screen.getAllByRole('link', { name: /\+380 99 764 4998/i }).forEach((phoneLink) => {
    expect(phoneLink).toHaveAttribute('href', 'https://t.me/naykitin');
  });
});

test('uses WhatsApp link for the default Spanish phone number', async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ countryCode: 'ES' }),
  });

  render(<App />);

  await waitFor(() => {
    screen.getAllByRole('link', { name: /\+34 672 806 935/i }).forEach((phoneLink) => {
      expect(phoneLink).toHaveAttribute('href', 'https://wa.me/34672806935');
    });
  });
});

test('renders showcase card inside the 3D laptop bezel rig on desktop', () => {
  global.fetch = undefined;
  const originalMatchMedia = window.matchMedia;

  window.matchMedia = (query) => ({
    matches: !query.includes(': reduce') && !query.includes('max-width'),
    media: query,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() {
      return false;
    },
  });

  try {
    const { container, unmount } = render(<App />);
    const rig = container.querySelector('.laptop-rig-container');
    const dolly = rig?.querySelector('.laptop-camera-dolly');
    const lid = dolly?.querySelector('.laptop-lid');
    const bezel = lid?.querySelector('.laptop-bezel');
    const base = dolly?.querySelector('.laptop-base');

    expect(rig).toBeInTheDocument();
    expect(dolly).toBeInTheDocument();
    expect(lid).toBeInTheDocument();
    expect(bezel).toBeInTheDocument();
    expect(base).toBeInTheDocument();
    expect(container.querySelector('canvas.laptop-scrub-canvas')).not.toBeInTheDocument();
    expect(bezel?.querySelector('.hero-showcase')).toBeInTheDocument();
    expect(lid?.querySelectorAll('.lid-edge').length).toBe(4);
    expect(lid?.querySelector('.laptop-lid-rim')).toBeInTheDocument();
    expect(base?.querySelector('.base-face-top')).toBeInTheDocument();
    expect(base?.querySelector('.base-face-front')).toBeInTheDocument();
    expect(base?.querySelector('.base-face-bottom')).toBeInTheDocument();
    expect(base?.querySelector('.base-face-left')).toBeInTheDocument();
    expect(base?.querySelector('.base-face-right')).toBeInTheDocument();
    expect(base?.querySelector('.base-corner-fl')).toBeInTheDocument();
    expect(base?.querySelector('.base-corner-fr')).toBeInTheDocument();
    expect(base?.querySelector('.base-indent')).toBeInTheDocument();
    expect(base?.querySelectorAll('.base-foot').length).toBe(4);
    expect(base?.querySelectorAll('.base-foot-rim').length).toBe(4);
    expect(base?.querySelectorAll('.base-corner-facet').length).toBe(6);
    expect(base?.querySelectorAll('[data-base-leaf]').length).toBeGreaterThanOrEqual(20);
    expect(dolly?.style.transform).toMatch(/scale3d\(/);
    expect(base?.style.opacity).toBe('');
    expect(base?.querySelectorAll('.base-vent').length).toBe(2);
    expect(base?.querySelectorAll('.laptop-key').length).toBeGreaterThan(70);
    expect(base?.querySelector('.laptop-trackpad')).toBeInTheDocument();
    expect(base?.querySelector('.laptop-screen-glow')).toBeInTheDocument();

    unmount();
  } finally {
    window.matchMedia = originalMatchMedia;
  }
});
