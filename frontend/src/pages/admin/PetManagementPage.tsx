import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PetTable from '../../components/admin/PetTable';
import PetForm from '../../components/admin/PetForm';
import { useAdminPets } from '../../hooks/useAdminPets';
import type { Pet } from '../../types/pet';

const PetManagementPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | undefined>(undefined);
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success'
  });

  const { pets, loading, error, createPet, updatePet, deletePet } = useAdminPets({
    sort: 'id,desc',
    size: 100 // Load more for management
  });

  const handleOpenForm = (pet?: Pet) => {
    setEditingPet(pet);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingPet(undefined);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (editingPet) {
        await updatePet(editingPet.id, data);
        setToast({ open: true, message: 'Pet updated successfully!', severity: 'success' });
      } else {
        await createPet(data);
        setToast({ open: true, message: 'Pet created successfully!', severity: 'success' });
      }
      handleCloseForm();
    } catch (err: any) {
      setToast({ open: true, message: 'Operation failed: ' + (err.message || 'Error'), severity: 'error' });
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this pet? This is a soft-delete.')) {
      try {
        await deletePet(id);
        setToast({ open: true, message: 'Pet deleted successfully!', severity: 'success' });
      } catch (err: any) {
        setToast({ open: true, message: 'Delete failed', severity: 'error' });
      }
    }
  };

  return (
    <Box>
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h4" className="font-bold">Manage Pets</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => handleOpenForm()}
        >
          Add New Pet
        </Button>
      </Box>

      {error && <Alert severity="error" className="mb-4">{error}</Alert>}

      {loading ? (
        <Box className="flex justify-center py-20">
          <CircularProgress />
        </Box>
      ) : (
        <PetTable 
          pets={pets} 
          onEdit={handleOpenForm} 
          onDelete={handleDelete} 
        />
      )}

      <Dialog open={isFormOpen} onClose={handleCloseForm} maxWidth="md" fullWidth>
        <DialogTitle className="font-bold">
          {editingPet ? `Edit Pet: ${editingPet.name}` : 'Add New Pet'}
        </DialogTitle>
        <DialogContent>
          <PetForm 
            initialData={editingPet} 
            onSubmit={handleSubmit} 
            onCancel={handleCloseForm} 
            loading={false} // Simplified
          />
        </DialogContent>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PetManagementPage;
