const router = require('express').Router();
const axios = require('axios');
const { searchBookById } = require('./book.api');

// Import model
const Book = require('../models/Book.model');

const createBook = async (idApi) => {
  //Check if book exist, if not, create it
  let results = await Book.findOne({ idApi });

  if (!results) {
    const bookInfo = await searchBookById(idApi);
    results = await Book.create({
      title: bookInfo.title,
      author: bookInfo.authors,
      cover: bookInfo.cover,
      idApi: bookInfo.idApi,
    });
  } else {
    return { status: 400, data: { errorMessage: 'Book already created' } };
  }

  return { status: 200, data: results };
};

const getBook = async (id) => {
  const results = await Book.findById(id).populate('reviews').populate('users');

  if (!results) {
    return { status: 404, data: { errorMessage: 'Book not found' } };
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

const updateBook = async (id, book) => {
  const updatedBook = await Book.findByIdAndUpdate(id, book);
  return { status: 200, data: updatedBook };
};

const deleteBook = async (id) => {
  const deletedBook = await Book.findByIdAndDelete(id);
  return { status: 200, data: deletedBook };
};

module.exports = { createBook, getBook, getBookByIdApi, updateBook, deleteBook };
