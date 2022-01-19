const { Schema, model } = require("mongoose");

const reviewSchema = new Schema({
  owner: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  idBook: { type: Schema.Types.ObjectId, ref: "Book" },
  idUser: { type: Schema.Types.ObjectId, ref: "User" },
});

const Review = model("Review", reviewSchema);

module.exports = Review;
