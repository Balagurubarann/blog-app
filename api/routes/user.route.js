const router = require('express').Router();
const { updateUser } = require('../controllers/user.control.js');
const { verifyUser } = require('../utils/verifyUser.js');

router
    .put('/update/:userId', verifyUser, updateUser);
    

module.exports = router;
