const userServices = require('../services/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const signup = async (req, res) => {
  if (!req.body.data || !req.body.data.username || !req.body.data.password) {
    return res.status(400).json({ errorMessage: 'Bad Request' });
  }
  const { username, password } = req.body.data;
  try {
    const userAlreadyExists = await userServices.getUserByName(username);
    if (userAlreadyExists.status === 200) {
      return res.status(400).json({ errorMessage: 'Username already exists' });
    }
    // Create user
    //Encrypt password
    console.log(password);
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const createdUser = await userServices.createUser(username, hashedPassword);
    return res.status(createdUser.status).json(createdUser.data);
  } catch (err) {
    console.log(err);
    return res.status(err.response.status).json({ errorMessage: 'Bad request: ' + err });
  }
};

const login = async (req, res) => {
  if (!req.body.data || !req.body.data.username || !req.body.data.password) {
    return res.status(400).json({ errorMessage: 'Bad Request' });
  }
  const { password } = req.body.data;

  try {
    const userFromDBQuery = await userServices.getUserByName(req.body.data.username);
    if (userFromDBQuery.status !== 200) {
      return res.status(400).json({ errorMessage: 'Bad credentials' });
    }
    const userFromDB = userFromDBQuery.data;
    const passwordsMatch = await bcrypt.compare(password, userFromDB.password);
    if (!passwordsMatch) {
      return res.status(400).json({ errorMessage: 'Bad credentials' });
    }
    const { _id, username } = userFromDB;

    const payload = { _id, username };

    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, { algorithm: 'HS256', expiresIn: '6h' });

    return res.status(200).json({ authToken: authToken });
  } catch (err) {
    console.log(err);
    return res.status(err.response.status).json({ errorMessage: 'Bad request: ' + err });
  }
};

const verify = (req, res) => {
  return res.status(200).json(req.payload);
};

module.exports = { signup, login, verify };
