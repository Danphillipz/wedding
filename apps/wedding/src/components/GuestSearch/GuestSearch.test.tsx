import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GuestSearch from './GuestSearch';
import type { SearchResult } from '../../types';

// Mock the guestlist module
jest.mock('../../lib/guestlist');

import * as guestlistModule from '../../lib/guestlist';

const mockSearchGuest = jest.spyOn(guestlistModule, 'searchGuest');

describe('GuestSearch', () => {
  const mockOnGuestFound = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render search input and submit button', () => {
    render(<GuestSearch onGuestFound={mockOnGuestFound} />);

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

  it('should require name input before searching', () => {
    render(<GuestSearch onGuestFound={mockOnGuestFound} />);

    const submitButton = screen.getByRole('button', { name: /search/i });

    fireEvent.click(submitButton);

    expect(mockSearchGuest).not.toHaveBeenCalled();
  });
});
