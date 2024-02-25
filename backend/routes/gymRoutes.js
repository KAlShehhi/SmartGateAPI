const express = require('express');
const router = express.Router();
const { getGyms,    
        createGym,
        updateGym,
        deleteGym 
} = require('../controllers/gymController');

const {auth} = require('../middleware/authMiddleware');

router.route('/createGym').post(auth, createGym);


module.exports = router;