const router = require("express").Router();
const { createComment, getComments, editComment, deleteComment } = require("../controllers/comment.control.js");
const { verifyUser } = require("../utils/verifyUser.js")

router
    .post("/create", verifyUser, createComment)
    .get("/get-comments/:postId", getComments)
    .put("/edit-comment/:commentId", verifyUser, editComment)
    .delete("/delete-comment/:commentId", verifyUser, deleteComment)

module.exports = router;
