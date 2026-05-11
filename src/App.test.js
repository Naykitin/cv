import { render, screen } from '@testing-library/react';
import App from './App';

test('renders CV hero heading', () => {
  render(<App />);
  const heading = screen.getByRole('heading', { name: /vladyslav nikitin/i });
  expect(heading).toBeInTheDocument();
});
