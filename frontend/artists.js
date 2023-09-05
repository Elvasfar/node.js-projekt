"use strict";

import { getArtists, addArtist, updateArtist, deleteArtist } from "./rest-service.js";

import { compareName, compareGenres, prepareData } from "./helpers.js";

let artists;

window.addEventListener("load", initApp);

function initApp() {
  updateArtistsGrid(); // update the grid of posts: get and show all posts

  // event listener
  document.querySelector("#btn-create-artist").addEventListener("click", showAddArtistDialog);
  document.querySelector("#form-update-artist").addEventListener("submit", updateArtistClicked);
  document.querySelector("#form-add-artist").addEventListener("submit", addArtistClicked);
  document.querySelector("#form-delete-artist").addEventListener("submit", deleteArtistClicked);
  document.querySelector("#form-delete-artist .btn-cancel").addEventListener("click", deleteCancelClicked);
  document.querySelector("#select-sort-by").addEventListener("change", sortByChanged);
  document.querySelector("#input-search").addEventListener("keyup", inputSearchChanged);
  document.querySelector("#input-search").addEventListener("search", inputSearchChanged);
}

// ============== events ============== //

function showAddArtistDialog() {
  document.querySelector("#dialog-add-artist").showModal(); // show create dialog
}

async function updateArtistsGrid() {
  artists = await getArtists(); // get posts from rest endpoint and save in variable
  showArtists(artists); // show all posts (append to the DOM) with posts as argument
}

async function addArtistClicked(event) {
  const form = event.target; // or "this"
  // extract the values from inputs from the form
  const name = form.name.value;
  const birthdate = form.birthdate.value;
  const activeSince = form.activeSince.value;
  const genres = form.genres.value;
  const labels = form.labels.value;
  const website = form.website.value;
  const image = form.image.value;
  const shortDescription = form.shortDescription.value;

  const response = await addArtist(name, birthdate, activeSince, genres, labels, website, image, shortDescription);
  if (response.ok) {
    updateArtistsGrid();
  } // use values to create a new post
  form.reset(); // reset the form (clears inputs)
}

async function updateArtistClicked(event) {
  const form = event.target; // or "this"
  // extract the values from inputs in the form
  const name = form.name.value;
  const birthdate = form.birthdate.value;
  const activeSince = form.activeSince.value;
  const genres = form.genres.value;
  const labels = form.labels.value;
  const website = form.website.value;
  const image = form.image.value;
  const shortDescription = form.shortDescription.value;
  // get id of the post to update - saved in data-id
  const id = form.getAttribute("data-id");
  const response = await updateArtist(
    id,
    name,
    birthdate,
    activeSince,
    genres,
    labels,
    website,
    image,
    shortDescription
  );
  if (response.ok) {
    updateArtistsGrid();
  } // call updatePost with arguments
}

async function deleteArtistClicked(event) {
  const id = event.target.getAttribute("data-id"); // event.target is the delete form
  const response = await deleteArtist(id);
  if (response.ok) {
    updateArtistsGrid();
  } // call deletePost with id
}

function deleteCancelClicked() {
  document.querySelector("#dialog-delete-artist").close(); // close dialog
}

async function sortByChanged(event) {
  const selectedValue = event.target.value;

  if (selectedValue === "name") {
    artists.sort(await compareName);
  } else if (selectedValue === "genre") {
    artists.sort(await compareGenres);
  }

  showArtists(artists);
}

function inputSearchChanged(event) {
  const value = event.target.value;
  const artistsToShow = searchArtists(value);
  showArtists(artistsToShow);
}

function showArtists(listOfArtists) {
  document.querySelector("#artists").innerHTML = ""; // reset the content of section#posts

  for (const artist of listOfArtists) {
    showArtist(artist); // for every post object in listOfPosts, call showPost
  }
}

function showArtist(artistObject) {
  const html = /*html*/ `
        <article class="grid-item">
            <img src="${artistObject.image}" />
            <h3>${artistObject.name}</h3>
            <p>${artistObject.birthdate}</p>
            <p>${artistObject.genres}</p>
            <div class="btns">
                <button class="btn-delete">Delete</button>
                <button class="btn-update">Update</button>
            </div>
        </article>
    `; // html variable to hold generated html in backtick
  document.querySelector("#artists").insertAdjacentHTML("beforeend", html); // append html to the DOM - section#posts

  // add event listeners to .btn-delete and .btn-update
  document
    .querySelector("#artists article:last-child .btn-delete")
    .addEventListener("click", () => deleteClicked(artistObject));
  document
    .querySelector("#artists article:last-child .btn-update")
    .addEventListener("click", () => updateClicked(artistObject));
}

// called when delete button is clicked
function deleteClicked(artistObject) {
  // show name of post you want to delete
  document.querySelector("#dialog-delete-artist-title").textContent = artistObject.name;
  // set data-id attribute of post you want to delete (... to use when delete)
  document.querySelector("#form-delete-artist").setAttribute("data-id", artistObject.id);
  // show delete dialog
  document.querySelector("#dialog-delete-artist").showModal();
}

// called when update button is clicked
function updateClicked(artistObject) {
  const updateForm = document.querySelector("#form-update-artist"); // reference to update form in dialog
  updateForm.name.value = artistObject.name; // set title input in update form from post title
  updateForm.birthdate.value = artistObject.birthdate; // set body input in update form post body
  updateForm.activeSince.value = artist.activeSince; // set image input in update form post image
  updateForm.genres.value = artistObject.genres; // set title input in update form from post title
  updateForm.labels.value = artistObject.labels; // set title input in update form from post title
  updateForm.website.value = artistObject.website; // set title input in update form from post title
  updateForm.image.value = artistObject.image; // set title input in update form from post title
  updateForm.shortDescription.value = artistObject.shortDescription; // set title input in update form from post title

  updateForm.setAttribute("data-id", artistObject.id); // set data-id attribute of post you want to update (... to use when update)
  document.querySelector("#dialog-update-artist").showModal(); // show update modal
}

function searchArtists(searchValue) {
  searchValue = searchValue.toLowerCase();

  return artists.filter((artist) => artist.title.toLowerCase().includes(searchValue));
}
