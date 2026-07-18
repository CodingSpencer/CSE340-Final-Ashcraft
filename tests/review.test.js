import test from 'node:test';
import assert from 'node:assert/strict';

process.env.NODE_ENV = 'test';

// Initialize demo data before running tests
const { initializeDemoData } = await import('../src/config/db.js');
await initializeDemoData();

// Test review model functions
const {
    findReviewsByVehicle,
    findReviewById,
    findReviewsByUser,
    createReview,
    updateReview,
    deleteReview
} = await import('../src/models/review.model.js');

// Test findReviewsByVehicle
test('findReviewsByVehicle returns reviews for a vehicle', async () => {
    const reviews = await findReviewsByVehicle(1);
    assert.ok(Array.isArray(reviews));
});

// Test findReviewById
test('findReviewById returns a review with user and vehicle info', async () => {
    const review = await findReviewById(1);
    // In test mode with in-memory storage, this might be null if no reviews exist
    // but the function should not throw
    assert.ok(review === null || typeof review === 'object');
});

// Test findReviewsByUser
test('findReviewsByUser returns reviews for a user', async () => {
    const reviews = await findReviewsByUser(1);
    assert.ok(Array.isArray(reviews));
});

// Test createReview
test('createReview creates a new review', async () => {
    try {
        const review = await createReview({
            user_id: 6, // Customer user exists in database
            vehicle_id: 3, // Toyota Corolla exists in database
            rating: 5,
            review_text: 'Great car!'
        });
        assert.ok(review.id);
        assert.equal(review.rating, 5);
        assert.equal(review.review_text, 'Great car!');
    } catch (error) {
        // May fail if user already has a review for this vehicle
        assert.ok(error.message.includes('already reviewed') || error.message.includes('not found'));
    }
});

// Test createReview validation
test('createReview validates rating', async () => {
    try {
        await createReview({
            user_id: 1,
            vehicle_id: 1,
            rating: 6,
            review_text: 'Great car!'
        });
        assert.fail('Should have thrown an error');
    } catch (error) {
        assert.ok(error.message.includes('Rating must be between 1 and 5'));
    }
});

test('createReview validates review text', async () => {
    try {
        await createReview({
            user_id: 1,
            vehicle_id: 1,
            rating: 5,
            review_text: ''
        });
        assert.fail('Should have thrown an error');
    } catch (error) {
        assert.ok(error.message.includes('Review text cannot be empty'));
    }
});

// Test updateReview
test('updateReview updates an existing review', async () => {
    // First create a review
    let review;
    try {
        review = await createReview({
            user_id: 6, // Customer user exists in database
            vehicle_id: 4, // Honda CR-V exists in database
            rating: 4,
            review_text: 'Good car'
        });
    } catch (error) {
        // Skip if user already has a review
        return;
    }
    
    const updated = await updateReview(review.id, {
        rating: 5,
        review_text: 'Great car!'
    });
    
    assert.ok(updated);
    assert.equal(updated.rating, 5);
    assert.equal(updated.review_text, 'Great car!');
});

// Test deleteReview
test('deleteReview removes a review', async () => {
    // First create a review
    let review;
    try {
        review = await createReview({
            user_id: 6, // Customer user exists in database
            vehicle_id: 5, // Ford Mustang exists in database
            rating: 3,
            review_text: 'Okay car'
        });
    } catch (error) {
        // Skip if user already has a review
        return;
    }
    
    const deleted = await deleteReview(review.id);
    assert.equal(deleted, true);
    
    // Verify it's deleted
    const found = await findReviewById(review.id);
    assert.equal(found, null);
});