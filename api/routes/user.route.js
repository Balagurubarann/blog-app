const router = require("express").Router();
const {
  updateUser,
  deleteUser,
  logout,
  getUsers,
  getUser,
} = require("../controllers/user.control.js");
const { verifyUser } = require("../utils/verifyUser.js");

router
  .put("/update/:userId", verifyUser, updateUser)
  .delete("/delete/:userId", verifyUser, deleteUser)
  .post("/logout", logout)
  .get("/get-users", verifyUser, getUsers)
  .get("/get-user/:userId", getUser)

module.exports = router;
