"use strict";

import { getArtists, addArtist, updateArtist, deleteArtist } from "./rest-service.js";
import { compareName, compareGenres, compareBirthdate, compareAge } from "./helpers.js";

let artists;
let filteredArtists;
const favorites = [];

window.addEventListener("load", initApp);

async function initApp() {
  await updateArtistsGrid();
  setupEventListeners();
}

async function updateArtistsGrid() {
  artists = await getArtists();
  filteredArtists = [...artists]; // Initialize filteredArtists with all artists
  renderArtists();
}

function setupEventListeners() {
  document.querySelector("#btn-create-artist").addEventListener("click", showAddArtistDialog);
  document.querySelector("#form-update-artist").addEventListener("submit", updateArtistClicked);
  document.querySelector("#form-add-artist").addEventListener("submit", addArtistClicked);
  document.querySelector("#form-delete-artist").addEventListener("submit", deleteArtistClicked);
  document.querySelector("#form-delete-artist .btn-cancel").addEventListener("click", deleteCancelClicked);
  document.querySelector("#select-sort-by").addEventListener("change", sortByChanged);
  document.querySelector("#input-search").addEventListener("keyup", inputSearchChanged);
  document.querySelector("#input-search").addEventListener("search", inputSearchChanged);
  document.querySelector("#filter-by").addEventListener("change", filterByChanged);
  document.querySelector("#btn-favorites").addEventListener("click", redirectToFavorites);
  document.querySelector("#btn-home").addEventListener("click", redirectToHome);
  document.querySelector("#artists").addEventListener("click", (event) => {
    const artistElement = event.target.closest(".grid-item");
    if (
      artistElement &&
      !event.target.classList.contains("btn-delete") &&
      !event.target.classList.contains("btn-update") &&
      !event.target.classList.contains("favorite-btn")
    ) {
      const artistIndex = [...artistElement.parentElement.children].indexOf(artistElement);
      const clickedArtist = filteredArtists[artistIndex];
      artistClicked(clickedArtist);
    }
  });
  const closeButton = document.querySelector("#close-button");
  closeButton.addEventListener("click", function () {
    const dialog = document.querySelector("#artistDetailedView");
    dialog.close();
  });
}

function showAddArtistDialog() {
  document.querySelector("#dialog-add-artist").showModal();
}

async function addArtistClicked(event) {
  const form = event.target; // or "this"
  // extract the values from inputs from the form
  const name = form.name.value;
  const birthdate = form.birthdate.value;
  const activeSince = form.activeSince.value;
  const genres = form.genre.value;
  const labels = form.labels.value;
  const website = form.website.value;
  const image = form.image.value;
  const shortDescription = form.description.value;

  const response = await addArtist(name, birthdate, activeSince, genres, labels, website, image, shortDescription);
  if (response.ok) {
    updateArtistsGrid();
  } // use values to create a new artist
  form.reset(); // reset the form (clears inputs)
}

async function updateArtistClicked(event) {
  const form = event.target; // or "this"
  // extract the values from inputs in the form
  const name = form.elements["name-update"].value;
  const birthdate = form.elements["birthdate-update"].value;
  const activeSince = form.elements["activeSince-update"].value;
  const genres = form.elements["genre-update"].value;
  const labels = form.elements["labels-update"].value;
  const website = form.elements["website-update"].value;
  const image = form.elements["image-update"].value;
  const shortDescription = form.elements["description-update"].value;
  // get id of the artist to update - saved in data-id
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
  } // call updateArtists with arguments
}

async function deleteArtistClicked(event) {
  const id = event.target.getAttribute("data-id"); // event.target is the delete form
  const response = await deleteArtist(id);
  if (response.ok) {
    updateArtistsGrid();
  } // call deleteArtist with id
}

function deleteCancelClicked() {
  document.querySelector("#dialog-delete-artist").close();
}

async function sortByChanged(event) {
  const selectedValue = event.target.value;

  if (selectedValue === "name") {
    filteredArtists.sort(compareName);
  } else if (selectedValue === "genre") {
    filteredArtists.sort(compareGenres);
  } else if (selectedValue === "birthdate") {
    filteredArtists.sort(compareBirthdate);
  }

  renderArtists();
}

function filterByChanged(event) {
  const selectedValue = event.target.value;

  if (selectedValue === "rockartists") {
    filteredArtists = artists.filter((artist) => artist.genres.includes("Rock"));
  } else if (selectedValue === "countryartists") {
    filteredArtists = artists.filter((artist) => artist.genres.includes("Country"));
  } else if (selectedValue === "popartists") {
    filteredArtists = artists.filter((artist) => artist.genres.includes("Pop"));
  } else if (selectedValue === "bluesartists") {
    filteredArtists = artists.filter((artist) => artist.genres.includes("Blues"));
  } else if (selectedValue === "youngartists") {
    filteredArtists = artists.filter((artist) => compareAge(artist) < 73);
  } else if (selectedValue === "oldartists") {
    filteredArtists = artists.filter((artist) => compareAge(artist) >= 73);
  } else if (selectedValue === "selectfilter") {
    filteredArtists = [...artists]; // Reset to all artists
  }

  renderArtists();
}

function inputSearchChanged(event) {
  const value = event.target.value;
  const artistsToShow = searchArtists(value);
  filteredArtists = artistsToShow;
  renderArtists();
}

function searchArtists(searchValue) {
  searchValue = searchValue.toLowerCase();
  return artists.filter((artist) => artist.name.toLowerCase().includes(searchValue));
}

function renderArtists() {
  const artistsContainer = document.querySelector("#artists");
  artistsContainer.innerHTML = "";

  for (const artist of filteredArtists) {
    showArtist(artist, artistsContainer);
  }
}

function showArtist(artist, container) {
  const isFavorite = favorites.includes(artist);

  const html = /*html*/ `
    <article class="grid-item">
      <img src="${artist.image}" />
      <h3>${artist.name}</h3>
      <p>${artist.birthdate}</p>
      <p>${artist.genres}</p>
      <div class="btns">
        <button class="btn-delete">Delete</button>
        <button class="btn-update">Update</button>
        <span class="favorite-btn" style="color: ${isFavorite ? "red" : "black"}">&#9825;</span> <!-- Heart symbol -->
      </div>
    </article>
  `;

  container.insertAdjacentHTML("beforeend", html);

  // Get the newly added grid-item
  const gridItem = container.lastElementChild;

  // Attach event listeners to delete and update buttons for this artist
  const deleteButton = gridItem.querySelector(".btn-delete");
  const updateButton = gridItem.querySelector(".btn-update");
  const favoriteButton = gridItem.querySelector(".favorite-btn"); // Heart symbol

  deleteButton.addEventListener("click", () => deleteClicked(artist));
  updateButton.addEventListener("click", () => updateClicked(artist));

  // Add event listener to toggle favorite status and add/remove from the "favorites" array
  favoriteButton.addEventListener("click", () => {
    if (isFavorite) {
      // Remove from favorites
      const index = favorites.indexOf(artist);
      if (index !== -1) {
        favorites.splice(index, 1);
      }
      favoriteButton.style.color = "black"; // Change the heart to empty
    } else {
      // Add to favorites
      favorites.push(artist);
      favoriteButton.style.color = "red"; // Change the heart to red
      console.log(favorites);
    }
  });
}

// called when delete button is clicked
function deleteClicked(artist) {
  // show name of artist you want to delete
  document.querySelector("#dialog-delete-artist-name").textContent = artist.name;
  // set data-id attribute of artist you want to delete (... to use when delete)
  document.querySelector("#form-delete-artist").setAttribute("data-id", artist.id);
  // show delete dialog
  document.querySelector("#dialog-delete-artist").showModal();
}

// called when update button is clicked
function updateClicked(artist) {
  const updateForm = document.querySelector("#form-update-artist"); // reference to update form in dialog
  updateForm.elements["name-update"].value = artist.name || "";
  updateForm.elements["birthdate-update"].value = artist.birthdate || "";
  updateForm.elements["activeSince-update"].value = artist.activeSince || "";
  updateForm.elements["genre-update"].value = artist.genres || "";
  updateForm.elements["labels-update"].value = artist.labels || "";
  updateForm.elements["website-update"].value = artist.website || "";
  updateForm.elements["image-update"].value = artist.image || "";
  updateForm.elements["description-update"].value = artist.shortDescription || "";

  updateForm.setAttribute("data-id", artist.id || "");
  document.querySelector("#dialog-update-artist").showModal(); // show update modal
}

function artistClicked(artist) {
  var dialog = document.querySelector("#artistDetailedView");
  document.querySelector("#dialog-header").textContent = artist.name;
  document.querySelector("#artist-image").src = artist.image;

  // Render HTML elements using innerHTML
  document.querySelector("#artist-birthdate").innerHTML = "<strong>Birthdate: </strong>" + artist.birthdate;

  // Check if artist.activeSince is defined before converting to string
  if (artist.activeSince !== undefined && artist.activeSince !== null) {
    document.querySelector("#artist-activeSince").innerHTML =
      "<strong>Active since: </strong>" + artist.activeSince.toString();
  } else {
    document.querySelector("#artist-activeSince").textContent = ""; // Set it to an empty string if not defined
  }

  document.querySelector("#artist-genres").innerHTML = "<strong>Genres: </strong>" + artist.genres;
  document.querySelector("#artist-labels").innerHTML = "<strong>Labels: </strong>" + artist.labels;
  document.querySelector("#artist-website").innerHTML = "<strong>Website: </strong>" + artist.website;
  document.querySelector("#artist-shortDescription").innerHTML =
    "<strong>Description: </strong>" + artist.shortDescription;

  if (!dialog.open) {
    dialog.showModal();
    dialog.scrollTop = 0;
  }
}

function redirectToFavorites() {
  // Clear the artists container
  const artistsContainer = document.querySelector("#artists");
  artistsContainer.innerHTML = "";

  // Render the favorites
  showFavoriteArtists(favorites, artistsContainer);

  // You can also update the URL to reflect the change
  window.history.pushState({ page: "favorites" }, "Favorites", "/endpoint/artists/favorites");
}

function redirectToHome() {
  const favoritesContainer = document.querySelector("#favorites");
  favoritesContainer.innerHTML = ""; // Clear the favorites section, but keep the selections

  // Render the artists
  renderArtists();

  // Update the URL
  window.history.pushState({ page: "home" }, "Home", "/endpoint/artists");
}

function showFavoriteArtists(favoriteArtists, container) {
  const favoritesContainer = document.querySelector("#favorites");
  favoritesContainer.innerHTML = "";

  for (const artist of favoriteArtists) {
    const html = /*html*/ `
    <article class="grid-item">
      <img src="${artist.image}" />
      <h3>${artist.name}</h3>
      <p>${artist.birthdate}</p>
      <p>${artist.genres}</p>
      <div class="btns">
        <button class="btn-delete">Delete</button>
        <button class="btn-update">Update</button>
      </div>
    </article>
  `;

    container.insertAdjacentHTML("beforeend", html);

    // Get the newly added grid-item
    const gridItem = container.lastElementChild;

    // Attach event listeners to delete and update buttons for this artist
    const deleteButton = gridItem.querySelector(".btn-delete");
    const updateButton = gridItem.querySelector(".btn-update");

    deleteButton.addEventListener("click", () => deleteClicked(artist));
    updateButton.addEventListener("click", () => updateClicked(artist));
  }
}
