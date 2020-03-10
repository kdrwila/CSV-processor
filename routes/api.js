const express = require('express');
const router = express.Router();

const fileCtrl = require('../controllers/file')();

router.post('/api/file', (req, res) => {
    fileCtrl.upload({req}, (output) => {
        standardOutputHandle(output, res);
    });
});

router.get('/api/file/:id', (req, res) => {
    fileCtrl.preview({req}, (output) => {
        standardOutputHandle(output, res);
    })
});

module.exports = router;

/* helper functions */
let standardOutputHandle = (output, res) => {
    if (output.error)
        res.status(500);

    if (output.status)
        res.status(output.status);

    if (!Object.keys(output).length)
        res.status(404);

    res.json(output);
};