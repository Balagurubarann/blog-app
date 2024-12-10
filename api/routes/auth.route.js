const router = require('express').Router();
const { register, login, googleAuth } = require('../controllers/auth.control.js');

router
    .post('/register', register)
    .post('/login', login)
    .post('/google', googleAuth)

module.exports = router;