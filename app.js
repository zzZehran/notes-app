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
  res.render("homePage", { allNotes });
});

app.post("/new", async (req, res) => {
  const { title, body } = req.body;
  const newNote = new Note({ title, body });
  await newNote.save();
  res.redirect("/");
});

app.get("/api/notes/:id", async (req, res) => {
  const { id } = req.params;
  const note = await Note.findById(id);
  res.send(note);
});

app.listen(3000, () => {
  console.log("On port 3000");
});
