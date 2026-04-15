const Show = require('../models/Show');
const Movie = require('../models/Movie');

const TIME_SLOTS = ['10:00 AM', '1:30 PM', '6:00 PM', '9:30 PM'];
const ROWS = ['A', 'B', 'C', 'D', 'E', 'F'];
const COLS = 8;

function generateSeats() {
  const seats = [];
  for (const row of ROWS) {
    for (let col = 1; col <= COLS; col++) {
      seats.push({ seatNumber: `${row}${col}`, isBooked: false });
    }
  }
  return seats;
}

// Generate local date string (YYYY-MM-DD) to avoid timezone issues
function getLocalDateString(daysFromToday) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromToday);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Auto-create shows for a movie for the next 7 days
async function ensureShowsExist(movieId) {
  const today = getLocalDateString(0);

  // Check if there are any shows for today or later
  const futureShows = await Show.countDocuments({
    movieId,
    date: { $gte: today },
  });

  if (futureShows > 0) return; // Shows already exist

  // No future shows — generate them for the next 7 days
  const shows = [];
  let screenCounter = 0;
  for (let day = 0; day < 7; day++) {
    for (const time of TIME_SLOTS) {
      shows.push({
        movieId,
        date: getLocalDateString(day),
        time,
        screen: `Screen ${(screenCounter % 3) + 1}`,
        seats: generateSeats(),
      });
      screenCounter++;
    }
  }
  await Show.insertMany(shows);
  console.log(`Auto-generated ${shows.length} shows for movie ${movieId}`);
}

// GET shows for a movie on a specific date
exports.getShows = async (req, res) => {
  try {
    const { movieId, date } = req.query;
    if (!movieId) {
      return res.status(400).json({ success: false, message: 'movieId is required' });
    }

    // Auto-generate shows if none exist for upcoming dates
    await ensureShowsExist(movieId);

    const query = { movieId };
    if (date) query.date = date;

    const shows = await Show.find(query)
      .populate('movieId', 'title posterUrl')
      .sort({ date: 1, time: 1 });

    res.json({ success: true, data: shows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET single show with full seat map
exports.getShow = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movieId', 'title posterUrl genre duration language');

    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    res.json({ success: true, data: show });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
