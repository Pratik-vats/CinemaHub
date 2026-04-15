require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('./models/Movie');
const User = require('./models/User');
const Show = require('./models/Show');
const Booking = require('./models/Booking');
const RewardTransaction = require('./models/RewardTransaction');

const movies = [
  {
    title: 'Dune: Part Two',
    genre: 'Sci-Fi',
    duration: 166,
    description: 'Paul Atreides unites with the Fremen to seek revenge against those who destroyed his family, facing a choice between love and the fate of the universe.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nez7.jpg',
    rating: 8.5,
    language: 'English',
    releaseDate: new Date('2024-03-01'),
  },
  {
    title: 'Oppenheimer',
    genre: 'Drama',
    duration: 180,
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    rating: 8.9,
    language: 'English',
    releaseDate: new Date('2023-07-21'),
  },
  {
    title: 'The Batman',
    genre: 'Action',
    duration: 176,
    description: 'When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city\'s hidden corruption.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg',
    rating: 7.8,
    language: 'English',
    releaseDate: new Date('2022-03-04'),
  },
  {
    title: 'Spider-Man: Across the Spider-Verse',
    genre: 'Animation',
    duration: 140,
    description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    rating: 8.7,
    language: 'English',
    releaseDate: new Date('2023-06-02'),
  },
  {
    title: 'Interstellar',
    genre: 'Sci-Fi',
    duration: 169,
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival amid a dying Earth.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    rating: 8.7,
    language: 'English',
    releaseDate: new Date('2014-11-07'),
  },
  {
    title: 'Inception',
    genre: 'Thriller',
    duration: 148,
    description: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg',
    rating: 8.8,
    language: 'English',
    releaseDate: new Date('2010-07-16'),
  },
  {
    title: 'Jawan',
    genre: 'Action',
    duration: 169,
    description: 'A high-octane action thriller which outlines the emotional journey of a man who is driven to rectify the wrongs in society.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/jFt1gS4BGHlK8xt76Y81Alp4dbt.jpg',
    rating: 7.1,
    language: 'Hindi',
    releaseDate: new Date('2023-09-07'),
  },
  {
    title: 'John Wick: Chapter 4',
    genre: 'Action',
    duration: 169,
    description: 'John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7BUP2LB2af5e.jpg',
    rating: 7.7,
    language: 'English',
    releaseDate: new Date('2023-03-24'),
  },
];

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

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear all data
    await Movie.deleteMany({});
    await User.deleteMany({});
    await Show.deleteMany({});
    await Booking.deleteMany({});
    await RewardTransaction.deleteMany({});
    console.log('Cleared existing data');

    // Seed movies
    const createdMovies = await Movie.insertMany(movies);
    console.log(`✅ Seeded ${createdMovies.length} movies`);

    // Seed shows (7 days × 4 time slots per movie)
    let showCount = 0;
    for (const movie of createdMovies) {
      for (let day = 0; day < 7; day++) {
        for (const time of TIME_SLOTS) {
          await Show.create({
            movieId: movie._id,
            date: getDateString(day),
            time,
            screen: `Screen ${(showCount % 3) + 1}`,
            seats: generateSeats(),
          });
          showCount++;
        }
      }
    }
    console.log(`✅ Seeded ${showCount} shows`);

    // Create demo user
    const demoUser = await User.create({
      name: 'Demo User',
      email: 'demo@cinemahub.com',
      password: 'demo123',
      rewardPoints: 50,
      role: 'user',
    });
    console.log(`✅ Created demo user: ${demoUser.email}`);

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@cinemahub.com',
      password: 'admin123',
      rewardPoints: 0,
      role: 'admin',
    });
    console.log(`✅ Created admin user: ${adminUser.email}`);

    console.log('\n🎬 Database seeded successfully!');
    console.log('  Demo: demo@cinemahub.com / demo123');
    console.log('  Admin: admin@cinemahub.com / admin123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedDB();
