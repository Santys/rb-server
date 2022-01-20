const reviewServices = require('../services/review');
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
    const result = await updateDBServices.userCreateNewReview(owner, content, rate, idUser, idApi);
    return res.status(result.status).json(result.data);
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
    const results = await updateDBServices.userDeleteReview(review, idUser);
    return res.status(results.status).json(results.data);
  } catch (err) {
    console.log(err);
    return res.status(err.response.status).json({ errorMessage: 'Bad request: ' + err });
  }
};

const modifyReview = async (req, res) => {
  if (
    !req.body.data ||
    !req.body.data.content ||
    !req.body.data.rate ||
    !req.body.data.idUser ||
    !req.body.data.idReview
  ) {
    return res.status(400).json({ errorMessage: 'Bad Request' });
  }
  const { content, rate, idUser, idReview } = req.body.data;
  try {
    const oldReviewQuery = await reviewServices.getReview(idReview);
    if (oldReviewQuery.status !== 200) {
      return res.status(oldReviewQuery.status).json({ errorMessage: 'Bad request' });
    }
    const oldReview = oldReviewQuery.data;

    //Check user owner
    if (oldReview.idUser._id != idUser) {
      return res.status(403).json({ errorMessage: 'Not authorized' });
    }

    const result = await updateDBServices.userModifyReview(content, rate, idReview);
    return res.status(result.status).json(result.data);
  } catch (err) {
    console.log(err);
    return res.status(err.response.status).json({ errorMessage: 'Bad request: ' + err });
  }
};

module.exports = { createReview, deleteReview, modifyReview };
