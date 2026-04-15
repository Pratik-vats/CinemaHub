const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  seatNumber: { type: String, required: true },
  isBooked: { type: Boolean, default: false },
}, { _id: false });

const showSchema = new mongoose.Schema(
  {
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true,
    },
    time: {
      type: String, // e.g. "10:00 AM"
      required: true,
    },
    screen: {
      type: String,
      default: 'Screen 1',
    },
    seats: [seatSchema],
  },
  { timestamps: true }
);

// Index for fast lookups
showSchema.index({ movieId: 1, date: 1 });

module.exports = mongoose.model('Show', showSchema);
