import React from 'react';
import { render, screen } from '@testing-library/react';
import Page from '../src/app/page';

describe('Homepage', () => {
  it('should render hero image with correct alt text', () => {
    render(<Page />);
    
    const heroImage = screen.getByRole('img', { name: /amy.*dan.*wedding/i });
    expect(heroImage).toBeInTheDocument();
  });

  it('should display "We\'re getting married" announcement text', () => {
    render(<Page />);
    
    expect(screen.getByText(/we're getting married/i)).toBeInTheDocument();
  });

  it('should display wedding date "Thursday July 2nd 2026"', () => {
    render(<Page />);
    
    expect(screen.getByText(/thursday july 2nd 2026/i)).toBeInTheDocument();
  });

  it('should display couple names Amy and Dan', () => {
    render(<Page />);
    
    expect(screen.getByText(/amy/i)).toBeInTheDocument();
    expect(screen.getByText(/dan/i)).toBeInTheDocument();
  });

  it('should have main content with proper semantic HTML', () => {
    render(<Page />);
    
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });
});
