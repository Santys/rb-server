// Import model
const Review = require('../models/Review.model');

const createReview = async (owner, content, rate, idUser, idBook) => {
  const result = await Review.create({
    owner,
    content,
    rate,
    idUser,
    idBook,
  });

  return { status: 200, data: result };
};

const getReview = async (id) => {
  const results = await Review.findById(id).populate('idUser');

  if (!results) {
    return { status: 404, data: { errorMessage: 'Review not found' } };
  }

  return { status: 200, data: results };
};

const getBookReviewByUserId = async (idBook, idUser) => {
  const result = await Review.find({ idBook, idUser });
  if (!result[0]) {
    return { status: 200, data: {} };
  }
  return { status: 200, data: result[0] };
};

const getBookReviewsExcludeUserId = async (idBook, idUser) => {
  const responseFromDB = await Review.find({ idBook });
  const results = responseFromDB.filter((review) => review.idUser != idUser);
  return { status: 200, data: results };
};

const updateReview = async (id, review) => {
  const updatedReview = await Review.findByIdAndUpdate(id, review, { new: true });
  return { status: 200, data: updatedReview };
};

const deleteReview = async (id) => {
  const deletedReview = await Review.findByIdAndDelete(id);
  return { status: 200, data: deletedReview };
};

module.exports = {
  createReview,
  getReview,
  getBookReviewByUserId,
  getBookReviewsExcludeUserId,
  updateReview,
  deleteReview,
};
