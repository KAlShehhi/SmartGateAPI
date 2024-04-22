const express = require('express');
const router = express.Router();
const {getAverageTime, getTimeSpentEveryDay, getDaysVisted, getDaysNotVisted, getDaysLeft, resetCurrentVisitors} = require('../controllers/statisticsController');

const {auth} = require('../middleware/authMiddleware');

router.route('/getAverageTime').post(auth, getAverageTime);
router.route('/resetCurrentVisitors').post(auth, resetCurrentVisitors);
router.route('/getTimeSpentEveryDay').post(auth, getTimeSpentEveryDay);
router.route('/getDaysVisted').post(auth, getDaysVisted);
router.route('/getDaysNotVisted').post(auth, getDaysNotVisted);
router.route('/getDaysLeft').post(auth, getDaysLeft);


module.exports = router;