const router = require("express").Router();
const { createComment, getComments, editComment } = require("../controllers/comment.control.js");
const { verifyUser } = require("../utils/verifyUser.js")

router
    .post("/create", verifyUser, createComment)
    .get("/get-comments/:postId", getComments)
    .put("/edit-comment/:commentId", verifyUser, editComment)

module.exports = router;
