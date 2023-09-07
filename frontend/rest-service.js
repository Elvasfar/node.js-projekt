// ============== artists ============== //
const endpoint = "http://localhost:4000";
const headers = { "Content-Type": "application/json" };

// Get all artists - HTTP Method: GET
async function getArtists() {
  const response = await fetch(`${endpoint}/artists`); // fetch request, (GET)
  const artists = await response.json(); // parse JSON to JavaScript; // convert object of object to array of objects
  return artists; // return artists
}

// Create a new artists - HTTP Method: POST
async function addArtist(name, birthdate, activeSince, genres, labels, website, image, shortDescription) {
  const newArtist = { name, birthdate, activeSince, genres, labels, website, image, shortDescription }; // create new artist object
  const json = JSON.stringify(newArtist); // convert the JS object to JSON string
  // POST fetch request with JSON in the body
  const response = await fetch(`${endpoint}/artists`, {
    headers: headers,
    method: "POST",
    body: json,
  });
  return response;
}

// Delete an existing artist - HTTP Method: DELETE
async function deleteArtist(id) {
  const response = await fetch(`${endpoint}/artists/${id}`, {
    headers: headers,
    method: "DELETE",
  });
  return response;
}

// Update an existing artist - HTTP Method: PUT
async function updateArtist(id, name, birthdate, activeSince, genres, labels, website, image, shortDescription) {
  const artistToUpdate = { name, birthdate, activeSince, genres, labels, website, image, shortDescription }; // artist update to update
  const json = JSON.stringify(artistToUpdate); // convert the JS object to JSON string
  // PUT fetch request with JSON in the body. Calls the specific element in resource
  const response = await fetch(`${endpoint}/artists/${id}`, {
    headers: headers,
    method: "PUT",
    body: json,
  });
  // check if response is ok - if the response is successful
  return response;
}

export { getArtists, addArtist, updateArtist, deleteArtist };
