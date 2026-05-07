import { useState, useCallback, useEffect } from 'react';
import { adminApi } from '../api/adminApi';
import type { Pet, FilterCriteria } from '../types/pet';

export const useAdminPets = (filters: FilterCriteria) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminApi.getPets(filters);
      setPets(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch admin pets');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createPet = async (data: any) => {
    await adminApi.createPet(data);
    await fetchPets();
  };

  const updatePet = async (id: number, data: any) => {
    await adminApi.updatePet(id, data);
    await fetchPets();
  };

  const deletePet = async (id: number) => {
    await adminApi.deletePet(id);
    await fetchPets();
  };

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  return { pets, totalPages, loading, error, createPet, updatePet, deletePet, refetch: fetchPets };
};
