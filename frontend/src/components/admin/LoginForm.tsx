import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { adminApi } from '../../api/adminApi';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await adminApi.login({ username, password });
      login(response.data.accessToken);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Typography variant="h5" className="font-bold text-center mb-2">
        Admin Login
      </Typography>
      
      {error && <Alert severity="error">{error}</Alert>}
      
      <TextField
        label="Username"
        variant="outlined"
        fullWidth
        required
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        disabled={loading}
      />
      
      <TextField
        label="Password"
        type="password"
        variant="outlined"
        fullWidth
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
      />
      
      <Button
        type="submit"
        variant="contained"
        size="large"
        fullWidth
        disabled={loading}
        className="py-3"
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
      </Button>
    </Box>
  );
};

export default LoginForm;
