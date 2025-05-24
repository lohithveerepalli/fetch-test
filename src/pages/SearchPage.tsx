import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid as MuiGrid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Stack,
  Alert,
  Pagination,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Clear, Pets } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { BreedSelect } from '../components/BreedSelect';
import { DogCard, DogCardSkeleton } from '../components/DogCard';
import { useSearch } from '../hooks/useSearch';
import { useFavorites } from '../contexts/FavoritesContext';
import type { SearchFilters } from '../utils/searchQueryBuilder';

const ITEMS_PER_PAGE = 25;

// Create a Grid component with proper typing
const Grid = MuiGrid as typeof MuiGrid & { item?: boolean };

export function SearchPage() {
  const navigate = useNavigate();
  const { favorites, toggleFavorite, favoritesArray } = useFavorites();
  const [filters, setFilters] = useState<SearchFilters>({
    breeds: [],
    sort: { field: 'breed', order: 'asc' },
    size: ITEMS_PER_PAGE,
  });

  const { 
    dogs, 
    pagination, 
    isLoading, 
    error, 
    handleNextPage, 
    handlePrevPage, 
    handleResetPage,
    refetch,
    searchState
  } = useSearch(filters);

  // Reset pagination when filters change
  useEffect(() => {
    handleResetPage();
  }, [filters]);

  const handleSortChange = (field: 'breed' | 'age' | 'name', order: 'asc' | 'desc') => {
    setFilters(prev => ({ ...prev, sort: { field, order } }));
  };

  const handleAgeChange = (type: 'min' | 'max', value: string) => {
    const numValue = value === '' ? undefined : Number(value);
    setFilters(prev => ({
      ...prev,
      [type === 'min' ? 'ageMin' : 'ageMax']: numValue,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      breeds: [],
      sort: { field: 'breed', order: 'asc' },
      size: ITEMS_PER_PAGE,
    });
  };

  const handleMatch = () => {
    if (favoritesArray.length > 0) {
      navigate('/match');
    }
  };

  const getPageRange = () => {
    if (!dogs.length) return 'No dogs to show';
    
    const fromParam = searchState?.currentPage ? new URLSearchParams(searchState.currentPage).get('from') : '0';
    const startIndex = fromParam ? parseInt(fromParam) + 1 : 1;
    const endIndex = startIndex + dogs.length - 1;
    
    return `Showing ${startIndex}-${endIndex} of ${pagination.total} dogs`;
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1">
          Find Your Perfect Dog
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<Pets />}
          onClick={handleMatch}
          disabled={favoritesArray.length === 0}
        >
          Find Match ({favoritesArray.length})
        </Button>
      </Stack>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="h6">Filters</Typography>
          <Button
            startIcon={<Clear />}
            onClick={handleClearFilters}
            disabled={filters.breeds?.length === 0 && !filters.ageMin && !filters.ageMax}
          >
            Clear Filters
          </Button>
        </Stack>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <BreedSelect
              selectedBreeds={filters.breeds || []}
              onChange={breeds => setFilters(prev => ({ ...prev, breeds }))}
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField
              fullWidth
              label="Min Age"
              type="number"
              value={filters.ageMin ?? ''}
              onChange={e => handleAgeChange('min', e.target.value)}
              inputProps={{ min: 0 }}
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField
              fullWidth
              label="Max Age"
              type="number"
              value={filters.ageMax ?? ''}
              onChange={e => handleAgeChange('max', e.target.value)}
              inputProps={{ min: 0 }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={`${filters.sort?.field || 'breed'}:${filters.sort?.order || 'asc'}`}
                label="Sort By"
                onChange={e => {
                  const [field, order] = e.target.value.split(':') as ['breed' | 'age' | 'name', 'asc' | 'desc'];
                  handleSortChange(field, order);
                }}
              >
                <MenuItem value="breed:asc">Breed (A-Z)</MenuItem>
                <MenuItem value="breed:desc">Breed (Z-A)</MenuItem>
                <MenuItem value="age:asc">Age (Youngest)</MenuItem>
                <MenuItem value="age:desc">Age (Oldest)</MenuItem>
                <MenuItem value="name:asc">Name (A-Z)</MenuItem>
                <MenuItem value="name:desc">Name (Z-A)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error instanceof Error ? error.message : 'Failed to load dogs. Please try again later.'}
          <Button
            variant="text"
            color="inherit"
            onClick={() => refetch()}
            sx={{ ml: 2 }}
          >
            Retry
          </Button>
        </Alert>
      ) : (
        <>
          <Grid container spacing={3}>
            {isLoading
              ? Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                  <Grid item xs={12} sm={6} md={4} key={i}>
                    <DogCardSkeleton />
                  </Grid>
                ))
              : dogs.length === 0 ? (
                  <Grid item xs={12}>
                    <Alert severity="info" sx={{ mb: 3 }}>
                      No dogs found matching your criteria. Try adjusting your filters.
                    </Alert>
                  </Grid>
                ) : (
                  dogs.map(dog => (
                    <Grid item xs={12} sm={6} md={4} key={dog.id}>
                      <DogCard
                        dog={dog}
                        isFavorite={favorites.has(dog.id)}
                        onToggleFavorite={toggleFavorite}
                        onClick={() => {}}
                      />
                    </Grid>
                  ))
                )}
          </Grid>

          {!isLoading && dogs.length > 0 && pagination && (
            <Stack
              direction="row"
              spacing={2}
              justifyContent="center"
              alignItems="center"
              sx={{ mt: 4 }}
            >
              <Button
                onClick={handlePrevPage}
                disabled={!pagination.prev || isLoading}
                variant="outlined"
              >
                Previous
              </Button>
              <Typography color="text.secondary">
                {getPageRange()}
              </Typography>
              <Button
                onClick={handleNextPage}
                disabled={!pagination.next || isLoading}
                variant="outlined"
              >
                Next
              </Button>
            </Stack>
          )}
        </>
      )}
    </Box>
  );
} 