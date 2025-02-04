const express = require('express');
const router = express.Router();
const { registerUser } = require('../services/auth');

/**
 * Regisztrációs végpont
 */
router.post('/register', async (req, res) => {
    const { first_name, last_name, gender, email, address, phone_number, password } = req.body;

    if (!first_name || !last_name || !gender || !email || !address || !phone_number || !password) {
        return res.status(400).json({ message: 'Minden mező kitöltése kötelező!' });
    }

    const result = await registerUser(first_name, last_name, gender, email, address, phone_number, password);

    if (result.success) {
        res.status(201).json({ message: result.message });
    } else {
        res.status(400).json({ message: result.message });
    }
});

module.exports = router;
