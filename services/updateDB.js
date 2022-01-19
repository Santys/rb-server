// Import model
const Book = require('../models/Book.model');
const User = require('../models/User.model');
const { updateBook } = require('./book');

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

const userDeleteReview = async (review, idUser) => {
  const updatedUser = await User.findByIdAndUpdate(
    idUser,
    { $pull: { reviews: { $in: review._id }, books: { $in: review.idBook } } },
    { new: true },
  );
  const updatedBook = await Book.findByIdAndUpdate(
    review.idBook,
    { $pull: { reviews: { $in: review._id }, users: { $in: idUser } } },
    { new: true },
  );
  if (updatedBook.reviews.length === 0) {
    const deletedBook = await Book.findByIdAndDelete(review.idBook);
  } else {
    //Calculate rating => newRating = (oldRating * nreviews - value) / (nReviews - 1)
    const newRating =
      (updatedBook.rating * (updatedBook.reviews.length + 1) - review.rate) / updatedBook.reviews.length;
    const updatedRateBook = await Book.findByIdAndUpdate(review.idBook, { rating: newRating }, { new: true });
    return { status: 200, data: { updatedRateBook, updatedUser } };
  }
  return { status: 200, data: { book: {}, updatedUser } };
};

module.exports = { userCreateNewReview, userDeleteReview };
