import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  IconButton, 
  Typography, 
  Box, 
  Grid, 
  Chip, 
  Divider,
  Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import type { Pet } from '../types/pet';

interface PetDetailModalProps {
  pet: Pet | null;
  open: boolean;
  onClose: () => void;
}

const PetDetailModal: React.FC<PetDetailModalProps> = ({ pet, open, onClose }) => {
  if (!pet) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <IconButton
        onClick={onClose}
        sx={{ position: 'absolute', right: 8, top: 8, zIndex: 1 }}
      >
        <CloseIcon />
      </IconButton>
      
      <DialogContent className="p-0">
        <Grid container>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box 
              component="img"
              src={pet.photoUrl || '/placeholder-pet.png'}
              alt={pet.name}
              className="w-full h-full object-cover max-h-[500px]"
              onError={(e: any) => { e.target.src = '/placeholder-pet.png'; }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} className="p-6">
            <Typography variant="h3" className="font-bold mb-2">
              {pet.name}
            </Typography>
            
            <Box className="flex items-center gap-4 mb-4">
              <Typography variant="h4" color="primary" className="font-bold">
                ${pet.price.toLocaleString()}
              </Typography>
              <Chip 
                label={pet.availabilityStatus} 
                color={pet.availabilityStatus === 'AVAILABLE' ? 'success' : 'warning'}
                variant="outlined"
              />
            </Box>

            <Divider className="mb-4" />

            <Grid container spacing={2} className="mb-6">
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary">SPECIES</Typography>
                <Typography variant="body1" className="font-medium">{pet.species}</Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary">BREED</Typography>
                <Typography variant="body1" className="font-medium">{pet.breed}</Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary">AGE</Typography>
                <Typography variant="body1" className="font-medium">{pet.ageMonths} months</Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary">ID</Typography>
                <Typography variant="body1" className="font-medium">#{pet.id}</Typography>
              </Grid>
            </Grid>

            <Typography variant="subtitle1" className="font-bold mb-2">Description</Typography>
            <Typography variant="body1" color="text.secondary" className="mb-8">
              {pet.description || "No description provided for this pet. They are waiting for a loving home!"}
            </Typography>

            <Button 
              variant="contained" 
              fullWidth 
              size="large" 
              startIcon={<ShoppingBagIcon />}
              disabled={pet.availabilityStatus !== 'AVAILABLE'}
              sx={{ py: 2 }}
            >
              Interested? Contact Us
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default PetDetailModal;
