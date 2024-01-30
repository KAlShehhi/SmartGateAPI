const express = require('express');
const router = express.Router();
const {userEntry, userExit, checkServer} = require('../controllers/gateController');

const {protect} = require('../middleware/authMiddleware');


router.route('/check').get(checkServer);
router.route('/entry/:gymID/:userID').post(protect, userEntry);
router.route('/exit/:gymID/:userID').post(protect, userExit);
module.exports = router;