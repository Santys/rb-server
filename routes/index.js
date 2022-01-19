const bookController = require('../controllers/book');

const router = require('express').Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.json('All good in here');
});

//Books
router.get('/book/search-books', bookController.searchBooks);
router.get('/book/search-book-by-id/:id', bookController.searchBookById);
router.get('/book/get-top-books', bookController.getTopBooks);

module.exports = router;
