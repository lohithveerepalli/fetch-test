import { useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  Alert,
  Box,
  Avatar,
} from '@mui/material';
import { PetsRounded } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { CenteredLayout } from '../components/CenteredLayout';

export function LoginPage() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Basic validation
      if (!formData.name.trim() || !formData.email.trim()) {
        throw new Error('Please fill in all fields');
      }
      if (!formData.email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      await login(formData.name.trim(), formData.email.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(''); // Clear error when user types
  };

  return (
    <CenteredLayout maxWidth="xs">
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <PetsRounded />
      </Avatar>
      <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
        Welcome to Fetch
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
        Find your perfect furry friend from our network of shelter dogs
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <TextField
          margin="normal"
          required
          fullWidth
          label="Name"
          name="name"
          autoComplete="name"
          autoFocus
          value={formData.name}
          onChange={handleChange}
          disabled={isLoading}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Email Address"
          name="email"
          autoComplete="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={isLoading}
          sx={{ mt: 3, mb: 2 }}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </Box>
    </CenteredLayout>
  );
} 