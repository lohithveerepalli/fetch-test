import { useQuery } from '@tanstack/react-query';
import { dogs } from '../api';

export function useBreeds() {
  return useQuery({
    queryKey: ['breeds'],
    queryFn: dogs.getBreeds,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
    select: (data) => data.sort(), // Sort breeds alphabetically
    retry: 2,
  });
} 