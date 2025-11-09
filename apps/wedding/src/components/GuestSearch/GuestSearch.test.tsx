import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GuestSearch from './GuestSearch';
import type { SearchResult } from '../../types';

// Mock the modules
jest.mock('../../lib/guestlist');
jest.mock('../../lib/crypto');
jest.mock('../../data/guestlist.encrypted.json', () => ({
  encrypted: 'mock-encrypted-data',
  version: 1,
}));

import * as guestlistModule from '../../lib/guestlist';
import * as cryptoModule from '../../lib/crypto';

const mockSearchGuest = jest.spyOn(guestlistModule, 'searchGuest');
const mockDecryptGuestlist = jest.spyOn(cryptoModule, 'decryptGuestlist');

// Helper to unlock with correct password
async function unlockGuestSearch() {
  const passwordInput = screen.getByLabelText(/access code/i);
  const unlockButton = screen.getByRole('button', { name: /unlock rsvp/i });

  mockDecryptGuestlist.mockResolvedValue(
    JSON.stringify({ guests: [] })
  );

  fireEvent.change(passwordInput, { target: { value: 'July2nd2026' } });
  fireEvent.click(unlockButton);

  await waitFor(() => {
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
  });
}

describe('GuestSearch', () => {
  const mockOnGuestFound = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render unlock screen initially', () => {
    render(<GuestSearch onGuestFound={mockOnGuestFound} />);

    expect(screen.getByLabelText(/access code/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /unlock rsvp/i })).toBeInTheDocument();
    expect(screen.getByText(/to protect guest privacy/i)).toBeInTheDocument();
  });

  it('should show error for incorrect password', async () => {
    mockDecryptGuestlist.mockRejectedValue(new Error('Decryption failed'));

    render(<GuestSearch onGuestFound={mockOnGuestFound} />);

    const passwordInput = screen.getByLabelText(/access code/i);
    const unlockButton = screen.getByRole('button', { name: /unlock rsvp/i });

    fireEvent.change(passwordInput, { target: { value: 'WrongPassword' } });
    fireEvent.click(unlockButton);

    await waitFor(() => {
      expect(screen.getByText(/incorrect password/i)).toBeInTheDocument();
    });
  });

  it('should unlock and show search form with correct password', async () => {
    mockDecryptGuestlist.mockResolvedValue(
      JSON.stringify({ guests: [] })
    );

    render(<GuestSearch onGuestFound={mockOnGuestFound} />);

    await unlockGuestSearch();

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('should display guest found result', async () => {
    const foundResult: SearchResult = {
      status: 'found',
      guest: {
        id: '1',
        name: 'John Smith',
        email: 'john@example.com',
        postalCode: 'B79 7XX',
      },
      message: 'Welcome, John Smith!',
    };

    mockSearchGuest.mockReturnValue(foundResult);

    render(<GuestSearch onGuestFound={mockOnGuestFound} />);
    await unlockGuestSearch();

    const input = screen.getByLabelText(/full name/i);
    const submitButton = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'John Smith' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/welcome, john smith/i)).toBeInTheDocument();
    });

    expect(mockOnGuestFound).toHaveBeenCalledWith(foundResult.guest);
  });

  it('should display guest not found result', async () => {
    const notFoundResult: SearchResult = {
      status: 'not-found',
      message: 'Guest not found',
    };

    mockSearchGuest.mockReturnValue(notFoundResult);

    render(<GuestSearch onGuestFound={mockOnGuestFound} />);
    await unlockGuestSearch();

    const input = screen.getByLabelText(/full name/i);
    const submitButton = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'Jane Doe' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/guest not found/i)).toBeInTheDocument();
    });

    expect(mockOnGuestFound).not.toHaveBeenCalled();
  });

  it('should display multiple matches and request disambiguation', async () => {
    const multipleMatchesResult: SearchResult = {
      status: 'multiple-matches',
      matches: [
        {
          id: '1',
          name: 'John Smith',
          email: 'john1@example.com',
          postalCode: 'B79 7XX',
        },
        {
          id: '2',
          name: 'John Smith',
          email: 'john2@example.com',
          postalCode: 'CV9 3GH',
        },
      ],
      message: 'Multiple guests found',
    };

    mockSearchGuest.mockReturnValue(multipleMatchesResult);

    render(<GuestSearch onGuestFound={mockOnGuestFound} />);
    await unlockGuestSearch();

    const input = screen.getByLabelText(/full name/i);
    const submitButton = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'John Smith' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/multiple guests found/i)
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/postal code/i)).toBeInTheDocument();
    });
  });

  it('should search with disambiguation details', async () => {
    const multipleMatchesResult: SearchResult = {
      status: 'multiple-matches',
      matches: [
        {
          id: '1',
          name: 'John Smith',
          email: 'john1@example.com',
          postalCode: 'B79 7XX',
        },
        {
          id: '2',
          name: 'John Smith',
          email: 'john2@example.com',
          postalCode: 'CV9 3GH',
        },
      ],
      message: 'Multiple guests found',
    };

    const foundResult: SearchResult = {
      status: 'found',
      guest: {
        id: '1',
        name: 'John Smith',
        email: 'john1@example.com',
        postalCode: 'B79 7XX',
      },
      message: 'Welcome, John Smith!',
    };

    mockSearchGuest
      .mockReturnValueOnce(multipleMatchesResult)
      .mockReturnValueOnce(foundResult);

    render(<GuestSearch onGuestFound={mockOnGuestFound} />);
    await unlockGuestSearch();

    const nameInput = screen.getByLabelText(/full name/i);
    const submitButton = screen.getByRole('button', { name: /search/i });

    fireEvent.change(nameInput, { target: { value: 'John Smith' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    });

    const emailInput = screen.getByLabelText(/email address/i);
    fireEvent.change(emailInput, { target: { value: 'john1@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/welcome, john smith/i)).toBeInTheDocument();
    });

    expect(mockSearchGuest).toHaveBeenCalledTimes(2);
    expect(mockSearchGuest).toHaveBeenLastCalledWith(
      expect.any(Object), // guestlist
      'John Smith',
      'john1@example.com',
      undefined
    );
  });

  it('should display deadline passed message', async () => {
    const deadlinePassedResult: SearchResult = {
      status: 'deadline-passed',
      message: 'RSVP deadline has passed',
    };

    mockSearchGuest.mockReturnValue(deadlinePassedResult);

    render(<GuestSearch onGuestFound={mockOnGuestFound} />);
    await unlockGuestSearch();

    const input = screen.getByLabelText(/full name/i);
    const submitButton = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'John Smith' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/rsvp deadline has passed/i)
      ).toBeInTheDocument();
    });

    expect(mockOnGuestFound).not.toHaveBeenCalled();
  });

  it('should require name input before searching', async () => {
    render(<GuestSearch onGuestFound={mockOnGuestFound} />);
    await unlockGuestSearch();

    const submitButton = screen.getByRole('button', { name: /search/i });

    fireEvent.click(submitButton);

    expect(mockSearchGuest).not.toHaveBeenCalled();
  });
});
