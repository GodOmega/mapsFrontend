import { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Rectangle,
  Circle,
} from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

import {
  joinWork,
  disconnectOfWork,
  socket,
  sendMessage,
  getClientsOnline
} from "../services/socket.service";

import useCurrentLocation from "../hooks/useCurrentLocation";
import verifyPerimeter from "../utils/verifyPerimeter";
import styles from "./style.module.css";

const map = () => {
  const audioElement = useRef(null);
  const currentLocation = useCurrentLocation();
  const [userPosition, setUserPosition] = useState(null);
  const [rectangle, setRectangle] = useState(null);

  const [isOn, setIsOn] = useState(false);
  const [isIn, setIsIn] = useState(false);
  const [volumen, setVolumen] = useState(0);
  const [perimeter, setPerimeter] = useState(null);

  const options = {
    enableHighAccuracy: true,
    timeout: 8000,
  };

  const error = (error) => {
    console.error(error);
  };

  const handlerUserPosition = ({ coords }) => {
    const newPosition = {
      lat: coords.latitude,
      lng: coords.longitude,
    };
    setUserPosition((preState) => {
      if (preState) {
        if (newPosition) {
          testVerify(newPosition);
        }
      }
      return newPosition;
    });
  };

  const testVerify = (data) => {
    if (perimeter) {
      console.log(perimeter);
      const isInPerimter = verifyPerimeter(data, perimeter);
      setIsIn(isInPerimter);
      if (!isInPerimter && socket) {
        handleDisconnectOfWork();
      }
    }
  };

  const handleConnectToWork = async () => {
    console.log(perimeter);
    const isInPerimter = verifyPerimeter(userPosition, perimeter);
    setVolumen(0.01);
    audioElement.current.play();
    try {
      if (isInPerimter) {
        joinWork("1231k", {entepriseId: 1, employeId: 1});
        setIsOn(true);
        return true;
      }
      setIsOn(false);
      return alert("no estas en perimetro");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDisconnectOfWork = () => {
    disconnectOfWork();
    alert("Disconnected");
    setIsOn(false);
  };

  const handleGetClientsOnline = () => {
    getClientsOnline()
  }

  const handleMessage = () => {
    sendMessage("message");
  };

  useEffect(() => {
    navigator.geolocation.watchPosition(handlerUserPosition, error, options);

    if (!perimeter) {
      axios.get("http://localhost:3001/enterprises/1").then(({ data }) => {
        if (data.coords) {
          const coords = JSON.parse(data.coords);
          setRectangle(coords);

          const [north, south] = coords;
          setPerimeter({
            north: { lat: north[0], lng: north[1] },
            south: { lat: south[0], lng: south[1] },
          });
        }
      });
    }

    // const interval = setInterval(handleMessage, 5000);

    // return () => clearTimeout(interval);
  }, [perimeter]);

  if (!userPosition || !currentLocation || !rectangle) {
    return "is loading";
  }

  if (audioElement.current) {
    audioElement.current.volume = volumen;
  }

  return (
    <>
      <audio
        ref={audioElement}
        src="https://mus.mimusicacristiana.net/top40/Bizarrap%20-%20Paulo%20Londra%20Bzrp%20Music%20Sessions,%20Vol.%2023.mp3"
        autoPlay
        loop
        controls
      ></audio>
      <p>Longitud: {userPosition?.lng}</p>
      <p>Lactitud: {userPosition?.lat}</p>
      {isOn && <h4 style={{ color: "green" }}>Estas conectado</h4>}
      <p>In: {`${isIn}`}</p>
      {!isOn && (
        <button onClick={handleConnectToWork} className={styles.button}>
          Conectar
        </button>
      )}
      {isOn && (
        <button onClick={handleGetClientsOnline} >Clientes online</button>
      )}  

      {isOn && (
        <button onClick={handleDisconnectOfWork} className={styles.button}>
          Desconectar
        </button>
      )}

      <div className={styles.container}>
        <MapContainer
          center={[userPosition.lat, userPosition.lng]}
          zoom={17}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Rectangle bounds={rectangle} pathOptions={{ color: "yellow" }} />

          <Circle
            center={[userPosition.lat, userPosition.lng]}
            pathOptions={{ color: "black" }}
          ></Circle>
        </MapContainer>
      </div>
    </>
  );
};

export default map;
