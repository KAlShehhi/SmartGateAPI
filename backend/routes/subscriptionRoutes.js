const express = require('express');
const router = express.Router();
const {createSub, getSubs} = require('../controllers/userAppController')
const { protect } = require('../middleware/authMiddleware');



router.route('/create/:id').post(protect,createSub);
router.route('/getSubs/:id').get(getSubs);

module.exports = router;