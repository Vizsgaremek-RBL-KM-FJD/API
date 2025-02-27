const express = require('express');
const router = express.Router();
const rents = require('../services/rents');

router.get('/', async (req, res, next) => {
    try {
        const rentsList = await rents.getRents();
        res.json(rentsList);
    } catch (err) {
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    const { userID, placeID, startDate, endDate } = req.body;
    try {
        const result = await rents.createRent(userID, placeID, startDate, endDate);
        res.json({ message: 'Rent successfully created', result });
    } catch (err) {
        next(err);
    }
});


router.post('/check-availability', async (req, res, next) => {
    const { date, time, placeID } = req.body;
    try {
      const rentsList = await rents.getRents();
      const conflicts = rentsList.filter(rent => rent.placeID === placeID && rent.startDate <= date && rent.endDate >= date);
      if (conflicts.length > 0) {
        res.json({ success: false, message: 'Room is not available for rent!' });
      } else {
        res.json({ success: true, message: 'Room is available for rent!' });
      }
    } catch (err) {
      next(err);
    }
  });

module.exports = router;
