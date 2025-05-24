import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '../contexts/ThemeContext';
import { AuthProvider } from '../contexts/AuthContext';
import { FavoritesProvider } from '../contexts/FavoritesContext';

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
}

interface WrapperProps {
  children: ReactNode;
}

export function TestWrapper({ children }: WrapperProps) {
  const queryClient = createQueryClient();

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <FavoritesProvider>
              {children}
            </FavoritesProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export const mockDog = {
  id: 'test-dog-1',
  name: 'Buddy',
  breed: 'Labrador',
  age: 3,
  zip_code: '12345',
  img: 'https://example.com/dog.jpg',
};

export const mockDogs = [
  mockDog,
  {
    id: 'test-dog-2',
    name: 'Max',
    breed: 'Poodle',
    age: 2,
    zip_code: '67890',
    img: 'https://example.com/dog2.jpg',
  },
]; 