import { findReviewsByVehicle, findReviewById, findReviewsByUser, createReview, updateReview, deleteReview } from '../models/review.model.js';
import { getDb, pool, useMemoryStorage } from '../config/db.js';
import { findVehicleById } from '../models/vehicle.model.js';

const showCreateReviewForm = async (req, res) => {
    res.redirect(`/inventory/${req.params.vehicleId}`);
};

const handleCreateReview = async (req, res) => {
    try {
        const { rating, review_text } = req.body;
        const vehicleId = req.params.vehicleId;

        // Check if vehicle exists
        const vehicle = await findVehicleById(vehicleId);
        if (!vehicle) {
            req.flash('error', 'Vehicle not found.');
            return res.redirect('/inventory');
        }

        await createReview({
            user_id: req.session.user.id,
            vehicle_id: vehicleId,
            rating,
            review_text
        });

        req.flash('success', 'Your review has been added successfully!');
        res.redirect(`/inventory/${vehicleId}`);
    } catch (error) {
        console.error('Error creating review:', error);
        req.flash('error', error.message || 'Unable to add review.');
        res.redirect(`/inventory/${req.params.vehicleId}`);
    }
};

const showMyReviews = async (req, res) => {
    try {
        const reviews = await findReviewsByUser(req.session.user.id);
        res.render('pages/customer/reviews', {
            title: 'My Reviews',
            reviews
        });
    } catch (error) {
        console.error('Error loading my reviews:', error);
        req.flash('error', 'Unable to load your reviews.');
        res.redirect('/dashboard');
    }
};

const showEditReviewForm = async (req, res) => {
    try {
        const review = await findReviewById(req.params.id);
        
        if (!review) {
            req.flash('error', 'Review not found.');
            return res.redirect('/my-reviews');
        }

        // Only allow the owner of the review to edit
        if (review.user_id !== req.session.user.id) {
            req.flash('error', 'You can only edit your own reviews.');
            return res.redirect('/my-reviews');
        }

        res.render('pages/customer/edit-review', {
            title: 'Edit Review',
            review
        });
    } catch (error) {
        console.error('Error loading edit review form:', error);
        req.flash('error', 'Unable to load review for editing.');
        res.redirect('/my-reviews');
    }
};

const handleUpdateReview = async (req, res) => {
    try {
        const { rating, review_text } = req.body;
        
        const review = await findReviewById(req.params.id);
        if (!review) {
            req.flash('error', 'Review not found.');
            return res.redirect('/my-reviews');
        }

        // Only allow the owner of the review to update
        if (review.user_id !== req.session.user.id) {
            req.flash('error', 'You can only edit your own reviews.');
            return res.redirect('/my-reviews');
        }

        await updateReview(req.params.id, { rating, review_text });

        req.flash('success', 'Your review has been updated successfully!');
        res.redirect('/my-reviews');
    } catch (error) {
        console.error('Error updating review:', error);
        req.flash('error', error.message || 'Unable to update review.');
        res.redirect(`/my-reviews/${req.params.id}/edit`);
    }
};

const handleDeleteMyReview = async (req, res) => {
    try {
        const review = await findReviewById(req.params.id);
        
        if (!review) {
            req.flash('error', 'Review not found.');
            return res.redirect('/my-reviews');
        }

        // Only allow the owner of the review to delete
        if (review.user_id !== req.session.user.id) {
            req.flash('error', 'You can only delete your own reviews.');
            return res.redirect('/my-reviews');
        }

        await deleteReview(req.params.id);

        req.flash('success', 'Your review has been deleted successfully!');
        res.redirect('/my-reviews');
    } catch (error) {
        console.error('Error deleting review:', error);
        req.flash('error', 'Unable to delete review.');
        res.redirect('/my-reviews');
    }
};

const handleDeleteReview = async (req, res) => {
    try {
        const deleted = await deleteReview(req.params.id);
        if (!deleted) {
            req.flash('error', 'Review not found.');
            return res.redirect('/admin/reviews');
        }

        req.flash('success', 'Review deleted successfully.');
        res.redirect('/admin/reviews');
    } catch (error) {
        console.error('Error deleting review:', error);
        req.flash('error', 'Unable to delete review.');
        res.redirect('/admin/reviews');
    }
};

const showAdminReviews = async (req, res) => {
    try {
        const db = await getDb();
        let reviews;
        
        if (useMemoryStorage) {
            reviews = db.reviews.map((r) => {
                const user = db.users.find((u) => u.id === r.user_id);
                const vehicle = db.vehicles.find((v) => v.id === r.vehicle_id);
                return {
                    ...r,
                    user: user || null,
                    vehicle: vehicle ? {
                        id: vehicle.id,
                        year: vehicle.year,
                        make: vehicle.make,
                        model: vehicle.model
                    } : null
                };
            }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } else {
            const result = await pool.query(
                `SELECT r.*, u.firstname, u.lastname, u.email,
                        v.vehicle_id, v.year, v.make, v.model
                 FROM reviews r
                 LEFT JOIN users u ON r.user_id = u.user_id
                 LEFT JOIN vehicles v ON r.vehicle_id = v.vehicle_id
                 ORDER BY r.created_at DESC`
            );
            reviews = result.rows.map((r) => ({
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
            }));
        }
        
        res.render('pages/admin/reviews', {
            title: 'Manage Reviews',
            reviews
        });
    } catch (error) {
        console.error('Error loading admin reviews:', error);
        req.flash('error', 'Unable to load reviews.');
        res.redirect('/dashboard');
    }
};

export { 
    showCreateReviewForm, 
    handleCreateReview, 
    showMyReviews,
    showEditReviewForm,
    handleUpdateReview,
    handleDeleteMyReview,
    handleDeleteReview,
    showAdminReviews
};