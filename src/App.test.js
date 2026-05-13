import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
});

test('renders CV hero heading', () => {
  global.fetch = undefined;

  render(<App />);
  const heading = screen.getByRole('heading', { name: /commerce, CMS, and React platforms/i });
  expect(heading).toBeInTheDocument();
});

test('uses Ukrainian CV download for visitors from Ukraine', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ countryCode: 'UA' }),
  });

  render(<App />);

  await waitFor(() => {
    expect(screen.getByRole('link', { name: /download cv/i })).toHaveAttribute(
      'href',
      '/Nikitin_Vladyslav_CV_UA.pdf'
    );
  });

  expect(screen.getAllByRole('link', { name: /\+380 99 764 4998/i })).toHaveLength(2);
  screen.getAllByRole('link', { name: /\+380 99 764 4998/i }).forEach((phoneLink) => {
    expect(phoneLink).toHaveAttribute('href', 'https://t.me/naykitin');
  });
});

test('uses WhatsApp link for the default Spanish phone number', async () => {
  global.fetch = jest.fn().mockResolvedValue({
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
