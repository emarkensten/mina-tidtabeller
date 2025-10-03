'use client';

import { useState, useEffect } from 'react';
import { Box, List, ListItemButton, ListItemText, SvgIcon } from '@mui/material';
import Typography from '@sj-ab/component-library.ui.typography';
import Divider from '@sj-ab/component-library.ui.divider';
import FlowButton from '@sj-ab/component-library.ui.flow-button';
import TextButton from '@sj-ab/component-library.ui.text-button';
import Sheet from '@sj-ab/component-library.ui.sheet';
import AppBar from '@sj-ab/component-library.ui.app-bar';
import Badge from '@sj-ab/component-library.ui.badge';
import { StationSearch } from '@/components/StationSearch';
import { useTimetables } from '@/hooks/useTimetables';
import { useStations } from '@/hooks/useStations';
import { useGeolocation } from '@/hooks/useGeolocation';
import { TrainStation, TrainAnnouncement, getDepartures } from '@/lib/trafikverket';
import { SavedTimetable } from '@/types/timetable';
import { generateSJBookingUrl } from '@/lib/stationNameConverter';

// Custom SVG Icons
function ChevronLeftIcon() {
  return (
    <SvgIcon>
      <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
    </SvgIcon>
  );
}

function ChevronRightIcon() {
  return (
    <SvgIcon>
      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
    </SvgIcon>
  );
}

function SwapVerticalIcon() {
  return (
    <SvgIcon>
      <path d="M16 17.01V10h-2v7.01h-3L15 21l4-3.99h-3zM9 3L5 6.99h3V14h2V6.99h3L9 3z" />
    </SvgIcon>
  );
}

function CheckIcon() {
  return (
    <SvgIcon>
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </SvgIcon>
  );
}


export default function MinaTidtabellerPage() {
  const [fromStation, setFromStation] = useState<TrainStation | null>(null);
  const [toStation, setToStation] = useState<TrainStation | null>(null);
  const [selectedTimetable, setSelectedTimetable] = useState<SavedTimetable | null>(null);
  const [departures, setDepartures] = useState<TrainAnnouncement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTimetableView, setShowTimetableView] = useState(false);
  const [showTimetableModal, setShowTimetableModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState<string>('');

  const { timetables, saveTimetable, deleteTimetable, updateLastUsed } = useTimetables();
  const { stations } = useStations();
  const { nearestStation } = useGeolocation(stations);

  // Load last selected timetable on mount
  useEffect(() => {
    if (timetables.length > 0 && !selectedTimetable) {
      // Get the most recently used timetable
      const lastUsed = [...timetables].sort((a, b) => b.lastUsed.getTime() - a.lastUsed.getTime())[0];
      handleSelectTimetable(lastUsed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timetables.length]); // Only run when timetables are loaded

  // Set from station based on geolocation (only if no timetables exist)
  useEffect(() => {
    if (nearestStation && !fromStation && timetables.length === 0) {
      setFromStation(nearestStation);
    }
  }, [nearestStation, fromStation, timetables.length]);

  // Set current time on client only
  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' }));
  }, []);

  const handleCreateTimetable = async () => {
    if (!fromStation || !toStation) {
      setError('Välj både från- och till-station');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const results = await getDepartures(
        fromStation.LocationSignature,
        toStation.LocationSignature
      );

      setDepartures(results);

      const timetable = saveTimetable(
        {
          name: fromStation.AdvertisedLocationName,
          signature: fromStation.LocationSignature,
        },
        {
          name: toStation.AdvertisedLocationName,
          signature: toStation.LocationSignature,
        }
      );

      setSelectedTimetable(timetable);
      setShowTimetableView(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ett fel uppstod');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTimetable = async (timetable: SavedTimetable) => {
    setSelectedTimetable(timetable);
    updateLastUsed(timetable.id);
    setSelectedDate(new Date()); // Reset to current date/time
    setLoading(true);
    setError(null);

    try {
      const results = await getDepartures(
        timetable.fromStation.signature,
        timetable.toStation.signature
        // Don't pass date so API uses $now filter
      );

      setDepartures(results);
      setShowTimetableView(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ett fel uppstod');
    } finally {
      setLoading(false);
    }
  };

  const handleSwapTimetableDirections = async () => {
    if (selectedTimetable) {
      // Check if a reverse timetable already exists
      const swappedTimetable = timetables.find(
        t => t.fromStation.signature === selectedTimetable.toStation.signature &&
             t.toStation.signature === selectedTimetable.fromStation.signature
      );

      if (swappedTimetable) {
        // Use existing reverse timetable
        handleSelectTimetable(swappedTimetable);
      } else {
        // Create new reverse timetable
        setLoading(true);
        try {
          const results = await getDepartures(
            selectedTimetable.toStation.signature,
            selectedTimetable.fromStation.signature,
            selectedDate
          );

          setDepartures(results);

          const newTimetable = saveTimetable(
            {
              name: selectedTimetable.toStation.name,
              signature: selectedTimetable.toStation.signature,
            },
            {
              name: selectedTimetable.fromStation.name,
              signature: selectedTimetable.fromStation.signature,
            }
          );

          setSelectedTimetable(newTimetable);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Ett fel uppstod');
        } finally {
          setLoading(false);
        }
      }
    }
  };

  const handleAddNewTimetable = () => {
    setShowTimetableModal(false);
    setShowCreateModal(true);
    setFromStation(null);
    setToStation(null);
    setError(null);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setFromStation(null);
    setToStation(null);
    setError(null);
  };

  const handleCreateFromModal = async () => {
    if (!fromStation || !toStation) {
      setError('Välj både från- och till-station');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const results = await getDepartures(
        fromStation.LocationSignature,
        toStation.LocationSignature
      );

      setDepartures(results);

      const timetable = saveTimetable(
        {
          name: fromStation.AdvertisedLocationName,
          signature: fromStation.LocationSignature,
        },
        {
          name: toStation.AdvertisedLocationName,
          signature: toStation.LocationSignature,
        }
      );

      setSelectedTimetable(timetable);
      setShowTimetableView(true);
      setShowCreateModal(false);
      setFromStation(null);
      setToStation(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ett fel uppstod');
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousDay = async () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);

    if (selectedTimetable) {
      setLoading(true);
      try {
        const results = await getDepartures(
          selectedTimetable.fromStation.signature,
          selectedTimetable.toStation.signature,
          newDate
        );
        setDepartures(results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ett fel uppstod');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleNextDay = async () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);

    if (selectedTimetable) {
      setLoading(true);
      try {
        const results = await getDepartures(
          selectedTimetable.fromStation.signature,
          selectedTimetable.toStation.signature,
          newDate
        );
        setDepartures(results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ett fel uppstod');
      } finally {
        setLoading(false);
      }
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('sv-SE', { day: 'numeric', month: 'long' });
  };

  const getDateLabel = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((compareDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Idag ${currentTime}`;
    } else if (diffDays === 1) {
      return 'Imorgon';
    } else {
      return formatDate(date);
    }
  };

  if (showTimetableView && selectedTimetable) {
    // Filter departures to show only relevant times for the selected date
    const filteredDepartures = departures.filter(departure => {
      if (!departure.AdvertisedTimeAtLocation) return true;

      const departureDate = new Date(departure.AdvertisedTimeAtLocation);
      const selectedDateStr = selectedDate.toISOString().substring(0, 10);
      const departureDateStr = departureDate.toISOString().substring(0, 10);

      // Only show departures from the selected date
      if (departureDateStr !== selectedDateStr) return false;

      const hour = departureDate.getHours();
      // Show all departures from selected day, but skip very early morning (03:00-04:59)
      // This allows showing late night (00:00-02:59) and normal hours (05:00-23:59)
      return hour <= 2 || hour >= 5;
    });

    return (
      <Box
        sx={(theme) => ({
          bgcolor: theme.designTokens.color.background.base.primary.value,
          minHeight: '100vh',
        })}
      >
        <AppBar
          title={`${selectedTimetable.fromStation.name} - ${selectedTimetable.toStation.name}`}
          elevated={true}
          navigationButtons={[
            {
              variant: 'menu',
              label: 'Välj tidtabell',
              action: () => setShowTimetableModal(true),
            },
          ]}
          actionButtons={[
            {
              id: 'swap-direction',
              icon: <SwapVerticalIcon />,
              label: 'Byt riktning',
              action: handleSwapTimetableDirections,
            },
          ]}
        />

        <Box sx={{ px: 2, pt: 3 }}>
          <Typography variant="h3">
            {getDateLabel(selectedDate)}
          </Typography>

          <Box sx={{ height: 16 }} />

          {loading ? (
            <Typography>Laddar avgångar...</Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : filteredDepartures.length === 0 ? (
            <Typography>Inga avgångar hittades</Typography>
          ) : (
            <List sx={(theme) => ({
              bgcolor: theme.designTokens.color.background.base.secondary.value,
              borderRadius: '8px'
            })}>
              {filteredDepartures.map((departure, index) => (
              <ListItemButton
                key={index}
                onClick={() => {
                  if (selectedTimetable && departure.AdvertisedTimeAtLocation) {
                    const sjUrl = generateSJBookingUrl(
                      selectedTimetable.fromStation.name,
                      selectedTimetable.toStation.name,
                      departure.AdvertisedTimeAtLocation
                    );
                    window.open(sjUrl, '_blank');
                  }
                }}
                sx={{
                  py: 2.5,
                  borderBottom: index < filteredDepartures.length - 1 ? '1px solid rgba(0, 0, 0, 0.12)' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    variant="h3"
                    component="span"
                    sx={{
                      fontWeight: 'bold',
                      textDecoration: departure.Canceled ? 'line-through' : 'none'
                    }}
                  >
                    {departure.AdvertisedTimeAtLocation?.substring(11, 16)}
                  </Typography>
                  {departure.Canceled && (
                    <Badge label="Inställd" color="red" size="lg" />
                  )}
                  {!departure.Canceled && departure.EstimatedTimeAtLocation && (
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
                      {departure.EstimatedTimeAtLocation.substring(11, 16)}
                    </Typography>
                  )}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body1" component="span">
                    {selectedTimetable.toStation.name}
                  </Typography>
                  <ChevronRightIcon />
                </Box>
              </ListItemButton>
            ))}
          </List>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }} onClick={handlePreviousDay}>
              <ChevronLeftIcon />
              <Typography variant="body1">
                {formatDate(new Date(selectedDate.getTime() - 24 * 60 * 60 * 1000))}
              </Typography>
            </Box>
            <Typography variant="subtitle1">{formatDate(selectedDate)}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }} onClick={handleNextDay}>
              <Typography variant="body1">
                {formatDate(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000))}
              </Typography>
              <ChevronRightIcon />
            </Box>
          </Box>

          <Box sx={{ height: 24 }} />

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <TextButton onClick={() => {
              if (selectedTimetable) {
                deleteTimetable(selectedTimetable.id);
                setSelectedTimetable(null);
                setShowTimetableView(false);
                setDepartures([]);
              }
            }}>
              Ta bort denna tidtabell
            </TextButton>
          </Box>
        </Box>

        <Sheet
          open={showTimetableModal}
          onClose={() => setShowTimetableModal(false)}
          height="auto"
          width="large"
          ariaLabel="Välj tidtabell"
        >
          <AppBar
            title="Välj tidtabell"
            elevated={true}
            navigationButtons={[
              {
                variant: 'close',
                label: 'Stäng',
                action: () => setShowTimetableModal(false),
              },
            ]}
          />

          <Box sx={{ p: 3 }}>
            <List>
              {(() => {
                // Group timetables by route (ignoring direction)
                const routeGroups = new Map<string, SavedTimetable>();

                timetables.forEach((timetable) => {
                  const routeKey = [timetable.fromStation.signature, timetable.toStation.signature]
                    .sort()
                    .join('-');

                  const existing = routeGroups.get(routeKey);
                  if (!existing || timetable.lastUsed > existing.lastUsed) {
                    routeGroups.set(routeKey, timetable);
                  }
                });

                // Convert to array and sort by lastUsed
                const uniqueTimetables = Array.from(routeGroups.values())
                  .sort((a, b) => b.lastUsed.getTime() - a.lastUsed.getTime());

                return uniqueTimetables.map((timetable, index) => {
                  const isSelected = selectedTimetable && (
                    selectedTimetable.id === timetable.id ||
                    (selectedTimetable.fromStation.signature === timetable.toStation.signature &&
                     selectedTimetable.toStation.signature === timetable.fromStation.signature)
                  );

                  return (
                    <Box key={timetable.id}>
                      <ListItemButton
                        onClick={() => {
                          handleSelectTimetable(timetable);
                          setShowTimetableModal(false);
                        }}
                        selected={isSelected}
                      >
                        <ListItemText
                          primary={`${timetable.fromStation.name} - ${timetable.toStation.name}`}
                        />
                        {isSelected && (
                          <CheckIcon />
                        )}
                      </ListItemButton>
                      {index < uniqueTimetables.length - 1 && <Divider />}
                    </Box>
                  );
                });
              })()}
            </List>

            <Box sx={{ mt: 3 }}>
              <FlowButton onClick={handleAddNewTimetable} fullWidth>
                Lägg till ny tidtabell
              </FlowButton>
            </Box>
          </Box>
        </Sheet>

        <Sheet
          open={showCreateModal}
          onClose={handleCloseCreateModal}
          height="auto"
          width="large"
          ariaLabel="Skapa ny tidtabell"
        >
          <AppBar
            title="Skapa ny tidtabell"
            elevated={true}
            navigationButtons={[
              {
                variant: 'close',
                label: 'Stäng',
                action: handleCloseCreateModal,
              },
            ]}
          />

          <Box sx={{ p: 3 }}>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Skapa din tidtabell genom att söka fram stationerna du vill åka med. Du kan endast
              skapa tidtabeller för resor som inte kräver byten.
            </Typography>

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

            <FlowButton onClick={handleCreateFromModal} disabled={loading} fullWidth>
              {loading ? 'Skapar tidtabell...' : 'Skapa tidtabell'}
            </FlowButton>
          </Box>
        </Sheet>

        <Box sx={{ height: 16 }} />
      </Box>
    );
  }

  return (
    <Box
      sx={(theme) => ({
        bgcolor: theme.designTokens.color.background.base.primary.value,
        minHeight: '100vh',
        px: 2,
      })}
    >
      <Box sx={{ height: 24 }} />

      <Typography variant="h1">Mina tidtabeller</Typography>

      <Box sx={{ height: 16 }} />

      <Typography variant="body1">
        Skapa din första tidtabell genom att söka fram stationerna du vill åka med. Du kan endast
        skapa tidtabeller för resor som inte kräver byten.
      </Typography>

      <Box sx={{ height: 24 }} />

      <StationSearch
        label="Från"
        value={fromStation}
        onChange={setFromStation}
        error={!fromStation && error !== null}
      />

      <Box sx={{ height: 24 }} />

      <StationSearch
        label="Till"
        value={toStation}
        onChange={setToStation}
        error={!toStation && error !== null}
        autoFocus={!!fromStation}
      />

      <Box sx={{ height: 24 }} />

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <FlowButton onClick={handleCreateTimetable} disabled={loading} fullWidth>
        {loading ? 'Skapar tidtabell...' : 'Skapa tidtabell'}
      </FlowButton>
    </Box>
  );
}
