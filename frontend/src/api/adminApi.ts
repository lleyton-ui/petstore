import axiosClient from './axiosClient';
import type { Pet, PetListResponse, FilterCriteria } from '../types/pet';

// This could be moved to axiosClient interceptors
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const adminApi = {
  login: (credentials: any) => axiosClient.post('/auth/login', credentials),
  
  getPets: (params: FilterCriteria & { includeDeleted?: boolean }) => 
    axiosClient.get<PetListResponse>('/admin/pets', { 
      params,
      headers: getHeaders()
    }),
  
  createPet: (data: any) => 
    axiosClient.post<Pet>('/admin/pets', data, { headers: getHeaders() }),
  
  updatePet: (id: number, data: any) => 
    axiosClient.put<Pet>(`/admin/pets/${id}`, data, { headers: getHeaders() }),
  
  deletePet: (id: number) => 
    axiosClient.delete(`/admin/pets/${id}`, { headers: getHeaders() }),
};
