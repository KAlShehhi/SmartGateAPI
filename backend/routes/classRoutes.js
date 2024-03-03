const express = require('express');
const router = express.Router();
const {createClass, getGymClasses, getClass, deleteClass, updateClass} = require('../controllers/classController');

const {auth} = require('../middleware/authMiddleware');


router.route('/createClass').post(auth, createClass);
router.route('/getGymClasses/:id').get(getGymClasses);
router.route('/getClass/:id').get(getClass);
router.route('/deleteClass').post(auth, deleteClass);
router.route('/updateClass').put(auth, updateClass);


module.exports = router;