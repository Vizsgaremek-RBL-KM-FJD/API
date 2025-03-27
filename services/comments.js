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

async function getCommentsByUserID(userID) {
    console.log('Getting comments for user ID:', userID);
    try {
      const result = await db.query(
        'SELECT * FROM comments WHERE userID = ?',
        [userID]
      );
      console.log('Comments:', result);
      return result;
    } catch (err) {
      console.error('Error getting comments:', err);
      return [];
    }
  }

async function deleteComment(id) {
    try {
        const result = await db.query(
            'DELETE FROM comments WHERE id = ?',
            [id]
        );
        return { message: 'Comment deleted successfully' };
    } catch (err) {
        console.error('Error deleting comment:', err);
        throw new Error('Failed to delete comment', err);
    }
}

module.exports = {
    createComment,
    getComments ,
    getAllComments,
    getCommentsByUserID,
    deleteComment
};