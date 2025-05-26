import { useQuery } from '@tanstack/react-query';
import type { Dog, SearchResponse } from '../api/types';
import { useState, useCallback } from 'react';
import debounce from 'lodash/debounce';
import { dogs as dogsApi, locations as locationsApi } from '../api';
import { apiClient } from '../api/client';
import type { SearchFilters } from '../utils/searchQueryBuilder';
import { buildSearchParams } from '../utils/searchQueryBuilder';

interface SearchState {
  currentPage: string | null;
  nextPage: string | null;
  prevPage: string | null;
  total: number;
  dogs: Dog[];
}

export const useSearch = (filters: SearchFilters) => {
  const [searchState, setSearchState] = useState<SearchState>({
    currentPage: null,
    nextPage: null,
    prevPage: null,
    total: 0,
    dogs: [],
  });

  // Debounced location search
  const searchLocations = useCallback(
    debounce(async (query: string) => {
      try {
        const locations = await locationsApi.getMany([query]);
        return locations;
      } catch (error) {
        console.error('Error searching locations:', error);
        return [];
      }
    }, 300),
    []
  );

  const { isLoading, error, refetch } = useQuery({
    queryKey: ['dogs', filters, searchState.currentPage],
    queryFn: async () => {
      try {
        let searchResponse;
        
        if (searchState.currentPage) {
          // If we have a currentPage URL, use it directly
          const { data } = await apiClient.get<SearchResponse>(searchState.currentPage);
          searchResponse = data;
        } else {
          // Initial search - build params
          const params = buildSearchParams(filters);
          searchResponse = await dogsApi.search(params);
        }

        const { resultIds, total, next, prev } = searchResponse;

        if (!resultIds.length) {
          return {
            dogs: [],
            total: 0,
            next: null,
            prev: null,
          };
        }

        // Fetch dog details
        const dogs = await dogsApi.getMany(resultIds);

        // Update search state with the full next/prev URLs
        setSearchState(prevState => ({
          ...prevState,
          nextPage: next || null,
          prevPage: prev || null,
          total,
          dogs,
        }));

        return {
          dogs,
          total,
          next,
          prev,
        };
      } catch (error) {
        console.error('Search error:', error);
        throw new Error('Failed to fetch dogs. Please try again.');
      }
    },
    staleTime: 5000, // Keep data fresh for 5 seconds
    retry: 2,
    refetchOnWindowFocus: false,
  });

  const handleNextPage = useCallback(() => {
    if (isLoading || !searchState.nextPage) return;
    setSearchState(prevState => ({
      ...prevState,
      currentPage: searchState.nextPage,
      dogs: [], // Clear dogs to show loading state
    }));
  }, [isLoading, searchState.nextPage]);

  const handlePrevPage = useCallback(() => {
    if (isLoading || !searchState.prevPage) return;
    setSearchState(prevState => ({
      ...prevState,
      currentPage: searchState.prevPage,
      dogs: [], // Clear dogs to show loading state
    }));
  }, [isLoading, searchState.prevPage]);

  const handleResetPage = useCallback(() => {
    setSearchState(prevState => ({
      ...prevState,
      currentPage: null,
      nextPage: null,
      prevPage: null,
      dogs: [], // Clear dogs to show loading state
    }));
  }, []);

  return {
    dogs: searchState.dogs,
    total: searchState.total,
    pagination: {
      next: searchState.nextPage,
      prev: searchState.prevPage,
      total: searchState.total,
    },
    isLoading,
    error,
    handleNextPage,
    handlePrevPage,
    handleResetPage,
    refetch,
    searchLocations,
    searchState,
  };
}; 