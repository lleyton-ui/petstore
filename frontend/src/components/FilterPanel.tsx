import React from 'react';
import { 
  Box, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  TextField, 
  Slider, 
  Button, 
  Paper,
  Divider
} from '@mui/material';
import type { FilterCriteria } from '../types/pet';

interface FilterPanelProps {
  filters: FilterCriteria;
  onFilterChange: (newFilters: Partial<FilterCriteria>) => void;
  onClear: () => void;
}

const SPECIES_OPTIONS = ['DOG', 'CAT', 'BIRD', 'FISH', 'RABBIT', 'HAMSTER', 'REPTILE', 'OTHER'];

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange, onClear }) => {
  const handleSpeciesChange = (e: any) => {
    onFilterChange({ species: e.target.value === 'ALL' ? undefined : e.target.value, page: 0 });
  };

  const handleBreedChange = (e: any) => {
    onFilterChange({ breed: e.target.value || undefined, page: 0 });
  };

  const handlePriceChange = (_event: Event, newValue: number | number[]) => {
    const [min, max] = newValue as number[];
    onFilterChange({ minPrice: min, maxPrice: max, page: 0 });
  };

  const handleAgeChange = (_event: Event, newValue: number | number[]) => {
    const [min, max] = newValue as number[];
    onFilterChange({ minAge: min, maxAge: max, page: 0 });
  };

  return (
    <Paper className="p-4 sticky top-4 h-fit max-w-sm w-full">
      <Typography variant="h6" className="font-bold mb-4">Filters</Typography>
      
      <Box className="flex flex-col gap-6">
        <FormControl fullWidth size="small">
          <InputLabel>Species</InputLabel>
          <Select
            value={filters.species || 'ALL'}
            label="Species"
            onChange={handleSpeciesChange}
          >
            <MenuItem value="ALL">All Species</MenuItem>
            {SPECIES_OPTIONS.map(s => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Breed"
          variant="outlined"
          size="small"
          fullWidth
          value={filters.breed || ''}
          onChange={handleBreedChange}
          placeholder="Search by breed..."
        />

        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Price Range ($)
          </Typography>
          <Slider
            value={[filters.minPrice || 0, filters.maxPrice || 5000]}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            min={0}
            max={5000}
            step={50}
            size="small"
          />
          <Box className="flex justify-between">
            <Typography variant="caption">${filters.minPrice || 0}</Typography>
            <Typography variant="caption">${filters.maxPrice || 5000}+</Typography>
          </Box>
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Age (Months)
          </Typography>
          <Slider
            value={[filters.minAge || 0, filters.maxAge || 240]}
            onChange={handleAgeChange}
            valueLabelDisplay="auto"
            min={0}
            max={240}
            step={1}
            size="small"
          />
          <Box className="flex justify-between">
            <Typography variant="caption">{filters.minAge || 0}m</Typography>
            <Typography variant="caption">{filters.maxAge || 240}m+</Typography>
          </Box>
        </Box>

        <Divider />

        <Button 
          variant="outlined" 
          fullWidth 
          onClick={onClear}
          size="small"
        >
          Reset All
        </Button>
      </Box>
    </Paper>
  );
};

export default FilterPanel;
