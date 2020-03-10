// Load model
const File = require('../models/File');

// file upload handler and settings.
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './tmp/uploads');
    },
    filename: function (req, file, callback) {
        const fileName = file.originalname.split('.');
        callback(null, fileName[0] + '-' + Date.now() + '.' + fileName[fileName.length - 1]);
    }
});
const upload = multer({storage}).single('file');

// files processing queue
const fileProcessQueue = require('../service/jobQueue/fileProcess');

function FileCtrl() {
    return {
        upload: function (params, callback) {
            let output = {};

            upload(params.req, params.res, function (err) {
                // handle error to output.
                if (err) {
                    return callback({
                        error: "Error while uploading the file.",
                        details: err
                    });
                }

                // save success message.
                output.success = "File uploaded.";
                const file = params.req.file;
                if (!file) {
                    return callback({
                        error: "No file was uploaded!",
                        status: 400
                    });
                }

                // create new object
                let newFile = new File();
                newFile.fileName = file.filename;
                newFile.type = 'csv';

                // save file object
                newFile.save(function (err, object) {
                    if (err) throw err;

                    // pass file object with link
                    output.file = object;
                    output.links = {
                        current: "/api/file/" + newFile.id
                    };

                    // add file process task to queue
                    fileProcessQueue.add('process', {file, savedFile: newFile});

                    callback(output);
                });
            });
        },
        preview: function (params, callback) {
            File.find({_id: params.req.params.id}, (err, file) => {
                // handle error to output
                if (err) {
                    return callback({
                        error: "Error while getting the file object.",
                        details: err
                    });
                }

                // return file
                callback(file);
            });
        }
    }
}

module.exports = FileCtrl;