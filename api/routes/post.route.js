const router = require('express').Router();
const { createPost, getPosts, updatePost } = require('../controllers/post.control.js');
const { verifyUser } = require('../utils/verifyUser.js');

router
    .post('/create', verifyUser, createPost)
    .get('/get-posts', verifyUser, getPosts)
    .post('/update/:userId', verifyUser, updatePost)

module.exports = router;
