import { getDb } from '../config/db.js';

const findReviewsByVehicle = async (vehicleId) => {
    const db = await getDb();
    return db.reviews
        .filter((r) => r.vehicle_id === Number(vehicleId))
        .map((r) => {
            const user = db.users.find((u) => u.id === r.user_id);
            return { ...r, user: user || null };
        })
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

const findReviewById = async (id) => {
    const db = await getDb();
    const review = db.reviews.find((r) => r.id === Number(id));
    if (!review) return null;
    
    const user = db.users.find((u) => u.id === review.user_id);
    const vehicle = db.vehicles.find((v) => v.id === review.vehicle_id);
    
    return {
        ...review,
        user: user || null,
        vehicle: vehicle ? {
            id: vehicle.id,
            year: vehicle.year,
            make: vehicle.make,
            model: vehicle.model
        } : null
    };
};

const findReviewsByUser = async (userId) => {
    const db = await getDb();
    return db.reviews
        .filter((r) => r.user_id === Number(userId))
        .map((r) => {
            const vehicle = db.vehicles.find((v) => v.id === r.vehicle_id);
            return {
                ...r,
                vehicle: vehicle ? {
                    id: vehicle.id,
                    year: vehicle.year,
                    make: vehicle.make,
                    model: vehicle.model
                } : null
            };
        })
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

const createReview = async ({ user_id, vehicle_id, rating, review_text }) => {
    const db = await getDb();

    if (!rating || rating < 1 || rating > 5) {
        throw new Error('Rating must be between 1 and 5.');
    }
    if (!review_text || review_text.trim().length === 0) {
        throw new Error('Review text cannot be empty.');
    }

    const review = {
        id: db.nextReviewId++,
        user_id: Number(user_id),
        vehicle_id: Number(vehicle_id),
        rating: Number(rating),
        review_text: review_text.trim(),
        created_at: new Date().toISOString()
    };
    db.reviews.push(review);
    return review;
};

const updateReview = async (id, { rating, review_text }) => {
    const db = await getDb();
    const review = db.reviews.find((r) => r.id === Number(id));
    
    if (!review) return null;

    if (!rating || rating < 1 || rating > 5) {
        throw new Error('Rating must be between 1 and 5.');
    }
    if (!review_text || review_text.trim().length === 0) {
        throw new Error('Review text cannot be empty.');
    }

    review.rating = Number(rating);
    review.review_text = review_text.trim();
    
    return review;
};

const deleteReview = async (id) => {
    const db = await getDb();
    const index = db.reviews.findIndex((r) => r.id === Number(id));
    if (index === -1) return false;
    db.reviews.splice(index, 1);
    return true;
};

export { findReviewsByVehicle, findReviewById, findReviewsByUser, createReview, updateReview, deleteReview };