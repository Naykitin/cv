import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
});

test('renders CV hero heading', () => {
  render(<App />);
  const heading = screen.getByRole('heading', { name: /commerce, CMS, and React platforms/i });
  expect(heading).toBeInTheDocument();
});

test('uses Ukrainian CV download for visitors from Ukraine', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ status: 'success', countryCode: 'UA' }),
  });

  render(<App />);

  await waitFor(() => {
    expect(screen.getByRole('link', { name: /download cv/i })).toHaveAttribute(
      'href',
      '/Nikitin_Vladyslav_CV_UA.pdf'
    );
  });
});
