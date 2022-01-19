const { searchBookById } = require('./book.api');

// Import model
const Book = require('../models/Book.model');

const getBookByIdApiOrCreateBook = async (idApi) => {
  //Check if book exist, if not, create it
  let results = await getBookByIdApi(idApi);

  if (Object.keys(results.data).length === 0) {
    const bookInfoQuery = await searchBookById(idApi);
    if (bookInfoQuery.status !== 200) {
      return { status: bookInfoQuery.status, errorMessage: 'Book not found' };
    }
    const bookInfo = bookInfoQuery.data;
    results = await Book.create({
      title: bookInfo.title,
      author: bookInfo.authors,
      cover: bookInfo.cover,
      idApi: bookInfo.idApi,
    });
    return { status: 200, data: results };
  } else {
    return { status: 200, data: results.data };
  }
};

const getBook = async (id) => {
  const results = await Book.findById(id).populate('reviews').populate('users');

  if (!results) {
    return { status: 404, errorMessage: 'Book not found' };
  }

  return { status: 200, data: results };
};

const getBookByIdApi = async (idApi) => {
  const results = await Book.findOne({ idApi }).populate('reviews').populate('users');

  if (!results) {
    return { status: 200, data: {} };
  }

  return { status: 200, data: results };
};

const getTopBooks = async () => {
  const results = await Book.find().sort({ rating: -1 }).limit(10);
  return { status: 200, data: results };
};

const updateBook = async (id, book) => {
  const updatedBook = await Book.findByIdAndUpdate(id, book);
  return { status: 200, data: updatedBook };
};

const deleteBook = async (id) => {
  const deletedBook = await Book.findByIdAndDelete(id);
  return { status: 200, data: deletedBook };
};

module.exports = { getBookByIdApiOrCreateBook, getBook, getBookByIdApi, getTopBooks, updateBook, deleteBook };
