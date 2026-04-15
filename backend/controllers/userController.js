const User = require('../models/User');
const RewardTransaction = require('../models/RewardTransaction');
const Booking = require('../models/Booking');

// POST register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        rewardPoints: user.rewardPoints,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// POST login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        rewardPoints: user.rewardPoints,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Get recent reward transactions
    const rewardHistory = await RewardTransaction.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    // Get booking count
    const bookingCount = await Booking.countDocuments({ userId: user._id, status: { $ne: 'Cancelled' } });

    // Get total spent (only active bookings)
    const bookings = await Booking.find({ userId: user._id, status: { $ne: 'Cancelled' } });
    const totalSpent = bookings.reduce((sum, b) => sum + b.totalAmount, 0);

    res.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          rewardPoints: user.rewardPoints,
          createdAt: user.createdAt,
        },
        stats: {
          bookingCount,
          totalSpent,
          totalPointsEarned: rewardHistory
            .filter((r) => r.type === 'EARN')
            .reduce((sum, r) => sum + r.points, 0),
        },
        rewardHistory,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
