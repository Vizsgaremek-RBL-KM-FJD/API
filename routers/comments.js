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

router

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

router.get('/user/:userID', async (req, res, next) => {
    try {
        res.json(await places.getCommentsByUserID(req.params.userID));
    } catch (err) {
        next(err);
    }
})

router.delete('/:id', async (req, res, next) => {
    try {
        res.json(await places.deleteComment(req.params.id));
    } catch (err) {
        next(err);
    }
})

module.exports = router;