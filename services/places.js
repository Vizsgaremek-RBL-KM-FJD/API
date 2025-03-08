const db = require('./db');
const path = require('path');
const fs = require('fs');

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
async function updatePlace(id, place, image) {
    let imagePath = null;
    if (image) {
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const fileName = `${Date.now()}-${image.originalname}`;
        imagePath = `/uploads/${fileName}`;

        // Kép mentése
        fs.writeFileSync(path.join(uploadDir, fileName), image.buffer);
    }

    const result = await db.query(
        'UPDATE place SET address = ?, place_name = ?, price = ?, status = ?, image_path = COALESCE(?, image_path) WHERE PlaceID = ?',
        [place.address, place.place_name, place.price, place.status, imagePath, id]
    );
    return { message: 'Place updated successfully' };
}

async function createPlace(userId, address, placeName, price, image) {
    // Felhasználó adatainak lekérése
    const userResult = await db.query(
        'SELECT first_name, last_name, phone_number FROM users WHERE ID = ?',
        [userId]
    );

    console.log("SQL lekérdezés eredménye:", userResult);
    if (userResult.length === 0) {
        throw new Error('Felhasználó nem található');
    }

    const { first_name, last_name, phone_number } = userResult[0];
    const ownerName = `${first_name} ${last_name}`;

    // Ha van kép, mentsük el és állítsuk be az elérési útját
    let imagePath = null;
    if (image) {
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const fileName = `${Date.now()}-${image.originalname}`;
        imagePath = `/uploads/${fileName}`;

        // Kép mentése
        fs.writeFileSync(path.join(uploadDir, fileName), image.buffer);
    }

    // Adatbázisba írás
    const result = await db.query(
        'INSERT INTO place (UserID, owner_name, phone_number, address, place_name, price, image_path) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [userId, ownerName, phone_number, address, placeName, price, imagePath]
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
