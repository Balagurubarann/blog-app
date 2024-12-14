const router = require('express').Router();
const { createPost, getPosts } = require('../controllers/post.control.js');
const { verifyUser } = require('../utils/verifyUser.js');

router
    .post('/create', verifyUser, createPost)
    .get('/get-posts', verifyUser, getPosts)

module.exports = router;
