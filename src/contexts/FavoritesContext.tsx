import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';

interface FavoritesContextType {
  favorites: Set<string>;
  toggleFavorite: (dogId: string) => void;
  clearFavorites: () => void;
  favoritesArray: string[];
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

const STORAGE_KEY = 'dog-favorites';

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return new Set(saved ? JSON.parse(saved) : []);
  });

  // Persist favorites to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  const toggleFavorite = useCallback((dogId: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(dogId)) {
        next.delete(dogId);
      } else {
        next.add(dogId);
      }
      return next;
    });
  }, []);

  const clearFavorites = useCallback(() => {
    setFavorites(new Set());
  }, []);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        clearFavorites,
        favoritesArray: Array.from(favorites),
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
} 