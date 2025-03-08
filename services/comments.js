const db = require('./db');

async function createComment(placeID, userID, username, text) {
    console.log('Create comment parameters:', placeID, userID, username, text);
    try {
    const result = await db.query(
        'INSERT INTO comments (placeID, userID, username, text) VALUES (?, ?, ?, ?)',
        [placeID, userID, username, text]
    );
    return { message: 'Comment created successfully', commentID: result.insertId };
    } catch (err) {
        console.error('Error creating comment:', err);
        throw new Error('Failed to create comment', err);
    }
}

async function getComments(placeID) {
    try {
        const result = await db.query(
            'SELECT * FROM comments WHERE placeID = ?',
            [placeID]
        );
        return result;
    } catch (err) {
        throw new Error('Failed to get comments', err);
    }
}

async function getAllComments() {
    try {
        const result = await db.query(
            'SELECT * FROM comments'
        );
        return result;
    } catch (err) {
        throw new Error('Failed to get comments', err);
    }
}

module.exports = {
    createComment,
    getComments ,
    getAllComments
};