const io = require('./io');

test('can socket.io be initialized?', () => {
    expect(io.initialize()._serveClient).toBeTruthy();
});