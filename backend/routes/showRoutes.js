const express = require('express');
const router = express.Router();
const { getShows, getShow } = require('../controllers/showController');

router.get('/', getShows);
router.get('/:id', getShow);

module.exports = router;
