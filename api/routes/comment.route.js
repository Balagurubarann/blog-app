const router = require("express").Router();
const { createComment, getComments } = require("../controllers/comment.control.js");
const { verifyUser } = require("../utils/verifyUser.js")

router
    .post("/create", verifyUser, createComment)
    .get("/get-comments/:postId", getComments)

module.exports = router;
