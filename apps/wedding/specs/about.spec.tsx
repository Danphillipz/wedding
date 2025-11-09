import { render, screen } from '@testing-library/react';
import AboutPage from '../src/app/about/page';

describe('About Page', () => {
  it('should render the page heading', () => {
    render(<AboutPage />);
    expect(screen.getByRole('heading', { name: /about the day/i, level: 1 })).toBeInTheDocument();
  });

  it('should display venue information', () => {
    render(<AboutPage />);
    
    // Venue section heading
    expect(screen.getByRole('heading', { name: /venue/i })).toBeInTheDocument();
    
    // Venue name should appear in an h3
    expect(screen.getByRole('heading', { name: /thorpe gardens/i, level: 3 })).toBeInTheDocument();
    
    // Location should be visible (using unique postcode)
    expect(screen.getByText(/b79 7xx/i)).toBeInTheDocument();
  });

  it('should display schedule information', () => {
    render(<AboutPage />);
    
    // Schedule section heading
    expect(screen.getByRole('heading', { name: /schedule/i })).toBeInTheDocument();
    
    // Should have multiple time entries in the schedule
    const timeElements = screen.getAllByText(/\d{1,2}:\d{2}\s*(am|pm)/i);
    expect(timeElements.length).toBeGreaterThan(0);
  });

  it('should display dress code information', () => {
    render(<AboutPage />);
    
    // Dress code section heading
    expect(screen.getByRole('heading', { name: /dress code/i })).toBeInTheDocument();
    
    // Should have dress code title as an h3
    expect(screen.getByRole('heading', { name: /formal/i, level: 3 })).toBeInTheDocument();
    
    // Should have dress code description
    expect(screen.getByText(/suits and ties|dresses|gowns|attire/i)).toBeInTheDocument();
  });

  it('should display accommodations information', () => {
    render(<AboutPage />);
    
    // Accommodations section heading
    expect(screen.getByRole('heading', { name: /accommodations/i })).toBeInTheDocument();
    
    // Should have accommodation details
    const accommodationsSection = screen.getByRole('heading', { name: /accommodations/i }).parentElement;
    expect(accommodationsSection).toHaveTextContent(/hotel|accommodation|stay/i);
  });

  it('should have semantic HTML structure', () => {
    render(<AboutPage />);
    
    // Should use main element for page content
    expect(screen.getByRole('main')).toBeInTheDocument();
    
    // Should have multiple sections for organization
    const sections = document.querySelectorAll('section');
    expect(sections.length).toBeGreaterThanOrEqual(4); // Venue, Schedule, Dress Code, Accommodations
  });

  it('should display the wedding date', () => {
    render(<AboutPage />);
    
    // Wedding date: Thursday July 2nd 2026
    expect(screen.getByText(/july.*2.*2026/i)).toBeInTheDocument();
  });

  it('should have venue directions or map information', () => {
    render(<AboutPage />);
    
    // Should have postcode visible (used for directions)
    expect(screen.getByText(/b79 7xx/i)).toBeInTheDocument();
  });
});
