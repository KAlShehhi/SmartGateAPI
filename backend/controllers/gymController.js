
// @desc    Get gyms
// @route   GET /api/gyms
// @access  Private
const getGyms = (req, res) => {
    res.status(200).json({message : 'Get Gym'})
}

// @desc    Create gym
// @route   POST /api/gyms
// @access  Private
const createGym = (req, res) => {
    res.status(200).json({message : 'Create Gym'})
}

// @desc    Update gym
// @route   PUT /api/gyms/id
// @access  Private
const updateGym = (req, res) => {
    res.status(200).json({message : `Update Gym ${req.params.id}`})
}

// @desc    Delete gym
// @route   DELETE /api/gyms/id
// @access  Private
const deleteGym = (req, res) => {
    res.status(200).json({message : `Delete Gym ${req.params.id}`})
}


module.exports = {
    getGyms, 
    createGym,
    updateGym,
    deleteGym
}