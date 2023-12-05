const express = require('express');
const router = express.Router();
const { getGyms,    
        createGym,
        updateGym,
        deleteGym 
} = require('../controllers/gymController');

router.get('/', getGyms);

router.post('/', createGym);

router.put('/:id', updateGym);

router.delete('/:id', deleteGym);

module.exports = router;