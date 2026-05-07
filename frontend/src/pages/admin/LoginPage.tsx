import React from 'react';
import { Container, Paper, Box } from '@mui/material';
import LoginForm from '../../components/admin/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <Box className="min-h-screen flex items-center justify-center bg-slate-50">
      <Container maxWidth="sm">
        <Paper elevation={3} className="p-8 rounded-2xl">
          <LoginForm />
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
