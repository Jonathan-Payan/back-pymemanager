const { getUsers,createUser } = require('../services/users.service');

const getUsersController = async (req, res, next) => {
  try {
    const Users = await getUsers(req.query);
    res.json(Users);
  } catch (err) {
    next(err);
  }
};

const createUserController = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const resultCode = await createUser({ username, email, password });
    if (resultCode === 1) {
      return res.sendStatus(201);
    } else if (resultCode === 0) {
      return res.status(400).json({ message: "Error creating user. User already exists." });
    } else {
      return res.status(400).json({ message: "Error creating user" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};





module.exports = {
    getUsersController,
    createUserController,
  };