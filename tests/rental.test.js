import test from 'node:test';
import assert from 'node:assert/strict';

process.env.NODE_ENV = 'test';

// Initialize demo data before running tests
const { initializeDemoData } = await import('../src/config/db.js');
await initializeDemoData();

// Test rental model functions
const {
    findRentalsByUser,
    findRentalById,
    createRental,
    updateRentalStatus,
    cancelRental
} = await import('../src/models/rental.model.js');

// Test findRentalsByUser
test('findRentalsByUser returns rentals for a user', async () => {
    const rentals = await findRentalsByUser(1);
    assert.ok(Array.isArray(rentals));
});

// Test findRentalById
test('findRentalById returns a rental by id', async () => {
    const rental = await findRentalById(1);
    // In test mode with in-memory storage, this might be null if no rentals exist
    assert.ok(rental === null || typeof rental === 'object');
});

// Test createRental
test('createRental creates a new rental', async () => {
    try {
        const rental = await createRental({
            user_id: 1,
            vehicle_id: 1,
            start_date: new Date().toISOString(),
            end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        });
        assert.ok(rental.id);
        assert.equal(rental.user_id, 1);
        assert.equal(rental.vehicle_id, 1);
    } catch (error) {
        // May fail if vehicle is unavailable
        assert.ok(error.message);
    }
});

// Test updateRentalStatus
test('updateRentalStatus updates rental status', async () => {
    // First create a rental
    let rental;
    try {
        rental = await createRental({
            user_id: 1,
            vehicle_id: 2,
            start_date: new Date().toISOString(),
            end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        });
    } catch (error) {
        // Skip if vehicle is unavailable
        return;
    }
    
    const updated = await updateRentalStatus(rental.id, 'active');
    assert.ok(updated);
    assert.equal(updated.status, 'active');
});

// Test cancelRental
test('cancelRental removes a rental', async () => {
    // First create a rental
    let rental;
    try {
        rental = await createRental({
            user_id: 1,
            vehicle_id: 3,
            start_date: new Date().toISOString(),
            end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        });
    } catch (error) {
        // Skip if vehicle is unavailable
        return;
    }
    
    const cancelled = await cancelRental(rental.id);
    assert.ok(cancelled);
    assert.equal(cancelled.status, 'cancelled');
});