// Import model
const User = require('../models/User.model');

const createUser = async (username, password) => {
  const result = await User.create({
    username,
    password,
  });

  return { status: 200, data: result };
};

const getUser = async (id) => {
  const results = await User.findById(id).populate('books').populate('reviews');

  if (!results) {
    return { status: 404, data: { errorMessage: 'User not found' } };
  }

  return { status: 200, data: results };
};

const updateUser = async (id, user) => {
  const updatedUser = await User.findByIdAndUpdate(id, user);
  return { status: 200, data: updatedUser };
};

const deleteUser = async (id) => {
  const deletedUser = await User.findByIdAndDelete(id);
  return { status: 200, data: deletedUser };
};

module.exports = { createUser, getUser, updateUser, deleteUser };
