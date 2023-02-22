const router = require("express").Router();
const userController = require("../controllers/userController");
const middlewareController = require("../controllers/middlewareControllers");
router.get("/", middlewareController.verifyToken, userController.getAllUsers);
router.delete(
  "/delete",
  middlewareController.verifyTokenAndAdminAuth,
  userController.deleteUser
);

module.exports = router;
