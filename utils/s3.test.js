const s3 = require('./s3');

test('is s3 initialized properly?', () => {
    expect(s3.config.accessKeyId).toBe(process.env.AWS_ACCESS_KEY);
});