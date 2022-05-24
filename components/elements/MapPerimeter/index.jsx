import React from "react";
import {
  MapContainer,
  TileLayer,
  Rectangle,
  FeatureGroup,
} from "react-leaflet";
import { DraftControl } from "react-leaflet-draft-nextjs";

import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet/dist/leaflet.css";

const MapPerimeter = ({ lat, lng, perimeter, createPerimeter, deletePerimeter, oldPerimeter }) => {

  if(!lat && !lng) {
      return ''
  }

  return (
    <MapContainer center={[lat, lng]} zoom={17} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FeatureGroup>
        <DraftControl
          draw={{
            rectangle: true,
            polygon: false,
            polyline: false,
          }}
          onCreated={createPerimeter}
        //   onEdited={handleUpdatePerimeter}
          onDeleted={deletePerimeter}
          position="topright"
        />
      </FeatureGroup>

      {oldPerimeter && !perimeter && (
          <Rectangle bounds={oldPerimeter} pathOptions={{ color: "yellow" }} />
      )}
    </MapContainer>
  );
};

export default MapPerimeter;
