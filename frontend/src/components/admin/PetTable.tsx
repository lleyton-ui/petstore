import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton, 
  Chip, 
  Box, 
  Typography 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Pet } from '../../types/pet';

interface PetTableProps {
  pets: Pet[];
  onEdit: (pet: Pet) => void;
  onDelete: (id: number) => void;
}

const PetTable: React.FC<PetTableProps> = ({ pets, onEdit, onDelete }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow className="bg-slate-50">
            <TableCell className="font-bold">ID</TableCell>
            <TableCell className="font-bold">Name</TableCell>
            <TableCell className="font-bold">Species/Breed</TableCell>
            <TableCell className="font-bold">Price</TableCell>
            <TableCell className="font-bold">Status</TableCell>
            <TableCell className="font-bold">Created At</TableCell>
            <TableCell align="right" className="font-bold">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center" className="py-8">
                <Typography color="text.secondary">No pets found</Typography>
              </TableCell>
            </TableRow>
          ) : (
            pets.map((pet) => (
              <TableRow 
                key={pet.id} 
                className={pet.deletedAt ? 'opacity-50 grayscale bg-slate-50' : ''}
              >
                <TableCell>{pet.id}</TableCell>
                <TableCell className="font-medium">{pet.name}</TableCell>
                <TableCell>
                  <Typography variant="body2">{pet.species}</Typography>
                  <Typography variant="caption" color="text.secondary">{pet.breed}</Typography>
                </TableCell>
                <TableCell>${pet.price.toLocaleString()}</TableCell>
                <TableCell>
                  <Box className="flex gap-1 items-center">
                    <Chip 
                      label={pet.availabilityStatus} 
                      size="small" 
                      color={pet.availabilityStatus === 'AVAILABLE' ? 'success' : 'default'}
                    />
                    {pet.deletedAt && (
                      <Chip label="DELETED" size="small" color="error" variant="outlined" />
                    )}
                  </Box>
                </TableCell>
                <TableCell>{new Date(pet.createdAt).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                  {!pet.deletedAt && (
                    <Box>
                      <IconButton onClick={() => onEdit(pet)} color="primary" size="small">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => onDelete(pet.id)} color="error" size="small">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PetTable;
