import React from 'react';
import { Box, Typography, Grid, Paper, Card, CardContent } from '@mui/material';
import { useAdminPets } from '../../hooks/useAdminPets';
import PetsIcon from '@mui/icons-material/Pets';
import SellIcon from '@mui/icons-material/Sell';
import DeleteIcon from '@mui/icons-material/Delete';

const DashboardPage: React.FC = () => {
  const { pets } = useAdminPets({ size: 1000 }); // Get many for stats

  const stats = [
    { title: 'Total Listings', value: pets.length, icon: <PetsIcon color="primary" />, color: 'blue' },
    { title: 'Active Pets', value: pets.filter(p => !p.deletedAt && p.availabilityStatus === 'AVAILABLE').length, icon: <SellIcon color="success" />, color: 'green' },
    { title: 'Sold / Reserved', value: pets.filter(p => p.availabilityStatus !== 'AVAILABLE').length, icon: <SellIcon color="warning" />, color: 'orange' },
    { title: 'Deleted', value: pets.filter(p => !!p.deletedAt).length, icon: <DeleteIcon color="error" />, color: 'red' },
  ];

  return (
    <Box>
      <Typography variant="h4" className="font-bold mb-6">Dashboard Overview</Typography>
      
      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Card elevation={2}>
              <CardContent className="flex items-center gap-4">
                <Box className="p-3 rounded-full bg-slate-50">
                  {stat.icon}
                </Box>
                <Box>
                  <Typography color="text.secondary" variant="caption" className="font-bold uppercase tracking-wider">
                    {stat.title}
                  </Typography>
                  <Typography variant="h4" className="font-bold">
                    {stat.value}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Box className="mt-8">
        <Paper className="p-6">
          <Typography variant="h6" className="font-bold mb-2">Welcome, Administrator</Typography>
          <Typography color="text.secondary">
            Use the sidebar to manage the pet catalog. You can create new listings, 
            update details, or remove pets from the public gallery.
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default DashboardPage;
