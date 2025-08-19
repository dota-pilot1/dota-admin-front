import { render, screen } from '@testing-library/react';
import Page from '../page';

test('renders page component', () => {
  render(<Page />);
  const linkElement = screen.getByText(/some text/i);
  expect(linkElement).toBeInTheDocument();
});