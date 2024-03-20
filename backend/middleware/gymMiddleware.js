const Gym = require('../models/gymModel');
const asyncHandler = require('express-async-handler');

const updateGymLocations = asyncHandler(async (req, res, next) => {
    const gyms = await Gym.find({
        $or: [
            { location: { $exists: false } },
            { location: null }
        ]
    });
    
    if (gyms.length === 0){
        return next();
    }

    const savePromises = gyms.map(gym => {
        gym.location = { type: 'Point', coordinates: [gym.lng, gym.lat] };
        return gym.save().then(() => console.log(`Gym ${gym.id} has been updated`.green));
    });

    await Promise.all(savePromises).then(() => {
        console.log('All gyms have been updated.');
        next();
    }).catch(error => {
        console.error(error);
        res.status(500).send('An error occurred while updating gym locations.');
    });
});


module.exports = {
    updateGymLocations
}