const express = require('express');
const router = express.Router();
const { 
        loginUser,
        checkPassword,
        registerUser,
        validateExistingToken,
        isAdminCheck,
        isGymOwnerCheck,
        applyToBeAGymOwner,
        getApplyStatus
} = require('../controllers/userAppController')
const { protect } = require('../middleware/authMiddleware');


router.post('/login', loginUser);
router.post('/checkPassword', checkPassword);
router.post('/registerUser', registerUser);
router.post('/validate', validateExistingToken);
router.post('/checkGymOwner', isGymOwnerCheck);
router.post('/checkAdmin', isAdminCheck);
router.post('/applyGymOwner', applyToBeAGymOwner)
router.post('/getApplyStatus', getApplyStatus)

module.exports = router;