import { NextRequest, NextResponse } from 'next/server';
import { TrainAnnouncement } from '@/lib/trafikverket';
import { departuresCache, routeCache } from '@/lib/cache';

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

  // Create cache key
  const cacheKey = `${fromStation}-${toStation}-${dateParam || 'now'}`;

  // Check cache first
  const cached = departuresCache.get(cacheKey);
  if (cached) {
    console.log('Returning cached departures for:', cacheKey);
    return NextResponse.json(cached);
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

    console.log('Total announcements from station:', announcements.length);
    console.log('Looking for trains stopping at:', toStation);

    // Get unique train identifiers
    const uniqueTrainIdents = [...new Set(announcements.map(a => a.AdvertisedTrainIdent))];
    console.log('Unique trains:', uniqueTrainIdents.length);

    // Fetch routes for all unique trains in parallel
    const routePromises = uniqueTrainIdents.map(async (trainIdent) => {
      // Check route cache first (routes rarely change)
      const routeCacheKey = `${trainIdent}-${toStation}`;
      const cachedRoute = routeCache.get(routeCacheKey);

      if (cachedRoute !== null) {
        return { trainIdent, stopsAtDestination: cachedRoute };
      }

      const routeRequestXml = `<REQUEST>
  <LOGIN authenticationkey="${API_KEY}" />
  <QUERY objecttype="TrainAnnouncement" schemaversion="1.9" limit="100">
    <FILTER>
      <AND>
        <EQ name="AdvertisedTrainIdent" value="${trainIdent}" />
        <EQ name="Advertised" value="true" />
        ${timeFilter}
      </AND>
    </FILTER>
    <INCLUDE>LocationSignature</INCLUDE>
    <INCLUDE>ActivityType</INCLUDE>
  </QUERY>
</REQUEST>`;

      const routeResponse = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/xml',
        },
        body: routeRequestXml,
      });

      if (routeResponse.ok) {
        const routeData = await routeResponse.json();
        const routeResult = routeData.RESPONSE?.RESULT?.[0];
        const routeStops = routeResult?.TrainAnnouncement || [];

        // Check if destination station is in the route
        const stopsAtDestination = routeStops.some((stop: { LocationSignature: string }) =>
          stop.LocationSignature.toLowerCase() === toStation.toLowerCase()
        );

        // Cache the route result
        routeCache.set(routeCacheKey, stopsAtDestination);

        return { trainIdent, stopsAtDestination };
      }

      return { trainIdent, stopsAtDestination: false };
    });

    const routeResults = await Promise.all(routePromises);
    const trainsStoppingAtDestination = new Set(
      routeResults.filter(r => r.stopsAtDestination).map(r => r.trainIdent)
    );

    // Filter announcements to only include trains that stop at destination
    const filtered = announcements.filter(a =>
      trainsStoppingAtDestination.has(a.AdvertisedTrainIdent)
    );

    console.log('Filtered departures that stop at destination:', filtered.length);

    // Cache the result
    departuresCache.set(cacheKey, filtered);

    return NextResponse.json(filtered);
  } catch (error) {
    console.error('Departures error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
