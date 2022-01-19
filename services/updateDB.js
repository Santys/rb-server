// Import model
const Book = require('../models/Book.model');
const User = require('../models/User.model');

const userCreateNewReview = async (review, idUser, idBook) => {
  const updatedUser = await User.findByIdAndUpdate(
    idUser,
    { $push: { reviews: review._id, books: idBook } },
    { new: true },
  );
  const updatedBook = await Book.findByIdAndUpdate(
    idBook,
    { $push: { reviews: review._id, users: idUser } },
    { new: true },
  );

  // Calculate rating => newRating = oldRating + (nrating - oldRating)/reviews
  const newRating = updatedBook.rating + (review.rate - updatedBook.rating) / updatedBook.reviews.length;

  const updatedRateBook = await Book.findByIdAndUpdate(updatedBook._id, { rating: newRating }, { new: true });

  return { status: 200, data: { updatedRateBook, updatedUser } };
};

module.exports = { userCreateNewReview };
