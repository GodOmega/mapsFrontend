import { useState, useEffect } from "react";

const useCurrentLocation = () => {
  const [currentLocation, setCurrentLocation] = useState(null);

  const error = (error) => {
    console.error(error);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      setCurrentLocation({
        lat: coords.latitude,
        lng: coords.longitude,
      });
    }, error);
  }, [currentLocation]);

  return currentLocation;
};

export default useCurrentLocation;
