const router = require("express").Router();
const { createComment } = require("../controllers/comment.control.js");
const { verifyUser } = require("../utils/verifyUser.js")

router 
    .post("/create", verifyUser, createComment)

module.exports = router;
