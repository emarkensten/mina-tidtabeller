'use client';

import { useState, useEffect } from 'react';
import Autocomplete, { SelectedItemProps } from '@sj-ab/component-library.ui.autocomplete';
import { TrainStation } from '@/lib/trafikverket';
import { useStations } from '@/hooks/useStations';

interface StationSearchProps {
  label: string;
  value: TrainStation | null;
  onChange: (station: TrainStation | null) => void;
  error?: boolean;
  autoFocus?: boolean;
}

export function StationSearch({ label, value, onChange, error }: StationSearchProps) {
  const [inputValue, setInputValue] = useState('');
  const { searchStations, stations } = useStations();

  // Update input value when value changes
  useEffect(() => {
    if (value) {
      setInputValue(value.AdvertisedLocationName);
    } else {
      setInputValue('');
    }
  }, [value]);

  const handleChange = (item: SelectedItemProps) => {
    setInputValue(item.name);
  };

  const handleSelect = (item: SelectedItemProps) => {
    const station = stations.find(s =>
      s.AdvertisedLocationName === item.name ||
      s.LocationSignature === item.id
    );
    onChange(station || null);
  };

  const searchResults = inputValue.length >= 2 ? searchStations(inputValue) : [];

  const options: SelectedItemProps[] = searchResults.map(station => ({
    id: station.LocationSignature,
    name: station.AdvertisedLocationName,
  }));

  return (
    <Autocomplete
      id={`station-search-${label.toLowerCase()}`}
      label={label}
      placeholder={`Sök ${label.toLowerCase()}...`}
      value={inputValue}
      onChange={handleChange}
      onSelect={handleSelect}
      options={options}
      errorMessage={error ? 'Välj en station' : ''}
      lang="sv"
      highlightMatch={true}
      useInternalFilter={false}
    />
  );
}
