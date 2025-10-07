import { NextResponse } from 'next/server';

const API_URL = 'https://api.trafikinfo.trafikverket.se/v2/data.json';
const API_KEY = process.env.TRAFIKVERKET_API_KEY || '';

export async function GET() {
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

    return NextResponse.json(stations);
  } catch (error) {
    console.error('Station fetch error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
