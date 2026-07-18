import { findReviewsByVehicle, findReviewById, findReviewsByUser, createReview, updateReview, deleteReview } from '../models/review.model.js';
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
            return res.redirect('back');
        }

        req.flash('success', 'Review deleted successfully.');
        res.redirect('back');
    } catch (error) {
        console.error('Error deleting review:', error);
        req.flash('error', 'Unable to delete review.');
        res.redirect('back');
    }
};

export { 
    showCreateReviewForm, 
    handleCreateReview, 
    showMyReviews,
    showEditReviewForm,
    handleUpdateReview,
    handleDeleteMyReview,
    handleDeleteReview 
};