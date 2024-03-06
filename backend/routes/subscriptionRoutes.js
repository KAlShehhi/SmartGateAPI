const express = require('express');
const router = express.Router();
const {createSub, getSubs, getSub, updateSub, deleteSub} = require('../controllers/subscriptionController')
const { auth } = require('../middleware/authMiddleware');


router.route('/get/').get(getSub);
router.route('/getSub/:id').get(getSubs);
router.route('/create/').post(auth,updateSub);
router.route('/update/').put(auth,createSub);
router.route('/delete/').post(auth,deleteSub);


module.exports = router;