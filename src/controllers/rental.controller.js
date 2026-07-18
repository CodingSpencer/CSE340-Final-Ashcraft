import {
    createRental,
    findAllRentals,
    findRentalsByUser,
    findRentalById,
    updateRentalStatus,
    cancelRental
} from '../models/rental.model.js';
import { findVehicleById } from '../models/vehicle.model.js';

const showRentalForm = async (req, res) => {
    try {
        const vehicle = await findVehicleById(req.params.id);
        if (!vehicle) {
            req.flash('error', 'Vehicle not found.');
            return res.redirect('/inventory');
        }
        res.render('pages/inventory/detail', {
            title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
            vehicle,
            showRentalForm: true
        });
    } catch (error) {
        console.error('Error showing rental form:', error);
        req.flash('error', 'Unable to load rental form.');
        res.redirect('/inventory');
    }
};

const handleCreateRental = async (req, res) => {
    try {
        const vehicle = await findVehicleById(req.params.id);
        if (!vehicle) {
            req.flash('error', 'Vehicle not found.');
            return res.redirect('/inventory');
        }

        const { start_date, end_date } = req.body;
        if (!start_date || !end_date) {
            req.flash('error', 'Please provide both start and end dates.');
            return res.redirect(`/inventory/${req.params.id}/rent`);
        }

        if (new Date(end_date) <= new Date(start_date)) {
            req.flash('error', 'End date must be after start date.');
            return res.redirect(`/inventory/${req.params.id}/rent`);
        }

        await createRental({
            user_id: req.session.user.id,
            vehicle_id: req.params.id,
            start_date,
            end_date
        });

        req.flash('success', 'Rental request submitted successfully!');
        res.redirect('/my-rentals');
    } catch (error) {
        console.error('Error creating rental:', error);
        // Check if it's a date overlap error
        if (error.message && error.message.includes('already rented')) {
            req.flash('error', error.message);
        } else {
            req.flash('error', 'Unable to create rental.');
        }
        res.redirect(`/inventory/${req.params.id}`);
    }
};

const showMyRentals = async (req, res) => {
    try {
        const rentals = await findRentalsByUser(req.session.user.id);
        res.render('pages/customer/rentals', {
            title: 'My Rentals',
            rentals
        });
    } catch (error) {
        console.error('Error loading my rentals:', error);
        req.flash('error', 'Unable to load your rentals.');
        res.redirect('/dashboard');
    }
};

const showAllRentals = async (req, res) => {
    try {
        const rentals = await findAllRentals();
        res.render('pages/admin/rentals', {
            title: 'Manage Rentals',
            rentals
        });
    } catch (error) {
        console.error('Error loading all rentals:', error);
        req.flash('error', 'Unable to load rentals.');
        res.redirect('/dashboard');
    }
};

const handleUpdateRentalStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'active', 'completed', 'cancelled'];

        if (!validStatuses.includes(status)) {
            req.flash('error', 'Invalid status value.');
            return res.redirect('/admin/rentals');
        }

        const rental = await updateRentalStatus(req.params.id, status);
        if (!rental) {
            req.flash('error', 'Rental not found.');
            return res.redirect('/admin/rentals');
        }

        req.flash('success', `Rental status updated to "${status}".`);
        res.redirect('/admin/rentals');
    } catch (error) {
        console.error('Error updating rental status:', error);
        req.flash('error', 'Unable to update rental status.');
        res.redirect('/admin/rentals');
    }
};

const handleCancelMyRental = async (req, res) => {
    try {
        const rental = await findRentalById(req.params.id);
        if (!rental) {
            req.flash('error', 'Rental not found.');
            return res.redirect('/my-rentals');
        }

        // Only allow the owner of the rental to cancel
        if (rental.user_id !== req.session.user.id) {
            req.flash('error', 'You can only cancel your own rentals.');
            return res.redirect('/my-rentals');
        }

        // Only allow cancelling pending rentals
        if (rental.status !== 'pending') {
            req.flash('error', 'You can only cancel pending rentals.');
            return res.redirect('/my-rentals');
        }

        await cancelRental(req.params.id);
        req.flash('success', 'Rental cancelled successfully.');
        res.redirect('/my-rentals');
    } catch (error) {
        console.error('Error cancelling rental:', error);
        req.flash('error', 'Unable to cancel rental.');
        res.redirect('/my-rentals');
    }
};

export {
    showRentalForm,
    handleCreateRental,
    showMyRentals,
    showAllRentals,
    handleUpdateRentalStatus,
    handleCancelMyRental
};