const bookApiServices = require('../services/book.api');

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
    const result = await bookApiServices.searchBookById(id);
    return res.status(result.status).json(result.data);
  } catch (err) {
    console.log(err);
    return res.status(err.response.status).json({ errorMessage: 'Bad request: ' + err });
  }
};

module.exports = { searchBooks, searchBookById };
