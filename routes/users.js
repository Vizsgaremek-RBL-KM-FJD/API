const express = require('express');
const router = express.Router();
const users = require('../services/users');

router.get('/', async function(req, res, next) {
    try {
        res.json(await users.getDatas());
    }
    catch (err) {
        next(err);
    }
})

router.post ('/register', async function(req, res, next) {
    try {
        res.json(await users.create(req.body));
    }
    catch (err) {
        next(err);
    }
})

router.put ('/:id', async function(req, res, next) {
    try {
        res.json(await users.update(req.params.id, req.body));
    }
    catch (err) {
        next(err);
    }
})

router.delete ('/:id', async function(req, res, next) {
    try {
        res.json(await users.remove(req.params.id));
    }
    catch (err) {
        next(err);
    }
})

router.patch ('/:id', async function(req, res, next) {
    try {
        res.json(await users.patch(req.params.id, req.body));
    }
    catch (err) {
        next(err);
    }
})

module.exports = router;