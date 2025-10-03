'use client';

import { useState } from 'react';
import { Box, List, ListItem, ListItemButton } from '@mui/material';
import Typography from '@sj-ab/component-library.ui.typography';
import Badge from '@sj-ab/component-library.ui.badge';
import FlowButton from '@sj-ab/component-library.ui.flow-button';
import { StationSearch } from '@/components/StationSearch';
import { TrainStation, TrainAnnouncement, getDepartures as getTrafikverketDepartures } from '@/lib/trafikverket';

interface SJDeparture {
  departureId: string;
  departureDateTime: string;
  arrivalDateTime: string;
  publicServiceName: string;
  available: boolean;
  priceFrom: {
    price: string;
    currency: string;
  } | null;
}

interface MergedDeparture {
  // Trafikverket data
  trafikverket: TrainAnnouncement;
  // SJ data
  sj: SJDeparture | null;
  // Match quality
  matched: boolean;
}

export default function TestSJBookingPage() {
  const [fromStation, setFromStation] = useState<TrainStation | null>(null);
  const [toStation, setToStation] = useState<TrainStation | null>(null);
  const [departures, setDepartures] = useState<MergedDeparture[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!fromStation || !toStation) {
      setError('Välj både från- och till-station');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch from Trafikverket
      const trafikverketData = await getTrafikverketDepartures(
        fromStation.LocationSignature,
        toStation.LocationSignature
      );

      // TODO: Fetch from SJ API
      // For now, create merged data with only Trafikverket
      const merged: MergedDeparture[] = trafikverketData.map(departure => ({
        trafikverket: departure,
        sj: null,
        matched: false,
      }));

      setDepartures(merged);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ett fel uppstod');
    } finally {
      setLoading(false);
    }
  };

  // Convert Trafikverket station names to SJ.se format
  const convertToSJStationName = (trafikverketName: string): string => {
    // SJ.se uses "Central" instead of "C"
    return trafikverketName
      .replace(' C', ' Central')
      .replace(/^C$/, 'Central')
      .replace('Göteborg', 'Göteborg')  // Ensure Swedish characters are preserved
      .replace('Malmö', 'Malmö');
  };

  const handleDepartureClick = (departure: MergedDeparture) => {
    if (!fromStation || !toStation) return;

    // Get the departure date from Trafikverket data
    const departureTime = departure.trafikverket.AdvertisedTimeAtLocation;
    const date = departureTime ? departureTime.split('T')[0] : new Date().toISOString().split('T')[0];

    // Convert Trafikverket station names to SJ format and URL-encode
    const fromName = encodeURIComponent(convertToSJStationName(fromStation.AdvertisedLocationName));
    const toName = encodeURIComponent(convertToSJStationName(toStation.AdvertisedLocationName));

    const sjUrl = `https://www.sj.se/sok-resa/valj-resa/${fromName}/${toName}/${date}`;

    console.log('Opening SJ URL:', sjUrl);
    console.log('From:', fromStation.AdvertisedLocationName, '→', decodeURIComponent(fromName));
    console.log('To:', toStation.AdvertisedLocationName, '→', decodeURIComponent(toName));

    // Open in new tab
    window.open(sjUrl, '_blank');
  };

  const formatTime = (isoString?: string) => {
    if (!isoString) return '';
    return isoString.substring(11, 16);
  };

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        minHeight: '100vh',
        px: 2,
      }}
    >
      <Box sx={{ height: 24 }} />

      <Typography variant="h1">SJ Booking Flow POC</Typography>

      <Box sx={{ height: 16 }} />

      <Typography variant="body1">
        Denna sida kombinerar trafikinformation från Trafikverket med SJ:s bokningsflöde.
        Klicka på en avgång för att öppna SJ:s bokningssida.
      </Typography>

      <Box sx={{ height: 24 }} />

      <StationSearch
        label="Från"
        value={fromStation}
        onChange={setFromStation}
        error={!fromStation && error !== null}
      />

      <Box sx={{ height: 16 }} />

      <StationSearch
        label="Till"
        value={toStation}
        onChange={setToStation}
        error={!toStation && error !== null}
      />

      <Box sx={{ height: 24 }} />

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <FlowButton onClick={handleSearch} disabled={loading} fullWidth>
        {loading ? 'Söker avgångar...' : 'Sök avgångar'}
      </FlowButton>

      <Box sx={{ height: 24 }} />

      {departures.length > 0 && (
        <>
          <Typography variant="h2" sx={{ mb: 2 }}>
            Avgångar (med trafikinformation)
          </Typography>

          <List sx={{ bgcolor: 'white', borderRadius: '8px' }}>
            {departures.map((departure, index) => (
              <ListItemButton
                key={index}
                onClick={() => handleDepartureClick(departure)}
                sx={{
                  py: 2.5,
                  borderBottom: index < departures.length - 1 ? '1px solid rgba(0, 0, 0, 0.12)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: 1,
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                      variant="h3"
                      component="span"
                      sx={{
                        fontWeight: 'bold',
                        textDecoration: departure.trafikverket.Canceled ? 'line-through' : 'none'
                      }}
                    >
                      {formatTime(departure.trafikverket.AdvertisedTimeAtLocation)}
                    </Typography>
                    {departure.trafikverket.Canceled && (
                      <Badge label="Inställd" color="red" size="lg" />
                    )}
                    {!departure.trafikverket.Canceled && departure.trafikverket.EstimatedTimeAtLocation && (
                      <Typography
                        variant="h3"
                        component="span"
                        sx={{
                          fontWeight: 'bold',
                          backgroundColor: '#FFD700',
                          padding: '2px 8px',
                          borderRadius: '4px',
                        }}
                      >
                        {formatTime(departure.trafikverket.EstimatedTimeAtLocation)}
                      </Typography>
                    )}
                  </Box>

                  <Typography variant="body1" component="span">
                    Tåg {departure.trafikverket.AdvertisedTrainIdent}
                  </Typography>
                </Box>

                {departure.sj && (
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Från {departure.sj.priceFrom?.price} {departure.sj.priceFrom?.currency}
                  </Typography>
                )}

                {!departure.sj && (
                  <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                    Klicka för att se priser på SJ.se
                  </Typography>
                )}
              </ListItemButton>
            ))}
          </List>
        </>
      )}
    </Box>
  );
}
