import { render, screen } from '@testing-library/react';
import RsvpPage from '../src/app/rsvp/page';

// Mock the deadline check
jest.mock('../src/lib/deadline', () => ({
  getRSVPDeadline: jest.fn(() => new Date('2026-05-02T23:59:59')),
  isBeforeDeadline: jest.fn(() => true),
  getDaysUntilDeadline: jest.fn(() => 175),
}));

describe('RSVP Page', () => {
  it('should render page heading', () => {
    render(<RsvpPage />);

    expect(screen.getByRole('heading', { name: /rsvp/i })).toBeInTheDocument();
  });

  it('should display GuestSearch component with unlock screen', () => {
    render(<RsvpPage />);

    // Should show unlock screen initially
    expect(screen.getByLabelText(/access code/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /unlock rsvp/i })).toBeInTheDocument();
  });

  it('should show deadline information when before deadline', () => {
    render(<RsvpPage />);

    expect(
      screen.getByText(/please rsvp by may 2.*2026/i)
    ).toBeInTheDocument();
  });

  it('should use main semantic HTML element', () => {
    const { container } = render(<RsvpPage />);

    const main = container.querySelector('main');
    expect(main).toBeInTheDocument();
  });
});
