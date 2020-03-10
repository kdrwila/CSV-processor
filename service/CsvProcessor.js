const lineReader = require('line-reader');

class CsvProcessor {
    constructor(file) {
        this.file = file;
    }

    process(callback) {
        let header = '';
        let beginning = [];

        let x = 0;
        lineReader.eachLine(this.file.path, (line) => {
            if (!x)
                header = line;
            else {
                beginning.push(line);

                if (x >= 5) {
                    callback({header, beginning});
                    return false;
                }
            }

            x++;
        });
    }
}

module.exports = CsvProcessor;