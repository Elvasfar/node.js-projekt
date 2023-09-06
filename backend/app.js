import http from "node:http";
import fs from "fs/promises";
import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());

app.use(cors());
app.listen(4000, () => {
  console.log("Server started on port 4000");
});

let artists = []; // Initialize an empty array to store artists
let favorites = [];
// Read and parse the JSON data from the file
fs.readFile("data/artists.json", "utf-8").then((data) => {
  artists = JSON.parse(data).artists; // Parse the JSON data and store it in the artists array
});

app.get("/", (req, res) => {
  res.send("Hello, artist-project!");
});

app.get("/artists", (req, res) => {
  res.json(artists);
});

app.post("/artists", (req, res) => {
  const artist = req.body; // req.body is already parsed as JSON
  artist.id = new Date().getTime();
  artists.push(artist);
  res.status(201).json(artist); // Respond with the added todo and status 201 Created
});

app.get("/artists/:artistId", (req, res) => {
  const artistId = parseInt(req.params.artistId); // Parse the ID from the URL parameter
  const artistById = artists.find((artist) => artist.id === artistId); // Use a function to match the todo by its ID
  console.log(artistById);
  if (artistById) {
    res.json(artistById);
  } else {
    res.status(404).json({ error: "Artist not found" }); // Respond with a 404 status if artist is not found
  }
});

app.put("/artists/:artistId", (req, res) => {
  const updateArtistId = parseInt(req.params.artistId);
  const updatedArtist = req.body;
  console.log(updatedArtist);
  console.log(updateArtistId);

  const artistIndex = artists.findIndex((artist) => artist.id === updateArtistId);

  if (artistIndex !== -1) {
    // Check if the todo was found
    artists[artistIndex] = { ...artists[artistIndex], ...updatedArtist }; // Update properties
    res.json(artists);
  } else {
    res.status(404).json({ error: "Artist not found" });
  }
});

app.delete("/artists/:artistId", (req, res) => {
  const deleteArtistId = parseInt(req.params.artistId);
  const artistIndex = artists.findIndex((artist) => artist.id === deleteArtistId);
  if (artistIndex !== -1) {
    // Check if the artist was found
    artists.splice(artistIndex, 1); // Remove the artist from the array
    res.json(artists);
  } else {
    res.status(404).json({ error: "Artist not found" });
  }
});

app.get("/artists/favorites", (req, res) => {
  res.json(favorites);
});
