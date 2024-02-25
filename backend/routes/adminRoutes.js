const express = require('express');
const router = express.Router();
const {makeUserAGymOwner, getAllRequestsForGymOwners, getAllGymOwners, getAllRejectedGymOwners} = require('../controllers/adminController');


router.route('/makeUserAGymOwner').post(makeUserAGymOwner);
router.route('/getUserRequests').get(getAllRequestsForGymOwners);
router.route('/getAllGymOwners').get(getAllGymOwners);
router.route('/getAllRejectedGymOwners').get(getAllRejectedGymOwners);
module.exports = router;