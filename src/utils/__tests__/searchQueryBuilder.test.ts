import { describe, it, expect } from 'vitest';
import { buildSearchParams, parseSortString } from '../searchQueryBuilder';

describe('buildSearchParams', () => {
  it('should return default size when no filters provided', () => {
    expect(buildSearchParams({})).toEqual({ size: 25 });
  });

  it('should include breeds when provided', () => {
    const filters = { breeds: ['Labrador', 'Poodle'] };
    expect(buildSearchParams(filters)).toEqual({
      breeds: ['Labrador', 'Poodle'],
      size: 25,
    });
  });

  it('should include age range when provided', () => {
    const filters = { ageMin: 1, ageMax: 5 };
    expect(buildSearchParams(filters)).toEqual({
      ageMin: 1,
      ageMax: 5,
      size: 25,
    });
  });

  it('should handle single age boundary', () => {
    expect(buildSearchParams({ ageMin: 2 })).toEqual({
      ageMin: 2,
      size: 25,
    });
    expect(buildSearchParams({ ageMax: 10 })).toEqual({
      ageMax: 10,
      size: 25,
    });
  });

  it('should include zip codes when provided', () => {
    const filters = { zipCodes: ['12345', '67890'] };
    expect(buildSearchParams(filters)).toEqual({
      zipCodes: ['12345', '67890'],
      size: 25,
    });
  });

  it('should format sort parameter correctly', () => {
    const filters = {
      sort: { field: 'breed' as const, order: 'asc' as const },
    };
    expect(buildSearchParams(filters)).toEqual({
      sort: 'breed:asc',
      size: 25,
    });
  });

  it('should include pagination when provided', () => {
    const filters = {};
    const page = { from: 'next_page_token' };
    expect(buildSearchParams(filters, page)).toEqual({
      from: 'next_page_token',
      size: 25,
    });
  });

  it('should combine all parameters when provided', () => {
    const filters = {
      breeds: ['Labrador'],
      ageMin: 1,
      ageMax: 5,
      zipCodes: ['12345'],
      sort: { field: 'age' as const, order: 'desc' as const },
      size: 50,
    };
    const page = { from: 'next_page_token' };

    expect(buildSearchParams(filters, page)).toEqual({
      breeds: ['Labrador'],
      ageMin: 1,
      ageMax: 5,
      zipCodes: ['12345'],
      sort: 'age:desc',
      from: 'next_page_token',
      size: 50,
    });
  });
});

describe('parseSortString', () => {
  it('should return undefined for invalid input', () => {
    expect(parseSortString()).toBeUndefined();
    expect(parseSortString('')).toBeUndefined();
    expect(parseSortString('invalid')).toBeUndefined();
    expect(parseSortString('invalid:format')).toBeUndefined();
    expect(parseSortString('breed:invalid')).toBeUndefined();
    expect(parseSortString('invalid:asc')).toBeUndefined();
  });

  it('should parse valid sort strings', () => {
    expect(parseSortString('breed:asc')).toEqual({
      field: 'breed',
      order: 'asc',
    });
    expect(parseSortString('age:desc')).toEqual({
      field: 'age',
      order: 'desc',
    });
    expect(parseSortString('name:asc')).toEqual({
      field: 'name',
      order: 'asc',
    });
  });

  it('should handle all valid field combinations', () => {
    const fields = ['breed', 'age', 'name'];
    const orders = ['asc', 'desc'];

    fields.forEach(field => {
      orders.forEach(order => {
        expect(parseSortString(`${field}:${order}`)).toEqual({
          field,
          order,
        });
      });
    });
  });
}); 