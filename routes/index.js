const bookController = require('../controllers/book');
const authController = require('../controllers/auth');
const reviewController = require('../controllers/review');
const userController = require('../controllers/user');

const { isAuthenticated } = require('../middleware/jwt.middleware');
const router = require('express').Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.json('All good in here');
});

//Books
router.get('/book/search-books', bookController.searchBooks);
router.get('/book/search-book-by-id/:id', bookController.searchBookById);
router.get('/book/get-top-books', bookController.getTopBooks);
//Auth
router.post('/auth/signup', authController.signup);
router.post('/auth/login', authController.login);
router.get('/auth/verify', isAuthenticated, authController.verify);
//Review
router.post('/review/create', reviewController.createReview);
router.delete('/review/delete', reviewController.deleteReview);
router.put('/review/modify', reviewController.modifyReview);
//User
router.get('/user/:id', userController.getUser);

module.exports = router;
