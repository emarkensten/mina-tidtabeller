# SJ API & Code Structure - Research Notes

Denna fil innehåller dokumentation om SJ:s interna API-struktur och kodflöde, baserat på analys av produktionsmiljön och SJ:s kod i `/Users/erikmarkensten/Documents/GitHub/sjse/packages/sjse-booking-client/src/`.

## Översikt av SJ:s bokningsflöde

### Steg i bokningsflödet
1. **Search** (`/sok-resa/sok`) - Välj från/till stationer, datum, antal passagerare
2. **SelectDeparture** (`/sok-resa/valj-resa`) - Tidtabell med avgångar
3. **SelectTicket** (`/sok-resa/valj-biljettyp`) - Välj klass och flexibilitet

### URL-struktur
```
/sok-resa/valj-resa/{fromStation}/{toStation}/{date}
/sok-resa/valj-biljettyp/{fromStation}/{toStation}/{date}/utresa
```

**Viktigt:** Stationsnamn i URL:er använder:
- Fullständiga namn: `"Stockholm Central"` (INTE `"Stockholm C"`)
- URL-encoding: `"G%C3%B6teborg%20Central"`

## API-endpoints (observerade i produktion)

### 1. Search API
**Endpoint:** `/api/booking/search`

**Request:**
```typescript
interface SearchRequestSJ {
  // Trafikverkets stationskoder eller UIC-koder
  fromStationCode: string;
  toStationCode: string;
  departureDate: string; // ISO format
  passengers: {
    adults: number;
    children?: number;
    // ... etc
  };
  // ... andra parametrar
}
```

**Response:**
```typescript
interface SearchResponseSJ {
  searchId: string; // UUID - används för att hämta avgångar
  passengerListId: string; // UUID - används för bokningsprocessen
  // ... andra fält
}
```

### 2. Departures API
**Endpoint:** `/api/booking/departures/{searchId}`

**Response:**
```typescript
interface DepartureResponseSJ {
  departures: Departure[];
  // ... metadata
}

interface Departure {
  departureId: string; // UUID - NYCKELN för autoscroll!
  departureDateTime: string; // ISO 8601
  arrivalDateTime: string;
  publicServiceName: string; // Tågnummer, t.ex. "419"
  serviceName: string; // Intern kod

  // Prisinfo per klass och flexibilitet
  seatOffers: {
    offers: {
      SECOND: {
        flexibilities: {
          FULLFLEX: { offerId: string; available: boolean; /* ... */ };
          SEMIFLEX: { /* ... */ };
          NOFLEX: { /* ... */ };
        };
        priceFrom: {
          price: string; // "735"
          currency: string; // "SEK"
          flexibility: string; // "NOFLEX"
        };
      };
      SECOND_CALM: { /* ... */ };
      FIRST: { /* ... */ };
    };
  };

  // Status
  available: boolean;
  departureStatus: string[]; // ["SOLD_OUT"], ["AVAILABLE"], etc.

  // Tåginformation
  availabilities: [{
    serviceIdentifier: string; // Lång kodad sträng
    publicServiceName: string; // "419" - MATCHAR mot Trafikverket!
  }];
}
```

### 3. Offers API
**Endpoint:** `/api/booking/offers?passengerListId={passengerListId}`

Anropas efter att användaren valt en avgång. Hämtar detaljerade priser för vald avgång.

## Autoscroll-funktionalitet

### Hur SJ scrollar tillbaka till vald avgång

När användaren går tillbaka från SelectTicket till SelectDeparture:

1. **Varje avgångskort har ett unikt `id` attribut:**
   ```html
   <div id="bc518f41-b954-30a8-9eaa-9c687ff3dcf5" ...>
   ```
   Detta `id` är samma som `departureId` från API:t.

2. **Scroll-mekanismen:**
   - SJ sparar vald `departureId` i Redux state eller sessionStorage
   - Vid återvändo till sidan scrollas browser:n till `#departureId`
   - Elementet får även CSS-klass `Card-active`

3. **För att implementera detta behöver vi:**
   - Hämta avgångar från SJ API (för att få `departureId`)
   - Matcha SJ:s avgång mot Trafikverket:s avgång (via tågnummer + tid)
   - Lägga till `#departureId` i URL:en när vi länkar till SJ.se

**Exempel:**
```
https://www.sj.se/sok-resa/valj-resa/Stockholm%20Central/Göteborg%20Central/2025-10-23#bc518f41-b954-30a8-9eaa-9c687ff3dcf5
```

## Matching mellan Trafikverket och SJ

### Gemensamma fält för matching

| Trafikverket | SJ | Kommentar |
|-------------|-------|-----------|
| `AdvertisedTrainIdent` | `publicServiceName` | Tågnummer, t.ex. "419" |
| `AdvertisedTimeAtLocation` | `departureDateTime` | ISO 8601 format |
| Station signatures (Cst, G) | UIC codes (740000001) | Olika system! |

### Matching-strategi
1. **Primär:** Tågnummer (`AdvertisedTrainIdent` = `publicServiceName`)
2. **Sekundär:** Avgångstid (samma datum + tid inom ±5 min)
3. **Tertiär:** Från/till-station måste matcha

### Stationsnamn-konvertering

Trafikverket använder kortformer, SJ använder fullständiga namn:

```typescript
// Exempel på konvertering
"Stockholm C" → "Stockholm Central"
"Göteborg C" → "Göteborg Central"
"Malmö C" → "Malmö Central"

// Regex för konvertering
stationName.replace(/\sC$/, ' Central')
```

## SJ:s kodstruktur (i sjse-repo)

### Viktiga filer

```
/sjse/packages/sjse-booking-client/src/
├── Search/
│   ├── Api/
│   │   └── Config.api.ts
│   ├── Form/
│   │   └── Search.form.tsx
│   └── Search.navigation.ts
├── SelectDeparture/
│   ├── Api/
│   │   ├── Departures.api.ts      // getDeparturesById(searchId)
│   │   ├── Search.api.ts           // search() och updateSearch()
│   │   └── TrafficInfo.api.ts     // Trafikinformation (ej Trafikverket!)
│   ├── Components/
│   │   └── Departure/
│   │       └── DepartureList.tsx
│   ├── Redux/
│   │   ├── departuresSlice.ts
│   │   └── searchSlice.ts
│   └── SelectDeparture.navigation.ts
└── SelectTicket/
    ├── Api/
    │   └── SelectTicketContent.api.ts
    └── SelectTicket.navigation.ts
```

### API-wrapper struktur

```typescript
// Från SelectDeparture/Api/Departures.api.ts
export const getDeparturesById = (
  searchId: string
): Promise<CustomResponse<DepartureResponseSJ>> =>
  apiWrapper<DepartureResponseSJ>(() =>
    api.booking.departures.getDeparturesById(searchId, {
      cancelToken: DEPARTURE_CANCEL_TOKEN,
    })
  );
```

## Storage & State

### SessionStorage nycklar (observerat)
- `appState` - Redux state (logging config)
- `featureToggles` - Feature flags
- `sjse_uuid` - Session identifier

### LocalStorage nycklar (observerat)
- `recent_search_station_picker_fromLocation` - Senaste sökta från-station
- `recent_search_station_picker_toLocation` - Senaste sökta till-station
- `i18nLng` - Språkinställning (sv/en)
- `role` - User role (TRAVELLER, etc.)

**OBS:** Ingen avgångs-ID eller scroll-position sparas i storage!
Autoscroll verkar använda URL hash (#departureId) istället.

## Nästa steg för integration

### Om vi får tillgång till SJ:s testmiljö

1. **API-endpoints att testa:**
   ```
   POST /api/booking/search
   GET  /api/booking/departures/{searchId}
   GET  /api/booking/offers?passengerListId={passengerListId}
   ```

2. **Autentisering:**
   - Kolla om testmiljön kräver API-nycklar
   - Eventuellt CORS-headers

3. **Implementationsplan:**
   - Skapa `/api/sj/search` endpoint i vår Next.js app (proxy till SJ)
   - Hämta både Trafikverket OCH SJ data parallellt
   - Matcha avgångar baserat på tågnummer + tid
   - Visa kombinerad data: SJ-pris + Trafikverket-trafikinfo
   - Länka till SJ.se med `#departureId` för autoscroll

4. **Test-endpoints att undersöka:**
   ```typescript
   // I SJ-repot, kolla efter:
   - Base URL för testmiljö
   - Authentication headers
   - Request/response types i booking-stubs-sales
   ```

## Anteckningar från DevTools-analys

### Observerade API-anrop (produktion)
1. `GET /api/booking/departures/8b3c2b66-4fd5-3105-b4a4-c8189506e3fc`
   - Detta är searchId från initial search
   - Returnerar alla avgångar som JSON

2. `GET /api/booking/offers?passengerListId=0720b8b1-241a-4468-b036-dad386d5f7a0`
   - Anropas när avgång väljs
   - Returnerar detaljerade priser för vald avgång

### Viktiga observationer
- SJ:s API använder UUIDs för alla identifiers
- Ingen direktlänkning till specifik avgång i URL (endast datum/stationer)
- Autoscroll sker via DOM id-matching, inte URL-parametrar
- TrafficInfo från SJ är INTE samma som Trafikverket (SJ har egen tjänst)

## Skillnader: Trafikverket vs SJ TrafficInfo

| Aspekt | Trafikverket | SJ TrafficInfo |
|--------|-------------|----------------|
| Källa | Officiell järnvägsdata | SJ:s interna system |
| Täckning | Alla operatörer | Endast SJ-tåg |
| Realtidsdata | Ja (förseningar, inställda) | Ja, men kan skilja sig |
| API tillgång | Öppen (med API-nyckel) | Intern (kräver SJ-auth) |

**Slutsats:** Bäst att fortsätta använda Trafikverket för trafikinformation, men SJ API för priser och departureId.

---

*Dokumentation skapad: 2025-10-03*
*Baserad på: Analys av sj.se i produktion + kod i sjse-repo*
