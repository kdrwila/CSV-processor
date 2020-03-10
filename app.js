require('dotenv').config();
require('./utils/db');

const express = require('express');
const apiRoutes = require('./routes/api');

const app = express();

const http = require('http').createServer(app);
const io = require('./utils/io').initialize(http);

app.set('io', io);
app.use('/', apiRoutes);

io.on('connection', function(socket) {});

http.listen(3000, () => {});