const db = require('./db');

async function getRents() {
    try {
        const query = `
            SELECT r.RentID, r.UserID, r.PlaceID, r.StartDate, r.EndDate, r.TotalAmount,
                   p.place_name, u.first_name AS user_name, u.phone_number AS user_phone
            FROM rents r
            JOIN place p ON r.placeID = p.PlaceID
            JOIN users u ON r.userID = u.ID
        `;
        const [rows] = await db.query(query);
        return rows?rows:[];
    } catch (err) {
        throw err;
    }
}

async function getRentsByUserID(userID) {
    const rows = await db.query('SELECT r.*, p.place_name FROM rents r INNER JOIN place p ON r.PlaceID = p.PlaceID WHERE r.UserID = ?', [parseInt(userID)]);
    return rows;
  }

async function createRent(userID, placeID, startDate, endDate) {
    try {
        const [place] = await db.query(
            'SELECT price, owner_name, phone_number FROM place WHERE PlaceID = ?',
            [placeID]
        );
        const [user] = await db.query(
            'SELECT first_name, last_name, phone_number FROM users WHERE ID = ?',
            [userID]
        );
        
        const start = new Date(startDate);
        const end = new Date(endDate);
        const duration = (end - start) / (1000 * 60 * 60);

        const totalAmount = place.price * duration;

        const result = await db.query('INSERT INTO rents (UserID, PlaceID, OwnerPhoneNumber, UserName, UserPhoneNumber, StartDate, EndDate, TotalAmount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
            userID,
            placeID,
            place.phone_number,
            `${user.first_name} ${user.last_name}`,
            user.phone_number,
            startDate,
            endDate,
            totalAmount
        ]);

        return result;
    } catch (error) {
        throw error;
    }
}

async function cancelRent(userID, RentID) {
    try {
        const result = await db.query('DELETE FROM rents WHERE UserID = ? AND RentID = ?', [userID, RentID]);
        return result;
    } catch (error) {
        throw error;
}}

module.exports = {
    getRents,
    getRentsByUserID,
    createRent,
    cancelRent
};
