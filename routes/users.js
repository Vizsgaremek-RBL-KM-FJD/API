const express = require('express');
const router = express.Router();
const users = require('../services/users');
const { authenticateToken } = require('../middleware/auth');

router.get('/', async function(req, res, next) {
    try {
        res.json(await users.getDatas());
    }
    catch (err) {
        next(err);
    }
});

router.get('/profile', authenticateToken, async function(req, res, next) { 
    try {
        const userId = req.user.id; 
        const rows = await users.getById(userId);
        if (!rows) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(rows);
    }
    catch (err) {
        next(err);
    }
});

router.post('/register', async function(req, res, next) {
    try {
        res.json(await users.create(req.body));
    }
    catch (err) {
        next(err);
    }
});

router.post('/login', async function(req, res, next) {
    try {
        const result = await users.login(req.body);
        if (result.error) {
            res.status(401).json(result);
        } else {
            res.json(result);
        }
    }
    catch (err) {
        next(err);
    }
});

router.put('/:id', authenticateToken, async function(req, res, next) { 
    try {
        res.json(await users.update(req.params.id, req.body));
    }
    catch (err) {
        next(err);
    }
});

router.delete('/:id', authenticateToken, async function(req, res, next) { 
    try {
        res.json(await users.remove(req.params.id));
    }
    catch (err) {
        next(err);
    }
});

router.patch('/:id', authenticateToken, async function(req, res, next) { 
    try {
        res.json(await users.patch(req.params.id, req.body));
    }
    catch (err) {
        next(err);
    }
});

module.exports = router;
