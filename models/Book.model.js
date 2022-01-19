const { Schema, model } = require("mongoose");

const bookSchema = new Schema({
  title: {
    type: String,
    unique: true,
    required: true,
  },
  author: {
    type: [String],
    required: true,
  },
  cover: {
    type: String,
    required: true,
  },
  idApi: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const Book = model("Book", bookSchema);

module.exports = Book;
