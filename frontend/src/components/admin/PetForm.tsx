import React from 'react';
import { useForm } from 'react-hook-form';
import { 
  Box, 
  TextField, 
  Button, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormHelperText 
} from '@mui/material';
import type { Pet } from '../../types/pet';

interface PetFormProps {
  initialData?: Pet;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

const SPECIES_OPTIONS = ['DOG', 'CAT', 'BIRD', 'FISH', 'RABBIT', 'HAMSTER', 'REPTILE', 'OTHER'];
const STATUS_OPTIONS = ['AVAILABLE', 'SOLD', 'RESERVED'];

const PetForm: React.FC<PetFormProps> = ({ initialData, onSubmit, onCancel, loading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData || {
      name: '',
      species: '',
      breed: '',
      ageMonths: 0,
      price: 0,
      availabilityStatus: 'AVAILABLE',
      photoUrl: '',
      description: ''
    }
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} className="p-2">
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Pet Name"
            fullWidth
            required
            {...register('name', { required: 'Name is required', maxLength: 100 })}
            error={!!errors.name}
            helperText={errors.name?.message}
            disabled={loading}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={!!errors.species}>
            <InputLabel>Species</InputLabel>
            <Select
              label="Species"
              defaultValue={initialData?.species || ''}
              {...register('species', { required: 'Species is required' })}
              disabled={loading}
            >
              {SPECIES_OPTIONS.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
            <FormHelperText>{errors.species?.message}</FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Breed"
            fullWidth
            required
            {...register('breed', { required: 'Breed is required' })}
            error={!!errors.breed}
            helperText={errors.breed?.message}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={!!errors.availabilityStatus}>
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              defaultValue={initialData?.availabilityStatus || 'AVAILABLE'}
              {...register('availabilityStatus')}
              disabled={loading}
            >
              {STATUS_OPTIONS.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Age (Months)"
            type="number"
            fullWidth
            required
            {...register('ageMonths', { required: 'Age is required', min: 0 })}
            error={!!errors.ageMonths}
            helperText={errors.ageMonths?.message}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Price ($)"
            type="number"
            fullWidth
            required
            {...register('price', { required: 'Price is required', min: 0.01 })}
            error={!!errors.price}
            helperText={errors.price?.message}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Photo URL"
            fullWidth
            {...register('photoUrl')}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={4}
            {...register('description')}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} className="flex justify-end gap-2 mt-4">
          <Button onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {initialData ? 'Update Pet' : 'Add Pet'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PetForm;
