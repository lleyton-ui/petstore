import { useState, useEffect, useCallback } from 'react';
import axiosClient from '../api/axiosClient';
import type { Pet, PetListResponse, FilterCriteria } from '../types/pet';

export const usePets = (filters: FilterCriteria) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get<PetListResponse>('/pets', {
        params: {
          ...filters,
          // Sort is handled by the criteria object which usually comes from state
        }
      });
      setPets(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch pets');
      console.error('Error fetching pets:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  return { pets, totalPages, loading, error, refetch: fetchPets };
};
