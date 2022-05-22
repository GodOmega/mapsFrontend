export default (name = null, lastname = null) => {
  if (name && lastname) {
    const nameFirstLetter = name[0].toUpperCase();
    const lastnameFirstLetter = lastname[0].toUpperCase();

    return `${nameFirstLetter}${lastnameFirstLetter}`;
  }

  return "";
};
