// Trafikverket API utilities

const API_URL = 'https://api.trafikinfo.trafikverket.se/v2/data.json';
const API_KEY = process.env.TRAFIKVERKET_API_KEY || '';

interface TrafikverketRequest {
  objecttype: string;
  schemaversion: string;
  filter?: Record<string, unknown>;
  include?: string[];
  limit?: number;
}

export interface TrainStation {
  AdvertisedLocationName: string;
  LocationSignature: string;
  Geometry?: {
    WGS84: string;
  };
}

export interface TrainAnnouncement {
  ActivityId: string;
  ActivityType: 'Avgang' | 'Ankomst';
  AdvertisedTimeAtLocation: string;
  AdvertisedTrainIdent: string;
  LocationSignature: string;
  ToLocation?: Array<{ LocationName: string; Priority: number; Order: number }>;
  FromLocation?: Array<{ LocationName: string }>;
  ViaToLocation?: Array<{ LocationName: string; Priority: number; Order: number }>;
  Canceled?: boolean;
  EstimatedTimeAtLocation?: string;
  TimeAtLocation?: string;
  ProductInformation?: Array<{ Description: string }>;
  Deviation?: Array<{ Description: string }>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function queryTrafikverket<T>(request: TrafikverketRequest): Promise<T[]> {
  const filter = request.filter || {};

  const filterXml = Object.entries(filter)
    .map(([key, value]) => `<EQ name="${key}" value="${value}" />`)
    .join('');

  const includeXml = request.include
    ? request.include.map(field => `<INCLUDE>${field}</INCLUDE>`).join('')
    : '';

  const requestXml = `
    <REQUEST>
      <LOGIN authenticationkey="${API_KEY}" />
      <QUERY objecttype="${request.objecttype}" schemaversion="${request.schemaversion}" ${request.limit ? `limit="${request.limit}"` : ''}>
        <FILTER>
          ${filterXml || '<EQ name="Advertised" value="true" />'}
        </FILTER>
        ${includeXml}
      </QUERY>
    </REQUEST>
  `;

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/xml',
    },
    body: requestXml,
  });

  if (!response.ok) {
    throw new Error(`Trafikverket API error: ${response.statusText}`);
  }

  const data = await response.json();
  const result = data.RESPONSE?.RESULT?.[0];

  if (result?.ERROR) {
    throw new Error(`Trafikverket API error: ${result.ERROR.MESSAGE}`);
  }

  return result?.[request.objecttype] || [];
}

export async function searchStations(query: string): Promise<TrainStation[]> {
  if (!query || query.length < 2) {
    return [];
  }

  const response = await fetch(`/api/stations?query=${encodeURIComponent(query)}`);

  if (!response.ok) {
    throw new Error(`Station search error: ${response.statusText}`);
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data;
}

export async function getDepartures(
  fromStation: string,
  toStation: string,
  fromTime?: Date
): Promise<TrainAnnouncement[]> {
  let url = `/api/departures?from=${encodeURIComponent(fromStation)}&to=${encodeURIComponent(toStation)}`;

  if (fromTime) {
    url += `&date=${fromTime.toISOString()}`;
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Departures error: ${response.statusText}`);
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data;
}
