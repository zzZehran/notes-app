const express = require("express");
const app = express();

const mongoose = require("mongoose");
const ejs = require("ejs");
const ejsMate = require("ejs-mate");
const path = require("path");

const Note = require("./models/notesModel");

app.set("view engine", "ejs");
app.engine("ejs", ejsMate);

app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose
  .connect("mongodb://127.0.0.1:27017/notes")
  .then(() => console.log("Connected to mongodb"))
  .catch((err) => console.log(err.message));

app.get("/", async (req, res) => {
  const allNotes = await Note.find({});
  const note = null;
  res.render("homePage", { allNotes, note });
});

app.post("/new", async (req, res) => {
  const { title, body } = req.body;
  const newNote = new Note({ title, body });
  await newNote.save();
  res.redirect("/");
});

app.patch("/new/:id", async (req, res) => {
  const { id } = req.params; // Get note ID from URL
  const { title, body } = req.body; // Get updated title and body from request body

  try {
    // Find the note by ID and update it with the new title and body
    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { title, body },
      { new: true } // Option to return the updated document
    );

    if (!updatedNote) {
      return res.status(404).send("Note not found");
    }

    res.send(updatedNote); // Send the updated note back as a response
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).send("Failed to update note");
  }
});

app.get("/notes/:id", async (req, res) => {
  const { id } = req.params;
  const note = await Note.findById(id);
  res.send(note);
});

app.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  const note = await Note.findByIdAndDelete(id);
  res.send(note);
});

app.listen(3000, () => {
  console.log("On port 3000");
});
