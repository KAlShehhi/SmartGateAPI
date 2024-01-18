const express = require('express');
const router = express.Router();
const { 
        loginUser,
        checkPassword,
        registerUser,
        validateExistingToken
} = require('../controllers/userAppController')
const { protect } = require('../middleware/authMiddleware');


router.post('/login', loginUser);
router.post('/checkPassword', checkPassword);
router.post('/registerUser', registerUser);
router.post('/validate', validateExistingToken);

module.exports = router;