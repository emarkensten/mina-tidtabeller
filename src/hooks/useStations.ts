'use client';

import { useState, useEffect, useCallback } from 'react';
import { TrainStation } from '@/lib/trafikverket';

const STORAGE_KEY = 'cached_stations';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface CachedStations {
  stations: TrainStation[];
  timestamp: number;
}

export function useStations() {
  const [stations, setStations] = useState<TrainStation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStations = async () => {
      // Check localStorage first
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        try {
          const data: CachedStations = JSON.parse(cached);
          const now = Date.now();

          // Check if cache is still valid
          if (now - data.timestamp < CACHE_DURATION) {
            setStations(data.stations);
            return;
          }
        } catch (err) {
          console.error('Failed to parse cached stations:', err);
        }
      }

      // Fetch from API if no cache or cache expired
      setLoading(true);
      try {
        const response = await fetch('/api/stations/all');

        if (!response.ok) {
          throw new Error('Failed to fetch stations');
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        setStations(data);

        // Cache the results
        const cacheData: CachedStations = {
          stations: data,
          timestamp: Date.now(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cacheData));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadStations();
  }, []);

  const searchStations = useCallback((query: string): TrainStation[] => {
    if (!query || query.length < 2) {
      return [];
    }

    const queryLower = query.toLowerCase();
    return stations
      .filter(
        (station) =>
          station.AdvertisedLocationName.toLowerCase().includes(queryLower) ||
          station.LocationSignature.toLowerCase().includes(queryLower)
      )
      .slice(0, 10);
  }, [stations]);

  return {
    stations,
    loading,
    error,
    searchStations,
  };
}
