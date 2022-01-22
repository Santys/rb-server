const describeBookApiAndBookDB = (bookFromApi, bookFromDB, userReview, otherUsersReview) => {
  return {
    ...bookFromApi,
    otherUsersReview,
    userReview,
    rating: bookFromDB?.rating,
    users: bookFromDB?.users,
    _id: bookFromDB?._id,
  };
};

const describeBookApi = (book) => {
  return {
    idApi: book.id,
    title: book.volumeInfo?.title,
    authors: book.volumeInfo?.authors,
    description: book.volumeInfo?.description,
    categories: book.volumeInfo?.categories,
    cover:
      book.volumeInfo.imageLinks?.thumbnail ??
      'https://islandpress.org/sites/default/files/default_book_cover_2015.jpg',
  };
};

module.exports = { describeBookApiAndBookDB, describeBookApi };
