const db = require('./db');

test('is there a mongo connection?', () => {
    expect(db.readyState).toBeGreaterThan(0);
});