const reviewServices = require('../services/review');
const bookServices = require('../services/book');
const userServices = require('../services/user');
const updateDBServices = require('../services/updateDB');

const createReview = async (req, res) => {
  if (
    !req.body.data ||
    !req.body.data.owner ||
    !req.body.data.content ||
    !req.body.data.rate ||
    !req.body.data.idUser ||
    !req.body.data.idApi
  ) {
    return res.status(400).json({ errorMessage: 'Bad Request' });
  }
  const { owner, content, rate, idUser, idApi } = req.body.data;
  try {
    const targetedBookQuery = await bookServices.getBookByIdApiOrCreateBook(idApi);
    if (targetedBookQuery.status !== 200) {
      return res.status(targetedBookQuery.status).json({ errorMessage: 'Bad request' });
    }
    const targetedBook = targetedBookQuery.data;
    const newReviewQuery = await reviewServices.createReview(owner, content, rate, idUser, targetedBook._id);
    if (newReviewQuery.status !== 200) {
      return res.status(newReviewQuery.status).json({ errorMessage: 'Bad request' });
    }
    const newReview = newReviewQuery.data;
    const results = await updateDBServices.userCreateNewReview(newReview, idUser, targetedBook._id);
    return res.status(results.status).json(results.data);
  } catch (err) {
    console.log(err);
    return res.status(err.response.status).json({ errorMessage: 'Bad request: ' + err });
  }
};

const deleteReview = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) return res.status(400).json({ errorMessage: 'Bad Request' });

  const { idReview, idUser } = req.body;

  if (!idUser) return res.status(400).json({ errorMessage: 'Bad Request: user info' });
  if (!idReview) return res.status(400).json({ errorMessage: 'Bad Request: review info' });

  try {
    const reviewQuery = await reviewServices.getReview(idReview);
    if (reviewQuery.status !== 200) {
      return res.status(reviewQuery.status).json({ errorMessage: 'Bad request' });
    }
    const review = reviewQuery.data;

    //Check user owner
    if (review.idUser._id != idUser) {
      return res.status(403).json({ errorMessage: 'Not authorized' });
    }

    const deletedReviewQuery = await reviewServices.deleteReview(idReview);
    if (deletedReviewQuery.status !== 200) {
      return res.status(deletedReviewQuery.status).json({ errorMessage: 'Bad request' });
    }
    const deletedReview = deletedReviewQuery.data;

    const results = await updateDBServices.userDeleteReview(deletedReview, idUser);
    return res.status(results.status).json(results.data);
  } catch (err) {
    console.log(err);
    return res.status(err.response.status).json({ errorMessage: 'Bad request: ' + err });
  }
};

module.exports = { createReview, deleteReview };
