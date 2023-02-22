const authController = require("../controllers/authController");

const router = require("express").Router();

//REGISTER
router.post("/register", authController.registerUser);
router.get("/login", authController.loginUser);
router.get("/refreshToken", authController.requestRefreshToken);
router.get("/logout", authController);


module.exports = router;
