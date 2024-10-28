const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
  },
});

const Note = mongoose.model("Note", notesSchema);

module.exports = Note;
