import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../../App';
import { dogs } from '../../api';

// Mock the API calls
vi.mock('../../api', () => ({
  dogs: {
    search: vi.fn().mockResolvedValue({
      resultIds: ['dog1', 'dog2'],
      total: 2,
      next: null,
      prev: null,
    }),
    getMany: vi.fn().mockResolvedValue([
      {
        id: 'dog1',
        name: 'Buddy',
        breed: 'Labrador',
        age: 3,
        zip_code: '12345',
        img: 'https://example.com/dog1.jpg',
      },
      {
        id: 'dog2',
        name: 'Max',
        breed: 'Poodle',
        age: 2,
        zip_code: '67890',
        img: 'https://example.com/dog2.jpg',
      },
    ]),
    match: vi.fn().mockResolvedValue({ match: 'dog1' }),
  },
}));

function setup() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  );
}

describe('Happy Path Flow', () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
    // Reset mock function calls
    vi.clearAllMocks();
  });

  it('completes the full adoption flow', async () => {
    setup();

    // Step 1: Login
    expect(screen.getByText(/Welcome to Fetch/i)).toBeInTheDocument();
    
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Step 2: Search Page
    await waitFor(() => {
      expect(screen.getByText(/Find Your Perfect Dog/i)).toBeInTheDocument();
    });

    // Verify dogs are loaded
    await waitFor(() => {
      expect(screen.getByText('Buddy')).toBeInTheDocument();
      expect(screen.getByText('Max')).toBeInTheDocument();
    });

    // Step 3: Add to favorites
    const favoriteButtons = screen.getAllByRole('button', { name: /Add to favorites/i });
    fireEvent.click(favoriteButtons[0]); // Add Buddy to favorites

    // Step 4: Navigate to match
    const matchButton = screen.getByRole('button', { name: /Find Match/i });
    fireEvent.click(matchButton);

    // Step 5: Generate match
    await waitFor(() => {
      expect(screen.getByText(/Find Your Perfect Match/i)).toBeInTheDocument();
    });

    const generateButton = screen.getByRole('button', { name: /Generate Match/i });
    fireEvent.click(generateButton);

    // Step 6: Verify match result
    await waitFor(() => {
      expect(screen.getByText(/It's a Match!/i)).toBeInTheDocument();
      expect(screen.getByText('Buddy')).toBeInTheDocument();
    });

    // Verify API calls
    expect(dogs.search).toHaveBeenCalled();
    expect(dogs.getMany).toHaveBeenCalled();
    expect(dogs.match).toHaveBeenCalledWith(['dog1']);
  });
}); 