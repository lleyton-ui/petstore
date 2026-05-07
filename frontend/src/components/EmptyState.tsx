import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';

interface EmptyStateProps {
  onClearFilters?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onClearFilters }) => {
  return (
    <Box className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <PetsIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
      <Typography variant="h5" color="text.secondary" gutterBottom>
        No pets found matching your filters
      </Typography>
      <Typography variant="body1" color="text.disabled" sx={{ mb: 3 }}>
        Try adjusting your criteria or clearing all filters.
      </Typography>
      {onClearFilters && (
        <Button variant="contained" onClick={onClearFilters}>
          Clear All Filters
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
