const express = require('express');
const router = express.Router();
const {createSub, getSubs, getSub, getUserSubs, updateSub, deleteSub, subUser} = require('../controllers/subscriptionController')
const { auth } = require('../middleware/authMiddleware');


router.route('/get/:id').get(getSub);
router.route('/getUserSubs/:id').get(getUserSubs)
router.route('/getSubs/:id').get(getSubs);
router.route('/create/').post(auth,createSub);
router.route('/update/').put(auth, updateSub);
router.route('/delete/:subID/:userID/:token').delete(deleteSub);
router.route('/subUser/').post(subUser);

module.exports = router;