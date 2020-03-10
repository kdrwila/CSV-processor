const Queue = require('bull');
const fs = require('fs');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
let FileProcessorAdapter = require('../service/FileProcessorAdapter');

const File = require('../models/File');

let fileProcessQueue = new Queue('File process');

fileProcessQueue.process('process',true, async (job, done) => {
    let file = job.data.file;
    let savedFile = await File.findOne({_id: job.data.savedFile._id.toString()});
    reportProgress(job, 5, savedFile._id.toString());

    try {
        let fileProcessor = new FileProcessorAdapter(file);
        fileProcessor.process((data) => {
            savedFile.preview = {
                header: data.header,
                beginning: data.beginning
            };
            savedFile.processed = true;

            savedFile.save();
            reportProgress(job, 50, savedFile._id.toString());
        });
    } catch (e) {
        console.error(e.message);
    }

    fs.readFile(file.path, (err, data) => {
        if(err) done(err);
        reportProgress(job, 60, savedFile._id.toString());

        const params = {
            Bucket: 'kdrwila-test-bucket',
            Key: file.filename,
            Body: JSON.stringify(data, null, 2)
        };

        s3.upload(params, function(s3Err, data) {
            if(s3Err) done(s3Err);
            reportProgress(job, 80, savedFile._id.toString());
            fs.unlink(file.path, (err) => { if(err) throw err; });
            savedFile.awsPath = data.Location;
            savedFile.save();
            reportProgress(job, 100, savedFile._id.toString());
            done();
        })
    });
});

/* helper methods */
let reportProgress = function(job, value, id) {
    const io = require('../utils/io').io();

    job.progress(value);
    io.emit('fileProcessProgress', {progress: value, id: id});
};

module.exports = fileProcessQueue;