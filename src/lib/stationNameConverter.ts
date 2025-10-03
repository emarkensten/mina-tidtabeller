/**
 * Convert Trafikverket station names to SJ.se format
 *
 * Trafikverket uses abbreviated forms like "Stockholm C", "Göteborg C"
 * SJ.se uses full names like "Stockholm Central", "Göteborg Central"
 */
export function convertToSJStationName(trafikverketName: string): string {
  // Replace " C" at the end with " Central"
  let sjName = trafikverketName.replace(/\sC$/, ' Central');

  // Also handle if the station name is just "C"
  if (sjName === 'C') {
    sjName = 'Central';
  }

  return sjName;
}

/**
 * Generate SJ.se booking URL for a specific route and date
 */
export function generateSJBookingUrl(
  fromStation: string,
  toStation: string,
  date: Date | string
): string {
  const fromName = encodeURIComponent(convertToSJStationName(fromStation));
  const toName = encodeURIComponent(convertToSJStationName(toStation));

  // Convert date to YYYY-MM-DD format if it's a Date object
  const dateString = typeof date === 'string'
    ? date.split('T')[0]
    : date.toISOString().split('T')[0];

  return `https://www.sj.se/sok-resa/valj-resa/${fromName}/${toName}/${dateString}`;
}
