const express = require('express');
const router = express.Router();
const { getGyms,    
        createGym,
        updateGym,
        deleteGym 
} = require('../controllers/gymController');

const {protect} = require('../middleware/authMiddleware');

router.route('/').get(protect, getGyms).post(protect,createGym);
router.route('/:id').put(protect, updateGym).delete(protect, deleteGym);


module.exports = router;