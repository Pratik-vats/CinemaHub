const express = require('express');
const router = express.Router();
const {
  getAllMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie,
} = require('../controllers/movieController');

router.route('/').get(getAllMovies).post(createMovie);
router.route('/:id').get(getMovie).put(updateMovie).delete(deleteMovie);

module.exports = router;
