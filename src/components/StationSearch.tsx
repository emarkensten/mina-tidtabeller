'use client';

import { useState, useEffect } from 'react';
import { Autocomplete, TextField, CircularProgress, Box, SvgIcon } from '@mui/material';
import { TrainStation } from '@/lib/trafikverket';
import { useStations } from '@/hooks/useStations';

// SJ Chevron Down Icon
function ChevronDownIcon() {
  return (
    <SvgIcon>
      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
    </SvgIcon>
  );
}

interface StationSearchProps {
  label: string;
  value: TrainStation | null;
  onChange: (station: TrainStation | null) => void;
  error?: boolean;
  autoFocus?: boolean;
}

export function StationSearch({ label, value, onChange, error, autoFocus }: StationSearchProps) {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<TrainStation[]>([]);
  const { searchStations, loading: stationsLoading } = useStations();

  useEffect(() => {
    if (inputValue.length < 2) {
      setOptions([]);
      return;
    }

    const results = searchStations(inputValue);
    setOptions(results);
  }, [inputValue, searchStations]);

  return (
    <Autocomplete
      value={value}
      onChange={(_event, newValue) => onChange(newValue)}
      inputValue={inputValue}
      onInputChange={(_event, newInputValue) => setInputValue(newInputValue || '')}
      options={options}
      getOptionLabel={(option) => option?.AdvertisedLocationName || ''}
      loading={stationsLoading}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={error}
          variant="outlined"
          autoFocus={autoFocus}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              padding: '16px',
              fontFamily: 'SJ Sans, sans-serif',
              fontSize: '16px',
              '& fieldset': {
                borderColor: error ? '#d32f2f' : 'rgba(0, 0, 0, 0.42)',
                borderWidth: '1px',
              },
              '&:hover fieldset': {
                borderColor: error ? '#d32f2f' : 'rgba(0, 0, 0, 0.87)',
              },
              '&.Mui-focused fieldset': {
                borderColor: error ? '#d32f2f' : '#000',
                borderWidth: '2px',
              },
            },
            '& .MuiInputLabel-root': {
              fontFamily: 'SJ Sans, sans-serif',
              fontSize: '16px',
              color: error ? '#d32f2f' : 'rgba(0, 0, 0, 0.6)',
              '&.Mui-focused': {
                color: error ? '#d32f2f' : '#000',
              },
            },
            '& .MuiInputBase-input': {
              padding: '0 !important',
              fontFamily: 'SJ Sans, sans-serif',
            },
          }}
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <>
                  {stationsLoading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
      renderOption={(props, option) => {
        const { key, ...otherProps } = props;
        return (
          <Box
            component="li"
            key={key}
            {...otherProps}
            sx={{
              fontFamily: 'SJ Sans, sans-serif',
              fontSize: '16px',
              padding: '12px 16px',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
              '&[aria-selected="true"]': {
                backgroundColor: 'rgba(0, 0, 0, 0.08)',
              },
            }}
          >
            {option.AdvertisedLocationName}
          </Box>
        );
      }}
      isOptionEqualToValue={(option, value) =>
        option?.LocationSignature === value?.LocationSignature
      }
      noOptionsText="Inga stationer hittades"
      loadingText="Söker..."
      fullWidth
      popupIcon={<ChevronDownIcon />}
      sx={{
        '& .MuiAutocomplete-paper': {
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        },
        '& .MuiAutocomplete-listbox': {
          fontFamily: 'SJ Sans, sans-serif',
          padding: '8px 0',
        },
        '& .MuiAutocomplete-popupIndicator': {
          color: 'rgba(0, 0, 0, 0.54)',
        },
      }}
    />
  );
}
