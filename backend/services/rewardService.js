const User = require('../models/User');
const RewardTransaction = require('../models/RewardTransaction');

const POINTS_PER_TICKET = parseInt(process.env.POINTS_PER_TICKET) || 10;
const POINTS_TO_RUPEES = 0.5; // 100 points = ₹50

/**
 * Award points to a user after booking
 */
const awardPoints = async (userId, tickets, bookingId) => {
  const points = tickets * POINTS_PER_TICKET;

  // Update user reward points
  await User.findByIdAndUpdate(userId, {
    $inc: { rewardPoints: points },
  });

  // Create earn transaction
  const transaction = await RewardTransaction.create({
    userId,
    points,
    type: 'EARN',
    description: `Earned ${points} points for booking ${tickets} ticket(s)`,
    bookingId,
  });

  return { points, transaction };
};

/**
 * Redeem points for a discount
 */
const redeemPoints = async (userId, pointsToRedeem) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  if (user.rewardPoints < pointsToRedeem) {
    throw new Error('Insufficient reward points');
  }
  if (pointsToRedeem < 100) {
    throw new Error('Minimum 100 points required for redemption');
  }

  const discount = Math.floor(pointsToRedeem * POINTS_TO_RUPEES);

  // Deduct points
  await User.findByIdAndUpdate(userId, {
    $inc: { rewardPoints: -pointsToRedeem },
  });

  // Create redeem transaction
  const transaction = await RewardTransaction.create({
    userId,
    points: pointsToRedeem,
    type: 'REDEEM',
    description: `Redeemed ${pointsToRedeem} points for ₹${discount} discount`,
  });

  return { discount, transaction };
};

/**
 * Get reward history for a user
 */
const getRewardHistory = async (userId) => {
  return RewardTransaction.find({ userId })
    .sort({ createdAt: -1 })
    .limit(50);
};

module.exports = { awardPoints, redeemPoints, getRewardHistory };
