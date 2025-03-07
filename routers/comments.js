const express = require('express');
const router = express.Router();
const places = require('../services/comments');

router.get('/:placeId', async (req, res, next) => {
    try {
        res.json(await places.getComments(req.params.placeId));
    } catch (err) {
        next(err);
    }
});

router.post('/create', async (req, res, next) => {
    try {
        const { placeID, userID, username, text } = req.body;
        res.json(await places.createComment(req.body));
    } catch (err) {
        next(err);
    }
})

router.get('/', async (req, res, next) => {
    try {
        res.json(await places.getAllComments());
    } catch (err) {
        next(err);
    }
})

module.exports = router;

// router.post('/places/:placeId/comments', (req, res) => {
//     console.log('Request reached the route handler');
//     const placeId = req.params.placeId;
//     console.log('Place ID:', placeId);
//     const { user, text } = req.body;
//     console.log('User:', user);
//     console.log('Text:', text);
  
//     const query = `INSERT INTO comments (placeID, user, text) VALUES (?, ?, ?)`;
//     db.query(query, [placeId, user, text], (err, result) => {
//       if (err) {
//         console.error(err);
//         res.status(500).send('Hiba a komment mentésekor.');
//       } else {
//         console.log('Comment inserted successfully');
//         res.status(200).send({ message: 'Komment sikeresen mentve!' });
//       }
//     });
//   });