// ============== posts ============== //
const endpoint = "localhost:4000";

// Get all posts - HTTP Method: GET
async function getArtists() {
  const response = await fetch(`${endpoint}/artists.json`); // fetch request, (GET)
  const data = await response.json(); // parse JSON to JavaScript
  const artists = prepareData(data); // convert object of object to array of objects
  return artists; // return posts
}

// Create a new post - HTTP Method: POST
async function createArtist(name, birthdate, activeSince) {
  const newArtist = { title, body, image }; // create new post object
  const json = JSON.stringify(newArtist); // convert the JS object to JSON string
  // POST fetch request with JSON in the body
  const response = await fetch(`${endpoint}/artist.json`, {
    method: "POST",
    body: json,
  });
  return response;
}

// Update an existing post - HTTP Method: DELETE
async function deletePost(id) {
  const response = await fetch(`${endpoint}/posts/${id}.json`, {
    method: "DELETE",
  });
  return response;
}

// Delete an existing post - HTTP Method: PUT
async function updatePost(id, title, body, image) {
  const postToUpdate = { title, body, image }; // post update to update
  const json = JSON.stringify(postToUpdate); // convert the JS object to JSON string
  // PUT fetch request with JSON in the body. Calls the specific element in resource
  const response = await fetch(`${endpoint}/posts/${id}.json`, {
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

export { getArtists, createPost, updatePost, deletePost };
