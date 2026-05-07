import React, { useState } from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';
import FilterPanel from '../components/FilterPanel';
import PetGallery from '../components/PetGallery';
import PetDetailModal from '../components/PetDetailModal';
import { usePets } from '../hooks/usePets';
import type { FilterCriteria, Pet } from '../types/pet';

const DEFAULT_FILTERS: FilterCriteria = {
  page: 0,
  size: 12,
  sort: 'name,asc'
};

const GalleryPage: React.FC = () => {
  const [filters, setFilters] = useState<FilterCriteria>(DEFAULT_FILTERS);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { pets, totalPages, loading, error } = usePets(filters);

  const handleFilterChange = (newFilters: Partial<FilterCriteria>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const handlePetClick = (pet: Pet) => {
    setSelectedPet(pet);
    setIsModalOpen(true);
  };

  return (
    <Container maxWidth="xl" className="py-8">
      <Box className="mb-8">
        <Typography variant="h2" component="h1" className="font-bold mb-2">
          Find Your New Best Friend
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Browse our collection of loving pets waiting for a home.
        </Typography>
      </Box>

      {error && (
        <Typography color="error" className="mb-4">
          Error: {error}
        </Typography>
      )}

      <Grid container spacing={4}>
        <Grid item xs={12} md={3}>
          <FilterPanel 
            filters={filters} 
            onFilterChange={handleFilterChange} 
            onClear={handleClearFilters}
          />
        </Grid>
        <Grid item xs={12} md={9}>
          <PetGallery 
            pets={pets}
            loading={loading}
            totalPages={totalPages}
            currentPage={filters.page || 0}
            onPageChange={(page) => handleFilterChange({ page })}
            onPetClick={handlePetClick}
            onClearFilters={handleClearFilters}
          />
        </Grid>
      </Grid>

      <PetDetailModal 
        pet={selectedPet}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Container>
  );
};

export default GalleryPage;
