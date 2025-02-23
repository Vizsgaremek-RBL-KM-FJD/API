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

router.delete('/:id', async (req, res, next) => {
    try {
        res.json(await places.deletePlace(req.params.id));
    } catch (err) {
        next(err);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        res.json(await places.updatePlace(req.params.id, req.body));
    } catch (err) {
        next(err);
    }
});

router.post('/create', async (req, res, next) => {
    try {
        const { userId, address, placeName, price } = req.body;
        res.json(await places.createPlace(userId, address, placeName, price));
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
      const id = req.params.id;
      const place = await places.getPlaceById(id);
      res.json(place);
    } catch (err) {
      next(err);
    }
  });

module.exports = router;
