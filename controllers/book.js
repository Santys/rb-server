const bookApiServices = require('../services/book.api');
const bookServices = require('../services/book');
const reviewServices = require('../services/review');

const { describeBookApiAndBookDB } = require('../services/describeBook');

const searchBooks = async (req, res) => {
  if (!req.query || Object.keys(req.query).length === 0) return res.status(400).json({ errorMessage: 'Bad Request' });

  const { term, filter } = req.query;

  if (!term) return res.status(404).json({ errorMessage: 'Term not found' });
  if (!filter) return res.status(404).json({ errorMessage: 'Filter not found' });

  try {
    const result = await bookApiServices.searchBooks(term, filter);
    return res.status(result.status).json(result.data);
  } catch (err) {
    console.log(err);
    return res.status(err.response.status).json({ errorMessage: 'Bad request: ' + err });
  }
};

const searchBookById = async (req, res) => {
  if (!req.params || !req.params.id) return res.status(400).json({ errorMessage: 'Bad Request' });
  if (!req.query || Object.keys(req.query).length === 0) return res.status(400).json({ errorMessage: 'Bad Request' });
  const { id } = req.params;
  const { idUser } = req.query;

  try {
    const resultFromApi = await bookApiServices.searchBookById(id);
    if (resultFromApi.status !== 200)
      return res.status(resultFromApi.status).json({ errorMessage: 'Bad API response' });

    const resultFromDB = await bookServices.getBookByIdApi(id);
    if (resultFromDB.status !== 200) return res.status(resultFromDB.status).json({ errorMessage: 'Bad DB response' });
    let userReview = {};
    let otherUsersReviews = [];
    if (resultFromDB.data) {
      const userReviewQuery = await reviewServices.getBookReviewByUserId(resultFromDB.data._id, idUser);
      if (userReviewQuery.status !== 200)
        return res.status(userReviewQuery.status).json({ errorMessage: 'Bad DB response' });

      userReview = userReviewQuery.data;

      const otherUsersReviewsQuery = await reviewServices.getBookReviewsExcludeUserId(resultFromDB.data._id, idUser);
      if (otherUsersReviewsQuery.status !== 200)
        return res.status(otherUsersReviewsQuery.status).json({ errorMessage: 'Bad DB response' });

      otherUsersReviews = otherUsersReviewsQuery.data;
    }
    const result = describeBookApiAndBookDB(resultFromApi.data, resultFromDB.data, userReview, otherUsersReviews);
    return res.status(200).json(result);
  } catch (err) {
    console.log(err);
    return res.status(err.response.status).json({ errorMessage: 'Bad request: ' + err });
  }
};

const getTopBooks = async (req, res) => {
  try {
    const result = await bookServices.getTopBooks();
    return res.status(result.status).json(result.data);
  } catch (err) {
    console.log(err);
    return res.status(err.response.status).json({ errorMessage: 'Bad request: ' + err });
  }
};

module.exports = { searchBooks, searchBookById, getTopBooks };
