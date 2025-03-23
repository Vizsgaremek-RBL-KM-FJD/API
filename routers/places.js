const express = require('express');
const router = express.Router();
const places = require('../services/places');
const multer = require('multer');
const path = require('path');
const db = require('../services/db');
const fs = require('fs');

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

// Add a new route to your places.js file
router.delete('/:id/image', async (req, res, next) => {
    try {
      const placeId = req.params.id;
      // Delete the image from the uploads directory
      const uploadDir = path.join(__dirname, '../uploads');
      const imagePath = path.join(uploadDir, placeId);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
      // Update the place image path to null in the database
      const result = await db.query('UPDATE place SET image_path = NULL WHERE PlaceID = ?', [placeId]);
      res.json({ message: 'Image deleted successfully' });
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
