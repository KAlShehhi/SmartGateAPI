const express = require('express');
const router = express.Router();
const {createClass, getGymClasses, deleteClass, updateClass} = require('../controllers/classController');

const {auth} = require('../middleware/authMiddleware');


router.route('/createClass').post(auth, createClass);
router.route('/getGymClasses').get(getGymClasses);
router.route('/deleteClass').delete(auth, deleteClass);
router.route('/updateClass').put(auth, updateClass);


module.exports = router;