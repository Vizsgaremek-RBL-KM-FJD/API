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
        res.json(await places.createComment(placeID, userID, username, text));
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