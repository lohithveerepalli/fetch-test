import { useState, useCallback } from 'react';
import {
  Paper,
  Stack,
  Typography,
  TextField,
  Button,
  Chip,
  Box,
  Drawer,
  useTheme,
  useMediaQuery,
  IconButton,
  CircularProgress,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import { BreedSelect } from './BreedSelect';
import type { Location } from '../api/types';

interface FilterPanelProps {
  breeds: string[];
  selectedBreeds: string[];
  onBreedsChange: (breeds: string[]) => void;
  zipCodes: string[];
  onZipCodesChange: (zipCodes: string[]) => void;
  ageRange: { min?: number; max?: number };
  onAgeRangeChange: (range: { min?: number; max?: number }) => void;
  onClearFilters: () => void;
  isLoading?: boolean;
  searchLocations: (query: string) => Promise<Location[]>;
}

export const FilterPanel = ({
  breeds,
  selectedBreeds,
  onBreedsChange,
  zipCodes,
  onZipCodesChange,
  ageRange,
  onAgeRangeChange,
  onClearFilters,
  isLoading,
  searchLocations,
}: FilterPanelProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [locationQuery, setLocationQuery] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState<Location[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLocationSearch = useCallback(async (query: string) => {
    setLocationQuery(query);
    if (query.length < 2) return;

    setIsSearching(true);
    try {
      const results = await searchLocations(query);
      setLocationSuggestions(results);
    } finally {
      setIsSearching(false);
    }
  }, [searchLocations]);

  const handleLocationSelect = (location: Location) => {
    if (!zipCodes.includes(location.zip_code)) {
      onZipCodesChange([...zipCodes, location.zip_code]);
    }
    setLocationQuery('');
    setLocationSuggestions([]);
  };

  const handleRemoveZipCode = (zipCode: string) => {
    onZipCodesChange(zipCodes.filter(z => z !== zipCode));
  };

  const handleRemoveBreed = (breed: string) => {
    onBreedsChange(selectedBreeds.filter(b => b !== breed));
  };

  const filterContent = (
    <Stack spacing={3} p={2}>
      <Typography variant="h6" component="h2">
        Filters
      </Typography>

      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Breeds
        </Typography>
        <BreedSelect
          breeds={breeds}
          selectedBreeds={selectedBreeds}
          onChange={onBreedsChange}
        />
      </Box>

      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Location
        </Typography>
        <TextField
          fullWidth
          placeholder="Search by city or ZIP code"
          value={locationQuery}
          onChange={(e) => handleLocationSearch(e.target.value)}
          InputProps={{
            endAdornment: isSearching && <CircularProgress size={20} />,
          }}
        />
        {locationSuggestions.length > 0 && (
          <Paper elevation={3} sx={{ mt: 1, p: 1 }}>
            <Stack spacing={1}>
              {locationSuggestions.map((location) => (
                <Button
                  key={location.zip_code}
                  onClick={() => handleLocationSelect(location)}
                  fullWidth
                  sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                >
                  {location.city}, {location.state} ({location.zip_code})
                </Button>
              ))}
            </Stack>
          </Paper>
        )}
      </Box>

      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Age Range
        </Typography>
        <Stack direction="row" spacing={2}>
          <TextField
            label="Min"
            type="number"
            value={ageRange.min || ''}
            onChange={(e) => onAgeRangeChange({ ...ageRange, min: Number(e.target.value) || undefined })}
            size="small"
          />
          <TextField
            label="Max"
            type="number"
            value={ageRange.max || ''}
            onChange={(e) => onAgeRangeChange({ ...ageRange, max: Number(e.target.value) || undefined })}
            size="small"
          />
        </Stack>
      </Box>

      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Active Filters
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={1}>
          {selectedBreeds.map((breed) => (
            <Chip
              key={breed}
              label={`Breed: ${breed}`}
              onDelete={() => handleRemoveBreed(breed)}
              color="primary"
              variant="outlined"
            />
          ))}
          {zipCodes.map((zipCode) => (
            <Chip
              key={zipCode}
              label={`Location: ${zipCode}`}
              onDelete={() => handleRemoveZipCode(zipCode)}
              color="primary"
              variant="outlined"
            />
          ))}
          {(ageRange.min !== undefined || ageRange.max !== undefined) && (
            <Chip
              label={`Age: ${ageRange.min || 0} - ${ageRange.max || '∞'}`}
              onDelete={() => onAgeRangeChange({})}
              color="primary"
              variant="outlined"
            />
          )}
        </Stack>
      </Box>

      <Button
        startIcon={<ClearAllIcon />}
        onClick={onClearFilters}
        disabled={!selectedBreeds.length && !zipCodes.length && !ageRange.min && !ageRange.max}
      >
        Clear All Filters
      </Button>
    </Stack>
  );

  if (isMobile) {
    return (
      <>
        <Box sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000 }}>
          <IconButton
            color="primary"
            onClick={() => setIsDrawerOpen(true)}
            sx={{ bgcolor: 'background.paper', boxShadow: 2 }}
          >
            <FilterListIcon />
          </IconButton>
        </Box>
        <Drawer
          anchor="right"
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          PaperProps={{ sx: { width: '80%', maxWidth: 360 } }}
        >
          <Box sx={{ textAlign: 'right', p: 1 }}>
            <IconButton onClick={() => setIsDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          {filterContent}
        </Drawer>
      </>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 2, height: 'fit-content' }}>
      {filterContent}
    </Paper>
  );
}; 