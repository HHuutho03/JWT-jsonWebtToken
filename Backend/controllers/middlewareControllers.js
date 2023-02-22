const jwt = require("jsonwebtoken");

const middlewareController = {
  verifyToken: async (req, res, next) => {
    const token = req.header.token;
    if (token) {
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.ACCESS_KEY, { err, user });
      if (err) {
        res.status(404).json("token is not valid");
      }
      req.user = user;
      next();
    }
  },
  verifyTokenAndAdminAuth: async (req, res, next) => {
    middlewareController.verifyToken(req, res, () => {
      if (req.user.id == req.params.id || req.user.admin) {
        next();
      } else {
        res.status(403).json("you are not allowed to admin");
      }
    });
  },
};
module.exports = middlewareController;
