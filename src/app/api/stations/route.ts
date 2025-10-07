import { NextRequest, NextResponse } from 'next/server';
import { TrainStation } from '@/lib/trafikverket';

const API_URL = 'https://api.trafikinfo.trafikverket.se/v2/data.json';
const API_KEY = process.env.TRAFIKVERKET_API_KEY || '';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');

  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  const requestXml = `<REQUEST>
  <LOGIN authenticationkey="${API_KEY}" />
  <QUERY objecttype="TrainStation" schemaversion="1" limit="1000">
    <FILTER>
      <EQ name="Advertised" value="true" />
    </FILTER>
    <INCLUDE>AdvertisedLocationName</INCLUDE>
    <INCLUDE>LocationSignature</INCLUDE>
  </QUERY>
</REQUEST>`;

  try {
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

    const stations = result?.TrainStation || [];

    // Filter stations on server side based on query
    const queryLower = query.toLowerCase();
    const filtered = stations.filter((station: TrainStation) =>
      station.AdvertisedLocationName.toLowerCase().includes(queryLower) ||
      station.LocationSignature.toLowerCase().includes(queryLower)
    );

    return NextResponse.json(filtered.slice(0, 10));
  } catch (error) {
    console.error('Station search error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
