const axios = require('axios');
const { describeBookApi } = require('./describeBook');

const searchBooks = async (term, filter) => {
  let queryTerm = '';
  if (filter === 'all') {
    queryTerm = `${term}`;
  } else {
    queryTerm = `+${filter}:${term}`;
  }
  const axiosCall = await axios(`https://www.googleapis.com/books/v1/volumes?q=${queryTerm}&maxResults=12`);

  if (axiosCall.status !== 200) return { status: 400, data: { errorMessage: 'Bad API response' } };

  const booksInfo = axiosCall.data.items;
  if (!booksInfo) return { status: 404, data: { errorMessage: 'Books not found' } };

  const results = booksInfo.map((book) => describeBookApi(book));

  return { status: 200, data: results };
};

const searchBookById = async (id) => {
  const axiosCall = await axios(`https://www.googleapis.com/books/v1/volumes/${id}`);

  if (axiosCall.status !== 200) return { status: 400, data: { errorMessage: 'Bad API response' } };

  const bookInfo = axiosCall.data;
  const result = describeBookApi(bookInfo);

  return { status: 200, data: result };
};

module.exports = { searchBookById, searchBooks };
