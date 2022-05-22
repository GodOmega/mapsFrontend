import React from "react";
import { MapContainer, TileLayer, Rectangle, Circle } from "react-leaflet";

import "leaflet/dist/leaflet.css";

const Map = ({lat, lng, perimeter}) => {


  return (
    <MapContainer
      center={[lat, lng]}
      zoom={17}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      { perimeter && <Rectangle bounds={perimeter} pathOptions={{ color: "yellow" }} />
 }

      <Circle
        center={[lat, lng]}
        pathOptions={{ color: "black" }}
      ></Circle>
    </MapContainer>
  );
};

export default Map;
