const express = require('express');
const router = express.Router();
const rents = require('../services/rents');

router.get('/', async (req, res, next) => {
  try {
    res.json(await rents.getRents());
} catch (err) {
    next(err);
}
});

router.get('/:id', async (req, res, next) => {
  const userID = req.params.id;
    try {
        const rent = await rents.getRentsByUserID(userID);
        res.json(rent);
    } catch (err) {
        next(err);
    }
});


router.post('/', async (req, res, next) => {
    console.log('Request body:', req.body); // add this line
    const { userID, placeID, startDate, endDate } = req.body;
    try {
      const result = await rents.createRent(userID, placeID, startDate, endDate);
      res.json({ message: 'Rent successfully created', result });
    } catch (err) {
      console.error('Error creating rent:', err);
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

router.delete('/:userID/:rentID', async (req, res, next) => {
    try {
        res.json(await rents.cancelRent(req.params.userID, req.params.rentID));
    } catch (err) {
        next(err);
    }
});

router.put('/:userID/:rentID', async (req, res, next) => {
    console.log(req.params, req.body)
    try {
        res.json(await rents.updateRent(req.params.userID, req.params.rentID, req.body.startDate, req.body.endDate));
    } catch (err) {
        next(err);
    }
});

router.patch('/:rentID', async (req, res, next) => {
    try {
        res.json(await rents.updateStatus(req.params.rentID, req.body.status));
    } catch (err) {
        next(err);
    }
});

router.get('/:userID/:rentID', async (req, res, next) => {
    const userID = req.params.userID;
    try {
        const rents = await rents.getStatus(userID);
        res.json(rents);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
