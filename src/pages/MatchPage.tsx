import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Search, Refresh } from '@mui/icons-material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { dogs } from '../api';
import { useFavorites } from '../contexts/FavoritesContext';
import { DogCard } from '../components/DogCard';

export function MatchPage() {
  const navigate = useNavigate();
  const { favoritesArray, clearFavorites } = useFavorites();
  const [matchId, setMatchId] = useState<string>();

  const matchMutation = useMutation({
    mutationFn: () => dogs.match(favoritesArray),
    onSuccess: data => setMatchId(data.match),
  });

  const { data: matchedDog, isLoading: isLoadingDog } = useQuery({
    queryKey: ['dog', matchId],
    queryFn: () => dogs.getMany([matchId!]).then(dogs => dogs[0]),
    enabled: !!matchId,
  });

  const handleTryAgain = () => {
    setMatchId(undefined);
    matchMutation.mutate();
  };

  const handleStartOver = () => {
    clearFavorites();
    navigate('/search');
  };

  // If no favorites, redirect to search
  if (favoritesArray.length === 0) {
    return (
      <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            No Favorites Selected
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Please select some dogs as favorites before finding a match.
          </Typography>
          <Button
            variant="contained"
            startIcon={<Search />}
            onClick={() => navigate('/search')}
          >
            Back to Search
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      {!matchId && !matchMutation.isPending && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Find Your Perfect Match
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            We'll help you find the perfect match from your {favoritesArray.length} favorite dogs.
          </Typography>
          <Button
            variant="contained"
            onClick={() => matchMutation.mutate()}
            disabled={matchMutation.isPending}
          >
            Generate Match
          </Button>
        </Paper>
      )}

      {(matchMutation.isPending || isLoadingDog) && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography>Finding your perfect match...</Typography>
        </Paper>
      )}

      {matchMutation.error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to generate match. Please try again.
        </Alert>
      )}

      {matchedDog && (
        <>
          <Typography variant="h4" align="center" gutterBottom>
            It's a Match! 🎉
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Meet your perfect companion
          </Typography>

          <Paper sx={{ p: 3, mb: 3 }}>
            <DogCard
              dog={matchedDog}
              isFavorite={true}
              onToggleFavorite={() => {}}
            />
          </Paper>

          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleTryAgain}
              disabled={matchMutation.isPending}
            >
              Try Again
            </Button>
            <Button
              variant="contained"
              onClick={handleStartOver}
            >
              Start Over
            </Button>
          </Stack>
        </>
      )}
    </Box>
  );
} 