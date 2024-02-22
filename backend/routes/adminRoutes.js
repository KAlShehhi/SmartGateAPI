const express = require('express');
const router = express.Router();
const {makeUserAGymOwner, getAllRequestsForGymOwners} = require('../controllers/adminController');


router.route('/makeUserAGymOwner').post(makeUserAGymOwner);
router.route('/getUserRequests').get(getAllRequestsForGymOwners);
module.exports = router;