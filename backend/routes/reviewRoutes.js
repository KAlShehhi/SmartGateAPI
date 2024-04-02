const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/authMiddleware');

const {    
    getReviews, 
    writeReview,
    updateReview,
    deleteReview
} = require('../controllers/reviewController');

router.route('/getReviews').get(getReviews);
router.route('/writeReview').post(auth, writeReview);
router.route('/updateReview/:id/:userID').put(auth, updateReview);
router.route('/deleteReview/:id/:userID').delete(auth, deleteReview);

module.exports = router;