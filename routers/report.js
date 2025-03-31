const express = require('express');
const router = express.Router();
const report = require('../services/report');

router.get('/', async (req, res, next) => {
    try {
        res.json(await report.getReports());
    } catch (err) {
        next(err);
    }
});

router.post('/create', async (req, res, next) => {
    try {
        const { report_type, reported_id, reporter_id, report_date, checked, reason, commentID, placeID } = req.body;
        res.json(await report.createReport(report_type, reported_id, reporter_id, report_date, checked, reason, commentID, placeID));
    } catch (err) {
        next(err);
    }
})

router.put('/update', async (req, res, next) => {
    try {
        const { id, checked } = req.body;
        res.json(await report.updateChecked(id, checked));
    } catch (err) {
        next(err);
    }
})

router.get('/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        res.json(await report.getreportByID(id));
    } catch (err) {
        next(err);
    }   
});

module.exports = router;