const express = require('express');
const router = express.Router();
const {userEntry, userExit, checkServer} = require('../controllers/gateController');

const {protect} = require('../middleware/authMiddleware');


router.route('/check').get(checkServer);
router.route('/entry/:gymID/:userID').get(userEntry);
router.route('/exit/:gymID/:userID').get(userExit);
module.exports = router;