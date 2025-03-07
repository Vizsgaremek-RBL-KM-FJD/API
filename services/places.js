const db = require('./db');

async function getAllPlaces() {
    const rows = await db.query('SELECT * FROM place');
    return rows;
}

async function getPlaceById(id) {
    const rows = await db.query('SELECT * FROM place WHERE UserID = ?', [id]);
    return rows;
}

async function deletePlace(id) {
    const result = await db.query('DELETE FROM place WHERE PlaceID = ?', [id]);
    return { message: 'Place deleted successfully' };
}

async function updatePlace(id, place) {
    const result = await db.query('UPDATE place SET address = ?, place_name = ?, price = ?, status=? WHERE PlaceID = ?', [place.address, place.place_name, place.price, place.status, id]);
    return { message: 'Place updated successfully' };
}

async function createPlace(userId, address, placeName, price) {
    const userResult = await db.query('SELECT first_name, last_name, phone_number FROM users WHERE ID = ?',
        [userId]
    );

    console.log("SQL lekérdezés eredménye:", userResult);
    if (userResult.length === 0) {
        throw new Error('Felhasználó nem található', Error);
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
    getPlaceById,
    createPlace,
    deletePlace,
    updatePlace
};
