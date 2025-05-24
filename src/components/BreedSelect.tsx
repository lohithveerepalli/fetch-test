import {
  Autocomplete,
  TextField,
  CircularProgress,
  Alert,
  Box,
  Chip,
} from '@mui/material';
import { useBreeds } from '../hooks/useBreeds';

interface BreedSelectProps {
  value: string[];
  onChange: (breeds: string[]) => void;
  disabled?: boolean;
}

export function BreedSelect({ value, onChange, disabled = false }: BreedSelectProps) {
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
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      disabled={disabled || isLoading}
      loading={isLoading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Filter by Breeds"
          placeholder={value.length === 0 ? 'Select breeds' : ''}
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
    />
  );
} 