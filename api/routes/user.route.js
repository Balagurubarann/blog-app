const router = require('express').Router();
const { updateUser, deleteUser } = require('../controllers/user.control.js');
const { verifyUser } = require('../utils/verifyUser.js');

router
    .put('/update/:userId', verifyUser, updateUser)
    .delete('/delete/:userId', verifyUser, deleteUser)
    

// 675434add7a42a3feaa0a79c
// 67553f83cf07a1cb743e75ee

module.exports = router;
