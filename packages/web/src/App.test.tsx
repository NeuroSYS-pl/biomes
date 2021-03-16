import React from 'react';
import { render, screen } from '@testing-library/react';
import { App } from './App';

test('renders biomes header', () => {
  render(<App />);
  const linkElement = screen.getByText(/biomes/i);
  expect(linkElement).toBeInTheDocument();
});
