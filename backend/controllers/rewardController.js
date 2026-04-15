const { getRewardHistory, redeemPoints } = require('../services/rewardService');
const User = require('../models/User');

// GET reward history for user
exports.getRewards = async (req, res) => {
  try {
    const history = await getRewardHistory(req.params.userId);
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      data: {
        currentPoints: user.rewardPoints,
        history,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST redeem points
exports.redeemRewards = async (req, res) => {
  try {
    const { userId, points } = req.body;
    const result = await redeemPoints(userId, points);
    const user = await User.findById(userId);

    res.json({
      success: true,
      data: {
        discount: result.discount,
        remainingPoints: user.rewardPoints,
        transaction: result.transaction,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
