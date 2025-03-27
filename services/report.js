const db = require('./db'); 

async function getReports() {
    const rows = await db.query('SELECT * FROM reported');
    return rows;
}

async function createReport(report_type, reported_id, reporter_id, report_date, checked, reason, commentID, placeID) {
   try {
        const result = await db.query(
            'INSERT INTO reported (report_type, reported_id, reporter_id, report_date, checked, reason, commentID, placeID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [report_type, reported_id, reporter_id, report_date, checked, reason, commentID, placeID]
        );
        return { message: 'Report created successfully'};
    } catch (err) {
        console.error('Error creating report:', err);
        throw new Error('Failed to create report', err);
   }
}

async function updateChecked(id, checked) {
    try {
        const result = await db.query('UPDATE reported SET checked = ? WHERE id = ?', [checked, id]);
        return { message: 'Report updated successfully' };
    } catch (err) {
        console.error('Error updating report:', err);
        throw new Error('Failed to update report', err);
    }
}


module.exports = {
    getReports,
    createReport,
    updateChecked
};