const db = require('./db');

async function getRents() {
    const rows = await db.query('SELECT * FROM rents');
    return rows;
}

async function getRentsByUserID(userID) {
    const rows = await db.query('SELECT r.*, p.place_name FROM rents r INNER JOIN place p ON r.PlaceID = p.PlaceID WHERE r.UserID = ?', [parseInt(userID)]);
    return rows;
  }

// async function createRent(userID, placeID, startDate, endDate) {
//     try {
//         const [place] = await db.query(
//             'SELECT price, owner_name, phone_number FROM place WHERE PlaceID = ?',
//             [placeID]
//         );
//         const [user] = await db.query(
//             'SELECT first_name, last_name, phone_number FROM users WHERE ID = ?',
//             [userID]
//         );
        
//         const start = new Date(startDate);
//         const end = new Date(endDate);
//         const duration = (end - start) / (1000 * 60 * 60);

//         const totalAmount = place.price * duration;

//         const result = await db.query('INSERT INTO rents (UserID, PlaceID, OwnerPhoneNumber, UserName, UserPhoneNumber, StartDate, EndDate, TotalAmount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
//         [
//             userID,
//             placeID,
//             place.phone_number,
//             `${user.first_name} ${user.last_name}`,
//             user.phone_number,
//             startDate,
//             endDate,
//             totalAmount
//         ]);

//         return result;
//     } catch (error) {
//         throw error;
//     }
// }

async function createRent(userID, placeID, startDate, endDate) {
    try {
      // Konvertáljuk a dátumformátumot
      const start = new Date(startDate);
      const end = new Date(endDate);
      const startString = start.toISOString().replace('T', ' ').replace('Z', '');
      const endString = end.toISOString().replace('T', ' ').replace('Z', '');
  
      const [place] = await db.query(
        'SELECT price, owner_name, phone_number FROM place WHERE PlaceID = ?',
        [placeID]
      );
      const [user] = await db.query(
        'SELECT first_name, last_name, phone_number FROM users WHERE ID = ?',
        [userID]
      );
  
      const duration = (end - start) / (1000 * 60 * 60);
  
      const totalAmount = place.price * duration;
  
      const result = await db.query('INSERT INTO rents (UserID, PlaceID, OwnerPhoneNumber, UserName, UserPhoneNumber, StartDate, EndDate, TotalAmount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          userID,
          placeID,
          place.phone_number,
          `${user.first_name} ${user.last_name}`,
          user.phone_number,
          startString,
          endString,
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
        return { message: 'Rent deleted successfully' };
    } catch (error) {
        throw error;
}}

async function updateRent(userID, RentID,startDate, endDate, status, ) 
{ 
    console.log("updateRent", startDate, endDate, status,userID, RentID );
    try {
        const result = await db.query('UPDATE rents SET StartDate = ?, EndDate = ?, status = ? WHERE UserID = ? AND RentID = ?', [startDate, endDate, status, userID, RentID]);
        return { message: 'Rent updated successfully' };
    } catch (error) {
        throw error;
    }
}

async function getStatus(userID, RentID) {
    try {
        const result = await db.query('SELECT status FROM rents WHERE UserID = ? AND RentID = ?', [userID, RentID]);
        return result;
    } catch (error) {
        throw error;
    }
}


module.exports = {
    getRents,
    getRentsByUserID,
    createRent,
    cancelRent,
    updateRent,
    getStatus
};
