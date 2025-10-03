'use client';

import { useState } from 'react';
import { Box } from '@mui/material';
import Typography from '@sj-ab/component-library.ui.typography';
import Autocomplete, { SelectedItemProps } from '@sj-ab/component-library.ui.autocomplete';
import { useStations } from '@/hooks/useStations';
import { TrainStation } from '@/lib/trafikverket';

export default function TestAutocompletePage() {
  const [value, setValue] = useState('');
  const [selectedStation, setSelectedStation] = useState<TrainStation | null>(null);
  const { searchStations, loading } = useStations();

  const handleChange = (item: SelectedItemProps) => {
    setValue(item.name);
  };

  const handleSelect = (item: SelectedItemProps) => {
    // Find the full station from our list
    const allStations = searchStations('');
    const station = allStations.find(s =>
      s.AdvertisedLocationName === item.name ||
      s.LocationSignature === item.id
    );
    setSelectedStation(station || null);
  };

  // Get filtered options based on search value
  const searchResults = value.length >= 2 ? searchStations(value) : [];

  const options: SelectedItemProps[] = searchResults.map(station => ({
    id: station.LocationSignature,
    name: station.AdvertisedLocationName,
    secondaryText: station.LocationSignature,
  }));

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        minHeight: '100vh',
        p: 3,
      }}
    >
      <Typography variant="h1" sx={{ mb: 3 }}>
        Test SJ Autocomplete
      </Typography>

      <Typography variant="body1" sx={{ mb: 3 }}>
        Detta är en testsida för att utforska SJ:s Autocomplete-komponent.
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Autocomplete
          id="station-search-test"
          label="Välj station"
          placeholder="Sök station..."
          value={value}
          onChange={handleChange}
          onSelect={handleSelect}
          options={options}
          errorMessage=""
          lang="sv"
          highlightMatch={true}
          useInternalFilter={false}
        />
      </Box>

      {selectedStation && (
        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="h3" sx={{ mb: 1 }}>
            Vald station:
          </Typography>
          <Typography variant="body1">
            <strong>Namn:</strong> {selectedStation.AdvertisedLocationName}
          </Typography>
          <Typography variant="body1">
            <strong>Signatur:</strong> {selectedStation.LocationSignature}
          </Typography>
        </Box>
      )}

      <Box sx={{ mt: 4 }}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Komponent-info:
        </Typography>
        <Typography variant="body1" component="div">
          <strong>Props som används:</strong>
          <ul>
            <li>id - Unikt ID för komponenten</li>
            <li>label - Label-text</li>
            <li>placeholder - Placeholder-text</li>
            <li>value - Nuvarande sökvärde</li>
            <li>onChange - Callback när input ändras</li>
            <li>onSelect - Callback när ett alternativ väljs</li>
            <li>options - Array av alternativ (SelectedItemProps)</li>
            <li>errorMessage - Felmeddelande</li>
            <li>lang - Språk (sv/en/no)</li>
            <li>highlightMatch - Highlighta matchande text</li>
            <li>useInternalFilter - Använd intern filtrering</li>
          </ul>
        </Typography>
      </Box>
    </Box>
  );
}
