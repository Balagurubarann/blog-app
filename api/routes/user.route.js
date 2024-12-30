const router = require("express").Router();
const {
  updateUser,
  deleteUser,
  logout,
  getUsers,
} = require("../controllers/user.control.js");
const { verifyUser } = require("../utils/verifyUser.js");

router
  .put("/update/:userId", verifyUser, updateUser)
  .delete("/delete/:userId", verifyUser, deleteUser)
  .post("/logout", logout)
  .get("/getUsers", verifyUser, getUsers);

module.exports = router;
