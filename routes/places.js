const express = require('express');
const router = express.Router();
const places = require('../services/places');


router.get('/', async (req, res, next) => {
    try {
        res.json(await places.getAllPlaces());
    } catch (err) {
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const { userId, address, placeName, price } = req.body;
        res.json(await places.createPlace(userId, address, placeName, price));
    } catch (err) {
        next(err);
    }
});

module.exports = router;
