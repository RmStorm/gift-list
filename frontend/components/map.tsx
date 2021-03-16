import { LatLngTuple } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
// import "leaflet/dist/leaflet.css";

const Map = () => {
  const syverstad: LatLngTuple = [59.8480967314304, 10.483232275340505];
  return (
    <MapContainer
      zoom={16}
      center={syverstad}
      scrollWheelZoom={false}
      style={{ height: 600, width: "80%" }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={syverstad}>
        <Popup>
          The place of the party! <br />
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.google.com/maps/place/Syverstad+g%C3%A5rd/@59.8767305,10.5743778,12z/data=!4m5!3m4!1s0x0:0xea4f84a8e23f63a1!8m2!3d59.8486471!4d10.4832363"
          >
            Open in Google Maps
          </a>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
