const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  books: [{ type: Schema.Types.ObjectId, ref: "Book" }],
});

const User = model("User", userSchema);

module.exports = User;
