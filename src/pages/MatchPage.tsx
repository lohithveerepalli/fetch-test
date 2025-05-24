import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  useTheme,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import { useFavorites } from '../contexts/FavoritesContext';
import { DogCard } from '../components/DogCard';
import { dogs as dogsApi } from '../api';
import type { Dog } from '../api/types';

export const MatchPage = () => {
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const { favorites, toggleFavorite } = useFavorites();
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const getMatch = async () => {
      if (favorites.size === 0) {
        setError('Please add some dogs to your favorites first!');
        setIsLoading(false);
        return;
      }

      try {
        const matchResponse = await dogsApi.match(Array.from(favorites));
        const dogResponse = await dogsApi.getMany([matchResponse.match]);
        setMatchedDog(dogResponse[0]);
        setShowConfetti(true);
      } catch (err) {
        setError('Failed to find a match. Please try again.');
        console.error('Match error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    getMatch();
  }, [favorites]);

  if (isLoading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Finding your perfect match...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: 'center',
            bgcolor: theme.palette.error.light,
            color: theme.palette.error.contrastText,
          }}
        >
          <Typography variant="h5" gutterBottom>
            Oops!
          </Typography>
          <Typography variant="body1" paragraph>
            {error}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={{ mt: 2 }}
          >
            Back to Search
          </Button>
        </Paper>
      </Container>
    );
  }

  if (!matchedDog) return null;

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          gravity={0.2}
        />
      )}
      
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          It's a Match! 🎉
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Meet your new best friend
        </Typography>
      </Box>

      <Box sx={{ transform: 'scale(1.05)' }}>
        <DogCard
          dog={matchedDog}
          isFavorite={favorites.has(matchedDog.id)}
          onToggleFavorite={toggleFavorite}
          onClick={() => {}}
        />
      </Box>

      <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/')}
          sx={{ minWidth: 120 }}
        >
          Keep Searching
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            setShowConfetti(false);
            navigate('/favorites');
          }}
          sx={{ minWidth: 120 }}
        >
          View Favorites
        </Button>
      </Box>
    </Container>
  );
}; 