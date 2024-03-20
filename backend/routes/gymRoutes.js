const express = require('express');
const router = express.Router();
const { getUserGyms,    
        createGym,
        hasGym,
        updateGym,
        deleteGym ,
        getGym,
        getGyms
} = require('../controllers/gymController');

const {updateGymLocations} = require('../middleware/gymMiddleware')
const {auth} = require('../middleware/authMiddleware');

router.route('/createGym').post(auth, updateGymLocations, createGym);
router.route('/hasGym').post(auth, updateGymLocations, hasGym);
router.route('/updateGym/:id').put(auth, updateGymLocations, updateGym);
router.route('/getGym/:id').get(updateGymLocations, getGym);
router.route('/getGyms/:lat/:lng').get(getGyms);

module.exports = router;