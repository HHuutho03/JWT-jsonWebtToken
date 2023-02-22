const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authController = {
  //REGISTER
  registerUser: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);

      //Create new user
      const newUser = await new User({
        username: req.body.username,
        email: req.body.email,
        password: hashed,
      });

      //Save user to DB
      const user = await newUser.save();
      return res.status(200).json(user);
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  //GENERATE ACCESS TOKEN
  generateToken: (user) => {
    return jwt.verify(
      { id: user.id, admin: user.admin },
      process.env.ACCESSKEY,
      {
        expiresIn: "100s",
      }
    );
  },
  //GENARATE REFRESH TOKEN
  genarateRefreshToken: (user) => {
    return jwt.verify(
      { id: user.id, admin: user.admin },
      process.env.refreshToken,
      {
        expiresIn: "100s",
      }
    );
  },
  //LOGIN
  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        res.status(404).json("wrong username");
      }
      const validPassword = await bcrypt.compare(
        req.body.password,
        User.password
      );
      if (!validPassword) {
        res.status(404).json("wrong password");
      }
      if (user && validPassword) {
        //create jsonwebtoken token
        const accessToken = authController.generateToken(user);
        const refreshToken = authController.genarateRefreshToken(user);
        //save token in cookies
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          path: "/",
          samesite: "strict",
        });
        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, accessToken });
      }
    } catch (err) {}
  },
  //request refresh token
  requestRefreshToken: async (req, res) => {
    // take refresh token
    const refreshToken = req.cookie.refreshToken;
    if (!refreshToken) {
      res.status(403).json("you're not authenticated");
    }
    jwt.verify(refreshToken, process.env.refreshToken, (err, user) => {
      if (err) {
        console.log(err);
      }
      //create accessToken and refreshToken
      const newAccessToken = authController.generateToken;
      const newRefreshToken = authController.refreshToken;
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        samesite: "strict",
      });
      res.status(200).json({ accessTokens: newAccessToken });
    });
  },

  // LOG OUT
  userLogout: async (req, res) => {
    res.clearCookie("refreshToken");
    res.status(200).json("logout successful");
  },
};
module.exports = authController;
