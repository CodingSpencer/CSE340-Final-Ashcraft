import { getDb, pool, useMemoryStorage } from '../config/db.js';

const findReviewsByVehicle = async (vehicleId) => {
    const db = await getDb();
    
    if (useMemoryStorage) {
        return db.reviews
            .filter((r) => r.vehicle_id === Number(vehicleId))
            .map((r) => {
                const user = db.users.find((u) => u.id === r.user_id);
                return { ...r, user: user || null };
            })
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    
    const result = await pool.query(
        `SELECT r.*, u.firstname, u.lastname, u.email
         FROM reviews r
         LEFT JOIN users u ON r.user_id = u.user_id
         WHERE r.vehicle_id = $1
         ORDER BY r.created_at DESC`,
        [vehicleId]
    );
    
    return result.rows.map((r) => ({
        ...r,
        user: r.firstname ? { id: r.user_id, name: r.firstname + ' ' + r.lastname, email: r.email } : null
    }));
};

const findReviewById = async (id) => {
    const db = await getDb();
    
    if (useMemoryStorage) {
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
    }
    
    const result = await pool.query(
        `SELECT r.*, u.firstname, u.lastname, u.email,
                v.vehicle_id, v.year, v.make, v.model
         FROM reviews r
         LEFT JOIN users u ON r.user_id = u.user_id
         LEFT JOIN vehicles v ON r.vehicle_id = v.vehicle_id
         WHERE r.review_id = $1`,
        [id]
    );
    
    if (result.rows.length === 0) return null;
    
    const r = result.rows[0];
    return {
        id: r.review_id,
        user_id: r.user_id,
        vehicle_id: r.vehicle_id,
        rating: r.rating,
        review_text: r.review_text,
        created_at: r.created_at,
        user: r.firstname ? { id: r.user_id, name: r.firstname + ' ' + r.lastname, email: r.email } : null,
        vehicle: r.vehicle_id ? {
            id: r.vehicle_id,
            year: r.year,
            make: r.make,
            model: r.model
        } : null
    };
};

const findReviewsByUser = async (userId) => {
    const db = await getDb();
    
    if (useMemoryStorage) {
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
    }
    
    const result = await pool.query(
        `SELECT r.*, v.vehicle_id, v.year, v.make, v.model
         FROM reviews r
         LEFT JOIN vehicles v ON r.vehicle_id = v.vehicle_id
         WHERE r.user_id = $1
         ORDER BY r.created_at DESC`,
        [userId]
    );
    
    return result.rows.map((r) => ({
        id: r.review_id,
        user_id: r.user_id,
        vehicle_id: r.vehicle_id,
        rating: r.rating,
        review_text: r.review_text,
        created_at: r.created_at,
        vehicle: r.vehicle_id ? {
            id: r.vehicle_id,
            year: r.year,
            make: r.make,
            model: r.model
        } : null
    }));
};

const findReviewByUserAndVehicle = async (userId, vehicleId) => {
    const db = await getDb();
    
    if (useMemoryStorage) {
        return db.reviews.find((r) => r.user_id === Number(userId) && r.vehicle_id === Number(vehicleId)) || null;
    }
    
    const result = await pool.query(
        'SELECT * FROM reviews WHERE user_id = $1 AND vehicle_id = $2',
        [userId, vehicleId]
    );
    return result.rows[0] || null;
};

const createReview = async ({ user_id, vehicle_id, rating, review_text }) => {
    const db = await getDb();

    if (!rating || rating < 1 || rating > 5) {
        throw new Error('Rating must be between 1 and 5.');
    }
    if (!review_text || review_text.trim().length === 0) {
        throw new Error('Review text cannot be empty.');
    }

    if (useMemoryStorage) {
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
    }

    // Check if user already has a review for this vehicle
    const existingReview = await findReviewByUserAndVehicle(user_id, vehicle_id);
    if (existingReview) {
        throw new Error("You have already reviewed this vehicle. You can edit your existing review instead.");
    }

    const result = await pool.query(
        `INSERT INTO reviews (user_id, vehicle_id, rating, review_text, created_at)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [user_id, vehicle_id, rating, review_text.trim(), new Date().toISOString()]
    );
    
    return {
        id: result.rows[0].review_id,
        user_id: result.rows[0].user_id,
        vehicle_id: result.rows[0].vehicle_id,
        rating: result.rows[0].rating,
        review_text: result.rows[0].review_text,
        created_at: result.rows[0].created_at
    };
};

const updateReview = async (id, { rating, review_text }) => {
    const db = await getDb();
    
    if (useMemoryStorage) {
        const review = db.reviews.find((r) => r.id === Number(id));
        if (!review) return null;

        review.rating = Number(rating);
        review.review_text = review_text.trim();
        
        return review;
    }

    const result = await pool.query(
        `UPDATE reviews
         SET rating = $1, review_text = $2
         WHERE review_id = $3
         RETURNING *`,
        [rating, review_text.trim(), id]
    );
    
    return result.rows.length > 0 ? result.rows[0] : null;
};

const deleteReview = async (id) => {
    const db = await getDb();
    
    if (useMemoryStorage) {
        const index = db.reviews.findIndex((r) => r.id === Number(id));
        if (index === -1) return false;
        db.reviews.splice(index, 1);
        return true;
    }

    const result = await pool.query(
        'DELETE FROM reviews WHERE review_id = $1',
        [id]
    );
    
    return result.rowCount > 0;
};

export { findReviewsByVehicle, findReviewById, findReviewsByUser, createReview, updateReview, deleteReview };