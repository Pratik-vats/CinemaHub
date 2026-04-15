const express = require('express');
const router = express.Router();
const { getRewards, redeemRewards } = require('../controllers/rewardController');

router.get('/:userId', getRewards);
router.post('/redeem', redeemRewards);

module.exports = router;
