import { LatLngTuple, icon } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

const makeLink = (location: string, text: string) => {
  return (
    <a target="_blank" rel="noopener noreferrer" href={location}>
      {text}
    </a>
  );
};

const Map: React.FC = () => {
  const hotelIcon = icon({
    iconUrl: "/hotel-icon.png",
    iconSize: [64, 64],
    iconAnchor: [32, 64],
  });
  const partyIcon = icon({
    iconUrl: "/party-icon.png",
    iconSize: [64, 64],
    iconAnchor: [32, 64],
  });
  const syverstad: LatLngTuple = [59.8480967314304, 10.483232275340505];
  const holmenfjord: LatLngTuple = [59.85138690615946, 10.494922279922516];
  return (
    <MapContainer
      zoom={15}
      center={syverstad}
      scrollWheelZoom
      style={{ height: 600, width: "80%" }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={syverstad} icon={partyIcon}>
        <Popup>
          The place of the party! <br />
          {makeLink(
            "https://www.google.com/maps/place/Syverstad+g%C3%A5rd/@59.8767305,10.5743778,12z/data=!4m5!3m4!1s0x0:0xea4f84a8e23f63a1!8m2!3d59.8486471!4d10.4832363",
            "Open in Google Maps"
          )}
          <br />
          {makeLink("https://www.syverstadgard.no/", "Syverstad gård website")}
        </Popup>
      </Marker>
      <Marker position={holmenfjord} icon={hotelIcon}>
        <Popup>
          The hotel <br />
          {makeLink(
            "https://www.google.com/maps/place/Holmen+Fjordhotell/@59.8865172,10.5847882,12z/data=!4m8!3m7!1s0x464114ef79a892c3:0x405dbf11c9922e17!5m2!4m1!1i2!8m2!3d59.8513408!4d10.4950308",
            "Open in Google Maps"
          )}
          <br />
          {makeLink(
            "https://www.holmenfjordhotell.no/",
            "Holmen Fjordhotell website"
          )}
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
