import {
  Autocomplete,
  TextField,
  CircularProgress,
  Alert,
  Box,
  Chip,
} from '@mui/material';
import { useBreeds } from '../hooks/useBreeds';

export interface BreedSelectProps {
  selectedBreeds: string[];
  onChange: (breeds: string[]) => void;
}

export const BreedSelect = ({
  selectedBreeds,
  onChange,
}: BreedSelectProps) => {
  const { data: breeds, isLoading, error } = useBreeds();

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Failed to load breeds. Please try again later.
      </Alert>
    );
  }

  return (
    <Autocomplete
      multiple
      options={breeds || []}
      value={selectedBreeds}
      onChange={(_, newValue) => onChange(newValue)}
      disabled={isLoading}
      loading={isLoading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Select breeds"
          placeholder={selectedBreeds.length === 0 ? "Search breeds..." : ""}
          aria-label="breed selection"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isLoading && <CircularProgress color="inherit" size={20} />}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => (
          <Chip
            label={option}
            {...getTagProps({ index })}
            key={option}
            sx={{ borderRadius: '14px' }}
          />
        ))
      }
      sx={{ width: '100%' }}
      ListboxProps={{
        style: {
          maxHeight: '200px',
        },
      }}
      filterSelectedOptions
      limitTags={3}
      ChipProps={{ color: 'primary' }}
    />
  );
}; 