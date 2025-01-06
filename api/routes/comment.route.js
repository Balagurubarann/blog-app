const router = require("express").Router();
const { verifyUser } = require("../utils/verifyUser.js")

router 
    .post("/create", verifyUser, createComment)

module.exports = router;
