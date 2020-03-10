const File = require('../models/File');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './tmp/uploads');
    },
    filename: function(req, file, callback) {
        const fileName = file.originalname.split('.');
        callback(null, fileName[0] + '-' + Date.now() + '.' + fileName[fileName.length - 1]);
    }
});
const upload = multer({storage}).single('file');

const fileProcessQueue = require('../service/fileProcessQueue');

function FileCtrl() {
    return {
        upload: function (params, cb) {
            let pto = {};

            upload(params.req, params.res, function(err) {
                if(err) {
                    pto.error = "Error while uploading the file.";
                    pto.details = err;
                    return cb(pto);
                }
                pto.success = "File uploaded.";
                const file = params.req.file;

                let savedFile = new File();
                savedFile.fileName = file.filename;
                savedFile.type = 'csv';

                savedFile.save(function(err, object) {
                    if(err) throw err;

                    pto.file = object;
                    fileProcessQueue.add('process',{file, savedFile});

                    cb(pto);
                });
            });
        },
        preview: function(params, cb) {
            let file = File.find({_id: params.req.params.id}, (err, file) => {
                if(err) throw err;

                cb(file);
            });
        }
    }
}

module.exports = FileCtrl;