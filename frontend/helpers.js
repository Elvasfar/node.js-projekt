function compareName(artist1, artist2) {
  return artist1.name.localeCompare(artist2.name);
}

function compareGenres(artist1, artist2) {
  return artist1.genres.localeCompare(artist2.genres);
}

// convert object of objects til an array of objects
function prepareData(dataObject) {
  const array = []; // define empty array
  // loop through every key in dataObject
  // the value of every key is an object
  for (const key in dataObject) {
    const object = dataObject[key]; // define object
    object.id = key; // add the key in the prop id
    array.push(object); // add the object to array
  }
  return array; // return array back to "the caller"
}

export { compareName, compareGenres, prepareData };
