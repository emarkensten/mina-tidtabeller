'use client';

import { useState, useEffect } from 'react';
import { TrainStation } from '@/lib/trafikverket';

// Station coordinates (major Swedish cities)
const STATION_COORDINATES: Record<string, { lat: number; lon: number }> = {
  'Cst': { lat: 59.3293, lon: 18.0686 }, // Stockholm Central
  'G': { lat: 57.7089, lon: 11.9746 }, // Göteborg Central
  'M': { lat: 55.6092, lon: 13.0007 }, // Malmö Central
  'U': { lat: 59.8586, lon: 17.6389 }, // Uppsala Central
  'Lund': { lat: 55.7080, lon: 13.1937 }, // Lund Central
  'Öe': { lat: 59.2753, lon: 15.2134 }, // Örebro Central
  'Ln': { lat: 58.4108, lon: 15.6214 }, // Linköping Central
  'Hd': { lat: 56.0465, lon: 12.6945 }, // Helsingborg Central
};

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function useGeolocation(stations: TrainStation[]) {
  const [nearestStation, setNearestStation] = useState<TrainStation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (stations.length === 0) {
      return;
    }

    const detectLocation = async () => {
      try {
        // Try IP-based geolocation first (works without user permission)
        const response = await fetch('https://ipapi.co/json/');
        if (response.ok) {
          const data = await response.json();
          const userLat = data.latitude;
          const userLon = data.longitude;

          if (userLat && userLon) {
            // Find nearest station
            let minDistance = Infinity;
            let nearest: TrainStation | null = null;

            Object.entries(STATION_COORDINATES).forEach(([signature, coords]) => {
              const distance = calculateDistance(userLat, userLon, coords.lat, coords.lon);
              if (distance < minDistance) {
                minDistance = distance;
                const station = stations.find(s => s.LocationSignature === signature);
                if (station) {
                  nearest = station;
                }
              }
            });

            setNearestStation(nearest);
          }
        }
      } catch (error) {
        console.error('Geolocation error:', error);
      } finally {
        setLoading(false);
      }
    };

    detectLocation();
  }, [stations]);

  return { nearestStation, loading };
}
