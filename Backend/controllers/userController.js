const User = require("../models/User");

const userController = {
  //GET ALL USER
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //DELETE  USER
  deleteUser: async (req, res) => {
    try {
      const users = await User.findById(req.params.id);
      res.status(200).json("delete successfully user");
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
module.exports = userController;
