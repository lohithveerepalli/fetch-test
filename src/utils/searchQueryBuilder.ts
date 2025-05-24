import type { SearchParams } from '../api';

export interface SearchFilters {
  breeds?: string[];
  zipCodes?: string[];
  ageMin?: number;
  ageMax?: number;
  size?: number;
  sort?: {
    field: 'breed' | 'age' | 'name';
    order: 'asc' | 'desc';
  };
}

export function buildSearchParams(
  filters: SearchFilters,
  page?: { from?: string },
): SearchParams {
  const { breeds, zipCodes, ageMin, ageMax, size = 25, sort } = filters;

  const params: SearchParams = {
    size,
  };

  // Add optional filters if they exist
  if (breeds?.length) params.breeds = breeds;
  if (zipCodes?.length) params.zipCodes = zipCodes;
  if (typeof ageMin === 'number') params.ageMin = ageMin;
  if (typeof ageMax === 'number') params.ageMax = ageMax;
  if (page?.from) params.from = page.from;
  
  // Add sort parameter if specified
  if (sort) {
    params.sort = `${sort.field}:${sort.order}`;
  }

  return params;
}

const validFields = ['breed', 'age', 'name'] as const;
const validOrders = ['asc', 'desc'] as const;

export function parseSortString(sortString?: string) {
  if (!sortString) return undefined;

  const [field, order] = sortString.split(':');
  
  if (!field || !order) return undefined;
  if (!validFields.includes(field as any)) return undefined;
  if (!validOrders.includes(order as any)) return undefined;

  return {
    field: field as 'breed' | 'age' | 'name',
    order: order as 'asc' | 'desc',
  };
} 