const Booking = require('../models/Booking');
const Movie = require('../models/Movie');
const User = require('../models/User');
const Show = require('../models/Show');
const { awardPoints } = require('../services/rewardService');

const TICKET_PRICE = parseInt(process.env.TICKET_PRICE) || 200;

// POST create booking (with seat selection)
exports.createBooking = async (req, res) => {
  try {
    const { userId, movieId, showId, seats, redeemPoints: pointsToRedeem } = req.body;

    // Validate user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Validate movie
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    // Determine ticket count from seats or fallback
    const tickets = seats && seats.length > 0 ? seats.length : (req.body.tickets || 1);

    if (tickets < 1 || tickets > 10) {
      return res.status(400).json({ success: false, message: 'Tickets must be between 1 and 10' });
    }

    // If showId + seats provided, validate and mark seats booked
    if (showId && seats && seats.length > 0) {
      const show = await Show.findById(showId);
      if (!show) {
        return res.status(404).json({ success: false, message: 'Show not found' });
      }

      // Check if any selected seat is already booked
      const alreadyBooked = show.seats.filter(
        (s) => seats.includes(s.seatNumber) && s.isBooked
      );
      if (alreadyBooked.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Seats already booked: ${alreadyBooked.map((s) => s.seatNumber).join(', ')}`,
        });
      }

      // Mark seats as booked
      show.seats.forEach((s) => {
        if (seats.includes(s.seatNumber)) {
          s.isBooked = true;
        }
      });
      await show.save();
    }

    let totalAmount = tickets * TICKET_PRICE;
    let discount = 0;
    let pointsRedeemed = 0;

    // Handle points redemption
    if (pointsToRedeem && pointsToRedeem > 0) {
      if (pointsToRedeem > user.rewardPoints) {
        return res.status(400).json({ success: false, message: 'Insufficient reward points' });
      }
      if (pointsToRedeem < 100) {
        return res.status(400).json({ success: false, message: 'Minimum 100 points required' });
      }

      discount = Math.floor(pointsToRedeem * 0.5);
      if (discount > totalAmount) discount = totalAmount;
      totalAmount -= discount;
      pointsRedeemed = pointsToRedeem;

      const { redeemPoints: redeemFn } = require('../services/rewardService');
      await redeemFn(userId, pointsToRedeem);
    }

    // Generate mock payment ID
    const paymentId = 'PAY_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6).toUpperCase();

    // Create booking
    const booking = await Booking.create({
      userId,
      movieId,
      showId: showId || undefined,
      seats: seats || [],
      tickets,
      totalAmount,
      pointsRedeemed,
      discount,
      paymentId,
      status: 'Active',
    });

    // Award points
    const { points: pointsEarned } = await awardPoints(userId, tickets, booking._id);
    booking.pointsEarned = pointsEarned;
    await booking.save();

    // Populate for response
    const populatedBooking = await Booking.findById(booking._id)
      .populate('movieId', 'title posterUrl genre')
      .populate('showId', 'date time screen')
      .populate('userId', 'name email rewardPoints');

    res.status(201).json({
      success: true,
      data: {
        booking: populatedBooking,
        pointsEarned,
        discount,
        message: `Booking confirmed! You earned ${pointsEarned} reward points.`,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST cancel booking (within 10 minutes)
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.status === 'Cancelled') {
      return res.status(400).json({ success: false, message: 'Booking already cancelled' });
    }

    // Check 10-minute window
    const now = new Date();
    const bookingTime = new Date(booking.createdAt);
    const diffMinutes = (now - bookingTime) / (1000 * 60);

    if (diffMinutes > 10) {
      return res.status(400).json({
        success: false,
        message: 'Cancellation window expired (10 minutes)',
      });
    }

    // Free seats in the show
    if (booking.showId && booking.seats.length > 0) {
      const show = await Show.findById(booking.showId);
      if (show) {
        show.seats.forEach((s) => {
          if (booking.seats.includes(s.seatNumber)) {
            s.isBooked = false;
          }
        });
        await show.save();
      }
    }

    // Refund reward points earned (deduct them)
    if (booking.pointsEarned > 0) {
      await User.findByIdAndUpdate(booking.userId, {
        $inc: { rewardPoints: -booking.pointsEarned },
      });
    }

    // Restore redeemed points
    if (booking.pointsRedeemed > 0) {
      await User.findByIdAndUpdate(booking.userId, {
        $inc: { rewardPoints: booking.pointsRedeemed },
      });
    }

    booking.status = 'Cancelled';
    await booking.save();

    const updatedUser = await User.findById(booking.userId);

    res.json({
      success: true,
      data: {
        booking,
        refundedPoints: booking.pointsRedeemed,
        deductedPoints: booking.pointsEarned,
        currentPoints: updatedUser.rewardPoints,
        message: 'Booking cancelled successfully. Points adjusted.',
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET user bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId })
      .populate('movieId', 'title posterUrl genre duration')
      .populate('showId', 'date time screen')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
