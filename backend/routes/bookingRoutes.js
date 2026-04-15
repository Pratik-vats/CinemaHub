const express = require('express');
const router = express.Router();
const { createBooking, getUserBookings, cancelBooking } = require('../controllers/bookingController');

router.post('/', createBooking);
router.get('/user/:userId', getUserBookings);
router.post('/:id/cancel', cancelBooking);

module.exports = router;
