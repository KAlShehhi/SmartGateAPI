const express = require('express');
const router = express.Router();
const {createSub, getSubs, getSub, updateSub, deleteSub} = require('../controllers/subscriptionController')
const { auth } = require('../middleware/authMiddleware');


router.route('/get/:id').get(getSub);
router.route('/getSubs/:id').get(getSubs);
router.route('/create/').post(auth,createSub);
router.route('/update/').put(auth, updateSub);
router.route('/delete/').post(auth,deleteSub);


module.exports = router;