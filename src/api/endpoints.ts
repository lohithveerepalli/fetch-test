import { apiClient } from './client';
import type { Dog, Location, LoginRequest, Match, SearchParams, SearchResponse } from './types';

export const auth = {
  login: async (data: LoginRequest) => {
    await apiClient.post('/auth/login', data);
  },
  logout: async () => {
    await apiClient.post('/auth/logout');
  },
};

export const dogs = {
  getBreeds: async (): Promise<string[]> => {
    const { data } = await apiClient.get<string[]>('/dogs/breeds');
    return data;
  },

  search: async (params: SearchParams): Promise<SearchResponse> => {
    const { data } = await apiClient.get<SearchResponse>('/dogs/search', { params });
    return data;
  },

  getMany: async (dogIds: string[]): Promise<Dog[]> => {
    const { data } = await apiClient.post<Dog[]>('/dogs', dogIds);
    return data;
  },

  match: async (dogIds: string[]): Promise<Match> => {
    const { data } = await apiClient.post<Match>('/dogs/match', dogIds);
    return data;
  },
};

export const locations = {
  getMany: async (zipCodes: string[]): Promise<Location[]> => {
    const { data } = await apiClient.post<Location[]>('/locations', zipCodes);
    return data;
  },
}; 