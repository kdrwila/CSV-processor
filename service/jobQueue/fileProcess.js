const Queue = require('bull');
const fs = require('fs');
const s3 = require('../../utils/s3');

const FileProcessorAdapter = require('../FileProcessor/Adapter/FileProcessor');
const File = require('../../models/File');

let fileProcess = new Queue('File process');
let progress = 0;

fileProcess.process('process', true, async (job, done) => {
    progress = 0;

    let file = job.data.file;
    let savedFile = await File.findOne({_id: job.data.savedFile._id.toString()});

    reportProgress(job, 5, savedFile._id.toString());

    // process the file.
    try {
        let fileProcessor = new FileProcessorAdapter(file);
        fileProcessor.process((data) => {
            savedFile.preview = {
                header: data.header,
                beginning: data.beginning
            };
            savedFile.processed = true;

            savedFile.save();
            reportProgress(job, 45, savedFile._id.toString());
        });
    } catch (e) {
        console.error(e.message);
    }

    fs.readFile(file.path, (err, data) => {
        if (err) {
            console.error(err.message);
        }

        reportProgress(job, 10, savedFile._id.toString());

        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: file.filename,
            Body: JSON.stringify(data, null, 2)
        };

        // upload file to aws s3 bucket
        s3.upload(params, function (s3Err, data) {
            if (s3Err) {
                console.error(s3Err.message);
            }

            reportProgress(job, 20, savedFile._id.toString());

            // remove not needed file.
            fs.unlink(file.path, (err) => {
                if (err) throw err;
            });

            // update s3 link in the object.
            savedFile.awsPath = data.Location;
            savedFile.save();

            reportProgress(job, 20, savedFile._id.toString());
            done();
        })
    });
});

/* helper methods */
let reportProgress = function (job, percents, id) {
    const io = require('../../utils/io').io();
    progress += value;

    job.progress(progress);
    io.emit('fileProcessProgress', {progress: progress, id: id});
};

module.exports = fileProcess;