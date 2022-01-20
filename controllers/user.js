const userServices = require('../services/user');

const getUser = async (req, res) => {
  if (!req.params || !req.params.id) return res.status(400).json({ errorMessage: 'Bad Request' });

  const { id } = req.params;
  try {
    const userQuery = await userServices.getUser(id);
    if (userQuery.status !== 200) {
      return res.status(userQuery.status).json({ errorMessage: userQuery.errorMessage });
    }
    return res.status(userQuery.status).json(userQuery.data);
  } catch (err) {
    console.log(err);
    return res.status(err.response.status).json({ errorMessage: 'Bad request: ' + err });
  }
};

module.exports = { getUser };
