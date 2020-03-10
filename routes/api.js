const express = require('express');
const router = express.Router();

const fileCtrl = require('../controllers/file')();

router.post('/api/file', (req, res) => {
    fileCtrl.upload({req}, (pto) => {
        res.json(pto);
    });
});

router.get('/api/file/:id', (req, res) => {
    fileCtrl.preview({req}, (pto) => {
        res.json(pto);
    })
});

module.exports = router;