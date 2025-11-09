import { render, screen } from '@testing-library/react';
import Navigation from './Navigation';

describe('Navigation', () => {
  it('should render all navigation links', () => {
    render(<Navigation />);
    
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /rsvp/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
  });

  it('should have correct href attributes', () => {
    render(<Navigation />);
    
    const homeLink = screen.getByRole('link', { name: /home/i });
    const rsvpLink = screen.getByRole('link', { name: /rsvp/i });
    const aboutLink = screen.getByRole('link', { name: /about/i });

    expect(homeLink).toHaveAttribute('href', '/');
    expect(rsvpLink).toHaveAttribute('href', '/rsvp');
    expect(aboutLink).toHaveAttribute('href', '/about');
  });

  it('should render couple names', () => {
    render(<Navigation />);
    
    expect(screen.getByText(/Amy & Dan/i)).toBeInTheDocument();
  });
});
