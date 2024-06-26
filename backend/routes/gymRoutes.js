const express = require('express');
const router = express.Router();
const { getUserGyms,    
        createGym,
        hasGym,
        updateGym,
        deleteGym ,
        getGym,
        getGyms,
        getGymsBasedOnEmirate
} = require('../controllers/gymController');

const {auth} = require('../middleware/authMiddleware');

router.route('/createGym').post(auth, createGym);
router.route('/hasGym').post(auth, hasGym);
router.route('/updateGym/:id').put(auth, updateGym);
router.route('/getGym/:id').get(getGym);
router.route('/getGyms/:lat/:lng').get(getGyms);
router.route('/getGymsBasedOnEmirate/:emirate').get(getGymsBasedOnEmirate);

module.exports = router;