const router = require('express').Router();
const { createPost } = require('../controllers/post.control.js');
const { verifyUser } = require('../utils/verifyUser.js');

router
    .post('/create', verifyUser, createPost)

module.exports = router;
