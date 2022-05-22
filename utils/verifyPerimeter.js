import { isBetweenNumbers } from "./isBetweenNumbers";
import { maxAndMinNumber } from "./maxAndMinNumber";

export default (userPosition, perimeter) => {
  const { north, south } = perimeter;
  if(userPosition){
    const { lat, lng } = userPosition;

    const latitudes = maxAndMinNumber(north.lat, south.lat);
    const longitudes = maxAndMinNumber(north.lng, south.lng);

    const inLat = isBetweenNumbers(lat, latitudes.max, latitudes.min);
    const inLng = isBetweenNumbers(lng, longitudes.max, longitudes.min);

    if (inLng && inLat) {
      return true;
    }

    return false;
  }
};
