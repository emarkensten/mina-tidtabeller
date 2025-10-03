import { NextRequest, NextResponse } from 'next/server';

const API_URL = 'https://api.trafikinfo.trafikverket.se/v2/data.json';
const API_KEY = process.env.TRAFIKVERKET_API_KEY || '';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const fromStation = searchParams.get('from');
  const toStation = searchParams.get('to');
  const dateParam = searchParams.get('date');

  if (!fromStation || !toStation) {
    return NextResponse.json(
      { error: 'Missing from or to station' },
      { status: 400 }
    );
  }

  // Use provided date or current time
  const targetDate = dateParam ? new Date(dateParam) : new Date();
  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);

  const timeFilter = dateParam
    ? `<AND>
        <GT name="AdvertisedTimeAtLocation" value="${startOfDay.toISOString()}" />
        <LT name="AdvertisedTimeAtLocation" value="${endOfDay.toISOString()}" />
      </AND>`
    : `<GT name="AdvertisedTimeAtLocation" value="$now" />`;

  const requestXml = `<REQUEST>
  <LOGIN authenticationkey="${API_KEY}" />
  <QUERY objecttype="TrainAnnouncement" schemaversion="1.9" limit="50">
    <FILTER>
      <AND>
        <EQ name="ActivityType" value="Avgang" />
        <EQ name="LocationSignature" value="${fromStation}" />
        <EQ name="Advertised" value="true" />
        ${timeFilter}
      </AND>
    </FILTER>
    <INCLUDE>ActivityId</INCLUDE>
    <INCLUDE>ActivityType</INCLUDE>
    <INCLUDE>AdvertisedTimeAtLocation</INCLUDE>
    <INCLUDE>AdvertisedTrainIdent</INCLUDE>
    <INCLUDE>EstimatedTimeAtLocation</INCLUDE>
    <INCLUDE>TimeAtLocation</INCLUDE>
    <INCLUDE>LocationSignature</INCLUDE>
    <INCLUDE>ToLocation</INCLUDE>
    <INCLUDE>FromLocation</INCLUDE>
    <INCLUDE>ProductInformation</INCLUDE>
    <INCLUDE>Canceled</INCLUDE>
    <INCLUDE>Deviation</INCLUDE>
    <INCLUDE>ViaToLocation</INCLUDE>
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

    const announcements = result?.TrainAnnouncement || [];

    console.log('Total announcements:', announcements.length);
    console.log('Looking for destination signature:', toStation);

    // Filter by checking all locations (ToLocation + ViaToLocation)
    const filtered = announcements.filter((announcement: any) => {
      const allLocations = [
        ...(announcement.ToLocation || []),
        ...(announcement.ViaToLocation || [])
      ];

      // Log for debugging
      if (announcements.indexOf(announcement) === 0) {
        console.log('First train all locations:', allLocations);
      }

      // Check if destination is in the route
      const hasDestination = allLocations.some((loc: any) => {
        const locationSignature = (loc.LocationName || '').toLowerCase();
        const targetSignature = toStation.toLowerCase();
        return locationSignature === targetSignature;
      });

      return hasDestination;
    });

    console.log('Filtered departures:', filtered.length);

    return NextResponse.json(filtered);
  } catch (error) {
    console.error('Departures error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
