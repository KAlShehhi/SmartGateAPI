const asyncHandler = require('express-async-handler');
const Gym = require('../models/gymModel');
const User = require('../models/userModel');
const UserEntry = require('../models/gymEntryByUserModel');
const UserExit = require('../models/gymExitByUserModel');
const Subscription = require('../models/subscriptionModel');
const UserSubscription = require('../models/userSubscriptionModel');
const mongoose = require('mongoose');

// @desc    Get the average time a user has spent at the gym
// @route   POST /api/statistics/getAverageTime/
// @access  PRIVATE
const getAverageTime = asyncHandler(async (req, res) => {
    const subID = req.body.genericID;
    try {
        const subscriptionObjectId = new mongoose.Types.ObjectId(subID);
        const results = await UserEntry.aggregate([
            {
                $match: {
                    subID: subscriptionObjectId 
                }
            },
            {
                $lookup: {
                    from: 'userexits', 
                    localField: '_id',
                    foreignField: 'entryID',
                    as: 'exitInfo'
                }
            },
            { $unwind: '$exitInfo' },
            {
                $project: {
                    userID: 1,
                    duration: { $subtract: ['$exitInfo.exitedAt', '$enteredAt'] }
                }
            },
            {
                $group: {
                    _id: '$userID',
                    averageDuration: { $avg: '$duration' }
                }
            }
        ]);

        const formatDuration = (milliseconds) => {
            let seconds = Math.floor(milliseconds / 1000);
            let minutes = Math.floor(seconds / 60);
            let hours = Math.floor(minutes / 60);
            seconds = seconds % 60;
            minutes = minutes % 60;
            return `${hours}:${minutes}:${seconds}`;
        };
        const formattedResults = results.map(result => ({
            userID: result._id.toString(), 
            averageDuration: formatDuration(result.averageDuration)
        }));

        return res.status(200).json({
            averageDuration: formattedResults[0].averageDuration
        });
    } catch (error) {
        return res.status(200).json({avgTimeSpent: "00:00:00"});
    }
});

// @desc    Get the spent time of each entry
// @route   POST /api/statistics/getTimeSpentEveryDay/
// @access  PRIVATE
const getTimeSpentEveryDay = asyncHandler(async (req, res) => {
    const { userID, genericID } = req.body;
    const subID = genericID;
    try {
        const userIdObjectId = new mongoose.Types.ObjectId(userID);
        const subIdObjectId = new mongoose.Types.ObjectId(subID);

        const results = await UserEntry.aggregate([
            {
                $match: {
                    userID: userIdObjectId,
                    subID: subIdObjectId 
                }
            },
            {
                $lookup: {
                    from: 'userexits', 
                    localField: '_id',
                    foreignField: 'entryID',
                    as: 'exitInfo'
                }
            },
            { $unwind: '$exitInfo' },
            {
                $project: {
                    userID: 1,
                    subID: 1,
                    entryTime: '$enteredAt',
                    exitTime: '$exitInfo.exitedAt',
                    duration: { $subtract: ['$exitInfo.exitedAt', '$enteredAt'] }
                }
            },
            {
                $addFields: {
                    formattedDuration: {
                        $concat: [
                            { $toString: { $floor: { $divide: ["$duration", 3600000] } } }, "h ",
                            { $toString: { $floor: { $mod: [{ $divide: ["$duration", 60000] }, 60] } } }, "m ",
                            { $toString: { $floor: { $mod: [{ $divide: ["$duration", 1000] }, 60] } } }, "s"
                        ]
                    }
                }
            }
        ]);

        return res.status(200).json({
            UserEntries: results
        });
    } catch (error) {
        console.error('Error calculating total time spent for each entry:', error);
        return res.status(500).json({ message: 'Failed to calculate total time spent', error: error });
    }
});

// @desc    Get the number of days that the user has visited the gym
// @route   POST /api/statistics/getDaysVisted/
// @access  PRIVATE
const getDaysVisted = asyncHandler(async (req, res) => {
    const { userID, genericID } = req.body;
    const subID = genericID;

    try {
        const subscription = await UserSubscription.findOne({ _id: subID, userID: userID });
        if (!subscription) {
            return res.status(404).json({ message: "Subscription not found or does not belong to the user." });
        }

        const { startDate, endDate } = subscription;
        const results = await UserEntry.aggregate([
            {
                $match: {
                    userID: new mongoose.Types.ObjectId(userID),
                    enteredAt: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$enteredAt" },
                        month: { $month: "$enteredAt" },
                        day: { $dayOfMonth: "$enteredAt" },
                    }
                }
            },
            {
                $count: "distinctDaysVisited"
            }
        ]);
        const daysVisited = results.length > 0 ? results[0].distinctDaysVisited : 0;
        return res.status(200).json({
            days: daysVisited
        });
    } catch (error) {
        console.error('Error retrieving number of days visited:', error);
        return res.status(500).json({ message: 'Failed to retrieve days visited', error: error });
    }
});

// @desc    Get the number of days that the user has not visited the gym
// @route   POST /api/statistics/getDaysNotVisted/
// @access  PRIVATE
const getDaysNotVisted = asyncHandler(async (req, res) => {
    const { userID, genericID } = req.body;

    try {
        const subscription = await UserSubscription.findOne({ _id: genericID, userID: userID });
        if (!subscription) {
            return res.status(404).json({ message: "Subscription not found or does not belong to the user." });
        }
        const start = new Date(subscription.startDate);
        start.setUTCHours(0, 0, 0, 0);  // Normalize start to the beginning of the start day in UTC
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);  // Normalize today to the beginning of today in UTC

        // Aggregate to calculate the distinct days the user has visited the gym
        const visitedDays = await UserEntry.aggregate([
            {
                $match: {
                    userID: new mongoose.Types.ObjectId(userID),
                    subID: new mongoose.Types.ObjectId(genericID),
                    hasExisted: true, // Consider only entries where the user has exited
                    enteredAt: { $gte: start, $lte: today }
                }
            },
            {
                $project: {
                    // Format enteredAt to 'YYYY-MM-DD' to ensure distinct day counting
                    enteredDay: { $dateToString: { format: "%Y-%m-%d", date: "$enteredAt", timezone: "UTC" } }
                }
            },
            {
                $group: {
                    _id: "$enteredDay"
                }
            }
        ]);

        const daysVisitedCount = visitedDays.length;
        const totalDays = Math.ceil((today - start) / (1000 * 60 * 60 * 24)); // Total days from start to today
        const daysNotVisited = totalDays - daysVisitedCount; // Calculate days not visited

        return res.status(200).json({
            days: daysNotVisited
        });
    } catch (error) {
        console.error('Error calculating days not visited:', error);
        return res.status(500).json({ message: 'Failed to calculate days not visited', error: error });
    }
});


// @desc    Get the number of days that the user has on his subscription
// @route   POST /api/statistics/getDaysLeft/
// @access  PRIVATE
const getDaysLeft = asyncHandler(async (req, res) => {
    const { userID, genericID } = req.body;
    const subID = genericID;

    try {
        const subscription = await UserSubscription.findOne({ _id: subID, userID: userID });
        if (!subscription) {
            return res.status(404).json({ message: "Subscription not found or does not belong to the user." });
        }
        const { endDate } = subscription;
        const end = new Date(endDate);
        const today = new Date();
        const daysLeft = Math.max(0, Math.ceil((end - today) / (1000 * 60 * 60 * 24)));
        return res.status(200).json({
            days: daysLeft
        });
    } catch (error) {
        console.error('Error calculating days left in subscription:', error);
        return res.status(500).json({ message: 'Failed to calculate days left', error: error });
    }
});


module.exports = {getAverageTime, getTimeSpentEveryDay, getDaysVisted, getDaysNotVisted, getDaysLeft};