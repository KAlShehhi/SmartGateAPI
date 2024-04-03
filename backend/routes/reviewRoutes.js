const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/authMiddleware');

const {    
    getReviews, 
    writeReview,
    updateReview,
    deleteReview
} = require('../controllers/reviewController');

router.route('/getReviews/:gymID').get(getReviews);
router.route('/writeReview').post(auth, writeReview);
router.route('/updateReview/').put(auth, updateReview);
router.route('/deleteReview/:reviewID/:userID').delete(auth, deleteReview);

module.exports = router;