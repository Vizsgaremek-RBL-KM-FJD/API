const db = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function getDatas() {
    const rows = await db.query("SELECT * FROM users");
    return rows ? rows : [];
}

async function create(user) {
    console.log("User?", user);
    
    const result = await db.query(
        `INSERT INTO users (first_name, last_name, gender, email, address, phone_number, password) values (?, ?, ?, ?, ?, ?, ?)`,
        [user.first_name, user.last_name, user.gender, user.email, user.address, user.phone_number, user.password]
    );

    let message = "User can not be created";
    if (result.affectedRows) {
        message = "User created successfully";
    }
    return { message };
}

async function getMail(email){
    const query = `select * from users where email=?`
    const params = [email]
    try{
        const [row] = await db.query(query, params)
        if (!row) throw new Error("A felhasználó nem található!")
        return row
    }
    catch(error){
        throw new Error("Az adatbázis nem elérhető!")
    }
}


async function update(id, user) {
    console.log("eljárás elindlt")
    
    const string = `UPDATE users SET first_name = ?, last_name = ?, gender = ?, email = ?, address = ?, phone_number = ?, active = ?, isAdmin = ? WHERE id = ? `
    console.log(string)
    const result = await db.query(
        `UPDATE users SET first_name = ?, last_name = ?, gender = ?, email = ?, address = ?, phone_number = ?, active = ?, isadmin = ? WHERE id = ? `,
        [user.first_name, user.last_name, user.gender, user.email, user.address, user.phone_number, user.active, user.isadmin, id]
    );
    console.log("Result:::",result)
    let message = "User can not be updated";
    if (result.affectedRows) {
        message = "User updated successfully";
    }
    return { message };
}

async function updateToken( id, resetPasswordToken, resetPassswordExpires) {
    const result = await db.query(`UPDATE users SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE id = ?`, [resetPasswordToken, resetPassswordExpires, id]);

    let message = "User can not be updated";
    if (result.affectedRows) {
        message = "User updated successfully";
    }
    return { message };
} 

async function remove(id) {
    const result = await db.query(`DELETE FROM users WHERE id = ?`, [id]);

    let message = "User can not be deleted";
    if (result.affectedRows) {
        message = "User deleted successfully";
    }
    return { message };
}



async function patch(id, user) {
    let fields = Object.keys(user).map((field) => field + "=?").join(", ");
    let updateValues = Object.values(user);
    updateValues.push(id);

    const result = await db.query(
        `UPDATE users SET ${fields} WHERE id = ?`,
        updateValues
    );

    let message = "User can not be updated due to patch";
    if (result.affectedRows) {
        message = "User updated successfully due to patch";
    }
    return { message };
}

async function isAdmin(id) {
    const rows = await db.query("SELECT isAdmin FROM users WHERE id = ?", [id]);
    return rows ? rows[0].isAdmin === 1 : false;
}

async function getById(id) {
    const rows = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    return rows ? rows[0] : null;
}



async function getByResetPasswordToken(token) {
    const rows = await db.query("SELECT * FROM users WHERE resetPasswordToken = ?", [token]);
    return rows ? rows[0] : null;
}

async function resetPassword(resetPasswordToken, password) {
    const user = await getByResetPasswordToken(resetPasswordToken);
    if (!user) {
      return { message: "Invalid reset password token" };
    }
  
    const expiresDate = new Date(user.resetPasswordExpires);
    const currentDate = new Date();
    if (expiresDate < currentDate) {
      return { message: "Reset password token has expired" };
    }
  
    const rows = await db.query("UPDATE users SET password = ? WHERE resetPasswordToken =? ", [password, resetPasswordToken]);
  
    let message = "User can not be updated";
    if (rows.affectedRows) {
      message = "User updated successfully";
      await db.query("UPDATE users SET resetPasswordToken = NULL, resetPasswordExpires = NULL WHERE resetPasswordToken =? ", [resetPasswordToken]);
    }
    return { message };
  }


module.exports = {
    getDatas,
    getMail,
    create,
    update,
    remove,
    patch,
    isAdmin,
    getById,
    getByResetPasswordToken,
    updateToken,
    resetPassword
};
