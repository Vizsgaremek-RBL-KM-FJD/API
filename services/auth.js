const bcrypt = require('bcrypt');
const db = require('./db');

const saltRounds = 10;


async function registerUser(first_name, last_name, gender, email, address, phone_number, password) {
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (!rows || !Array.isArray(rows)) {
            throw new Error('Database query failed.');
        }
        if (rows.length > 0) {
            return { success: false, message: 'Ez az email cím már foglalt!' };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(
            'INSERT INTO users (first_name, last_name, gender, email, address, phone_number, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [first_name, last_name, gender, email, address, phone_number, hashedPassword]
        );

        return { success: true, message: 'Sikeres regisztráció!' };
    } catch (error) {
        console.error('Database error:', error.message);
        return { success: false, message: 'Szerver hiba történt' };
    }
}


module.exports = {
    registerUser
};
