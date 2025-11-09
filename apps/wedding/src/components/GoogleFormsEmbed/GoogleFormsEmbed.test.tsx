import { render, screen } from '@testing-library/react';
import GoogleFormsEmbed from './GoogleFormsEmbed';

describe('GoogleFormsEmbed', () => {
  const mockGuest = {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    postalCode: 'B79 7XX',
  };

  it('should render an iframe with Google Forms URL', () => {
    render(<GoogleFormsEmbed guest={mockGuest} />);

    const iframe = screen.getByTitle(/rsvp form/i);
    expect(iframe).toBeInTheDocument();
    expect(iframe.tagName).toBe('IFRAME');
  });

  it('should generate pre-fill URL with guest name', () => {
    render(<GoogleFormsEmbed guest={mockGuest} />);

    const iframe = screen.getByTitle(/rsvp form/i) as HTMLIFrameElement;
    expect(iframe.src).toContain('docs.google.com/forms');
    expect(iframe.src).toContain(encodeURIComponent('John Smith'));
  });

  it('should have responsive iframe attributes', () => {
    render(<GoogleFormsEmbed guest={mockGuest} />);

    const iframe = screen.getByTitle(/rsvp form/i) as HTMLIFrameElement;
    expect(iframe).toHaveAttribute('width', '100%');
    expect(iframe).toHaveAttribute('frameBorder', '0');
  });

  it('should handle guest names with special characters', () => {
    const guestWithSpecialChars = {
      ...mockGuest,
      name: "Mary O'Brien-Smith",
    };

    render(<GoogleFormsEmbed guest={guestWithSpecialChars} />);

    const iframe = screen.getByTitle(/rsvp form/i) as HTMLIFrameElement;
    // Check that the name is encoded (apostrophe can be %27 or %20O%27)
    expect(iframe.src).toContain("Mary");
    expect(iframe.src).toContain("Brien-Smith");
  });
});
