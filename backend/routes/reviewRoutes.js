const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/authMiddleware');

const {    
    getReview,    
    getReviews, 
    writeReview,
    updateReview,
    deleteReview,
    getReviewsForUser,
    getOtherUsersReview
} = require('../controllers/reviewController');

router.route('/getReviews/:gymID').get(getReviews);
router.route('/getReview/:reviewID').get(getReview);
router.route('/getOtherUsersReview/:userID/:gymID').get(getOtherUsersReview);
router.route('/writeReview').post(auth, writeReview);
router.route('/updateReview/').put(auth, updateReview);
router.route('/deleteReview/:reviewID/:userID/:token').delete(deleteReview);
router.route('/getReviewsForUser/:userID/:gymID').get(getReviewsForUser);

module.exports = router;