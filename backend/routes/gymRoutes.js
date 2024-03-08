const express = require('express');
const router = express.Router();
const { getUserGyms,    
        createGym,
        hasGym,
        updateGym,
        deleteGym ,
        getGym
} = require('../controllers/gymController');

const {auth} = require('../middleware/authMiddleware');

router.route('/createGym').post(auth, createGym);
router.route('/hasGym').post(auth, hasGym);
router.route('/getGym/:id').get(getGym);
module.exports = router;