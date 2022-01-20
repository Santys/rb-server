// Import model
const Book = require('../models/Book.model');
const User = require('../models/User.model');

//Import services
const bookServices = require('../services/book');
const reviewServices = require('../services/review');

const userCreateNewReview = async (owner, content, rate, idUser, idApi) => {
  const targetedBookQuery = await bookServices.getBookByIdApiOrCreateBook(idApi);
  if (targetedBookQuery.status !== 200) {
    return res.status(targetedBookQuery.status).json({ errorMessage: 'Bad request' });
  }
  const targetedBook = targetedBookQuery.data;
  const newReviewQuery = await reviewServices.createReview(owner, content, rate, idUser, targetedBook._id);
  if (newReviewQuery.status !== 200) {
    return res.status(newReviewQuery.status).json({ errorMessage: 'Bad request' });
  }
  const review = newReviewQuery.data;

  const updatedUser = await User.findByIdAndUpdate(
    idUser,
    { $push: { reviews: review._id, books: targetedBook._id } },
    { new: true },
  );
  const updatedBook = await Book.findByIdAndUpdate(
    targetedBook._id,
    { $push: { reviews: review._id, users: idUser } },
    { new: true },
  );

  // Calculate rating => newRating = oldRating + (nrating - oldRating)/reviews
  const newRating = updatedBook.rating + (review.rate - updatedBook.rating) / updatedBook.reviews.length;

  const updatedRateBook = await Book.findByIdAndUpdate(updatedBook._id, { rating: newRating }, { new: true });

  return { status: 200, data: { updatedRateBook, updatedUser } };
};

const userDeleteReview = async (review, idUser) => {
  const targetedBook = await Book.findById(review.idBook);
  let updatedRateBook = {};
  if (targetedBook.reviews.length <= 1) {
    const deletedBook = await Book.findByIdAndDelete(review.idBook);
  } else {
    const newRating =
      (targetedBook.rating * targetedBook.reviews.length - review.rate) / (targetedBook.reviews.length - 1);
    updatedRateBook = await Book.findByIdAndUpdate(review.idBook, { rating: newRating }, { new: true });

    updatedRateBook = await Book.findByIdAndUpdate(
      review.idBook,
      { $pull: { reviews: { $in: review._id }, users: { $in: idUser } } },
      { new: true },
    );
  }
  const updatedUser = await User.findByIdAndUpdate(
    idUser,
    { $pull: { reviews: { $in: review._id }, books: { $in: review.idBook } } },
    { new: true },
  );

  const deletedReviewQuery = await reviewServices.deleteReview(review._id);
  if (deletedReviewQuery.status !== 200) {
    return res.status(deletedReviewQuery.status).json({ errorMessage: 'Bad request' });
  }
  const deletedReview = deletedReviewQuery.data;
  return { status: 200, data: { deletedReview, updatedUser, updatedRateBook } };
};

const userModifyReview = async (content, rate, idReview) => {
  const newReview = { content, rate };
  const oldReviewQuery = await reviewServices.getReview(idReview);
  if (oldReviewQuery.status !== 200) {
    return res.status(oldReviewQuery.status).json({ errorMessage: 'Error updating review' });
  }
  const oldReview = oldReviewQuery.data;

  const bookToUpdate = await Book.findById(oldReview.idBook);
  let newRating = rate;
  if (bookToUpdate.reviews.length > 1) {
    const modifyRatingByDeletingOldOne =
      (bookToUpdate.rating * bookToUpdate.reviews.length - oldReview.rate) / (bookToUpdate.reviews.length - 1);
    newRating = modifyRatingByDeletingOldOne + (rate - modifyRatingByDeletingOldOne) / bookToUpdate.reviews.length;
  }

  const updatedRateBook = await Book.findByIdAndUpdate(bookToUpdate._id, { rating: newRating }, { new: true });

  const updatedReviewQuery = await reviewServices.updateReview(idReview, newReview);
  if (updatedReviewQuery.status !== 200) {
    return res.status(updatedReviewQuery.status).json({ errorMessage: 'Error updating review' });
  }
  const updatedReview = updatedReviewQuery.data;
  return { status: 200, data: { updatedRateBook, updatedReview } };
};

module.exports = { userCreateNewReview, userDeleteReview, userModifyReview };
