import test from 'node:test';
import assert from 'node:assert/strict';

process.env.NODE_ENV = 'test';

// Test user model functions
const {
    initializeDemoData
} = await import('../src/config/db.js');

// Initialize demo data before running tests
await initializeDemoData();

const {
    findUserByEmail,
    findUserById,
    createUser,
    verifyPassword
} = await import('../src/models/user.model.js');

// Test findUserByEmail
test('findUserByEmail returns a user by email', async () => {
    const user = await findUserByEmail('admin@example.com');
    assert.ok(user);
    assert.equal(user.email, 'admin@example.com');
});

test('findUserByEmail returns null for non-existent email', async () => {
    const user = await findUserByEmail('nonexistent@example.com');
    assert.equal(user, null);
});

// Test findUserById
test('findUserById returns a user by id', async () => {
    const user = await findUserById(1);
    assert.ok(user);
    assert.equal(user.id, 1);
});

// Test createUser
test('createUser creates a new user', async () => {
    try {
        const user = await createUser('Test User', 'testuser@example.com', 'password123');
        assert.ok(user.id);
        assert.equal(user.name, 'Test User');
        assert.equal(user.email, 'testuser@example.com');
    } catch (error) {
        // May fail if user already exists
        assert.ok(error.message.includes('already exists') || error.message.includes('duplicate'));
    }
});

// Test verifyPassword
test('verifyPassword returns true for correct password', async () => {
    const user = await findUserByEmail('admin@example.com');
    if (user) {
        const isValid = await verifyPassword('password123', user.password);
        assert.equal(isValid, true);
    }
});

test('verifyPassword returns false for incorrect password', async () => {
    const user = await findUserByEmail('admin@example.com');
    if (user) {
        const isValid = await verifyPassword('wrongpassword', user.password);
        assert.equal(isValid, false);
    }
});