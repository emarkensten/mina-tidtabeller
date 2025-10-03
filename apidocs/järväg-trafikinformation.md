# # JÃ¤rnvÃ¤g - Trafikinformation
## Observera att datamÃ¤ngdenÂ TrainMessageÂ kommer att avvecklas underÂ 9/9 2025Â och ersÃ¤ttas av datamÃ¤ngdernaÂ OperativeEventÂ ochÂ RailwayEvent, seÂ ~[nyhet](https://data.trafikverket.se/news/datacache/change-of-data-set-trainmessage-in-open-api)~






## Namespace: ols.open
## Version:
1.0

## TÃ¥gtrafikmeddelande, exempelvis information kring banarbete, tÃ¥gfel, anlÃ¤ggningsfel och dylikt.
| PropertyÂ  | Type | Description |
|---|---|---|
| CountyNo | int[] | LÃ¤nsnummer |
| Deleted | boolean | Borttagen |
| EndDateTime | dateTime | Den operativa hÃ¤ndelsens sluttid |
| Â EventSection | [] | StrÃ¤cka som pÃ¥verkas av stÃ¶rning |
| EventState | int | Den operativa hÃ¤ndelsens status (0=avslutad, 1=aktiv) |
| EventTrafficType | int | Trafikslag, 0=JÃ¤rnvÃ¤g, 2=JÃ¤rnvÃ¤g och vÃ¤g |
| Â EventType |  | HÃ¤ndelsetyp |
| Â Geometry |  | BerÃ¤knad geografisk mittpunkt fÃ¶r den operativa hÃ¤ndelsen |
| ModifiedDateTime | dateTime | Tidpunkt dÃ¥ dataposten senast Ã¤ndrades |
| ModifiedTime | dateTime | Anger nÃ¤r objektet Ã¤r sparat. |
| OperativeEventIdÂ  | string | Unikt id fÃ¶r den operativa hÃ¤ndelsen |
| RailRoadTimeForServiceResumption | dateTime | Tidpunkt fÃ¶r tidigast trafikstart |
| Â RelatedEvent | [] | Relaterad mÃ¶jlig operativ hÃ¤ndelse |
| RoadDegreeOfImpact | int | HÃ¤ndelsens pÃ¥verkan pÃ¥ trafiken (1:Ingen pÃ¥verkan, 2: Liten pÃ¥verkan, 4: Stor pÃ¥verkan, 5: Mycket stor pÃ¥verkan) |
| RoadPrognosisDateTime | dateTime | Prognos sluttid fÃ¶r hÃ¤ndelse i vÃ¤gsystemet |
| StartDateTime | dateTime | Den operativa hÃ¤ndelsens starttid |
| Â TrafficImpact | [] | Information om trafikpÃ¥verkan kopplat till den operativa hÃ¤ndelsen |
| Version | int | Version |
## Namespace: Road.Infrastructure
## Version:
1.5

## Information om plankorsningar, varje post representerar en plankorsning.
## 			FÃ¶r riktningsberoende fÃ¶reteelser anges hÃ¶ger och vÃ¤nster med att stÃ¥ i riktning vÃ¤nd mot stigande km-tal.
| PropertyÂ  | Type | Description |
|---|---|---|
| DataLastUpdated | dateTime | Tidpunkt dÃ¥ plankorsningens data senast Ã¤ndrades |
| Deleted | boolean | Anger om objektet Ã¤r raderat. |
| FromDate | dateTime | Information om plankorsningen gÃ¤ller frÃ¥n och med detta datum. |
| Â Geometry |  |  |
| Kilometer | int | Plankorsningens kilometer-tal enligt banans lÃ¤ngdmÃ¤tning |
| LevelCrossingIdÂ  | int | Plankorsningens femsiffriga idnummer |
| Meter | int | Plankorsningens meter-tal enligt banans lÃ¤ngdmÃ¤tning |
| ModifiedTime | dateTime | Anger nÃ¤r objektet Ã¤r sparat. |
| NumberOfTracks | int | Antal spÃ¥r i plankorsningen |
| ObjectId | string | Unikt id fÃ¶r plankorsning. |
| OperatingMode | string | DriftlÃ¤ge, T.ex. "I drift", "StÃ¤ngd", "OkÃ¤nd" eller "Blankt" (okÃ¤nd) |
| PortalHeightLeft | double | PortalhÃ¶jd hÃ¶ger |
| PortalHeightRight | double | PortalhÃ¶jd hÃ¶ger |
| RailwayRouteId | string | Id fÃ¶r rutt, anvÃ¤nds fÃ¶r att referera till andra datamÃ¤ngder med samma id |
| RoadName | string | VÃ¤gnamn. |
| RoadNameAlternative | string | Alternativt vÃ¤gnamn |
| RoadNameOfficial | string | Kommunalt gatunamn |
| RoadProfileCrest | int | VÃ¤gprofil vÃ¤gkrÃ¶n. Vertikal vÃ¤gprofil dÃ¤r ett vÃ¤gfordon med lÃ¥g markfrigÃ¥ng riskerar att fastna.<br>VÃ¤rdemÃ¤ngd: 0: Uppgift saknas, 1: Ja, 2: Nej |
| RoadProfileCrossCurve | int | VÃ¤gprofil tvÃ¤r kurva. Kurva nÃ¤ra plankorsningen dÃ¤r ett vÃ¤gfordon med slÃ¤p riskerar att fastna.<br>VÃ¤rdemÃ¤ngd: 0: uppgift saknas, 1: Ja, 2: Nej |
| RoadProfileDangerousCrest | int | VÃ¤gprofil farligt vÃ¤gkrÃ¶n. Vertikal vÃ¤gprofil dÃ¤r ett vÃ¤gfordon med lÃ¥g markfrigÃ¥ng riskerar att fastna.<br>VÃ¤rdemÃ¤ngd: 0: Uppgift saknas, 1: Ja, 2: Nej |
| RoadProfileSteepSlope | int | VÃ¤gprofil brant lutning. VÃ¤gbanan inom 25 meter frÃ¥n plankorsningen lutar mer Ã¤n +/- 35 promille.<br>VÃ¤rdemÃ¤ngd: 0: uppgift saknas, 1: Ja, 2: Nej |
| RoadProtection | int | VÃ¤gskydd. |
| Â RoadProtectionAddition | [] |  |
| Â RoadProtectionBase | [] |  |
| RoadRouteId | string | Id fÃ¶r rutt, anvÃ¤nds fÃ¶r att referera till andra datamÃ¤ngder med samma id |
| RouteId | string | Id fÃ¶r vÃ¤gen |
| ToDate | dateTime | Information om plankorsningen gÃ¤ller till och med detta datum. |
| TrackPortion | string | Bandel |
| TrainFlow | int | TÃ¥gflÃ¶de, vid vÃ¤rde 0 eller inget angivet vÃ¤rde sÃ¥ saknas uppgifter om tÃ¥gflÃ¶de. |
## Namespace: ols.open
## Version:
1.0

## FÃ¶rsta version, TrafikhÃ¤ndelser, anlÃ¤ggningsfel och/eller stÃ¶rningar i jÃ¤rnvÃ¤gstrafiken
| PropertyÂ  | Type | Description |
|---|---|---|
| CreatedDateTime | dateTime | Tidpunkt dÃ¥ hÃ¤ndelsen skapades |
| Deleted | boolean | Borttagen |
| EndDateTime | dateTime | HÃ¤ndelsens sluttidpunkt |
| EventIdÂ  | string | HÃ¤ndelsens ID frÃ¥n Basun |
| EventStatus | string | HÃ¤ndelsens status (MÃ¶jligOperativHÃ¤ndelse, BedÃ¶mdEjOperativHÃ¤ndelse, OperativHÃ¤ndelse) |
| ModifiedDateTime | dateTime | Tidpunkt nÃ¤r hÃ¤ndelsen Ã¤ndrades |
| ModifiedTime | dateTime | Anger nÃ¤r objektet Ã¤r sparat. |
| OperativeEventId | string | ID fÃ¶r relaterad operativ hÃ¤ndelse |
| ReasonCode | string | Kod fÃ¶r hÃ¤ndelsens orsak (orsakskod) |
| Â SelectedSection | [] | IngÃ¥ende strÃ¤ckor som berÃ¶r hÃ¤ndelsen |
| StartDateTime | dateTime | HÃ¤ndelsens starttidpunkt |
| Version | int | HÃ¤ndelsens version |
## Namespace: Rail.TrafficInfo
## Version:
1.0

## Orsakskoder, varje post representerar en orsakskod.

## 			FÃ¤lten "Code" och "Level3Description" motsvarar fÃ¤lten "Code" och "Description" fÃ¶r objekttyperna TrainAnnouncement och TrainMessage.
| PropertyÂ  | Type | Description |
|---|---|---|
| CodeÂ  | string | Full orsakskod, detta fÃ¤lt motsvarar det som finns frÃ¥n och med TrainAnnouncement version 1.5 under t.ex. Deviation.Code<br>eller i objekttypen TrainMessage frÃ¥n och med schemaversion 1.5 under ReasonCode.Code |
| Deleted | boolean | Anger om objektet Ã¤r raderat. |
| GroupDescription | string | Beskrivning fÃ¶r vilken grupp orsakskoden tillhÃ¶r, t.ex Annonseringstexter och Orsaker nya principer |
| Level1Description | string | NivÃ¥ 1 beskrivning, beskriver vilken typ av orsakskod. |
| Level2Description | string | NivÃ¥ 2 beskrivning, beskriver vilken betydelse orsakskoden har, t.ex. Nationell |
| Level3Description | string | NivÃ¥ 3 beskrivning, beskrivande text fÃ¶r orsakskoden, detta fÃ¤lt motsvarar det som finns i objekttypen TrainAnnouncement frÃ¥n och med schemaversion 1.5 under t.ex. Deviation.Description<br>eller i objekttypen TrainMessage frÃ¥n och med schemaversion 1.5 under ReasonCode.Description |
| ModifiedTime | dateTime | Anger nÃ¤r objektet Ã¤r sparat. |
## Namespace: JBS
## Version:
1.0

## Schema fÃ¶r ersÃ¤ttningstrafik
| PropertyÂ  | Type | Description |
|---|---|---|
| Deleted | boolean | Anger om objektet Ã¤r raderat. |
| Description | string | Beskrivande text fÃ¶r att resenÃ¤r ska kÃ¤nna igen bussen/taxin.. (GÃ¤rna tÃ¥gnummer+lÃ¶pnummer ?) |
| IdÂ  | string | AvsÃ¤ndarinternt id, tillsammans med "AvsÃ¤ndare" identifierar detta turen |
| ModifiedTime | dateTime | Anger nÃ¤r objektet Ã¤r sparat. |
| Â ReplacesTrains |  | Lista med de tÃ¥g som ersÃ¤tts |
| SourceÂ  | string | Namn/identifierare pÃ¥ avsÃ¤ndare |
| Status | string | Planerad/bestÃ¤lld/bekrÃ¤ftad/PÃ¥gÃ¥ende/avslutat/instÃ¤lld. Begrepp enligt Netex |
| Â Stops |  | Lista med tidtabell fÃ¶r resan |
| Toilet | boolean | Anger om det finns toalett pÃ¥ resan |
| VehicleIdentifier | string | Registreringsnummer eller alternativt id pÃ¥ fordon |
| VehicleMode | string | Fordonstyp enligt NetEx-standard (taxi tillagd): [air, bus, coach, ferry, metro, rail, tram, taxi] |
| WheelChair | boolean | Anger om resan fungerar fÃ¶r resa med rullstol (och dÃ¤rmed Ã¤ven barnvagn) |
## Version:
1.9

## Tidtabellsinformation, d.v.s information om tÃ¥g pÃ¥ trafikplatser (stationer, hÃ¥llplatser) varje post motsvarar ett visst tÃ¥g vid respektive trafikplats.

## FÃ¶rÃ¤ndringslogg
## FÃ¶ljande fÃ¤lt Ã¤r nya frÃ¥n och med version 1.9
* OperationalTransportIdentifiers
* OperationalTransportIdentifiers.ObjectType
* OperationalTransportIdentifiers.Company
* OperationalTransportIdentifiers.Core
* OperationalTransportIdentifiers.Variant
* OperationalTransportIdentifiers.TimetableYear
* OperationalTransportIdentifiers.StartDate

â €
| PropertyÂ  | Type | Description |
|---|---|---|
| ActivityIdÂ  | string | Aktivitetens unika id |
| ActivityType | string | "Ankomst" eller "Avgang" |
| Advertised | boolean | Anger om ankomsten/avgÃ¥ngen annonseras i tidtabell |
| AdvertisedTimeAtLocation | dateTime | Tidtabellstid |
| AdvertisedTrainIdent | string | Annonserat tÃ¥gnummer (tÃ¥gnumret som stÃ¥r pÃ¥ biljetten) |
| Â Booking | [] | Kod fÃ¶r bokningsinformation och bokningsinformation, ex: "Vagn 4 obokad |
| Canceled | boolean | Anger om ankomsten/avgÃ¥ngen Ã¤r instÃ¤lld |
| Deleted | boolean | Anger att dataposten raderats |
| DepartureDateOTN | dateTime | UtgÃ¥ngsdatum fÃ¶r det Operativa tÃ¥gnumret. |
| Â Deviation | [] | Eventuell avvikelse med full orsakskod, ex: ABC023 och beskrivning, ex: "Buss ersÃ¤tter", "SpÃ¥rÃ¤ndrat", "Kort tÃ¥g", "Ej servering" o.s.v. |
| EstimatedTimeAtLocation | dateTime | Tidpunkt fÃ¶r berÃ¤knad ankomst eller avgÃ¥ng |
| EstimatedTimeIsPreliminary | boolean | Anger om en berÃ¤knad tid Ã¤r preliminÃ¤r. Notera att om den berÃ¤knade tiden Ã¤r preliminÃ¤r sÃ¥ innebÃ¤r det att den kan Ã¤ndras bÃ¥de framÃ¥t och bakÃ¥t, ett tÃ¥g kan alltsÃ¥ t.ex avgÃ¥ tidigare Ã¤n berÃ¤knad tidpunkt om den ocksÃ¥ Ã¤r markerad som preliminÃ¤r. |
| Â FromLocation | [] | FrÃ¥n station fÃ¶r tÃ¥get med ordning och i vilken prioritet som ska visas. Notera att det avser vad som ska annonseras fÃ¶r resenÃ¤rerna, det vill sÃ¤ga vad som ska visas pÃ¥ skyltar o.dyl. FromLocation kan med andra ord ha olika innehÃ¥ll fÃ¶r samma tÃ¥g vid olika stationer och olika innehÃ¥ll vad ankomster respektive avgÃ¥ngar. FÃ¤ltet anger hur frÃ¥n-stationer ska annonseras. |
| InformationOwner | string | Namnet pÃ¥ trafikinformationsÃ¤garen |
| LocationDateTimeOTN | dateTime | Det operativa tÃ¥gets ankomst- eller avgÃ¥ngstid enligt tidtabell (kan skilja sig frÃ¥n den annonserade tiden). |
| LocationSignature | string | Signatur fÃ¶r stationen |
| MobileWebLink | string | Url till trafikÃ¤garens mobila hemsida |
| ModifiedTime | dateTime | Tidpunkt dÃ¥ dataposten Ã¤ndrades |
| NewEquipment | int | Anger i vilken ordning tÃ¥get nyutrustats. Om ingen nyutrustning skett kommer vÃ¤rdet vara noll |
| OperationalTrainNumber | string | Operativt tÃ¥gnummer (OTN). |
| Â OperationalTransportIdentifiers | [] | Identifierare i TAF/TAP format. |
| Operator | string | Det jÃ¤rnvÃ¤gsfÃ¶retag som utfÃ¶r jÃ¤rnvÃ¤gstrafik, alltsÃ¥ kÃ¶r tÃ¥get, fÃ¶r en trafikorganisatÃ¶r. |
| Â OtherInformation | [] | Kod fÃ¶r Ã¶vrig annonseringsinformation och Ã¶vrig annonseringsinformation, ex. "Trevlig resa!", "Bakre fordon gÃ¥r lÃ¥st!", "Ingen pÃ¥stigning" |
| PlannedEstimatedTimeAtLocation | dateTime | Anger en planerad fÃ¶rsening och dess giltighet anges med PlannedEstimatedTimeAtLocationIsValid-flaggan |
| PlannedEstimatedTimeAtLocationIsValid | boolean | Anger om PlaneradBeraknadTid Ã¤r giltig. Kommer sÃ¤ttas till false nÃ¤r en operativ berÃ¤knad tidrapport, tidrapport eller slopningsrapport skapas |
| Â ProductInformation | [] | Kod fÃ¶r beskrivning av tÃ¥get och beskrivning av tÃ¥get, ex. "TÃ¥gkompaniet", "SJ InterCity", "TiB/TÃ¥gkomp" |
| ScheduledDepartureDateTime | dateTime | TÃ¥gets annonserade avgÃ¥ngsdatum |
| Â Service | [] | Servicekod och lite extra utÃ¶ver produktinformation, ex "Bistro", "Sov-och liggv" |
| TimeAtLocation | dateTime | NÃ¤r tÃ¥get har ankommit eller avgÃ¥tt |
| TimeAtLocationWithSeconds | dateTime | NÃ¤r tÃ¥get har ankommit eller avgÃ¥tt, med sekunder |
| Â ToLocation | [] | Till station fÃ¶r tÃ¥get med ordning och i vilken prioritet som ska visas. Notera att det avser vad som ska annonseras fÃ¶r resenÃ¤rerna, det vill sÃ¤ga vad som ska visas pÃ¥ skyltar o.dyl. ToLocation kan med andra ord ha olika innehÃ¥ll fÃ¶r samma tÃ¥g vid olika stationer och olika innehÃ¥ll vad ankomster respektive avgÃ¥ngar. FÃ¤ltet anger hur till-stationer ska annonseras. |
| TrackAtLocation | string | SpÃ¥r |
| Â TrainComposition | [] | Kod fÃ¶r tÃ¥gsammansÃ¤ttning och tÃ¥gsammansÃ¤ttning, ex: "Vagnsordning 7, 6, 5, 4, 2, 1" |
| TrainOwner | string | Ã„garen av det aktuella tÃ¥glÃ¤get |
| Â TypeOfTraffic | [] | Trafiktypen, ex. "Buss", "PendeltÃ¥g", "Taxi", "TÃ¥g". |
| WebLink | string | Url till trafikÃ¤garens hemsida |
| WebLinkName | string | Namn pÃ¥ trafikinfoÃ¤garen att anvÃ¤nda i lÃ¤nkar |
| Â ViaFromLocation | [] |  |
| Â ViaToLocation | [] |  |
## Version:
1.7

## Observera att datamÃ¤ngden TrainMessage kommer att avvecklas under april 2025 och ersÃ¤ttas av datamÃ¤ngderna PublicOperativeEvent och RailwayEvent.

## TÃ¥gtrafikmeddelande, exempelvis information kring banarbete, tÃ¥gfel, anlÃ¤ggningsfel och dylikt.
| PropertyÂ  | Type | Description |
|---|---|---|
| CountyNo | int[] | LÃ¤nsnummer<br> |
| Deleted | boolean | Anger att dataposten raderats |
| EndDateTime | dateTime | HÃ¤ndelsens sluttid |
| EventIdÂ  | string | Unikt id fÃ¶r hÃ¤ndelsen |
| ExternalDescription | string | Informationstext |
| Â Geometry |  |  |
| Header | string | RedaktÃ¶rssatt rubrik fÃ¶r hÃ¤ndelsen, kan i vissa fall vara samma som ReasonCodeText |
| LastUpdateDateTime | dateTime | Tidpunkt dÃ¥ hÃ¤ndelsen uppdaterades |
| ModifiedTime | dateTime | Tidpunkt dÃ¥ dataposten Ã¤ndrades |
| PrognosticatedEndDateTimeTrafficImpact | dateTime | Prognos fÃ¶r dÃ¥ hÃ¤ndelsen inte lÃ¤ngre vÃ¤ntas pÃ¥verka trafiken |
| Â ReasonCode | [] |  |
| StartDateTime | dateTime | HÃ¤ndelsens starttid |
| Â TrafficImpact | [] | Meddelandets trafikpÃ¥verkan |
## Namespace: jÃ¤rnvÃ¤g.trafikinfo
## Version:
1.1

## Schema fÃ¶r att definera tÃ¥gets position
| PropertyÂ  | Type | Description |
|---|---|---|
| Bearing | int | TÃ¥gets bÃ¤ring i grader |
| Deleted | boolean | Anger om objektet Ã¤r raderat. |
| ModifiedTime | dateTime | Anger nÃ¤r objektet Ã¤r sparat. |
| Â Position |  | Senast registrerade position fÃ¶r tÃ¥get |
| Speed | int | TÃ¥gets hastighet i kilometer per timme |
| Â Status |  | TÃ¥gets aktuell status |
| TimeStamp | dateTime | Tiden dÃ¥ positionen uppmÃ¤ttes |
| Â Train |  | TÃ¥ginformation |
| VersionNumber | long | Versionsnumret fÃ¶r ett tÃ¥gs position |
## Namespace: rail.infrastructure
## Version:
1.5

## Trafikplatser, bÃ¥de med och utan resandeutbyte.
## FÃ¶rÃ¤ndringslogg
## DatamÃ¤ngden har utÃ¶kats med fÃ¤ltet PrimaryLocationCode.
## FrÃ¥n och med denna schemaversion krÃ¤vs att man anger namespace i frÃ¥gan,
## detta gÃ¶rs genom att lÃ¤gga till attributet â€™namespaceâ€™ pÃ¥ Query-elementet,
## Ex: QUERY objecttype="TrainStation" namespace="rail.infrastructure".
| PropertyÂ  | Type | Description |
|---|---|---|
| Advertised | boolean | Anger om stationen annonseras i tidtabell |
| AdvertisedLocationName | string | Stationens namn |
| AdvertisedShortLocationName | string | Stationens namn i kort version |
| CountryCode | string | Beteckning fÃ¶r i vilket land stationen finns.<br>"DE" - Tyskland<br>"DK" - Danmark<br>"NO" - Norge<br>"SE" - Sverige |
| CountyNo | int[] | LÃ¤nsnummer<br> |
| Deleted | boolean | Anger om objektet Ã¤r raderat. |
| Â Geometry |  |  |
| LocationInformationText | string | Upplysningsinformation fÃ¶r stationen, ex. "SL-tÃ¥g omfattas ej.", "Ring 033-172444 fÃ¶r trafikinformation" |
| LocationSignatureÂ  | string | Stationens unika signatur, ex. "Cst" |
| ModifiedTime | dateTime | Anger nÃ¤r objektet Ã¤r sparat. |
| OfficialLocationName | string | Det av Transportstyrelsen fastslagna officiella namnet pÃ¥ stationen |
| PlatformLine | string[] | Plattformens spÃ¥r |
| PrimaryLocationCode | string | En numerisk kod som tillsammans med landskod (CountryCode) utgÃ¶r en unik identifierare fÃ¶r en plats enligt TAF/TAP-TSI |
| Prognosticated | boolean | Anger om stationen prognostiseras i tidtabell |
## Version:
1.0

## AllmÃ¤n annonseringsinformation fÃ¶r en station och mediatyp (Monitor, Plattformsskylt, Utrop).
| PropertyÂ  | Type | Description |
|---|---|---|
| ActiveDays | string | En strÃ¤ng som beskriver om ett meddelande ska vara aktivt (Y) eller inte (N) fÃ¶r varje dag frÃ¥n Starttid till Sluttid. |
| Deleted | boolean | Anger att dataposten raderats |
| EndDateTime | dateTime | NÃ¤r meddelandet ska sluta visas |
| EventId | string | TrafikhÃ¤ndelsenummer frÃ¥n Basun |
| FreeText | string | Annonseringstexten |
| IdÂ  | string | Unikt id fÃ¶r varje meddelande |
| LocationCode | string | Stationens platssignatur |
| MediaType | string | Anger vilket presentationsmedia meddelandet gÃ¤ller.<br>"Monitor"<br>"Plattformsskylt"<br>"Utrop" |
| ModifiedTime | dateTime | Tidpunkt dÃ¥ dataposten Ã¤ndrades |
| Â MonitorAttributes |  |  |
| Â PlatformSignAttributes |  |  |
| Â PublicAnnouncementAttributes |  |  |
| SplitActivationTime | boolean | Anger att ett meddelande bara skall gÃ¤lla mellan tidpunkterna i Starttid och Sluttid, fÃ¶r varje dag i intervallet Starttid och Sluttid |
| StartDateTime | dateTime | NÃ¤r meddelandet ska bÃ¶rja visas |
| Status | string | Meddelandets viktighetsgrad |
| VersionNumber | int | Version pÃ¥ detta meddelande |