const router = require('express').Router();
const { register, login, googleAuth, authorizeUser } = require('../controllers/auth.control.js');

router
    .post('/register', register)
    .post('/login', login)
    .post('/google', googleAuth)
    .get('/authUser', authorizeUser)
    

module.exports = router;