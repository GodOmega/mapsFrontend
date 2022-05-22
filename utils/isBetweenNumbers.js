export const isBetweenNumbers = (value, max, min) => {
  if (value >= min && value <= max) {
    return true;
  }

  return false
};
