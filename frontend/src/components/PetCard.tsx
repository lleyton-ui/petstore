import React from 'react';
import { Card, CardMedia, CardContent, Typography, CardActionArea, Box, Chip } from '@mui/material';
import type { Pet } from '../types/pet';

interface PetCardProps {
  pet: Pet;
  onClick: (pet: Pet) => void;
}

const PetCard: React.FC<PetCardProps> = ({ pet, onClick }) => {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardActionArea onClick={() => onClick(pet)} className="h-full flex flex-col items-start">
        <CardMedia
          component="img"
          height="200"
          image={pet.photoUrl || '/placeholder-pet.png'}
          alt={pet.name}
          className="h-48 object-cover"
          onError={(e: any) => {
            e.target.src = '/placeholder-pet.png';
          }}
        />
        <CardContent className="flex-grow w-full">
          <Box className="flex justify-between items-start mb-2">
            <Typography gutterBottom variant="h5" component="div" className="font-bold">
              {pet.name}
            </Typography>
            <Typography variant="h6" color="primary.main" className="font-bold">
              ${pet.price.toLocaleString()}
            </Typography>
          </Box>
          <Box className="flex gap-1 mb-2 flex-wrap">
            <Chip label={pet.species} size="small" variant="outlined" />
            <Chip label={pet.breed} size="small" variant="outlined" />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {pet.ageMonths} months old
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default PetCard;
