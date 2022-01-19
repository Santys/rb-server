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

const updateReview = async (id, review) => {
  const updatedReview = await Review.findByIdAndUpdate(id, review);
  return { status: 200, data: updatedReview };
};

const deleteReview = async (id) => {
  const deletedReview = await Review.findByIdAndDelete(id);
  return { status: 200, data: deletedReview };
};

module.exports = { createReview, getReview, updateReview, deleteReview };
