const db = require('./db');

async function getAllPlaces() {
    const rows = await db.query('SELECT * FROM place');
    return rows;
}

async function deletePlace(id) {
    const result = await db.query('DELETE FROM place WHERE PlaceID = ?', [id]);
    return { message: 'Place deleted successfully' };
}

async function updatePlace(id, place) {
    const result = await db.query('UPDATE place SET address = ?, place_name = ?, price = ? WHERE PlaceID = ?', [place.address, place.place_name, place.price, id]);
    return { message: 'Place updated successfully' };
}

async function createPlace(userId, address, placeName, price) {
    const userResult = await db.query('SELECT first_name, last_name, phone_number FROM users WHERE ID = ?',
        [userId]
    );

    if (userResult.length === 0) {
        throw new Error('Felhasználó nem található');
    }

    const { first_name, last_name, phone_number } = userResult[0];
    const ownerName = `${first_name} ${last_name}`;

    const result = await db.query(
        'INSERT INTO place (UserID, owner_name, phone_number, address, place_name, price) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, ownerName, phone_number, address, placeName, price]
    );

    return { message: 'Place created successfully', placeId: result.insertId };
}

module.exports = {
    getAllPlaces,
    createPlace,
    deletePlace,
    updatePlace
};
