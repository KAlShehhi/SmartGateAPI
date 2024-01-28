const express = require('express');
const router = express.Router();
const {userEntry, userExit, checkServer} = require('../controllers/gateController');

const {protect} = require('../middleware/authMiddleware');


router.route('/check').get(checkServer);
router.route(protect, '/entry/:gymID/:userID').post(userEntry).post(userExit);
module.exports = router;