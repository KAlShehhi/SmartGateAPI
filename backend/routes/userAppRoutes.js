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
        getApplyStatus,
        gymCreated,
        getUserGymID,
        updateUser
} = require('../controllers/userAppController')
const { auth } = require('../middleware/authMiddleware');

router.route('/getUserGymID').post(auth, getUserGymID);
router.post('/login', loginUser);
router.post('/checkPassword', checkPassword);
router.post('/registerUser', registerUser);
router.post('/validate', validateExistingToken);
router.post('/checkGymOwner', isGymOwnerCheck);
router.post('/checkAdmin', isAdminCheck);
router.post('/applyGymOwner', applyToBeAGymOwner);
router.post('/getApplyStatus', getApplyStatus);
router.get('/gymCreated/:id', gymCreated);
router.post('/updateUser/', updateUser);

module.exports = router;