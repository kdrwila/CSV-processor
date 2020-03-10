const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    fileName: String,
    preview: {
        header: String,
        beginning: [String]
    },
    type: String,
    processed: Boolean,
    awsPath: String,
});

module.exports = mongoose.model('File', fileSchema);