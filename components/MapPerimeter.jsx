import { useState, useEffect } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  Rectangle,
} from "react-leaflet";
import { DraftControl } from "react-leaflet-draft-nextjs";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import styles from "./style.module.css";
const MapPerimeter = () => {
  const [perimeter, setPerimeter] = useState(null);
  const [oldPerimeter, setOldPerimeter] = useState([]);
  const [currentPosition, setCurrentPosition] = useState([]);

  const [input, setInput] = useState(null);

  const error = (error) => {
    console.error(error);
  };

  const handleCreatePerimeter = (coords) => {
    const { _northEast, _southWest } = coords.layer._bounds;

    setPerimeter({
      north: _northEast,
      south: _southWest,
    });

    const inputCoords = JSON.stringify([
      [_northEast.lat, _northEast.lng],
      [_southWest.lat, _southWest.lng],
    ]);

    setInput({
      coords: inputCoords,
    });
  };

  const getPosition = ({ coords }) => {
    if (coords) {
      const { latitude, longitude } = coords;

      setCurrentPosition([latitude, longitude]);
    }
  };

  const handleUpdatePerimeter = (coords) => {
    console.log(coords);
  };

  const handleDeletePerimeter = () => {
    setPerimeter(null);
  };

  const handleClick = () => {
    axios
      .put("http://localhost:3001/enterprises/1", input)
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(getPosition, error);

    if (!oldPerimeter.length && oldPerimeter !== null) {
      axios.get("http://localhost:3001/enterprises/1").then(({ data }) => {
        if (data.coords) {
          const coords = JSON.parse(data.coords);
          setOldPerimeter(coords);
        }
      });
    }
  }, [oldPerimeter]);

  if (!currentPosition.length) {
    return "loading";
  }

  return (
    <>
      <button onClick={handleClick}>Save coords</button>
      <div className={styles.container}>
        <MapContainer zoom={17} scrollWheelZoom={true} center={currentPosition}>
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
              onCreated={handleCreatePerimeter}
              onEdited={handleUpdatePerimeter}
              onDeleted={handleDeletePerimeter}
              position="topright"
            />
          </FeatureGroup>

          {oldPerimeter.length && !perimeter && (
            <Rectangle bounds={oldPerimeter} pathOptions={{ color: "black" }} />
          )}
        </MapContainer>
      </div>
    </>
  );
};

export default MapPerimeter;
