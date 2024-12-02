const db = require('./db');

async function getDatas() {
    const rows = db.query(
        "SELECT * FROM users"
    )
    return rows?rows:[];
}

async function create(user) {
    console.log("User?",user);

    const result = await db.query(`
        INSERT INTO users (first_name, last_name, gender, email, address, phone_number) values (?, ?, ?, ?, ?, ?)`,
        [user.first_name, user.last_name, user.gender, user.email, user.address, user.phone_number])

        let message = "User can not be created";
        if (result.affectedRows) {
            message = "User created successfully";
        }
        return {message};
}

async function update(id, user) {
    const result = await db.query(`
        UPDATE users SET first_name = ?, last_name = ?, gender = ?, email = ?, address = ?, phone_number = ? WHERE id = ?`,
        [user.first_name, user.last_name, user.gender, user.email, user.address, user.phone_number, id])

        let message = "User can not be updated";
        if (result.affectedRows) {
            message = "User updated successfully";
        }
        return {message};
}

async function remove(id) {
    const result = await db.query(`
        DELETE FROM users WHERE id = ?`,
        [id])

    let message = "User can not be deleted";
    if (result.affectedRows) {
        message = "User deleted successfully";
    }
    return {message};
}

async function patch(id,user) {
    let fields = OBject.keys(user).nap((field)=>field+"=?").join(", ");
    let updateValues = Object.values(user);
    updateValues.push(id);

    const result = await db.query(`
        UPDATE users SET ${fields} WHERE id = ?`,
        updateValues)

    let message = "User can not be updated due to patch";
    if (result.affectedRows) {
        message = "User updated successfully due to patch";
    }
        return {message};
}

module.exports = {
    getDatas,
    create,
    update,
    remove,
    patch
}