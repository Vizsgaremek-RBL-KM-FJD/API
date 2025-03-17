const express = require('express');
const router = express.Router();
const places = require('../services/places');
const multer = require('multer');

// Képfeltöltés kezelése multer-rel
const storage = multer.memoryStorage(); // Memóriában tároljuk, amíg nem mentjük fájlba
const upload = multer({ storage: storage });

router.post('/create', upload.single('image'), async (req, res, next) => {
    try {
        const { userId, address, placeName, price } = req.body;
        const image = req.file; // Feltöltött kép

        // Hívás a createPlace függvényhez a képpel együtt
        const result = await places.createPlace(userId, address, placeName, price, image);
        res.json(result);
    } catch (err) {
        next(err);
    }
});



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

router.put('/:id', upload.single('image'), async (req, res, next) => {
    try {
        res.json(await places.updatePlace(req.params.id, req.body, req.file));
    } catch (err) {
        next(err);
    }
});

// router.post('/create', async (req, res, next) => {
//     try {
//         const { userId, address, placeName, price } = req.body;
//         res.json(await places.createPlace(userId, address, placeName, price));
//     } catch (err) {
//         next(err);
//     }
// });

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
