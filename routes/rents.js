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

module.exports = router;
