const bookApiServices = require('../services/book.api');
const bookServices = require('../services/book');
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

  const { id } = req.params;

  try {
    const resultFromApi = await bookApiServices.searchBookById(id);
    if (resultFromApi.status !== 200)
      return res.status(resultFromApi.status).json({ errorMessage: 'Bad API response' });

    const resultFromDB = await bookServices.getBookByIdApi(id);
    if (resultFromDB.status !== 200) return res.status(resultFromDB.status).json({ errorMessage: 'Bad DB response' });

    const result = describeBookApiAndBookDB(resultFromApi.data, resultFromDB.data);
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
