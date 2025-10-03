# 
Det är inte alltid önskvärt att använda allt data, därför bör alla frågor som ställs mot API:t innehålla filter så att endast önskat data kommer med i svaret, läs mer om detta under avsnittet ~[konsolen](https://data.trafikverket.se/documentation/datacache/testbench)~ för att själv prova att ställa olika frågor.:


<REQUEST>
  <LOGIN authenticationkey="0d546260a4954c968923c98902418143"/>
  <QUERY objecttype="RailCrossing" namespace="road.infrastructure" schemaversion="1.5" limit="10">
    <FILTER></FILTER>
  </QUERY>
</REQUEST>

<REQUEST>
  <LOGIN authenticationkey="0d546260a4954c968923c98902418143"/>
  <QUERY objecttype="RailwayEvent" namespace="ols.open" schemaversion="1" limit="10">
    <FILTER></FILTER>
  </QUERY>
</REQUEST>

<REQUEST>
  <LOGIN authenticationkey="0d546260a4954c968923c98902418143"/>
  <QUERY objecttype="ReasonCode" namespace="rail.trafficinfo" schemaversion="1" limit="10">
    <FILTER></FILTER>
  </QUERY>
</REQUEST>

<REQUEST>
  <LOGIN authenticationkey="0d546260a4954c968923c98902418143"/>
  <QUERY objecttype="ReplacementTraffic" namespace="jbs" schemaversion="1" limit="10">
    <FILTER></FILTER>
  </QUERY>
</REQUEST>

<REQUEST>
  <LOGIN authenticationkey="0d546260a4954c968923c98902418143"/>
  <QUERY objecttype="TrainAnnouncement" schemaversion="1.9" limit="10">
    <FILTER></FILTER>
  </QUERY>
</REQUEST>

<REQUEST>
  <LOGIN authenticationkey="0d546260a4954c968923c98902418143"/>
  <QUERY objecttype="TrainMessage" schemaversion="1.7" limit="10">
    <FILTER></FILTER>
  </QUERY>
</REQUEST>

<REQUEST>
  <LOGIN authenticationkey="0d546260a4954c968923c98902418143"/>
  <QUERY objecttype="TrainPosition" namespace="järnväg.trafikinfo" schemaversion="1.1" limit="10">
    <FILTER></FILTER>
  </QUERY>
</REQUEST>

<REQUEST>
  <LOGIN authenticationkey="0d546260a4954c968923c98902418143"/>
  <QUERY objecttype="TrainStation" namespace="rail.infrastructure" schemaversion="1.5" limit="10">
    <FILTER></FILTER>
  </QUERY>
</REQUEST>

<REQUEST>
  <LOGIN authenticationkey="0d546260a4954c968923c98902418143"/>
  <QUERY objecttype="TrainStationMessage" schemaversion="1" limit="10">
    <FILTER></FILTER>
  </QUERY>
</REQUEST>

<REQUEST>
  <LOGIN authenticationkey="0d546260a4954c968923c98902418143"/>
  <QUERY objecttype="OperativeEvent" namespace="ols.open" schemaversion="1" limit="10">
    <FILTER></FILTER>
  </QUERY>
</REQUEST>