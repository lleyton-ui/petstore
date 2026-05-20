import React from 'react';
import { Grid, Box, Pagination, Skeleton } from '@mui/material';
import PetCard from './PetCard';
import EmptyState from './EmptyState';
import type { Pet } from '../types/pet';

interface PetGalleryProps {
  pets: Pet[];
  loading: boolean;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onPetClick: (pet: Pet) => void;
  onClearFilters: () => void;
}

const PetGallery: React.FC<PetGalleryProps> = ({ 
  pets, 
  loading, 
  totalPages, 
  currentPage, 
  onPageChange,
  onPetClick,
  onClearFilters
}) => {
  if (loading) {
    return (
      <Box className="w-full">
        <Grid container spacing={3}>
          {[...Array(8)].map((_, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 1 }} />
              <Skeleton variant="text" sx={{ mt: 1, fontSize: '1.5rem' }} />
              <Skeleton variant="text" width="60%" />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (pets.length === 0) {
    return <EmptyState onClearFilters={onClearFilters} />;
  }

  return (
    <Box className="w-full flex flex-col items-center">
      <Grid container spacing={3} className="mb-8">
        {pets.map(pet => (
          <Grid key={pet.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <PetCard pet={pet} onClick={onPetClick} />
          </Grid>
        ))}
      </Grid>
      
      {totalPages > 1 && (
        <Pagination 
          count={totalPages} 
          page={currentPage + 1} 
          onChange={(_, page) => onPageChange(page - 1)}
          color="primary"
          className="mt-4"
        />
      )}
    </Box>
  );
};

export default PetGallery;
