import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { dogs } from '../api';
import type { Dog, SearchResponse } from '../api';
import type { SearchFilters } from '../utils/searchQueryBuilder';
import { buildSearchParams } from '../utils/searchQueryBuilder';

export function useSearch(filters: SearchFilters) {
  const [currentPage, setCurrentPage] = useState<{ from?: string }>({});
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['dogs', filters, currentPage],
    queryFn: async () => {
      const params = buildSearchParams(filters, currentPage);
      const searchResponse = await dogs.search(params);
      const dogDetails = await dogs.getMany(searchResponse.resultIds);
      return {
        dogs: dogDetails,
        pagination: {
          next: searchResponse.next,
          prev: searchResponse.prev,
          total: searchResponse.total,
        },
      };
    },
  });

  const handleNextPage = () => {
    if (data?.pagination.next) {
      setCurrentPage({ from: data.pagination.next });
    }
  };

  const handlePrevPage = () => {
    if (data?.pagination.prev) {
      setCurrentPage({ from: data.pagination.prev });
    }
  };

  const handleResetPage = () => {
    setCurrentPage({});
  };

  return {
    dogs: data?.dogs ?? [],
    pagination: data?.pagination,
    isLoading,
    error,
    handleNextPage,
    handlePrevPage,
    handleResetPage,
  };
} 