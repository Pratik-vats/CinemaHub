const Movie = require('../models/Movie');
const Show = require('../models/Show');

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

function getDateString(daysFromToday) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromToday);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Auto-create shows for a movie (7 days × 4 time slots)
async function createShowsForMovie(movieId) {
  const shows = [];
  for (let day = 0; day < 7; day++) {
    for (const time of TIME_SLOTS) {
      shows.push({
        movieId,
        date: getDateString(day),
        time,
        screen: `Screen ${(day % 3) + 1}`,
        seats: generateSeats(),
      });
    }
  }
  await Show.insertMany(shows);
  return shows.length;
}

// GET all movies
exports.getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.json({ success: true, data: movies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET single movie
exports.getMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }
    res.json({ success: true, data: movie });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST create movie (+ auto-generate shows)
exports.createMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);

    // Auto-create shows so new movie is immediately bookable
    const showCount = await createShowsForMovie(movie._id);

    res.status(201).json({
      success: true,
      data: movie,
      message: `Movie created with ${showCount} shows generated!`,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT update movie
exports.updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }
    res.json({ success: true, data: movie });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE movie (+ clean up shows)
exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    // Remove associated shows
    await Show.deleteMany({ movieId: movie._id });

    res.json({ success: true, message: 'Movie and its shows deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
