const asyncHandler = require('express-async-handler');


// @desc    authenticate users into the gym using the gate
// @route   POST /api/gate/entry/:gymID/:userID
// @access  Private
const userEntry = asyncHandler(async(req, res) => {
    
});


// @desc    authenticate users existing the gym using the gate
// @route   POST /api/gate/exit/:gymID/:userID
// @access  Private
const userExist = asyncHandler(async(req, res) => {
    
});



module.exports = {}