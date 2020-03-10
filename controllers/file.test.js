const FileCtrl = require('./file')();

const mockRequest = () => {
    const req = {};
    req.body = jest.fn().mockReturnValue(req);
    req.params = jest.fn().mockReturnValue(req);
    req.headers = jest.fn().mockReturnValue(req);
    return req
};

test('should return error without file', async () => {
    const req = mockRequest();

    await FileCtrl.upload({req}, (output) => {
        expect(output.error).toBeDefined();
        expect(output.error).toBe('No file was uploaded!');
        expect(output.status).toBeDefined();
        expect(output.status).toBe(400);
    });
});

test('should return error when requesting incorrect id on preview', async () => {
    let req = mockRequest();
    req.params.id = 'wont-work';

    await FileCtrl.preview({req}, (output) => {
        expect(output.error).toBeDefined();
        expect(output.error).toBe('Error while getting the file object.')
    })
});

test('should return empty object when requesting object that doesn\'t exists', async () => {
    let req = mockRequest();
    req.params.id = '5e61ff2eaaa2151899e83349';

    await FileCtrl.preview({req}, (output) => {
        expect(output).toBe({})
    })
});