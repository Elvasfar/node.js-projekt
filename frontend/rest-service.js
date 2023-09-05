// ============== posts ============== //
const endpoint = "http://localhost:4000";
const headers = { "Content-Type": "application/json" };

// Get all posts - HTTP Method: GET
async function getArtists() {
  const response = await fetch(`${endpoint}/artists`); // fetch request, (GET)
  const artists = await response.json(); // parse JSON to JavaScript; // convert object of object to array of objects
  return artists; // return posts
}

// Create a new post - HTTP Method: POST
async function addArtist(name, birthdate, activeSince, genres, labels, website, image, shortDescription) {
  const newArtist = { name, birthdate, activeSince, genres, labels, website, image, shortDescription }; // create new post object
  const json = JSON.stringify(newArtist); // convert the JS object to JSON string
  // POST fetch request with JSON in the body
  const response = await fetch(`${endpoint}/artists`, {
    headers: headers,
    method: "POST",
    body: json,
  });
  return response;
}

// Update an existing post - HTTP Method: DELETE
async function deleteArtist(id) {
  const response = await fetch(`${endpoint}/artists/${id}`, {
    method: "DELETE",
  });
  return response;
}

// Delete an existing post - HTTP Method: PUT
async function updateArtist(id, name, birthdate, activeSince, genres, labels, website, image, shortDescription) {
  const artistToUpdate = { name, birthdate, activeSince, genres, labels, website, image, shortDescription }; // post update to update
  const json = JSON.stringify(artistToUpdate); // convert the JS object to JSON string
  // PUT fetch request with JSON in the body. Calls the specific element in resource
  const response = await fetch(`${endpoint}/artists/${id}`, {
    method: "PUT",
    body: json,
  });
  // check if response is ok - if the response is successful
  return response;
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

export { getArtists, addArtist, updateArtist, deleteArtist };
