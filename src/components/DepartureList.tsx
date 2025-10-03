'use client';

import { List, ListItem, Box, Typography } from '@mui/material';
import { Badge } from '@sj-ab/component-library.ui.badge';
import { TrainAnnouncement } from '@/lib/trafikverket';
import { format, parseISO, differenceInMinutes } from 'date-fns';
import { sv } from 'date-fns/locale';

interface DepartureListProps {
  departures: TrainAnnouncement[];
  onDepartureClick?: (departure: TrainAnnouncement) => void;
}

export function DepartureList({ departures, onDepartureClick }: DepartureListProps) {
  const getDelayMinutes = (departure: TrainAnnouncement): number | null => {
    if (!departure.EstimatedTimeAtLocation) return null;

    const scheduled = parseISO(departure.AdvertisedTimeAtLocation);
    const estimated = parseISO(departure.EstimatedTimeAtLocation);

    return differenceInMinutes(estimated, scheduled);
  };

  const getDepartureTime = (departure: TrainAnnouncement) => {
    const scheduledTime = format(
      parseISO(departure.AdvertisedTimeAtLocation),
      'HH:mm'
    );

    if (departure.TimeAtLocation) {
      return scheduledTime; // Already departed
    }

    const delay = getDelayMinutes(departure);
    if (delay && delay > 0) {
      const estimatedTime = format(
        parseISO(departure.EstimatedTimeAtLocation!),
        'HH:mm'
      );
      return { scheduled: scheduledTime, estimated: estimatedTime };
    }

    return scheduledTime;
  };

  const getProductName = (departure: TrainAnnouncement): string => {
    return departure.ProductInformation?.[0]?.Description || 'Tåg';
  };

  return (
    <List
      sx={{
        width: '100%',
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
      }}
    >
      {departures.map((departure, index) => {
        const time = getDepartureTime(departure);
        const delay = getDelayMinutes(departure);
        const productName = getProductName(departure);

        return (
          <ListItem
            key={departure.ActivityId}
            onClick={() => onDepartureClick?.(departure)}
            sx={{
              borderBottom:
                index < departures.length - 1 ? '1px solid' : 'none',
              borderColor: 'divider',
              py: 2,
              cursor: onDepartureClick ? 'pointer' : 'default',
              '&:hover': onDepartureClick
                ? { bgcolor: 'action.hover' }
                : undefined,
            }}
          >
            <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
              <Box sx={{ flex: 1, display: 'flex', gap: 1.5, alignItems: 'center' }}>
                {departure.Canceled ? (
                  <>
                    <Typography
                      variant="h3"
                      sx={{
                        textDecoration: 'line-through',
                        fontWeight: 700,
                      }}
                    >
                      {typeof time === 'string' ? time : time.scheduled}
                    </Typography>
                    <Badge
                      size="lg"
                      color="Critical"
                      label="Inställd"
                      labelPosition="Inside"
                    />
                  </>
                ) : typeof time === 'object' ? (
                  <>
                    <Typography variant="h3" sx={{ fontWeight: 700 }}>
                      {time.scheduled}
                    </Typography>
                    <Box
                      sx={{
                        bgcolor: '#ffd700',
                        px: 1,
                        py: 0.5,
                        borderRadius: 0.5,
                      }}
                    >
                      <Typography variant="h3" sx={{ fontWeight: 700 }}>
                        {time.estimated}
                      </Typography>
                    </Box>
                  </>
                ) : (
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    {time}
                  </Typography>
                )}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography
                  variant="body1"
                  sx={{ color: 'text.secondary', textAlign: 'right' }}
                >
                  {productName}
                </Typography>
                <Box sx={{ width: 8, height: 24 }}>
                  <svg
                    width="8"
                    height="24"
                    viewBox="0 0 8 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.94 16.92L6.9 12L0.94 7.08L2 6L9 12L2 18L0.94 16.92Z"
                      fill="currentColor"
                    />
                  </svg>
                </Box>
              </Box>
            </Box>
          </ListItem>
        );
      })}

      {departures.length === 0 && (
        <ListItem>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Inga avgångar hittades
          </Typography>
        </ListItem>
      )}
    </List>
  );
}
