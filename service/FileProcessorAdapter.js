let CsvProcessor = require('./CsvProcessor');

class FileProcessorAdapter {
    constructor(file) {
        this.file = file;
        this.determineType();
    }

    determineType() {
        switch(this.file.mimetype) {
            case 'text/csv':
                this.type = 'csv';
                break;

            default:
                break;
        }

        if(!this.type) {
            if(this.file.filename.search('.csv') !== -1)
                this.type = 'csv';
        }

        if(!this.type) {
            throw new Error('Uploaded file type [' + this.file.mimetype + '] is not supported by this file processor.');
        }
    }

    process(callback) {
        switch(this.type) {
            case 'csv':
                return (new CsvProcessor(this.file)).process(callback);
        }
    }
}

module.exports = FileProcessorAdapter;