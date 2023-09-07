//-----Sort & Filter------//

function compareName(artist1, artist2) {
  return artist1.name.localeCompare(artist2.name);
}

function compareGenres(artist1, artist2) {
  // Join the genres arrays into strings
  const genres1 = Array.isArray(artist1.genres) ? artist1.genres.join(", ") : artist1.genres;
  const genres2 = Array.isArray(artist2.genres) ? artist2.genres.join(", ") : artist2.genres;

  // Compare the genres strings
  return genres1.localeCompare(genres2);
}

function parseDateString(dateString) {
  const [day, month, year] = dateString.split("/").map(Number);
  return new Date(year, month - 1, day); // Month is 0-based, so subtract 1 from the month
}

function dateToTimestamp(date) {
  return date.getTime();
}

function compareBirthdate(artist1, artist2) {
  const date1 = parseDateString(artist1.birthdate); // Extract birthdate from artist object
  const date2 = parseDateString(artist2.birthdate); // Extract birthdate from artist object
  const timestamp1 = dateToTimestamp(date1);
  const timestamp2 = dateToTimestamp(date2);

  return timestamp1 - timestamp2;
}

function compareAge(artist) {
  const birthdate = parseDateString(artist.birthdate); // Extract birthdate from artist object
  const today = new Date();
  const age = today.getFullYear() - birthdate.getFullYear();

  // Check if the artist's birthday has occurred this year
  const isBirthdayPassed =
    today.getMonth() > birthdate.getMonth() ||
    (today.getMonth() === birthdate.getMonth() && today.getDate() >= birthdate.getDate());

  return isBirthdayPassed ? age : age - 1;
}

export { compareName, compareGenres, compareBirthdate, compareAge };
